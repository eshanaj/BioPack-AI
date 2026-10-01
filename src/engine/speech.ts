import { SupportedLanguage } from '../types/index.ts';

class SpeechController {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private isPaused = false;
  private listeners: ((state: { isSpeaking: boolean; isPaused: boolean }) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(callback: (state: { isSpeaking: boolean; isPaused: boolean }) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb({ isSpeaking: this.isSpeaking, isPaused: this.isPaused }));
  }

  public speak(text: string, lang: SupportedLanguage) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser environment.');
      return;
    }

    this.stop();

    // Clean text to avoid reading awkward abbreviations aloud
    const cleanedText = text
      .replace(/≤/g, 'less than or equal to')
      .replace(/≥/g, 'greater than or equal to')
      .replace(/cc\/m²·day/gi, 'cubic centimeters per square meter day')
      .replace(/g\/m²·day/gi, 'grams per square meter day')
      .replace(/µm/g, 'microns')
      .replace(/%/g, ' percent');

    const utterance = new SpeechSynthesisUtterance(cleanedText);

    // Map language to BCP 47 locale codes
    const langCodes: Record<SupportedLanguage, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN'
    };

    utterance.lang = langCodes[lang] || 'en-IN';
    utterance.rate = 0.95; // slightly slower for high clarity
    utterance.pitch = 1.0;

    // Try finding a matching native voice
    const voices = this.synth.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(utterance.lang.substring(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.notify();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.notify();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.isSpeaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (this.synth && this.isSpeaking && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notify();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.notify();
    }
  }

  public getState() {
    return { isSpeaking: this.isSpeaking, isPaused: this.isPaused };
  }
}

export const speechEngine = new SpeechController();
