import { Ubicacion } from '../value-objects/ubicacion.value-object';

export class Pasajero {
  constructor(
    public readonly id: string,
    public nombre: string,
    public telefono: string,
    public ubicacion: Ubicacion = new Ubicacion(0, 0)
  ) {}

  // Métodos de negocio puros aquí, sin dependencias externas
}