import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document & {
  _id: MongooseSchema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

interface ILocation {
  type: 'Point';
  coordinates: [number, number];
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id!: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true })
  name!: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email!: string;

  @Prop({ type: String, required: true, select: false })
  password!: string;

  @Prop({ type: String, required: true })
  telefono!: string;

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
  ubicacion!: ILocation;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Crear índice geoespacial para búsquedas por ubicación
UserSchema.index({ 'ubicacion': '2dsphere' }, { background: true });
UserSchema.index({ email: 1 }, { unique: true, background: true });
