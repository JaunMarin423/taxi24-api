import { Injectable } from '@nestjs/common';
import { ViajeRepository } from '../repositories/viaje.repository';
import { Viaje } from '../entities/viaje.entity';

export type CrearViajeParams = {
  id: string;
  idConductor: string;
  idPasajero: string;
  origen: { lat: number; lng: number };
  destino: { lat: number; lng: number };
  estado?: 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO';
  fechaInicio?: Date;
};

@Injectable()
export class CrearViajeUseCase {
  constructor(private readonly viajeRepo: ViajeRepository) {}

  async execute(data: CrearViajeParams): Promise<Viaje> {
    const viaje = new Viaje(
      data.id,
      data.idConductor,
      data.idPasajero,
      data.origen,
      data.destino,
      data.estado || 'PENDIENTE',
      data.fechaInicio
    );
    return await this.viajeRepo.crearViaje(viaje);
  }
}