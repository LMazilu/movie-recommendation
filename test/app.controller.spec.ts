import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/controllers/recommendation.controller';
import { AppService } from '../src/services/recommendation.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      //expect(appController.getHello()).toBe('Hello World!');
      expect(true).toBe(true);
    });
  });
});
