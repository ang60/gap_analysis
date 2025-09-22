import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';
import { Risk, RiskStatus } from '@prisma/client';

@Injectable()
export class RisksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRiskDto): Promise<Risk> {
    return this.prisma.risk.create({
      data,
      include: {
        owner: true,
        branch: true,
      },
    });
  }

  async findAll(): Promise<Risk[]> {
    return this.prisma.risk.findMany({
      include: {
        owner: true,
        branch: true,
      },
    });
  }

  async findById(id: number): Promise<Risk> {
    const risk = await this.prisma.risk.findUnique({
      where: { id },
      include: {
        owner: true,
        branch: true,
      },
    });

    if (!risk) {
      throw new NotFoundException('Risk not found');
    }

    return risk;
  }

  async findByBranch(branchId: number): Promise<Risk[]> {
    return this.prisma.risk.findMany({
      where: { branchId },
      include: {
        owner: true,
        branch: true,
      },
    });
  }

  async findByOwner(ownerId: number): Promise<Risk[]> {
    return this.prisma.risk.findMany({
      where: { ownerId },
      include: {
        owner: true,
        branch: true,
      },
    });
  }

  async findByStatus(status: RiskStatus): Promise<Risk[]> {
    return this.prisma.risk.findMany({
      where: { status },
      include: {
        owner: true,
        branch: true,
      },
    });
  }

  async getHighRiskRisks(): Promise<Risk[]> {
    return this.prisma.risk.findMany({
      where: {
        OR: [
          {
            likelihood: { gte: 4 },
            impact: { gte: 4 },
          },
          {
            AND: [
              { likelihood: { gte: 3 } },
              { impact: { gte: 3 } },
            ],
          },
        ],
        status: RiskStatus.ACTIVE,
      },
      include: {
        owner: true,
        branch: true,
      },
      orderBy: [
        { likelihood: 'desc' },
        { impact: 'desc' },
      ],
    });
  }

  async getRiskStatistics() {
    const total = await this.prisma.risk.count();
    const active = await this.prisma.risk.count({
      where: { status: RiskStatus.ACTIVE },
    });
    const mitigated = await this.prisma.risk.count({
      where: { status: RiskStatus.MITIGATED },
    });
    const closed = await this.prisma.risk.count({
      where: { status: RiskStatus.CLOSED },
    });

    const highRisk = await this.prisma.risk.count({
      where: {
        OR: [
          {
            likelihood: { gte: 4 },
            impact: { gte: 4 },
          },
          {
            AND: [
              { likelihood: { gte: 3 } },
              { impact: { gte: 3 } },
            ],
          },
        ],
        status: RiskStatus.ACTIVE,
      },
    });

    return {
      total,
      active,
      mitigated,
      closed,
      highRisk,
      highRiskPercentage: total > 0 ? Math.round((highRisk / total) * 100) : 0,
    };
  }

  async update(id: number, data: UpdateRiskDto): Promise<Risk> {
    return this.prisma.risk.update({
      where: { id },
      data,
      include: {
        owner: true,
        branch: true,
      },
    });
  }

  async delete(id: number): Promise<Risk> {
    return this.prisma.risk.delete({
      where: { id },
    });
  }
}
