import { ApiProperty } from '@nestjs/swagger';
import { Viaje } from '@domain/entities/viaje.entity';
import { Factura } from '../../factura/entities/factura.entity';

export class CompletarViajeResponseDto {
  constructor(viaje: Viaje, factura: Factura) {
    this.viaje = viaje;
    this.factura = factura;
  }

  @ApiProperty({
    description: 'Detalles del viaje completado',
    type: () => Viaje,
  })
  viaje: Viaje;

  @ApiProperty({
    description: 'Factura generada automáticamente',
    type: () => Factura,
  })
  factura: Factura;
}
