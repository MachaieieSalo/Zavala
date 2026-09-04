import { LanguageVariation, VoiceProfile, ToneOption, VariationCode, LanguageCode } from '../types';

export const LANGUAGE_GROUPS: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'pt', label: 'Português', flag: '🇵🇹/🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸/🇬🇧' },
];

export const LANGUAGE_VARIATIONS: LanguageVariation[] = [
  // Português
  {
    code: 'pt-BR',
    langGroup: 'pt',
    name: 'Português (Brasil)',
    nativeName: 'Português Brasileiro',
    flag: '🇧🇷',
    accentLabel: 'Sotaque Brasileiro',
    description: 'Cadência fluida e acolhedora característica do Brasil.',
    defaultSampleText:
      'Olá! Bem-vindo ao nosso conversor inteligente de texto para áudio. Você pode digitar qualquer mensagem, escolher sua voz favorita e baixar o arquivo MP3 com qualidade impecável.',
    promptDirective:
      'Speak in natural, warm Brazilian Portuguese with an authentic Brazilian accent (Português do Brasil).',
  },
  {
    code: 'pt-PT',
    langGroup: 'pt',
    name: 'Português (Portugal)',
    nativeName: 'Português Europeu',
    flag: '🇵🇹',
    accentLabel: 'Sotaque Europeu',
    description: 'Pronúncia europeia ritmada e refinada de Portugal.',
    defaultSampleText:
      'Viva! Seja muito bem-vindo a esta aplicação de conversão de texto para voz. Aqui pode transformar as suas palavras em áudio cristalino e descarregar de imediato o ficheiro em formato MP3.',
    promptDirective:
      'Speak in authentic European Portuguese with standard Lisbon/Portugal pronunciation, rhythm, and cadence (Português de Portugal).',
  },
  {
    code: 'pt-AO',
    langGroup: 'pt',
    name: 'Português (Angola)',
    nativeName: 'Português Angolano',
    flag: '🇦🇴',
    accentLabel: 'Sotaque Angolano',
    description: 'Entonação calorosa e cadenciada de Luanda e Angola.',
    defaultSampleText:
      'Olá, tudo bem? Estamos muito felizes por receber-te aqui. Experimenta converter esta mensagem em voz e confere como fica excelente para guardar no teu telemóvel.',
    promptDirective:
      'Speak in authentic Angolan Portuguese with a warm, melodic Angolan cadence and pronunciation (Português de Angola).',
  },
  {
    code: 'pt-MZ',
    langGroup: 'pt',
    name: 'Português (Moçambique)',
    nativeName: 'Português Moçambicano',
    flag: '🇲🇿',
    accentLabel: 'Sotaque Moçambicano',
    description: 'Tom distinto, pausado e musical de Moçambique.',
    defaultSampleText:
      'Bom dia a todos! Esta ferramenta permite criar ficheiros de áudio com muita facilidade. Selecione a voz que mais gosta e faça o download em segundos.',
    promptDirective:
      'Speak in authentic Mozambican Portuguese with expressive, clear Mozambican intonation (Português de Moçambique).',
  },

  // English
  {
    code: 'en-US',
    langGroup: 'en',
    name: 'English (United States)',
    nativeName: 'American English',
    flag: '🇺🇸',
    accentLabel: 'American Accent',
    description: 'General American accent, clear, dynamic, and versatile.',
    defaultSampleText:
      'Welcome to the text-to-speech studio! Transform any written script into high-fidelity speech and download your polished MP3 file in seconds.',
    promptDirective:
      'Speak in clear General American English with a natural and modern US accent.',
  },
  {
    code: 'en-GB',
    langGroup: 'en',
    name: 'English (United Kingdom)',
    nativeName: 'British English',
    flag: '🇬🇧',
    accentLabel: 'British Accent',
    description: 'Standard British (RP) accent, articulate and elegant.',
    defaultSampleText:
      'Good day! Convert your written words into crystal-clear spoken audio effortlessly. Select your preferred voice and download the resulting MP3 track.',
    promptDirective:
      'Speak in refined British English with standard Received Pronunciation (crisp UK accent).',
  },
  {
    code: 'en-AU',
    langGroup: 'en',
    name: 'English (Australia)',
    nativeName: 'Australian English',
    flag: '🇦🇺',
    accentLabel: 'Australian Accent',
    description: 'Friendly, upbeat, and authentic Australian cadence.',
    defaultSampleText:
      'G’day! Welcome aboard. Give this speech generator a spin, choose the voice you reckon fits best, and grab your fresh MP3 recording right away.',
    promptDirective:
      'Speak in warm Australian English with a natural, friendly Australian accent (Aussie cadence).',
  },
  {
    code: 'en-CA',
    langGroup: 'en',
    name: 'English (Canada)',
    nativeName: 'Canadian English',
    flag: '🇨🇦',
    accentLabel: 'Canadian Accent',
    description: 'Smooth, natural Canadian inflection and clarity.',
    defaultSampleText:
      'Hello there! Enjoy converting your scripts into seamless audio. Adjust the voice tone to your liking and download your MP3 whenever you are ready.',
    promptDirective:
      'Speak in smooth Canadian English with standard Canadian pronunciation and gentle inflection.',
  },
];

