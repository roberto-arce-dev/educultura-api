import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MaterialMultimediaDocument = MaterialMultimedia & Document;

@Schema({ timestamps: true })
export class MaterialMultimedia {
  @Prop({ type: Types.ObjectId, ref: 'CursoCultural', required: true })
  curso: Types.ObjectId;

  @Prop({ required: true })
  titulo: string;

  @Prop({ enum: ['video', 'audio', 'documento', 'imagen'], default: 'video' })
  tipo?: string;

  @Prop()
  url?: string;

  @Prop({ default: 0 })
  orden?: number;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const MaterialMultimediaSchema = SchemaFactory.createForClass(MaterialMultimedia);

MaterialMultimediaSchema.index({ curso: 1, orden: 1 });
