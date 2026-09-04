import React, { useState, useEffect, useRef } from 'react';
import { Header, AppViewTab } from './components/Header';
import { ImageCarousel } from './components/ImageCarousel';
import { ThesisOverviewBanner } from './components/ThesisOverviewBanner';
import { ThesisDataView } from './components/ThesisDataView';
import { ThesisDataTablesModal } from './components/ThesisDataTablesModal';
import { VoiceControlsBar } from './components/VoiceControlsBar';
import { TextInputArea } from './components/TextInputArea';
import { AudioPlayer } from './components/AudioPlayer';
import { HistoryList } from './components/HistoryList';
import { SectionSelector } from './components/SectionSelector';
import { GlobalSearchEngineView } from './components/GlobalSearchEngineView';
import {
  LanguageCode,
  VariationCode,
  VoiceName,
  ToneStyle,
  TTSResponse,
  HistoryItem,
} from './types';
import {
  getAllDissertationText,
  DISSERTATION_FULL_QUESTIONS,
} from './data/dissertationText';
import { browserSpeech } from './utils/browserSpeech';
import {
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Volume2,
  BookOpen,
  Camera,
  Layers,
  ArrowRight,
} from 'lucide-react';

const STORAGE_KEY = 'zavalavoz_tts_history_v2';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppViewTab>('estudio');
  const [currentLang, setCurrentLang] = useState<LanguageCode>('pt');
  const [selectedVariation, setSelectedVariation] =
    useState<VariationCode>('pt-MZ');
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>('Kore');
  const [selectedTone, setSelectedTone] = useState<ToneStyle>('formal');
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // Default initial text: Set to the first dissertation question
  const [text, setText] = useState<string>(
    () => DISSERTATION_FULL_QUESTIONS[0].text
  );
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    'q_1'
  );
  const [currentLoadedTitle, setCurrentLoadedTitle] = useState<string>(
    'Pergunta 1: Problema Central e Escolha de Zavala'
  );

  // Data Modal State
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  // Deep linking targets from search
  const [targetPhotoId, setTargetPhotoId] = useState<string | undefined>(undefined);
  const [targetYear, setTargetYear] = useState<number | undefined>(undefined);

  // Audio synthesis state
  const [currentAudio, setCurrentAudio] = useState<TTSResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBrowserSpeaking, setIsBrowserSpeaking] = useState(false);

  const textInputRef = useRef<HTMLDivElement>(null);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track browser speech state
  useEffect(() => {
    browserSpeech.onStateChange((st) => {
      setIsBrowserSpeaking(st.isSpeaking);
    });
    return () => {
      browserSpeech.stop();
    };
  }, []);

  // Save history on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Falha ao salvar histórico no localStorage:', e);
    }
  }, [history]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLangGroupChange = (lang: LanguageCode) => {
    setCurrentLang(lang);
    if (lang === 'pt') {
      if (!selectedVariation.startsWith('pt-')) {
        setSelectedVariation('pt-MZ');
      }
      showToast('Idioma alterado para Português (Moçambique pt-MZ)');
    } else if (lang === 'en') {
      if (!selectedVariation.startsWith('en-')) {
        setSelectedVariation('en-US');
      }
      showToast('Language switched to English (en-US)');
    }
  };

  const handleSelectVariation = (code: VariationCode) => {
    setSelectedVariation(code);
    if (code.startsWith('pt-') && currentLang !== 'pt') {
      setCurrentLang('pt');
    } else if (code.startsWith('en-') && currentLang !== 'en') {
      setCurrentLang('en');
    }
  };

  const handleApplySample = (sampleText: string) => {
    setText(sampleText);
    setSelectedQuestionId(null);
    setCurrentLoadedTitle('Texto de Exemplo');
    showToast('Frase de exemplo carregada!');
  };

  const handleSelectQuestionText = (questionText: string, title: string) => {
    setText(questionText);
    setCurrentLoadedTitle(title);
    const matched = DISSERTATION_FULL_QUESTIONS.find((q) => q.title === title);
    setSelectedQuestionId(matched ? matched.id : null);
    showToast(`Carregado: ${title}`);

    // If on mobile or in another tab, switch to 'estudio' so user can convert
    if (currentTab !== 'estudio') {
      setCurrentTab('estudio');
    }

    if (textInputRef.current) {
      textInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleQuickBrowserSpeech = (speechText: string) => {
    browserSpeech.speak(speechText, selectedVariation, speechRate);
    showToast('Reproduzindo áudio pelo navegador com voz local...');
  };

  const handleBrowserSpeechPlay = () => {
    if (!text.trim()) return;
    browserSpeech.speak(text.trim(), selectedVariation, speechRate);
    showToast('Reproduzindo pelo navegador...');
  };

  const handleBrowserSpeechStop = () => {
    browserSpeech.stop();
    setIsBrowserSpeaking(false);
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      setErrorMessage(
        'Por favor, digite ou selecione algum texto antes de gerar o áudio.'
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep('Conectando ao modelo neural...');

    try {
      const isLongText = text.length > 2000;
      const timer1 = setTimeout(() => {
        setLoadingStep(
          isLongText
            ? 'Processando parágrafos da dissertação em lote contínuo...'
            : 'Sintetizando locução em alta fidelidade...'
        );
      }, 1500);

      const timer2 = setTimeout(() => {
        setLoadingStep('Concatenando e codificando áudio MP3 (24.000 Hz)...');
      }, 3500);

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          language: currentLang,
          variation: selectedVariation,
          voice: selectedVoice,
          tone: selectedTone,
          speed: speechRate,
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar o áudio.');
      }

      const newAudio: TTSResponse = data;
      setCurrentAudio(newAudio);

      const historyEntry: HistoryItem = {
        id: `tts_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        timestamp: Date.now(),
        text: newAudio.text,
        variation: newAudio.variation,
        voice: newAudio.voice,
        tone: selectedTone,
        audioBase64: newAudio.audioBase64,
        fileName: newAudio.fileName,
        durationSeconds: newAudio.durationSeconds,
        fileSizeBytes: newAudio.fileSizeBytes,
      };

      setHistory((prev) => [historyEntry, ...prev.slice(0, 19)]);
      showToast('Áudio MP3 gerado com sucesso! Pronto para ouvir e transferir.');
    } catch (err: any) {
      console.error('Falha na requisição de áudio:', err);
      setErrorMessage(
        err.message ||
          'Não foi possível converter o texto via API. Você pode utilizar o botão "Ouvir no Navegador" como alternativa imediata e sem limites.'
      );
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handlePlayHistoryItem = (item: HistoryItem) => {
    setCurrentAudio({
      audioBase64: item.audioBase64,
      mimeType: 'audio/mpeg',
      durationSeconds: item.durationSeconds,
      fileSizeBytes: item.fileSizeBytes,
      fileName: item.fileName,
      text: item.text,
      voice: item.voice,
      variation: item.variation,
      createdAt: item.timestamp,
    });
    setSelectedVariation(item.variation);
    setSelectedVoice(item.voice);
    showToast(`Carregado: ${item.voice} (${item.variation})`);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    if (window.confirm('Deseja limpar todo o histórico gravado?')) {
      setHistory([]);
      showToast('Histórico limpo.');
    }
  };

  const handleNavigateFromSearch = (tab: AppViewTab, param?: string | number) => {
    if (tab === 'campo') {
      if (typeof param === 'string') {
        setTargetPhotoId(param);
      }
      setCurrentTab('campo');
    } else if (tab === 'dados') {
      if (typeof param === 'number') {
        setTargetYear(param);
      }
      setCurrentTab('dados');
    } else if (tab === 'defesa') {
      if (typeof param === 'string') {
        const found = DISSERTATION_FULL_QUESTIONS.find((q) => q.id === param);
        if (found) {
          handleSelectQuestionText(found.text, `Pergunta ${found.number}: ${found.title}`);
          return;
        }
      }
      setCurrentTab('defesa');
    } else if (tab === 'estudio') {
      setCurrentTab('estudio');
    } else {
      setCurrentTab(tab);
    }
  };

  const handleSendToStudio = (newText: string) => {
    setText(newText);
    setCurrentLoadedTitle('Registo da Dissertação');
    setSelectedQuestionId(null);
    setCurrentTab('estudio');
    showToast('Texto carregado no Estúdio de Voz!');
    if (textInputRef.current) {
      textInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col text-zinc-900 font-sans antialiased">
      {/* 1. Header with brand & clean responsive navigation */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        currentLang={currentLang}
        onLangChange={handleLangGroupChange}
        questionCount={DISSERTATION_FULL_QUESTIONS.length}
      />

      {/* 2. Main Workstation Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-5">
        {/* Subtle Dissertation Context Ribbon */}
        <ThesisOverviewBanner
          onOpenDataModal={() => setIsDataModalOpen(true)}
          currentLang={currentLang}
        />

        {/* Global Error Banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm">
                <p className="font-bold">{currentLang === 'pt' ? 'Aviso do Sistema' : 'System Notice'}</p>
                <p className="mt-0.5 text-rose-700 leading-relaxed">{errorMessage}</p>
                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={handleBrowserSpeechPlay}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{currentLang === 'pt' ? 'Ouvir Imediatamente com Voz Local do Navegador' : 'Listen with Local Browser Speech'}</span>
                  </button>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
            >
              {currentLang === 'pt' ? 'Fechar' : 'Close'}
            </button>
          </div>
        )}

        {/* TAB: ESTÚDIO DE ÁUDIO */}
        {currentTab === 'estudio' && (
          <div className="space-y-5">
            {/* On Desktop (lg:), show sleek 2-column workstation; on mobile, cleanly stacked */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Audio Studio Controls & Editor (7 cols) */}
              <div className="lg:col-span-7 space-y-4" ref={textInputRef}>
                {/* Mobile-only shortcut banner to pick questions */}
                <div className="lg:hidden p-3 rounded-xl bg-white border border-zinc-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    <span className="font-medium text-zinc-800 truncate max-w-[200px]">
                      {currentLoadedTitle}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('defesa')}
                    className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>{currentLang === 'pt' ? 'Mudar Pergunta' : 'Change Question'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Voice & Language Settings Bar */}
                <VoiceControlsBar
                  selectedVariation={selectedVariation}
                  onSelectVariation={handleSelectVariation}
                  selectedVoice={selectedVoice}
                  onSelectVoice={setSelectedVoice}
                  selectedTone={selectedTone}
                  onSelectTone={setSelectedTone}
                  speechRate={speechRate}
                  onSpeedChange={setSpeechRate}
                  onApplySample={handleApplySample}
                  currentLang={currentLang}
                />

                {/* Textarea Workspace */}
                <TextInputArea
                  text={text}
                  onChangeText={(newTxt) => {
                    setText(newTxt);
                    if (!newTxt.includes('Pergunta') && !newTxt.includes('Question')) {
                      setSelectedQuestionId(null);
                      setCurrentLoadedTitle(currentLang === 'pt' ? 'Texto Personalizado' : 'Custom Text');
                    }
                  }}
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                  loadingStep={loadingStep}
                  maxChars={30000}
                  onBrowserSpeechPlay={handleBrowserSpeechPlay}
                  onBrowserSpeechStop={handleBrowserSpeechStop}
                  isBrowserSpeaking={isBrowserSpeaking}
                  currentLang={currentLang}
                />

                {/* Audio Player */}
                <div id="player-container">
                  <AudioPlayer
                    currentAudio={currentAudio}
                    onDownloadDone={() => showToast(currentLang === 'pt' ? 'Arquivo MP3 descarregado com sucesso!' : 'MP3 file downloaded successfully!')}
                  />
                </div>

                {/* History */}
                <HistoryList
                  history={history}
                  onPlayItem={handlePlayHistoryItem}
                  onLoadText={(txt) => {
                    setText(txt);
                    showToast(currentLang === 'pt' ? 'Texto recarregado no editor!' : 'Text reloaded into editor!');
                    if (textInputRef.current) {
                      textInputRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  onDeleteItem={handleDeleteHistoryItem}
                  onClearHistory={handleClearHistory}
                />
              </div>

              {/* Right Column (Desktop only): Live Question Companion (5 cols) */}
              <div className="hidden lg:block lg:col-span-5 sticky top-20 space-y-4">
                <SectionSelector
                  onSelectQuestionText={handleSelectQuestionText}
                  onPlayQuickSpeech={handleQuickBrowserSpeech}
                  selectedQuestionId={selectedQuestionId}
                  currentLoadedTitle={currentLoadedTitle}
                  currentLang={currentLang}
                />

                {/* Compact Data Shocks Summary Widget */}
                <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{currentLang === 'pt' ? 'Choques Críticos Documentados (Tabela 5)' : 'Documented Critical Shocks (Table 5)'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentTab('dados')}
                      className="font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                    >
                      {currentLang === 'pt' ? 'Ver todos' : 'View all'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                      <span className="text-zinc-500 block">2000 ({currentLang === 'pt' ? 'Cheias' : 'Floods'})</span>
                      <span className="text-rose-700 font-bold">-55,4% {currentLang === 'pt' ? 'perda' : 'loss'}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                      <span className="text-zinc-500 block">2007 (Favio)</span>
                      <span className="text-rose-700 font-bold">-64,3% {currentLang === 'pt' ? 'perda' : 'loss'}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                      <span className="text-zinc-500 block">2016 (El Niño)</span>
                      <span className="text-rose-700 font-bold">-59,4% {currentLang === 'pt' ? 'perda' : 'loss'}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                      <span className="text-zinc-500 block">2023 ({currentLang === 'pt' ? 'Colapso' : 'Collapse'})</span>
                      <span className="text-rose-700 font-bold">-92,5% {currentLang === 'pt' ? 'perda' : 'loss'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: DEFESA Q&A (60 Perguntas & 7 Cenários) */}
        {currentTab === 'defesa' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                  {currentLang === 'pt' ? 'Simulador de Perguntas e Respostas da Defesa' : 'Defense Q&A Simulator'}
                </h2>
                <p className="text-xs text-zinc-500">
                  {currentLang === 'pt'
                    ? '60 perguntas categorizadas em 7 cenários com modo de estudo e simulação real com cronómetro'
                    : '60 dissertation defense questions across 7 scenarios with study mode and mock panel countdown simulator'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentTab('estudio')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <span>{currentLang === 'pt' ? 'Voltar ao Estúdio' : 'Back to Studio'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <SectionSelector
              onSelectQuestionText={handleSelectQuestionText}
              onPlayQuickSpeech={handleQuickBrowserSpeech}
              selectedQuestionId={selectedQuestionId}
              currentLoadedTitle={currentLoadedTitle}
              currentLang={currentLang}
            />
          </div>
        )}

        {/* TAB: GALERIA DE CAMPO (Apêndice D) */}
        {currentTab === 'campo' && (
          <div className="space-y-4">
            <ImageCarousel
              onSelectPhotoText={handleSelectQuestionText}
              onPlayQuickSpeech={handleQuickBrowserSpeech}
              initialPhotoId={targetPhotoId}
              currentLang={currentLang}
            />
          </div>
        )}

        {/* TAB: TABELAS E DADOS OFICIAIS */}
        {currentTab === 'dados' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                  {currentLang === 'pt' ? 'Tabelas Estatísticas e Espaciais da Dissertação' : 'Statistical & Spatial Dissertation Tables'}
                </h2>
                <p className="text-xs text-zinc-500">
                  {currentLang === 'pt'
                    ? 'Série histórica de 31 anos (1994-2024), perdas cumulativas (547.224 t), pressupostos e metodologia'
                    : '31-year time series (1994–2024), cumulative losses (547,224 t), assumptions, and methodology'}
                </p>
              </div>
            </div>

            <ThesisDataView
              onSendToStudio={handleSendToStudio}
              highlightYear={targetYear}
            />
          </div>
        )}

        {/* TAB: PESQUISA GLOBAL (Dados e Fotos) */}
        {currentTab === 'pesquisa' && (
          <div className="space-y-4">
            <GlobalSearchEngineView
              onNavigateToTab={handleNavigateFromSearch}
              onSendToStudio={handleSendToStudio}
              currentLang={currentLang}
            />
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-zinc-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Secondary Data Tables Modal for quick inspection */}
      <ThesisDataTablesModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />

      {/* Clean Editorial Footer */}
      <footer className="mt-auto border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-zinc-700">
            ZavalaVoz • Universidade Eduardo Mondlane (ESUDER)
          </span>
          <span className="text-zinc-500">
            Tese de Yolanda Tamele • Zavala (1994-2024) • Suporte a 30.000 caracteres
          </span>
        </div>
      </footer>
    </div>
  );
}
