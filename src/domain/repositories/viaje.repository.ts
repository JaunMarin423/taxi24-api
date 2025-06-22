import { Viaje } from '../entities/viaje.entity';

export interface ViajeRepository {
  crearViaje(viaje: Viaje): Promise<Viaje>;
  obtenerPorId(id: string): Promise<Viaje | null>;
  actualizar(viaje: Viaje): Promise<Viaje>;
  listarActivos(): Promise<Viaje[]>;
  obtenerActivoPorPasajero(pasajeroId: string): Promise<Viaje | null>;
  obtenerActivoPorConductor(conductorId: string): Promise<Viaje | null>;
}