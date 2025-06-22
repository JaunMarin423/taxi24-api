import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum EstadoViaje {
  PENDIENTE = 'PENDIENTE',
  EN_CURSO = 'EN_CURSO',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO',
}

interface ILocation {
  type: 'Point';
  coordinates: [number, number];
}

export type ViajeDocument = Viaje & Document & {
  _id: MongooseSchema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Viaje {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id!: MongooseSchema.Types.ObjectId;

  @Prop({ 
    type: MongooseSchema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  })
  idPasajero!: MongooseSchema.Types.ObjectId;

  @Prop({ 
    type: MongooseSchema.Types.ObjectId, 
    ref: 'User' 
  })
  idConductor?: MongooseSchema.Types.ObjectId;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  })
  origen!: ILocation;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  })
  destino!: ILocation;

  @Prop({ 
    type: String, 
    enum: EstadoViaje, 
    default: EstadoViaje.PENDIENTE 
  })
  estado!: EstadoViaje;

  @Prop({ type: Date })
  fechaInicio?: Date;

  @Prop({ type: Date })
  fechaFin?: Date;

  @Prop({ type: Number })
  monto?: number;
}

export const ViajeSchema = SchemaFactory.createForClass(Viaje);

// Índices para búsquedas frecuentes
ViajeSchema.index({ idPasajero: 1 }, { background: true });
ViajeSchema.index({ idConductor: 1 }, { background: true });
ViajeSchema.index({ estado: 1 }, { background: true });
ViajeSchema.index({ 'origen': '2dsphere' }, { background: true });
ViajeSchema.index({ 'destino': '2dsphere' }, { background: true });
