import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  ShieldAlert,
  Award,
  BookOpen,
  Send,
  Sparkles,
  RefreshCw,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  History,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { Button } from '../common/Button';
import {
  ExaminerId,
  PressureLevel,
  DefenseTone,
  DomainClassification,
  AdaptiveQuestion,
  AdaptiveEvaluationResult,
  ArgumentationStepRecord,
  FinalDefenseReport,
  EXAMINER_PROFILES,
  CANONICAL_ADAPTIVE_QUESTIONS,
  evaluateCandidateResponse,
  selectNextAdaptiveQuestion,
  generateFinalDefenseReport,
  generateModelCandidateResponse,
  saveAdaptiveSessionLocally,
  loadAdaptiveSessionLocally,
} from '../../data/adaptiveDefenseEngine';

interface AdaptiveDefenseRoomViewProps {
  onPlayQuickSpeech?: (text: string) => void;
  currentLang?: 'pt' | 'en';
}

export const AdaptiveDefenseRoomView: React.FC<AdaptiveDefenseRoomViewProps> = ({
  onPlayQuickSpeech,
  currentLang = 'pt',
}) => {
  // Configuração da Sessão
  const [selectedExaminerId, setSelectedExaminerId] = useState<ExaminerId>('metodologia_estatistica');
  const [tone, setTone] = useState<DefenseTone>('realista');
  const [sessionLength, setSessionLength] = useState<number>(5);

  // Estado da Arguição
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [startedAt, setStartedAt] = useState<string>('');
  const [history, setHistory] = useState<ArgumentationStepRecord[]>([]);

  // Pergunta Activa e Resposta da Candidata
  const [currentQuestion, setCurrentQuestion] = useState<AdaptiveQuestion>(CANONICAL_ADAPTIVE_QUESTIONS[0]);
  const [candidateResponse, setCandidateResponse] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<AdaptiveEvaluationResult | null>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());

  // Treino e Modal da Resposta Modelo
  const [isTrainingOpen, setIsTrainingOpen] = useState<boolean>(false);

  // Mapa da Argumentação & Relatório
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  const [finalReport, setFinalReport] = useState<FinalDefenseReport | null>(null);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  const examiner = EXAMINER_PROFILES[selectedExaminerId];

  // Iniciar Nova Sessão
  const handleStartSession = () => {
    const newSessionId = `def_${Date.now()}`;
    const startIso = new Date().toISOString();
    const initialQ = CANONICAL_ADAPTIVE_QUESTIONS.find((q) => q.examinerId === selectedExaminerId) || CANONICAL_ADAPTIVE_QUESTIONS[0];

    setSessionId(newSessionId);
    setStartedAt(startIso);
    setCurrentQuestion(initialQ);
    setCandidateResponse('');
    setCurrentEvaluation(null);
    setHistory([]);
    setFinalReport(null);
    setUsedQuestionIds(new Set([initialQ.id]));
    setIsSessionActive(true);
    setIsTrainingOpen(false);
  };

  // Submeter Resposta da Candidata
  const handleSubmitResponse = () => {
    if (!candidateResponse.trim() || isEvaluating) return;

    setIsEvaluating(true);

    setTimeout(() => {
      const evalResult = evaluateCandidateResponse({
        question: currentQuestion,
        candidateResponse: candidateResponse.trim(),
        examinerProfile: examiner,
        tone,
        history,
        sessionLength,
      });

      setCurrentEvaluation(evalResult);

      // Gravar passo no histórico
      const stepRecord: ArgumentationStepRecord = {
        stepNumber: history.length + 1,
        examinerId: selectedExaminerId,
        pressureLevel: currentQuestion.level,
        questionId: currentQuestion.id,
        questionText: currentQuestion.questionText,
        questionTag: currentQuestion.tag,
        candidateResponse: candidateResponse.trim(),
        domain: evalResult.domain,
        evidenceUsed: currentQuestion.expectedCoreEvidence,
        epistemicStatuses: evalResult.epistemicStatusUsed,
        vulnerabilityDetected: evalResult.problematicClaim || evalResult.conceptOmitted,
        examinerReplica: evalResult.examinerReplica,
        nextQuestionText: evalResult.reading.nextQuestion,
        timestamp: new Date().toLocaleTimeString(),
      };

      const updatedHistory = [...history, stepRecord];
      setHistory(updatedHistory);

      saveAdaptiveSessionLocally({
        sessionId,
        createdAt: startedAt,
        examinerId: selectedExaminerId,
        tone,
        targetCount: sessionLength,
        history: updatedHistory,
        isCompleted: updatedHistory.length >= sessionLength,
      });

      setIsEvaluating(false);
    }, 450);
  };

  // Avançar para a Próxima Pergunta ou Concluir
  const handleNextQuestion = () => {
    if (!currentEvaluation) return;

    if (history.length >= sessionLength) {
      // Concluir Sessão e Gerar Relatório
      const report = generateFinalDefenseReport(
        sessionId,
        startedAt,
        selectedExaminerId,
        tone,
        history
      );
      setFinalReport(report);
      saveAdaptiveSessionLocally({
        sessionId,
        createdAt: startedAt,
        examinerId: selectedExaminerId,
        tone,
        targetCount: sessionLength,
        history,
        isCompleted: true,
        finalReport: report,
      });
      return;
    }

    const nextQ = selectNextAdaptiveQuestion(
      currentQuestion,
      currentEvaluation,
      selectedExaminerId,
      usedQuestionIds
    );

    setCurrentQuestion(nextQ);
    setUsedQuestionIds((prev) => new Set([...prev, nextQ.id]));
    setCandidateResponse('');
    setCurrentEvaluation(null);
    setIsTrainingOpen(false);
  };

  // Inserir modelo estruturado
  const handleInsertScaffold = (prefix: string) => {
    setCandidateResponse((prev) => (prev ? `${prev}\n\n${prefix} ` : `${prefix} `));
  };

  // Renderizar Nível de Pressão
  const renderPressureBadge = (level: PressureLevel) => {
    const labels = {
      1: { text: 'Nível 1: Compreensão', bg: 'bg-[#EBF1E8] text-[#2A3A24] border-[#C8D6C2]' },
      2: { text: 'Nível 2: Justificação', bg: 'bg-[#F4EFE6] text-[#4F5C48] border-[#D9CDAF]' },
      3: { text: 'Nível 3: Confrontação', bg: 'bg-[#FDF3E7] text-[#9A5212] border-[#F2D1A8]' },
      4: { text: 'Nível 4: Adversarial', bg: 'bg-[#FDF0EE] text-[#8C2D19] border-[#F2BBB2]' },
    };
    const current = labels[level];
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded border uppercase tracking-wider ${current.bg}`}>
        {current.text}
      </span>
    );
  };

  // Renderizar Domínio Qualitativo (SEM NÚMEROS)
  const renderDomainBadge = (dom: DomainClassification) => {
    const map = {
      FORTE: { text: 'Domínio Forte', bg: 'bg-[#2A3A24] text-[#FCFAF6]' },
      ADEQUADO: { text: 'Domínio Adequado', bg: 'bg-[#4F5C48] text-[#FCFAF6]' },
      PARCIAL: { text: 'Domínio Parcial', bg: 'bg-[#B07219] text-[#FCFAF6]' },
      VULNERÁVEL: { text: 'Vulnerabilidade Epistêmica', bg: 'bg-[#8C2D19] text-[#FCFAF6]' },
      'NÃO SUSTENTADO': { text: 'Não Sustentado na SSoT', bg: 'bg-[#1A2417] text-[#F7B2A9] border border-[#8C2D19]' },
    };
    const c = map[dom];
    return (
      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded ${c.bg}`}>
        {c.text}
      </span>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 text-[#1A2417]">
      {/* CABEÇALHO DO MÓDULO — MANUSCRITO VIVO */}
      <header className="border-b border-[#D9CDAF] pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[11px] font-bold tracking-widest uppercase bg-[#2A3A24] text-[#FCFAF6] rounded">
                FASE 14
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#1A2417] tracking-tight">
                Sala de Banca Digital: Simulação Científica Adaptativa
              </h2>
            </div>
            <p className="text-sm text-[#4F5C48] mt-1 font-serif">
              Arguição académica orientada pela SSoT (1994–2024), sem pontuações numéricas e adaptada ao domínio da candidata.
            </p>
          </div>

          {isSessionActive && !finalReport && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-[#5C6B52] block uppercase tracking-wider font-semibold">
                  Progresso da Sessão
                </span>
                <span className="text-sm font-bold font-serif">
                  Questão {history.length + 1} de {sessionLength}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm('Tem a certeza de que deseja encerrar a arguição e gerar o relatório final?')) {
                    const report = generateFinalDefenseReport(
                      sessionId,
                      startedAt,
                      selectedExaminerId,
                      tone,
                      history
                    );
                    setFinalReport(report);
                  }
                }}
                className="text-[#8C2D19] hover:bg-[#FDF0EE]"
              >
                Encerrar e Ver Relatório
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* TELA 1: CONFIGURAÇÃO DE ENSAIO (SE NÃO ESTIVER EM SESSÃO ATIVA OU JÁ TERMINADA) */}
      {!isSessionActive && !finalReport && (
        <section className="bg-[#FCFAF6] border border-[#D9CDAF] rounded p-6 shadow-sm space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-lg font-serif font-bold text-[#1A2417]">
              Configure o Ensaio de Defesa da Dissertação
            </h3>
            <p className="text-sm text-[#4F5C48] mt-1">
              Escolha o examinador do júri, o tom da arguição e a duração da sessão. A banca adaptará a linha de questionamento com base nas suas respostas.
            </p>
          </div>

          {/* 1. SELEÇÃO DOS 4 EXAMINADORES */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5C6B52] block">
              1. Seleccione o Arguente Principal
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.values(EXAMINER_PROFILES).map((prof) => {
                const isSelected = selectedExaminerId === prof.id;
                return (
                  <div
                    key={prof.id}
                    onClick={() => setSelectedExaminerId(prof.id)}
                    className={`p-4 border rounded cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#2A3A24] bg-[#F4EFE6] ring-1 ring-[#2A3A24]'
                        : 'border-[#D9CDAF] bg-white hover:border-[#8C2D19]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#1A2417]">
                          {prof.name}
                        </h4>
                        <p className="text-xs font-semibold text-[#8C2D19]">{prof.title}</p>
                        <p className="text-[11px] text-[#5C6B52]">{prof.affiliation}</p>
                      </div>
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#2A3A24] bg-[#2A3A24]' : 'border-[#D9CDAF]'
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <p className="text-xs text-[#4F5C48] mt-2 line-clamp-2 italic">
                      "{prof.signatureStyle}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. TOM DA BANCA & DURAÇÃO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E8E1CE]">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#5C6B52] block mb-2">
                2. Tom da Arguição
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTone('realista')}
                  className={`flex-1 p-3 border rounded text-left transition-colors cursor-pointer ${
                    tone === 'realista'
                      ? 'border-[#2A3A24] bg-[#2A3A24] text-[#FCFAF6]'
                      : 'border-[#D9CDAF] bg-white text-[#1A2417]'
                  }`}
                >
                  <div className="font-serif font-bold text-sm">Banca Realista</div>
                  <div className="text-[11px] opacity-80 mt-0.5">
                    Equilibrada, investigativa, atenta às decisões metodológicas.
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setTone('hostil')}
                  className={`flex-1 p-3 border rounded text-left transition-colors cursor-pointer ${
                    tone === 'hostil'
                      ? 'border-[#8C2D19] bg-[#8C2D19] text-[#FCFAF6]'
                      : 'border-[#D9CDAF] bg-white text-[#1A2417]'
                  }`}
                >
                  <div className="font-serif font-bold text-sm">Banca Hostil</div>
                  <div className="text-[11px] opacity-80 mt-0.5">
                    Pressão acadêmica incisiva, interrupções e tolerância zero a dados imprecisos.
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#5C6B52] block mb-2">
                3. Extensão do Ensaio
              </label>
              <div className="flex gap-2">
                {[5, 10, 15].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setSessionLength(count)}
                    className={`flex-1 py-3 border rounded text-center font-serif font-bold text-sm transition-colors cursor-pointer ${
                      sessionLength === count
                        ? 'border-[#2A3A24] bg-[#2A3A24] text-[#FCFAF6]'
                        : 'border-[#D9CDAF] bg-white text-[#1A2417] hover:bg-[#F4EFE6]'
                    }`}
                  >
                    {count} Questões
                    <span className="block text-[10px] font-sans font-normal opacity-80">
                      {count === 5 ? 'Sessão Rápida' : count === 10 ? 'Arguição Padrão' : 'Defesa Completa'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartSession}
              icon={<Zap className="w-4 h-4" />}
            >
              Entrar na Sala e Iniciar Arguição
            </Button>
          </div>
        </section>
      )}

      {/* TELA 2: SALA DE ARGUIÇÃO INTERATIVA EM TEMPO REAL */}
      {isSessionActive && !finalReport && (
        <div className="space-y-6">
          {/* PAINEL DO EXAMINADOR & PERGUNTA ATUAL */}
          <section className="bg-[#FCFAF6] border border-[#D9CDAF] rounded p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E1CE] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#2A3A24] text-[#FCFAF6] flex items-center justify-center font-serif font-bold text-base">
                  {examiner.name.charAt(6)}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A2417] leading-none">
                    {examiner.name}
                  </h3>
                  <span className="text-xs text-[#5C6B52]">
                    {examiner.title} — {examiner.affiliation}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {renderPressureBadge(currentQuestion.level)}
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                  currentQuestion.tag === 'PERGUNTA CANÓNICA'
                    ? 'bg-[#F4EFE6] text-[#2A3A24] border border-[#D9CDAF]'
                    : 'bg-[#EBF1E8] text-[#4F5C48] border border-[#C8D6C2]'
                }`}>
                  {currentQuestion.tag}
                </span>
              </div>
            </div>

            {/* TEXTO DA QUESTÃO */}
            <div className="bg-white border border-[#E8E1CE] rounded p-4 relative">
              <div className="flex justify-between items-start gap-3">
                <p className="font-serif text-lg text-[#1A2417] font-semibold leading-relaxed">
                  "{currentQuestion.questionText}"
                </p>
                {onPlayQuickSpeech && (
                  <button
                    type="button"
                    onClick={() => onPlayQuickSpeech(currentQuestion.questionText)}
                    className="p-1.5 text-[#5C6B52] hover:text-[#1A2417] rounded hover:bg-[#F4EFE6] transition-colors cursor-pointer shrink-0"
                    title="Ouvir Pergunta"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-[#5C6B52] mt-3 italic border-t border-[#F4EFE6] pt-2">
                <strong>Orientações Epistemológicas:</strong> {currentQuestion.contextGuidance}
              </p>
            </div>

            {/* ÁREA DE RESPOSTA DA CANDIDATA */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5C6B52]">
                  A Sua Defesa Oral (Eng.ª Yolanda Tamele):
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleInsertScaffold('Eu diria que')}
                    className="text-[11px] px-2 py-0.5 bg-[#F4EFE6] text-[#2A3A24] rounded border border-[#D9CDAF] hover:bg-[#E8E1CE] cursor-pointer"
                  >
                    + Eu diria
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertScaffold('Os dados mostram que')}
                    className="text-[11px] px-2 py-0.5 bg-[#F4EFE6] text-[#2A3A24] rounded border border-[#D9CDAF] hover:bg-[#E8E1CE] cursor-pointer"
                  >
                    + Os dados mostram
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertScaffold('Contudo,')}
                    className="text-[11px] px-2 py-0.5 bg-[#F4EFE6] text-[#2A3A24] rounded border border-[#D9CDAF] hover:bg-[#E8E1CE] cursor-pointer"
                  >
                    + Contudo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertScaffold('Por isso,')}
                    className="text-[11px] px-2 py-0.5 bg-[#F4EFE6] text-[#2A3A24] rounded border border-[#D9CDAF] hover:bg-[#E8E1CE] cursor-pointer"
                  >
                    + Por isso
                  </button>
                </div>
              </div>

              <textarea
                value={candidateResponse}
                onChange={(e) => setCandidateResponse(e.target.value)}
                disabled={isEvaluating || Boolean(currentEvaluation)}
                rows={5}
                placeholder="Exponha a sua resposta à banca. Recomendado seguir a estrutura canónica: 'Eu diria... Os dados mostram... Contudo... Por isso...'."
                className="w-full p-3 font-serif text-sm bg-white border border-[#D9CDAF] rounded focus:outline-none focus:ring-1 focus:ring-[#2A3A24] disabled:bg-[#F4EFE6] disabled:text-[#4F5C48]"
              />

              {!currentEvaluation && (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSubmitResponse}
                    disabled={!candidateResponse.trim() || isEvaluating}
                    icon={<Send className="w-4 h-4" />}
                  >
                    {isEvaluating ? 'A banca está a analisar...' : 'Submeter Resposta à Banca'}
                  </Button>
                </div>
              )}
            </div>

            {/* PAINEL DE LEITURA DA BANCA (QUANDO AVALIADO) */}
            {currentEvaluation && (
              <div className="mt-6 border-t-2 border-[#2A3A24] pt-5 space-y-4 bg-white p-5 rounded border border-[#D9CDAF]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5C6B52]">
                      Leitura da Banca:
                    </span>
                    {renderDomainBadge(currentEvaluation.domain)}
                  </div>
                  <span className="text-xs text-[#5C6B52]">
                    Arguição em modo: <strong className="capitalize">{tone}</strong>
                  </span>
                </div>

                {/* RÉPLICA DO EXAMINADOR */}
                <div className="p-3 bg-[#F4EFE6] border-l-4 border-[#2A3A24] rounded-r">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8C2D19] mb-1">
                    Réplica do Arguente ({examiner.name}):
                  </p>
                  <p className="font-serif text-sm text-[#1A2417] italic">
                    "{currentEvaluation.examinerReplica}"
                  </p>
                </div>

                {/* 5 PARTES DA LEITURA ACADÉMICA QUALITATIVA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#FCFAF6] border border-[#E8E1CE] rounded">
                    <strong className="text-[#2A3A24] block mb-1 uppercase tracking-wider font-sans">
                      1. O que respondeu correctamente:
                    </strong>
                    <p className="text-[#4F5C48]">{currentEvaluation.reading.correctlyAnswered}</p>
                  </div>
                  <div className="p-3 bg-[#FCFAF6] border border-[#E8E1CE] rounded">
                    <strong className="text-[#8C2D19] block mb-1 uppercase tracking-wider font-sans">
                      2. O que ficou incompleto:
                    </strong>
                    <p className="text-[#4F5C48]">{currentEvaluation.reading.incompleteAspects}</p>
                  </div>
                  <div className="p-3 bg-[#FCFAF6] border border-[#E8E1CE] rounded">
                    <strong className="text-[#8C2D19] block mb-1 uppercase tracking-wider font-sans">
                      3. Onde existe vulnerabilidade:
                    </strong>
                    <p className="text-[#4F5C48]">{currentEvaluation.reading.vulnerabilityIdentified}</p>
                  </div>
                  <div className="p-3 bg-[#FCFAF6] border border-[#E8E1CE] rounded">
                    <strong className="text-[#2A3A24] block mb-1 uppercase tracking-wider font-sans">
                      4. O que deveria ser defendido:
                    </strong>
                    <p className="text-[#4F5C48]">{currentEvaluation.reading.shouldBeDefended}</p>
                  </div>
                </div>

                {/* MICROFEEDBACK ORAL SE HOUVER VÍCIOS */}
                {currentEvaluation.oralFeedback.length > 0 && (
                  <div className="p-3 bg-[#FFF9E6] border border-[#E6D08C] rounded space-y-1">
                    <div className="flex items-center gap-1 text-xs font-bold text-[#8C6D19] uppercase tracking-wider">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Observações de Postura e Dicção Oral:
                    </div>
                    {currentEvaluation.oralFeedback.map((fb, idx) => (
                      <p key={idx} className="text-xs text-[#5C4D19]">
                        <strong>{fb.label}:</strong> {fb.observation} (<em>Remédio:</em> {fb.remedy})
                      </p>
                    ))}
                  </div>
                )}

                {/* AVISO DE SEGURANÇA SE HOUVER PROMPT INJECTION */}
                {currentEvaluation.securityNotice && (
                  <div className="p-3 bg-[#FDF0EE] border border-[#F2BBB2] rounded text-xs text-[#8C2D19] flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{currentEvaluation.securityNotice}</span>
                  </div>
                )}

                {/* BOTÕES DE ACÇÃO: TREINAR RESPOSTA & PRÓXIMA PERGUNTA */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E8E1CE]">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsTrainingOpen((prev) => !prev)}
                    icon={<BookOpen className="w-4 h-4" />}
                  >
                    {isTrainingOpen ? 'Ocultar Treino Canónico' : 'Treinar esta Resposta com o Modelo Canónico'}
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleNextQuestion}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {history.length >= sessionLength
                      ? 'Concluir Arguição e Ver Relatório'
                      : 'Avançar para a Próxima Pergunta'}
                  </Button>
                </div>

                {/* GAVETA DE TREINO CANÓNICO */}
                {isTrainingOpen && (
                  <div className="mt-4 p-4 bg-[#F4EFE6] border border-[#D9CDAF] rounded space-y-3">
                    <h5 className="font-serif font-bold text-sm text-[#1A2417] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#8C2D19]" />
                      Formulação Canónica de Defesa (Eng.ª Yolanda Tamele)
                    </h5>
                    <div className="space-y-2 text-xs font-serif text-[#1A2417] bg-white p-3 rounded border border-[#E8E1CE]">
                      <p>
                        <strong className="text-[#8C2D19] font-sans">EU DIRIA:</strong>{' '}
                        {currentEvaluation.modelResponse.euDiria}
                      </p>
                      <p>
                        <strong className="text-[#2A3A24] font-sans">OS DADOS MOSTRAM:</strong>{' '}
                        {currentEvaluation.modelResponse.osDadosMostram}
                      </p>
                      <p>
                        <strong className="text-[#B07219] font-sans">CONTUDO:</strong>{' '}
                        {currentEvaluation.modelResponse.contudo}
                      </p>
                      <p>
                        <strong className="text-[#2A3A24] font-sans">POR ISSO:</strong>{' '}
                        {currentEvaluation.modelResponse.porIsso}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* MAPA DA ARGUMENTAÇÃO HISTÓRICA */}
          {history.length > 0 && (
            <section className="bg-[#FCFAF6] border border-[#D9CDAF] rounded p-4">
              <button
                type="button"
                onClick={() => setIsMapExpanded((prev) => !prev)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-[#5C6B52]" />
                  <h4 className="font-serif font-bold text-sm text-[#1A2417]">
                    Mapa da Argumentação Acumulado ({history.length} passos registados)
                  </h4>
                </div>
                {isMapExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {isMapExpanded && (
                <div className="mt-4 space-y-3 pt-3 border-t border-[#E8E1CE]">
                  {history.map((step) => (
                    <div key={step.stepNumber} className="p-3 bg-white border border-[#E8E1CE] rounded text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-[#5C6B52]">
                        <span>Passo {step.stepNumber} — {step.timestamp}</span>
                        {renderDomainBadge(step.domain)}
                      </div>
                      <p className="font-semibold text-[#1A2417]">Q: "{step.questionText}"</p>
                      <p className="text-[#4F5C48] italic">R: "{step.candidateResponse.slice(0, 140)}..."</p>
                      <p className="text-[#8C2D19]">
                        <strong>Régua Epistêmica:</strong> {step.vulnerabilityDetected}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {/* TELA 3: RELATÓRIO FINAL DE PREPARAÇÃO PARA DEFESA (8 SECÇÕES CANÓNICAS) */}
      {finalReport && (
        <section className="bg-[#FCFAF6] border-2 border-[#2A3A24] rounded p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9CDAF] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C2D19] block">
                Documento de Avaliação Qualitativa
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#1A2417]">
                Relatório de Preparação para Defesa da Dissertação
              </h3>
              <p className="text-xs text-[#5C6B52] mt-0.5">
                Examinador: {EXAMINER_PROFILES[finalReport.examinerId].name} | Tom:{' '}
                <strong className="capitalize">{finalReport.tone}</strong> | Questões Avaliadas:{' '}
                {finalReport.totalQuestions}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const text = JSON.stringify(finalReport, null, 2);
                  navigator.clipboard.writeText(text);
                  setCopiedReport(true);
                  setTimeout(() => setCopiedReport(false), 2000);
                }}
                icon={copiedReport ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              >
                {copiedReport ? 'Copiado!' : 'Copiar Relatório'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setFinalReport(null);
                  setIsSessionActive(false);
                  setCandidateResponse('');
                  setCurrentEvaluation(null);
                  setHistory([]);
                }}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Novo Ensaio de Defesa
              </Button>
            </div>
          </div>

          {/* SÍNTESE QUALITATIVA DOS DOMÍNIOS */}
          <div className="p-4 bg-white border border-[#D9CDAF] rounded">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5C6B52] mb-2">
              Distribuição Qualitativa das Respostas
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2 bg-[#EBF1E8] border border-[#C8D6C2] rounded">
                <span className="block font-bold text-base text-[#2A3A24]">
                  {finalReport.domainSummary.FORTE}
                </span>
                <span className="text-[11px] text-[#4F5C48]">Domínio Forte</span>
              </div>
              <div className="p-2 bg-[#F4EFE6] border border-[#D9CDAF] rounded">
                <span className="block font-bold text-base text-[#4F5C48]">
                  {finalReport.domainSummary.ADEQUADO}
                </span>
                <span className="text-[11px] text-[#4F5C48]">Adequado</span>
              </div>
              <div className="p-2 bg-[#FFF9E6] border border-[#E6D08C] rounded">
                <span className="block font-bold text-base text-[#8C6D19]">
                  {finalReport.domainSummary.PARCIAL}
                </span>
                <span className="text-[11px] text-[#8C6D19]">Parcial</span>
              </div>
              <div className="p-2 bg-[#FDF3E7] border border-[#F2D1A8] rounded">
                <span className="block font-bold text-base text-[#9A5212]">
                  {finalReport.domainSummary.VULNERÁVEL}
                </span>
                <span className="text-[11px] text-[#9A5212]">Vulnerável</span>
              </div>
              <div className="p-2 bg-[#FDF0EE] border border-[#F2BBB2] rounded">
                <span className="block font-bold text-base text-[#8C2D19]">
                  {finalReport.domainSummary['NÃO SUSTENTADO']}
                </span>
                <span className="text-[11px] text-[#8C2D19]">Não Sustentado</span>
              </div>
            </div>
          </div>

          {/* AS 8 SECÇÕES OBRIGATÓRIAS DO RELATÓRIO */}
          <div className="space-y-4">
            {/* SECÇÃO 1: PONTOS FORTES */}
            <div className="p-4 bg-white border border-[#D9CDAF] rounded space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#2A3A24] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2A3A24]" />
                Secção 1: Pontos Fortes da Defesa
              </h4>
              <ul className="list-disc list-inside text-xs text-[#4F5C48] space-y-1">
                {finalReport.section1Strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            {/* SECÇÃO 2: VULNERABILIDADES CIENTÍFICAS */}
            <div className="p-4 bg-white border border-[#D9CDAF] rounded space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#8C2D19] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#8C2D19]" />
                Secção 2: Vulnerabilidades Científicas e Factuais
              </h4>
              <ul className="list-disc list-inside text-xs text-[#4F5C48] space-y-1">
                {finalReport.section2ScientificVulnerabilities.map((v, idx) => (
                  <li key={idx}>{v}</li>
                ))}
              </ul>
            </div>

            {/* SECÇÃO 3: VULNERABILIDADES ESTATÍSTICAS */}
            <div className="p-4 bg-white border border-[#D9CDAF] rounded space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#8C2D19] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#8C2D19]" />
                Secção 3: Vulnerabilidades Estatísticas e Econométricas
              </h4>
              <ul className="list-disc list-inside text-xs text-[#4F5C48] space-y-1">
                {finalReport.section3StatisticalVulnerabilities.map((v, idx) => (
                  <li key={idx}>{v}</li>
                ))}
              </ul>
            </div>

            {/* SECÇÃO 4: VULNERABILIDADES METODOLÓGICAS */}
            <div className="p-4 bg-white border border-[#D9CDAF] rounded space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#8C2D19] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#8C2D19]" />
                Secção 4: Vulnerabilidades Metodológicas
              </h4>
              <ul className="list-disc list-inside text-xs text-[#4F5C48] space-y-1">
                {finalReport.section4MethodologicalVulnerabilities.map((v, idx) => (
                  <li key={idx}>{v}</li>
                ))}
              </ul>
            </div>

            {/* SECÇÃO 5: VULNERABILIDADES DE ARGUMENTAÇÃO */}
            <div className="p-4 bg-white border border-[#D9CDAF] rounded space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#8C2D19] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#8C2D19]" />
                Secção 5: Vulnerabilidades de Argumentação e Postura Oral
              </h4>
              <ul className="list-disc list-inside text-xs text-[#4F5C48] space-y-1">
                {finalReport.section5ArgumentationVulnerabilities.map((v, idx) => (
                  <li key={idx}>{v}</li>
                ))}
              </ul>
            </div>

            {/* SECÇÃO 6: QUESTÕES QUE EXIGEM REVISÃO */}
            <div className="p-4 bg-white border border-[#D9CDAF] rounded space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#1A2417] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#5C6B52]" />
                Secção 6: Questões que Exigem Revisão Documental
              </h4>
              <div className="space-y-2">
                {finalReport.section6QuestionsRequiringRevision.map((q, idx) => (
                  <div key={idx} className="p-2.5 bg-[#FCFAF6] border border-[#E8E1CE] rounded text-xs space-y-0.5">
                    <p className="font-semibold text-[#1A2417]">"{q.question}"</p>
                    <p className="text-[#8C2D19]"><strong>Vulnerabilidade:</strong> {q.issue}</p>
                    <p className="text-[#4F5C48]"><strong>Recomendação:</strong> {q.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECÇÃO 7: RESPOSTAS QUE DEVEM SER TREINADAS NOVAMENTE */}
            <div className="p-4 bg-white border border-[#D9CDAF] rounded space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#1A2417] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#5C6B52]" />
                Secção 7: Respostas que Devem ser Treinadas Novamente
              </h4>
              {finalReport.section7ResponsesToReTrain.length === 0 ? (
                <p className="text-xs text-[#4F5C48] italic">
                  Nenhuma resposta vulnerável registada nesta sessão. Excelente consistência da candidata.
                </p>
              ) : (
                <div className="space-y-3">
                  {finalReport.section7ResponsesToReTrain.map((item, idx) => (
                    <div key={idx} className="p-3 bg-[#FCFAF6] border border-[#E8E1CE] rounded text-xs space-y-2">
                      <p className="font-semibold text-[#1A2417]">"{item.question}"</p>
                      <div className="p-2.5 bg-white border border-[#D9CDAF] rounded space-y-1 font-serif text-[#1A2417]">
                        <p><strong className="text-[#8C2D19] font-sans">EU DIRIA:</strong> {item.recommendedModel.euDiria}</p>
                        <p><strong className="text-[#2A3A24] font-sans">OS DADOS MOSTRAM:</strong> {item.recommendedModel.osDadosMostram}</p>
                        <p><strong className="text-[#B07219] font-sans">CONTUDO:</strong> {item.recommendedModel.contudo}</p>
                        <p><strong className="text-[#2A3A24] font-sans">POR ISSO:</strong> {item.recommendedModel.porIsso}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECÇÃO 8: PERGUNTAS RECOMENDADAS PARA NOVO ENSAIO */}
            <div className="p-4 bg-white border border-[#D9CDAF] rounded space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#1A2417] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#5C6B52]" />
                Secção 8: Perguntas Recomendadas para Novo Ensaio
              </h4>
              <div className="space-y-2">
                {finalReport.section8RecommendedQuestionsForNewRehearsal.map((rec, idx) => (
                  <div key={idx} className="p-2.5 bg-[#FCFAF6] border border-[#E8E1CE] rounded text-xs space-y-0.5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C2D19]">
                      Dimensão: {rec.dimension}
                    </span>
                    <p className="font-semibold text-[#1A2417]">"{rec.question}"</p>
                    <p className="text-[#5C6B52] italic">{rec.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
