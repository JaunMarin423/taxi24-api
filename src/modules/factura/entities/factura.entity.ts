import { Viaje } from '@domain/entities/viaje.entity';

export class Factura {
  public readonly id: string;
  public readonly viajeId: string;
  public readonly pasajeroId: string;
  public readonly conductorId: string | null;
  public readonly monto: number;
  public readonly fechaEmision: Date;
  public readonly fechaViaje: Date;
  public readonly origen: { lat: number; lng: number };
  public readonly destino: { lat: number; lng: number };
  public readonly detalles: string[];
  public readonly impuesto: number;
  public readonly subtotal: number;
  public readonly total: number;

  constructor(viaje: Viaje) {
    if (viaje.estado !== 'COMPLETADO' || !viaje.fechaFin || viaje.monto === undefined) {
      throw new Error('No se puede generar factura para un viaje no completado o sin monto');
    }

    this.id = `FAC-${Date.now()}`;
    this.viajeId = viaje.id;
    this.pasajeroId = viaje.idPasajero;
    this.conductorId = viaje.idConductor;
    this.monto = viaje.monto;
    this.fechaEmision = new Date();
    this.fechaViaje = viaje.fechaInicio;
    this.origen = viaje.origen;
    this.destino = viaje.destino;
    
    // Calcular impuestos y totales
    this.impuesto = viaje.monto * 0.19; // 19% de impuesto
    this.subtotal = viaje.monto - this.impuesto;
    this.total = viaje.monto;
    
    // Detalles de la factura
    this.detalles = [
      `Viaje desde (${viaje.origen.lat}, ${viaje.origen.lng}) hasta (${viaje.destino.lat}, ${viaje.destino.lng})`,
      `Duración: ${this.calcularDuracion(viaje.fechaInicio, viaje.fechaFin)} minutos`,
      `Tarifa base: $${this.subtotal.toFixed(2)}`,
      `Impuestos (19%): $${this.impuesto.toFixed(2)}`
    ];
  }

  private calcularDuracion(inicio: Date, fin: Date): number {
    const diffMs = fin.getTime() - inicio.getTime();
    return Math.round(diffMs / 60000); // Convertir a minutos
  }
}
