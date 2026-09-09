import React, { useState, useMemo } from 'react';
import { CROSS_EVIDENCE_ITEMS, CrossEvidenceItem } from '../../data/fieldCrossEvidence';
import { REAL_FIELD_PHOTOS } from '../../data/fieldPhotos';
import { FIELD_INTERVIEWS, FieldInterview } from '../../data/fieldInterviews';
import { FieldInterviewDetailModal } from './FieldInterviewDetailModal';
import {
  Layers,
  BookOpen,
  Camera,
  Users,
  Quote,
  Eye,
  FileText,
  Volume2,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';
import { SupportedLang } from '../../data/translations';

interface FieldCrossEvidenceViewProps {
  onSendToStudio: (text: string, title: string) => void;
  onPlayQuickSpeech: (text: string) => void;
  onViewPhoto?: (photoId: string) => void;
  initialSelectedCrossId?: string | null;
  currentLang?: SupportedLang;
}

export const FieldCrossEvidenceView: React.FC<FieldCrossEvidenceViewProps> = ({
  onSendToStudio,
  onPlayQuickSpeech,
  onViewPhoto,
  initialSelectedCrossId,
  currentLang = 'pt',
}) => {
  const isPt = currentLang === 'pt';

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedInterviewForModal, setSelectedInterviewForModal] = useState<FieldInterview | null>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'ALL') return CROSS_EVIDENCE_ITEMS;
    return CROSS_EVIDENCE_ITEMS.filter((item) => item.themeCategory === selectedCategory);
  }, [selectedCategory]);

  const categories = useMemo(() => {
    return Array.from(new Set(CROSS_EVIDENCE_ITEMS.map((item) => item.themeCategory)));
  }, []);

  const handleSendToStudio = (item: CrossEvidenceItem) => {
    const textToSynthesize = isPt
      ? `Triangulação Metodológica sobre ${item.title}. Categoria: ${item.themeCategory}. Capítulo da dissertação: ${item.dissertationChapter}, ${item.dissertationReference}. Tipo de relação: ${item.relationshipType}. Voz do participante de Zavala: ${item.participantVoiceExcerpt}. Observação de campo da investigadora: ${item.fieldObservationExcerpt}. Interpretação analítica: ${item.analyticalInterpretation}. Base empírica: ${item.empiricalBasis}.`
      : `Methodological Triangulation on ${item.title}. Category: ${item.themeCategory}. Dissertation chapter: ${item.dissertationChapter}, ${item.dissertationReference}. Relationship type: ${item.relationshipType}. Voice of Zavala participant: ${item.participantVoiceExcerpt}. Field observation of researcher: ${item.fieldObservationExcerpt}. Analytical interpretation: ${item.analyticalInterpretation}. Empirical foundation: ${item.empiricalBasis}.`;

    const title = isPt ? `Triangulação: ${item.title}` : `Triangulation: ${item.title}`;
    onSendToStudio(textToSynthesize, title);
  };

  const handlePlaySpeech = (item: CrossEvidenceItem) => {
    const quickText = isPt
      ? `Triangulação sobre ${item.title}. Voz do participante: ${item.participantVoiceExcerpt}. Interpretação na dissertação: ${item.analyticalInterpretation}`
      : `Triangulation on ${item.title}. Participant voice: ${item.participantVoiceExcerpt}. Dissertation interpretation: ${item.analyticalInterpretation}`;
    onPlayQuickSpeech(quickText);
  };

  return (
    <div className="space-y-6">
      {/* 1. METHODOLOGICAL INTRODUCTION & EPISTEMOLOGICAL CRITERIA */}
      <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 sm:p-5 text-[#1A2417] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D9CDAF]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#4F5C48] font-semibold block">
              {isPt ? 'Triangulação Metodológica de Investigação' : 'Methodological Triangulation'}
            </span>
            <h3 className="text-base sm:text-lg font-bold font-display text-[#1A2417]">
              {isPt ? 'Matriz de Evidência Cruzada' : 'Cross-Evidence Matrix'}
            </h3>
          </div>
          <span className="text-xs font-mono text-[#4F5C48]">
            {isPt ? 'Fotografia ↔ Caderno ↔ Inquéritos ↔ Tese' : 'Photo ↔ Field Notes ↔ Surveys ↔ Thesis'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#4F5C48] leading-relaxed">
          {isPt
            ? 'Para assegurar a integridade científica e epistemológica do ZAVALAVOZ, cada tema articula rigorosamente quatro camadas distintas: a Voz do Participante (citações textuais dos agricultores), a Observação de Campo (anotações empíricas in-situ), a Interpretação Analítica (enquadramento teórico e econométrico) e a Referência na Dissertação de Mestrado.'
            : 'To ensure scientific and epistemological integrity, each theme articulates four distinct layers: Participant Voice (literal quotes), Field Observation (in-situ notes), Analytical Interpretation (econometric/theoretical framework), and Thesis References.'}
        </p>

        {/* Rigor Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-2.5 bg-[#F4EFE6]/60 border border-[#354D2C]/40 rounded-[2px] flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#354D2C] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#354D2C] block">
                {isPt ? 'Relação Confirmada' : 'Confirmed Relationship'}
              </span>
              <span className="text-[11px] text-[#4F5C48]">
                {isPt
                  ? 'Ligação documental direta, identificada na ficha física da investigadora, amostra fotográfica comprovada ou local georreferenciado.'
                  : 'Direct documentary link identified in physical field notes, confirmed photo sample, or georeferenced site.'}
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-[#F4EFE6]/60 border border-[#A8531E]/40 border-dashed rounded-[2px] flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-[#A8531E] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#A8531E] block">
                {isPt ? 'Relação Temática Sugerida' : 'Suggested Thematic Relationship'}
              </span>
              <span className="text-[11px] text-[#4F5C48]">
                {isPt
                  ? 'Convergência analítica sustentada pela literatura agrária ou correlação de dados, sem ligação nominal direta ao entrevistado.'
                  : 'Analytical convergence supported by agricultural literature or data correlation, without nominal link to a specific subject.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY FILTER CHIPS */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[11px] font-mono text-[#4F5C48] uppercase tracking-wider mr-1">
          {isPt ? 'Filtrar por Tema:' : 'Filter by Theme:'}
        </span>
        <button
          type="button"
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1 rounded-[2px] text-xs font-medium cursor-pointer transition-colors ${
            selectedCategory === 'ALL'
              ? 'bg-[#1A2417] text-[#FCFAF6]'
              : 'bg-[#FCFAF6] border border-[#D9CDAF] text-[#4F5C48] hover:text-[#1A2417]'
          }`}
        >
          {isPt ? 'Todos os Nós (7)' : 'All Nodes (7)'}
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-[2px] text-xs font-medium cursor-pointer transition-colors ${
              selectedCategory === cat
                ? 'bg-[#1A2417] text-[#FCFAF6]'
                : 'bg-[#FCFAF6] border border-[#D9CDAF] text-[#4F5C48] hover:text-[#1A2417]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. TRIANGULATION NODES LIST */}
      <div className="space-y-6">
        {filteredItems.map((item) => {
          const isConfirmed = item.relationshipType === 'Relação confirmada';
          const isHighlighted = initialSelectedCrossId === item.id;

          // Resolve photos
          const linkedPhotos = REAL_FIELD_PHOTOS.filter((p) =>
            item.relatedPhotoIds.includes(p.id)
          );

          // Resolve interviews
          const linkedInterviews = FIELD_INTERVIEWS.filter((intv) =>
            item.relatedInterviewIds.includes(intv.id)
          );

          return (
            <article
              key={item.id}
              id={`cross-node-${item.id}`}
              className={`bg-[#FCFAF6] rounded-[4px] border ${
                isHighlighted
                  ? 'border-[#354D2C] ring-2 ring-[#354D2C]/30 shadow-md'
                  : isConfirmed
                  ? 'border-[#D9CDAF]'
                  : 'border-[#D9CDAF] border-dashed'
              } p-5 space-y-4 text-[#1A2417] transition-all`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#D9CDAF]">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-[2px] bg-[#EAE2D2] text-[10px] font-mono uppercase tracking-wider text-[#4F5C48]">
                      {item.themeCategory}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-[2px] text-[10px] font-mono uppercase tracking-wider font-semibold ${
                        isConfirmed
                          ? 'bg-[#354D2C]/10 text-[#354D2C] border border-[#354D2C]/30'
                          : 'bg-[#A8531E]/10 text-[#A8531E] border border-[#A8531E]/30'
                      }`}
                    >
                      {item.relationshipType}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold font-display text-[#1A2417] pt-1">
                    {item.title}
                  </h4>

                  <p className="text-xs text-[#4F5C48] italic">
                    <span className="font-semibold text-[#1A2417] not-italic">{isPt ? 'Fundamentação da relação:' : 'Relationship basis:'}</span>{' '}
                    {item.relationshipJustification}
                  </p>
                </div>

                {/* Dissertation Reference badge */}
                <div className="sm:text-right shrink-0">
                  <span className="text-[10px] font-mono text-[#4F5C48] uppercase tracking-wider block">
                    {item.dissertationChapter}
                  </span>
                  <span className="text-xs font-semibold text-[#354D2C] block">
                    {item.dissertationReference}
                  </span>
                </div>
              </div>

              {/* Four Epistemological Layers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Camada 1: Voz do Participante */}
                <div className="p-3.5 bg-[#F4EFE6]/70 border border-[#D9CDAF] rounded-[2px] space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#A8531E] font-semibold flex items-center gap-1.5">
                      <Quote className="w-3.5 h-3.5" />
                      <span>{isPt ? '1. Voz do Participante (Declarações Literais)' : '1. Participant Voice (Literal Statements)'}</span>
                    </span>
                    <p className="text-xs sm:text-sm italic font-display text-[#1A2417] leading-relaxed pt-1">
                      {item.participantVoiceExcerpt}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#4F5C48] font-mono block pt-2 border-t border-[#D9CDAF]/50">
                    {isPt ? 'Fonte: Inquéritos a camponeses de Quissico' : 'Source: Farmer surveys in Quissico'}
                  </span>
                </div>

                {/* Camada 2: Observação de Campo */}
                <div className="p-3.5 bg-[#F4EFE6]/70 border border-[#D9CDAF] rounded-[2px] space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#354D2C] font-semibold flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isPt ? '2. Observação de Campo da Investigadora' : '2. Researcher Field Observation'}</span>
                    </span>
                    <p className="text-xs text-[#1A2417] leading-relaxed pt-1">
                      {item.fieldObservationExcerpt}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#4F5C48] font-mono block pt-2 border-t border-[#D9CDAF]/50">
                    {isPt ? 'Fonte: Notas etnográficas e registo fotográfico in-situ' : 'Source: Ethnographic notes & photographic record'}
                  </span>
                </div>

                {/* Camada 3: Interpretação Analítica na Tese */}
                <div className="p-3.5 bg-[#FCFAF6] border border-[#D9CDAF] rounded-[2px] space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A2417] font-semibold flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#354D2C]" />
                      <span>{isPt ? '3. Interpretação Analítica & Econométrica' : '3. Analytical & Econometric Interpretation'}</span>
                    </span>
                    <p className="text-xs text-[#4F5C48] leading-relaxed pt-1">
                      {item.analyticalInterpretation}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#4F5C48] font-mono block pt-2 border-t border-[#D9CDAF]/50">
                    {isPt ? 'Dissertação de Mestrado de Yolanda Tamele' : 'Yolanda Tamele Masters Dissertation'}
                  </span>
                </div>

                {/* Camada 4: Base Empírica e Quantitativa */}
                <div className="p-3.5 bg-[#FCFAF6] border border-[#D9CDAF] rounded-[2px] space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] font-semibold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#A8531E]" />
                      <span>{isPt ? '4. Base Empírica e Dados Amostrais' : '4. Empirical Base & Sample Data'}</span>
                    </span>
                    <p className="text-xs text-[#1A2417] font-medium leading-relaxed pt-1">
                      {item.empiricalBasis}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#4F5C48] font-mono block pt-2 border-t border-[#D9CDAF]/50">
                    {isPt ? 'Amostra de 64 formulários e série de 31 anos' : 'Sample of 64 forms and 31-year series'}
                  </span>
                </div>
              </div>

              {/* Linked Records Navigation */}
              <div className="pt-2 border-t border-[#D9CDAF]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                {/* Left: Photos and Interviews links */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Linked Photos */}
                  {linkedPhotos.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-[#354D2C]" />
                      <span className="text-[#4F5C48] font-medium">{isPt ? 'Fotografias:' : 'Photos:'}</span>
                      <div className="flex items-center gap-1">
                        {linkedPhotos.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => onViewPhoto?.(p.id)}
                            className="px-2 py-0.5 rounded-[2px] bg-[#EAE2D2] text-[#1A2417] text-[10px] font-mono font-medium hover:bg-[#354D2C] hover:text-[#FCFAF6] transition-colors cursor-pointer"
                            title={p.title}
                          >
                            Foto {p.number}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Linked Interviews */}
                  {linkedInterviews.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#A8531E]" />
                      <span className="text-[#4F5C48] font-medium">{isPt ? 'Inquéritos:' : 'Surveys:'}</span>
                      <div className="flex flex-wrap items-center gap-1">
                        {linkedInterviews.map((intv) => (
                          <button
                            key={intv.id}
                            type="button"
                            onClick={() => setSelectedInterviewForModal(intv)}
                            className="px-2 py-0.5 rounded-[2px] bg-[#FCFAF6] border border-[#D9CDAF] text-[#1A2417] text-[10px] font-sans hover:border-[#354D2C] hover:text-[#354D2C] transition-colors cursor-pointer"
                            title={`${intv.name} (${intv.locality})`}
                          >
                            {intv.name.split(' ')[0]} (Pág. {intv.pageNumber})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Synthesis Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePlaySpeech(item)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[2px] border border-[#D9CDAF] bg-[#FCFAF6] text-[#1A2417] hover:bg-[#EAE2D2] text-xs font-medium cursor-pointer transition-colors"
                    title={isPt ? 'Ouvir síntese rápida' : 'Listen to quick summary'}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#354D2C]" />
                    <span>{isPt ? 'Ouvir' : 'Listen'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendToStudio(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[2px] bg-[#1A2417] text-[#FCFAF6] hover:bg-[#354D2C] text-xs font-medium cursor-pointer transition-colors shadow-xs"
                    title={isPt ? 'Carregar síntese metodológica no Estúdio' : 'Load synthesis into Studio'}
                  >
                    <FileText className="w-3.5 h-3.5 text-[#D9CDAF]" />
                    <span>{isPt ? 'Enviar ao Estúdio' : 'Send to Studio'}</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal for viewing interview details when clicked from cross-evidence */}
      <FieldInterviewDetailModal
        interview={selectedInterviewForModal}
        onClose={() => setSelectedInterviewForModal(null)}
        onSendToStudio={onSendToStudio}
        onPlayQuickSpeech={onPlayQuickSpeech}
        currentLang={currentLang}
      />
    </div>
  );
};
