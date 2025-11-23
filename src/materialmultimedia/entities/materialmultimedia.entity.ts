export class MaterialMultimedia {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  imagenThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<MaterialMultimedia>) {
    Object.assign(this, partial);
  }
}
