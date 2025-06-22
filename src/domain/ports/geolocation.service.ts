import { Ubicacion } from '../value-objects/ubicacion.value-object';

export interface IGeolocationService {
  /**
   * Calcula la distancia en kilómetros entre dos ubicaciones geográficas
   * @param origen Ubicación de origen
   * @param destino Ubicación de destino
   * @returns Distancia en kilómetros
   */
  calcularDistancia(origen: Ubicacion, destino: Ubicacion): number;

  /**
   * Encuentra ubicaciones dentro de un radio específico desde un punto dado
   * @param puntoReferencia Punto de referencia para la búsqueda
   * @param ubicaciones Lista de ubicaciones a evaluar
   * @param radioKm Radio en kilómetros
   * @returns Lista de ubicaciones que están dentro del radio especificado
   */
  encontrarDentroDelRadio(
    puntoReferencia: Ubicacion,
    ubicaciones: { id: string; ubicacion: Ubicacion }[],
    radioKm: number,
  ): { id: string; ubicacion: Ubicacion; distanciaKm: number }[];
}
