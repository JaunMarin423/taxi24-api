import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export interface Ubicacion {
  lat: number;
  lng: number;
}

export type EstadoViaje = 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO';

export type ViajeDocument = Viaje & Document & {
  _id: any; // This will be converted to string in the repository
};

@Schema({ 
  timestamps: true
})
export class Viaje {

  @Prop({ type: String, required: false, default: null })
  idConductor: string | null = null;

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
