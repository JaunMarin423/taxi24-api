import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class IdValidationPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    // Check if it's a valid MongoDB ObjectId
    if (Types.ObjectId.isValid(value)) {
      return value;
    }
    
    // Check if it's a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(value)) {
      return value;
    }
    
    throw new BadRequestException('ID no válido. Se espera un ID de MongoDB o un UUID');
  }
}
