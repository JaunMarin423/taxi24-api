import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  IsArray, 
  IsOptional, 
  Matches,
  IsNumber,
  ArrayMinSize,
  ArrayMaxSize,
  IsIn,
  ValidateNested,
  validateOrReject
} from 'class-validator';
import { Type, Transform } from 'class-transformer';



export class UbicacionDto {
  @IsOptional()
  @IsString()
  @IsIn(['Point'], { message: 'El tipo de ubicación debe ser "Point"' })
  readonly type: string = 'Point';

  @IsArray({ message: 'Las coordenadas deben ser un arreglo' })
  @ArrayMinSize(2, { message: 'Las coordenadas deben tener exactamente 2 valores [longitud, latitud]' })
  @ArrayMaxSize(2, { message: 'Las coordenadas deben tener exactamente 2 valores [longitud, latitud]' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { each: true, message: 'Cada coordenada debe ser un número válido' })
  @Type(() => Number)
  @Transform(({ value }: { value: unknown }) => {
    if (!Array.isArray(value)) return [0, 0];
    return value.map(v => {
      const num = Number(v);
      return isNaN(num) ? 0 : num;
    });
  })
  coordinates: [number, number] = [0, 0];

  /**
   * Valida que las coordenadas estén dentro de los rangos permitidos
   * @throws {Error} Si las coordenadas no son válidas
   */
  validate(): void {
    if (!Array.isArray(this.coordinates) || this.coordinates.length !== 2) {
      throw new Error('Las coordenadas deben ser un arreglo de 2 números [longitud, latitud]');
    }

    const [longitude, latitude] = this.coordinates;
    
    if (longitude < -180 || longitude > 180) {
      throw new Error('La longitud debe estar entre -180 y 180');
    }
    
    if (latitude < -90 || latitude > 90) {
      throw new Error('La latitud debe estar entre -90 y 90');
    }
  }
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]{2,50}$/, {
    message: 'El nombre solo puede contener letras, espacios y guiones (2-50 caracteres)',
  })
  name!: string;

  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El email no es válido' })
  @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, {
    message: 'El formato del correo electrónico no es válido',
  })
  email!: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
  })
  password!: string;

  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{7,15}$/, {
    message: 'El formato del teléfono no es válido',
  })
  telefono!: string;

  @ValidateNested()
  @Type(() => UbicacionDto)
  ubicacion!: UbicacionDto;
}