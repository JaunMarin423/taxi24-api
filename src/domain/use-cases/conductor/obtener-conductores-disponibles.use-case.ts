import { ConductorRepository } from '../../repositories/conductor.repository';
import { Conductor } from '../../entities/conductor.entity';

export class ObtenerConductoresDisponiblesUseCase {
  constructor(private readonly conductorRepo: ConductorRepository) {}

  async execute(): Promise<Conductor[]> {
    return await this.conductorRepo.obtenerDisponibles();
  }
}
