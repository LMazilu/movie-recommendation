import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('recommendation')
  async getRecommendation(
    @Body() body: { moodAnswers: string[]; contentType: string; genre: string },
  ) {
    return this.appService.getRecommendation(
      body.moodAnswers,
      body.contentType,
      body.genre,
    );
  }
}
