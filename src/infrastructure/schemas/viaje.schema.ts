import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export interface Ubicacion {
  lat: number;
  lng: number;
}

export type EstadoViaje = 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO';

export type ViajeDocument = Viaje & Document;

@Schema({ 
  timestamps: true,
  _id: false // Disable automatic _id generation since we're using our own id field
})
export class Viaje {
  @Prop({ 
    type: String, 
    required: true,
    unique: true,
    index: true
  })
  _id!: string; // Use _id as the primary key but with string type

  @Prop({ type: String, required: true })
  idConductor!: string;

  @Prop({ type: String, required: true })
  idPasajero!: string;

  @Prop({
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    _id: false,
    required: true
  })
  origen!: Ubicacion;

  @Prop({
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    _id: false,
    required: true
  })
  destino!: Ubicacion;

  @Prop({
    type: String,
    enum: ['PENDIENTE', 'EN_CURSO', 'COMPLETADO', 'CANCELADO'],
    default: 'PENDIENTE',
    required: true
  })
  estado!: EstadoViaje;

  @Prop({ type: Date, required: true })
  fechaInicio!: Date;

  @Prop({ type: Date })
  fechaFin?: Date;

  @Prop({ type: Number })
  monto?: number;
}

export const ViajeSchema = SchemaFactory.createForClass(Viaje);
