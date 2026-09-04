import React from 'react';
import {
  Mic,
  BookOpen,
  Camera,
  Table,
  Search,
  Languages,
} from 'lucide-react';
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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo & Academic Identity */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onTabChange('estudio')}
              className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold shadow-xs hover:bg-zinc-800 transition-colors cursor-pointer"
              title="ZavalaVoz - Home"
            >
              <Mic className="w-4 h-4 text-emerald-400" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-zinc-900 tracking-tight">
                  {t.appName}
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ESUDER • UEM
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 hidden md:block truncate max-w-[260px]">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs font-medium overflow-x-auto no-scrollbar">
            <button
              id="tab-btn-estudio"
              type="button"
              onClick={() => onTabChange('estudio')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                currentTab === 'estudio'
                  ? 'bg-white text-zinc-900 font-semibold shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.tabs.estudio}</span>
            </button>

            <button
              id="tab-btn-defesa"
              type="button"
              onClick={() => onTabChange('defesa')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                currentTab === 'defesa'
                  ? 'bg-white text-zinc-900 font-semibold shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.tabs.defesa}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-200 text-zinc-700 font-mono font-bold">
                {questionCount}
              </span>
            </button>

            <button
              id="tab-btn-campo"
              type="button"
              onClick={() => onTabChange('campo')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                currentTab === 'campo'
                  ? 'bg-white text-zinc-900 font-semibold shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.tabs.campo}</span>
            </button>

            <button
              id="tab-btn-dados"
              type="button"
              onClick={() => onTabChange('dados')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                currentTab === 'dados'
                  ? 'bg-white text-zinc-900 font-semibold shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Table className="w-3.5 h-3.5 text-sky-600" />
              <span>{t.tabs.dados}</span>
            </button>

            <button
              id="tab-btn-pesquisa"
              type="button"
              onClick={() => onTabChange('pesquisa')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                currentTab === 'pesquisa'
                  ? 'bg-white text-emerald-900 font-bold shadow-xs ring-1 ring-emerald-500/20'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.tabs.pesquisa}</span>
            </button>
          </nav>

          {/* Right Language Toggle & Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.header.charBadge}</span>
            </div>

            {/* Functional Bilingual PT / EN toggle */}
            <div
              className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs shadow-xs"
              role="group"
              aria-label="Language selector"
            >
              <button
                id="btn-lang-pt"
                type="button"
                onClick={() => onLangChange('pt')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all font-bold cursor-pointer text-xs ${
                  currentLang === 'pt'
                    ? 'bg-white text-emerald-900 shadow-xs ring-1 ring-zinc-200'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
                title="Português (Moçambique pt-MZ, Portugal pt-PT, Brasil pt-BR, Angola pt-AO)"
              >
                <span>🇲🇿</span>
                <span>PT</span>
              </button>
              <button
                id="btn-lang-en"
                type="button"
                onClick={() => onLangChange('en')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all font-bold cursor-pointer text-xs ${
                  currentLang === 'en'
                    ? 'bg-white text-indigo-900 shadow-xs ring-1 ring-zinc-200'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
                title="English (United States en-US, United Kingdom en-GB, Australia en-AU)"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
