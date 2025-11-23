import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CursoCulturalDocument = CursoCultural & Document;

@Schema({ timestamps: true })
export class CursoCultural {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ type: Types.ObjectId, ref: 'Instructor', required: true })
  instructor: Types.ObjectId;

  @Prop({ enum: ['arte', 'musica', 'danza', 'literatura', 'teatro'], default: 'arte' })
  categoria?: string;

  @Prop({ default: 0, min: 0 })
  duracion?: number;

  @Prop({ default: 0, min: 0 })
  precio?: number;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const CursoCulturalSchema = SchemaFactory.createForClass(CursoCultural);

CursoCulturalSchema.index({ instructor: 1 });
CursoCulturalSchema.index({ categoria: 1 });
CursoCulturalSchema.index({ titulo: 'text', descripcion: 'text' });
