import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Instructor, InstructorDocument } from './schemas/instructor.schema';

@Injectable()
export class InstructorService {
  constructor(
    @InjectModel(Instructor.name) private instructorModel: Model<InstructorDocument>,
  ) {}

  async create(createInstructorDto: CreateInstructorDto): Promise<Instructor> {
    const nuevoInstructor = await this.instructorModel.create(createInstructorDto);
    return nuevoInstructor;
  }

  async findAll(): Promise<Instructor[]> {
    const instructors = await this.instructorModel.find();
    return instructors;
  }

  async findOne(id: string | number): Promise<Instructor> {
    const instructor = await this.instructorModel.findById(id);
    if (!instructor) {
      throw new NotFoundException(`Instructor con ID ${id} no encontrado`);
    }
    return instructor;
  }

  async update(id: string | number, updateInstructorDto: UpdateInstructorDto): Promise<Instructor> {
    const instructor = await this.instructorModel.findByIdAndUpdate(id, updateInstructorDto, { new: true });
    if (!instructor) {
      throw new NotFoundException(`Instructor con ID ${id} no encontrado`);
    }
    return instructor;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.instructorModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Instructor con ID ${id} no encontrado`);
    }
  }
}
