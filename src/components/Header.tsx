import React from 'react';
import { TRANSLATIONS, SupportedLang } from '../data/translations';

export type AppViewTab = 'estudio' | 'defesa' | 'campo' | 'dados' | 'pesquisa';

interface HeaderProps {
  currentTab: AppViewTab;
  onTabChange: (tab: AppViewTab) => void;
  currentLang: SupportedLang;
  onLangChange: (lang: SupportedLang) => void;
  questionCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  currentLang,
  onLangChange,
  questionCount,
}) => {
  const t = TRANSLATIONS[currentLang];

  const navItems: { id: AppViewTab; label: string; count?: number }[] = [
    { id: 'estudio', label: t.tabs.estudio },
    { id: 'defesa', label: t.tabs.defesa, count: questionCount },
    { id: 'campo', label: t.tabs.campo },
    { id: 'dados', label: t.tabs.dados },
    { id: 'pesquisa', label: t.tabs.pesquisa },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FCFAF6] border-b border-[#D9CDAF]">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Brand Logo & Academic Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onTabChange('estudio')}
              className="group flex items-center gap-2.5 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
              title="ZavalaVoz — Início"
              aria-label="ZavalaVoz Início"
            >
              <div className="w-7 h-7 rounded-[3px] bg-[#1A2417] text-[#FCFAF6] flex items-center justify-center font-mono font-bold text-xs tracking-tighter group-hover:bg-[#354D2C] transition-colors">
                ZV
              </div>
              <div className="leading-none">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-bold text-[#1A2417] tracking-tight font-display">
                    ZAVALAVOZ
                  </span>
                  <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-[#4F5C48] font-sans font-medium">
                    ESUDER · UEM
                  </span>
                </div>
                <p className="text-[10px] text-[#4F5C48] hidden lg:block mt-0.5 tracking-normal">
                  {currentLang === 'pt' ? 'Ambiente de Preparação e Defesa Académica' : 'Academic Defense & Voice Workstation'}
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs - Editorial Underline System */}
          <nav
            className="flex items-center gap-1 sm:gap-2 h-full overflow-x-auto no-scrollbar"
            aria-label="Navegação Principal"
          >
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`tab-btn-${item.id}`}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 h-full text-xs font-sans whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24] ${
                    isActive
                      ? 'text-[#1A2417] font-bold'
                      : 'text-[#4F5C48] hover:text-[#1A2417] font-medium hover:bg-[#EAE2D2]/30'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1 py-0.2 rounded-[2px] ${
                        isActive
                          ? 'bg-[#1A2417] text-[#FCFAF6]'
                          : 'bg-[#EAE2D2] text-[#4F5C48]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                  {/* Non-color dependent active indicator: solid crisp line on active tab */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1A2417]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Language Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Functional Bilingual PT / EN segmented switch */}
            <div
              className="flex items-center p-0.5 rounded-[3px] border border-[#D9CDAF] bg-[#EAE2D2]/40 text-xs"
              role="group"
              aria-label="Seleção de idioma"
            >
              <button
                id="btn-lang-pt"
                type="button"
                onClick={() => onLangChange('pt')}
                aria-pressed={currentLang === 'pt'}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-[2px] transition-colors font-medium cursor-pointer text-xs focus-visible:outline-2 focus-visible:outline-[#2A3A24] ${
                  currentLang === 'pt'
                    ? 'bg-[#FCFAF6] text-[#1A2417] font-bold border border-[#D9CDAF]/80'
                    : 'text-[#4F5C48] hover:text-[#1A2417]'
                }`}
                title="Português (Moçambique pt-MZ, Portugal pt-PT, Brasil pt-BR, Angola pt-AO)"
              >
                <span>PT</span>
              </button>
              <button
                id="btn-lang-en"
                type="button"
                onClick={() => onLangChange('en')}
                aria-pressed={currentLang === 'en'}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-[2px] transition-colors font-medium cursor-pointer text-xs focus-visible:outline-2 focus-visible:outline-[#2A3A24] ${
                  currentLang === 'en'
                    ? 'bg-[#FCFAF6] text-[#1A2417] font-bold border border-[#D9CDAF]/80'
                    : 'text-[#4F5C48] hover:text-[#1A2417]'
                }`}
                title="English (United States en-US, United Kingdom en-GB, Australia en-AU)"
              >
                <span>EN</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
