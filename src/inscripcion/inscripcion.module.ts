import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InscripcionService } from './inscripcion.service';
import { InscripcionController } from './inscripcion.controller';
import { UploadModule } from '../upload/upload.module';
import { Inscripcion, InscripcionSchema } from './schemas/inscripcion.schema';
import { EstudianteProfileModule } from '../estudiante-profile/estudiante-profile.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Inscripcion.name, schema: InscripcionSchema }]),
    UploadModule,
    EstudianteProfileModule,
  ],
  controllers: [InscripcionController],
  providers: [InscripcionService],
  exports: [InscripcionService],
})
export class InscripcionModule {}
