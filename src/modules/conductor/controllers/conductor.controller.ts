import { Controller, Get, Post, Body, Query, Param, ParseFloatPipe, ParseIntPipe, NotFoundException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ConductorService } from '../services/conductor.service';
import { CrearConductorDto } from '../dtos/crear-conductor.dto';

@ApiTags('conductores')
@Controller('conductores')
export class ConductorController {
  constructor(private readonly conductorService: ConductorService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo conductor' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'El conductor ha sido creado exitosamente' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos de entrada inválidos' })
  @ApiBody({ type: CrearConductorDto })
  async crear(@Body() crearConductorDto: CrearConductorDto) {
    try {
      console.log('Creando conductor con datos:', JSON.stringify(crearConductorDto, null, 2));
      const resultado = await this.conductorService.crear(crearConductorDto);
      console.log('Conductor creado exitosamente:', JSON.stringify(resultado, null, 2));
      return resultado;
    } catch (error) {
      console.error('Error al crear conductor:', error);
      throw error; // Esto permitirá que el filtro de excepciones de NestJS maneje el error
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los conductores' })
  @ApiResponse({ status: 200, description: 'Lista de conductores' })
  async obtenerTodos() {
    return this.conductorService.obtenerTodos();
  }

  @Get('disponibles')
  @ApiOperation({ summary: 'Obtener conductores disponibles' })
  @ApiResponse({ status: 200, description: 'Lista de conductores disponibles' })
  async obtenerDisponibles() {
    return this.conductorService.obtenerDisponibles();
  }

  @Get('cercanos')
  @ApiOperation({ summary: 'Obtener conductores cercanos' })
  @ApiQuery({ name: 'lat', required: true, type: Number, description: 'Latitud de la ubicación de referencia' })
  @ApiQuery({ name: 'lng', required: true, type: Number, description: 'Longitud de la ubicación de referencia' })
  @ApiQuery({ name: 'distancia', required: false, type: Number, description: 'Distancia máxima en metros (opcional, por defecto 5000m)' })
  @ApiResponse({ status: 200, description: 'Lista de conductores cercanos' })
  async obtenerCercanos(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('distancia', new ParseIntPipe({ optional: true })) distancia = 5000
  ) {
    return this.conductorService.obtenerCercanos(lat, lng, distancia);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un conductor por ID' })
  @ApiResponse({ status: 200, description: 'Conductor encontrado' })
  @ApiResponse({ status: 404, description: 'Conductor no encontrado' })
  async obtenerPorId(@Param('id') id: string) {
    const conductor = await this.conductorService.obtenerPorId(id);
    if (!conductor) {
      throw new NotFoundException('Conductor no encontrado');
    }
    return conductor;
  }
}
