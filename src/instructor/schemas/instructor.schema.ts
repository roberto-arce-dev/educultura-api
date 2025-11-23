import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InstructorDocument = Instructor & Document;

@Schema({ timestamps: true })
export class Instructor {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  especialidad?: string;

  @Prop()
  biografia?: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const InstructorSchema = SchemaFactory.createForClass(Instructor);

InstructorSchema.index({ email: 1 });
InstructorSchema.index({ especialidad: 1 });
