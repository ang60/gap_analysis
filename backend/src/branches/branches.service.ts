import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
        name: true,
        region: true,
        organizationId: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
