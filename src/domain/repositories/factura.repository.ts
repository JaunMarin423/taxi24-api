import { Factura } from '../../modules/factura/entities/factura.entity';

export interface FacturaRepository {
  crear(factura: Factura): Promise<Factura>;
  obtenerPorId(id: string): Promise<Factura | null>;
  listarPorPasajero(pasajeroId: string): Promise<Factura[]>;
  listarPorConductor(conductorId: string): Promise<Factura[]>;
  listarTodas(): Promise<Factura[]>;
  obtenerPorViajeId(viajeId: string): Promise<Factura | null>;
}
