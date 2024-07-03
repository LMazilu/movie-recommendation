import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RecommendationDocument = HydratedDocument<Recommendation>;

@Schema()
export class Recommendation {
  /**
   * The title of the recommended item.
   */
  @Prop({ required: true })
  title: string;

  /**
   * A description of the recommended item.
   */
  @Prop({ required: true })
  description: string;

  /**
   * The cast of the recommended item (e.g., for movies or TV shows).
   */
  @Prop({ required: true })
  cast: string;

  /**
   * The duration of the recommended item.
   */
  @Prop({ required: true })
  duration: string;

  /**
   * The year the recommended item was released or created.
   */
  @Prop({ required: true })
  year: number;
}

export const RecommendationSchema =
  SchemaFactory.createForClass(Recommendation);
