/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { Observable } from 'rxjs';

export const protobufPackage = 'ekstep.speech_recognition';

export interface Message {
  audio: Uint8Array;
  user: string;
  language: string;
  speaking: boolean;
  isEnd: boolean;
}

export interface Response {
  transcription: string;
  user: string;
  language: string;
  action: string;
}

export interface SpeechRecognitionRequest {
  config: RecognitionConfig | undefined;
  audio: RecognitionAudio[];
}

export interface RecognitionConfig {
  language: Language | undefined;
  audioFormat?: RecognitionConfig_AudioFormat | undefined;
  channel?: RecognitionConfig_AudioChannel | undefined;
  samplingRate?: number | undefined;
  bitsPerSample?: RecognitionConfig_AudioBitsPerSample | undefined;
  transcriptionFormat?: RecognitionConfig_TranscriptionFormat | undefined;
  profanityFilter?: boolean | undefined;
  domain: RecognitionConfig_Domain[];
  detailed?: boolean | undefined;
  punctuation?: boolean | undefined;
  model?: RecognitionConfig_Model | undefined;
  /** optional bool enableAutomaticPunctuation = 12; */
  enableInverseTextNormalization?: boolean | undefined;
}

export enum RecognitionConfig_TranscriptionFormatEnum {
  transcript = 0,
  srt = 1,
  alternatives = 2,
  UNRECOGNIZED = -1,
}

export enum RecognitionConfig_AudioBitsPerSample {
  sixteen = 0,
  eight = 1,
  UNRECOGNIZED = -1,
}

export enum RecognitionConfig_AudioChannel {
  mono = 0,
  stereo = 1,
  UNRECOGNIZED = -1,
}

export enum RecognitionConfig_AudioFormat {
  wav = 0,
  pcm = 1,
  mp3 = 2,
  flac = 3,
  UNRECOGNIZED = -1,
}

export enum RecognitionConfig_Domain {
  GENERAL = 0,
  NEWS = 1,
  EDUCATION = 2,
  LEGAL = 3,
  GOVERNMENT_PRESS_RELEASE = 4,
  HEALTHCARE = 5,
  MOVIES = 6,
  SUBTITLES = 7,
  SPORTS = 8,
  UNRECOGNIZED = -1,
}

export enum RecognitionConfig_Model {
  command_and_search = 0,
  phone_call = 1,
  video = 2,
  default = 3,
  UNRECOGNIZED = -1,
}

export interface RecognitionConfig_TranscriptionFormat {
  value: RecognitionConfig_TranscriptionFormatEnum;
}

export interface Language {
  name?: string | undefined;
  sourceLanguage: Language_LanguageCode;
}

export enum Language_LanguageCode {
  hi = 0,
  en = 1,
  mr = 2,
  ta = 3,
  te = 4,
  kn = 5,
  gu = 6,
  pa = 7,
  bn = 8,
  ml = 9,
  as = 10,
  brx = 11,
  doi = 12,
  ks = 13,
  kok = 14,
  mai = 15,
  mni = 16,
  ne = 17,
  or = 18,
  sd = 19,
  si = 20,
  ur = 21,
  sat = 23,
  lus = 24,
  njz = 25,
  pnr = 26,
  kha = 27,
  grt = 28,
  sa = 29,
  raj = 30,
  bho = 31,
  en_bio = 32,
  UNRECOGNIZED = -1,
}

export interface RecognitionAudio {
  audioUri?: string | undefined;
  audioContent?: Uint8Array | undefined;
}

export interface SpeechRecognitionResult {
  status: SpeechRecognitionResult_Status;
  output: SpeechRecognitionResult_Output[];
  config?: RecognitionDetails | undefined;
  statusText?: string | undefined;
}

export enum SpeechRecognitionResult_Status {
  SUCCESS = 0,
  NO_MATCH = 1,
  INITIAL_SILENCE_TIMEOUT = 2,
  BABBLE_TIMEOUT = 3,
  ERROR = 4,
  UNRECOGNIZED = -1,
}

export interface SpeechRecognitionResult_Output {
  source: string;
}

export interface RecognitionDetails {
  channelTag: number;
  language: Language | undefined;
  snr: number;
  samplingRate: number;
  bitsPerSample: number;
}

export interface Alternative {
  word: string;
  startTime: string;
  endTime: string;
}

export interface PunctuateRequest {
  text: string;
  language: string;
  enabledItn: boolean;
}

export interface PunctuateResponse {
  text: string;
  language: string;
}

export const EKSTEP_SPEECH_RECOGNITION_PACKAGE_NAME =
  'ekstep.speech_recognition';

export interface SpeechRecognizerClient {
  recognize_audio(request: Observable<Message>): Observable<Response>;

  punctuate(request: PunctuateRequest): Observable<PunctuateResponse>;

  recognize(
    request: SpeechRecognitionRequest,
  ): Observable<SpeechRecognitionResult>;
}

export interface SpeechRecognizerController {
  recognize_audio(request: Observable<Message>): Observable<Response>;

  punctuate(
    request: PunctuateRequest,
  ):
    | Promise<PunctuateResponse>
    | Observable<PunctuateResponse>
    | PunctuateResponse;

  recognize(
    request: SpeechRecognitionRequest,
  ):
    | Promise<SpeechRecognitionResult>
    | Observable<SpeechRecognitionResult>
    | SpeechRecognitionResult;
}

export function SpeechRecognizerControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['punctuate', 'recognize'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('SpeechRecognizer', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = ['recognize_audio'];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('SpeechRecognizer', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const SPEECH_RECOGNIZER_SERVICE_NAME = 'SpeechRecognizer';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
