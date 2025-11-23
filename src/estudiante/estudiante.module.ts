import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';
import { UploadModule } from '../upload/upload.module';
import { Estudiante, EstudianteSchema } from './schemas/estudiante.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Estudiante.name, schema: EstudianteSchema }]),
    UploadModule,
  ],
  controllers: [EstudianteController],
  providers: [EstudianteService],
  exports: [EstudianteService],
})
export class EstudianteModule {}
