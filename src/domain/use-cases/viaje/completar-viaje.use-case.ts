import { ViajeRepository } from '../../repositories/viaje.repository';
import { Viaje } from '../../entities/viaje.entity';

export class CompletarViajeUseCase {
  constructor(private readonly viajeRepo: ViajeRepository) {}

  async execute(viajeId: string): Promise<Viaje> {
    const viaje = await this.viajeRepo.obtenerPorId(viajeId);
    if (!viaje) {
      throw new Error('Viaje no encontrado');
    }
    
    viaje.completar();
    return await this.viajeRepo.actualizar(viaje);
  }
}
