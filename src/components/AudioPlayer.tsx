import React, { useState, useRef, useEffect } from 'react';
import { TTSResponse, VariationCode } from '../types';
import { getVariation, getVoice } from '../data/languages';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from './common/Button';
import { SupportedLang } from '../data/translations';

interface AudioPlayerProps {
  currentAudio: TTSResponse | null;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  onDownloadDone?: () => void;
  currentLang?: SupportedLang;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentAudio,
  isLoading = false,
  errorMessage = null,
  onRetry,
  onDownloadDone,
  currentLang = 'pt',
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const isPt = currentLang === 'pt';

  // Fonte de dados base64 do áudio
  const audioSrc = currentAudio
    ? `data:${currentAudio.mimeType || 'audio/mpeg'};base64,${currentAudio.audioBase64}`
    : '';

  useEffect(() => {
    if (audioRef.current && audioSrc) {
      audioRef.current.src = audioSrc;
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
      setIsDownloaded(false);
    }
  }, [audioSrc]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || currentAudio?.durationSeconds || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleDownloadMp3 = () => {
    if (!currentAudio) return;

    try {
      const binaryString = window.atob(currentAudio.audioBase64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentAudio.fileName || 'ensaio-zavalavoz.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 4000);

      if (onDownloadDone) onDownloadDone();
    } catch (err) {
      console.error('Falha ao baixar arquivo MP3:', err);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ESTADO 1: Áudio a ser gerado (Loading sóbrio)
  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-[4px] border border-[#D9CDAF] bg-[#FCFAF6] p-4 text-xs font-sans text-[#1A2417] flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5">
          <Loader2 className="w-4 h-4 text-[#354D2C] animate-spin shrink-0" />
          <div>
            <span className="font-semibold block text-[#1A2417]">
              {isPt ? 'Áudio a ser gerado...' : 'Generating audio...'}
            </span>
            <span className="text-[11px] text-[#4F5C48]">
              {isPt
                ? 'Processando prosódia, pontuação e cadência neural'
                : 'Processing neural prosody, punctuation, and cadence'}
            </span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-[#4F5C48] animate-pulse">
          24 kHz
        </span>
      </div>
    );
  }

  // ESTADO 2: Erro de geração contextual
  if (errorMessage && !currentAudio) {
    return (
      <div
        role="alert"
        className="rounded-[4px] border-l-4 border-[#A8531E] border-y border-r border-[#D9CDAF] bg-[#FCFAF6] p-3.5 text-xs font-sans text-[#1A2417] flex items-start justify-between gap-3"
      >
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#A8531E] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-[#A8531E] block">
              {isPt ? 'Não foi possível gerar o áudio.' : 'Could not generate audio.'}
            </span>
            <p className="text-[11px] text-[#4F5C48] leading-relaxed">
              {errorMessage}
            </p>
          </div>
        </div>
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            {isPt ? 'Tentar novamente' : 'Try again'}
          </Button>
        )}
      </div>
    );
  }

  // ESTADO 3: Áudio ainda não gerado (Estado neutro discreto, sem ilustrações ou cards excessivos)
  if (!currentAudio) {
    return (
      <div
        aria-label="Reprodutor de áudio inativo"
        className="rounded-[4px] border border-[#D9CDAF] bg-[#FCFAF6]/60 p-3 text-xs text-[#4F5C48] font-sans flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D9CDAF]" />
          <span>
            {isPt
              ? 'Nenhum áudio gerado nesta sessão. Clique em "Gerar Áudio" acima para ouvir o ensaio.'
              : 'No audio generated in this session. Click "Generate Audio" above to rehearse.'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#4F5C48]/70 uppercase shrink-0 hidden sm:inline">
          {isPt ? 'Reprodutor Pronto' : 'Player Ready'}
        </span>
      </div>
    );
  }

  // ESTADO 4: Áudio disponível / em reprodução (Bancada de ensaio compacta)
  const varInfo = getVariation(currentAudio.variation as VariationCode);
  const voiceInfo = getVoice(currentAudio.voice);
  const fileSizeKb = Math.round(currentAudio.fileSizeBytes / 1024);
  const totalDuration = duration || currentAudio.durationSeconds || 0;
  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <section
      aria-label="Reprodutor de áudio do ensaio"
      className="rounded-[4px] border border-[#D9CDAF] bg-[#FCFAF6] p-3 sm:p-4 space-y-3 font-sans"
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Linha 1: Metadados do arquivo gerado e ação de descarregar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-2 border-b border-[#D9CDAF]/60">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm leading-none" aria-hidden="true">{varInfo.flag}</span>
          <span className="font-semibold text-[#1A2417] truncate">
            {varInfo.name}
          </span>
          <span className="text-[#D9CDAF]">·</span>
          <span className="text-[#4F5C48] truncate">
            {voiceInfo.displayName}
          </span>
          <span className="text-[#D9CDAF] hidden sm:inline">·</span>
          <span className="text-[#4F5C48] font-mono text-[11px] hidden sm:inline">
            24 kHz · {fileSizeKb} KB
          </span>
        </div>

        {/* Botão de download MP3 */}
        <Button
          id="btn-download-mp3"
          variant={isDownloaded ? 'primary' : 'secondary'}
          size="sm"
          onClick={handleDownloadMp3}
          icon={isDownloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
          title="Descarregar gravação em formato MP3"
        >
          {isDownloaded
            ? (isPt ? 'Baixado' : 'Downloaded')
            : (isPt ? 'Descarregar .MP3' : 'Download .MP3')}
        </Button>
      </div>

      {/* Linha 2: Barra de progresso linear pura (SEM waveform falsa) */}
      <div className="space-y-1">
        <input
          id="audio-progress-bar"
          type="range"
          min={0}
          max={totalDuration || 1}
          step={0.05}
          value={currentTime}
          onChange={handleSeek}
          aria-label={isPt ? 'Progresso do áudio em reprodução' : 'Audio playback progress'}
          aria-valuemin={0}
          aria-valuemax={totalDuration || 1}
          aria-valuenow={currentTime}
          className="w-full h-1.5 bg-[#EAE2D2] rounded-[1px] appearance-none cursor-pointer accent-[#1A2417] focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
          style={{
            background: `linear-gradient(to right, #1A2417 0%, #1A2417 ${progressPercent}%, #EAE2D2 ${progressPercent}%, #EAE2D2 100%)`,
          }}
        />
        <div className="flex justify-between text-[11px] font-mono text-[#4F5C48]">
          <span className="tabular-nums font-semibold text-[#1A2417]">{formatTime(currentTime)}</span>
          <span className="text-[10px] text-[#4F5C48] uppercase tracking-wider">
            {isPlaying ? (isPt ? 'Em reprodução' : 'Playing') : (isPt ? 'Pausado' : 'Paused')}
          </span>
          <span className="tabular-nums">{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Linha 3: Controles integrados — Play/Pause, Reiniciar, Velocidade, Volume */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
        <div className="flex items-center gap-2">
          {/* Play / Pause Principal */}
          <button
            id="btn-play-pause-audio"
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? (isPt ? 'Pausar áudio' : 'Pause audio') : (isPt ? 'Reproduzir áudio' : 'Play audio')}
            className="w-8 h-8 rounded-[3px] bg-[#1A2417] hover:bg-[#354D2C] text-[#FCFAF6] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          {/* Reiniciar */}
          <button
            id="btn-rewind-audio"
            type="button"
            onClick={handleRestart}
            aria-label={isPt ? 'Reiniciar áudio do início' : 'Restart audio from beginning'}
            className="w-7 h-7 rounded-[3px] text-[#4F5C48] hover:text-[#1A2417] hover:bg-[#EAE2D2]/50 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
            title={isPt ? 'Reiniciar do início' : 'Restart from beginning'}
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          {/* Seletor de Velocidade Compacto */}
          <div
            className="flex items-center p-0.5 rounded-[2px] bg-[#EAE2D2]/40 border border-[#D9CDAF]/80 text-[11px] font-mono ml-1"
            role="group"
            aria-label={isPt ? 'Velocidade de reprodução' : 'Playback speed'}
          >
            {[0.8, 1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                id={`playback-rate-${rate}`}
                type="button"
                onClick={() => handleRateChange(rate)}
                aria-pressed={playbackRate === rate}
                className={`px-1.5 py-0.5 rounded-[1px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24] ${
                  playbackRate === rate
                    ? 'bg-[#1A2417] text-[#FCFAF6] font-bold'
                    : 'text-[#4F5C48] hover:text-[#1A2417]'
                }`}
              >
                {rate === 1.0 ? '1x' : `${rate}x`}
              </button>
            ))}
          </div>
        </div>

        {/* Volume & Mute */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-toggle-mute"
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? (isPt ? 'Activar som' : 'Unmute') : (isPt ? 'Silenciar som' : 'Mute')}
            className="text-[#4F5C48] hover:text-[#1A2417] p-1 rounded-[2px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
            title={isMuted ? 'Desmutar' : 'Mutar'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
          <input
            id="volume-slider"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label={isPt ? 'Volume de reprodução' : 'Playback volume'}
            className="w-16 h-1 bg-[#EAE2D2] rounded-[1px] appearance-none cursor-pointer accent-[#1A2417] focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
          />
        </div>
      </div>

      {/* Excerto curto do texto correspondente em estilo itálico editorial */}
      {currentAudio.text && (
        <p className="text-[11px] text-[#4F5C48] italic line-clamp-1 pt-1 border-t border-[#D9CDAF]/40">
          "{currentAudio.text}"
        </p>
      )}
    </section>
  );
};
