import { PartialType } from '@nestjs/swagger';
import { CreateCursoCulturalDto } from './create-cursocultural.dto';

export class UpdateCursoCulturalDto extends PartialType(CreateCursoCulturalDto) {}
