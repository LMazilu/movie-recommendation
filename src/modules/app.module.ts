import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { LoggingMiddleware } from '../middlewares/loggingHandler';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
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
