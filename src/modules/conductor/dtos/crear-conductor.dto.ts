import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsArray, ArrayMinSize, ArrayMaxSize, IsNumber, IsEmail, IsIn } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { VehiculoDto } from './vehiculo.dto';

class UbicacionDto {
  @ApiProperty({ 
    enum: ['Point'], 
    default: 'Point',
    description: 'Tipo de geometría GeoJSON (siempre "Point")'
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['Point'], { message: 'El tipo de ubicación debe ser "Point"' })
  type: 'Point' = 'Point';

  @ApiProperty({ 
    type: [Number], 
    description: '[longitud, latitud]',
    example: [-74.5, 40],
    items: {
      type: 'number',
      minimum: -180,
      maximum: 180
    }
  })
  @IsArray({ message: 'Las coordenadas deben ser un arreglo' })
  @ArrayMinSize(2, { message: 'Las coordenadas deben tener exactamente 2 valores [longitud, latitud]' })
  @ArrayMaxSize(2, { message: 'Las coordenadas deben tener exactamente 2 valores [longitud, latitud]' })
  @IsNumber({}, { 
    each: true, 
    message: 'Cada coordenada debe ser un número' 
  })
  @Transform(({ value }) => {
    if (!Array.isArray(value)) return [0, 0];
    return value.map((v: any) => {
      const num = Number(v);
      return isNaN(num) ? 0 : num;
    });
  })
  coordinates!: [number, number];

  constructor(partial: Partial<UbicacionDto>) {
    if (partial) {
      this.type = partial.type || 'Point';
      if (partial.coordinates) {
        this.coordinates = [
          Number(partial.coordinates[0]) || 0,
          Number(partial.coordinates[1]) || 0
        ] as [number, number];
      } else {
        this.coordinates = [0, 0];
      }
    } else {
      this.coordinates = [0, 0];
    }
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
