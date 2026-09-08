import React from 'react';
import {
  VariationCode,
  VoiceName,
  ToneStyle,
} from '../types';
import {
  LANGUAGE_VARIATIONS,
  VOICE_PROFILES,
  TONE_OPTIONS,
} from '../data/languages';
import { ChevronDown } from 'lucide-react';
import { SupportedLang } from '../data/translations';

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
    <div
      aria-label={isPt ? 'Barra de ferramentas de locução e voz' : 'Voice and delivery toolbar'}
      className="rounded-[4px] border border-[#D9CDAF] bg-[#FCFAF6] px-3 py-2.5 sm:px-4 sm:py-2 text-xs font-sans"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Controles lineares de parâmetros de voz */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 flex-1 items-center">
          {/* 1. Sotaque / Variação */}
          <div className="flex flex-col gap-0.5">
            <label
              htmlFor="select-variation"
              className="text-[10px] uppercase tracking-wider font-semibold text-[#4F5C48]"
            >
              {isPt ? 'Sotaque' : 'Accent'}
            </label>
            <div className="relative">
              <select
                id="select-variation"
                value={selectedVariation}
                onChange={(e) => onSelectVariation(e.target.value as VariationCode)}
                className="w-full appearance-none bg-transparent pr-5 py-1 text-xs font-medium text-[#1A2417] border-b border-[#D9CDAF] hover:border-[#1A2417] focus:border-[#1A2417] focus:outline-none cursor-pointer transition-colors"
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
              <ChevronDown className="w-3 h-3 text-[#4F5C48] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Voz Neural */}
          <div className="flex flex-col gap-0.5">
            <label
              htmlFor="select-voice"
              className="text-[10px] uppercase tracking-wider font-semibold text-[#4F5C48]"
            >
              {isPt ? 'Voz Neural' : 'Neural Voice'}
            </label>
            <div className="relative">
              <select
                id="select-voice"
                value={selectedVoice}
                onChange={(e) => onSelectVoice(e.target.value as VoiceName)}
                className="w-full appearance-none bg-transparent pr-5 py-1 text-xs font-medium text-[#1A2417] border-b border-[#D9CDAF] hover:border-[#1A2417] focus:border-[#1A2417] focus:outline-none cursor-pointer transition-colors"
              >
                {VOICE_PROFILES.map((vp) => (
                  <option key={vp.name} value={vp.name}>
                    {vp.name} ({vp.gender === 'Feminino' ? 'Fem' : 'Masc'} · {vp.character})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-[#4F5C48] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 3. Estilo / Tom */}
          <div className="flex flex-col gap-0.5">
            <label
              htmlFor="select-tone"
              className="text-[10px] uppercase tracking-wider font-semibold text-[#4F5C48]"
            >
              {isPt ? 'Estilo' : 'Style'}
            </label>
            <div className="relative">
              <select
                id="select-tone"
                value={selectedTone}
                onChange={(e) => onSelectTone(e.target.value as ToneStyle)}
                className="w-full appearance-none bg-transparent pr-5 py-1 text-xs font-medium text-[#1A2417] border-b border-[#D9CDAF] hover:border-[#1A2417] focus:border-[#1A2417] focus:outline-none cursor-pointer transition-colors"
              >
                {TONE_OPTIONS.map((to) => (
                  <option key={to.id} value={to.id}>
                    {to.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-[#4F5C48] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 4. Cadência / Velocidade */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#4F5C48]">
                {isPt ? 'Cadência' : 'Cadence'}
              </span>
              <span className="text-[10px] font-mono text-[#1A2417] font-bold tabular-nums">
                {speechRate.toFixed(2)}x
              </span>
            </div>
            <div
              className="flex items-center p-0.5 rounded-[2px] bg-[#EAE2D2]/50 border border-[#D9CDAF]/80"
              role="group"
              aria-label="Controle de cadência da fala"
            >
              {[0.85, 1.0, 1.15, 1.25].map((rate) => {
                const isSelected = Math.abs(speechRate - rate) < 0.05;
                return (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => onSpeedChange(rate)}
                    aria-pressed={isSelected}
                    className={`flex-1 py-0.5 text-center text-[10px] font-mono font-medium rounded-[1px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24] ${
                      isSelected
                        ? 'bg-[#1A2417] text-[#FCFAF6] font-bold'
                        : 'text-[#4F5C48] hover:text-[#1A2417]'
                    }`}
                  >
                    {rate}x
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ação secundária: Frase Modelo deste sotaque */}
        <div className="shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#D9CDAF]/60 lg:pl-3 flex items-center justify-between lg:justify-end">
          <button
            type="button"
            onClick={() => onApplySample(currentVarObj.defaultSampleText)}
            className="text-[11px] font-medium text-[#354D2C] hover:text-[#1A2417] underline decoration-[#D9CDAF] hover:decoration-[#1A2417] underline-offset-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
            title="Inserir frase típica deste sotaque no manuscrito"
          >
            {isPt ? 'Frase modelo do sotaque' : 'Sample accent phrase'}
          </button>
        </div>
      </div>
    </div>
  );
};
