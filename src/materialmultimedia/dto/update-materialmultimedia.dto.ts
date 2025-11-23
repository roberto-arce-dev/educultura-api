import { PartialType } from '@nestjs/swagger';
import { CreateMaterialMultimediaDto } from './create-materialmultimedia.dto';

export class UpdateMaterialMultimediaDto extends PartialType(CreateMaterialMultimediaDto) {}
