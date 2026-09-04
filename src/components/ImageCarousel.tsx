import React, { useState, useEffect, useRef } from 'react';
import {
  FieldPhoto,
  REAL_FIELD_PHOTOS,
} from '../data/fieldPhotos';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Volume2,
  FileText,
  Play,
  Pause,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Maximize2,
  X,
  FileCheck,
  Camera,
} from 'lucide-react';
import {
  loadAllStoredPhotos,
  saveStoredPhoto,
  removeStoredPhoto,
  StoredPhotosMap,
} from '../utils/photoStorage';
import { TRANSLATIONS, SupportedLang } from '../data/translations';

interface ImageCarouselProps {
  onSelectPhotoText: (text: string, title: string) => void;
  onPlayQuickSpeech: (text: string) => void;
  initialPhotoId?: string;
  currentLang?: SupportedLang;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  onSelectPhotoText,
  onPlayQuickSpeech,
  initialPhotoId,
  currentLang = 'pt',
}) => {
  const t = TRANSLATIONS[currentLang];
  const [photos] = useState<FieldPhoto[]>(REAL_FIELD_PHOTOS);
  const [userPhotos, setUserPhotos] = useState<StoredPhotosMap>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [zoomModalSrc, setZoomModalSrc] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const [singleUploadTargetId, setSingleUploadTargetId] = useState<string | null>(null);

  // Load custom stored photos on mount
  useEffect(() => {
    const loaded = loadAllStoredPhotos();
    setUserPhotos(loaded);
  }, []);

  // Jump to specific photo if requested (e.g. from search)
  useEffect(() => {
    if (initialPhotoId) {
      const idx = photos.findIndex((p) => p.id === initialPhotoId);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [initialPhotoId, photos]);

  // Autoplay cycle
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPlaying, photos.length]);

  const current = photos[currentIndex];
  const currentCustomImg = userPhotos[current.id];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleSendToStudio = (photo: FieldPhoto) => {
    const isPt = currentLang === 'pt';
    const textToSynthesize = isPt
      ? `${photo.title}. Localizado no ${photo.location}. Coordenadas: ${photo.coords}. ${photo.description}. Observações agronómicas: ${photo.technicalDetails.join(' ')}`
      : `${photo.titleEn}. Located in ${photo.locationEn}. Coordinates: ${photo.coords}. ${photo.descriptionEn}. Field observations: ${photo.technicalDetailsEn.join(' ')}`;
    const title = isPt ? `Registo Fotográfico ${photo.number}: ${photo.title}` : `Field Record ${photo.number}: ${photo.titleEn}`;
    onSelectPhotoText(textToSynthesize, title);
  };

  const handleListenDirectly = (photo: FieldPhoto) => {
    const isPt = currentLang === 'pt';
    const text = isPt
      ? `${photo.title}. ${photo.location}. ${photo.description}`
      : `${photo.titleEn}. ${photo.locationEn}. ${photo.descriptionEn}`;
    onPlayQuickSpeech(text);
  };

  // Multi-file batch upload (handles WhatsApp image filenames or order)
  const processFiles = (files: FileList | File[]) => {
    const updatedMap = { ...userPhotos };
    let uploadedCount = 0;

    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) return;

        // 1. Try to match by exact original filename
        let matchedPhoto = photos.find(
          (p) => p.originalFileName.toLowerCase() === file.name.toLowerCase()
        );

        // 2. If not found by exact name, try to match by partial WhatsApp timestamp or first unassigned slot
        if (!matchedPhoto) {
          const unassigned = photos.find((p) => !updatedMap[p.id]);
          matchedPhoto = unassigned || photos[uploadedCount % photos.length];
        }

        if (matchedPhoto) {
          saveStoredPhoto(matchedPhoto.id, dataUrl);
          updatedMap[matchedPhoto.id] = dataUrl;
          uploadedCount++;
          setUserPhotos({ ...updatedMap });
        }
      };
      reader.readAsDataURL(file);
    });

    setUploadFeedback(
      currentLang === 'pt'
        ? `A processar fotografias reais de campo...`
        : `Processing real field photographs...`
    );
    setTimeout(() => {
      setUploadFeedback(null);
    }, 4000);
  };

  const handleBatchFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && singleUploadTargetId) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          saveStoredPhoto(singleUploadTargetId, dataUrl);
          setUserPhotos((prev) => ({ ...prev, [singleUploadTargetId]: dataUrl }));
          setUploadFeedback(
            currentLang === 'pt' ? 'Fotografia carregada com sucesso!' : 'Photo uploaded successfully!'
          );
          setTimeout(() => setUploadFeedback(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    removeStoredPhoto(photoId);
    setUserPhotos((prev) => {
      const copy = { ...prev };
      delete copy[photoId];
      return copy;
    });
  };

  const triggerSingleUpload = (photoId: string) => {
    setSingleUploadTargetId(photoId);
    singleFileInputRef.current?.click();
  };

  const uploadedCount = Object.keys(userPhotos).length;

  return (
    <div className="space-y-6">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleBatchFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={singleFileInputRef}
        onChange={handleSingleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Header with Title & Upload Area */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900">
                {t.field.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              {t.field.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{uploadedCount} / 10 {currentLang === 'pt' ? 'Fotos Reais Carregadas' : 'Real Photos Loaded'}</span>
            </span>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white transition-all cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.field.btnSelectFiles}</span>
            </button>
          </div>
        </div>

        {/* Drag & Drop Multi-file Banner */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              processFiles(e.dataTransfer.files);
            }
          }}
          className={`p-4 rounded-xl border-2 border-dashed transition-all flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left ${
            dragOver
              ? 'border-emerald-500 bg-emerald-50/50'
              : 'border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-2xs">
              <FileCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900">
                {t.field.dropzoneText}
              </p>
              <p className="text-[11px] text-zinc-500">
                {t.field.uploadRealInstructions}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
          >
            {t.field.btnSelectFiles}
          </button>
        </div>

        {uploadFeedback && (
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium animate-fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadFeedback}</span>
          </div>
        )}
      </div>

      {/* Main Showcase Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        {/* Navigation Bar */}
        <div className="p-3 sm:p-4 bg-zinc-50/80 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <span className="font-bold text-zinc-900">
              {t.field.photoNumber} {currentIndex + 1} {t.field.of} {photos.length}
            </span>
            <span className="text-zinc-300">•</span>
            <span className="font-mono text-[11px] text-zinc-500 truncate max-w-[200px] sm:max-w-none">
              {current.originalFileName}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors cursor-pointer"
              title={isPlaying ? 'Pausar' : 'Apresentação contínua'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <div className="h-3 w-px bg-zinc-200 mx-1" />
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors cursor-pointer"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors cursor-pointer"
              aria-label="Foto seguinte"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left: Image or Archival Card */}
          <div className="lg:col-span-7 bg-zinc-950 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] relative overflow-hidden">
            {currentCustomImg ? (
              // Real User Uploaded Photo
              <div className="w-full h-full relative group flex items-center justify-center p-2">
                <img
                  src={currentCustomImg}
                  alt={currentLang === 'pt' ? current.title : current.titleEn}
                  className="max-h-[450px] w-auto object-contain rounded-lg shadow-lg"
                />
                {/* Floating overlay controls */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-white/20">
                  <button
                    type="button"
                    onClick={() => setZoomModalSrc(currentCustomImg)}
                    className="p-1.5 text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                    title="Ampliar foto"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerSingleUpload(current.id)}
                    className="p-1.5 text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                    title="Substituir foto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(current.id)}
                    className="p-1.5 text-rose-300 hover:text-rose-100 hover:bg-rose-500/30 rounded-lg transition-colors cursor-pointer"
                    title="Remover foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-emerald-300 font-mono border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Foto Real Autêntica Carregada</span>
                </div>
              </div>
            ) : (
              // Authentic Archival Catalog Card (NO AI Slop)
              <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between text-white space-y-6">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-md bg-emerald-950/80 text-emerald-300 text-xs font-mono font-semibold border border-emerald-500/30">
                    {t.field.authenticBadge} • N.º {current.number}
                  </span>
                  <span className="text-zinc-400 text-xs font-mono">
                    {currentLang === 'pt' ? current.category : current.categoryEn}
                  </span>
                </div>

                <div className="space-y-3 py-4 text-center sm:text-left">
                  <div className="inline-flex p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-emerald-400">
                    <Camera className="w-6 h-6" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-zinc-100">
                    {currentLang === 'pt' ? current.title : current.titleEn}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                    {t.field.noPhotosUploadedYet}
                  </p>
                  <div className="inline-block bg-zinc-900/90 px-3 py-1.5 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-300">
                    Ficheiro original: {current.originalFileName}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => triggerSingleUpload(current.id)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Carregar esta Foto ({current.originalFileName})</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Rich Scientific & Etnographic Data */}
          <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between bg-white border-t lg:border-t-0 lg:border-l border-zinc-100 space-y-4">
            <div className="space-y-3.5">
              {/* Location */}
              <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{currentLang === 'pt' ? current.location : current.locationEn}</span>
              </div>

              <div className="text-[11px] font-mono text-zinc-500 bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-200">
                {current.coords}
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 leading-snug">
                  {currentLang === 'pt' ? current.title : current.titleEn}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  {currentLang === 'pt' ? current.subtitle : current.subtitleEn}
                </p>
              </div>

              {/* Etnographic Description */}
              <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                {currentLang === 'pt' ? current.description : current.descriptionEn}
              </p>

              {/* Technical Observations */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-800 uppercase tracking-wider">
                  {t.field.technicalNotes}
                </span>
                <ul className="space-y-1 text-xs text-zinc-600">
                  {(currentLang === 'pt' ? current.technicalDetails : current.technicalDetailsEn).map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleListenDirectly(current)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-zinc-600" />
                <span>{t.field.btnListenPhoto}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendToStudio(current)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.field.btnSendToStudio}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Grid */}
        <div className="p-3 bg-zinc-50 border-t border-zinc-200 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {photos.map((img, idx) => {
              const isSelected = idx === currentIndex;
              const hasCustom = Boolean(userPhotos[img.id]);
              return (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-zinc-200 opacity-70 hover:opacity-100 bg-white'
                  }`}
                >
                  {hasCustom ? (
                    <img
                      src={userPhotos[img.id]}
                      alt={img.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 text-zinc-300 p-1 flex flex-col items-center justify-center text-[10px]">
                      <span className="font-mono font-bold">N.º {img.number}</span>
                      <span className="text-[8px] text-zinc-400">Apêndice D</span>
                    </div>
                  )}
                  <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/80 text-white text-[9px] font-mono">
                    {img.number}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full-screen Zoom Modal */}
      {zoomModalSrc && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setZoomModalSrc(null)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={zoomModalSrc}
            alt="Ampliada"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
