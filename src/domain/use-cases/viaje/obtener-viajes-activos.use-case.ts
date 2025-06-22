import { ViajeRepository } from '../../repositories/viaje.repository';
import { Viaje } from '../../entities/viaje.entity';

export class ObtenerViajesActivosUseCase {
  constructor(private readonly viajeRepo: ViajeRepository) {}

  async execute(): Promise<Viaje[]> {
    return await this.viajeRepo.listarActivos();
  }
}
