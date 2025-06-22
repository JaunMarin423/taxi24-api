import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VehiculoDto {
  @ApiProperty({ description: 'Placa del vehículo' })
  @IsString()
  @IsNotEmpty({ message: 'La placa es requerida' })
  placa!: string;

  @ApiProperty({ description: 'Modelo del vehículo' })
  @IsString()
  @IsNotEmpty({ message: 'El modelo es requerido' })
  modelo!: string;

  @ApiProperty({ description: 'Color del vehículo' })
  @IsString()
  @IsNotEmpty({ message: 'El color es requerido' })
  color!: string;

  @ApiProperty({ description: 'Año del vehículo', required: false })
  @IsString()
  @IsOptional()
  anio?: string;
}
