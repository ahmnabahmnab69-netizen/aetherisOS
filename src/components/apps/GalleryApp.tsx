import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Play, 
  Pause, 
  Info, 
  ChevronLeft, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface Photo {
  id: string;
  title: string;
  location: string;
  url: string;
  iso: number;
  focal: string;
  aperture: string;
  shutter: string;
  dimensions: string;
}

const SAMPLE_PHOTOS: Photo[] = [
  {
    id: 'p1',
    title: 'Glacial Prism Lake',
    location: 'Lofoten, Norway',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><defs><linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%230c1427"/><stop offset="50%" stop-color="%231e3a5f"/><stop offset="100%" stop-color="%2338bdf8"/></linearGradient><linearGradient id="mount" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%2309101d"/><stop offset="50%" stop-color="%231a2942"/><stop offset="100%" stop-color="%2309101d"/></linearGradient></defs><rect width="1200" height="800" fill="url(%23sky)"/><polygon points="0,550 200,320 420,480 650,220 900,450 1200,280 1200,800 0,800" fill="url(%23mount)"/><circle cx="650" cy="220" r="180" fill="%2338bdf8" filter="blur(60px)" opacity="0.3"/><rect y="540" width="1200" height="260" fill="%23081426" opacity="0.95"/></svg>',
    iso: 100,
    focal: '28mm',
    aperture: 'f/2.8',
    shutter: '1/800s',
    dimensions: '6000 × 4000',
  },
  {
    id: 'p2',
    title: 'Solstice Cloud Mesa',
    location: 'Atacama, Chile',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><defs><linearGradient id="dawn" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%231a0a18"/><stop offset="40%" stop-color="%23831843"/><stop offset="70%" stop-color="%23ea580c"/><stop offset="100%" stop-color="%23fde047"/></linearGradient></defs><rect width="1200" height="800" fill="url(%23dawn)"/><ellipse cx="600" cy="520" rx="480" ry="140" fill="%23180812" opacity="0.95"/></svg>',
    iso: 64,
    focal: '50mm',
    aperture: 'f/4.0',
    shutter: '1/1250s',
    dimensions: '6192 × 4128',
  },
  {
    id: 'p3',
    title: 'Emerald Caustic Wave',
    location: 'Faroe Islands',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><defs><linearGradient id="ocean" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23022c22"/><stop offset="50%" stop-color="%23047857"/><stop offset="100%" stop-color="%2306b6d4"/></linearGradient></defs><rect width="1200" height="800" fill="url(%23ocean)"/><circle cx="450" cy="400" r="260" fill="%2334d399" filter="blur(80px)" opacity="0.45"/></svg>',
    iso: 200,
    focal: '16mm',
    aperture: 'f/1.8',
    shutter: '1/2000s',
    dimensions: '5840 × 3890',
  },
];

export const GalleryApp: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showInfo, setShowInfo] = useState(true);
  const currentPhoto = SAMPLE_PHOTOS[currentIndex];

  const handleNext = () => {
    sound.playClick();
    setCurrentIndex((currentIndex + 1) % SAMPLE_PHOTOS.length);
    setZoom(1);
  };

  const handlePrev = () => {
    sound.playClick();
    setCurrentIndex((currentIndex - 1 + SAMPLE_PHOTOS.length) % SAMPLE_PHOTOS.length);
    setZoom(1);
  };

  return (
    <div className="flex h-full w-full bg-slate-950/80 backdrop-blur-xl text-slate-100 select-none overflow-hidden">
      {/* Main photo area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Control Bar */}
        <header className="h-11 border-b border-white/10 px-4 flex items-center justify-between bg-white/[0.03]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white truncate">{currentPhoto.title}</span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">{currentPhoto.location}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { sound.playClick(); setZoom(z => Math.max(0.6, z - 0.2)); }}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono tabular-nums text-slate-400 w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => { sound.playClick(); setZoom(z => Math.min(2.5, z + 0.2)); }}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-3.5 bg-white/15 mx-1" />
            <button
              onClick={() => { sound.playClick(); setShowInfo(!showInfo); }}
              className={`p-1 rounded transition-colors ${showInfo ? 'bg-sky-500/20 text-sky-200' : 'bg-white/5 text-slate-300 hover:text-white'}`}
              title="Photo Inspector"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Viewport Canvas */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-6 bg-black/40">
          <div 
            style={{ transform: `scale(${zoom})`, transition: 'transform 0.15s ease-out' }}
            className="w-full h-full max-h-[460px] flex items-center justify-center"
          >
            <img
              src={currentPhoto.url}
              alt={currentPhoto.title}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
            />
          </div>

          {/* Navigation overlay buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/15 transition-all shadow-lg active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/15 transition-all shadow-lg active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom thumbnail strip */}
        <footer className="h-16 border-t border-white/10 px-4 bg-white/[0.02] flex items-center gap-3 overflow-x-auto">
          {SAMPLE_PHOTOS.map((photo, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={photo.id}
                onClick={() => { sound.playClick(); setCurrentIndex(idx); setZoom(1); }}
                className={`h-11 w-16 shrink-0 rounded-lg overflow-hidden border transition-all ${
                  isSelected ? 'border-sky-400 ring-2 ring-sky-400/40 scale-105' : 'border-white/15 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </footer>
      </div>

      {/* Photo Metadata Inspector */}
      {showInfo && (
        <aside className="w-56 border-l border-white/10 p-4 bg-white/[0.02] flex flex-col space-y-4 text-xs">
          <div className="pb-2 border-b border-white/10 font-semibold text-slate-200">
            Image Details
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[11px] text-slate-400 block">Dimensions</span>
              <span className="font-mono tabular-nums text-slate-200">{currentPhoto.dimensions}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Lens & Focal</span>
              <span className="font-mono tabular-nums text-slate-200">{currentPhoto.focal} Wide Prime</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Aperture</span>
              <span className="font-mono tabular-nums text-slate-200">{currentPhoto.aperture}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Shutter Speed</span>
              <span className="font-mono tabular-nums text-slate-200">{currentPhoto.shutter}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">ISO Sensitivity</span>
              <span className="font-mono tabular-nums text-slate-200">ISO {currentPhoto.iso}</span>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
