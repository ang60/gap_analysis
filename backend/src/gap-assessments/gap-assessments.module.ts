import { Module } from '@nestjs/common';
import { GapAssessmentsController } from './gap-assessments.controller';
import { GapAssessmentsService } from './gap-assessments.service';

@Module({
  controllers: [GapAssessmentsController],
  providers: [GapAssessmentsService],
  exports: [GapAssessmentsService],
})
export class GapAssessmentsModule {}
