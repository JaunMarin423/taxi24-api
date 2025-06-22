import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConductorDocument = HydratedDocument<Conductor>;

export class UbicacionSchema {
  @Prop({ type: String, enum: ['Point'], required: true, default: 'Point' })
  type: string = 'Point';

  @Prop({ type: [Number], required: true, default: [0, 0] })
  coordinates: [number, number] = [0, 0];

  constructor() {
    this.type = 'Point';
    this.coordinates = [0, 0];
  }
}

export class VehiculoSchema {
  @Prop({ required: true })
  placa: string = '';

  @Prop({ required: true })
  modelo: string = '';

  @Prop({ required: true })
  color: string = '';

  constructor() {
    this.placa = '';
    this.modelo = '';
    this.color = '';
  }
}

@Schema({ timestamps: true })
export class Conductor {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId = new Types.ObjectId();

  @Prop({ required: true })
  nombre: string = '';

  @Prop({ required: true, unique: true })
  email: string = '';

  @Prop({ required: true })
  telefono: string = '';

  @Prop({ type: UbicacionSchema, required: true })
  ubicacion: {
    type: string;
    coordinates: [number, number];
  } = {
    type: 'Point',
    coordinates: [0, 0]
  };

  @Prop({ type: Boolean, default: true })
  disponible: boolean = true;

  @Prop({ type: String, required: false })
  licencia: string = '';

  @Prop({ type: VehiculoSchema, required: false })
  vehiculo?: {
    placa: string;
    modelo: string;
    color: string;
  };

  @Prop({ type: Date, default: Date.now })
  createdAt: Date = new Date();

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date = new Date();

  constructor() {
    this.nombre = '';
    this.email = '';
    this.telefono = '';
    this.ubicacion = {
      type: 'Point',
      coordinates: [0, 0]
    };
    this.disponible = true;
    this.licencia = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export const ConductorSchema = SchemaFactory.createForClass(Conductor);

// Crear índice geoespacial para búsquedas por ubicación
ConductorSchema.index({ 'ubicacion.coordinates': '2dsphere' });
