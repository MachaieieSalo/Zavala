import React, { useState } from 'react';
import { FieldPhotoRecordsView } from './FieldPhotoRecordsView';
import { FieldInterviewsView } from './FieldInterviewsView';
import { FieldCrossEvidenceView } from './FieldCrossEvidenceView';
import { PageHeader } from '../common/PageHeader';
import { Camera, FileText, Layers, BookOpen, Compass } from 'lucide-react';
import { SupportedLang } from '../../data/translations';

export type FieldSubTab = 'registos' | 'entrevistas' | 'evidencia';

interface FieldNotebookViewProps {
  onSelectPhotoText: (text: string, title: string) => void;
  onPlayQuickSpeech: (text: string) => void;
  initialPhotoId?: string;
  initialSubTab?: FieldSubTab;
  currentLang?: SupportedLang;
}

export const FieldNotebookView: React.FC<FieldNotebookViewProps> = ({
  onSelectPhotoText,
  onPlayQuickSpeech,
  initialPhotoId,
  initialSubTab = 'registos',
  currentLang = 'pt',
}) => {
  const isPt = currentLang === 'pt';
  const [activeSubTab, setActiveSubTab] = useState<FieldSubTab>(initialSubTab);
  const [targetCrossId, setTargetCrossId] = useState<string | null>(null);
  const [targetPhotoId, setTargetPhotoId] = useState<string | undefined>(initialPhotoId);

  const handleSelectCrossEvidenceTheme = (crossId: string) => {
    setTargetCrossId(crossId);
    setActiveSubTab('evidencia');
  };

  const handleViewPhoto = (photoId: string) => {
    setTargetPhotoId(photoId);
    setActiveSubTab('registos');
  };

  return (
    <div className="space-y-6">
      {/* Editorial Page Header */}
      <PageHeader
        context={isPt ? 'CADERNO DIGITAL DE CAMPO' : 'DIGITAL FIELD NOTEBOOK'}
        title={isPt ? 'Caderno de Campo' : 'Field Notebook'}
        description={
          isPt
            ? 'Triangulação empírica da dissertação: Apêndice D, 51 páginas de inquéritos a camponeses e registos etnográficos in-situ em Zavala.'
            : 'Empirical triangulation of the dissertation: Appendix D, 51 pages of farmer surveys, and in-situ ethnographic records in Zavala.'
        }
      />

      {/* Editorial Sub-navigation: REGISTOS | ENTREVISTAS | EVIDÊNCIA CRUZADA */}
      {/* Strict "O Manuscrito Vivo" rule: active state has stronger text weight and a 2px bottom line; no rounded pills or neon capsules */}
      <nav
        aria-label={isPt ? 'Navegação do Caderno de Campo' : 'Field Notebook Navigation'}
        className="border-b border-[#D9CDAF] flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-sans"
      >
        <button
          type="button"
          onClick={() => setActiveSubTab('registos')}
          className={`pb-2.5 pt-1 font-medium transition-colors cursor-pointer relative flex items-center gap-1.5 ${
            activeSubTab === 'registos'
              ? 'text-[#1A2417] font-semibold'
              : 'text-[#4F5C48] hover:text-[#1A2417]'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>{isPt ? 'Registos Fotográficos' : 'Photographic Records'}</span>
          <span className="font-mono text-[10px] text-[#4F5C48]">(10)</span>
          {activeSubTab === 'registos' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#354D2C]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('entrevistas')}
          className={`pb-2.5 pt-1 font-medium transition-colors cursor-pointer relative flex items-center gap-1.5 ${
            activeSubTab === 'entrevistas'
              ? 'text-[#1A2417] font-semibold'
              : 'text-[#4F5C48] hover:text-[#1A2417]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isPt ? 'Inquéritos e Entrevistas' : 'Surveys and Interviews'}</span>
          <span className="font-mono text-[10px] text-[#4F5C48]">(64)</span>
          {activeSubTab === 'entrevistas' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#354D2C]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('evidencia')}
          className={`pb-2.5 pt-1 font-medium transition-colors cursor-pointer relative flex items-center gap-1.5 ${
            activeSubTab === 'evidencia'
              ? 'text-[#1A2417] font-semibold'
              : 'text-[#4F5C48] hover:text-[#1A2417]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isPt ? 'Evidência Cruzada' : 'Cross-Evidence'}</span>
          <span className="font-mono text-[10px] text-[#4F5C48]">(7 nós)</span>
          {activeSubTab === 'evidencia' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#354D2C]" />
          )}
        </button>
      </nav>

      {/* Sub-view Content */}
      <div className="pt-1">
        {activeSubTab === 'registos' && (
          <FieldPhotoRecordsView
            onSelectPhotoText={onSelectPhotoText}
            onPlayQuickSpeech={onPlayQuickSpeech}
            onSelectCrossEvidenceTheme={handleSelectCrossEvidenceTheme}
            initialPhotoId={targetPhotoId}
            currentLang={currentLang}
          />
        )}

        {activeSubTab === 'entrevistas' && (
          <FieldInterviewsView
            onSendToStudio={onSelectPhotoText}
            onPlayQuickSpeech={onPlayQuickSpeech}
            onSelectCrossEvidenceTheme={handleSelectCrossEvidenceTheme}
            currentLang={currentLang}
          />
        )}

        {activeSubTab === 'evidencia' && (
          <FieldCrossEvidenceView
            onSendToStudio={onSelectPhotoText}
            onPlayQuickSpeech={onPlayQuickSpeech}
            onViewPhoto={handleViewPhoto}
            initialSelectedCrossId={targetCrossId}
            currentLang={currentLang}
          />
        )}
      </div>
    </div>
  );
};
