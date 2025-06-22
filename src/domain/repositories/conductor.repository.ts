import { Conductor } from '../entities/conductor.entity';
import { Ubicacion } from '../value-objects/ubicacion.value-object';

export interface ConductorRepository {
  obtenerTodos(): Promise<Conductor[]>;
  obtenerDisponibles(): Promise<Conductor[]>;
  obtenerCercanos(ubicacion: Ubicacion, radioKm: number): Promise<Conductor[]>;
  obtenerPorId(id: string): Promise<Conductor | null>;
  guardar(conductor: Conductor): Promise<Conductor>;
}
