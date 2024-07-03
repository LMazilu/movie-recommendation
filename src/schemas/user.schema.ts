import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IsOptional } from 'class-validator';
import { Recommendation, RecommendationSchema } from './recommendation.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  /**
   * The email address of the user. Must be unique.
   */
  @Prop({ required: true, unique: true })
  email: string;

  /**
   * The Google ID of the user, if they signed up with Google. Optional.
   */
  @Prop({ required: false, unique: true })
  @IsOptional()
  googleId?: string;

  /**
   * The hashed password of the user.
   */
  @Prop({ required: true })
  password: string;

  /**
   * Indicates whether the user has admin privileges.
   */
  @Prop({ required: true, default: 0 })
  isAdmin: boolean;

  /**
   * Indicates whether the user has been marked as deleted.
   */
  @Prop({ required: true, default: 0 })
  isDeleted: boolean;

  /**
   * An array of recommendations associated with the user.
   */
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
