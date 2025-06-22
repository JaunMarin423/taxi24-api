import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UbicacionDto } from '../../shared/dtos/ubicacion.dto';

export class CrearConductorDto {
  @ApiProperty({ description: 'Nombre completo del conductor' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre!: string;

  @ApiProperty({ description: 'Email del conductor' })
  @IsString()
  @IsNotEmpty({ message: 'El email es requerido' })
  email!: string;

  @ApiProperty({ description: 'Número de teléfono del conductor' })
  @IsString()
  @IsNotEmpty({ message: 'El teléfono es requerido' })
  telefono!: string;

  @ApiProperty({ description: 'Ubicación actual del conductor' })
  @IsNotEmpty({ message: 'La ubicación es requerida' })
  ubicacion!: UbicacionDto;

  @ApiProperty({ description: 'Número de licencia de conducir' })
  @IsString()
  @IsNotEmpty({ message: 'La licencia es requerida' })
  licencia!: string;

  @ApiProperty({ description: 'Información del vehículo' })
  @IsString()
  @IsNotEmpty({ message: 'La información del vehículo es requerida' })
  vehiculo!: string;

  @ApiProperty({ description: 'Indica si el conductor está disponible', default: true })
  @IsBoolean()
  @IsOptional()
  disponible: boolean = true;
}
