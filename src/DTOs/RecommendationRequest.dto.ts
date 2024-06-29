import { IsArray, IsString } from 'class-validator';

export class RecommendationRequest {
  @IsArray()
  moodAnswers: string[];

  @IsString()
  contentType: string;

  @IsString()
  genre: string;
}
