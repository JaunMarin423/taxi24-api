import { Conductor as ConductorEntity } from '../../../domain/entities/conductor.entity';
import { Conductor as ConductorSchema } from '../schemas/conductor.schema';
import { Ubicacion } from '../../../domain/value-objects/ubicacion.value-object';

export class ConductorMapper {
  static toEntity(schema: ConductorSchema): ConductorEntity {
    if (!schema) throw new Error('Conductor no encontrado');
    
    const ubicacion = new Ubicacion(
      schema.ubicacion.coordinates[1], // latitud
      schema.ubicacion.coordinates[0]  // longitud
    );

    return new ConductorEntity(
      schema._id.toString(),
      schema.nombre,
      schema.email,
      schema.telefono,
      ubicacion,
      schema.disponible,
      schema.licencia,
      schema.vehiculo
    );
  }

  static toSchema(entity: ConductorEntity): Partial<ConductorSchema> {
    if (!entity) throw new Error('Conductor no encontrado');
    
    return {
      nombre: entity.nombre,
      email: entity.email,
      telefono: entity.telefono,
      licencia: entity.licencia,
      disponible: entity.disponible,
      vehiculo: entity.vehiculo,
      ubicacion: {
        type: 'Point',
        coordinates: [entity.ubicacion.longitud, entity.ubicacion.latitud]
      },
      calificacionPromedio: 0
    };
  }
}
