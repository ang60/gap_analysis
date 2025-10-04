import { Module } from '@nestjs/common';
import { ComplianceStandardsController } from './compliance-standards.controller';
import { ComplianceStandardsService } from './compliance-standards.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ComplianceStandardsController],
  providers: [ComplianceStandardsService],
  exports: [ComplianceStandardsService],
})
export class ComplianceStandardsModule {}
