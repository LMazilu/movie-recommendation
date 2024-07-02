import { Controller, Post, Body, UseGuards, Param } from '@nestjs/common';
import { RecommendationService } from '../services/recommendation.service';
import { RecommendationRequest } from 'src/DTOs/RecommendationRequest.dto';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('api/recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationService) {}

  @UseGuards(RolesGuard)
  @Post()
  async getRecommendation(@Body() body: RecommendationRequest) {
    return this.recommendationsService.getFinalRecommendation(body);
  }

  @Post(':topic')
  async getRecommendationsByTopic(@Param('topic') topic: string) {
    return this.recommendationsService.getRecommendationsByTopic(topic);
  }
}
