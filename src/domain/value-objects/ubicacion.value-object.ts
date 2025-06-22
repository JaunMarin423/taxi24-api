export class Ubicacion {
  constructor(
    public readonly latitud: number,
    public readonly longitud: number,
  ) {
    this.validar();
  }

  private validar(): void {
    if (this.latitud < -90 || this.latitud > 90) {
      throw new Error('La latitud debe estar entre -90 y 90 grados');
    }
    if (this.longitud < -180 || this.longitud > 180) {
      throw new Error('La longitud debe estar entre -180 y 180 grados');
    }
  }

  calcularDistanciaEnKm(otraUbicacion: Ubicacion): number {
    // Fórmula de Haversine para calcular la distancia entre dos puntos geográficos
    const radioTierraKm = 6371;
    const dLat = this.gradosARadianes(otraUbicacion.latitud - this.latitud);
    const dLng = this.gradosARadianes(otraUbicacion.longitud - this.longitud);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.gradosARadianes(this.latitud)) *
        Math.cos(this.gradosARadianes(otraUbicacion.latitud)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radioTierraKm * c;
  }

  private gradosARadianes(grados: number): number {
    return (grados * Math.PI) / 180;
  }
}
