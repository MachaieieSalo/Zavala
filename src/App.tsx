import React, { useState, useEffect, useRef } from 'react';
import { Header, AppViewTab } from './components/Header';
import { FieldNotebookView } from './components/field/FieldNotebookView';
import { ThesisContext } from './components/common/ThesisContext';
import { PageHeader } from './components/common/PageHeader';
import { Button } from './components/common/Button';
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
  CheckCircle2,
  Volume2,
  BookOpen,
  Layers,
  ArrowRight,
} from 'lucide-react';

const STORAGE_KEY = 'zavalavoz_tts_history_v2';
const TAB_STORAGE_KEY = 'zavalavoz_active_tab_v2';
const LANG_STORAGE_KEY = 'zavalavoz_lang_v2';
const VARIATION_STORAGE_KEY = 'zavalavoz_variation_v2';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppViewTab>(() => {
    try {
      const saved = localStorage.getItem(TAB_STORAGE_KEY);
      if (saved && ['estudio', 'defesa', 'campo', 'dados', 'pesquisa'].includes(saved)) {
        return saved as AppViewTab;
      }
    } catch {}
    return 'estudio';
  });

  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'pt' || saved === 'en') return saved;
    } catch {}
    return 'pt';
  });

  const [selectedVariation, setSelectedVariation] = useState<VariationCode>(() => {
    try {
      const saved = localStorage.getItem(VARIATION_STORAGE_KEY);
      if (saved) return saved as VariationCode;
    } catch {}
    return 'pt-MZ';
  });

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

  // Persist navigation and language preferences safely
  useEffect(() => {
    try {
      localStorage.setItem(TAB_STORAGE_KEY, currentTab);
    } catch {}
  }, [currentTab]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, currentLang);
    } catch {}
  }, [currentLang]);

  useEffect(() => {
    try {
      localStorage.setItem(VARIATION_STORAGE_KEY, selectedVariation);
    } catch {}
  }, [selectedVariation]);

  // Data Modal State
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  // Deep linking targets from search
  const [targetPhotoId, setTargetPhotoId] = useState<string | undefined>(undefined);
  const [targetFieldSubTab, setTargetFieldSubTab] = useState<'registos' | 'entrevistas' | 'evidencia'>('registos');
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

  const handleSelectQuestionText = (questionText: string, title: string, questionId?: string) => {
    setText(questionText);
    setCurrentLoadedTitle(title);
    const matched = questionId
      ? DISSERTATION_FULL_QUESTIONS.find((q) => q.id === questionId)
      : DISSERTATION_FULL_QUESTIONS.find(
          (q) =>
            q.id === title ||
            q.title === title ||
            `Pergunta ${q.number}: ${q.title}` === title ||
            q.titleEn === title ||
            `Question ${q.number}: ${q.titleEn}` === title
        );
    setSelectedQuestionId(matched ? matched.id : (questionId || null));
    showToast(currentLang === 'pt' ? `Carregado: ${title}` : `Loaded: ${title}`);

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
        if (param.startsWith('intv_') || param.startsWith('entrevista_')) {
          setTargetFieldSubTab('entrevistas');
        } else if (param.startsWith('cross_') || param.startsWith('cruz_')) {
          setTargetFieldSubTab('evidencia');
        } else {
          setTargetFieldSubTab('registos');
          setTargetPhotoId(param);
        }
      } else {
        setTargetFieldSubTab('registos');
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
          setSelectedQuestionId(found.id);
          setCurrentLoadedTitle(`Pergunta ${found.number}: ${found.title}`);
          setCurrentTab('defesa');
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

  const handleSendToStudio = (newText: string, title?: string, questionId?: string) => {
    setText(newText);
    setCurrentLoadedTitle(title || (currentLang === 'pt' ? 'Registo da Dissertação' : 'Dissertation Record'));
    setSelectedQuestionId(questionId || null);
    setCurrentTab('estudio');
    showToast(currentLang === 'pt' ? 'Texto carregado no Estúdio de Voz!' : 'Text loaded into Voice Studio!');
    if (textInputRef.current) {
      textInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F2E9D8] flex flex-col text-[#1A2417] font-sans antialiased">
      {/* 1. Header with brand & clean responsive navigation */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        currentLang={currentLang}
        onLangChange={handleLangGroupChange}
        questionCount={DISSERTATION_FULL_QUESTIONS.length}
      />

      {/* 2. Main Workstation Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {/* Contextual Dissertation Ribbon — level adapts smoothly to active view */}
        <ThesisContext
          level={currentTab === 'dados' ? 'expanded' : currentTab === 'defesa' ? 'standard' : 'compact'}
          onOpenDataModal={() => setIsDataModalOpen(true)}
          currentLang={currentLang}
        />

        {/* Global Notice Banner if any */}
        {errorMessage && (
          <div className="p-3.5 rounded-[4px] bg-[#FCFAF6] border-l-4 border-[#A8531E] border-y border-r border-[#D9CDAF] text-[#1A2417] flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-[#A8531E] shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <p className="font-bold text-[#A8531E] uppercase tracking-wider text-[11px] font-mono">
                  {currentLang === 'pt' ? 'Aviso do Sistema' : 'System Notice'}
                </p>
                <p className="mt-0.5 text-[#1A2417] leading-relaxed">{errorMessage}</p>
                <div className="mt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleBrowserSpeechPlay}
                    icon={<Volume2 className="w-3.5 h-3.5" />}
                  >
                    {currentLang === 'pt' ? 'Ouvir com Voz Local do Navegador' : 'Listen with Local Browser Speech'}
                  </Button>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold text-[#4F5C48] hover:text-[#1A2417] cursor-pointer"
            >
              {currentLang === 'pt' ? 'Fechar' : 'Close'}
            </button>
          </div>
        )}

        {/* TAB: ESTÚDIO DE ENSAIO ORAL */}
        {currentTab === 'estudio' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <PageHeader
              context={currentLang === 'pt' ? 'BANCADA DE ENSAIO ORAL' : 'ORAL REHEARSAL WORKSTATION'}
              title={currentLang === 'pt' ? 'Estúdio' : 'Studio'}
              description={currentLang === 'pt'
                ? 'Preparação de texto, modulação vocal neural e ensaio de locução para a defesa de dissertação.'
                : 'Text preparation, neural voice modulation, and read-aloud rehearsal for the dissertation defense.'}
            />

            {/* NÍVEL 1: CONTEXTO DE PERGUNTA EM ENSAIO (Discreto e compacto, quando houver pergunta associada) */}
            {selectedQuestionId && (
              <div className="rounded-[4px] border border-[#D9CDAF] bg-[#FCFAF6] px-3.5 py-2 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#4F5C48] bg-[#EAE2D2]/60 px-1.5 py-0.5 rounded-[2px] shrink-0">
                    {currentLang === 'pt' ? 'Pergunta em ensaio' : 'Rehearsal question'}
                  </span>
                  <span className="font-semibold text-[#1A2417] truncate">
                    {currentLoadedTitle}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentTab('defesa')}
                  className="inline-flex items-center gap-1 font-medium text-[#354D2C] hover:text-[#1A2417] shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
                >
                  <span>{currentLang === 'pt' ? 'Alterar pergunta na Banca' : 'Change question in Defense'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* NÍVEL 2: MANUSCRITO (Centro óptico dominante da bancada) */}
            <div ref={textInputRef} className="space-y-4">
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

              {/* NÍVEL 3: ENSAIO / PARÂMETROS E INSTRUMENTO DE ÁUDIO */}
              <div className="space-y-3 pt-1">
                {/* Barra de Ferramentas de Voz e Dicção */}
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

                {/* Reprodutor de Áudio e Feedback Acústico */}
                <div id="player-container">
                  <AudioPlayer
                    currentAudio={currentAudio}
                    isLoading={isLoading}
                    errorMessage={errorMessage}
                    onRetry={handleGenerate}
                    onDownloadDone={() => showToast(currentLang === 'pt' ? 'Arquivo MP3 descarregado com sucesso!' : 'MP3 file downloaded successfully!')}
                    currentLang={currentLang}
                  />
                </div>
              </div>

              {/* NÍVEL 4: HISTÓRICO DE ENSAIOS (Secundário, lista contínua) */}
              <HistoryList
                history={history}
                onPlayItem={handlePlayHistoryItem}
                onLoadText={(txt) => {
                  setText(txt);
                  showToast(currentLang === 'pt' ? 'Texto recarregado no manuscrito!' : 'Text reloaded into manuscript!');
                  if (textInputRef.current) {
                    textInputRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                onDeleteItem={handleDeleteHistoryItem}
                onClearHistory={handleClearHistory}
                currentLang={currentLang}
              />
            </div>
          </div>
        )}

        {/* TAB: DEFESA Q&A (Banco de Perguntas & Cenários Canónicos) */}
        {currentTab === 'defesa' && (
          <div className="space-y-4">
            <PageHeader
              context={currentLang === 'pt' ? 'SALA DE ARGUIÇÃO' : 'EXAMINATION ROOM'}
              title={currentLang === 'pt' ? 'Defesa' : 'Defense'}
              description={currentLang === 'pt'
                ? 'Simulação de arguição e preparação das respostas à banca.'
                : 'Defense examination simulation and argument preparation.'}
            />

            <SectionSelector
              onSelectQuestionText={handleSelectQuestionText}
              onPlayQuickSpeech={handleQuickBrowserSpeech}
              selectedQuestionId={selectedQuestionId}
              currentLoadedTitle={currentLoadedTitle}
              currentLang={currentLang}
              onNavigateToTab={(tab, param) => handleNavigateFromSearch(tab, param)}
            />
          </div>
        )}

        {/* TAB: CADERNO DIGITAL DE EVIDÊNCIA DE CAMPO */}
        {currentTab === 'campo' && (
          <FieldNotebookView
            onSelectPhotoText={handleSelectQuestionText}
            onPlayQuickSpeech={handleQuickBrowserSpeech}
            initialPhotoId={targetPhotoId}
            initialSubTab={targetFieldSubTab}
            currentLang={currentLang}
          />
        )}

        {/* TAB: ESTAÇÃO CIENTÍFICA DE DADOS */}
        {currentTab === 'dados' && (
          <div className="space-y-4">
            <PageHeader
              context={currentLang === 'pt' ? 'CONTEXTO TEMPORAL: 1994–2024' : 'TIME HORIZON: 1994–2024'}
              title={currentLang === 'pt' ? 'Dados' : 'Data'}
              description={currentLang === 'pt'
                ? 'Série histórica, tendência, choques e heterogeneidade espacial de Zavala (1994–2024).'
                : 'Historical series, trend, shocks, and spatial heterogeneity of Zavala (1994–2024).'}
            />

            <ThesisDataView
              onSendToStudio={handleSendToStudio}
              highlightYear={targetYear}
              currentLang={currentLang}
            />
          </div>
        )}

        {/* TAB: ÍNDICE DE CONSULTA CRUZADA DA DISSERTAÇÃO */}
        {currentTab === 'pesquisa' && (
          <div className="space-y-4">
            <PageHeader
              context={currentLang === 'pt' ? 'ÍNDICE REMISSIVO DA DISSERTAÇÃO' : 'DISSERTATION CROSS-INDEX'}
              title={currentLang === 'pt' ? 'Índice de Consulta Cruzada' : 'Cross-Reference Index'}
              description={currentLang === 'pt'
                ? 'Localização e cruzamento sistemático entre séries estatísticas, choques, registos etnográficos e arguição oral da dissertação.'
                : 'Systematic localization and cross-referencing across statistical series, shocks, ethnographic records, and oral defense arguments.'}
            />

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
        <div className="fixed bottom-5 right-5 z-50 bg-[#1A2417] text-[#FCFAF6] px-3.5 py-2.5 rounded-[4px] shadow-md flex items-center gap-2 text-xs font-medium border border-[#354D2C] animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#4A6B3E] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Secondary Data Tables Modal for quick inspection */}
      <ThesisDataTablesModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />

      {/* Clean Editorial Footer */}
      <footer className="mt-auto border-t border-[#D9CDAF] py-4 text-center text-xs text-[#4F5C48] bg-[#FCFAF6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-[#1A2417]">
            ZAVALAVOZ · Universidade Eduardo Mondlane (ESUDER)
          </span>
          <span className="text-[#4F5C48]">
            Tese de Yolanda Tamele · Zavala (1994–2024) · Suporte a 30.000 caracteres
          </span>
        </div>
      </footer>
    </div>
  );
}
