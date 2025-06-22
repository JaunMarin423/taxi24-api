import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';
import { Conductor } from '@domain/entities/conductor.entity';
import { Ubicacion } from '@domain/value-objects/ubicacion.value-object';
import { ConductorRepository } from '@domain/repositories/conductor.repository';
import { Conductor as ConductorSchema, ConductorDocument } from '@infrastructure/schemas/conductor.schema';

@Injectable()
export class ConductorMongoRepository implements ConductorRepository {
  constructor(
    @InjectModel(ConductorSchema.name)
    private conductorModel: Model<ConductorDocument>,
  ) {}

  private toDomain(conductorDoc: ConductorDocument | null): Conductor | null {
    if (!conductorDoc) return null;
    
    try {
      const ubicacion = new Ubicacion(
        conductorDoc.ubicacion.coordinates[1], // latitud
        conductorDoc.ubicacion.coordinates[0]  // longitud
      );

      return new Conductor(
        conductorDoc._id.toString(),
        conductorDoc.nombre,
        conductorDoc.email,
        conductorDoc.telefono,
        ubicacion,
        conductorDoc.disponible,
        conductorDoc.licencia,
        conductorDoc.vehiculo
      );
    } catch (error) {
      console.error('Error mapping conductor document to domain:', error);
      return null;
    }
  }

  async obtenerTodos(): Promise<Conductor[]> {
    try {
      const conductores = await this.conductorModel.find().lean<ConductorDocument[]>().exec();
      return conductores
        .map(doc => this.toDomain(doc))
        .filter((conductor): conductor is Conductor => conductor !== null);
    } catch (error) {
      console.error('Error en obtenerTodos:', error);
      return [];
    }
  }

  async obtenerDisponibles(): Promise<Conductor[]> {
    try {
      const conductores = await this.conductorModel
        .find({ disponible: true })
        .lean<ConductorDocument[]>()
        .exec();
      
      return conductores
        .map(doc => this.toDomain(doc))
        .filter((conductor): conductor is Conductor => conductor !== null);
    } catch (error) {
      console.error('Error en obtenerDisponibles:', error);
      return [];
    }
  }

  async obtenerCercanos(ubicacion: Ubicacion, radioKm: number = 3): Promise<Conductor[]> {
    try {
      const { latitud, longitud } = ubicacion;
      
      const query: FilterQuery<ConductorDocument> = {
        disponible: true,
        'ubicacion.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitud, latitud],
            },
            $maxDistance: radioKm * 1000, // Convert km to meters
          },
        },
      };

      const conductores = await this.conductorModel
        .find(query)
        .limit(3) // Limitar a los 3 conductores más cercanos
        .lean<ConductorDocument[]>()
        .exec();

      return conductores
        .map(doc => this.toDomain(doc))
        .filter((conductor): conductor is Conductor => conductor !== null);
    } catch (error) {
      console.error('Error en obtenerCercanos:', error);
      return [];
    }
  }

  async obtenerPorId(id: string): Promise<Conductor | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }
      const conductor = await this.conductorModel
        .findById(id)
        .lean<ConductorDocument>()
        .exec();
      return this.toDomain(conductor);
    } catch (error) {
      console.error(`Error en obtenerPorId(${id}):`, error);
      return null;
    }
  }

  async guardar(conductor: Conductor): Promise<Conductor> {
    console.log('Iniciando guardar conductor en repositorio');
    try {
      const { id, ...conductorData } = conductor;
      
      console.log('Datos del conductor a guardar:', {
        id,
        ...conductorData,
        ubicacion: {
          latitud: conductor.ubicacion.latitud,
          longitud: conductor.ubicacion.longitud
        }
      });

      const conductorDataToSave = {
        ...conductorData,
        ubicacion: {
          type: 'Point',
          coordinates: [
            conductor.ubicacion.longitud,
            conductor.ubicacion.latitud
          ],
        },
      };

      console.log('Datos a guardar en MongoDB:', conductorDataToSave);

      if (id) {
        console.log('Actualizando conductor existente con ID:', id);
        const conductorActualizado = await this.conductorModel
          .findOneAndUpdate(
            { _id: new Types.ObjectId(id) },
            { $set: conductorDataToSave },
            { new: true }
          )
          .exec();
        
        console.log('Conductor actualizado en MongoDB:', conductorActualizado);
        const resultado = this.toDomain(conductorActualizado) || conductor;
        console.log('Conductor convertido a dominio:', resultado);
        return resultado;
      } else {
        console.log('Creando nuevo conductor');
        
        // Create a new document instance and save it
        const nuevoConductor = new this.conductorModel({
          ...conductorDataToSave,
          _id: new Types.ObjectId()  // Explicitly set a new ObjectId
        });
        
        const conductorGuardado = await nuevoConductor.save();
        console.log('Conductor guardado en MongoDB:', conductorGuardado);
        
        // Map the saved document back to domain model
        const ubicacion = new Ubicacion(
          conductorGuardado.ubicacion.coordinates[1],
          conductorGuardado.ubicacion.coordinates[0]
        );
        
        const resultado = new Conductor(
          conductorGuardado._id.toString(),
          conductorGuardado.nombre,
          conductorGuardado.email,
          conductorGuardado.telefono,
          ubicacion,
          conductorGuardado.disponible,
          conductorGuardado.licencia,
          conductorGuardado.vehiculo
        );
        
        console.log('Nueva instancia de Conductor creada:', resultado);
        return resultado;
      }
    } catch (error: any) {
      console.error('Error en guardar conductor:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        ...error
      });
      throw error; // Re-lanzar para manejar el error en capas superiores
    }
  }
}
