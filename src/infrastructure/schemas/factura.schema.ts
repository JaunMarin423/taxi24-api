import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type FacturaDocument = Factura & Document;

@Schema({ timestamps: true })
export class Factura {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  viajeId!: string;

  @Prop({ required: true })
  pasajeroId!: string;

  @Prop({ required: true })
  conductorId!: string;

  @Prop({ required: true })
  monto!: number;

  @Prop({ required: true })
  fechaEmision!: Date;

  @Prop({ required: true })
  fechaViaje!: Date;

  @Prop({ type: Object, required: true })
  origen!: { lat: number; lng: number };

  @Prop({ type: Object, required: true })
  destino!: { lat: number; lng: number };

  @Prop({ type: [String], required: true })
  detalles!: string[];

  @Prop({ required: true })
  impuesto!: number;

  @Prop({ required: true })
  subtotal!: number;

  @Prop({ required: true })
  total!: number;
}

export const FacturaSchema = SchemaFactory.createForClass(Factura);
