import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { UploadModule } from '../upload/upload.module';
import { Instructor, InstructorSchema } from './schemas/instructor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Instructor.name, schema: InstructorSchema }]),
    UploadModule,
  ],
  controllers: [InstructorController],
  providers: [InstructorService],
  exports: [InstructorService],
})
export class InstructorModule {}
