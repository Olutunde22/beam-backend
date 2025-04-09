import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('Health Check', () => {
    it('should return "Hello World!"', () => {
      expect(appController.healthChecks()).toBe('Hello World!');
    });
  });
});
