import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RecommendationDocument = HydratedDocument<Recommendation>;

@Schema()
export class Recommendation {
  @Prop({ auto: true, unique: true })
  _id!: mongoose.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  cast: string;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true })
  year: number;
}

export const RecommendationSchema =
  SchemaFactory.createForClass(Recommendation);
