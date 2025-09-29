import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantAwareService {
  constructor(protected readonly prisma: PrismaService) {}

  /**
   * Get the current user's organization ID from the request context
   */
  protected getOrganizationId(request: any): number {
    return request.organizationId || request.user?.organizationId;
  }

  /**
   * Create a tenant-aware where clause for Prisma queries
   */
  protected getTenantWhere(organizationId: number, additionalWhere: any = {}) {
    return {
      organizationId,
      ...additionalWhere,
    };
  }

  /**
   * Ensure the user can only access data from their organization
   */
  protected validateTenantAccess(organizationId: number, userOrganizationId: number) {
    if (organizationId !== userOrganizationId) {
      throw new Error(`Access denied. You can only access data from organization ${userOrganizationId}`);
    }
  }
}
