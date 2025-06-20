import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string | undefined;

  @Prop()
  email: string | undefined;
}

export const UserSchema = SchemaFactory.createForClass(User);
