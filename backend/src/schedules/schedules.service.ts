import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CompleteScheduleDto } from './dto/complete-schedule.dto';
import { Schedule, ScheduleType, ScheduleStatus, ScheduleFrequency, Priority } from '@prisma/client';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateScheduleDto, createdById: number): Promise<Schedule> {
    const dueDate = new Date(data.dueDate);
    let nextDueDate: Date | null = null;

    if (data.isRecurring && data.frequency) {
      nextDueDate = this.calculateNextDueDate(dueDate, data.frequency, data.customInterval);
    }

    return this.prisma.schedule.create({
      data: {
        ...data,
        dueDate,
        nextDueDate,
        createdById,
      },
      include: {
        branch: true,
        responsible: true,
        createdBy: true,
      },
    });
  }

  async createRecurring(data: CreateScheduleDto, createdById: number): Promise<Schedule> {
    return this.create({ ...data, isRecurring: true }, createdById);
  }

  async findAll(): Promise<Schedule[]> {
    return this.prisma.schedule.findMany({
      include: {
        branch: true,
        responsible: true,
        createdBy: true,
      },
    });
  }

  async findById(id: number): Promise<Schedule> {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        branch: true,
        responsible: true,
        createdBy: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    return schedule;
  }

  async findByBranch(branchId: number): Promise<Schedule[]> {
    return this.prisma.schedule.findMany({
      where: { branchId },
      include: {
        branch: true,
        responsible: true,
        createdBy: true,
      },
    });
  }

  async findByType(type: ScheduleType): Promise<Schedule[]> {
    return this.prisma.schedule.findMany({
      where: { type },
      include: {
        branch: true,
        responsible: true,
        createdBy: true,
      },
    });
  }

  async findByStatus(status: ScheduleStatus): Promise<Schedule[]> {
    return this.prisma.schedule.findMany({
      where: { status },
      include: {
        branch: true,
        responsible: true,
        createdBy: true,
      },
    });
  }

  async getUpcomingSchedules(branchId: number, days: number = 30): Promise<Schedule[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    return this.prisma.schedule.findMany({
      where: {
        branchId,
        dueDate: {
          gte: now,
          lte: futureDate,
        },
        status: {
          not: ScheduleStatus.COMPLETED,
        },
      },
      include: {
        branch: true,
        responsible: true,
        createdBy: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async getOverdueSchedules(): Promise<Schedule[]> {
    const now = new Date();
    return this.prisma.schedule.findMany({
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
        createdBy: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async getStatistics() {
    const total = await this.prisma.schedule.count();
    const pending = await this.prisma.schedule.count({
      where: { status: ScheduleStatus.PENDING },
    });
    const inProgress = await this.prisma.schedule.count({
      where: { status: ScheduleStatus.IN_PROGRESS },
    });
    const completed = await this.prisma.schedule.count({
      where: { status: ScheduleStatus.COMPLETED },
    });
    const overdue = await this.prisma.schedule.count({
      where: {
        dueDate: {
          lt: new Date(),
        },
        status: {
          not: ScheduleStatus.COMPLETED,
        },
      },
    });

    const dueThisWeek = await this.prisma.schedule.count({
      where: {
        dueDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        status: {
          not: ScheduleStatus.COMPLETED,
        },
      },
    });

    const dueThisMonth = await this.prisma.schedule.count({
      where: {
        dueDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        status: {
          not: ScheduleStatus.COMPLETED,
        },
      },
    });

    return {
      total,
      pending,
      inProgress,
      completed,
      overdue,
      dueThisWeek,
      dueThisMonth,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  async complete(id: number, data: CompleteScheduleDto): Promise<Schedule> {
    const schedule = await this.findById(id);
    const now = new Date();
    
    let nextDueDate: Date | null = null;
    if (schedule.isRecurring) {
      nextDueDate = data.nextDueDate 
        ? new Date(data.nextDueDate)
        : this.calculateNextDueDate(schedule.dueDate, schedule.frequency, schedule.customInterval || undefined);
    }

    return this.prisma.schedule.update({
      where: { id },
      data: {
        status: ScheduleStatus.COMPLETED,
        completionNotes: data.completionNotes,
        lastCompleted: now,
        nextDueDate,
      },
      include: {
        branch: true,
        responsible: true,
        createdBy: true,
      },
    });
  }

  async update(id: number, data: UpdateScheduleDto): Promise<Schedule> {
    const updateData: any = { ...data };
    
    if (data.dueDate) {
      updateData.dueDate = new Date(data.dueDate);
    }

    return this.prisma.schedule.update({
      where: { id },
      data: updateData,
      include: {
        branch: true,
        responsible: true,
        createdBy: true,
      },
    });
  }

  async delete(id: number): Promise<Schedule> {
    return this.prisma.schedule.delete({
      where: { id },
    });
  }

  private calculateNextDueDate(currentDate: Date, frequency: ScheduleFrequency, customInterval?: number): Date {
    const nextDate = new Date(currentDate);

    switch (frequency) {
      case ScheduleFrequency.DAILY:
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case ScheduleFrequency.WEEKLY:
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case ScheduleFrequency.MONTHLY:
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case ScheduleFrequency.QUARTERLY:
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case ScheduleFrequency.SEMI_ANNUAL:
        nextDate.setMonth(nextDate.getMonth() + 6);
        break;
      case ScheduleFrequency.ANNUAL:
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      case ScheduleFrequency.CUSTOM:
        if (customInterval) {
          nextDate.setDate(nextDate.getDate() + customInterval);
        }
        break;
    }

    return nextDate;
  }
}
