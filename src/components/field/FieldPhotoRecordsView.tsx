import React, { useState, useEffect, useRef } from 'react';
import { FieldPhoto, REAL_FIELD_PHOTOS } from '../../data/fieldPhotos';
import { CROSS_EVIDENCE_ITEMS } from '../../data/fieldCrossEvidence';
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
  Maximize2,
  X,
  Camera,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';
import {
  loadAllStoredPhotos,
  saveStoredPhoto,
  removeStoredPhoto,
  StoredPhotosMap,
} from '../../utils/photoStorage';
import { SupportedLang } from '../../data/translations';

interface FieldPhotoRecordsViewProps {
  onSelectPhotoText: (text: string, title: string) => void;
  onPlayQuickSpeech: (text: string) => void;
  onSelectCrossEvidenceTheme?: (crossId: string) => void;
  initialPhotoId?: string;
  currentLang?: SupportedLang;
}

export const FieldPhotoRecordsView: React.FC<FieldPhotoRecordsViewProps> = ({
  onSelectPhotoText,
  onPlayQuickSpeech,
  onSelectCrossEvidenceTheme,
  initialPhotoId,
  currentLang = 'pt',
}) => {
  const isPt = currentLang === 'pt';
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

  // Jump to specific photo if requested
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
    }, 7000);
    return () => clearInterval(interval);
  }, [isPlaying, photos.length]);

  const current = photos[currentIndex];
  const currentCustomImg = userPhotos[current.id];

  // Linked cross-evidence items for the current photo
  const linkedCrossEvidence = CROSS_EVIDENCE_ITEMS.filter((ce) =>
    ce.relatedPhotoIds.includes(current.id)
  );

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleSendToStudio = (photo: FieldPhoto) => {
    const textToSynthesize = isPt
      ? `${photo.title}. Localizado em ${photo.location}. Coordenadas: ${photo.coords}. ${photo.description}. Observações agronómicas e de campo: ${photo.technicalDetails.join(' ')}.`
      : `${photo.titleEn}. Located in ${photo.locationEn}. Coordinates: ${photo.coords}. ${photo.descriptionEn}. Agronomic and field observations: ${photo.technicalDetailsEn.join(' ')}.`;
    const title = isPt ? `Registo Fotográfico ${photo.number}: ${photo.title}` : `Field Photo ${photo.number}: ${photo.titleEn}`;
    onSelectPhotoText(textToSynthesize, title);
  };

  const handleListenDirectly = (photo: FieldPhoto) => {
    const text = isPt
      ? `Fotografia ${photo.number}: ${photo.title}. ${photo.location}. ${photo.description}`
      : `Photo ${photo.number}: ${photo.titleEn}. ${photo.locationEn}. ${photo.descriptionEn}`;
    onPlayQuickSpeech(text);
  };

  // Multi-file batch upload
  const processFiles = (files: FileList | File[]) => {
    const updatedMap = { ...userPhotos };
    let uploadedCount = 0;

    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) return;

        let matchedPhoto = photos.find(
          (p) => p.originalFileName.toLowerCase() === file.name.toLowerCase()
        );

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
      isPt ? 'A sincronizar fotografias reais do utilizador...' : 'Synchronizing authentic field photos...'
    );
    setTimeout(() => {
      setUploadFeedback(null);
    }, 3500);
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
            isPt ? 'Fotografia actualizada com sucesso no registo.' : 'Photo updated successfully in record.'
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
      {/* Hidden inputs */}
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

      {/* Top Banner: Academic Field Photography Overview & Real Sync */}
      <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 sm:p-5 text-[#1A2417] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D9CDAF]">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#354D2C]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#4F5C48] font-semibold">
                {isPt ? 'Apêndice D · Evidência Fotográfica de Campo' : 'Appendix D · Photographic Field Evidence'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-display text-[#1A2417] mt-0.5">
              {isPt ? 'Registos Fotográficos da Missão de Zavala' : 'Photographic Records from Zavala Mission'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-xs font-mono bg-[#F4EFE6] text-[#354D2C] border border-[#D9CDAF]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#354D2C]" />
              <span>{uploadedCount} / {photos.length} {isPt ? 'Fotos Reais Carregadas' : 'Real Photos Loaded'}</span>
            </span>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-medium bg-[#1A2417] text-[#FCFAF6] hover:bg-[#354D2C] transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#D9CDAF]" />
              <span>{isPt ? 'Carregar Fotos Reais' : 'Upload Real Photos'}</span>
            </button>
          </div>
        </div>

        {/* Drag & Drop Banner */}
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
          className={`p-3 rounded-[2px] border border-dashed transition-all flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left ${
            dragOver
              ? 'bg-[#354D2C]/10 border-[#354D2C]'
              : 'bg-[#F4EFE6]/60 border-[#D9CDAF]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[2px] bg-[#EAE2D2] border border-[#D9CDAF] flex items-center justify-center shrink-0">
              <ImageIcon className="w-4 h-4 text-[#354D2C]" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-[#1A2417] block">
                {isPt ? 'Arrastar e soltar ficheiros de fotografia aqui' : 'Drag and drop original photos here'}
              </span>
              <span className="text-[#4F5C48] text-[11px]">
                {isPt
                  ? 'Compatível com nomes originais de exportação ou seleção múltipla'
                  : 'Compatible with original export filenames or multiple selection'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-medium text-[#354D2C] hover:text-[#1A2417] underline decoration-[#D9CDAF] shrink-0 cursor-pointer"
          >
            {isPt ? 'Explorar ficheiros...' : 'Browse files...'}
          </button>
        </div>

        {uploadFeedback && (
          <div className="p-2 bg-[#354D2C]/10 border border-[#354D2C]/30 rounded-[2px] text-xs text-[#354D2C] font-mono flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{uploadFeedback}</span>
          </div>
        )}
      </div>

      {/* Main Photographic Record Viewer */}
      <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] overflow-hidden text-[#1A2417]">
        {/* Carousel Navigation Header */}
        <div className="p-3.5 sm:p-4 bg-[#F4EFE6] border-b border-[#D9CDAF] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 rounded-[2px] border border-[#D9CDAF] bg-[#FCFAF6] hover:bg-[#EAE2D2] text-[#1A2417] cursor-pointer"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 rounded-[2px] border border-[#D9CDAF] bg-[#FCFAF6] hover:bg-[#EAE2D2] text-[#1A2417] cursor-pointer"
                aria-label="Seguinte"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-mono">
              <span className="font-bold text-[#1A2417]">Foto {current.number}</span>
              <span className="text-[#4F5C48]"> de {photos.length}</span>
              <span className="text-[#D9CDAF] mx-2">|</span>
              <span className="text-[#4F5C48] uppercase tracking-wider">{current.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-xs font-medium border cursor-pointer transition-colors ${
                isPlaying
                  ? 'bg-[#354D2C] text-[#FCFAF6] border-[#354D2C]'
                  : 'bg-[#FCFAF6] text-[#4F5C48] border-[#D9CDAF] hover:text-[#1A2417]'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? (isPt ? 'Pausa' : 'Pause') : (isPt ? 'Auto' : 'Play')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleListenDirectly(current)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] text-xs font-medium bg-[#FCFAF6] border border-[#D9CDAF] hover:bg-[#EAE2D2] text-[#1A2417] cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#354D2C]" />
              <span>{isPt ? 'Ouvir' : 'Listen'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSendToStudio(current)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] text-xs font-medium bg-[#1A2417] text-[#FCFAF6] hover:bg-[#354D2C] cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-[#D9CDAF]" />
              <span>{isPt ? 'Estúdio' : 'Studio'}</span>
            </button>
          </div>
        </div>

        {/* Photographic Display Grid (Visual Image + Technical Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-[#D9CDAF]">
          {/* Left Column: Image Canvas & Zoom */}
          <div className="lg:col-span-7 bg-[#EAE2D2]/30 p-4 sm:p-6 flex flex-col justify-center items-center relative min-h-[340px] sm:min-h-[420px] border-b lg:border-b-0 lg:border-r border-[#D9CDAF]">
            {currentCustomImg ? (
              <div className="relative group max-w-full max-h-[420px] overflow-hidden rounded-[2px] border border-[#D9CDAF] shadow-sm">
                <img
                  src={currentCustomImg}
                  alt={current.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain max-h-[420px] bg-black/5"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setZoomModalSrc(currentCustomImg)}
                    className="p-2 rounded-[2px] bg-[#FCFAF6] text-[#1A2417] hover:bg-[#EAE2D2] text-xs font-medium flex items-center gap-1 shadow-md cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>{isPt ? 'Ampliar' : 'Zoom'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerSingleUpload(current.id)}
                    className="p-2 rounded-[2px] bg-[#FCFAF6] text-[#1A2417] hover:bg-[#EAE2D2] text-xs font-medium flex items-center gap-1 shadow-md cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isPt ? 'Substituir' : 'Replace'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(current.id)}
                    className="p-2 rounded-[2px] bg-[#FCFAF6] text-[#A8531E] hover:bg-[#EAE2D2] text-xs font-medium flex items-center gap-1 shadow-md cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md p-6 bg-[#FCFAF6] border border-dashed border-[#D9CDAF] rounded-[2px] text-center space-y-3">
                <div className="w-12 h-12 rounded-[2px] bg-[#F4EFE6] border border-[#D9CDAF] flex items-center justify-center mx-auto text-[#4F5C48]">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm font-display text-[#1A2417]">
                    {current.title}
                  </h4>
                  <p className="text-xs text-[#4F5C48] mt-1 font-mono">
                    {current.originalFileName}
                  </p>
                </div>
                <p className="text-xs text-[#4F5C48] leading-relaxed">
                  {isPt
                    ? 'Registo fotográfico documentado na dissertação. Carregue o ficheiro original da câmara para visualização de alta resolução.'
                    : 'Photographic record documented in the thesis. Upload the original camera file for high-resolution inspection.'}
                </p>
                <button
                  type="button"
                  onClick={() => triggerSingleUpload(current.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-[#1A2417] text-[#FCFAF6] hover:bg-[#354D2C] text-xs font-medium cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isPt ? 'Carregar esta Fotografia' : 'Upload this Photo'}</span>
                </button>
              </div>
            )}

            {/* Bottom Caption */}
            <div className="w-full mt-3 flex items-center justify-between text-[11px] text-[#4F5C48] font-mono">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#A8531E]" />
                <span>{current.location}</span>
              </span>
              <span>{current.coords}</span>
            </div>
          </div>

          {/* Right Column: Four Scientific Layers */}
          <div className="lg:col-span-5 p-5 space-y-4 text-xs font-sans">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#4F5C48] font-semibold block">
                {isPt ? 'Identificação do Registo' : 'Record Identification'}
              </span>
              <h3 className="text-base sm:text-lg font-bold font-display text-[#1A2417]">
                {current.title}
              </h3>
            </div>

            {/* Camada 1: Registo Empírico */}
            <div className="p-3 bg-[#F4EFE6]/60 border border-[#D9CDAF] rounded-[2px] space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] font-semibold block">
                {isPt ? '1. Registo Empírico & Metadados de Campo' : '1. Empirical Record & Metadata'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[#4F5C48] block">{isPt ? 'Arquivo Original:' : 'Original File:'}</span>
                  <span className="font-mono text-[#1A2417] truncate block">{current.originalFileName}</span>
                </div>
                <div>
                  <span className="text-[#4F5C48] block">{isPt ? 'Campanha / Data:' : 'Campaign / Date:'}</span>
                  <span className="font-mono text-[#1A2417]">{current.date}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[#4F5C48] block">{isPt ? 'Localização e Coordenadas:' : 'Location and Coords:'}</span>
                  <span className="font-mono text-[#1A2417] text-[10px]">{current.coords}</span>
                </div>
              </div>
            </div>

            {/* Camada 2: Observação da Investigadora */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#354D2C] font-semibold block">
                {isPt ? '2. Observação Etnográfica & Descrição de Campo' : '2. Ethnographic Observation & Description'}
              </span>
              <p className="text-xs text-[#1A2417] leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Camada 3: Biometria e Parâmetros Agronómicos */}
            <div className="p-3 bg-[#FCFAF6] border border-[#D9CDAF] rounded-[2px] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A8531E] font-semibold block">
                {isPt ? '3. Biometria & Parâmetros Agronómicos Observados' : '3. Observed Biometrics & Agronomic Parameters'}
              </span>

              <div className="space-y-1.5">
                {current.technicalDetails.map((td, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#4F5C48]">
                    <span className="text-[#354D2C] font-bold mt-0.5">•</span>
                    <span className="leading-snug">{td}</span>
                  </div>
                ))}
              </div>

              {current.tags && current.tags.length > 0 && (
                <div className="pt-2 border-t border-[#D9CDAF]/50 flex flex-wrap gap-1">
                  {current.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded-[2px] bg-[#EAE2D2] text-[#1A2417] font-mono text-[10px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Camada 4: Relação com a Dissertação (Triangulação) */}
            {linkedCrossEvidence.length > 0 && (
              <div className="pt-2 border-t border-[#D9CDAF]/70 space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] font-semibold flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#354D2C]" />
                  <span>{isPt ? '4. Evidência Cruzada com a Tese' : '4. Cross-Evidence with Thesis'}</span>
                </span>
                {linkedCrossEvidence.map((ce) => (
                  <div
                    key={ce.id}
                    className="p-2 rounded-[2px] bg-[#F4EFE6]/60 border border-[#D9CDAF] flex items-center justify-between gap-2 text-[11px]"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-[#1A2417] truncate block">{ce.title}</span>
                      <span className="text-[10px] font-mono text-[#4F5C48]">{ce.dissertationChapter}</span>
                    </div>
                    {onSelectCrossEvidenceTheme && (
                      <button
                        type="button"
                        onClick={() => onSelectCrossEvidenceTheme(ce.id)}
                        className="inline-flex items-center gap-0.5 text-[#354D2C] hover:text-[#1A2417] font-medium shrink-0 cursor-pointer"
                      >
                        <span>{isPt ? 'Ver Nó' : 'View'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Selector Ribbon */}
        <div className="p-3 bg-[#F4EFE6] border-t border-[#D9CDAF] overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {photos.map((p, idx) => {
              const isSelected = idx === currentIndex;
              const hasCustom = !!userPhotos[p.id];

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`px-2.5 py-1.5 rounded-[2px] border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A2417] text-[#FCFAF6] border-[#1A2417] shadow-xs'
                      : 'bg-[#FCFAF6] text-[#4F5C48] border-[#D9CDAF] hover:text-[#1A2417]'
                  }`}
                >
                  <span className="font-bold">Foto {p.number}</span>
                  {hasCustom && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#354D2C]" title="Foto real carregada" />
                  )}
                  <span className="text-[10px] opacity-70 hidden sm:inline">({p.location.split('•')[0].trim()})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full Resolution Zoom Modal */}
      {zoomModalSrc && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs"
          onClick={() => setZoomModalSrc(null)}
        >
          <div
            className="relative max-w-5xl max-h-[95vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomModalSrc(null)}
              className="absolute -top-10 right-0 p-1.5 text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={zoomModalSrc}
              alt="Ampliação da fotografia de campo"
              referrerPolicy="no-referrer"
              className="max-h-[85vh] w-auto object-contain rounded-[2px] border border-white/20 shadow-2xl"
            />
            <div className="mt-3 text-center text-xs font-mono text-white/70">
              <span>{current.title} · {current.location} ({current.coords})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
