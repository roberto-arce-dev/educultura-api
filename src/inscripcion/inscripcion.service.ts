import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { Inscripcion, InscripcionDocument } from './schemas/inscripcion.schema';
import { EstudianteProfileService } from '../estudiante-profile/estudiante-profile.service';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectModel(Inscripcion.name) private inscripcionModel: Model<InscripcionDocument>,
    private estudianteProfileService: EstudianteProfileService,
  ) {}

  async create(createInscripcionDto: CreateInscripcionDto, userId?: string): Promise<Inscripcion> {
    let estudianteId: string;

    if (createInscripcionDto.estudiante) {
      estudianteId = createInscripcionDto.estudiante;
    } else if (userId) {
      const profile = await this.estudianteProfileService.findByUserId(userId);
      estudianteId = (profile as any)._id.toString();
    } else {
      throw new NotFoundException('Estudiante no especificado');
    }

    const nuevoInscripcion = await this.inscripcionModel.create({
      ...createInscripcionDto,
      estudiante: new Types.ObjectId(estudianteId),
    });
    return nuevoInscripcion;
  }

  async findAll(): Promise<Inscripcion[]> {
    const inscripcions = await this.inscripcionModel.find();
    return inscripcions;
  }

  async findMyInscripciones(userId: string): Promise<Inscripcion[]> {
    const profile = await this.estudianteProfileService.findByUserId(userId);
    const estudianteId = (profile as any)._id.toString();
    return this.inscripcionModel.find({ estudiante: new Types.ObjectId(estudianteId) })
      .populate('curso', 'titulo categoria precio')
      .sort({ createdAt: -1 });
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
