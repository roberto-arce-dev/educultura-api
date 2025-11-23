import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EstudianteDocument = Estudiante & Document;

@Schema({ timestamps: true })
export class Estudiante {
  @Prop({ required: true })
  nombre: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  telefono?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const EstudianteSchema = SchemaFactory.createForClass(Estudiante);

EstudianteSchema.index({ email: 1 });
