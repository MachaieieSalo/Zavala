import React from 'react';
import { VoiceName, ToneStyle } from '../types';
import { VOICE_PROFILES, TONE_OPTIONS } from '../data/languages';
import { Gauge } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoice: VoiceName;
  onSelectVoice: (voice: VoiceName) => void;
  selectedTone: ToneStyle;
  onSelectTone: (tone: ToneStyle) => void;
  speechRate: number;
  onSpeedChange: (speed: number) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onSelectVoice,
  selectedTone,
  onSelectTone,
  speechRate,
  onSpeedChange,
}) => {
  return (
    <div className="bg-[#FCFAF6] rounded-[4px] border border-[#D9CDAF] p-4 sm:p-5 space-y-4 text-[#1A2417]">
      {/* Voices selection */}
      <div>
        <div className="mb-3">
          <h2 className="text-sm sm:text-base font-bold text-[#1A2417] leading-tight font-display">
            Voz da Inteligência Artificial
          </h2>
          <p className="text-xs text-[#4F5C48]">
            Vozes neurais calibradas para o contexto acadêmico
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {VOICE_PROFILES.map((voice) => {
            const isSelected = selectedVoice === voice.name;
            return (
              <button
                key={voice.name}
                id={`voice-btn-${voice.name.toLowerCase()}`}
                type="button"
                onClick={() => onSelectVoice(voice.name)}
                className={`p-3 rounded-[3px] border text-left transition-colors relative flex flex-col justify-between cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24] ${
                  isSelected
                    ? 'bg-[#EAE2D2]/40 border-[#1A2417] text-[#1A2417]'
                    : 'bg-[#FCFAF6] hover:bg-[#EAE2D2]/20 border-[#D9CDAF] text-[#1A2417]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-semibold text-[#1A2417]">
                      {voice.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#4F5C48]">
                      {voice.gender}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-[#1A2417]">
                    {voice.displayName}
                  </div>
                  <div className="text-[11px] font-medium text-[#354D2C] mt-0.5">
                    {voice.character}
                  </div>
                </div>
                <p className="text-[10px] text-[#4F5C48] mt-2 leading-relaxed">
                  {voice.pitchDescription}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tone & Expression */}
      <div className="pt-3 border-t border-[#D9CDAF]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#1A2417] uppercase tracking-wider">
            Estilo e Entonação
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {TONE_OPTIONS.map((tone) => {
            const isSelected = selectedTone === tone.id;
            return (
              <button
                key={tone.id}
                id={`tone-btn-${tone.id}`}
                type="button"
                onClick={() => onSelectTone(tone.id)}
                className={`px-3 py-2 rounded-[3px] text-left border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24] ${
                  isSelected
                    ? 'bg-[#1A2417] text-[#FCFAF6] border-[#1A2417]'
                    : 'bg-[#FCFAF6] hover:bg-[#EAE2D2]/20 border-[#D9CDAF] text-[#1A2417]'
                }`}
              >
                <div className="font-semibold text-xs leading-tight">
                  {tone.label}
                </div>
                <div className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-[#FCFAF6]/80' : 'text-[#4F5C48]'}`}>
                  {tone.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Speed rate adjustment */}
      <div className="pt-3 border-t border-[#D9CDAF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-[#4F5C48]" />
          <div>
            <span className="text-xs font-semibold text-[#1A2417]">
              Velocidade de Fala
            </span>
            <span className="text-[11px] text-[#4F5C48] ml-2">
              (Ritmo de leitura acadêmica)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#EAE2D2]/40 p-0.5 rounded-[4px] border border-[#D9CDAF] self-start sm:self-auto">
          {[0.85, 1.0, 1.15, 1.3].map((val) => {
            const isCurrent = Math.abs(speechRate - val) < 0.05;
            return (
              <button
                key={val}
                id={`speed-btn-${val}`}
                type="button"
                onClick={() => onSpeedChange(val)}
                className={`px-2.5 py-1 rounded-[2px] text-xs font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24] ${
                  isCurrent
                    ? 'bg-[#1A2417] text-[#FCFAF6] font-semibold'
                    : 'text-[#4F5C48] hover:text-[#1A2417]'
                }`}
              >
                {val === 1.0 ? '1.0x Normal' : `${val}x`}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
