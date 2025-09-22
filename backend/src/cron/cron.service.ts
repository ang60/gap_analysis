import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ScheduleStatus } from '@prisma/client';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly notificationService: NotificationsService,
  ) {}

  // Daily at 9:00 AM - Check for overdue schedules
  @Cron('0 9 * * *')
  async checkOverdueSchedules() {
    this.logger.log('Checking for overdue schedules...');
    
    const now = new Date();
    const overdueSchedules = await this.prisma.schedule.findMany({
      where: {
        dueDate: {
          lt: now,
        },
        status: {
          not: ScheduleStatus.COMPLETED,
        },
      },
      include: {
        branch: true,
        responsible: true,
      },
    });

    for (const schedule of overdueSchedules) {
      // Update status to overdue
      await this.prisma.schedule.update({
        where: { id: schedule.id },
        data: { status: ScheduleStatus.OVERDUE },
      });

      // Send notification
      await this.notificationService.create({
        message: `Schedule "${schedule.title}" is overdue`,
        userId: schedule.responsibleId,
      });

      // Send email notification
      await this.emailService.sendOverdueNotification(
        schedule.responsible.email,
        schedule,
        'Schedule',
        schedule.branch.name
      );
    }

    this.logger.log(`Found and processed ${overdueSchedules.length} overdue schedules`);
  }

  // Daily at 8:00 AM - Send reminders for schedules due tomorrow
  @Cron('0 8 * * *')
  async sendTomorrowReminders() {
    this.logger.log('Sending tomorrow reminders...');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const schedulesDueTomorrow = await this.prisma.schedule.findMany({
      where: {
        dueDate: {
          gte: tomorrow,
          lt: dayAfterTomorrow,
        },
        status: {
          not: ScheduleStatus.COMPLETED,
        },
      },
      include: {
        branch: true,
        responsible: true,
      },
    });

    for (const schedule of schedulesDueTomorrow) {
      // Send notification
      await this.notificationService.create({
        message: `Schedule "${schedule.title}" is due tomorrow`,
        userId: schedule.responsibleId,
      });

      // Send email reminder
      await this.emailService.sendScheduleReminder(
        schedule.responsible.email,
        schedule,
        schedule.branch.name,
        1
      );
    }

    this.logger.log(`Sent reminders for ${schedulesDueTomorrow.length} schedules due tomorrow`);
  }

  // Weekly on Monday at 9:00 AM - Send weekly summary to branch managers
  @Cron('0 9 * * 1')
  async sendWeeklySummary() {
    this.logger.log('Sending weekly summaries...');
    
    const managers = await this.prisma.user.findMany({
      where: {
        role: 'MANAGER',
      },
      include: {
        branch: true,
        managedBranches: true,
      },
    });

    for (const manager of managers) {
      const branchIds = manager.managedBranches.map(branch => branch.id);
      
      // Get upcoming schedules for the week
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      
      const upcomingSchedules = await this.prisma.schedule.findMany({
        where: {
          branchId: {
            in: branchIds,
          },
          dueDate: {
            lte: weekFromNow,
          },
          status: {
            not: ScheduleStatus.COMPLETED,
          },
        },
        include: {
          branch: true,
          responsible: true,
        },
      });

      // Get overdue schedules
      const overdueSchedules = await this.prisma.schedule.findMany({
        where: {
          branchId: {
            in: branchIds,
          },
          dueDate: {
            lt: new Date(),
          },
          status: {
            not: ScheduleStatus.COMPLETED,
          },
        },
        include: {
          branch: true,
          responsible: true,
        },
      });

      if (upcomingSchedules.length > 0 || overdueSchedules.length > 0) {
        const subject = 'Weekly Schedule Summary';
        const message = `
          <h2>Weekly Schedule Summary</h2>
          <p>Dear ${manager.firstName} ${manager.lastName},</p>
          
          <h3>Upcoming Schedules (Next 7 Days)</h3>
          ${upcomingSchedules.length > 0 ? upcomingSchedules.map(schedule => 
            `<p><strong>${schedule.title}</strong> - ${schedule.branch.name} - Due: ${new Date(schedule.dueDate).toLocaleDateString()}</p>`
          ).join('') : '<p>No upcoming schedules</p>'}
          
          <h3>Overdue Schedules</h3>
          ${overdueSchedules.length > 0 ? overdueSchedules.map(schedule => 
            `<p style="color: red;"><strong>${schedule.title}</strong> - ${schedule.branch.name} - Due: ${new Date(schedule.dueDate).toLocaleDateString()}</p>`
          ).join('') : '<p>No overdue schedules</p>'}
          
          <hr>
          <p><small>Gap Analysis System</small></p>
        `;

        await this.emailService.sendEmail(manager.email, subject, message);
      }
    }

    this.logger.log(`Sent weekly summaries to ${managers.length} managers`);
  }

  // Monthly on the 1st at midnight - Generate monthly compliance reports
  @Cron('0 0 1 * *')
  async generateMonthlyReports() {
    this.logger.log('Generating monthly compliance reports...');
    
    const managers = await this.prisma.user.findMany({
      where: {
        role: 'MANAGER',
      },
      include: {
        branch: true,
        managedBranches: true,
      },
    });

    for (const manager of managers) {
      const branchIds = manager.managedBranches.map(branch => branch.id);
      
      // Get statistics for the month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      const completedSchedules = await this.prisma.schedule.count({
        where: {
          branchId: {
            in: branchIds,
          },
          lastCompleted: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      });

      const totalSchedules = await this.prisma.schedule.count({
        where: {
          branchId: {
            in: branchIds,
          },
        },
      });

      const overdueSchedules = await this.prisma.schedule.count({
        where: {
          branchId: {
            in: branchIds,
          },
          dueDate: {
            lt: new Date(),
          },
          status: {
            not: ScheduleStatus.COMPLETED,
          },
        },
      });

      const subject = 'Monthly Compliance Report';
      const message = `
        <h2>Monthly Compliance Report</h2>
        <p>Dear ${manager.firstName} ${manager.lastName},</p>
        
        <h3>Schedule Statistics</h3>
        <p><strong>Total Schedules:</strong> ${totalSchedules}</p>
        <p><strong>Completed This Month:</strong> ${completedSchedules}</p>
        <p><strong>Overdue Schedules:</strong> ${overdueSchedules}</p>
        <p><strong>Completion Rate:</strong> ${totalSchedules > 0 ? Math.round((completedSchedules / totalSchedules) * 100) : 0}%</p>
        
        <h3>Recommendations</h3>
        ${overdueSchedules > 0 ? '<p style="color: red;">⚠️ Please address overdue schedules immediately</p>' : ''}
        <p>Continue monitoring compliance activities and ensure all schedules are completed on time.</p>
        
        <hr>
        <p><small>Gap Analysis System - Monthly Report</small></p>
      `;

      await this.emailService.sendEmail(manager.email, subject, message);
    }

    this.logger.log(`Generated monthly reports for ${managers.length} managers`);
  }
}
