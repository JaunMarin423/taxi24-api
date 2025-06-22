import { ConductorRepository } from '../../../domain/repositories/conductor.repository';
import { PasajeroRepository } from '../../../domain/repositories/pasajero.repository';
import { Ubicacion } from '../../value-objects/ubicacion.value-object';
import { Conductor } from '../../entities/conductor.entity';

export class ObtenerConductoresCercanosPasajeroUseCase {
  constructor(
    private readonly conductorRepo: ConductorRepository,
    private readonly pasajeroRepo: PasajeroRepository
  ) {}

  async execute(pasajeroId: string, maxResults: number = 3): Promise<Conductor[]> {
    const pasajero = await this.pasajeroRepo.obtenerPorId(pasajeroId);
    if (!pasajero) {
      throw new Error('Pasajero no encontrado');
    }

    // Obtener conductores disponibles más cercanos
    const conductoresCercanos = await this.conductorRepo.obtenerCercanos(
      pasajero.ubicacion,
      3 // Radio de 3km
    );

    // Ordenar por distancia y tomar los más cercanos
    return conductoresCercanos
      .sort((a, b) => {
        const distanciaA = pasajero.ubicacion.calcularDistanciaEnKm(a.ubicacion);
        const distanciaB = pasajero.ubicacion.calcularDistanciaEnKm(b.ubicacion);
        return distanciaA - distanciaB;
      })
      .slice(0, maxResults);
  }
}
