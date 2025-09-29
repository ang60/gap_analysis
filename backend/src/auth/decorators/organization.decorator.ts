import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ORGANIZATION_KEY = 'organization';
export const Organization = (organizationId: number) => SetMetadata(ORGANIZATION_KEY, organizationId);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
