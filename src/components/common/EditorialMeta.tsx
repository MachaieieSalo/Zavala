import React from 'react';

export interface EditorialMetaItem {
  label: React.ReactNode;
  emphasis?: boolean;
  className?: string;
}

export interface EditorialMetaProps {
  items: (React.ReactNode | EditorialMetaItem | null | undefined | false)[];
  separator?: string;
  className?: string;
}

export const EditorialMeta: React.FC<EditorialMetaProps> = ({
  items,
  separator = '·',
  className = '',
}) => {
  const filtered = items.filter(Boolean) as (React.ReactNode | EditorialMetaItem)[];

  if (filtered.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap items-center text-xs font-sans text-[#4F5C48] leading-relaxed gap-x-2 gap-y-1 ${className}`}
    >
      {filtered.map((item, index) => {
        const isObject = typeof item === 'object' && item !== null && 'label' in item;
        const content = isObject ? (item as EditorialMetaItem).label : item;
        const emphasis = isObject ? (item as EditorialMetaItem).emphasis : false;
        const customClass = isObject ? (item as EditorialMetaItem).className || '' : '';

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-[#D9CDAF] select-none shrink-0" aria-hidden="true">
                {separator}
              </span>
            )}
            <span
              className={`${
                emphasis ? 'font-semibold text-[#1A2417]' : ''
              } ${customClass}`}
            >
              {content}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};
