import { Module } from '@nestjs/common';
import { RecommendationService } from '../services/recommendation.service';
import { RecommendationsController } from '../controllers/recommendation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Recommendation,
  RecommendationSchema,
} from '../schemas/recommendation.schema';
import { RolesGuard } from 'src/auth/roles.guard';
import { UsersModule } from './users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recommendation.name, schema: RecommendationSchema },
    ]),
    UsersModule,
  ],
  providers: [RecommendationService, RolesGuard],
  controllers: [RecommendationsController],
})
export class RecommendationsModule {}
