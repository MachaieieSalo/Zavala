import React from 'react';
import { DissertationQuestion } from '../../data/dissertationText';
import { AdversarialVulnerability } from '../../data/adversarialVulnerabilities';
import { AdversarialEvaluationResult, OverallPreparationStatus } from './adversarialEvaluation';
import { Button } from '../common/Button';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { SupportedLang } from '../../data/translations';

export interface AdversarialSessionRecord {
  question: DissertationQuestion;
  vulnerability?: AdversarialVulnerability;
  candidateResponse: string;
  secondaryResponse: string;
  evaluation?: AdversarialEvaluationResult;
}

interface DefenseAdversarialSummaryProps {
  sessionRecords: AdversarialSessionRecord[];
  onRestartSession: () => void;
  onReturnToStudyMode: () => void;
  onNavigateToTab?: (tab: 'dados' | 'campo' | 'estudio' | 'defesa', param?: string) => void;
  lang?: SupportedLang;
}

export const DefenseAdversarialSummary: React.FC<DefenseAdversarialSummaryProps> = ({
  sessionRecords,
  onRestartSession,
  onReturnToStudyMode,
  onNavigateToTab,
  lang = 'pt',
}) => {
  const isPt = lang === 'pt';

  // Agrupar questões nas três categorias de preparação
  const consistentList: AdversarialSessionRecord[] = [];
  const reinforceList: AdversarialSessionRecord[] = [];
  const vulnerableList: AdversarialSessionRecord[] = [];

  sessionRecords.forEach((record) => {
    const status: OverallPreparationStatus =
      record.evaluation?.overallStatus || 'PONTOS A REFORÇAR';
    if (status === 'SUSTENTAÇÃO CONSISTENTE') {
      consistentList.push(record);
    } else if (status === 'PONTOS VULNERÁVEIS') {
      vulnerableList.push(record);
    } else {
      reinforceList.push(record);
    }
  });

  // Gerar Lista de Reforço com ligações a evidências da plataforma
  const preparationShortList: {
    recommendationPt: string;
    recommendationEn: string;
    evidenceTab: 'dados' | 'campo' | 'estudio' | 'defesa';
    param?: string;
    evidenceLocationPt: string;
    evidenceLocationEn: string;
  }[] = [];

  // Analisar vulnerabilidades nas sessões
  sessionRecords.forEach((rec) => {
    const v = rec.vulnerability;
    if (v) {
      if (
        !preparationShortList.some(
          (item) => item.evidenceLocationPt === v.internalAppEvidence.locationLabel
        )
      ) {
        preparationShortList.push({
          recommendationPt: `Rever ${v.title} e a salvaguarda metodológica da tese.`,
          recommendationEn: `Review ${v.titleEn} and thesis methodological guardrails.`,
          evidenceTab: v.internalAppEvidence.tab,
          param: v.internalAppEvidence.param,
          evidenceLocationPt: v.internalAppEvidence.locationLabel,
          evidenceLocationEn: v.internalAppEvidence.locationLabelEn,
        });
      }
    }
  });

  // Recomendações estruturais fixas
  if (!preparationShortList.some((i) => i.evidenceTab === 'dados' && i.param === 'serie')) {
    preparationShortList.push({
      recommendationPt: 'Rever a demarcação estrita entre dados observados (2017–2024) e reconstituídos (1994–2016).',
      recommendationEn: 'Review the strict boundary between observed (2017–2024) and modeled (1994–2016) records.',
      evidenceTab: 'dados',
      param: 'serie',
      evidenceLocationPt: 'Estação de Dados · Tabela 4.1 e Série Histórica',
      evidenceLocationEn: 'Data Station · Table 4.1 & Historical Series',
    });
  }
  if (!preparationShortList.some((i) => i.evidenceTab === 'dados' && i.param === 'chirps')) {
    preparationShortList.push({
      recommendationPt: 'Rever a interpretação da correlação CHIRPS (r = 0,057; p = 0,762): não-linearidade e extremos.',
      recommendationEn: 'Review CHIRPS correlation interpretation (r = 0.057; p = 0.762): non-linearity & extremes.',
      evidenceTab: 'dados',
      param: 'chirps',
      evidenceLocationPt: 'Estação de Dados · Secção 4.4 Validação Pluviométrica',
      evidenceLocationEn: 'Data Station · Section 4.4 Rainfall Validation',
    });
  }

  return (
    <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 sm:p-6 space-y-6 font-sans text-[#1A2417]">
      {/* CABEÇALHO DO MAPA DE PREPARAÇÃO */}
      <div className="border-b border-[#D9CDAF] pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2A3A24] text-[#FCFAF6] mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isPt ? 'ENSAIO DE PRÉ-DEFESA · BANCA ADVERSARIAL' : 'PRE-DEFENSE TRIAL · ADVERSARIAL BOARD'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2417]">
              {isPt ? 'Mapa de Preparação da Sustentação' : 'Defense Readiness Blueprint'}
            </h2>
            <p className="text-xs sm:text-sm text-[#4F5C48] mt-1">
              {isPt
                ? `Registo factual da sessão: 5 perguntas enfrentadas perante objecções da banca examinadora.`
                : `Factual session record: 5 questions addressed against examination board objections.`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReturnToStudyMode}
              icon={<BookOpen className="w-3.5 h-3.5" />}
            >
              {isPt ? 'Modo Estudo' : 'Study Mode'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onRestartSession}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              {isPt ? 'Novo Ensaio (5 Perguntas)' : 'New Trial (5 Questions)'}
            </Button>
          </div>
        </div>

        {/* NOTA OBRIGATÓRIA */}
        <div className="mt-3 p-2.5 rounded-[4px] bg-[#EAE2D2]/40 border border-[#D9CDAF]/80 text-[11px] text-[#4F5C48]">
          <strong>{isPt ? 'Nota Institucional:' : 'Institutional Note:'}</strong>{' '}
          {isPt
            ? 'Construção pedagógica da plataforma. Não constitui classificação oficial da UEM/ESUDER.'
            : 'Pedagogical platform exercise. Does not constitute an official UEM/ESUDER grade.'}
        </div>
      </div>

      {/* QUADRO SINTÉTICO DAS TRÊS CATEGORIAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* SUSTENTAÇÃO CONSISTENTE */}
        <div className="bg-[#FCFAF6] border border-[#2A3A24] rounded-[4px] p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#2A3A24] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2A3A24]" />
              {isPt ? 'SUSTENTAÇÃO CONSISTENTE' : 'CONSISTENT DEFENSE'}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#2A3A24]/10 text-[#2A3A24]">
              {consistentList.length}
            </span>
          </div>
          <p className="text-[11px] text-[#4F5C48]">
            {isPt
              ? 'Respostas com rigor epistemológico sólido, sem extrapolações causais e boa mobilização de dados.'
              : 'Responses demonstrating solid epistemic rigor, no causal overreach, and good data mobilization.'}
          </p>
        </div>

        {/* PONTOS A REFORÇAR */}
        <div className="bg-[#FCFAF6] border border-[#A8531E] rounded-[4px] p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#A8531E] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#A8531E]" />
              {isPt ? 'PONTOS A REFORÇAR' : 'POINTS TO STRENGTHEN'}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#A8531E]/10 text-[#A8531E]">
              {reinforceList.length}
            </span>
          </div>
          <p className="text-[11px] text-[#4F5C48]">
            {isPt
              ? 'Respostas pertinentes que requerem maior aprofundamento factual ou salvaguardas explícitas.'
              : 'Relevant responses requiring deeper factual grounding or explicit methodological caveats.'}
          </p>
        </div>

        {/* PONTOS VULNERÁVEIS */}
        <div className="bg-[#FCFAF6] border border-[#7A2E1E] rounded-[4px] p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#7A2E1E] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#7A2E1E]" />
              {isPt ? 'PONTOS VULNERÁVEIS' : 'VULNERABLE POINTS'}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#7A2E1E]/10 text-[#7A2E1E]">
              {vulnerableList.length}
            </span>
          </div>
          <p className="text-[11px] text-[#4F5C48]">
            {isPt
              ? 'Detectados alertas epistemológicos (causalidade indevida, confusão observado/modelado) ou brevidade.'
              : 'Detected epistemic alerts (undue causality, observed/modeled confusion) or briefness.'}
          </p>
        </div>
      </div>

      {/* MATRIZ DETALHADA POR QUESTÃO */}
      <div className="space-y-3">
        <h3 className="text-sm font-serif font-bold text-[#1A2417] flex items-center gap-2">
          <span>{isPt ? 'Matriz de Arguição Enfrentada' : 'Argued Question Matrix'}</span>
        </h3>

        <div className="overflow-x-auto border border-[#D9CDAF] rounded-[4px]">
          <table className="w-full text-left text-xs border-collapse bg-[#FCFAF6]">
            <thead>
              <tr className="bg-[#EAE2D2]/60 border-b border-[#D9CDAF] text-[#1A2417]">
                <th className="p-2.5 font-semibold">{isPt ? 'N.º' : 'No.'}</th>
                <th className="p-2.5 font-semibold">{isPt ? 'Pergunta / Tópico' : 'Question / Topic'}</th>
                <th className="p-2.5 font-semibold">{isPt ? 'Cenário' : 'Scenario'}</th>
                <th className="p-2.5 font-semibold">{isPt ? 'Vulnerabilidade' : 'Vulnerability'}</th>
                <th className="p-2.5 font-semibold">{isPt ? 'Estado' : 'Status'}</th>
                <th className="p-2.5 font-semibold">{isPt ? 'Risco Epistemológico' : 'Epistemic Risk'}</th>
                <th className="p-2.5 font-semibold">{isPt ? 'Revisão Necessária' : 'Review Needed'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9CDAF]/60">
              {sessionRecords.map((record, idx) => {
                const q = record.question;
                const v = record.vulnerability;
                const evalRes = record.evaluation;
                const alertsCount = evalRes?.epistemicAlerts.length || 0;
                const status = evalRes?.overallStatus || 'PONTOS A REFORÇAR';

                return (
                  <tr key={q.id} className="hover:bg-[#EAE2D2]/20 transition-colors">
                    <td className="p-2.5 font-mono font-medium text-[#4F5C48]">
                      #{q.number}
                    </td>
                    <td className="p-2.5 font-medium text-[#1A2417] max-w-[220px]">
                      <div className="line-clamp-2" title={isPt ? q.juryQuestion : q.juryQuestionEn}>
                        {isPt ? q.title : q.titleEn}
                      </div>
                      <span className="text-[10px] text-[#4F5C48] block mt-0.5">
                        {isPt ? q.examinerRole : q.examinerRoleEn}
                      </span>
                    </td>
                    <td className="p-2.5 text-[#4F5C48] whitespace-nowrap">
                      {q.category}
                    </td>
                    <td className="p-2.5 whitespace-nowrap">
                      {v ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#2A3A24] bg-[#2A3A24]/10 px-2 py-0.5 rounded">
                          {v.code}
                        </span>
                      ) : (
                        <span className="text-[#4F5C48]">—</span>
                      )}
                    </td>
                    <td className="p-2.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          status === 'SUSTENTAÇÃO CONSISTENTE'
                            ? 'bg-[#2A3A24] text-[#FCFAF6]'
                            : status === 'PONTOS VULNERÁVEIS'
                            ? 'bg-[#7A2E1E] text-[#FCFAF6]'
                            : 'bg-[#A8531E] text-[#FCFAF6]'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-2.5 whitespace-nowrap">
                      {alertsCount > 0 ? (
                        <span className="text-[#7A2E1E] font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {alertsCount} {isPt ? 'alerta(s)' : 'alert(s)'}
                        </span>
                      ) : (
                        <span className="text-[#2A3A24] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isPt ? 'Salvaguardado' : 'Protected'}
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-[#4F5C48] max-w-[200px]">
                      {evalRes && evalRes.incompletePoints.length > 0 ? (
                        <span className="line-clamp-2 text-[11px]">
                          {evalRes.incompletePoints[0]}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#2A3A24]">
                          {isPt ? 'Sustentação completa' : 'Complete defense'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* LISTA DE REFORÇO CONCRETA */}
      <div className="bg-[#EAE2D2]/30 border border-[#D9CDAF] rounded-[4px] p-4 space-y-3">
        <h3 className="text-sm font-serif font-bold text-[#1A2417] flex items-center gap-2">
          <span>{isPt ? 'Lista Curta de Reforço Científico' : 'Targeted Scientific Revision List'}</span>
        </h3>
        <p className="text-xs text-[#4F5C48]">
          {isPt
            ? 'Recomendações fundamentadas com apontamento direto para as evidências correspondentes na plataforma:'
            : 'Grounded recommendations directing you to matching evidence nodes within the platform:'}
        </p>

        <div className="space-y-2">
          {preparationShortList.map((item, i) => (
            <div
              key={i}
              className="bg-[#FCFAF6] border border-[#D9CDAF] p-3 rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <p className="font-semibold text-[#1A2417]">
                  {isPt ? item.recommendationPt : item.recommendationEn}
                </p>
                <p className="text-[11px] text-[#4F5C48] mt-0.5">
                  {isPt ? item.evidenceLocationPt : item.evidenceLocationEn}
                </p>
              </div>

              {onNavigateToTab && (
                <button
                  type="button"
                  onClick={() => onNavigateToTab(item.evidenceTab, item.param)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2A3A24] hover:text-[#1A2417] hover:underline cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <span>{isPt ? 'Consultar Evidência' : 'View Evidence'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BOTÕES DE ACÇÃO FINAIS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          size="md"
          onClick={onReturnToStudyMode}
          icon={<BookOpen className="w-4 h-4" />}
        >
          {isPt ? 'Voltar ao Banco de Perguntas (Modo Estudo)' : 'Return to Question Bank (Study Mode)'}
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onRestartSession}
          icon={<RotateCcw className="w-4 h-4" />}
        >
          {isPt ? 'Iniciar Novo Ensaio Adversarial (5 Perguntas)' : 'Start New Adversarial Trial (5 Questions)'}
        </Button>
      </div>
    </div>
  );
};
