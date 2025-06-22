import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PasajeroDocument = HydratedDocument<Pasajero>;

@Schema({ timestamps: true })
export class Pasajero {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId = new Types.ObjectId();

  @Prop({ required: true })
  nombre: string = '';

  @Prop({ required: true, unique: true })
  telefono: string = '';

  @Prop({ type: { type: String, default: 'Point' }, coordinates: { type: [Number], default: [0, 0] } })
  ubicacion: {
    type: string;
    coordinates: [number, number];
  } = {
    type: 'Point',
    coordinates: [0, 0]
  };

  @Prop({ type: Date, default: Date.now })
  createdAt: Date = new Date();

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date = new Date();
}

export const PasajeroSchema = SchemaFactory.createForClass(Pasajero);

// Crear índice geoespacial para búsquedas por ubicación
PasajeroSchema.index({ 'ubicacion.coordinates': '2dsphere' });
