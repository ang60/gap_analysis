import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { RequirementsModule } from './requirements/requirements.module';
import { GapAssessmentsModule } from './gap-assessments/gap-assessments.module';
import { ActionPlansModule } from './action-plans/action-plans.module';
import { RisksModule } from './risks/risks.module';
import { SchedulesModule } from './schedules/schedules.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EmailModule } from './email/email.module';
import { CronModule } from './cron/cron.module';
import { BranchesModule } from './branches/branches.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { PaymentsModule } from './payments/payments.module';
import { ComplianceStandardsModule } from './compliance-standards/compliance-standards.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    OrganizationsModule,
    RequirementsModule,
    GapAssessmentsModule,
    ActionPlansModule,
    RisksModule,
    SchedulesModule,
    NotificationsModule,
    EmailModule,
    CronModule,
    BranchesModule,
    SuperAdminModule,
    PaymentsModule,
    ComplianceStandardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
