import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BranchesService } from './branches.service';

@ApiTags('branches')
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get branches for an organization',
    description: 'Fetch all branches for a specific organization. If no organizationId is provided, returns branches for the default organization.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Branches retrieved successfully',
    schema: {
      example: [
        {
          id: 4,
          name: 'Default Head Office',
          region: 'Nairobi',
          organizationId: 1
        },
        {
          id: 5,
          name: 'Nairobi CBD Branch',
          region: 'Nairobi',
          organizationId: 1
        }
      ]
    }
  })
  async getBranches(@Query('organizationId') organizationId?: string) {
    const orgId = organizationId ? parseInt(organizationId) : 1; // Default to organization ID 1
    return this.branchesService.findByOrganization(orgId);
  }
}
