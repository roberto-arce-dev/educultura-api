export class CursoCultural {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  imagenThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<CursoCultural>) {
    Object.assign(this, partial);
  }
}
