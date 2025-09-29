import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

@Injectable()
export class TenantRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Ensure user has organizationId (tenant context)
    if (!user.organizationId) {
      throw new ForbiddenException('User must belong to an organization');
    }

    // Get required roles for this endpoint
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Check role-based access
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.some((role) => user.role === role);
      if (!hasRole) {
        throw new ForbiddenException(`Access denied. Required role: ${requiredRoles.join(' or ')}`);
      }
    }

    // Check organization access
    const requestedOrganizationId = request.params.organizationId || 
                                   request.body.organizationId || 
                                   request.query.organizationId;

    if (requestedOrganizationId && user.organizationId !== parseInt(requestedOrganizationId)) {
      throw new ForbiddenException(`Access denied. You can only access data from organization ${user.organizationId}`);
    }

    // Add tenant context to request
    request.organizationId = user.organizationId;
    request.tenantId = user.organizationId;
    request.userRole = user.role;

    return true;
  }
}
