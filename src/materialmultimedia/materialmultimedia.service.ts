import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMaterialMultimediaDto } from './dto/create-materialmultimedia.dto';
import { UpdateMaterialMultimediaDto } from './dto/update-materialmultimedia.dto';
import { MaterialMultimedia, MaterialMultimediaDocument } from './schemas/materialmultimedia.schema';

@Injectable()
export class MaterialMultimediaService {
  constructor(
    @InjectModel(MaterialMultimedia.name) private materialmultimediaModel: Model<MaterialMultimediaDocument>,
  ) {}

  async create(createMaterialMultimediaDto: CreateMaterialMultimediaDto): Promise<MaterialMultimedia> {
    const nuevoMaterialMultimedia = await this.materialmultimediaModel.create(createMaterialMultimediaDto);
    return nuevoMaterialMultimedia;
  }

  async findAll(): Promise<MaterialMultimedia[]> {
    const materialmultimedias = await this.materialmultimediaModel.find();
    return materialmultimedias;
  }

  async findOne(id: string | number): Promise<MaterialMultimedia> {
    const materialmultimedia = await this.materialmultimediaModel.findById(id)
    .populate('curso', 'titulo instructor');
    if (!materialmultimedia) {
      throw new NotFoundException(`MaterialMultimedia con ID ${id} no encontrado`);
    }
    return materialmultimedia;
  }

  async update(id: string | number, updateMaterialMultimediaDto: UpdateMaterialMultimediaDto): Promise<MaterialMultimedia> {
    const materialmultimedia = await this.materialmultimediaModel.findByIdAndUpdate(id, updateMaterialMultimediaDto, { new: true })
    .populate('curso', 'titulo instructor');
    if (!materialmultimedia) {
      throw new NotFoundException(`MaterialMultimedia con ID ${id} no encontrado`);
    }
    return materialmultimedia;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.materialmultimediaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`MaterialMultimedia con ID ${id} no encontrado`);
    }
  }
}
