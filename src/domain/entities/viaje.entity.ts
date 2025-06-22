export interface Ubicacion {
  lat: number;
  lng: number;
}

export type EstadoViaje = 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO';

export class Viaje {
  public readonly id: string;
  public readonly idConductor: string;
  public readonly idPasajero: string;
  public readonly origen: Ubicacion;
  public readonly destino: Ubicacion;
  public estado: EstadoViaje;
  public fechaInicio: Date;
  public fechaFin?: Date;
  public monto?: number;

  constructor(
    id: string,
    idConductor: string,
    idPasajero: string,
    origen: Ubicacion,
    destino: Ubicacion,
    estado: EstadoViaje = 'PENDIENTE',
    fechaInicio: Date = new Date(),
    fechaFin?: Date,
    monto?: number
  ) {
    this.id = id;
    this.idConductor = idConductor;
    this.idPasajero = idPasajero;
    this.origen = origen;
    this.destino = destino;
    this.estado = estado;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.monto = monto;
  }

  // Completa el viaje y calcula el monto
  completar(): void {
    if (this.estado !== 'EN_CURSO') {
      throw new Error('Solo se pueden completar viajes en curso');
    }
    
    this.estado = 'COMPLETADO';
    this.fechaFin = new Date();
    this.calcularMonto();
  }

  // Inicia el viaje
  iniciar(): void {
    if (this.estado !== 'PENDIENTE') {
      throw new Error('Solo se pueden iniciar viajes pendientes');
    }
    this.estado = 'EN_CURSO';
  }

  // Cancela el viaje
  cancelar(): void {
    if (this.estado !== 'PENDIENTE') {
      throw new Error('Solo se pueden cancelar viajes pendientes');
    }
    this.estado = 'CANCELADO';
  }

  // Verifica si el viaje está completado
  estaCompletado(): boolean {
    return this.estado === 'COMPLETADO';
  }

  // Calcula el monto basado en la distancia y tarifa
  private calcularMonto(): void {
    if (!this.fechaFin) {
      throw new Error('La fecha de fin es requerida para calcular el monto');
    }
    
    // Implementación simplificada: tarifa fija por ahora
    this.monto = 10000; // $10.000 COP
  }

  // Setter para fechaFin
  setFechaFin(fecha: Date): void {
    this.fechaFin = fecha;
  }

  // Setter para monto
  setMonto(monto: number): void {
    this.monto = monto;
  }

  // Calcula la distancia entre dos puntos usando la fórmula del semiverseno
  private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en kilómetros
  }

  // Convierte grados a radianes
  private toRad(value: number): number {
    return value * Math.PI / 180;
  }

  // Calcula la duración del viaje en minutos
  private calcularDuracion(): number {
    if (!this.fechaInicio || !this.fechaFin) return 0;
    const diffMs = this.fechaFin.getTime() - this.fechaInicio.getTime();
    return Math.ceil(diffMs / (1000 * 60)); // Convertir a minutos
  }

  // Getters
  getMonto(): number | undefined {
    return this.monto;
  }

  getFechaInicio(): Date {
    return this.fechaInicio;
  }

  getFechaFin(): Date | undefined {
    return this.fechaFin;
  }
}
  