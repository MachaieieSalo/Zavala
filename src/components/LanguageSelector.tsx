import React from 'react';
import { VariationCode, LanguageCode } from '../types';
import { LANGUAGE_VARIATIONS } from '../data/languages';
import { Globe, Wand2, Check } from 'lucide-react';
import { TRANSLATIONS, SupportedLang } from '../data/translations';

interface LanguageSelectorProps {
  selectedVariation: VariationCode;
  onSelectVariation: (code: VariationCode) => void;
  onApplySampleText: (text: string) => void;
  currentLang?: SupportedLang;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedVariation,
  onSelectVariation,
  onApplySampleText,
  currentLang = 'pt',
}) => {
  const t = TRANSLATIONS[currentLang];
  const currentVarObj =
    LANGUAGE_VARIATIONS.find((v) => v.code === selectedVariation) ||
    LANGUAGE_VARIATIONS[0];

  const portugueseVariations = LANGUAGE_VARIATIONS.filter(
    (v) => v.langGroup === 'pt'
  );
  const englishVariations = LANGUAGE_VARIATIONS.filter(
    (v) => v.langGroup === 'en'
  );

  const isPt = currentLang === 'pt';

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold">
            <Globe className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 leading-tight">
              {isPt ? 'Sotaque e Variação Regional' : 'Regional Voice Accent & Dialect'}
            </h2>
            <p className="text-xs text-zinc-500">
              {isPt
                ? 'Escolha a cadência de voz para a leitura do texto'
                : 'Select regional prosody and pronunciation for speech'}
            </p>
          </div>
        </div>

        <button
          id="btn-apply-sample"
          type="button"
          onClick={() => onApplySampleText(currentVarObj.defaultSampleText)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors border border-zinc-200 self-start sm:self-auto cursor-pointer"
          title="Preenche o campo de texto com uma frase típica deste sotaque"
        >
          <Wand2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isPt ? 'Carregar Frase de Exemplo' : 'Load Sample Phrase'}</span>
        </button>
      </div>

      {/* Sections for Portuguese and English variations ordered by currentLang */}
      <div className="space-y-4">
        {/* Primary Language Group */}
        {(isPt ? [
          { label: 'Variações em Português', list: portugueseVariations },
          { label: 'English Variations', list: englishVariations },
        ] : [
          { label: 'English Variations (Active)', list: englishVariations },
          { label: 'Variações em Português', list: portugueseVariations },
        ]).map((section, sIdx) => (
          <div key={sIdx}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                {section.label}
              </span>
              <div className="flex-1 h-px bg-zinc-100" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {section.list.map((item) => {
                const isSelected = selectedVariation === item.code;
                return (
                  <button
                    key={item.code}
                    id={`variation-btn-${item.code}`}
                    type="button"
                    onClick={() => onSelectVariation(item.code)}
                    className={`relative flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500/30'
                        : 'bg-zinc-50/70 hover:bg-zinc-100/90 border-zinc-200 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xl leading-none">{item.flag}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-sm text-zinc-900 leading-tight">
                      {item.name}
                    </div>
                    <div className="text-[11px] font-medium text-emerald-700 mt-0.5">
                      {item.accentLabel}
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
