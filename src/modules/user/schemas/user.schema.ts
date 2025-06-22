import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ type: String, required: true })
  name: string | undefined;

  @Prop({ type: String })
  email: string | undefined;
}

export const UserSchema = SchemaFactory.createForClass(User);
