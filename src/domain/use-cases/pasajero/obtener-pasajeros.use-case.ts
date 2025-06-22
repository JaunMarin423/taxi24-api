import { PasajeroRepository } from '@domain/repositories/pasajero.repository';
import { Pasajero } from '../../entities/pasajero.entity';

export class ObtenerPasajerosUseCase {
  constructor(private readonly pasajeroRepo: PasajeroRepository) {}

  async execute(): Promise<Pasajero[]> {
    return await this.pasajeroRepo.obtenerTodos();
  }
}
