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
import { MaterialMultimediaService } from './materialmultimedia.service';
import { CreateMaterialMultimediaDto } from './dto/create-materialmultimedia.dto';
import { UpdateMaterialMultimediaDto } from './dto/update-materialmultimedia.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('MaterialMultimedia')
@ApiBearerAuth('JWT-auth')
@Controller('material-multimedia')
export class MaterialMultimediaController {
  constructor(
    private readonly materialmultimediaService: MaterialMultimediaService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo MaterialMultimedia' })
  @ApiBody({ type: CreateMaterialMultimediaDto })
  @ApiResponse({ status: 201, description: 'MaterialMultimedia creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createMaterialMultimediaDto: CreateMaterialMultimediaDto) {
    const data = await this.materialmultimediaService.create(createMaterialMultimediaDto);
    return {
      success: true,
      message: 'MaterialMultimedia creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Materialmultimedia' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Materialmultimedia' })
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
  @ApiResponse({ status: 404, description: 'Materialmultimedia no encontrado' })
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
    const updated = await this.materialmultimediaService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { materialmultimedia: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los MaterialMultimedias' })
  @ApiResponse({ status: 200, description: 'Lista de MaterialMultimedias' })
  async findAll() {
    const data = await this.materialmultimediaService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener MaterialMultimedia por ID' })
  @ApiParam({ name: 'id', description: 'ID del MaterialMultimedia' })
  @ApiResponse({ status: 200, description: 'MaterialMultimedia encontrado' })
  @ApiResponse({ status: 404, description: 'MaterialMultimedia no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.materialmultimediaService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar MaterialMultimedia' })
  @ApiParam({ name: 'id', description: 'ID del MaterialMultimedia' })
  @ApiBody({ type: UpdateMaterialMultimediaDto })
  @ApiResponse({ status: 200, description: 'MaterialMultimedia actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'MaterialMultimedia no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateMaterialMultimediaDto: UpdateMaterialMultimediaDto
  ) {
    const data = await this.materialmultimediaService.update(id, updateMaterialMultimediaDto);
    return {
      success: true,
      message: 'MaterialMultimedia actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar MaterialMultimedia' })
  @ApiParam({ name: 'id', description: 'ID del MaterialMultimedia' })
  @ApiResponse({ status: 200, description: 'MaterialMultimedia eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'MaterialMultimedia no encontrado' })
  async remove(@Param('id') id: string) {
    const materialmultimedia = await this.materialmultimediaService.findOne(id);
    if (materialmultimedia.imagen) {
      const filename = materialmultimedia.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.materialmultimediaService.remove(id);
    return { success: true, message: 'MaterialMultimedia eliminado exitosamente' };
  }
}
