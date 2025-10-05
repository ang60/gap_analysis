'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

interface RoleBasedComponentProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export function RoleBasedComponent({ 
  children, 
  allowedRoles, 
  fallback = null 
}: RoleBasedComponentProps) {
  const { user } = useAuth();

  // ROLE-BASED ACCESS TEMPORARILY DISABLED FOR TESTING
  // if (!user || !allowedRoles.includes(user.role)) {
  //   return <>{fallback}</>;
  // }

  return <>{children}</>;
}

// Convenience components for specific roles
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleBasedComponent allowedRoles={['ADMIN']} fallback={fallback}>
      {children}
    </RoleBasedComponent>
  );
}

export function ManagerOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleBasedComponent allowedRoles={['MANAGER']} fallback={fallback}>
      {children}
    </RoleBasedComponent>
  );
}

export function ComplianceOfficerOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleBasedComponent allowedRoles={['COMPLIANCE_OFFICER']} fallback={fallback}>
      {children}
    </RoleBasedComponent>
  );
}

export function StaffOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleBasedComponent allowedRoles={['STAFF']} fallback={fallback}>
      {children}
    </RoleBasedComponent>
  );
}

export function ManagerAndAbove({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleBasedComponent allowedRoles={['ADMIN', 'MANAGER']} fallback={fallback}>
      {children}
    </RoleBasedComponent>
  );
}

export function ComplianceAndAbove({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleBasedComponent allowedRoles={['ADMIN', 'MANAGER', 'COMPLIANCE_OFFICER']} fallback={fallback}>
      {children}
    </RoleBasedComponent>
  );
}

export function SuperAdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleBasedComponent allowedRoles={['SUPER_ADMIN']} fallback={fallback}>
      {children}
    </RoleBasedComponent>
  );
}
