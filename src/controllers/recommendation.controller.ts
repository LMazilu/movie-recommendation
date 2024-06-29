import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RecommendationService } from '../services/recommendation.service';
import { RecommendationRequest } from 'src/DTOs/RecommendationRequest.dto';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('api/recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationService) {}

  @UseGuards(RolesGuard)
  @Post()
  async getRecommendation(@Body() body: RecommendationRequest) {
    const { moodAnswers, contentType, genre } = body;
    return this.recommendationsService.getRecommendation(
      moodAnswers,
      contentType,
      genre,
    );
  }
}
