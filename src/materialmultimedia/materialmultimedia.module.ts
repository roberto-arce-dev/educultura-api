import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaterialMultimediaService } from './materialmultimedia.service';
import { MaterialMultimediaController } from './materialmultimedia.controller';
import { UploadModule } from '../upload/upload.module';
import { MaterialMultimedia, MaterialMultimediaSchema } from './schemas/materialmultimedia.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MaterialMultimedia.name, schema: MaterialMultimediaSchema }]),
    UploadModule,
  ],
  controllers: [MaterialMultimediaController],
  providers: [MaterialMultimediaService],
  exports: [MaterialMultimediaService],
})
export class MaterialMultimediaModule {}
