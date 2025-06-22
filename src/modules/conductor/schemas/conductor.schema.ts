import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ConductorDocument = Conductor & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Conductor {
  @ApiProperty({
    description: 'ID único del conductor',
    example: '507f1f77bcf86cd799439011',
  })
  _id!: string;

  @ApiProperty({
    description: 'Nombre completo del conductor',
    example: 'Juan Pérez',
    required: true,
  })
  @Prop({ required: true, trim: true })
  nombre!: string;

  @ApiProperty({
    description: 'Correo electrónico del conductor',
    example: 'juan.perez@ejemplo.com',
    required: true
  })
  @Prop({ 
    type: String,
    required: true, 
    lowercase: true, 
    trim: true,
    unique: true,
    index: true
  })
  email!: string;

  @ApiProperty({
    description: 'Número de teléfono del conductor',
    example: '+1234567890',
    required: true,
  })
  @Prop({ required: true, trim: true })
  telefono!: string;

  @ApiProperty({
    description: 'Número de licencia de conducir',
    example: 'LIC12345678',
    required: true,
  })
  @Prop({ required: true, trim: true, uppercase: true })
  licencia!: string;

  @ApiProperty({
    description: 'Ubicación geográfica del conductor',
    example: { type: 'Point', coordinates: [-74.5, 40.0] },
    required: true,
  })
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0]
    }
  })
  ubicacion!: {
    type: string;
    coordinates: [number, number];
  };

  @ApiProperty({
    description: 'Indica si el conductor está disponible para tomar viajes',
    example: true,
    default: false,
  })
  @Prop({ default: false })
  disponible!: boolean;

  @ApiProperty({
    description: 'Información del vehículo del conductor',
    type: () => ({
      placa: { type: String, example: 'ABC123' },
      modelo: { type: String, example: 'Toyota Corolla' },
      color: { type: String, example: 'Blanco' },
    }),
    required: true,
  })
  @Prop({
    type: {
      placa: { type: String, required: true, uppercase: true, trim: true },
      modelo: { type: String, required: true, trim: true },
      color: { type: String, required: true, trim: true },
    },
    required: true,
  })
  vehiculo!: {
    placa: string;
    modelo: string;
    color: string;
  };

  @ApiProperty({
    description: 'Calificación promedio del conductor (0-5)',
    example: 4.5,
    minimum: 0,
    maximum: 5,
    default: 0,
  })
  @Prop({ min: 0, max: 5, default: 0 })
  calificacionPromedio?: number;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del registro',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt?: Date;
}

export const ConductorSchema = SchemaFactory.createForClass(Conductor);

// Índice geoespacial para búsquedas por ubicación
ConductorSchema.index({ ubicacion: '2dsphere' });

// Índice único para email
ConductorSchema.index({ email: 1 }, { unique: true });

// Índice para búsquedas por disponibilidad
ConductorSchema.index({ disponible: 1 });

// Índice compuesto para búsquedas por ubicación y disponibilidad
ConductorSchema.index({ ubicacion: '2dsphere', disponible: 1 });
