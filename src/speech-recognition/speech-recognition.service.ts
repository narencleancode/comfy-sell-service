import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { SpeechRecognizerClient, SpeechRecognitionRequest, Language_LanguageCode, RecognitionConfig_Domain, RecognitionConfig_AudioFormat } from './generated/speech-recognition-open-api'


@Injectable()
export class SpeechRecognitionService implements OnModuleInit {
    private speechClient: SpeechRecognizerClient;
    constructor(@Inject('SpeechRecognizer') private client: ClientGrpc) {}
    
    onModuleInit() {
        this.speechClient = this.client.getService<SpeechRecognizerClient>('SpeechRecognizer');
    }

    async recognize(audio: Buffer): Promise<string> { 
        return new Promise((resolve, reject) => {
            try {
                this.speechClient.recognize({
                    config: {domain: [RecognitionConfig_Domain.UNRECOGNIZED],language: {sourceLanguage: Language_LanguageCode.en}, audioFormat: RecognitionConfig_AudioFormat.mp3},
                    audio: [{audioContent: audio}]
                }).subscribe(out => {
                    console.log(out);
                    resolve(out.output[0].source)
                });
            } catch(err) {
                console.error(err);
                reject(err)
            }

        })

    }
}
