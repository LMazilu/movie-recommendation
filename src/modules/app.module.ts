import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth.module';
import { UsersModule } from './users.module';
import { RecommendationsModule } from './recommendation.module';
import { LoggingMiddleware } from 'src/middlewares/loggingHandler';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI ?? ''),
    AuthModule,
    UsersModule,
    RecommendationsModule,
  ],
})
export class AppModule implements NestModule {
  /**
   * Middlewares configurations
   *
   * @param {MiddlewareConsumer} consumer - The consumer object for applying middleware.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
