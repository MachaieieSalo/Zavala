/**
 * ESTAÇÃO DE CONSULTA CIENTÍFICA COM LLM ("O Manuscrito Vivo")
 * ZAVALAVOZ — UEM / ESUDER
 * Yolanda Tamele (1994–2024)
 * 
 * FASE 11.1 — Arquitectura Epistemológica e Editorial "Manuscrito Vivo"
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Database,
  Layers,
  CloudRain,
  Compass,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  RotateCcw,
  Trash2,
  Volume2,
  Copy,
  Check,
  Send,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  CheckCircle2,
  FileText,
  List,
  GraduationCap,
  HelpCircle,
  Mic,
  MessageSquare,
} from 'lucide-react';
import {
  ResearchScope,
  ResponseStatusCategory,
  EpistemicStatus,
  ResearchMessage,
  ResearchConversation,
  RetrievedEvidenceItem,
  StructuredAcademicResponse,
  RehearsalJuryQuestion,
} from '../../types/research';
import { queryDissertationResearch } from '../../utils/researchApiClient';
import { SupportedLang } from '../../data/translations';
import { AppViewTab } from '../Header';

interface ResearchStationViewProps {
  onNavigateToTab?: (tab: AppViewTab, param?: string | number) => void;
  onSendToStudio?: (text: string, title?: string, questionId?: string) => void;
  currentLang?: SupportedLang;
}

const STORAGE_CONVERSATIONS_KEY = 'zavalavoz_research_conversations_v3';
const STORAGE_MESSAGES_KEY = 'zavalavoz_research_messages_v3';

const SCOPES_CONFIG: { id: ResearchScope; labelPt: string; labelEn: string }[] = [
  { id: 'todos', labelPt: 'Toda a dissertação', labelEn: 'All dissertation' },
  { id: 'metodologia', labelPt: 'Metodologia', labelEn: 'Methodology' },
  { id: 'dados', labelPt: 'Dados e estatística', labelEn: 'Data & statistics' },
  { id: 'clima', labelPt: 'Clima e CHIRPS', labelEn: 'Climate & CHIRPS' },
  { id: 'campo', labelPt: 'Trabalho de campo', labelEn: 'Fieldwork' },
  { id: 'sig', labelPt: 'SIG', labelEn: 'GIS' },
  { id: 'defesa', labelPt: 'Defesa', labelEn: 'Defense' },
  { id: 'bibliografia', labelPt: 'Bibliografia', labelEn: 'Bibliography' },
  { id: 'externo', labelPt: 'Conhecimento externo', labelEn: 'External knowledge' },
];

const CANONICAL_EDITORIAL_SUGGESTIONS: { text: string; scope: ResearchScope; subtitle: string }[] = [
  {
    text: 'Como foi reconstruída a série de 1994–2016?',
    scope: 'metodologia',
    subtitle: 'Metodologia em 3 camadas e teste de Chow',
  },
  {
    text: 'Porque a correlação CHIRPS não demonstra causalidade?',
    scope: 'clima',
    subtitle: 'r = 0,057; p = 0,762 e ausência de relação linear',
  },
  {
    text: 'Qual é o estatuto das 547.224 t?',
    scope: 'dados',
    subtitle: 'Estimativa contrafactual vs medição física de perdas',
  },
  {
    text: 'Quais são as principais limitações do SDAE?',
    scope: 'metodologia',
    subtitle: 'Série híbrida e abrangência dos relatórios 2017–2024',
  },
  {
    text: 'O que os dados de campo acrescentam à série histórica?',
    scope: 'campo',
    subtitle: '77 inquéritos etnográficos e voz do camponês',
  },
  {
    text: 'Como interpretar o colapso de 2023?',
    scope: 'dados',
    subtitle: 'Paradoxo de alta pluviosidade e quebra de -92,8%',
  },
];

export const ResearchStationView: React.FC<ResearchStationViewProps> = ({
  onNavigateToTab,
  onSendToStudio,
  currentLang = 'pt',
}) => {
  const isPt = currentLang === 'pt';

  const [activeScope, setActiveScope] = useState<ResearchScope>('todos');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showMobileHistory, setShowMobileHistory] = useState(false);

  // Modo Preparar para Defesa
  const [defensePreparationMode, setDefensePreparationMode] = useState<boolean>(false);

  // Controlo de exibição de perguntas de ensaio para a banca
  const [expandedJuryQuestions, setExpandedJuryQuestions] = useState<Record<string, boolean>>({});

  // Confirmação para limpeza de histórico
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  // Active Messages State
  const [messages, setMessages] = useState<ResearchMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MESSAGES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Saved Conversations History
  const [conversations, setConversations] = useState<ResearchConversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CONVERSATIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Current active conversation ID
  const [activeConversationId, setActiveConversationId] = useState<string>(() => {
    return `conv_${Date.now()}`;
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Synchronize localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CONVERSATIONS_KEY, JSON.stringify(conversations));
    } catch {}
  }, [conversations]);

  useEffect(() => {
    if (chatEndRef.current && messages.length > 0) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartNewConversation = () => {
    if (messages.length > 0) {
      const firstUserMsg = messages.find((m) => m.role === 'user');
      const title = firstUserMsg ? firstUserMsg.content.slice(0, 50) : 'Consulta Científica';
      const existingIdx = conversations.findIndex((c) => c.id === activeConversationId);
      const updatedConv: ResearchConversation = {
        id: activeConversationId,
        title,
        createdAt: messages[0]?.timestamp || Date.now(),
        updatedAt: Date.now(),
        scope: activeScope,
        messages: [...messages],
      };

      if (existingIdx >= 0) {
        const copy = [...conversations];
        copy[existingIdx] = updatedConv;
        setConversations(copy);
      } else {
        setConversations([updatedConv, ...conversations.slice(0, 19)]);
      }
    }

    setActiveConversationId(`conv_${Date.now()}`);
    setMessages([]);
    setInputText('');
    setErrorMessage(null);
    setShowMobileHistory(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleConfirmClearHistory = () => {
    setMessages([]);
    setConversations([]);
    localStorage.removeItem(STORAGE_MESSAGES_KEY);
    localStorage.removeItem(STORAGE_CONVERSATIONS_KEY);
    setActiveConversationId(`conv_${Date.now()}`);
    setShowMobileHistory(false);
    setShowClearConfirm(false);
  };

  const handleLoadSavedConversation = (conv: ResearchConversation) => {
    setActiveConversationId(conv.id);
    setMessages(conv.messages);
    setActiveScope(conv.scope || 'todos');
    setShowMobileHistory(false);
  };

  const handleToggleJuryQuestion = (messageId: string) => {
    setExpandedJuryQuestions((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const handleSendQuery = async (
    queryToSubmit?: string,
    scopeToUse?: ResearchScope,
    overrideDefenseMode?: boolean
  ) => {
    const textToSend = (queryToSubmit || inputText).trim();
    const currentScope = scopeToUse || activeScope;
    const useDefenseMode =
      overrideDefenseMode !== undefined ? overrideDefenseMode : defensePreparationMode;

    if (!textToSend || isLoading) return;

    setErrorMessage(null);
    setInputText('');

    const userMessage: ResearchMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
      scope: currentScope,
      defensePreparationMode: useDefenseMode,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const history = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await queryDissertationResearch(
        textToSend,
        currentScope,
        history,
        useDefenseMode,
        true
      );

      const assistantMessage: ResearchMessage = {
        id: `msg_asst_${Date.now()}`,
        role: 'assistant',
        content: res.answer,
        timestamp: Date.now(),
        scope: res.scope,
        epistemicStatus: res.epistemicStatus,
        statusCategory: res.statusCategory,
        evidences: res.retrievedEvidence,
        epistemicAlerts: res.epistemicAlerts,
        structuredResponse: res.structuredResponse,
        modelUsed: res.modelUsed,
        isExternalKnowledgeUsed: res.isExternalKnowledgeUsed,
        isFallback: res.isFallback,
        fallbackNotice: res.fallbackNotice,
        defensePreparationMode: res.defensePreparationMode,
        rehearsalQuestion: res.rehearsalQuestion,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Falha na consulta científica:', err);
      setErrorMessage(
        err?.message ||
          (isPt
            ? 'Não foi possível concluir a consulta ao corpus científico. Por favor, tente novamente.'
            : 'Unable to query scientific corpus. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainForDefense = (msgIndex: number) => {
    // Localizar a pergunta correspondente da utilizadora
    const prevUserMsg = [...messages.slice(0, msgIndex)].reverse().find((m) => m.role === 'user');
    if (prevUserMsg) {
      setDefensePreparationMode(true);
      handleSendQuery(prevUserMsg.content, prevUserMsg.scope, true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  const renderEpistemicStatusTag = (status?: EpistemicStatus) => {
    if (!status) return null;
    let label = status;
    let colorClasses = 'border-[#D9CDAF] bg-[#F4EFE6] text-[#1A2417]';

    switch (status) {
      case 'OBSERVADO':
        colorClasses = 'border-[#4A6B3E] bg-[#EAEFE8] text-[#244820]';
        break;
      case 'RECONSTITUÍDO':
      case 'MODELADO':
      case 'RECONSTITUÍDO / MODELADO':
        colorClasses = 'border-[#A8531E] bg-[#F9F3EA] text-[#7A3E15]';
        break;
      case 'TESTEMUNHO DE CAMPO':
        colorClasses = 'border-[#57634F] bg-[#F1EFEA] text-[#33422E]';
        break;
      case 'CONTEXTUALIZAÇÃO EXTERNA':
        colorClasses = 'border-[#8C7D6B] bg-[#F4EFE6] text-[#554A3D]';
        break;
      case 'INTERPRETAÇÃO':
      default:
        colorClasses = 'border-[#D9CDAF] bg-[#FCFAF6] text-[#4F5C48]';
        break;
    }

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] font-mono text-[10px] font-bold uppercase tracking-wider border ${colorClasses}`}
      >
        <span className="opacity-70 font-normal">Estatuto:</span>
        <span>{label}</span>
      </span>
    );
  };

  const renderStatusCategoryBadge = (category?: ResponseStatusCategory) => {
    switch (category) {
      case 'SUPORTADA PELOS DADOS':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#244820]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6B3E]" />
            <span>Suportada pelos Dados</span>
          </span>
        );
      case 'INTERPRETAÇÃO':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#7A3E15]">
            <Info className="w-3.5 h-3.5 text-[#A8531E]" />
            <span>Interpretação Científica</span>
          </span>
        );
      case 'CONTEXTUALIZAÇÃO EXTERNA':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#554A3D]">
            <BookOpen className="w-3.5 h-3.5 text-[#57634F]" />
            <span>Contextualização Externa</span>
          </span>
        );
      case 'SUPORTE INSUFICIENTE':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#7A3E15]">
            <AlertTriangle className="w-3.5 h-3.5 text-[#A8531E]" />
            <span>Suporte Insuficiente</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Modal de Confirmação de Limpeza de Histórico */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-[#FCFAF6] border-2 border-[#2A3A24] rounded-[4px] p-5 max-w-md w-full space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-[#A8531E]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider">
                {isPt ? 'Limpar Histórico Local' : 'Clear Local History'}
              </h3>
            </div>
            <p className="text-xs font-sans text-[#1A2417] leading-relaxed">
              {isPt
                ? 'Deseja apagar todas as consultas e índices guardados no histórico do navegador? Esta ação é irreversível e reinicializa a sessão.'
                : 'Do you want to clear all queries stored in browser history? This action is irreversible.'}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D9CDAF]">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 rounded-[2px] bg-[#F4EFE6] text-[#57634F] hover:bg-[#EAE2D2] text-xs font-mono transition-colors cursor-pointer"
              >
                {isPt ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmClearHistory}
                className="px-3 py-1.5 rounded-[2px] bg-[#A8531E] text-[#FCFAF6] hover:bg-[#8F4315] text-xs font-mono font-semibold transition-colors cursor-pointer"
              >
                {isPt ? 'Confirmar Limpeza' : 'Confirm Clear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Header do Manuscrito Vivo */}
      <header className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE2D2]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-[2px] bg-[#2A3A24] text-[#FCFAF6] font-mono text-[10px] font-bold uppercase tracking-wider">
                ÍNDICE ACADÉMICO VIVO
              </span>
              <span className="text-[11px] font-mono text-[#57634F]">
                ZAVALAVOZ • UEM / ESUDER
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1A2417] tracking-tight mt-1">
              PESQUISA CIENTÍFICA
            </h1>
            <p className="text-sm font-serif italic text-[#57634F] mt-0.5">
              “Consulte a dissertação, os dados primários do SDAE, o modelo em três camadas e os testemunhos de campo”
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={handleStartNewConversation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-[#F4EFE6] text-[#1A2417] hover:bg-[#EAE2D2] border border-[#D9CDAF] text-xs font-mono font-medium transition-colors cursor-pointer"
              title={isPt ? 'Iniciar uma nova consulta no índice' : 'Start new query'}
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#57634F]" />
              <span>{isPt ? 'Nova Consulta' : 'New Query'}</span>
            </button>

            {conversations.length > 0 && (
              <button
                type="button"
                onClick={() => setShowMobileHistory(!showMobileHistory)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-[#F4EFE6] text-[#1A2417] hover:bg-[#EAE2D2] border border-[#D9CDAF] text-xs font-mono font-medium transition-colors cursor-pointer"
              >
                <List className="w-3.5 h-3.5 text-[#57634F]" />
                <span>{isPt ? `Índice (${conversations.length})` : `Index (${conversations.length})`}</span>
              </button>
            )}

            {conversations.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[3px] text-[#57634F] hover:text-[#A8531E] hover:bg-[#F4EFE6] text-xs font-mono transition-colors cursor-pointer"
                title={isPt ? 'Limpar histórico local guardado' : 'Clear history'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isPt ? 'Limpar' : 'Clear'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Selector Discreto de Consulta com Tipografia e Divisores Editoriais */}
        <div className="pt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs font-mono">
          <span className="font-bold text-[#1A2417] uppercase tracking-wider text-[11px] mr-1">
            CONSULTA:
          </span>
          {SCOPES_CONFIG.map((sc, sIdx) => {
            const isSelected = activeScope === sc.id;
            return (
              <React.Fragment key={sc.id}>
                <button
                  type="button"
                  onClick={() => setActiveScope(sc.id)}
                  className={`px-1.5 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#2A3A24] text-[#FCFAF6] font-bold'
                      : 'text-[#57634F] hover:text-[#1A2417] hover:underline underline-offset-4'
                  }`}
                  aria-pressed={isSelected}
                >
                  {isPt ? sc.labelPt : sc.labelEn}
                </button>
                {sIdx < SCOPES_CONFIG.length - 1 && (
                  <span className="text-[#D9CDAF] select-none text-[10px]">•</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </header>

      {/* 2. Layout Principal Desktop: 2 Colunas (Índice da Investigação | Resposta Actual) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* COLUNA ESQUERDA: Índice da Investigação e Sugestões Editoriais */}
        <aside
          className={`lg:col-span-4 space-y-4 ${
            showMobileHistory ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Índice das Consultas Anteriores */}
          <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE2D2]">
              <span className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#1A2417]">
                <Clock className="w-3.5 h-3.5 text-[#A8531E]" />
                {isPt ? 'Índice da Investigação' : 'Investigation Index'}
              </span>
              <span className="text-[10px] font-mono text-[#57634F]">
                {conversations.length} {isPt ? 'registos' : 'records'}
              </span>
            </div>

            {conversations.length === 0 ? (
              <p className="text-xs font-serif italic text-[#57634F] py-2">
                {isPt
                  ? 'Nenhuma consulta gravada no índice local. As consultas realizadas serão guardadas automaticamente aqui.'
                  : 'No queries saved in the local index yet.'}
              </p>
            ) : (
              <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => handleLoadSavedConversation(conv)}
                    className={`w-full text-left p-2.5 rounded-[3px] border transition-colors cursor-pointer space-y-1 ${
                      conv.id === activeConversationId
                        ? 'bg-[#EAE2D2] border-[#2A3A24] text-[#1A2417]'
                        : 'bg-[#F4EFE6] border-[#D9CDAF] hover:bg-[#EDE7D9] text-[#1A2417]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#A8531E]">
                      <span className="uppercase font-bold">{conv.scope}</span>
                      <span>{new Date(conv.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs font-medium text-[#1A2417] line-clamp-2 leading-snug">
                      {conv.title}
                    </p>
                    <p className="text-[10px] font-mono text-[#57634F]">
                      {conv.messages.length} {isPt ? 'passos analíticos' : 'analytical steps'}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sugestões Editoriais de Investigação (As 6 Perguntas Canónicas) */}
          <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 space-y-3">
            <div className="pb-2 border-b border-[#EAE2D2]">
              <span className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#1A2417]">
                <FileText className="w-3.5 h-3.5 text-[#A8531E]" />
                {isPt ? 'Sugestões de Investigação' : 'Investigation Prompts'}
              </span>
              <p className="text-[11px] font-serif italic text-[#57634F] mt-0.5">
                {isPt ? 'Perguntas canónicas da dissertação de Yolanda Tamele' : 'Canonical dissertation questions'}
              </p>
            </div>

            <div className="space-y-1.5">
              {CANONICAL_EDITORIAL_SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveScope(sug.scope);
                    handleSendQuery(sug.text, sug.scope);
                  }}
                  className="group w-full text-left p-2 rounded-[3px] bg-[#F4EFE6] hover:bg-[#EAE2D2] border border-[#D9CDAF] transition-colors cursor-pointer space-y-0.5"
                >
                  <p className="text-xs font-medium text-[#1A2417] group-hover:text-[#2A3A24] leading-snug">
                    {sug.text}
                  </p>
                  <p className="text-[10px] font-mono text-[#57634F] truncate">
                    {sug.subtitle}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* COLUNA DIREITA: Composer + Resposta Atual (O Manuscrito Vivo) */}
        <main className="lg:col-span-8 space-y-4">
          {/* COMPOSER / CAMPO DE PERGUNTA (Centro Funcional da Pesquisa) */}
          <section className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="research-inquiry-input"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1A2417]"
              >
                {isPt ? 'Consulta ao Corpus Científico' : 'Scientific Corpus Query'}
              </label>

              {/* Opção Preparar para Defesa */}
              <label className="inline-flex items-center gap-2 text-xs font-mono text-[#1A2417] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={defensePreparationMode}
                  onChange={(e) => setDefensePreparationMode(e.target.checked)}
                  className="rounded border-[#D9CDAF] text-[#2A3A24] focus:ring-[#2A3A24] w-3.5 h-3.5 cursor-pointer"
                />
                <span className={defensePreparationMode ? 'font-bold text-[#A8531E]' : 'text-[#57634F]'}>
                  {isPt ? 'Preparar para defesa (sustentação oral)' : 'Prepare for defense (oral format)'}
                </span>
              </label>
            </div>

            <div className="relative">
              <textarea
                id="research-inquiry-input"
                ref={inputRef}
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder={
                  isPt
                    ? 'Faça uma pergunta sobre a dissertação…'
                    : 'Ask a question about the dissertation…'
                }
                className="w-full p-3.5 pr-28 rounded-[3px] bg-[#FFFFFF] border border-[#D9CDAF] text-[#1A2417] text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#2A3A24] focus:border-[#2A3A24] resize-none placeholder:text-[#8C7D6B] leading-relaxed"
              />
              <div className="absolute right-2.5 bottom-3 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSendQuery()}
                  disabled={!inputText.trim() || isLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-[#2A3A24] text-[#FCFAF6] hover:bg-[#1A2417] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-mono font-medium transition-colors cursor-pointer"
                  title={isPt ? 'Submeter pergunta ao índice científico' : 'Submit query'}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isPt ? 'Consultar' : 'Query'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono text-[#57634F] pt-0.5">
              <span className="font-serif italic">
                Enter para consultar • Shift + Enter para nova linha
              </span>
              <span className="text-[10px] uppercase tracking-wider">
                {isPt ? `Contexto: ${activeScope.toUpperCase()}` : `Scope: ${activeScope.toUpperCase()}`}
              </span>
            </div>
          </section>

          {/* Mensagem de Erro se houver */}
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-[3px] bg-[#FCFAF6] border-l-4 border-[#A8531E] border-y border-r border-[#D9CDAF] text-xs text-[#1A2417] flex items-start justify-between gap-2"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#A8531E] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-mono text-[#A8531E] uppercase text-[11px]">
                    Aviso do Índice Científico:
                  </strong>
                  <p className="mt-0.5 leading-relaxed font-sans">{errorMessage}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-sm font-bold text-[#57634F] hover:text-[#1A2417] cursor-pointer"
                aria-label="Fechar mensagem de erro"
              >
                ×
              </button>
            </div>
          )}

          {/* ÁREA EDITORIAL DA RESPOSTA ("O Manuscrito Vivo") */}
          <section className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 sm:p-6 min-h-[440px] space-y-6">
            {messages.length === 0 ? (
              /* Estado Inicial / Vazio: Guia Editorial */
              <div className="py-8 text-center max-w-xl mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#EAE2D2] text-[#2A3A24] flex items-center justify-center mx-auto border border-[#D9CDAF]">
                  <BookOpen className="w-6 h-6 text-[#A8531E]" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-display font-bold text-[#1A2417]">
                    Índice Científico de Zavala (1994–2024)
                  </h2>
                  <p className="text-xs font-mono uppercase tracking-wider text-[#57634F]">
                    Dissertação de Yolanda Tamele • ESUDER / UEM
                  </p>
                </div>
                <p className="text-sm font-sans text-[#57634F] leading-relaxed">
                  Consulte os 31 anos da série temporal de mandioca, a reconstituição em 3 camadas, a correlação satelital CHIRPS ($r = 0,057$), a estimativa contrafactual de 547.224 t e os inquéritos a 77 produtores rurais.
                </p>
                <p className="text-xs font-serif italic text-[#8C7D6B]">
                  Selecione uma sugestão no painel esquerdo ou digite a sua pergunta no campo acima.
                </p>
              </div>
            ) : (
              /* Ciclo Editorial das Mensagens */
              <div className="space-y-8" aria-live="polite">
                {messages.map((msg, mIdx) => (
                  <article key={msg.id} className="space-y-4">
                    {msg.role === 'user' ? (
                      /* Bloco da Pergunta da Investigadora */
                      <div className="bg-[#EAE2D2] border-l-4 border-[#2A3A24] p-3.5 sm:p-4 rounded-[2px]">
                        <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-[#57634F] mb-1">
                          <span className="font-bold uppercase tracking-wider text-[#1A2417] flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-[#2A3A24]" />
                            {isPt ? 'Pergunta da Investigadora' : 'Candidate Query'}
                            {msg.defensePreparationMode && (
                              <span className="ml-1 px-1.5 py-0.2 rounded-[2px] bg-[#A8531E] text-[#FCFAF6] text-[9px] font-mono font-bold">
                                MODO DEFESA
                              </span>
                            )}
                          </span>
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-base sm:text-lg font-display font-medium text-[#1A2417] leading-snug">
                          {msg.content}
                        </p>
                      </div>
                    ) : (
                      /* Bloco Académico da Resposta em 4 NÍVEIS DISCRETOS */
                      <div className="border border-[#D9CDAF] bg-[#FFFFFF] rounded-[3px] p-4 sm:p-6 space-y-5">
                        {/* 1. Cabeçalho Editorial do Bloco */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EAE2D2]">
                          <div className="flex flex-wrap items-center gap-2">
                            {renderEpistemicStatusTag(msg.epistemicStatus)}
                            {renderStatusCategoryBadge(msg.statusCategory)}
                          </div>

                          {/* Ações Rápidas: Explicar para Defesa, Pergunta de Ensaio, Copiar, Áudio */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* Transformar em pergunta da banca */}
                            <button
                              type="button"
                              onClick={() => handleToggleJuryQuestion(msg.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] text-[11px] font-mono transition-colors cursor-pointer border ${
                                expandedJuryQuestions[msg.id]
                                  ? 'bg-[#2A3A24] text-[#FCFAF6] border-[#2A3A24]'
                                  : 'text-[#2A3A24] hover:bg-[#F4EFE6] border-[#D9CDAF]'
                              }`}
                              title={isPt ? 'Transformar em pergunta da banca examinadora' : 'Transform into jury question'}
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-[#A8531E]" />
                              <span>{isPt ? 'Transformar em pergunta da banca' : 'Jury question'}</span>
                            </button>

                            {/* Explicar para a Defesa (se não for já formato oral) */}
                            {!msg.structuredResponse?.oralDefense && (
                              <button
                                type="button"
                                onClick={() => handleExplainForDefense(mIdx)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] text-[11px] font-mono text-[#A8531E] hover:bg-[#F4EFE6] border border-[#D9CDAF] transition-colors cursor-pointer"
                                title={isPt ? 'Explicar com tom oral para sustentação perante a banca' : 'Explain for oral defense'}
                              >
                                <Mic className="w-3.5 h-3.5 text-[#A8531E]" />
                                <span>{isPt ? 'Explicar para a defesa' : 'Explain for defense'}</span>
                              </button>
                            )}

                            {onSendToStudio && (
                              <button
                                type="button"
                                onClick={() => {
                                  onSendToStudio(
                                    msg.content,
                                    `Consulta: ${
                                      messages.find((m) => m.role === 'user')?.content.slice(0, 30) || 'Pesquisa'
                                    }`
                                  );
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] text-[11px] font-mono text-[#2A3A24] hover:bg-[#F4EFE6] border border-[#D9CDAF] transition-colors cursor-pointer"
                                title={isPt ? 'Carregar resposta no Estúdio de Voz' : 'Load into Audio Studio'}
                              >
                                <Volume2 className="w-3.5 h-3.5 text-[#A8531E]" />
                                <span>{isPt ? 'Ouvir no Estúdio' : 'Audio Studio'}</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] text-[11px] font-mono text-[#57634F] hover:text-[#1A2417] hover:bg-[#F4EFE6] border border-[#D9CDAF] transition-colors cursor-pointer"
                              title={isPt ? 'Copiar texto completo' : 'Copy text'}
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-[#4A6B3E]" />
                                  <span className="text-[#4A6B3E]">{isPt ? 'Copiado' : 'Copied'}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>{isPt ? 'Copiar' : 'Copy'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Aviso 1: Fallback se aplicável */}
                        {msg.fallbackNotice && (
                          <div className="p-2.5 rounded-[2px] bg-[#F4EFE6] border border-[#D9CDAF] text-[11px] font-mono text-[#57634F] flex items-center gap-2">
                            <Info className="w-3.5 h-3.5 text-[#A8531E] shrink-0" />
                            <span>{msg.fallbackNotice}</span>
                          </div>
                        )}

                        {/* Aviso 2: Contextualização Externa (Obrigatório Secção 18) */}
                        {(msg.isExternalKnowledgeUsed ||
                          msg.statusCategory === 'CONTEXTUALIZAÇÃO EXTERNA' ||
                          msg.structuredResponse?.externalContextNotice) && (
                          <div className="p-3 rounded-[2px] bg-[#F4EFE6] border-l-4 border-[#8C7D6B] border-y border-r border-[#D9CDAF] text-xs font-mono space-y-0.5">
                            <span className="font-bold uppercase tracking-wider text-[10px] block text-[#554A3D]">
                              CONTEXTUALIZAÇÃO EXTERNA
                            </span>
                            <p className="font-sans text-[#1A2417] italic">
                              “Esta informação não pertence ao corpus documental da dissertação.”
                            </p>
                          </div>
                        )}

                        {/* Aviso 3: Lacuna Documental (Obrigatório Secção 19) */}
                        {(msg.statusCategory === 'SUPORTE INSUFICIENTE' ||
                          msg.structuredResponse?.dataGapNotice) && (
                          <div className="p-3 rounded-[2px] bg-[#F4EFE6] border-l-4 border-[#A8531E] border-y border-r border-[#D9CDAF] text-xs font-mono space-y-0.5">
                            <span className="font-bold uppercase tracking-wider text-[10px] block text-[#A8531E]">
                              LACUNA DOCUMENTAL
                            </span>
                            <p className="font-sans text-[#1A2417] italic">
                              “Não encontrei evidência suficiente no corpus científico da plataforma para sustentar essa afirmação.”
                            </p>
                          </div>
                        )}

                        {/* Bloco de Pergunta da Banca Expandido (Secção 12) */}
                        {expandedJuryQuestions[msg.id] && msg.rehearsalQuestion && (
                          <div className="p-4 rounded-[3px] bg-[#F4EFE6] border-2 border-[#2A3A24] space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D9CDAF] pb-2">
                              <span className="px-2 py-0.5 rounded-[2px] bg-[#2A3A24] text-[#FCFAF6] font-mono text-[10px] font-bold uppercase tracking-wider">
                                PERGUNTA GERADA PARA ENSAIO
                              </span>
                              <span className="text-[10px] font-mono text-[#57634F]">
                                Cenário: {msg.rehearsalQuestion.scenario}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A8531E]">
                                Pergunta do Examinador:
                              </span>
                              <p className="text-sm sm:text-base font-display font-medium text-[#1A2417] italic">
                                “{msg.rehearsalQuestion.examinerQuestion}”
                              </p>
                            </div>

                            {msg.rehearsalQuestion.vulnerabilityCode && (
                              <div className="text-xs font-mono text-[#57634F] bg-[#FCFAF6] p-2 rounded-[2px] border border-[#D9CDAF]">
                                <span className="font-bold text-[#A8531E]">Vulnerabilidade Relacionada: </span>
                                <span>
                                  {msg.rehearsalQuestion.vulnerabilityCode} — {msg.rehearsalQuestion.vulnerabilityTitle}
                                </span>
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div className="p-2.5 rounded-[2px] bg-[#FCFAF6] border border-[#D9CDAF] space-y-0.5">
                                <span className="font-mono font-bold text-[10px] text-[#2A3A24] uppercase block">
                                  Evidência Documental:
                                </span>
                                <p className="font-sans text-[#57634F] text-[11px] leading-snug">
                                  {msg.rehearsalQuestion.supportingEvidence}
                                </p>
                              </div>
                              <div className="p-2.5 rounded-[2px] bg-[#FCFAF6] border border-[#D9CDAF] space-y-0.5">
                                <span className="font-mono font-bold text-[10px] text-[#A8531E] uppercase block">
                                  Ângulo de Sustentação:
                                </span>
                                <p className="font-sans text-[#57634F] text-[11px] leading-snug">
                                  {msg.rehearsalQuestion.defenseAngle}
                                </p>
                              </div>
                            </div>

                            {onNavigateToTab && (
                              <div className="pt-2 border-t border-[#D9CDAF] flex justify-end">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onNavigateToTab('defesa', msg.rehearsalQuestion?.vulnerabilityCode || undefined)
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-[#2A3A24] text-[#FCFAF6] hover:bg-[#1A2417] text-xs font-mono font-semibold transition-colors cursor-pointer"
                                >
                                  <span>Praticar na Defesa</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* NÍVEL 1: RESPOSTA (Texto contínuo académico ou Sustentação Oral em 4 partes) */}
                        <div className="space-y-2">
                          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A8531E] flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            <span>
                              {msg.structuredResponse?.oralDefense
                                ? 'SUSTENTAÇÃO ORAL PARA DEFESA'
                                : 'RESPOSTA'}
                            </span>
                          </h3>

                          {msg.structuredResponse?.oralDefense ? (
                            /* Modo Sustentação Oral (EU DIRIA / OS DADOS MOSTRAM / CONTUDO / POR ISSO) */
                            <div className="space-y-3 bg-[#F4EFE6] border border-[#D9CDAF] rounded-[3px] p-4">
                              <div className="space-y-1">
                                <span className="font-mono font-bold text-xs text-[#A8531E] block">
                                  EU DIRIA...
                                </span>
                                <p className="text-sm sm:text-base font-sans leading-relaxed pl-3 border-l-2 border-[#A8531E] font-medium text-[#1A2417]">
                                  {msg.structuredResponse.oralDefense.euDiria}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <span className="font-mono font-bold text-xs text-[#2A3A24] block">
                                  OS DADOS MOSTRAM...
                                </span>
                                <p className="text-sm font-sans leading-relaxed pl-3 border-l-2 border-[#2A3A24] text-[#1A2417]">
                                  {msg.structuredResponse.oralDefense.osDadosMostram}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <span className="font-mono font-bold text-xs text-[#57634F] block">
                                  CONTUDO...
                                </span>
                                <p className="text-sm font-sans leading-relaxed pl-3 border-l-2 border-[#57634F] italic text-[#2C3727]">
                                  {msg.structuredResponse.oralDefense.contudo}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <span className="font-mono font-bold text-xs text-[#1A2417] block">
                                  POR ISSO...
                                </span>
                                <p className="text-sm sm:text-base font-sans leading-relaxed pl-3 border-l-2 border-[#1A2417] font-medium text-[#1A2417]">
                                  {msg.structuredResponse.oralDefense.porIsso}
                                </p>
                              </div>

                              {msg.structuredResponse.oralDefense.seABancaApertar && (
                                <div className="space-y-1 pt-2 border-t border-[#D9CDAF]/60">
                                  <span className="font-mono font-bold text-xs text-[#8C2D19] block">
                                    SE A BANCA APERTAR...
                                  </span>
                                  <p className="text-sm font-sans leading-relaxed pl-3 border-l-2 border-[#8C2D19] italic text-[#1A2417]">
                                    {msg.structuredResponse.oralDefense.seABancaApertar}
                                  </p>
                                </div>
                              )}

                              {msg.structuredResponse.oralDefense.resposta && (
                                <div className="space-y-1">
                                  <span className="font-mono font-bold text-xs text-[#1A2417] block">
                                    RESPOSTA
                                  </span>
                                  <p className="text-sm sm:text-base font-sans leading-relaxed pl-3 border-l-2 border-[#1A2417] font-medium text-[#1A2417]">
                                    {msg.structuredResponse.oralDefense.resposta}
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            /* Formato Padrão Editorial */
                            <div className="text-sm sm:text-base font-sans text-[#1A2417] leading-relaxed whitespace-pre-wrap">
                              {msg.structuredResponse?.answerText || msg.content}
                            </div>
                          )}
                        </div>

                        {/* NÍVEL 2: EVIDÊNCIA (Fontes internas com rastreabilidade) */}
                        {msg.evidences && msg.evidences.length > 0 && (
                          <div className="space-y-2 pt-4 border-t border-[#EAE2D2]">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2A3A24] flex items-center gap-1.5">
                                <Database className="w-3.5 h-3.5 text-[#A8531E]" />
                                <span>EVIDÊNCIA ({msg.evidences.length})</span>
                              </h3>
                              <span className="text-[10px] font-mono text-[#57634F]">
                                Rastreabilidade Canónica
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {msg.evidences.map((ev, eIdx) => (
                                <div
                                  key={ev.id || eIdx}
                                  className="p-3 rounded-[3px] bg-[#FCFAF6] border border-[#D9CDAF] space-y-1.5"
                                >
                                  <div className="flex items-start justify-between gap-1">
                                    <span className="text-[10px] font-mono font-bold text-[#A8531E] uppercase">
                                      {ev.provenanceTrail || ev.source}
                                    </span>
                                    {ev.targetTab && onNavigateToTab && (
                                      <button
                                        type="button"
                                        onClick={() => onNavigateToTab(ev.targetTab!, ev.targetParam)}
                                        className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-[#2A3A24] hover:text-[#A8531E] hover:underline cursor-pointer shrink-0"
                                        title={`Ver evidência no contexto da aba ${ev.targetTab}`}
                                      >
                                        <span>{isPt ? 'Ver evidência' : 'View evidence'}</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>

                                  <p className="text-xs font-medium text-[#1A2417] leading-tight">
                                    {ev.section}
                                  </p>

                                  {ev.tableOrFigure && (
                                    <p className="text-[10px] font-mono text-[#57634F]">
                                      Referência: {ev.tableOrFigure}
                                    </p>
                                  )}

                                  <p className="text-[11px] font-sans text-[#57634F] leading-snug line-clamp-3">
                                    {ev.snippet}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* NÍVEL 3: INTERPRETAÇÃO (Dado documentado vs Interpretação vs Inferência) */}
                        <div className="space-y-2 pt-4 border-t border-[#EAE2D2]">
                          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#57634F] flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-[#57634F]" />
                            <span>INTERPRETAÇÃO</span>
                          </h3>
                          <div className="p-3 rounded-[3px] bg-[#FCFAF6] border border-[#EAE2D2] text-xs font-sans text-[#1A2417] leading-relaxed whitespace-pre-wrap">
                            {msg.structuredResponse?.interpretationBreakdown ||
                              (msg.epistemicStatus === 'OBSERVADO'
                                ? '• Dado Documentado: Registo oficial e primário do SDAE.\n• Interpretação: Análise descritiva dos relatórios da safra.'
                                : msg.epistemicStatus === 'RECONSTITUÍDO / MODELADO'
                                ? '• Dado Reconstituído: Estimativa em 3 camadas determinísticas.\n• Interpretação da Dissertação: Validação econométrica por quebra de Chow (F = 0,84; p = 0,443).'
                                : msg.epistemicStatus === 'TESTEMUNHO DE CAMPO'
                                ? '• Testemunho de Campo: Percepção empírica camponesa (voz do produtor, sem diagnóstico laboratorial molecular).\n• Interpretação: Sintomas compatíveis com virose ou alagamento radicular.'
                                : '• Interpretação Científica fundamentada no corpus metodológico da dissertação.')}
                          </div>
                        </div>

                        {/* NÍVEL 4: LIMITAÇÃO (Apresentação discreta e metodológica) */}
                        {(msg.structuredResponse?.methodologicalLimitation ||
                          (msg.epistemicAlerts && msg.epistemicAlerts.length > 0)) && (
                          <div className="space-y-2 pt-4 border-t border-[#EAE2D2]">
                            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#57634F] flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5 text-[#57634F]" />
                              <span>LIMITAÇÃO</span>
                            </h3>

                            {msg.structuredResponse?.methodologicalLimitation && (
                              <p className="text-xs font-sans italic text-[#57634F] leading-relaxed pl-3 border-l-2 border-[#D9CDAF]">
                                {msg.structuredResponse.methodologicalLimitation}
                              </p>
                            )}

                            {/* Alertas de Salvaguarda Epistemológica se ativados */}
                            {msg.epistemicAlerts && msg.epistemicAlerts.length > 0 && (
                              <div className="mt-2 p-3 rounded-[3px] bg-[#FCFAF6] border border-[#D9CDAF] space-y-1.5 text-xs">
                                <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#A8531E] uppercase tracking-wider">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span>Salvaguardas da Investigação Aplicadas:</span>
                                </div>
                                {msg.epistemicAlerts.map((alert, aIdx) => (
                                  <div key={aIdx} className="text-[#1A2417] leading-snug pl-3 border-l border-[#A8531E]">
                                    <strong>{alert.riskLabel}:</strong> {alert.guardrailMessage}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Rodapé Institucional Discreto */}
                        <div className="pt-3 border-t border-[#EAE2D2] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-serif italic text-[#8C7D6B]">
                          <p>
                            Resposta estruturada com base no corpus científico da dissertação de Yolanda Tamele (ESUDER / UEM).
                          </p>
                          <p className="shrink-0">
                            Não substitui a leitura da dissertação nem o juízo de avaliação académica.
                          </p>
                        </div>
                      </div>
                    )}
                  </article>
                ))}

                {/* Indicador de Carregamento Editorial */}
                {isLoading && (
                  <div className="bg-[#FFFFFF] border border-[#D9CDAF] rounded-[3px] p-4 flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-[#A8531E] border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-xs font-mono text-[#57634F] space-y-0.5">
                      <p className="font-bold text-[#1A2417] uppercase tracking-wider">
                        {isPt ? 'A consultar o corpus científico…' : 'Querying scientific corpus…'}
                      </p>
                      <p className="text-[11px] text-[#8C7D6B]">
                        Recuperando evidências do SSoT, verificando estatuto epistemológico e formatando resposta editorial.
                      </p>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};
