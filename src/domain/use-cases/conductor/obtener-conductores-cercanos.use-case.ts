import { ConductorRepository } from '../../repositories/conductor.repository';
import { Conductor } from '../../entities/conductor.entity';
import { Ubicacion } from '../../value-objects/ubicacion.value-object';

export class ObtenerConductoresCercanosUseCase {
  constructor(private readonly conductorRepo: ConductorRepository) {}

  async execute(ubicacion: Ubicacion, radioKm: number = 3): Promise<Conductor[]> {
    return await this.conductorRepo.obtenerCercanos(ubicacion, radioKm);
  }
}