export const VOICE_PROFILES: VoiceProfile[] = [
  {
    name: 'Kore',
    displayName: 'Kore',
    gender: 'Feminino',
    character: 'Acolhedora & Expressiva',
    pitchDescription: 'Equilibrada, natural e ideal para narrações e vídeos',
    avatarColor: 'from-rose-500 to-amber-500',
  },
  {
    name: 'Fenrir',
    displayName: 'Fenrir',
    gender: 'Masculino',
    character: 'Profunda & Confiante',
    pitchDescription: 'Tom encorpado, autoritário, ótimo para anúncios e podcasts',
    avatarColor: 'from-blue-600 to-indigo-700',
  },
  {
    name: 'Puck',
    displayName: 'Puck',
    gender: 'Masculino',
    character: 'Jovem & Dinâmica',
    pitchDescription: 'Entonação ágil e amigável, excelente para tutoriais',
    avatarColor: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Zephyr',
    displayName: 'Zephyr',
    gender: 'Feminino',
    character: 'Suave & Melódica',
    pitchDescription: 'Calma, límpida e relaxante, perfeita para meditação e audiolivros',
    avatarColor: 'from-violet-500 to-purple-600',
  },
  {
    name: 'Charon',
    displayName: 'Charon',
    gender: 'Masculino',
    character: 'Madura & Formal',
    pitchDescription: 'Ponderada, séria e sóbria para jornalismo e relatórios',
    avatarColor: 'from-slate-600 to-zinc-800',
  },
];

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: 'natural',
    label: 'Natural',
    description: 'Conversação cotidiana equilibrada',
    iconName: 'MessageSquare',
    promptInstruction: 'Deliver in a natural, conversational, and balanced tone.',
  },
  {
    id: 'cheerful',
    label: 'Animado',
    description: 'Entusiasmado, positivo e vibrante',
    iconName: 'Sparkles',
    promptInstruction: 'Deliver cheerfully with enthusiasm, warmth, and bright energy.',
  },
  {
    id: 'formal',
    label: 'Noticioso / Formal',
    description: 'Profissional, claro e objetivo',
    iconName: 'Building',
    promptInstruction: 'Deliver in an authoritative, professional, and clear broadcasting style.',
  },
  {
    id: 'calm',
    label: 'Calmo / Relaxante',
    description: 'Sereno, pausado e relaxante',
    iconName: 'Moon',
    promptInstruction: 'Deliver in a calm, soothing, soft, and unhurried pacing.',
  },
  {
    id: 'narrative',
    label: 'Audiolivro',
    description: 'Envolvente para histórias e contos',
    iconName: 'BookOpen',
    promptInstruction: 'Deliver like a skilled audiobook narrator, with nuanced emotional pauses.',
  },
];

export function getVariation(code: VariationCode): LanguageVariation {
  return (
    LANGUAGE_VARIATIONS.find((v) => v.code === code) ||
    LANGUAGE_VARIATIONS[0]
  );
}

export function getVoice(name: string): VoiceProfile {
  return (
    VOICE_PROFILES.find((v) => v.name === name) ||
    VOICE_PROFILES[0]
  );
}
