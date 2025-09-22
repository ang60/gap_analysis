import { PartialType } from '@nestjs/swagger';
import { CreateGapAssessmentDto } from './create-gap-assessment.dto';

export class UpdateGapAssessmentDto extends PartialType(CreateGapAssessmentDto) {}
