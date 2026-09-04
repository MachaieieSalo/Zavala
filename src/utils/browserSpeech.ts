export interface BrowserSpeechState {
  isSpeaking: boolean;
  isPaused: boolean;
  progress: number;
}

export class BrowserSpeechController {
  private utterance: SpeechSynthesisUtterance | null = null;
  private onStateChangeCallback: ((state: BrowserSpeechState) => void) | null = null;

  constructor() {}

  public onStateChange(cb: (state: BrowserSpeechState) => void) {
    this.onStateChangeCallback = cb;
  }

  private notify(isSpeaking: boolean, isPaused: boolean, progress = 0) {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({ isSpeaking, isPaused, progress });
    }
  }

  public speak(text: string, langCode: string = 'pt-PT', rate: number = 1.0) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Seu navegador não suporta a síntese de voz nativa.');
      return;
    }

    this.stop();

    // Map variation to standard BCP-47 tag
    let bcp47 = 'pt-PT';
    if (langCode.startsWith('pt-BR')) bcp47 = 'pt-BR';
    else if (langCode.startsWith('pt')) bcp47 = 'pt-PT';
    else if (langCode.startsWith('en-GB')) bcp47 = 'en-GB';
    else if (langCode.startsWith('en')) bcp47 = 'en-US';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = bcp47;
    utterance.rate = Math.max(0.5, Math.min(2.0, rate));

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice =
      voices.find((v) => v.lang.replace('_', '-').toLowerCase() === bcp47.toLowerCase()) ||
      voices.find((v) => v.lang.startsWith(bcp47.slice(0, 2)));

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      this.notify(true, false, 0);
    };

    utterance.onpause = () => {
      this.notify(true, true);
    };

    utterance.onresume = () => {
      this.notify(true, false);
    };

    utterance.onend = () => {
      this.notify(false, false, 100);
      this.utterance = null;
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.notify(false, false, 0);
      this.utterance = null;
    };

    this.utterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      this.notify(true, true);
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      this.notify(true, false);
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.notify(false, false, 0);
      this.utterance = null;
    }
  }
}

export const browserSpeech = new BrowserSpeechController();
