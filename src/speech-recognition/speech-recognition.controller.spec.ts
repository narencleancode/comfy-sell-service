import { Test, TestingModule } from '@nestjs/testing';
import { SpeechRecognitionController } from './speech-recognition.controller';

describe('SpeechRecognitionController', () => {
  let controller: SpeechRecognitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeechRecognitionController],
    }).compile();

    controller = module.get<SpeechRecognitionController>(SpeechRecognitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
