import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ auto: true, unique: true })
    _id!: mongoose.Types.ObjectId;
    
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: 0 })
  isAdmin: number;

  @Prop({ required: true, default: 0 })
  isDeleted: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hash password before saving the document
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  if (!process.env.BCRYPT_SALT_ROUNDS) {
    throw new Error('BCRYPT_SALT_ROUNDS is not defined');
  }
  this.password = await bcrypt.hash(
    this.password,
    process.env.BCRYPT_SALT_ROUNDS,
  );
  next();
});
