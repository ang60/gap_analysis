import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGapAssessmentDto } from './dto/create-gap-assessment.dto';
import { UpdateGapAssessmentDto } from './dto/update-gap-assessment.dto';
import { GapAssessment } from '@prisma/client';

@Injectable()
export class GapAssessmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateGapAssessmentDto, createdById: number): Promise<GapAssessment> {
    return this.prisma.gapAssessment.create({
      data: {
        ...data,
        createdById,
      },
      include: {
        requirement: true,
        branch: true,
        createdBy: true,
        actionPlans: {
          include: {
            responsible: true,
            createdBy: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<GapAssessment[]> {
    return this.prisma.gapAssessment.findMany({
      include: {
        requirement: true,
        branch: true,
        createdBy: true,
        actionPlans: {
          include: {
            responsible: true,
            createdBy: true,
          },
        },
      },
    });
  }

  async findById(id: number): Promise<GapAssessment> {
    const gapAssessment = await this.prisma.gapAssessment.findUnique({
      where: { id },
      include: {
        requirement: true,
        branch: true,
        createdBy: true,
        actionPlans: {
          include: {
            responsible: true,
            createdBy: true,
          },
        },
      },
    });

    if (!gapAssessment) {
      throw new NotFoundException('Gap assessment not found');
    }

    return gapAssessment;
  }

  async findByBranch(branchId: number): Promise<GapAssessment[]> {
    return this.prisma.gapAssessment.findMany({
      where: { branchId },
      include: {
        requirement: true,
        branch: true,
        createdBy: true,
        actionPlans: {
          include: {
            responsible: true,
            createdBy: true,
          },
        },
      },
    });
  }

  async findByRequirement(requirementId: number): Promise<GapAssessment[]> {
    return this.prisma.gapAssessment.findMany({
      where: { requirementId },
      include: {
        requirement: true,
        branch: true,
        createdBy: true,
        actionPlans: {
          include: {
            responsible: true,
            createdBy: true,
          },
        },
      },
    });
  }

  async findByStatus(status: number): Promise<GapAssessment[]> {
    return this.prisma.gapAssessment.findMany({
      where: { status },
      include: {
        requirement: true,
        branch: true,
        createdBy: true,
        actionPlans: {
          include: {
            responsible: true,
            createdBy: true,
          },
        },
      },
    });
  }

  async getEvidenceStatistics() {
    const totalAssessments = await this.prisma.gapAssessment.count();
    const assessmentsWithEvidence = await this.prisma.gapAssessment.count({
      where: {
        evidenceLink: {
          not: null,
        },
      },
    });

    const evidencePercentage = totalAssessments > 0 
      ? Math.round((assessmentsWithEvidence / totalAssessments) * 100) 
      : 0;

    return {
      totalAssessments,
      assessmentsWithEvidence,
      evidencePercentage,
    };
  }

  async update(id: number, data: UpdateGapAssessmentDto): Promise<GapAssessment> {
    return this.prisma.gapAssessment.update({
      where: { id },
      data,
      include: {
        requirement: true,
        branch: true,
        createdBy: true,
        actionPlans: {
          include: {
            responsible: true,
            createdBy: true,
          },
        },
      },
    });
  }

  async delete(id: number): Promise<GapAssessment> {
    return this.prisma.gapAssessment.delete({
      where: { id },
    });
  }
}
