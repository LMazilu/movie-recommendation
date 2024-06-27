import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecommendationDocument = Recommendation & Document;

@Schema()
export class Recommendation {
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
