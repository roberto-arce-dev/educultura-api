import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCursoCulturalDto } from './dto/create-cursocultural.dto';
import { UpdateCursoCulturalDto } from './dto/update-cursocultural.dto';
import { CursoCultural, CursoCulturalDocument } from './schemas/cursocultural.schema';

@Injectable()
export class CursoCulturalService {
  constructor(
    @InjectModel(CursoCultural.name) private cursoculturalModel: Model<CursoCulturalDocument>,
  ) {}

  async create(createCursoCulturalDto: CreateCursoCulturalDto): Promise<CursoCultural> {
    const nuevoCursoCultural = await this.cursoculturalModel.create(createCursoCulturalDto);
    return nuevoCursoCultural;
  }

  async findAll(): Promise<CursoCultural[]> {
    const cursoculturals = await this.cursoculturalModel.find();
    return cursoculturals;
  }

  async findOne(id: string | number): Promise<CursoCultural> {
    const cursocultural = await this.cursoculturalModel.findById(id)
    .populate('instructor', 'nombre especialidad email');
    if (!cursocultural) {
      throw new NotFoundException(`CursoCultural con ID ${id} no encontrado`);
    }
    return cursocultural;
  }

  async update(id: string | number, updateCursoCulturalDto: UpdateCursoCulturalDto): Promise<CursoCultural> {
    const cursocultural = await this.cursoculturalModel.findByIdAndUpdate(id, updateCursoCulturalDto, { new: true })
    .populate('instructor', 'nombre especialidad email');
    if (!cursocultural) {
      throw new NotFoundException(`CursoCultural con ID ${id} no encontrado`);
    }
    return cursocultural;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.cursoculturalModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`CursoCultural con ID ${id} no encontrado`);
    }
  }
}
