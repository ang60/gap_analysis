import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

@Injectable()
export class RoleBasedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // ROLE-BASED ACCESS TEMPORARILY DISABLED FOR TESTING
    // const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);

    // if (!requiredRoles) {
    //   return true;
    // }

    // const request = context.switchToHttp().getRequest();
    // const user = request.user;

    // if (!user) {
    //   throw new ForbiddenException('User not authenticated');
    // }

    // // Check if user has required role
    // const hasRole = requiredRoles.some((role) => user.role === role);
    // if (!hasRole) {
    //   throw new ForbiddenException(`Access denied. Required role: ${requiredRoles.join(' or ')}`);
    // }

    // // Check organization access
    // const organizationId = request.params.organizationId || request.body.organizationId;
    // if (organizationId && user.organizationId !== parseInt(organizationId)) {
    //   throw new ForbiddenException('Access denied. You can only access your organization\'s data');
    // }

    return true;
  }
}
