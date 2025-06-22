import { Ubicacion } from '../value-objects/ubicacion.value-object';

export class Conductor {
  constructor(
    public readonly id: string,
    public nombre: string,
    public email: string,
    public telefono: string,
    public ubicacion: Ubicacion,
    public disponible: boolean = true,
    public licencia?: string,
    public vehiculo?: {
      placa: string;
      modelo: string;
      color: string;
    }
  ) {}

  // Métodos de negocio
  marcarComoDisponible(): void {
    this.disponible = true;
  }

  marcarComoNoDisponible(): void {
    this.disponible = false;
  }

  actualizarUbicacion(ubicacion: Ubicacion): void {
    this.ubicacion = ubicacion;
  }

  estaDentroDelRadio(ubicacion: Ubicacion, radioKm: number): boolean {
    return this.ubicacion.calcularDistanciaEnKm(ubicacion) <= radioKm;
  }
}