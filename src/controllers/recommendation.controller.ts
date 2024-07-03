import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Req,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { RecommendationService } from '../services/recommendation.service';
import { RecommendationRequest } from 'src/DTOs/RecommendationRequest.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Request } from 'express';

@Controller('api/recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationService) {}

  /**
   * Gets a recommendation based on the provided request body.
   *
   * @param {RecommendationRequest} body - The recommendation request body.
   * @param {Request} req - The Express request object.
   * @return {Promise<any>} A promise that resolves to the recommendation.
   * @throws {Error} If the user email is not found in the request.
   */
  @UseGuards(RolesGuard)
  @Post()
  async getRecommendation(
    @Body() body: RecommendationRequest,
    @Req() req: Request,
  ) {
    const userEmail = req.userEmail;
    if (!userEmail) {
      throw new Error('User email not found in request');
    }
    return this.recommendationsService.getFinalRecommendation(body, userEmail);
  }

  /**
   * Gets recommendations for a specific topic.
   *
   * @param {string} topic - The topic to get recommendations for.
   * @return {Promise<any>} A promise that resolves to the recommendations for the given topic.
   */
  @Post(':topic')
  async getRecommendationsByTopic(@Param('topic') topic: string) {
    return this.recommendationsService.getRecommendationsByTopic(topic);
  }

  /**
   * Gets recommendations for a specific user.
   *
   * @param {string} email - The email of the user to get recommendations for.
   * @param {Request} req - The Express request object.
   * @return {Promise<any>} A promise that resolves to the user's recommendations.
   * @throws {UnauthorizedException} If the requesting user is not authorized to access the data.
   */
  @UseGuards(RolesGuard)
  @Get(':email')
  async getUserRecommendations(
    @Param('email') email: string,
    @Req() req: Request,
  ) {
    console.log('email: ' + email);
    console.log('userEmail: ' + req.userEmail);
    const userEmail = req.userEmail;
    if (email !== userEmail && !req.isAdmin) {
      throw new UnauthorizedException("You cannot get someone else's data!");
    }
    return this.recommendationsService.getUserRecommendations(email);
  }
}
