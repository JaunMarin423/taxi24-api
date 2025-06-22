import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pasajero } from '@domain/entities/pasajero.entity';
import { PasajeroRepository } from '@domain/repositories/pasajero.repository';
import { Pasajero as PasajeroSchema, PasajeroDocument } from '@infrastructure/schemas/pasajero.schema';

@Injectable()
export class PasajeroMongoRepository implements PasajeroRepository {
  constructor(
    @InjectModel(PasajeroSchema.name)
    private readonly pasajeroModel: Model<PasajeroDocument>,
  ) {}

  async obtenerPorId(id: string): Promise<Pasajero | null> {
    const pasajeroDoc = await this.pasajeroModel.findById(id).exec();
    if (!pasajeroDoc) return null;

    return new Pasajero(
      pasajeroDoc._id.toString(),
      pasajeroDoc.nombre,
      pasajeroDoc.telefono,
    );
  }

  async guardar(pasajero: Pasajero): Promise<void> {
    await this.pasajeroModel.updateOne(
      { _id: new Types.ObjectId(pasajero.id) },
      {
        $set: {
          nombre: pasajero.nombre,
          telefono: pasajero.telefono,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );
  }

  async obtenerTodos(): Promise<Pasajero[]> {
    const pasajeros = await this.pasajeroModel.find().exec();
    return pasajeros.map(
      (p) => new Pasajero(p._id.toString(), p.nombre, p.telefono),
    );
  }
}
