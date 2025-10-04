import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { BranchResponseDto } from './dto/branch-response.dto';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  async findByOrganization(organizationId: number) {
    return this.prisma.branch.findMany({
      where: {
        organizationId,
        isActive: true,
      },
      select: {
        id: true,
        branchId: true,
        name: true,
        region: true,
        organizationId: true,
      },
      orderBy: {
        branchId: 'asc',
      },
    });
  }

  async create(createBranchDto: CreateBranchDto, organizationId: number): Promise<BranchResponseDto> {
    // Get the next branchId for this organization
    const lastBranch = await this.prisma.branch.findFirst({
      where: { organizationId },
      orderBy: { branchId: 'desc' },
      select: { branchId: true },
    });

    const nextBranchId = (lastBranch?.branchId || 0) + 1;

    const branch = await this.prisma.branch.create({
      data: {
        branchId: nextBranchId,
        name: createBranchDto.name,
        region: createBranchDto.region,
        organizationId,
        managerId: createBranchDto.managerId,
      },
    });

    return {
      ...branch,
      managerId: branch.managerId || undefined,
    };
  }

  async findById(id: number, organizationId: number): Promise<BranchResponseDto | null> {
    const branch = await this.prisma.branch.findFirst({
      where: {
        id,
        organizationId,
        isActive: true,
      },
    });

    if (!branch) {
      return null;
    }

    return {
      ...branch,
      managerId: branch.managerId || undefined,
    };
  }
}
