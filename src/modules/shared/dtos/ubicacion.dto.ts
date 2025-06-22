import { IsNumber, Min, Max, IsString, IsOptional } from 'class-validator';

export class UbicacionDto {
  @IsNumber()
  @Min(-90, { message: 'La latitud debe ser mayor o igual a -90' })
  @Max(90, { message: 'La latitud debe ser menor o igual a 90' })
  latitud!: number;

  @IsNumber()
  @Min(-180, { message: 'La longitud debe ser mayor o igual a -180' })
  @Max(180, { message: 'La longitud debe ser menor o igual a 180' })
  longitud!: number;

  @IsString()
  @IsOptional()
  direccion?: string;
}
