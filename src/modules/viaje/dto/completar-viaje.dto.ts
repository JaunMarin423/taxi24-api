import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CompletarViajeDto {
  @IsNumber()
  costo!: number;

  @IsNumber()
  distancia!: number;

  @IsString()
  @IsOptional()
  notas?: string;
}
