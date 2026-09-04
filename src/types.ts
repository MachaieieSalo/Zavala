export type LanguageCode = 'pt' | 'en';

export type VariationCode =
  | 'pt-BR'
  | 'pt-PT'
  | 'pt-AO'
  | 'pt-MZ'
  | 'en-US'
  | 'en-GB'
  | 'en-AU'
  | 'en-CA';

export type VoiceName = 'Kore' | 'Puck' | 'Fenrir' | 'Zephyr' | 'Charon';

export type ToneStyle = 'natural' | 'cheerful' | 'formal' | 'calm' | 'narrative';

export interface LanguageVariation {
  code: VariationCode;
  langGroup: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  accentLabel: string;
  description: string;
  defaultSampleText: string;
  promptDirective: string;
}

export interface VoiceProfile {
  name: VoiceName;
  displayName: string;
  gender: 'Feminino' | 'Masculino';
  character: string;
  pitchDescription: string;
  avatarColor: string;
}

export interface ToneOption {
  id: ToneStyle;
  label: string;
  description: string;
  iconName: string;
  promptInstruction: string;
}

export interface TTSRequest {
  text: string;
  language: LanguageCode;
  variation: VariationCode;
  voice: VoiceName;
  tone: ToneStyle;
  speed?: number;
}

export interface TTSResponse {
  audioBase64: string;
  mimeType: string;
  durationSeconds: number;
  fileSizeBytes: number;
  fileName: string;
  text: string;
  voice: VoiceName;
  variation: VariationCode;
  createdAt: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  text: string;
  variation: VariationCode;
  voice: VoiceName;
  tone: ToneStyle;
  audioBase64: string;
  fileName: string;
  durationSeconds: number;
  fileSizeBytes: number;
}
