import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

// ...

  async findByCurso(cursoId: string): Promise<MaterialMultimedia[]> {
    return this.materialmultimediaModel.find({ curso: new Types.ObjectId(cursoId) })
      .populate('curso', 'titulo instructor')
      .sort({ titulo: 1 });
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.materialmultimediaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`MaterialMultimedia con ID ${id} no encontrado`);
    }
  }
}
