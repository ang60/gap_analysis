import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGapAssessmentDto } from './dto/create-gap-assessment.dto';
import { UpdateGapAssessmentDto } from './dto/update-gap-assessment.dto';
import { GapAssessment } from '@prisma/client';
import { TenantAwareService } from '../common/tenant-aware.service';

@Injectable()
export class GapAssessmentsService extends TenantAwareService {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(organizationId: number, data: CreateGapAssessmentDto, createdById: number): Promise<GapAssessment> {
    return this.prisma.gapAssessment.create({
      data: {
        organizationId,
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

  async findAll(organizationId: number): Promise<GapAssessment[]> {
    return this.prisma.gapAssessment.findMany({
      where: { organizationId },
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
