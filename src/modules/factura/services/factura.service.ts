import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Factura } from '../entities/factura.entity';
import { FacturaRepository } from '@domain/repositories/factura.repository';
import { Viaje } from '@domain/entities/viaje.entity';

@Injectable()
export class FacturaService {
  constructor(
    @Inject('FacturaRepository') private facturaRepository: FacturaRepository,
  ) {}

  async generarFactura(viaje: Viaje): Promise<Factura> {
    const factura = new Factura(viaje);
    return this.facturaRepository.crear(factura);
  }

  async obtenerPorId(id: string): Promise<Factura> {
    const factura = await this.facturaRepository.obtenerPorId(id);
    if (!factura) {
      throw new NotFoundException('Factura no encontrada');
    }
    return factura;
  }

  async listarPorPasajero(pasajeroId: string): Promise<Factura[]> {
    return this.facturaRepository.listarPorPasajero(pasajeroId);
  }

  async listarPorConductor(conductorId: string): Promise<Factura[]> {
    return this.facturaRepository.listarPorConductor(conductorId);
  }

  async listarTodas(): Promise<Factura[]> {
    return this.facturaRepository.listarTodas();
  }

  async obtenerPorViajeId(viajeId: string): Promise<Factura> {
    const factura = await this.facturaRepository.obtenerPorViajeId(viajeId);
    if (!factura) {
      throw new NotFoundException('No se encontró factura para este viaje');
    }
    return factura;
  }
}
