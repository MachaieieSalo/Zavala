import React from 'react';
import {
  VariationCode,
  LanguageCode,
  VoiceName,
  ToneStyle,
} from '../types';
import {
  LANGUAGE_VARIATIONS,
  VOICE_PROFILES,
  TONE_OPTIONS,
} from '../data/languages';
import {
  Globe,
  Mic,
  Sliders,
  Gauge,
  Sparkles,
  ChevronDown,
  Wand2,
} from 'lucide-react';
import { TRANSLATIONS, SupportedLang } from '../data/translations';

interface VoiceControlsBarProps {
  selectedVariation: VariationCode;
  onSelectVariation: (code: VariationCode) => void;
  selectedVoice: VoiceName;
  onSelectVoice: (voice: VoiceName) => void;
  selectedTone: ToneStyle;
  onSelectTone: (tone: ToneStyle) => void;
  speechRate: number;
  onSpeedChange: (speed: number) => void;
  onApplySample: (text: string) => void;
  currentLang?: SupportedLang;
}

export const VoiceControlsBar: React.FC<VoiceControlsBarProps> = ({
  selectedVariation,
  onSelectVariation,
  selectedVoice,
  onSelectVoice,
  selectedTone,
  onSelectTone,
  speechRate,
  onSpeedChange,
  onApplySample,
  currentLang = 'pt',
}) => {
  const currentVarObj =
    LANGUAGE_VARIATIONS.find((v) => v.code === selectedVariation) ||
    LANGUAGE_VARIATIONS[0];

  const isPt = currentLang === 'pt';

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-700" />
          <span className="text-xs sm:text-sm font-bold text-zinc-900">
            {isPt ? 'Configuração da Voz e Sotaque' : 'Voice & Accent Setup'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onApplySample(currentVarObj.defaultSampleText)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors border border-zinc-200 cursor-pointer"
          title="Preencher com frase típica do sotaque selecionado"
        >
          <Wand2 className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">{isPt ? 'Exemplo do Sotaque' : 'Accent Sample Phrase'}</span>
          <span className="sm:hidden">{isPt ? 'Exemplo' : 'Sample'}</span>
        </button>
      </div>

      {/* Grid of Minimalist Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Regional Accent / Variation */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-zinc-500 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>{isPt ? 'Sotaque / Região' : 'Accent / Region'}</span>
          </label>
          <div className="relative">
            <select
              value={selectedVariation}
              onChange={(e) => onSelectVariation(e.target.value as VariationCode)}
              className="w-full appearance-none px-3 py-2 pr-8 text-xs font-semibold rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-hidden focus:border-zinc-400 cursor-pointer"
            >
              {isPt ? (
                <>
                  <optgroup label="Português">
                    {LANGUAGE_VARIATIONS.filter((v) => v.langGroup === 'pt').map((v) => (
                      <option key={v.code} value={v.code}>
                        {v.flag} {v.name} ({v.accentLabel})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="English">
                    {LANGUAGE_VARIATIONS.filter((v) => v.langGroup === 'en').map((v) => (
                      <option key={v.code} value={v.code}>
                        {v.flag} {v.name} ({v.accentLabel})
                      </option>
                    ))}
                  </optgroup>
                </>
              ) : (
                <>
                  <optgroup label="English">
                    {LANGUAGE_VARIATIONS.filter((v) => v.langGroup === 'en').map((v) => (
                      <option key={v.code} value={v.code}>
                        {v.flag} {v.name} ({v.accentLabel})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Português">
                    {LANGUAGE_VARIATIONS.filter((v) => v.langGroup === 'pt').map((v) => (
                      <option key={v.code} value={v.code}>
                        {v.flag} {v.name} ({v.accentLabel})
                      </option>
                    ))}
                  </optgroup>
                </>
              )}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 2. Neural Voice Persona */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-zinc-500 flex items-center gap-1">
            <Mic className="w-3.5 h-3.5 text-zinc-400" />
            <span>{isPt ? 'Voz Neural (Gemini)' : 'Neural Voice (Gemini)'}</span>
          </label>
          <div className="relative">
            <select
              value={selectedVoice}
              onChange={(e) => onSelectVoice(e.target.value as VoiceName)}
              className="w-full appearance-none px-3 py-2 pr-8 text-xs font-semibold rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-hidden focus:border-zinc-400 cursor-pointer"
            >
              {VOICE_PROFILES.map((vp) => (
                <option key={vp.name} value={vp.name}>
                  {vp.name} • {vp.gender} ({vp.character})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 3. Style / Tone */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-zinc-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>{isPt ? 'Estilo de Locução' : 'Delivery Style'}</span>
          </label>
          <div className="relative">
            <select
              value={selectedTone}
              onChange={(e) => onSelectTone(e.target.value as ToneStyle)}
              className="w-full appearance-none px-3 py-2 pr-8 text-xs font-semibold rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-hidden focus:border-zinc-400 cursor-pointer"
            >
              {TONE_OPTIONS.map((to) => (
                <option key={to.id} value={to.id}>
                  {to.label} ({to.description})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 4. Speed Rate */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-medium text-zinc-500">
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-zinc-400" />
              <span>{isPt ? 'Velocidade' : 'Speed'}</span>
            </span>
            <span className="font-mono text-zinc-900 font-bold">{speechRate.toFixed(2)}x</span>
          </div>
          <div className="flex items-center gap-1">
            {[0.85, 1.0, 1.15, 1.25].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => onSpeedChange(rate)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  Math.abs(speechRate - rate) < 0.05
                    ? 'bg-zinc-900 text-white font-bold'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
