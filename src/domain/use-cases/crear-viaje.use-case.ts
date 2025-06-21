import { ViajeRepository } from '../repositories/viaje.repository';
import { Viaje } from '../entities/viaje.entity';

export class CrearViajeUseCase {
  constructor(private readonly viajeRepo: ViajeRepository) {}

  async execute(data: { id: string; stado: boolean; conductor: boolean }): Promise<Viaje> {
    const viaje = new Viaje(data.id, data.stado, data.conductor);
    return await this.viajeRepo.crearViaje(viaje);
  }
}