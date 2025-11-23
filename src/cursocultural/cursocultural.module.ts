import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursoCulturalService } from './cursocultural.service';
import { CursoCulturalController } from './cursocultural.controller';
import { UploadModule } from '../upload/upload.module';
import { CursoCultural, CursoCulturalSchema } from './schemas/cursocultural.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CursoCultural.name, schema: CursoCulturalSchema }]),
    UploadModule,
  ],
  controllers: [CursoCulturalController],
  providers: [CursoCulturalService],
  exports: [CursoCulturalService],
})
export class CursoCulturalModule {}
