import { Pasajero } from '../entities/pasajero.entity';

export interface PasajeroRepository {
  obtenerPorId(id: string): Promise<Pasajero | null>;
  guardar(pasajero: Pasajero): Promise<void>;
  obtenerTodos(): Promise<Pasajero[]>;
}
