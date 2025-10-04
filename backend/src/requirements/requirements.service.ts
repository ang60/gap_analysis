import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { UpdateRequirementDto } from './dto/update-requirement.dto';
import { Requirement, Priority } from '@prisma/client';

@Injectable()
export class RequirementsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: number, data: CreateRequirementDto, createdById: number): Promise<Requirement> {
    return this.prisma.requirement.create({
      data: {
        organizationId,
        ...data,
        createdById,
      },
      include: {
        users: true,
        branch: true,
        gapAssessments: {
          include: {
            branch: true,
            createdBy: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<Requirement[]> {
    return this.prisma.requirement.findMany({
      include: {
        users: true,
        branch: true,
        gapAssessments: {
          include: {
            branch: true,
            createdBy: true,
          },
        },
      },
    });
  }

  async findById(id: number): Promise<Requirement> {
    const requirement = await this.prisma.requirement.findUnique({
      where: { id },
      include: {
        users: true,
        branch: true,
        gapAssessments: {
          include: {
            branch: true,
            createdBy: true,
          },
        },
      },
    });

    if (!requirement) {
      throw new NotFoundException('Requirement not found');
    }

    return requirement;
  }

  async findByClause(clause: string): Promise<Requirement[]> {
    return this.prisma.requirement.findMany({
      where: {
        clause: {
          startsWith: clause,
        },
      },
      include: {
        users: true,
        branch: true,
        gapAssessments: {
          include: {
            branch: true,
            createdBy: true,
          },
        },
      },
    });
  }

  async findByCategory(category: string): Promise<Requirement[]> {
    return this.prisma.requirement.findMany({
      where: { category },
      include: {
        users: true,
        branch: true,
        gapAssessments: {
          include: {
            branch: true,
            createdBy: true,
          },
        },
      },
    });
  }

  async findBySection(section: string): Promise<Requirement[]> {
    return this.prisma.requirement.findMany({
      where: { section },
      include: {
        users: true,
        branch: true,
        gapAssessments: {
          include: {
            branch: true,
            createdBy: true,
          },
        },
      },
    });
  }

  async findByPriority(priority: Priority): Promise<Requirement[]> {
    return this.prisma.requirement.findMany({
      where: { priority },
      include: {
        users: true,
        branch: true,
        gapAssessments: {
          include: {
            branch: true,
            createdBy: true,
          },
        },
      },
    });
  }

  async getRequirementsWithAssessments(clause: string, branchId: number): Promise<any[]> {
    return this.prisma.requirement.findMany({
      where: {
        clause: {
          startsWith: clause,
        },
      },
      include: {
        users: true,
        branch: true,
        gapAssessments: {
          where: {
            branchId,
          },
          include: {
            branch: true,
            createdBy: true,
          },
        },
      },
    });
  }

  async getComplianceStats(clause: string, branchId: number) {
    const requirements = await this.getRequirementsWithAssessments(clause, branchId);
    
    const totalRequirements = requirements.length;
    const implementedRequirements = requirements.filter(req => 
      req.gapAssessments.some(assessment => assessment.status >= 2)
    ).length;
    
    const implementationPercentage = totalRequirements > 0 
      ? Math.round((implementedRequirements / totalRequirements) * 100) 
      : 0;

    const statusBreakdown = {
      notImplemented: requirements.filter(req => 
        !req.gapAssessments.some(assessment => assessment.status >= 1)
      ).length,
      partiallyImplemented: requirements.filter(req => 
        req.gapAssessments.some(assessment => assessment.status === 1)
      ).length,
      mostlyImplemented: requirements.filter(req => 
        req.gapAssessments.some(assessment => assessment.status === 2)
      ).length,
      fullyImplemented: requirements.filter(req => 
        req.gapAssessments.some(assessment => assessment.status === 3)
      ).length,
    };

    const evidenceCoverage = requirements.filter(req => 
      req.gapAssessments.some(assessment => assessment.evidenceLink)
    ).length;

    const evidencePercentage = totalRequirements > 0 
      ? Math.round((evidenceCoverage / totalRequirements) * 100) 
      : 0;

    return {
      totalRequirements,
      implementationPercentage,
      statusBreakdown,
      evidenceCoverage,
      evidencePercentage,
    };
  }

  async getWhatsMissing(clause: string, branchId: number) {
    const requirements = await this.getRequirementsWithAssessments(clause, branchId);
    
    const missingGapAssessments = requirements.filter(req => 
      !req.gapAssessments.some(assessment => assessment.branchId === branchId)
    );

    const missingEvidence = requirements.filter(req => 
      req.gapAssessments.some(assessment => 
        assessment.branchId === branchId && !assessment.evidenceLink
      )
    );

    const incompleteRequirements = requirements.filter(req => 
      req.gapAssessments.some(assessment => 
        assessment.branchId === branchId && assessment.status < 3
      )
    );

    return {
      missingGapAssessments: missingGapAssessments.sort((a, b) => {
        const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }),
      missingEvidence: missingEvidence.sort((a, b) => {
        const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }),
      incompleteRequirements: incompleteRequirements.sort((a, b) => {
        const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }),
    };
  }

  async getIncompleteRequirements(branchId: number): Promise<Requirement[]> {
    return this.prisma.requirement.findMany({
      where: {
        gapAssessments: {
          some: {
            branchId,
            status: {
              lt: 3,
            },
          },
        },
      },
      include: {
        users: true,
        branch: true,
        gapAssessments: {
          where: {
            branchId,
          },
          include: {
            branch: true,
            createdBy: true,
          },
        },
      },
      orderBy: {
        priority: 'asc',
      },
    });
  }

  async update(id: number, data: UpdateRequirementDto): Promise<Requirement> {
    return this.prisma.requirement.update({
      where: { id },
      data,
      include: {
        users: true,
        branch: true,
        gapAssessments: {
          include: {
            branch: true,
            createdBy: true,
          },
        },
      },
    });
  }

  async delete(id: number): Promise<Requirement> {
    return this.prisma.requirement.delete({
      where: { id },
    });
  }
}
