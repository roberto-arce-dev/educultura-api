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
import { EstudianteService } from './estudiante.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Estudiante')
@ApiBearerAuth('JWT-auth')
@Controller('estudiante')
export class EstudianteController {
  constructor(
    private readonly estudianteService: EstudianteService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Estudiante' })
  @ApiBody({ type: CreateEstudianteDto })
  @ApiResponse({ status: 201, description: 'Estudiante creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createEstudianteDto: CreateEstudianteDto) {
    const data = await this.estudianteService.create(createEstudianteDto);
    return {
      success: true,
      message: 'Estudiante creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Estudiante' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Estudiante' })
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
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
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
    const updated = await this.estudianteService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { estudiante: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Estudiantes' })
  @ApiResponse({ status: 200, description: 'Lista de Estudiantes' })
  async findAll() {
    const data = await this.estudianteService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Estudiante por ID' })
  @ApiParam({ name: 'id', description: 'ID del Estudiante' })
  @ApiResponse({ status: 200, description: 'Estudiante encontrado' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.estudianteService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Estudiante' })
  @ApiParam({ name: 'id', description: 'ID del Estudiante' })
  @ApiBody({ type: UpdateEstudianteDto })
  @ApiResponse({ status: 200, description: 'Estudiante actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateEstudianteDto: UpdateEstudianteDto
  ) {
    const data = await this.estudianteService.update(id, updateEstudianteDto);
    return {
      success: true,
      message: 'Estudiante actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Estudiante' })
  @ApiParam({ name: 'id', description: 'ID del Estudiante' })
  @ApiResponse({ status: 200, description: 'Estudiante eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  async remove(@Param('id') id: string) {
    const estudiante = await this.estudianteService.findOne(id);
    if (estudiante.imagen) {
      const filename = estudiante.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.estudianteService.remove(id);
    return { success: true, message: 'Estudiante eliminado exitosamente' };
  }
}
