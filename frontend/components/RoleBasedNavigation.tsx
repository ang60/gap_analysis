'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  roles: string[];
  icon?: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    roles: ['ADMIN', 'MANAGER', 'COMPLIANCE_OFFICER', 'STAFF'],
  },
  {
    name: 'Requirements',
    href: '/dashboard/requirements',
    roles: ['COMPLIANCE_OFFICER'], // Only Compliance Officers create requirements
  },
  {
    name: 'Gap Analysis',
    href: '/dashboard/gap-analysis',
    roles: ['COMPLIANCE_OFFICER'], // Only Compliance Officers perform gap analysis
  },
  {
    name: 'Action Plans',
    href: '/dashboard/action-plans',
    roles: ['MANAGER', 'STAFF'], // Managers create, Staff complete
  },
  {
    name: 'Risk Register',
    href: '/dashboard/risks',
    roles: ['COMPLIANCE_OFFICER'], // Only Compliance Officers assess risks
  },
  {
    name: 'Schedules',
    href: '/dashboard/schedules',
    roles: ['MANAGER', 'COMPLIANCE_OFFICER'], // Managers and Compliance Officers create schedules
  },
  {
    name: 'Evidence',
    href: '/dashboard/evidence',
    roles: ['STAFF'], // Only Staff upload evidence
  },
  {
    name: 'User Management',
    href: '/dashboard/user-management',
    roles: ['ADMIN'],
  },
  {
    name: 'System Administration',
    href: '/dashboard/super-admin',
    roles: ['SUPER_ADMIN'],
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    roles: ['ADMIN', 'MANAGER', 'COMPLIANCE_OFFICER', 'STAFF'],
  },
];

interface RoleBasedNavigationProps {
  className?: string;
}

export function RoleBasedNavigation({ className }: RoleBasedNavigationProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <nav className={cn('space-y-1', className)}>
      {filteredItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
              isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            {item.icon && (
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
            )}
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
