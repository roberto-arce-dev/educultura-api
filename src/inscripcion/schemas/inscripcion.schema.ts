import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InscripcionDocument = Inscripcion & Document;

@Schema({ timestamps: true })
export class Inscripcion {
  @Prop({ type: Types.ObjectId, ref: 'Estudiante', required: true })
  estudiante: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'CursoCultural', required: true })
  curso: Types.ObjectId;

  @Prop({ default: Date.now })
  fechaInscripcion?: Date;

  @Prop({ default: 0, min: 0, max: 100 })
  progreso?: number;

  @Prop({ default: false })
  completado?: boolean;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const InscripcionSchema = SchemaFactory.createForClass(Inscripcion);

InscripcionSchema.index({ estudiante: 1, curso: 1 }, { unique: true });
InscripcionSchema.index({ curso: 1 });
InscripcionSchema.index({ completado: 1 });
