import { Controller, Get } from '@nestjs/common';

@Controller('super-admin')
export class SuperAdminController {
  @Get('dashboard')
  async getSystemDashboard() {
    return {
      statistics: {
        totalOrganizations: 4,
        totalUsers: 20,
        totalRequirements: 57,
        totalGapAssessments: 12,
        totalActionPlans: 8,
        totalRisks: 5,
        totalSchedules: 15
      },
      recentOrganizations: [
        { id: 1, name: 'Default Organization', domain: 'default.local', isActive: true },
        { id: 2, name: 'Equity Bank Kenya', domain: 'equitybank.co.ke', isActive: true },
        { id: 3, name: 'KCB Bank Kenya', domain: 'kcbgroup.com', isActive: true },
        { id: 4, name: 'Co-operative Bank of Kenya', domain: 'co-opbank.co.ke', isActive: true }
      ],
      recentUsers: [
        { id: 19, email: 'superadmin@gapanalysis.com', firstName: 'Super', lastName: 'Admin', role: 'SUPER_ADMIN' },
        { id: 1, email: 'admin@bank.co.ke', firstName: 'Admin', lastName: 'User', role: 'ADMIN' },
        { id: 5, email: 'admin@equitybank.co.ke', firstName: 'Equity', lastName: 'Admin', role: 'ADMIN' }
      ]
    };
  }

  @Get('organizations')
  async getAllOrganizations() {
    return [
      { 
        id: 1, 
        name: 'Default Organization', 
        domain: 'default.local', 
        subdomain: 'default',
        isActive: true,
        _count: { 
          users: 5, 
          requirements: 57, 
          gapAssessments: 3, 
          actionPlans: 2, 
          risks: 1, 
          schedules: 4 
        }
      },
      { 
        id: 2, 
        name: 'Equity Bank Kenya', 
        domain: 'equitybank.co.ke', 
        subdomain: 'equity',
        isActive: true,
        _count: { 
          users: 4, 
          requirements: 57, 
          gapAssessments: 3, 
          actionPlans: 2, 
          risks: 1, 
          schedules: 4 
        }
      },
      { 
        id: 3, 
        name: 'KCB Bank Kenya', 
        domain: 'kcbgroup.com', 
        subdomain: 'kcb',
        isActive: true,
        _count: { 
          users: 4, 
          requirements: 57, 
          gapAssessments: 3, 
          actionPlans: 2, 
          risks: 1, 
          schedules: 4 
        }
      },
      { 
        id: 4, 
        name: 'Co-operative Bank of Kenya', 
        domain: 'co-opbank.co.ke', 
        subdomain: 'coop',
        isActive: true,
        _count: { 
          users: 4, 
          requirements: 57, 
          gapAssessments: 3, 
          actionPlans: 2, 
          risks: 1, 
          schedules: 4 
        }
      }
    ];
  }

  @Get('users')
  async getAllUsers() {
    return [
      { 
        id: 19, 
        email: 'superadmin@gapanalysis.com', 
        firstName: 'Super', 
        lastName: 'Admin', 
        role: 'SUPER_ADMIN',
        isActive: true,
        organization: { name: 'Default Organization' },
        branch: null
      },
      { 
        id: 1, 
        email: 'admin@bank.co.ke', 
        firstName: 'Admin', 
        lastName: 'User', 
        role: 'ADMIN',
        isActive: true,
        organization: { name: 'Default Organization' },
        branch: { name: 'Head Office' }
      },
      { 
        id: 5, 
        email: 'admin@equitybank.co.ke', 
        firstName: 'Equity', 
        lastName: 'Admin', 
        role: 'ADMIN',
        isActive: true,
        organization: { name: 'Equity Bank Kenya' },
        branch: { name: 'Head Office' }
      },
      { 
        id: 9, 
        email: 'admin@kcbgroup.com', 
        firstName: 'KCB', 
        lastName: 'Admin', 
        role: 'ADMIN',
        isActive: true,
        organization: { name: 'KCB Bank Kenya' },
        branch: { name: 'Head Office' }
      },
      { 
        id: 13, 
        email: 'admin@co-opbank.co.ke', 
        firstName: 'Coop', 
        lastName: 'Admin', 
        role: 'ADMIN',
        isActive: true,
        organization: { name: 'Co-operative Bank of Kenya' },
        branch: { name: 'Head Office' }
      }
    ];
  }
}