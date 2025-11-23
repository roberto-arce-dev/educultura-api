import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { Estudiante, EstudianteDocument } from './schemas/estudiante.schema';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectModel(Estudiante.name) private estudianteModel: Model<EstudianteDocument>,
  ) {}

  async create(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
    const nuevoEstudiante = await this.estudianteModel.create(createEstudianteDto);
    return nuevoEstudiante;
  }

  async findAll(): Promise<Estudiante[]> {
    const estudiantes = await this.estudianteModel.find();
    return estudiantes;
  }

  async findOne(id: string | number): Promise<Estudiante> {
    const estudiante = await this.estudianteModel.findById(id);
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }
    return estudiante;
  }

  async update(id: string | number, updateEstudianteDto: UpdateEstudianteDto): Promise<Estudiante> {
    const estudiante = await this.estudianteModel.findByIdAndUpdate(id, updateEstudianteDto, { new: true });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }
    return estudiante;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.estudianteModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }
  }
}
