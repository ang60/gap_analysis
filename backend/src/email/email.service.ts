import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, message: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.configService.get('SMTP_FROM'),
        to,
        subject,
        html: message,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${to}: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      return false;
    }
  }

  async sendTestEmail(to: string): Promise<boolean> {
    const subject = 'Test Email - Gap Analysis System';
    const message = `
      <h2>Test Email from Gap Analysis System</h2>
      <p>This is a test email to verify that the email service is working correctly.</p>
      <p>If you received this email, the email configuration is successful.</p>
      <hr>
      <p><small>Gap Analysis System - Kenyan Banking Compliance Platform</small></p>
    `;

    return this.sendEmail(to, subject, message);
  }

  async sendGapAssessmentNotification(
    to: string,
    gapAssessment: any,
    branchName: string
  ): Promise<boolean> {
    const subject = `New Gap Assessment - ${branchName}`;
    const message = `
      <h2>New Gap Assessment Identified</h2>
      <p><strong>Branch:</strong> ${branchName}</p>
      <p><strong>Requirement:</strong> ${gapAssessment.requirement.clause}</p>
      <p><strong>Status:</strong> ${this.getStatusText(gapAssessment.status)}</p>
      <p><strong>Description:</strong> ${gapAssessment.description}</p>
      <p><strong>Risk Score:</strong> ${gapAssessment.riskScore}/3</p>
      <p><strong>Created:</strong> ${new Date(gapAssessment.createdAt).toLocaleDateString()}</p>
      <hr>
      <p>Please review and take appropriate action.</p>
      <p><small>Gap Analysis System</small></p>
    `;

    return this.sendEmail(to, subject, message);
  }

  async sendActionPlanNotification(
    to: string,
    actionPlan: any,
    branchName: string
  ): Promise<boolean> {
    const subject = `New Action Plan Assigned - ${branchName}`;
    const message = `
      <h2>New Action Plan Assigned</h2>
      <p><strong>Branch:</strong> ${branchName}</p>
      <p><strong>Action:</strong> ${actionPlan.actionText}</p>
      <p><strong>Priority:</strong> ${actionPlan.priority}</p>
      <p><strong>Deadline:</strong> ${actionPlan.deadline ? new Date(actionPlan.deadline).toLocaleDateString() : 'No deadline set'}</p>
      <p><strong>Gap Assessment:</strong> ${actionPlan.gap.requirement.clause}</p>
      <hr>
      <p>Please complete this action plan by the specified deadline.</p>
      <p><small>Gap Analysis System</small></p>
    `;

    return this.sendEmail(to, subject, message);
  }

  async sendScheduleReminder(
    to: string,
    schedule: any,
    branchName: string,
    daysUntilDue: number
  ): Promise<boolean> {
    const subject = `Schedule Reminder - ${schedule.title}`;
    const message = `
      <h2>Schedule Reminder</h2>
      <p><strong>Branch:</strong> ${branchName}</p>
      <p><strong>Schedule:</strong> ${schedule.title}</p>
      <p><strong>Description:</strong> ${schedule.description}</p>
      <p><strong>Due Date:</strong> ${new Date(schedule.dueDate).toLocaleDateString()}</p>
      <p><strong>Days Until Due:</strong> ${daysUntilDue}</p>
      <p><strong>Priority:</strong> ${schedule.priority}</p>
      <hr>
      <p>Please ensure this schedule is completed on time.</p>
      <p><small>Gap Analysis System</small></p>
    `;

    return this.sendEmail(to, subject, message);
  }

  async sendOverdueNotification(
    to: string,
    item: any,
    itemType: string,
    branchName: string
  ): Promise<boolean> {
    const subject = `Overdue ${itemType} - ${branchName}`;
    const message = `
      <h2>Overdue ${itemType}</h2>
      <p><strong>Branch:</strong> ${branchName}</p>
      <p><strong>Item:</strong> ${item.title || item.actionText || item.description}</p>
      <p><strong>Due Date:</strong> ${new Date(item.deadline || item.dueDate).toLocaleDateString()}</p>
      <p><strong>Priority:</strong> ${item.priority}</p>
      <hr>
      <p style="color: red;"><strong>This item is overdue and requires immediate attention.</strong></p>
      <p><small>Gap Analysis System</small></p>
    `;

    return this.sendEmail(to, subject, message);
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('Email service connection failed:', error);
      return false;
    }
  }

  private getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Not Implemented';
      case 1:
        return 'Partially Implemented';
      case 2:
        return 'Mostly Implemented';
      case 3:
        return 'Fully Implemented';
      default:
        return 'Unknown';
    }
  }
}
