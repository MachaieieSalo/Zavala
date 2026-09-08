import React from 'react';
import { VariationCode } from '../types';
import { LANGUAGE_VARIATIONS } from '../data/languages';
import { Wand2, Check } from 'lucide-react';
import { TRANSLATIONS, SupportedLang } from '../data/translations';
import { Button } from './common/Button';

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
    <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 sm:p-5 text-[#1A2417]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#D9CDAF]">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#1A2417] leading-tight font-display">
            {isPt ? 'Sotaque e Variação Regional' : 'Regional Voice Accent & Dialect'}
          </h2>
          <p className="text-xs text-[#4F5C48]">
            {isPt
              ? 'Escolha a cadência de voz para a leitura do texto'
              : 'Select regional prosody and pronunciation for speech'}
          </p>
        </div>

        <Button
          id="btn-apply-sample"
          variant="secondary"
          size="sm"
          onClick={() => onApplySampleText(currentVarObj.defaultSampleText)}
          icon={<Wand2 className="w-3.5 h-3.5 text-[#4A6B3E]" />}
          title="Preenche o campo de texto com uma frase típica deste sotaque"
        >
          {isPt ? 'Carregar Frase de Exemplo' : 'Load Sample Phrase'}
        </Button>
      </div>

      {/* Sections for Portuguese and English variations ordered by currentLang */}
      <div className="space-y-4">
        {(isPt ? [
          { label: 'Variações em Português', list: portugueseVariations },
          { label: 'English Variations', list: englishVariations },
        ] : [
          { label: 'English Variations (Active)', list: englishVariations },
          { label: 'Variações em Português', list: portugueseVariations },
        ]).map((section, sIdx) => (
          <div key={sIdx}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#1A2417] uppercase tracking-wider">
                {section.label}
              </span>
              <div className="flex-1 h-px bg-[#D9CDAF]" />
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
                    className={`relative flex flex-col p-3 rounded-[3px] border text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24] ${
                      isSelected
                        ? 'bg-[#EAE2D2]/40 border-[#1A2417] text-[#1A2417]'
                        : 'bg-[#FCFAF6] hover:bg-[#EAE2D2]/20 border-[#D9CDAF] text-[#1A2417]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-lg leading-none">{item.flag}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-[#1A2417] text-[#FCFAF6] flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-sm text-[#1A2417] leading-tight">
                      {item.name}
                    </div>
                    <div className="text-[11px] font-medium text-[#354D2C] mt-0.5">
                      {item.accentLabel}
                    </div>
                    <p className="text-[11px] text-[#4F5C48] mt-1 line-clamp-2 leading-relaxed">
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
