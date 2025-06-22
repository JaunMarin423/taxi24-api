import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UbicacionDto } from '../../shared/dtos/ubicacion.dto';

export class CrearViajeDto {
  @ApiProperty({ description: 'ID del pasajero que solicita el viaje' })
  @IsString()
  @IsNotEmpty({ message: 'El ID del pasajero es requerido' })
  pasajeroId!: string;

  @ApiProperty({ description: 'Ubicación de origen del viaje' })
  @IsNotEmpty({ message: 'La ubicación de origen es requerida' })
  origen!: UbicacionDto;

  @ApiProperty({ description: 'Ubicación de destino del viaje' })
  @IsNotEmpty({ message: 'La ubicación de destino es requerida' })
  destino!: UbicacionDto;

  @ApiProperty({ description: 'ID del conductor asignado (opcional)', required: false })
  @IsString()
  @IsOptional()
  conductorId?: string;
}
