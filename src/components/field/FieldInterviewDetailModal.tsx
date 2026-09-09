import React from 'react';
import { FieldInterview } from '../../data/fieldInterviews';
import { CROSS_EVIDENCE_ITEMS } from '../../data/fieldCrossEvidence';
import {
  X,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Volume2,
  FileText,
  Share2,
  Sprout,
  ShieldAlert,
  Layers,
  Scale,
} from 'lucide-react';
import { SupportedLang } from '../../data/translations';

interface FieldInterviewDetailModalProps {
  interview: FieldInterview | null;
  onClose: () => void;
  onSendToStudio: (text: string, title: string) => void;
  onPlayQuickSpeech: (text: string) => void;
  onSelectCrossEvidenceTheme?: (crossId: string) => void;
  currentLang?: SupportedLang;
}

export const FieldInterviewDetailModal: React.FC<FieldInterviewDetailModalProps> = ({
  interview,
  onClose,
  onSendToStudio,
  onPlayQuickSpeech,
  onSelectCrossEvidenceTheme,
  currentLang = 'pt',
}) => {
  if (!interview) return null;

  const isPt = currentLang === 'pt';

  // Find linked cross-evidence items
  const linkedCrossEvidence = CROSS_EVIDENCE_ITEMS.filter((ce) =>
    ce.relatedInterviewIds.includes(interview.id)
  );

  const handleSendStudioClick = () => {
    const textToSynthesize = isPt
      ? `Ficha de Campo número ${interview.recordIndex}, Folha física ${interview.pageNumber} de Quissico. Produtor entrevistado: ${interview.name}, função: ${interview.role}, no povoado de ${interview.locality}. Tempo de cultivo: ${interview.farmingYears}. Variedades de mandioca declaradas: ${interview.rawVarietiesText}. Área cultivada: ${interview.cassavaArea}. Sistema de produção: ${interview.fieldSystem}. Tendência da produção: ${interview.productionTrend}, causada por ${interview.trendCauses}. Culturas associadas: ${interview.rawAssociatedCropsText}. Pragas e doenças assinaladas: ${interview.pestsAndDiseases}. Solo: ${interview.soilType}. Apoio institucional: ${interview.institutionalSupport}. Método de conservação: ${interview.conservationMethod}.`
      : `Field Record number ${interview.recordIndex}, physical sheet ${interview.pageNumber} from Quissico. Interviewee: ${interview.name}, role: ${interview.role}, in the village of ${interview.locality}. Farming experience: ${interview.farmingYears}. Reported cassava varieties: ${interview.rawVarietiesText}. Cultivated area: ${interview.cassavaArea}. Cropping system: ${interview.fieldSystem}. Production trend: ${interview.productionTrend}, attributed to ${interview.trendCauses}. Intercropped species: ${interview.rawAssociatedCropsText}. Pests and diseases: ${interview.pestsAndDiseases}. Soil: ${interview.soilType}. Support: ${interview.institutionalSupport}. Soil conservation: ${interview.conservationMethod}.`;

    const title = isPt
      ? `Entrevista de Campo: ${interview.name} (${interview.locality})`
      : `Field Interview: ${interview.name} (${interview.locality})`;

    onSendToStudio(textToSynthesize, title);
  };

  const handleSpeechClick = () => {
    const quickText = isPt
      ? `Registo de ${interview.name}, ${interview.role} em ${interview.locality}, Quissico. Cultiva mandioca há ${interview.farmingYears} numa área de ${interview.cassavaArea}. A colheita ${interview.productionTrend.toLowerCase()} devido a ${interview.trendCauses}. Pragas declaradas: ${interview.pestsAndDiseases}.`
      : `Record of ${interview.name}, ${interview.role} in ${interview.locality}, Quissico. Cassava farming for ${interview.farmingYears} across ${interview.cassavaArea}. Harvest has ${interview.productionTrend.toLowerCase()} due to ${interview.trendCauses}. Reported pests: ${interview.pestsAndDiseases}.`;
    onPlayQuickSpeech(quickText);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1A2417]/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col text-[#1A2417] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#D9CDAF] bg-[#F4EFE6] flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#4F5C48]">
              <span>{isPt ? 'Caderno de Campo da Investigadora' : 'Researcher Field Notebook'}</span>
              <span className="text-[#D9CDAF]">·</span>
              <span className="font-semibold text-[#1A2417]">{isPt ? `Folha Física ${interview.pageNumber}` : `Physical Sheet ${interview.pageNumber}`}</span>
              <span className="text-[#D9CDAF]">·</span>
              <span>{isPt ? `Registo ${interview.recordIndex} de 77` : `Record ${interview.recordIndex} of 77`}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#1A2417] truncate">
              {interview.name}
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#4F5C48]">
              <span className="font-semibold text-[#354D2C]">{interview.role}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#A8531E]" />
                <span>{interview.locality}, Posto de {interview.administrativePost}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Calendar className="w-3 h-3 text-[#4F5C48]" />
                <span>{interview.dateRecorded}</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-[2px] border border-transparent hover:border-[#D9CDAF] text-[#4F5C48] hover:text-[#1A2417] hover:bg-[#EAE2D2]/50 transition-colors cursor-pointer"
            aria-label={isPt ? 'Fechar ficha' : 'Close sheet'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs sm:text-sm font-sans leading-relaxed">
          {/* Anomalias ou inconsistências de registo (se existirem) */}
          {interview.notesOrAnomalies && (
            <div className="p-3 bg-[#EAE2D2]/40 border border-[#A8531E]/40 rounded-[2px] flex items-start gap-2.5 text-xs text-[#1A2417]">
              <AlertTriangle className="w-4 h-4 text-[#A8531E] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold text-[#A8531E] uppercase text-[10px] tracking-wider block">
                  {isPt ? 'Nota de Integridade Científica e Registo Original' : 'Scientific Integrity Note & Original Record'}
                </span>
                <p className="text-[#4F5C48] leading-relaxed">
                  {interview.notesOrAnomalies}
                </p>
              </div>
            </div>
          )}

          {/* 1. REGISTO EMPÍRICO & PERFIL AGRÁRIO */}
          <div className="space-y-2 border-b border-[#D9CDAF]/70 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#354D2C]" />
              <span>{isPt ? '1. Registo Empírico & Perfil da Unidade de Produção' : '1. Empirical Record & Production Unit Profile'}</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F4EFE6]/50 p-3 rounded-[2px] border border-[#D9CDAF]/50 text-xs">
              <div>
                <span className="text-[10px] text-[#4F5C48] block">{isPt ? 'Tempo de Cultivo' : 'Farming Duration'}</span>
                <span className="font-semibold text-[#1A2417] font-mono">{interview.farmingYears}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#4F5C48] block">{isPt ? 'Área da Mandioca' : 'Cassava Area'}</span>
                <span className="font-semibold text-[#1A2417] font-mono">{interview.cassavaArea}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#4F5C48] block">{isPt ? 'Tipo de Solo' : 'Soil Type'}</span>
                <span className="font-semibold text-[#1A2417]">{interview.soilType}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#4F5C48] block">{isPt ? 'Sistema de Terreno' : 'Field Land System'}</span>
                <span className="font-semibold text-[#1A2417]">{interview.fieldSystem}</span>
              </div>
            </div>
          </div>

          {/* 2. CULTURAS & VARIEDADES DECLARADAS */}
          <div className="space-y-2 border-b border-[#D9CDAF]/70 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] font-semibold flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-[#354D2C]" />
              <span>{isPt ? '2. Germoplasma Local & Consociações Tradicionais' : '2. Local Germplasm & Intercropping'}</span>
            </span>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#4F5C48] font-medium block mb-1">
                  {isPt ? 'Variedades de Mandioca Identificadas pelo Produtor:' : 'Cassava Varieties Identified by Farmer:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {interview.cassavaVarieties.map((v, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-[2px] bg-[#EAE2D2] text-[#1A2417] font-medium border border-[#D9CDAF]/60 text-xs"
                    >
                      {v}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] text-[#4F5C48] italic block mt-1">
                  {isPt ? 'Texto literal no inquérito:' : 'Verbatim record:'} "{interview.rawVarietiesText}"
                </span>
              </div>

              <div className="pt-2">
                <span className="text-[#4F5C48] font-medium block mb-1">
                  {isPt ? 'Outras Culturas Consorciadas / Associadas na Machamba:' : 'Intercropped / Associated Crops:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {interview.associatedCrops.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-[2px] bg-[#FCFAF6] text-[#354D2C] border border-[#D9CDAF] text-xs font-mono"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. TENDÊNCIA, FITOSSANIDADE & DESTINO */}
          <div className="space-y-2 border-b border-[#D9CDAF]/70 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#A8531E]" />
              <span>{isPt ? '3. Dinâmica de Produção, Fitossanidade & Manejo' : '3. Production Dynamics, Pests & Management'}</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FCFAF6] border border-[#D9CDAF] rounded-[2px] space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#4F5C48] block">
                  {isPt ? 'Tendência e Causas' : 'Trend & Causes'}
                </span>
                <p className="font-semibold text-[#1A2417] text-sm">
                  {interview.productionTrend}
                </p>
                <p className="text-[#4F5C48] text-xs">
                  <span className="font-medium text-[#1A2417]">{isPt ? 'Causas declaradas:' : 'Declared causes:'}</span> {interview.trendCauses}
                </p>
              </div>

              <div className="p-3 bg-[#FCFAF6] border border-[#D9CDAF] rounded-[2px] space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#4F5C48] block">
                  {isPt ? 'Pragas e Doenças Observadas' : 'Observed Pests & Diseases'}
                </span>
                <p className="font-semibold text-[#A8531E] text-xs">
                  {interview.pestsAndDiseases}
                </p>
                <p className="text-[#4F5C48] text-[11px]">
                  {isPt ? 'Método de Conservação:' : 'Conservation:'} <span className="font-medium text-[#1A2417]">{interview.conservationMethod}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-[10px] text-[#4F5C48] block">{isPt ? 'Comercialização / Destino' : 'Commercialization'}</span>
                <span className="font-medium text-[#1A2417]">{interview.commercialization}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#4F5C48] block">{isPt ? 'Apoio Institucional Declarado' : 'Institutional Support'}</span>
                <span className="font-semibold text-[#354D2C]">{interview.institutionalSupport}</span>
              </div>
            </div>
          </div>

          {/* 4. SEÇÃO EXCLUSIVA DE LÍDER COMUNITÁRIO (se aplicável) */}
          {interview.isLeaderQuestionnaire && (
            <div className="p-3 bg-[#F4EFE6] border border-[#D9CDAF] rounded-[2px] space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#354D2C] font-semibold block">
                {isPt ? 'Secção Específica de Inquérito a Liderança Comunitária' : 'Community Leadership Specific Section'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#4F5C48] block">{isPt ? 'Mudanças no tipo de cultura:' : 'Changes in crops:'}</span>
                  <span className="font-medium text-[#1A2417]">{interview.mudancasTipoCultura || 'Não registado'}</span>
                </div>
                <div>
                  <span className="text-[#4F5C48] block">{isPt ? 'Expansão ou redução da área:' : 'Expansion or reduction:'}</span>
                  <span className="font-medium text-[#1A2417]">{interview.expansaoOuReducao || 'Não registado'}</span>
                </div>
                <div>
                  <span className="text-[#4F5C48] block">{isPt ? 'Dificuldades enfrentadas:' : 'Difficulties:'}</span>
                  <span className="font-medium text-[#1A2417]">{interview.dificuldadesEnfrentadas || 'Não registado'}</span>
                </div>
                <div>
                  <span className="text-[#4F5C48] block">{isPt ? 'Áreas abandonadas por clima:' : 'Abandoned areas:'}</span>
                  <span className="font-medium text-[#1A2417]">{interview.existemAreasAbandonadas || 'Não registado'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[#4F5C48] block">{isPt ? 'Critérios de escolha de campo:' : 'Plot selection criteria:'}</span>
                  <span className="font-medium text-[#1A2417]">{interview.escolhaCampo || 'Não registado'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. EVIDÊNCIA CRUZADA ASSOCIADA */}
          {linkedCrossEvidence.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#354D2C]" />
                <span>{isPt ? 'Triangulação Científica com a Dissertação' : 'Dissertation Cross-Evidence Triangulation'}</span>
              </span>

              <div className="space-y-1.5">
                {linkedCrossEvidence.map((ce) => (
                  <div
                    key={ce.id}
                    className="p-2.5 rounded-[2px] border border-[#D9CDAF] bg-[#F4EFE6]/50 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-mono font-medium text-[#354D2C] block">
                        {ce.relationshipType} · {ce.dissertationChapter}
                      </span>
                      <p className="font-semibold text-xs text-[#1A2417] truncate">
                        {ce.title}
                      </p>
                    </div>

                    {onSelectCrossEvidenceTheme && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectCrossEvidenceTheme(ce.id);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#354D2C] hover:text-[#1A2417] shrink-0 cursor-pointer"
                      >
                        <span>{isPt ? 'Ver Triangulação' : 'View Matrix'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="px-5 py-3 border-t border-[#D9CDAF] bg-[#F4EFE6] flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono text-[#4F5C48] uppercase tracking-wider mr-1">
              {isPt ? 'Síntese Estruturada Automática:' : 'Automated Structured Synthesis:'}
            </span>
            <button
              type="button"
              onClick={handleSpeechClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] border border-[#D9CDAF] bg-[#FCFAF6] text-[#1A2417] hover:bg-[#EAE2D2] text-xs font-medium cursor-pointer transition-colors"
              title={isPt ? 'Ouvir síntese vocal automatizada do inquérito' : 'Listen to automated voice summary'}
            >
              <Volume2 className="w-3.5 h-3.5 text-[#354D2C]" />
              <span>{isPt ? 'Ouvir Síntese' : 'Listen Summary'}</span>
            </button>

            <button
              type="button"
              onClick={handleSendStudioClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-[#1A2417] text-[#FCFAF6] hover:bg-[#354D2C] text-xs font-medium cursor-pointer transition-colors shadow-xs"
              title={isPt ? 'Carregar síntese estruturada no Estúdio' : 'Load structured synthesis into Studio'}
            >
              <FileText className="w-3.5 h-3.5 text-[#D9CDAF]" />
              <span>{isPt ? 'Enviar Síntese ao Estúdio' : 'Send Synthesis to Studio'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-[2px] border border-[#D9CDAF] text-[#4F5C48] hover:text-[#1A2417] hover:bg-[#EAE2D2]/50 text-xs font-medium cursor-pointer transition-colors"
          >
            {isPt ? 'Fechar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
