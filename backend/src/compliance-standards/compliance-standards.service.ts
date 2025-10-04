import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplianceStandardDto } from './dto/create-compliance-standard.dto';
import { UpdateComplianceStandardDto } from './dto/update-compliance-standard.dto';
import { ComplianceStandardResponseDto } from './dto/compliance-standard-response.dto';

@Injectable()
export class ComplianceStandardsService {
  private readonly logger = new Logger(ComplianceStandardsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createComplianceStandardDto: CreateComplianceStandardDto, organizationId: number): Promise<ComplianceStandardResponseDto> {
    try {
      // Check if a standard with the same name and version already exists for this organization
      const existingStandard = await this.prisma.complianceStandard.findFirst({
        where: {
          name: createComplianceStandardDto.name,
          version: createComplianceStandardDto.version || null,
          organizationId,
        },
      });

      if (existingStandard) {
        throw new ConflictException(
          `A compliance standard with name "${createComplianceStandardDto.name}" and version "${createComplianceStandardDto.version || 'no version'}" already exists for this organization.`
        );
      }

      // If this is set as default, unset other defaults for this organization
      if (createComplianceStandardDto.isDefault) {
        await this.prisma.complianceStandard.updateMany({
          where: { organizationId, isDefault: true },
          data: { isDefault: false },
        });
      }

      const complianceStandard = await this.prisma.complianceStandard.create({
        data: {
          ...createComplianceStandardDto,
          organizationId,
        },
        include: {
          organization: {
            select: { id: true, name: true },
          },
          _count: {
            select: { requirements: true },
          },
        },
      });

      this.logger.log(`Compliance standard created: ${complianceStandard.id} - ${complianceStandard.name}`);

      return {
        ...complianceStandard,
        requirementsCount: complianceStandard._count.requirements,
      };
    } catch (error) {
      this.logger.error('Failed to create compliance standard:', error);
      throw error;
    }
  }

  async findAll(organizationId: number): Promise<ComplianceStandardResponseDto[]> {
    const standards = await this.prisma.complianceStandard.findMany({
      where: { organizationId },
      include: {
        organization: {
          select: { id: true, name: true },
        },
        _count: {
          select: { requirements: true },
        },
      },
      orderBy: [
        { isDefault: 'desc' },
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    return standards.map(standard => ({
      ...standard,
      requirementsCount: standard._count.requirements,
    }));
  }

  async findOne(id: number, organizationId: number): Promise<ComplianceStandardResponseDto> {
    const standard = await this.prisma.complianceStandard.findFirst({
      where: { id, organizationId },
      include: {
        organization: {
          select: { id: true, name: true },
        },
        _count: {
          select: { requirements: true },
        },
      },
    });

    if (!standard) {
      throw new NotFoundException(`Compliance standard with ID ${id} not found for this organization.`);
    }

    return {
      ...standard,
      requirementsCount: standard._count.requirements,
    };
  }

  async update(id: number, updateComplianceStandardDto: UpdateComplianceStandardDto, organizationId: number): Promise<ComplianceStandardResponseDto> {
    try {
      // Check if standard exists
      const existingStandard = await this.prisma.complianceStandard.findFirst({
        where: { id, organizationId },
      });

      if (!existingStandard) {
        throw new NotFoundException(`Compliance standard with ID ${id} not found for this organization.`);
      }

      // If updating name or version, check for conflicts
      if (updateComplianceStandardDto.name || updateComplianceStandardDto.version !== undefined) {
        const conflictingStandard = await this.prisma.complianceStandard.findFirst({
          where: {
            name: updateComplianceStandardDto.name || existingStandard.name,
            version: updateComplianceStandardDto.version !== undefined ? updateComplianceStandardDto.version : existingStandard.version,
            organizationId,
            id: { not: id },
          },
        });

        if (conflictingStandard) {
          throw new ConflictException(
            `A compliance standard with name "${updateComplianceStandardDto.name || existingStandard.name}" and version "${updateComplianceStandardDto.version !== undefined ? updateComplianceStandardDto.version : existingStandard.version}" already exists for this organization.`
          );
        }
      }

      // If setting as default, unset other defaults for this organization
      if (updateComplianceStandardDto.isDefault) {
        await this.prisma.complianceStandard.updateMany({
          where: { organizationId, isDefault: true, id: { not: id } },
          data: { isDefault: false },
        });
      }

      const updatedStandard = await this.prisma.complianceStandard.update({
        where: { id },
        data: updateComplianceStandardDto,
        include: {
          organization: {
            select: { id: true, name: true },
          },
          _count: {
            select: { requirements: true },
          },
        },
      });

      this.logger.log(`Compliance standard updated: ${updatedStandard.id} - ${updatedStandard.name}`);

      return {
        ...updatedStandard,
        requirementsCount: updatedStandard._count.requirements,
      };
    } catch (error) {
      this.logger.error(`Failed to update compliance standard ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number, organizationId: number): Promise<void> {
    try {
      // Check if standard exists
      const existingStandard = await this.prisma.complianceStandard.findFirst({
        where: { id, organizationId },
        include: {
          _count: {
            select: { requirements: true, gapAssessments: true },
          },
        },
      });

      if (!existingStandard) {
        throw new NotFoundException(`Compliance standard with ID ${id} not found for this organization.`);
      }

      // Check if standard has associated requirements or assessments
      if (existingStandard._count.requirements > 0 || existingStandard._count.gapAssessments > 0) {
        throw new ConflictException(
          `Cannot delete compliance standard "${existingStandard.name}" because it has ${existingStandard._count.requirements} requirements and ${existingStandard._count.gapAssessments} gap assessments. Please reassign or delete them first.`
        );
      }

      await this.prisma.complianceStandard.delete({
        where: { id },
      });

      this.logger.log(`Compliance standard deleted: ${id} - ${existingStandard.name}`);
    } catch (error) {
      this.logger.error(`Failed to delete compliance standard ${id}:`, error);
      throw error;
    }
  }

  async getCategories(organizationId: number): Promise<string[]> {
    const categories = await this.prisma.complianceStandard.findMany({
      where: { organizationId, isActive: true },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return categories.map(cat => cat.category);
  }

  async getDefaultStandard(organizationId: number): Promise<ComplianceStandardResponseDto | null> {
    const defaultStandard = await this.prisma.complianceStandard.findFirst({
      where: { organizationId, isDefault: true, isActive: true },
      include: {
        organization: {
          select: { id: true, name: true },
        },
        _count: {
          select: { requirements: true },
        },
      },
    });

    if (!defaultStandard) {
      return null;
    }

    return {
      ...defaultStandard,
      requirementsCount: defaultStandard._count.requirements,
    };
  }
}
