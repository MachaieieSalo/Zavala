import React from 'react';
import { VoiceName, ToneStyle } from '../types';
import { VOICE_PROFILES, TONE_OPTIONS } from '../data/languages';
import { Mic, Sliders, Sparkles, User, Gauge } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-5">
      {/* Voices selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Voz da Inteligência Artificial
            </h2>
            <p className="text-xs text-slate-500">
              Vozes neurais com modulação natural
            </p>
          </div>
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
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-violet-50/70 border-violet-500 shadow-xs ring-1 ring-violet-500/30'
                    : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${voice.avatarColor} text-white flex items-center justify-center text-xs font-bold shadow-xs`}
                    >
                      {voice.name[0]}
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        voice.gender === 'Feminino'
                          ? 'bg-rose-100/70 text-rose-700'
                          : 'bg-blue-100/70 text-blue-700'
                      }`}
                    >
                      {voice.gender}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-slate-900">
                    {voice.displayName}
                  </div>
                  <div className="text-[11px] font-medium text-violet-700 mt-0.5">
                    {voice.character}
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                  {voice.pitchDescription}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tone & Expression */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Estilo / Entonação</span>
          </div>
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
                className={`px-3 py-2 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50/80 border-amber-400 text-amber-900 shadow-xs ring-1 ring-amber-400/40'
                    : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="font-semibold text-xs text-slate-900">
                  {tone.label}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {tone.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Speed rate adjustment */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-slate-400" />
          <div>
            <span className="text-xs font-semibold text-slate-800">
              Velocidade de Fala
            </span>
            <span className="text-[11px] text-slate-500 ml-2">
              (Ritmo padrão ou acelerado)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          {[0.85, 1.0, 1.15, 1.3].map((val) => {
            const isCurrent = Math.abs(speechRate - val) < 0.05;
            return (
              <button
                key={val}
                id={`speed-btn-${val}`}
                type="button"
                onClick={() => onSpeedChange(val)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
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
