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
  Music,
  Share2,
  FileAudio,
} from 'lucide-react';

interface AudioPlayerProps {
  currentAudio: TTSResponse | null;
  onDownloadDone?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentAudio,
  onDownloadDone,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isDownloaded, setIsDownloaded] = useState(false);

  // Audio source URL
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

  // Direct MP3 download function
  const handleDownloadMp3 = () => {
    if (!currentAudio) return;

    try {
      // Decode base64 to binary ArrayBuffer for clean MP3 Blob download
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
      a.download = currentAudio.fileName || 'audio-convertido.mp3';
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

  if (!currentAudio) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center flex flex-col items-center justify-center text-slate-400">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 text-slate-300">
          <Music className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700 mb-1">
          Nenhum áudio gerado ainda
        </h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Insira o texto acima, escolha a voz e o sotaque desejado e clique em "Gerar Áudio & MP3" para ouvir e baixar.
        </p>
      </div>
    );
  }

  const varInfo = getVariation(currentAudio.variation as VariationCode);
  const voiceInfo = getVoice(currentAudio.voice);
  const fileSizeKb = Math.round(currentAudio.fileSizeBytes / 1024);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-5 sm:p-6 space-y-5 transition-all">
      {/* Hidden native audio tag */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Top bar with audio metadata and badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-lg shadow-sm">
            {varInfo.flag}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Áudio Pronto em MP3
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                24kHz Estéreo
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {varInfo.name} • Voz {voiceInfo.displayName} ({voiceInfo.gender})
            </p>
          </div>
        </div>

        {/* Big prominent MP3 Download CTA */}
        <button
          id="btn-download-mp3"
          type="button"
          onClick={handleDownloadMp3}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm cursor-pointer ${
            isDownloaded
              ? 'bg-emerald-600 text-white shadow-emerald-200'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 active:scale-95'
          }`}
          title="Baixar arquivo de áudio no formato .mp3"
        >
          {isDownloaded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Baixado com Sucesso!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Baixar Arquivo .MP3 ({fileSizeKb} KB)</span>
            </>
          )}
        </button>
      </div>

      {/* Animated Waveform Visualizer */}
      <div className="bg-slate-950 rounded-xl p-4 flex items-center justify-between gap-1 overflow-hidden relative shadow-inner">
        <div className="flex items-center gap-1.5 h-10 w-full justify-center">
          {[
            'h-2 animate-wave-1',
            'h-4 animate-wave-2',
            'h-6 animate-wave-3',
            'h-3 animate-wave-4',
            'h-7 animate-wave-5',
            'h-5 animate-wave-1',
            'h-8 animate-wave-2',
            'h-4 animate-wave-3',
            'h-6 animate-wave-4',
            'h-3 animate-wave-5',
            'h-7 animate-wave-1',
            'h-5 animate-wave-2',
            'h-8 animate-wave-3',
            'h-4 animate-wave-4',
            'h-6 animate-wave-5',
            'h-2 animate-wave-1',
            'h-5 animate-wave-2',
            'h-7 animate-wave-3',
            'h-3 animate-wave-4',
            'h-6 animate-wave-5',
          ].map((barClass, idx) => (
            <div
              key={idx}
              className={`w-1.5 rounded-full transition-all duration-300 ${
                isPlaying
                  ? `${barClass} bg-gradient-to-t from-indigo-500 to-violet-400`
                  : 'h-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Small playing indicator on bottom right */}
        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-400">
          {isPlaying ? 'REPRODUZINDO' : 'PAUSADO'}
        </div>
      </div>

      {/* Timeline scrubbing track */}
      <div className="space-y-1.5">
        <input
          id="audio-progress-bar"
          type="range"
          min={0}
          max={duration || currentAudio.durationSeconds || 1}
          step={0.05}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
        />
        <div className="flex justify-between text-xs font-mono text-slate-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || currentAudio.durationSeconds)}</span>
        </div>
      </div>

      {/* Control Buttons row: Play/Pause, Rewind, Speed, Volume */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Left: Playback controls */}
        <div className="flex items-center gap-2">
          <button
            id="btn-play-pause-audio"
            type="button"
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white flex items-center justify-center transition-all shadow-md shadow-indigo-200 cursor-pointer"
            title={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            id="btn-rewind-audio"
            type="button"
            onClick={handleRestart}
            className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Reiniciar do início"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed picker dropdown or buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 ml-1">
            {[0.8, 1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                id={`playback-rate-${rate}`}
                type="button"
                onClick={() => handleRateChange(rate)}
                className={`px-2 py-0.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  playbackRate === rate
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {rate === 1.0 ? '1x' : `${rate}x`}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Volume slider */}
        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-mute"
            type="button"
            onClick={toggleMute}
            className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title={isMuted ? 'Desmutar' : 'Mutar'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
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
            className="w-20 sm:w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>

      {/* Generated text snippet preview */}
      <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 border border-slate-200/80">
        <span className="font-semibold text-slate-700">Texto convertido:</span>{' '}
        <span className="italic line-clamp-2">"{currentAudio.text}"</span>
      </div>
    </div>
  );
};
