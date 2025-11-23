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
import { CursoCulturalService } from './cursocultural.service';
import { CreateCursoCulturalDto } from './dto/create-cursocultural.dto';
import { UpdateCursoCulturalDto } from './dto/update-cursocultural.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('CursoCultural')
@ApiBearerAuth('JWT-auth')
@Controller('curso-cultural')
export class CursoCulturalController {
  constructor(
    private readonly cursoculturalService: CursoCulturalService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo CursoCultural' })
  @ApiBody({ type: CreateCursoCulturalDto })
  @ApiResponse({ status: 201, description: 'CursoCultural creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createCursoCulturalDto: CreateCursoCulturalDto) {
    const data = await this.cursoculturalService.create(createCursoCulturalDto);
    return {
      success: true,
      message: 'CursoCultural creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Cursocultural' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Cursocultural' })
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
  @ApiResponse({ status: 404, description: 'Cursocultural no encontrado' })
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
    const updated = await this.cursoculturalService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { cursocultural: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los CursoCulturals' })
  @ApiResponse({ status: 200, description: 'Lista de CursoCulturals' })
  async findAll() {
    const data = await this.cursoculturalService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener CursoCultural por ID' })
  @ApiParam({ name: 'id', description: 'ID del CursoCultural' })
  @ApiResponse({ status: 200, description: 'CursoCultural encontrado' })
  @ApiResponse({ status: 404, description: 'CursoCultural no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.cursoculturalService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar CursoCultural' })
  @ApiParam({ name: 'id', description: 'ID del CursoCultural' })
  @ApiBody({ type: UpdateCursoCulturalDto })
  @ApiResponse({ status: 200, description: 'CursoCultural actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'CursoCultural no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateCursoCulturalDto: UpdateCursoCulturalDto
  ) {
    const data = await this.cursoculturalService.update(id, updateCursoCulturalDto);
    return {
      success: true,
      message: 'CursoCultural actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar CursoCultural' })
  @ApiParam({ name: 'id', description: 'ID del CursoCultural' })
  @ApiResponse({ status: 200, description: 'CursoCultural eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'CursoCultural no encontrado' })
  async remove(@Param('id') id: string) {
    const cursocultural = await this.cursoculturalService.findOne(id);
    if (cursocultural.imagen) {
      const filename = cursocultural.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.cursoculturalService.remove(id);
    return { success: true, message: 'CursoCultural eliminado exitosamente' };
  }
}
