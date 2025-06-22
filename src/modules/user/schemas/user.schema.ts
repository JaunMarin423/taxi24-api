import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export interface ILocation {
  type: 'Point';
  coordinates: [number, number];
}

// Base user interface with all the properties
export interface IUser extends Document {
  _id: MongooseSchema.Types.ObjectId;
  name: string;
  email: string;
  telefono: string;
  password: string;
  ubicacion: ILocation;
  createdAt: Date;
  updatedAt: Date;
  toObject(): Omit<this, keyof Document> & { _id: MongooseSchema.Types.ObjectId };
}

// This represents a plain JavaScript object version of the user
export type UserDocument = IUser;

@Schema({
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
  toObject: { 
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id!: MongooseSchema.Types.ObjectId;

  @Prop({ 
    type: String, 
    required: [true, 'El nombre es requerido'],
    trim: true
  })
  name!: string;

  @Prop({
    type: String,
    required: [true, 'El correo electrónico es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un correo electrónico válido'],
  })
  email!: string;

  @Prop({ 
    type: String, 
    required: [true, 'La contraseña es requerida'],
    select: false,
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  })
  password!: string;

  @Prop({ 
    type: String, 
    required: [true, 'El teléfono es requerido'],
    trim: true
  })
  telefono!: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0]
    }
  })
  ubicacion!: ILocation;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Crear índice geoespacial para búsquedas por ubicación
UserSchema.index({ 'ubicacion': '2dsphere' }, { background: true });
