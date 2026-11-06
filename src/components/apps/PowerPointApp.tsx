import React, { useState } from 'react';
import { 
  Play, 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  Layout, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
  Presentation
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface Slide {
  id: string;
  layout: 'title' | 'split' | 'metrics' | 'quote';
  title: string;
  subtitle: string;
  contentA?: string;
  contentB?: string;
  metricVal?: string;
  metricLabel?: string;
}

export const PowerPointApp: React.FC = () => {
  const [deckTitle, setDeckTitle] = useState('Aetheris Executive Vision.pptx');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreenPresent, setIsFullscreenPresent] = useState(false);

  const [slides, setSlides] = useState<Slide[]>([
    {
      id: 's1',
      layout: 'title',
      title: 'Aetheris Liquid OS',
      subtitle: 'The Next Generation Desktop Environment · Executive Architecture 2026',
    },
    {
      id: 's2',
      layout: 'metrics',
      title: 'Core Performance Benchmarks',
      subtitle: 'Uncompromising fluidity and optical fidelity',
      metricVal: '60 FPS',
      metricLabel: 'Continuous Real-Time Refraction Rate',
      contentA: 'Sub-pixel fluid simulation running simultaneously with multitasking window compositing without CPU throttling.',
    },
    {
      id: 's3',
      layout: 'split',
      title: 'Architectural Foundations',
      subtitle: 'Dual-Engine Integration',
      contentA: 'GNOME Shell Workflows:\n• Activities Overview with live window expose\n• Dynamic horizontal workspaces strip\n• Aggregate Quick Settings capsule',
      contentB: 'Liquid Glass User Interface:\n• Multi-layered frosted glass optics\n• Specular top rim reflections\n• Universal pointer, finger & stylus physics',
    },
    {
      id: 's4',
      layout: 'quote',
      title: 'Design Philosophy',
      subtitle: 'Universal Constitution',
      contentA: '“True luxury in software interface design is the eradication of clutter—every control is purposeful, every material authentic.”',
      metricLabel: 'Aetheris Human Interface Guidelines',
    }
  ]);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleAddSlide = (layout: Slide['layout'] = 'split') => {
    sound.playClick();
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      layout,
      title: 'New Slide Title',
      subtitle: 'Slide Subtitle or Theme',
      contentA: 'Key point 1\nKey point 2\nKey point 3',
      contentB: 'Supporting details and analysis',
    };
    setSlides(prev => [...prev, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const handleDuplicateSlide = () => {
    sound.playClick();
    const copy: Slide = {
      ...currentSlide,
      id: `slide-${Date.now()}`,
      title: `${currentSlide.title} (Copy)`,
    };
    setSlides(prev => [...prev.slice(0, currentSlideIndex + 1), copy, ...prev.slice(currentSlideIndex + 1)]);
    setCurrentSlideIndex(currentSlideIndex + 1);
  };

  const handleDeleteSlide = () => {
    sound.playClick();
    if (slides.length <= 1) return;
    const filtered = slides.filter((_, idx) => idx !== currentSlideIndex);
    setSlides(filtered);
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
  };

  const updateSlideField = (field: keyof Slide, val: string) => {
    setSlides(prev => prev.map((s, idx) => idx === currentSlideIndex ? { ...s, [field]: val } : s));
  };

  const handleNextSlide = () => {
    sound.playClick();
    setCurrentSlideIndex(idx => (idx + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    sound.playClick();
    setCurrentSlideIndex(idx => (idx - 1 + slides.length) % slides.length);
  };

  const handleDownload = () => {
    sound.playNotification();
    const json = JSON.stringify({ title: deckTitle, slides }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = deckTitle.replace(/\.[^/.]+$/, '.json');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 select-none overflow-hidden relative">
      {/* Fullscreen Slide Show Mode */}
      {isFullscreenPresent && (
        <div 
          onClick={handleNextSlide}
          className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-12 select-none animate-in fade-in duration-200 cursor-pointer"
        >
          {/* Exit button */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsFullscreenPresent(false); }}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-50"
            title="Exit Slide Show (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Slide 16:9 Presentation Canvas */}
          <div className="w-full max-w-5xl aspect-video bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-3xl p-16 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Ambient specular bloom */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {currentSlide.layout === 'title' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-3">Keynote Presentation</span>
                <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4">{currentSlide.title}</h1>
                <p className="text-lg text-slate-400 max-w-xl">{currentSlide.subtitle}</p>
              </div>
            ) : currentSlide.layout === 'metrics' ? (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{currentSlide.title}</h2>
                  <p className="text-sm text-slate-400">{currentSlide.subtitle}</p>
                </div>
                <div className="my-auto py-8">
                  <div className="text-7xl font-extrabold text-amber-400 font-mono tracking-tight mb-2">
                    {currentSlide.metricVal}
                  </div>
                  <div className="text-lg font-semibold text-slate-200">{currentSlide.metricLabel}</div>
                  <p className="text-sm text-slate-400 mt-2 max-w-xl">{currentSlide.contentA}</p>
                </div>
              </div>
            ) : currentSlide.layout === 'quote' ? (
              <div className="flex-1 flex flex-col justify-center text-center px-12">
                <blockquote className="text-3xl font-medium text-white italic leading-relaxed mb-6">
                  {currentSlide.contentA}
                </blockquote>
                <p className="text-sm text-amber-300 font-semibold uppercase tracking-wider">{currentSlide.metricLabel}</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{currentSlide.title}</h2>
                  <p className="text-sm text-slate-400 mb-8">{currentSlide.subtitle}</p>
                </div>
                <div className="grid grid-cols-2 gap-8 my-auto">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 whitespace-pre-line text-sm text-slate-300 leading-relaxed">
                    {currentSlide.contentA}
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 whitespace-pre-line text-sm text-slate-300 leading-relaxed">
                    {currentSlide.contentB}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom slide number */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-white/10">
              <span>{deckTitle}</span>
              <span className="font-mono">Slide {currentSlideIndex + 1} of {slides.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Standard Editor Header */}
      <header className="h-12 bg-slate-950/80 border-b border-white/10 px-4 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            P
          </div>
          <input
            type="text"
            value={deckTitle}
            onChange={(e) => setDeckTitle(e.target.value)}
            className="bg-transparent border-none text-white font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 px-1 py-0.5 rounded w-64 truncate"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Layout chooser */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 text-xs">
            {(['title', 'split', 'metrics', 'quote'] as const).map(l => (
              <button
                key={l}
                onClick={() => updateSlideField('layout', l)}
                className={`px-2 py-0.5 rounded capitalize ${currentSlide.layout === l ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            onClick={() => { sound.playClick(); setIsFullscreenPresent(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-transform active:scale-95 shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Present</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
            title="Download Slide Deck (.json)"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Editor Main: Left Thumbnails + Center Slide Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Slide Carousel Thumbnails */}
        <aside className="w-48 border-r border-white/10 p-3 bg-white/[0.02] flex flex-col gap-2 overflow-y-auto">
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Slides</span>
            <button
              onClick={() => handleAddSlide('split')}
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-white"
              title="Add New Slide"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {slides.map((s, idx) => {
            const isCurrent = idx === currentSlideIndex;
            return (
              <div
                key={s.id}
                onClick={() => { sound.playClick(); setCurrentSlideIndex(idx); }}
                className={`group relative p-2 rounded-xl border text-left cursor-pointer transition-all aspect-video flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400/80 ring-2 ring-amber-400/30 shadow-md'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{idx + 1}</span>
                  <span className="capitalize text-[9px] text-amber-300">{s.layout}</span>
                </div>
                <div className="text-[11px] font-semibold text-white truncate max-w-full">
                  {s.title}
                </div>
              </div>
            );
          })}

          <div className="mt-auto pt-2 flex items-center justify-between border-t border-white/10">
            <button
              onClick={handleDuplicateSlide}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10"
              title="Duplicate Slide"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDeleteSlide}
              className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/20"
              title="Delete Slide"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* Center Live Slide Editor Canvas */}
        <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center bg-slate-900/50">
          <div className="w-full max-w-3xl aspect-video bg-slate-950 border border-white/20 rounded-2xl p-10 flex flex-col justify-between shadow-2xl relative select-text">
            <div>
              <input
                type="text"
                value={currentSlide.title}
                onChange={(e) => updateSlideField('title', e.target.value)}
                placeholder="Click to add Title..."
                className="w-full bg-transparent border-none text-2xl font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400 rounded px-1"
              />
              <input
                type="text"
                value={currentSlide.subtitle}
                onChange={(e) => updateSlideField('subtitle', e.target.value)}
                placeholder="Click to add Subtitle..."
                className="w-full bg-transparent border-none text-sm text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400 rounded px-1 mt-1"
              />
            </div>

            {/* Layout Specific Editable Content */}
            <div className="my-auto py-4">
              {currentSlide.layout === 'metrics' ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={currentSlide.metricVal || '100%'}
                    onChange={(e) => updateSlideField('metricVal', e.target.value)}
                    className="bg-transparent border-none text-5xl font-extrabold text-amber-400 font-mono focus:outline-none"
                  />
                  <input
                    type="text"
                    value={currentSlide.metricLabel || 'Metric Description'}
                    onChange={(e) => updateSlideField('metricLabel', e.target.value)}
                    className="w-full bg-transparent border-none text-sm font-semibold text-slate-300 focus:outline-none"
                  />
                  <textarea
                    value={currentSlide.contentA || ''}
                    onChange={(e) => updateSlideField('contentA', e.target.value)}
                    placeholder="Context notes..."
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
                  />
                </div>
              ) : currentSlide.layout === 'quote' ? (
                <div>
                  <textarea
                    value={currentSlide.contentA || ''}
                    onChange={(e) => updateSlideField('contentA', e.target.value)}
                    placeholder="Enter inspirational quote..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-lg italic text-white focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    value={currentSlide.metricLabel || ''}
                    onChange={(e) => updateSlideField('metricLabel', e.target.value)}
                    placeholder="Author or Attribution"
                    className="w-full bg-transparent border-none text-xs text-amber-300 font-semibold mt-2 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <textarea
                    value={currentSlide.contentA || ''}
                    onChange={(e) => updateSlideField('contentA', e.target.value)}
                    placeholder="Column 1 content..."
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
                  />
                  <textarea
                    value={currentSlide.contentB || ''}
                    onChange={(e) => updateSlideField('contentB', e.target.value)}
                    placeholder="Column 2 content..."
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
                  />
                </div>
              )}
            </div>

            {/* Slide Footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-white/10">
              <span>{deckTitle}</span>
              <span className="font-mono">Slide {currentSlideIndex + 1} of {slides.length}</span>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Status bar */}
      <footer className="h-7 bg-slate-950/80 border-t border-white/10 px-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span>Slide {currentSlideIndex + 1} / {slides.length}</span>
          <span>·</span>
          <span>Layout: {currentSlide.layout}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrevSlide} className="hover:text-white p-0.5">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleNextSlide} className="hover:text-white p-0.5">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
};
