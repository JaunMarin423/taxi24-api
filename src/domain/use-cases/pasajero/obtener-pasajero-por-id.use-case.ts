import { PasajeroRepository } from '@domain/repositories/pasajero.repository';
import { Pasajero } from '@domain/entities/pasajero.entity';

export class ObtenerPasajeroPorIdUseCase {
  constructor(private readonly pasajeroRepo: PasajeroRepository) {}

  async execute(id: string): Promise<Pasajero | null> {
    return await this.pasajeroRepo.obtenerPorId(id);
  }
}
