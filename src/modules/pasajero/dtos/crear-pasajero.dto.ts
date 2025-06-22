import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearPasajeroDto {
  @ApiProperty({ description: 'Nombre completo del pasajero' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre!: string;

  @ApiProperty({ description: 'Email del pasajero' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Número de teléfono del pasajero' })
  @IsString()
  @IsNotEmpty({ message: 'El teléfono es requerido' })
  telefono!: string;
}
