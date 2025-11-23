import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { Inscripcion, InscripcionDocument } from './schemas/inscripcion.schema';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectModel(Inscripcion.name) private inscripcionModel: Model<InscripcionDocument>,
  ) {}

  async create(createInscripcionDto: CreateInscripcionDto): Promise<Inscripcion> {
    const nuevoInscripcion = await this.inscripcionModel.create(createInscripcionDto);
    return nuevoInscripcion;
  }

  async findAll(): Promise<Inscripcion[]> {
    const inscripcions = await this.inscripcionModel.find();
    return inscripcions;
  }

  async findOne(id: string | number): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionModel.findById(id)
    .populate('estudiante', 'nombre email')
    .populate('curso', 'titulo categoria precio');
    if (!inscripcion) {
      throw new NotFoundException(`Inscripcion con ID ${id} no encontrado`);
    }
    return inscripcion;
  }

  async update(id: string | number, updateInscripcionDto: UpdateInscripcionDto): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionModel.findByIdAndUpdate(id, updateInscripcionDto, { new: true })
    .populate('estudiante', 'nombre email')
    .populate('curso', 'titulo categoria precio');
    if (!inscripcion) {
      throw new NotFoundException(`Inscripcion con ID ${id} no encontrado`);
    }
    return inscripcion;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.inscripcionModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Inscripcion con ID ${id} no encontrado`);
    }
  }
}
