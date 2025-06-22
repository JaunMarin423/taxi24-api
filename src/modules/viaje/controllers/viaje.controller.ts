import { randomUUID } from 'crypto';
import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Patch, 
  Query, 
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { IdValidationPipe } from '../../../common/pipes/id-validation.pipe';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ViajeService } from '../services/viaje.service';
import { CompletarViajeDto } from '../dto/completar-viaje.dto';
import { CompletarViajeResponseDto } from '../dto/completar-viaje-response.dto';
import { CrearViajeDto } from '../dtos/crear-viaje.dto';
import { CrearViajeParams } from '../../../domain/use-cases/crear-viaje.use-case';

@Controller('viajes')
export class ViajeController {
  constructor(private readonly viajeService: ViajeService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo viaje' })
  @ApiResponse({ status: 201, description: 'El viaje fue creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Pasajero o conductor no encontrado' })
  @ApiBody({ type: CrearViajeDto })
  async crearViaje(@Body() crearViajeDto: CrearViajeDto) {
    try {
      // Map DTO to service params
      const viajeParams: CrearViajeParams = {
        idPasajero: crearViajeDto.pasajeroId,
        idConductor: crearViajeDto.conductorId || null, // Use null instead of empty string
        origen: {
          lat: crearViajeDto.origen.latitud,
          lng: crearViajeDto.origen.longitud
        },
        destino: {
          lat: crearViajeDto.destino.latitud,
          lng: crearViajeDto.destino.longitud
        },
        estado: 'PENDIENTE',
        fechaInicio: new Date()
      };
      
      console.log('Creating trip with params:', JSON.stringify(viajeParams, null, 2));
      
      return await this.viajeService.crearViaje(viajeParams);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error, error.message);
    }
  }

  @Get('activos')
  @ApiOperation({ summary: 'Obtener todos los viajes activos' })
  @ApiResponse({ status: 200, description: 'Lista de viajes activos' })
  async listarActivos() {
    return this.viajeService.obtenerViajesActivos();
  }

  @Get('pasajero/:pasajeroId')
  @ApiOperation({ summary: 'Obtener viaje activo de un pasajero' })
  @ApiResponse({ status: 200, description: 'Viaje activo del pasajero' })
  @ApiResponse({ status: 404, description: 'No se encontró un viaje activo para este pasajero' })
  async obtenerViajeActivoPorPasajero(
    @Param('pasajeroId', IdValidationPipe) pasajeroId: string
  ) {
    const viaje = await this.viajeService.obtenerViajeActivoPorPasajero(pasajeroId);
    if (!viaje) {
      throw new NotFoundException('No se encontró un viaje activo para este pasajero');
    }
    return viaje;
  }

  @Patch(':id/iniciar')
  @ApiOperation({ summary: 'Iniciar un viaje pendiente' })
  @ApiResponse({ status: 200, description: 'Viaje iniciado exitosamente' })
  @ApiResponse({ status: 400, description: 'No se puede iniciar el viaje' })
  @ApiResponse({ status: 404, description: 'Viaje no encontrado' })
  async iniciarViaje(@Param('id', IdValidationPipe) id: string) {
    try {
      const viaje = await this.viajeService.obtenerPorId(id);
      if (!viaje) {
        throw new NotFoundException('Viaje no encontrado');
      }
      
      if (viaje.estado !== 'PENDIENTE') {
        throw new BadRequestException('Solo se pueden iniciar viajes en estado PENDIENTE');
      }
      
      viaje.estado = 'EN_CURSO';
      return await this.viajeService.actualizar(viaje);
    } catch (error: any) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un viaje por ID' })
  @ApiResponse({ status: 200, description: 'Detalles del viaje' })
  @ApiResponse({ status: 404, description: 'Viaje no encontrado' })
  async obtenerPorId(@Param('id', IdValidationPipe) id: string) {
    const viaje = await this.viajeService.obtenerPorId(id);
    if (!viaje) {
      throw new NotFoundException('Viaje no encontrado');
    }
    return viaje;
  }

  @Patch(':id/completar')
  @ApiOperation({ summary: 'Completar un viaje existente' })
  @ApiResponse({ 
    status: 200, 
    description: 'Viaje completado exitosamente y factura generada',
    type: CompletarViajeResponseDto
  })
  @ApiResponse({ status: 400, description: 'No se puede completar el viaje' })
  @ApiResponse({ status: 404, description: 'Viaje no encontrado' })
  async completarViaje(
    @Param('id', IdValidationPipe) id: string,
    @Body() completarViajeDto: CompletarViajeDto
  ): Promise<CompletarViajeResponseDto> {
    try {
      const { viaje, factura } = await this.viajeService.completarViaje(id, completarViajeDto);
      return new CompletarViajeResponseDto(viaje, factura);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get('conductor/:conductorId')
  @ApiOperation({ summary: 'Obtener viaje activo de un conductor' })
  @ApiResponse({ status: 200, description: 'Viaje activo del conductor' })
  @ApiResponse({ status: 404, description: 'No se encontró un viaje activo para este conductor' })
  async obtenerViajeActivoPorConductor(
    @Param('conductorId', IdValidationPipe) conductorId: string
  ) {
    const viaje = await this.viajeService.obtenerViajeActivoPorConductor(conductorId);
    if (!viaje) {
      throw new NotFoundException('No se encontró un viaje activo para este conductor');
    }
    return viaje;
  }
}