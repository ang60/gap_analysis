import { PartialType } from '@nestjs/swagger';
import { CreateComplianceStandardDto } from './create-compliance-standard.dto';

export class UpdateComplianceStandardDto extends PartialType(CreateComplianceStandardDto) {}
