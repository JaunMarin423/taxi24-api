import { Controller, Get, Param, UseGuards, ParseUUIDPipe, NotFoundException, ParseUUIDPipeOptions } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiExcludeEndpoint } from '@nestjs/swagger';
import { FacturaService } from '../services/factura.service';
import { Factura } from '../entities/factura.entity';

@ApiTags('Facturas')
@Controller('facturas')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las facturas' })
  @ApiResponse({ status: 200, description: 'Lista de todas las facturas', type: [Factura] })
  async listarTodas(): Promise<Factura[]> {
    return this.facturaService.listarTodas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una factura por ID' })
  @ApiParam({ name: 'id', description: 'ID de la factura' })
  @ApiResponse({ status: 200, description: 'Factura encontrada', type: Factura })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  async obtenerPorId(@Param('id') id: string): Promise<Factura> {
    try {
      return await this.facturaService.obtenerPorId(id);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener la factura';
      throw new NotFoundException(errorMessage);
    }
  }

  @Get('pasajero/:pasajeroId')
  @ApiOperation({ summary: 'Obtener facturas por ID de pasajero' })
  @ApiParam({ name: 'pasajeroId', description: 'ID del pasajero' })
  @ApiResponse({ status: 200, description: 'Lista de facturas del pasajero', type: [Factura] })
  @ApiExcludeEndpoint()
  async listarPorPasajero(
    @Param('pasajeroId', ParseUUIDPipe) pasajeroId: string,
  ): Promise<Factura[]> {
    return this.facturaService.listarPorPasajero(pasajeroId);
  }


  @Get('viaje/:viajeId')
  @ApiOperation({ summary: 'Obtener factura por ID de viaje' })
  @ApiParam({ name: 'viajeId', description: 'ID del viaje' })
  @ApiResponse({ status: 200, description: 'Factura encontrada', type: Factura })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  @ApiExcludeEndpoint()
  async obtenerPorViajeId(
    @Param('viajeId') viajeId: string,
  ): Promise<Factura> {
    try {
      return await this.facturaService.obtenerPorViajeId(viajeId);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener la factura';
      throw new NotFoundException(errorMessage);
    }
  }
}
