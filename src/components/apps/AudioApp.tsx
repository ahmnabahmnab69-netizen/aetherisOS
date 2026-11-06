import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Disc, 
  Waves,
  Sparkles,
  Radio
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface Track {
  id: string;
  name: string;
  subtitle: string;
  duration: string;
  color: string;
}

const TRACKS: Track[] = [
  { id: '1', name: 'Ethereal Glass', subtitle: 'Prismatic harmonic resonance in A-Major', duration: '∞ loop', color: '#38bdf8' },
  { id: '2', name: 'Deep Water', subtitle: 'Sub-aquatic spatial swells in D-Minor', duration: '∞ loop', color: '#818cf8' },
  { id: '3', name: 'Aurora Drone', subtitle: 'Atmospheric low-frequency harmonic choir', duration: '∞ loop', color: '#34d399' },
  { id: '4', name: 'Lo-Fi Warmth', subtitle: 'Analog filtered tape chords in C-Maj7', duration: '∞ loop', color: '#fbbf24' },
];

export const AudioApp: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(sound.isPlayingAmbient());
  const [volume, setVolume] = useState(80);
  const [filterCutoff, setFilterCutoff] = useState(500);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    setIsPlaying(sound.isPlayingAmbient());
  }, []);

  const handleTogglePlay = () => {
    sound.playClick();
    if (isPlaying) {
      sound.stopAmbient();
      setIsPlaying(false);
    } else {
      sound.startAmbient(currentTrack.name);
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (idx: number) => {
    sound.playClick();
    setCurrentTrackIndex(idx);
    if (isPlaying) {
      sound.startAmbient(TRACKS[idx].name);
    }
  };

  const handleNext = () => {
    sound.playClick();
    const nextIdx = (currentTrackIndex + 1) % TRACKS.length;
    setCurrentTrackIndex(nextIdx);
    if (isPlaying) sound.startAmbient(TRACKS[nextIdx].name);
  };

  const handlePrev = () => {
    sound.playClick();
    const prevIdx = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    setCurrentTrackIndex(prevIdx);
    if (isPlaying) sound.startAmbient(TRACKS[prevIdx].name);
  };

  // Live Canvas Wave Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (isPlaying) {
        phase += 0.04;
      }

      const waveCount = 4;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const baseAmp = isPlaying ? 24 - w * 4 : 4;
        const color = currentTrack.color;
        ctx.strokeStyle = color.replace(')', `, ${0.4 - w * 0.08})`);
        ctx.lineWidth = 2.5;

        for (let x = 0; x <= width; x += 4) {
          const normX = x / width;
          const y = height / 2 + Math.sin(normX * 8 + phase + w * 1.2) * Math.sin(normX * Math.PI) * baseAmp;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Center frequency peak bars
      const barCount = 32;
      const barWidth = 4;
      const gap = 4;
      const totalWidth = barCount * (barWidth + gap);
      const startX = (width - totalWidth) / 2;

      for (let i = 0; i < barCount; i++) {
        const factor = isPlaying ? Math.abs(Math.sin(phase * 1.5 + i * 0.3)) : 0.08;
        const barHeight = Math.max(3, factor * 48);
        const x = startX + i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, currentTrack.color);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, currentTrack]);

  return (
    <div className="flex flex-col h-full w-full bg-slate-950/70 backdrop-blur-xl text-slate-100 select-none overflow-hidden">
      {/* Visualizer Hero Header */}
      <div className="relative h-44 bg-gradient-to-b from-white/[0.04] to-transparent p-6 flex flex-col items-center justify-center border-b border-white/10 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={600}
          height={160}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-1.5">
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs uppercase font-medium tracking-widest text-slate-400">
              Aetheris Ambient Synthesizer
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white mb-1">
            {currentTrack.name}
          </h2>
          <p className="text-xs text-slate-400 max-w-sm">
            {currentTrack.subtitle}
          </p>
        </div>
      </div>

      {/* Middle Track List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
          Soundscape Library
        </div>
        {TRACKS.map((track, idx) => {
          const isCurrent = idx === currentTrackIndex;
          return (
            <button
              key={track.id}
              onClick={() => handleSelectTrack(idx)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                isCurrent
                  ? 'bg-white/15 border-white/25 shadow-md ring-1 ring-sky-400/30'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${track.color}25` }}
                >
                  <Disc className="w-4 h-4" style={{ color: track.color }} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">{track.name}</h4>
                  <p className="text-[11px] text-slate-400">{track.subtitle}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono tabular-nums text-slate-400">
                {track.duration}
              </span>
            </button>
          );
        })}
      </div>

      {/* Playback Controls Footer */}
      <footer className="h-20 border-t border-white/10 px-6 bg-white/[0.03] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-[120px]">
          <Waves className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-medium text-slate-300 truncate">
            {currentTrack.name}
          </span>
        </div>

        {/* Central transport buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={handleTogglePlay}
            className="p-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white shadow-lg transition-transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume slider */}
        <div className="flex items-center gap-2 min-w-[120px] justify-end">
          <Volume2 className="w-4 h-4 text-slate-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 accent-sky-400 h-1 bg-white/20 rounded cursor-pointer"
          />
        </div>
      </footer>
    </div>
  );
};
