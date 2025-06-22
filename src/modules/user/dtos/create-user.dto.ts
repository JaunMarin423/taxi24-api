import { IsEmail, IsNotEmpty, IsString, IsObject, IsArray, ValidateNested, IsOptional, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class UbicacionDto {
  @IsOptional()
  @IsString()
  readonly type: string = 'Point';

  @IsOptional()
  @IsArray()
  readonly coordinates: number[] = [0, 0];
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El email no es válido' })
  email!: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString()
  password!: string;

  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @IsString()
  @Matches(/^[0-9+\-\s()]+$/, { message: 'El número de teléfono no es válido' })
  telefono!: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UbicacionDto)
  ubicacion: UbicacionDto = new UbicacionDto();
}