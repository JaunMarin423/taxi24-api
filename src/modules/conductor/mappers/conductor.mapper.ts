import { Conductor as ConductorEntity } from '../../../domain/entities/conductor.entity';
import { Conductor as ConductorSchema } from '../schemas/conductor.schema';
import { Ubicacion } from '../../../domain/value-objects/ubicacion.value-object';
import { Logger } from '@nestjs/common';

export class ConductorMapper {
  static toEntity(schema: ConductorSchema): ConductorEntity | null {
    try {
      if (!schema) {
        console.error('Error: Schema es nulo o indefinido');
        return null;
      }

      // Crear una ubicación por defecto si no existe o no es válida
      let ubicacion: Ubicacion;
      try {
        if (!schema.ubicacion || !Array.isArray(schema.ubicacion.coordinates)) {
          console.warn(`Conductor ${schema._id} no tiene ubicación válida. Usando ubicación por defecto.`);
          ubicacion = new Ubicacion(0, 0); // Ubicación por defecto
        } else {
          const [longitud, latitud] = schema.ubicacion.coordinates;
          
          if (typeof latitud !== 'number' || typeof longitud !== 'number' || 
              isNaN(latitud) || isNaN(longitud)) {
            console.warn(`Coordenadas inválidas para conductor ${schema._id}:`, schema.ubicacion.coordinates);
            ubicacion = new Ubicacion(0, 0); // Ubicación por defecto
          } else if (latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) {
            console.warn(`Coordenadas fuera de rango para conductor ${schema._id}:`, { latitud, longitud });
            ubicacion = new Ubicacion(0, 0); // Ubicación por defecto
          } else {
            ubicacion = new Ubicacion(latitud, longitud);
          }
        }
      } catch (error) {
        console.error(`Error al procesar ubicación para conductor ${schema._id}:`, error);
        ubicacion = new Ubicacion(0, 0); // Ubicación por defecto
      }

      return new ConductorEntity(
        schema._id?.toString() || '',
        schema.nombre || 'Nombre no especificado',
        schema.email || '',
        schema.telefono || '',
        ubicacion,
        schema.disponible ?? true,
        schema.licencia || 'Licencia no especificada',
        schema.vehiculo
      );
    } catch (error) {
      console.error('Error crítico en ConductorMapper.toEntity:', error);
      console.error('Datos del schema que causaron el error:', JSON.stringify(schema, null, 2));
      return null;
    }
  }

  static toSchema(entity: ConductorEntity): Partial<ConductorSchema> {
    if (!entity) throw new Error('Conductor no encontrado');
    
    try {
      // Asegurarse de que las coordenadas sean números válidos
      const longitud = Number(entity.ubicacion?.longitud);
      const latitud = Number(entity.ubicacion?.latitud);
      
      if (isNaN(latitud) || isNaN(longitud)) {
        throw new Error('Coordenadas no válidas en la entidad');
      }
      
      // Validar rangos de coordenadas
      if (latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) {
        throw new Error('Coordenadas fuera de rango: latitud debe estar entre -90 y 90, longitud entre -180 y 180');
      }
      
      const ubicacion = {
        type: 'Point',
        coordinates: [longitud, latitud] as [number, number] // MongoDB espera [longitud, latitud]
      };
      
      return {
        nombre: entity.nombre,
        email: entity.email,
        telefono: entity.telefono,
        licencia: entity.licencia,
        disponible: entity.disponible,
        vehiculo: entity.vehiculo,
        ubicacion,
        calificacionPromedio: 0
      };
    } catch (error) {
      Logger.error('Error en ConductorMapper.toSchema:', error);
      throw error;
    }
  }
}
