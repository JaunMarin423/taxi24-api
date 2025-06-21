import { ViajeRepository } from '../../domain/repositories/viaje.repository';
import { Viaje } from '../../domain/entities/viaje.entity';

export class ViajeMongoRepository implements ViajeRepository {
  async crearViaje(viaje: Viaje): Promise<Viaje> {
    // Lógica para guardar el viaje en MongoDB
    // ...
    return viaje;
  }
}