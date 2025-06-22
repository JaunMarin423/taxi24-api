import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ViajeRepository } from '../../domain/repositories/viaje.repository';
import { Viaje as ViajeEntity, EstadoViaje } from '../../domain/entities/viaje.entity';
import { Viaje as ViajeSchema, ViajeDocument } from '../../infrastructure/schemas/viaje.schema';

@Injectable()
export class ViajeMongoRepository implements ViajeRepository {
  constructor(
    @InjectModel(ViajeSchema.name)
    private viajeModel: Model<ViajeDocument>,
  ) {}

  private toDomain(viajeDoc: ViajeDocument | null): ViajeEntity | null {
    if (!viajeDoc) return null;
    
    // Convert MongoDB _id to string for the domain entity
    const viajeId = viajeDoc._id.toString();
    
    return new ViajeEntity(
      viajeId,
      viajeDoc.idConductor,
      viajeDoc.idPasajero,
      viajeDoc.origen,
      viajeDoc.destino,
      viajeDoc.estado as EstadoViaje,
      new Date(viajeDoc.fechaInicio),
      viajeDoc.fechaFin ? new Date(viajeDoc.fechaFin) : undefined,
      viajeDoc.monto
    );
  }

  async crearViaje(viaje: ViajeEntity): Promise<ViajeEntity> {
    const createdViaje = new this.viajeModel({
      _id: viaje.id, // Set _id explicitly
      ...viaje
    });
    const saved = await createdViaje.save();
    const result = this.toDomain(saved);
    if (!result) throw new Error('Error al crear el viaje');
    return result;
  }

  async obtenerPorId(id: string): Promise<ViajeEntity | null> {
    const viaje = await this.viajeModel.findOne({ _id: id }).exec();
    return viaje ? this.toDomain(viaje) : null;
  }

  async actualizar(viaje: ViajeEntity): Promise<ViajeEntity> {
    const { id, ...updateData } = viaje;
    const updated = await this.viajeModel
      .findOneAndUpdate({ _id: id }, updateData, { new: true })
      .exec();
    const result = this.toDomain(updated);
    if (!result) throw new Error('Error al actualizar el viaje');
    return result;
  }

  async listarActivos(): Promise<ViajeEntity[]> {
    const viajes = await this.viajeModel
      .find({ 
        estado: { $in: ['EN_CURSO', 'PENDIENTE'] } 
      })
      .exec();
    return viajes
      .map(viaje => this.toDomain(viaje))
      .filter((v): v is ViajeEntity => v !== null);
  }

  async obtenerActivoPorPasajero(pasajeroId: string): Promise<ViajeEntity | null> {
    const viaje = await this.viajeModel
      .findOne({ 
        idPasajero: pasajeroId,
        estado: { $in: ['EN_CURSO', 'PENDIENTE', 'ACTIVO'] } 
      })
      .exec();
    return viaje ? this.toDomain(viaje) : null;
  }

  async obtenerActivoPorConductor(conductorId: string): Promise<ViajeEntity | null> {
    const viaje = await this.viajeModel
      .findOne({ 
        idConductor: conductorId,
        estado: { $in: ['EN_CURSO', 'PENDIENTE', 'ACTIVO'] } 
      })
      .exec();
    return viaje ? this.toDomain(viaje) : null;
  }
}