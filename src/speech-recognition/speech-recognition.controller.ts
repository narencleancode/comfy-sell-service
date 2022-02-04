import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpeechRecognitionService } from './speech-recognition.service';

@Controller('speech-recognition')
export class SpeechRecognitionController {
    constructor(private readonly speechRecognitionService: SpeechRecognitionService) {}

    @Post()
    @UseInterceptors(FileInterceptor('audio'))
    public async recognizeAudio(@UploadedFile() audio: Express.Multer.File): Promise<string> {
        return await this.speechRecognitionService.recognize(audio.buffer);
    }
}
