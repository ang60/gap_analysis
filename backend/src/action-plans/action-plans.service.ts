import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActionPlanDto } from './dto/create-action-plan.dto';
import { UpdateActionPlanDto } from './dto/update-action-plan.dto';
import { CompleteActionPlanDto } from './dto/complete-action-plan.dto';
import { ActionPlan, ActionStatus, ActionPriority } from '@prisma/client';

@Injectable()
export class ActionPlansService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: number, data: CreateActionPlanDto, createdById: number): Promise<ActionPlan> {
    return this.prisma.actionPlan.create({
      data: {
        organizationId,
        ...data,
        createdById,
        deadline: data.deadline ? new Date(data.deadline) : null,
      },
      include: {
        gap: {
          include: {
            requirement: true,
            branch: true,
          },
        },
        responsible: true,
        createdBy: true,
      },
    });
  }

  async findAll(): Promise<ActionPlan[]> {
    return this.prisma.actionPlan.findMany({
      include: {
        gap: {
          include: {
            requirement: true,
            branch: true,
          },
        },
        responsible: true,
        createdBy: true,
      },
    });
  }

  async findById(id: number): Promise<ActionPlan> {
    const actionPlan = await this.prisma.actionPlan.findUnique({
      where: { id },
      include: {
        gap: {
          include: {
            requirement: true,
            branch: true,
          },
        },
        responsible: true,
        createdBy: true,
      },
    });

    if (!actionPlan) {
      throw new NotFoundException('Action plan not found');
    }

    return actionPlan;
  }

  async findByGap(gapId: number): Promise<ActionPlan[]> {
    return this.prisma.actionPlan.findMany({
      where: { gapId },
      include: {
        gap: {
          include: {
            requirement: true,
            branch: true,
          },
        },
        responsible: true,
        createdBy: true,
      },
    });
  }

  async findByResponsible(responsibleId: number): Promise<ActionPlan[]> {
    return this.prisma.actionPlan.findMany({
      where: { responsibleId },
      include: {
        gap: {
          include: {
            requirement: true,
            branch: true,
          },
        },
        responsible: true,
        createdBy: true,
      },
    });
  }

  async findByStatus(status: ActionStatus): Promise<ActionPlan[]> {
    return this.prisma.actionPlan.findMany({
      where: { status },
      include: {
        gap: {
          include: {
            requirement: true,
            branch: true,
          },
        },
        responsible: true,
        createdBy: true,
      },
    });
  }

  async findByPriority(priority: ActionPriority): Promise<ActionPlan[]> {
    return this.prisma.actionPlan.findMany({
      where: { priority },
      include: {
        gap: {
          include: {
            requirement: true,
            branch: true,
          },
        },
        responsible: true,
        createdBy: true,
      },
    });
  }

  async getOverdueActions(): Promise<ActionPlan[]> {
    const now = new Date();
    return this.prisma.actionPlan.findMany({
      where: {
        deadline: {
          lt: now,
        },
        status: {
          not: ActionStatus.COMPLETED,
        },
      },
      include: {
        gap: {
          include: {
            requirement: true,
            branch: true,
          },
        },
        responsible: true,
        createdBy: true,
      },
    });
  }

  async getUpcomingActions(days: number = 7): Promise<ActionPlan[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    return this.prisma.actionPlan.findMany({
      where: {
        deadline: {
          gte: now,
          lte: futureDate,
        },
        status: {
          not: ActionStatus.COMPLETED,
        },
      },
      include: {
        gap: {
          include: {
            requirement: true,
            branch: true,
          },
        },
        responsible: true,
        createdBy: true,
      },
    });
  }

  async getStatistics() {
    const total = await this.prisma.actionPlan.count();
    const completed = await this.prisma.actionPlan.count({
      where: { status: ActionStatus.COMPLETED },
    });
    const pending = await this.prisma.actionPlan.count({
      where: { status: ActionStatus.PENDING },
    });
    const inProgress = await this.prisma.actionPlan.count({
      where: { status: ActionStatus.IN_PROGRESS },
    });
    const overdue = await this.prisma.actionPlan.count({
      where: {
        deadline: {
          lt: new Date(),
        },
        status: {
          not: ActionStatus.COMPLETED,
        },
      },
    });

    return {
      total,
      completed,
      pending,
      inProgress,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  async complete(id: number, data: CompleteActionPlanDto): Promise<ActionPlan> {
    return this.prisma.actionPlan.update({
      where: { id },
      data: {
        status: ActionStatus.COMPLETED,
        completionNotes: data.completionNotes,
        completedAt: data.completedAt ? new Date(data.completedAt) : new Date(),
      },
      include: {
        gap: {
          include: {
            requirement: true,
            branch: true,
          },
        },
        responsible: true,
        createdBy: true,
      },
    });
  }

  async update(id: number, data: UpdateActionPlanDto): Promise<ActionPlan> {
    const updateData: any = { ...data };
    
    if (data.deadline) {
      updateData.deadline = new Date(data.deadline);
    }

    return this.prisma.actionPlan.update({
      where: { id },
      data: updateData,
      include: {
        gap: {
          include: {
            requirement: true,
            branch: true,
          },
        },
        responsible: true,
        createdBy: true,
      },
    });
  }

  async delete(id: number): Promise<ActionPlan> {
    return this.prisma.actionPlan.delete({
      where: { id },
    });
  }
}
