import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { isUUID } from 'class-validator';

@Injectable()
export class ObjectIdOrUUIDPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    // Si es un ObjectId válido o un UUID válido, retornar el valor
    if (Types.ObjectId.isValid(value) || isUUID(value)) {
      return value;
    }
    
    throw new BadRequestException('ID no válido. Se espera un ObjectId o UUID');
  }
}
