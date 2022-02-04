import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { SpeechRecognitionController } from './speech-recognition.controller';
import { SpeechRecognitionService } from './speech-recognition.service';

@Module({
  controllers: [SpeechRecognitionController],
  providers: [SpeechRecognitionService],
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
          name: 'SpeechRecognizer',
          transport: Transport.GRPC,
          options: {
              package: 'ekstep.speech_recognition',
              protoPath: [
                  join(__dirname, '../../speech-recognition/proto/speech-recognition-open-api.proto'),
                  join(__dirname, '../../speech-recognition/proto/google/api/http.proto'),
                  join(__dirname, '../../speech-recognition/proto/google/api/annotations.proto'),
                  join(__dirname, '../../speech-recognition/proto/google/protobuf/descriptor.proto'),
                ],
              url: process.env.SPEECH_SERVICE_URL,
            
          }
      }
  ])]
})
export class SpeechRecognitionModule {}
