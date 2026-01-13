import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../dto/create-user.dto';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  })
  password: string;

  @Prop({ default: '' })
  address: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ enum: UserRole, default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
