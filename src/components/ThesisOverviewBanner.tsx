import React from 'react';
import { ThesisContext, ThesisContextLevel } from './common/ThesisContext';
import { SupportedLang } from '../data/translations';

interface ThesisOverviewBannerProps {
  onOpenDataModal?: () => void;
  currentLang?: SupportedLang;
  level?: ThesisContextLevel;
  className?: string;
}

export const ThesisOverviewBanner: React.FC<ThesisOverviewBannerProps> = ({
  onOpenDataModal,
  currentLang = 'pt',
  level = 'compact',
  className = '',
}) => {
  return (
    <ThesisContext
      level={level}
      onOpenDataModal={onOpenDataModal}
      currentLang={currentLang}
      className={className}
    />
  );
};

export { ThesisContext };
