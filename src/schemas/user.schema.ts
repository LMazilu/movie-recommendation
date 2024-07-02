import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IsOptional } from 'class-validator';
import { Recommendation, RecommendationSchema } from './recommendation.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false, unique: true })
  @IsOptional()
  googleId?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: 0 })
  isAdmin: boolean;

  @Prop({ required: true, default: 0 })
  isDeleted: boolean;

  @Prop({ type: [RecommendationSchema], default: [] })
  recommendations: Recommendation[];
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
  const salt = await bcrypt.genSalt(
    parseInt(process.env.BCRYPT_SALT_ROUNDS, 10),
  );
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
