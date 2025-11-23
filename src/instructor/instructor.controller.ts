import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { InstructorService } from './instructor.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Instructor')
@ApiBearerAuth('JWT-auth')
@Controller('instructor')
export class InstructorController {
  constructor(
    private readonly instructorService: InstructorService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Instructor' })
  @ApiBody({ type: CreateInstructorDto })
  @ApiResponse({ status: 201, description: 'Instructor creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createInstructorDto: CreateInstructorDto) {
    const data = await this.instructorService.create(createInstructorDto);
    return {
      success: true,
      message: 'Instructor creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Instructor' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Instructor' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen subida exitosamente' })
  @ApiResponse({ status: 404, description: 'Instructor no encontrado' })
  async uploadImage(
    @Param('id') id: string,
    @Req() request: FastifyRequest,
  ) {
    // Obtener archivo de Fastify
    const data = await request.file();

    if (!data) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!data.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    const buffer = await data.toBuffer();
    const file = {
      buffer,
      originalname: data.filename,
      mimetype: data.mimetype,
    } as Express.Multer.File;

    const uploadResult = await this.uploadService.uploadImage(file);
    const updated = await this.instructorService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { instructor: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Instructors' })
  @ApiResponse({ status: 200, description: 'Lista de Instructors' })
  async findAll() {
    const data = await this.instructorService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Instructor por ID' })
  @ApiParam({ name: 'id', description: 'ID del Instructor' })
  @ApiResponse({ status: 200, description: 'Instructor encontrado' })
  @ApiResponse({ status: 404, description: 'Instructor no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.instructorService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Instructor' })
  @ApiParam({ name: 'id', description: 'ID del Instructor' })
  @ApiBody({ type: UpdateInstructorDto })
  @ApiResponse({ status: 200, description: 'Instructor actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Instructor no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateInstructorDto: UpdateInstructorDto
  ) {
    const data = await this.instructorService.update(id, updateInstructorDto);
    return {
      success: true,
      message: 'Instructor actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Instructor' })
  @ApiParam({ name: 'id', description: 'ID del Instructor' })
  @ApiResponse({ status: 200, description: 'Instructor eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Instructor no encontrado' })
  async remove(@Param('id') id: string) {
    const instructor = await this.instructorService.findOne(id);
    if (instructor.imagen) {
      const filename = instructor.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.instructorService.remove(id);
    return { success: true, message: 'Instructor eliminado exitosamente' };
  }
}
