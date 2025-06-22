import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsArray, ArrayMinSize, ArrayMaxSize, IsNumber, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { VehiculoDto } from './vehiculo.dto';

class UbicacionDto {
  @ApiProperty({ enum: ['Point'], default: 'Point' })
  @IsString()
  @IsNotEmpty()
  type: 'Point' = 'Point';

  @ApiProperty({ type: [Number], description: '[longitud, latitud]' })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates!: [number, number];

  constructor(partial: Partial<UbicacionDto>) {
    Object.assign(this, partial);
  }
}

export class CrearConductorDto {
  @ApiProperty({ description: 'Nombre completo del conductor' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre!: string;

  @ApiProperty({ 
    description: 'Email del conductor', 
    example: 'correo@ejemplo.com' 
  })
  @IsEmail({}, { message: 'El formato del email no es válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email!: string;

  @ApiProperty({ description: 'Número de teléfono del conductor' })
  @IsString()
  @IsNotEmpty({ message: 'El teléfono es requerido' })
  telefono!: string;

  @ApiProperty({ 
    description: 'Ubicación actual del conductor',
    type: UbicacionDto,
    example: {
      type: 'Point',
      coordinates: [-74.5, 40]
    }
  })
  @IsNotEmpty({ message: 'La ubicación es requerida' })
  @Type(() => UbicacionDto)
  ubicacion!: UbicacionDto;

  @ApiProperty({ description: 'Número de licencia de conducir' })
  @IsString()
  @IsNotEmpty({ message: 'La licencia es requerida' })
  licencia!: string;

  @ApiProperty({ description: 'Información del vehículo' })
  @IsNotEmpty({ message: 'La información del vehículo es requerida' })
  vehiculo!: VehiculoDto;

  @ApiProperty({ description: 'Indica si el conductor está disponible', default: true })
  @IsBoolean()
  @IsOptional()
  disponible: boolean = true;
}
