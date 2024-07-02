import { IsArray, IsDefined, IsString } from 'class-validator';

export class RecommendationRequest {
  @IsString()
  @IsDefined()
  topic: string;
    

  @IsString()
  @IsDefined()
  years: string;

    
  @IsString()
  @IsDefined()
  feeling: string;
    

  @IsString()
  @IsDefined()
  moviePreference: string;
    

  @IsString()
  @IsDefined()
  platform: string;

    
  @IsString()
  @IsDefined()
  contentType: string;

    
  @IsString()
  @IsDefined()
  genre1: string;


  @IsString()
  @IsDefined()
  genre2: string;
}
