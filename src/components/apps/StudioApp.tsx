import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Brush, 
  Eraser, 
  RotateCcw, 
  RotateCw,
  Download, 
  Sliders, 
  Sparkles,
  Upload,
  FlipHorizontal,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Minus,
  Highlighter,
  Undo2,
  Redo2,
  Paintbrush
} from 'lucide-react';
import { sound } from '../../utils/sound';

type DrawTool = 
  | 'ink' 
  | 'calligraphy'
  | 'glow' 
  | 'highlighter' 
  | 'spray'
  | 'line'
  | 'rect'
  | 'circle'
  | 'text'
  | 'eraser';

export const StudioApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // High-performance direct drawing references (avoid React re-render loops while drawing)
  const isDrawingRef = useRef<boolean>(false);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);

  // Undo / Redo history buffer (stores canvas snapshots)
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Interactive UI State
  const [tool, setTool] = useState<DrawTool>('ink');
  const [color, setColor] = useState('#38bdf8');
  const [size, setSize] = useState(5);
  const [opacity, setOpacity] = useState(100);
  const [textInput, setTextInput] = useState('Aetheris Spec');
  const [isDragOver, setIsDragOver] = useState(false);

  // Optical glass filters
  const [glassBlur, setGlassBlur] = useState(0);
  const [contrast, setContrast] = useState(105);
  const [saturation, setSaturation] = useState(115);
  const [brightness, setBrightness] = useState(100);
  const [specularRim, setSpecularRim] = useState(true);

  const colors = [
    '#ffffff',
    '#38bdf8', // Sky
    '#2dd4bf', // Emerald Teal
    '#818cf8', // Indigo
    '#c084fc', // Purple
    '#fbbf24', // Amber
    '#f87171', // Rose
    '#f43f5e', // Crimson
    '#0f172a', // Deep Slate
    '#000000', // Pure Black
  ];

  // Helper to push history
  const pushHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
      newHistory.push(imgData);
      // Keep max 25 history steps
      if (newHistory.length > 25) {
        newHistory.shift();
      }
      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(false);
    } catch (e) {
      console.warn('History snapshot error:', e);
    }
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Initial ambient artwork
    const grad = ctx.createRadialGradient(
      canvas.width * 0.5, canvas.height * 0.45, 20,
      canvas.width * 0.5, canvas.height * 0.45, 220
    );
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    grad.addColorStop(0.5, 'rgba(129, 140, 248, 0.25)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5, canvas.height * 0.45, 220, 0, Math.PI * 2);
    ctx.fill();

    pushHistory();
  }, [pushHistory]);

  // Undo / Redo handlers
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    sound.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    historyIndexRef.current -= 1;
    const prev = historyRef.current[historyIndexRef.current];
    if (prev) {
      ctx.putImageData(prev, 0, 0);
    }
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    sound.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    historyIndexRef.current += 1;
    const next = historyRef.current[historyIndexRef.current];
    if (next) {
      ctx.putImageData(next, 0, 0);
    }
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Accurate Coordinate Mapper
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Pointer Down (Mouse, Touch, Stylus)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();

    // Lock pointer capture so stroke continues even if cursor briefly leaves bounds
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const pt = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'text') {
      sound.playClick();
      ctx.save();
      ctx.font = `600 ${size * 3.5}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity / 100;
      ctx.fillText(textInput, pt.x, pt.y);
      ctx.restore();
      pushHistory();
      return;
    }

    isDrawingRef.current = true;
    startPointRef.current = pt;
    lastPointRef.current = pt;

    // Snapshot current state for shape previewing
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Immediate ink dot on click / tap
    if (tool === 'ink' || tool === 'glow' || tool === 'highlighter' || tool === 'eraser' || tool === 'calligraphy') {
      ctx.save();
      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, size * 1.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (tool === 'glow') {
        ctx.globalCompositeOperation = 'lighter';
        ctx.shadowColor = color;
        ctx.shadowBlur = 16;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(1, size * 0.4), 0, Math.PI * 2);
        ctx.fill();
      } else if (tool === 'highlighter') {
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = color;
        ctx.fillRect(pt.x - size * 1.5, pt.y - size * 1.5, size * 3, size * 3);
      } else if (tool === 'calligraphy') {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(pt.x, pt.y, size * 1.5, size * 0.5, (45 * Math.PI) / 180, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Standard ink
        ctx.globalAlpha = opacity / 100;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (tool === 'spray') {
      // Immediate spray particles
      sprayAt(ctx, pt.x, pt.y);
    }
  };

  const sprayAt = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = (opacity / 100) * 0.45;
    const radius = size * 3.5;
    const density = size * 3;
    for (let i = 0; i < density; i++) {
      const offsetX = (Math.random() - 0.5) * 2 * radius;
      const offsetY = (Math.random() - 0.5) * 2 * radius;
      if (offsetX * offsetX + offsetY * offsetY <= radius * radius) {
        ctx.fillRect(x + offsetX, y + offsetY, 1.2, 1.2);
      }
    }
    ctx.restore();
  };

  // Pointer Move (Buttery 60fps direct rendering)
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const current = getCanvasCoords(e);
    const last = lastPointRef.current || current;
    const start = startPointRef.current || current;

    // Geometric Shape Previewing (Line, Rect, Circle)
    if (tool === 'line' || tool === 'rect' || tool === 'circle') {
      if (snapshotRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
      }
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = opacity / 100;

      if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(current.x, current.y);
        ctx.stroke();
      } else if (tool === 'rect') {
        const w = current.x - start.x;
        const h = current.y - start.y;
        ctx.strokeRect(start.x, start.y, w, h);
      } else if (tool === 'circle') {
        const rx = Math.abs(current.x - start.x) / 2;
        const ry = Math.abs(current.y - start.y) / 2;
        const cx = Math.min(start.x, current.x) + rx;
        const cy = Math.min(start.y, current.y) + ry;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    if (tool === 'spray') {
      sprayAt(ctx, current.x, current.y);
      lastPointRef.current = current;
      return;
    }

    // Continuous Ink Drawing
    ctx.save();

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = size * 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(current.x, current.y);
      ctx.stroke();
    } else if (tool === 'glow') {
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      // Outer neon diffuse beam
      ctx.lineWidth = size * 2.2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(current.x, current.y);
      ctx.stroke();

      // Inner intense core beam
      ctx.shadowBlur = 0;
      ctx.lineWidth = Math.max(1.5, size * 0.6);
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(current.x, current.y);
      ctx.stroke();
    } else if (tool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = color;
      ctx.lineWidth = size * 3;
      ctx.lineCap = 'square';
      ctx.lineJoin = 'bevel';
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(current.x, current.y);
      ctx.stroke();
    } else if (tool === 'calligraphy') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity / 100;
      // Multi-ribbon calligraphy stroke
      const steps = 6;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = last.x + (current.x - last.x) * t;
        const y = last.y + (current.y - last.y) * t;
        ctx.beginPath();
        ctx.ellipse(x, y, size * 1.6, size * 0.45, (45 * Math.PI) / 180, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Standard Ink Pen
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = opacity / 100;
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(current.x, current.y);
      ctx.stroke();
    }

    ctx.restore();
    lastPointRef.current = current;
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    startPointRef.current = null;
    lastPointRef.current = null;
    snapshotRef.current = null;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    pushHistory();
  };

  // Drag and drop image loading onto canvas
  const handleDropImage = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    loadImageFile(files[0]);
  };

  const loadImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    sound.playNotification();
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        pushHistory();
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Image Transformations
  const handleRotate90 = () => {
    sound.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    tempCtx.drawImage(canvas, 0, 0);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((90 * Math.PI) / 180);
    ctx.drawImage(tempCanvas, -canvas.width / 2, -canvas.height / 2);
    ctx.restore();
    pushHistory();
  };

  const handleFlipHorizontal = () => {
    sound.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    tempCtx.drawImage(canvas, 0, 0);

    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();
    pushHistory();
  };

  const handleClear = () => {
    sound.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pushHistory();
  };

  const handleDownload = () => {
    sound.playNotification();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `liquid-ink-artwork-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="flex h-full w-full bg-slate-950/80 backdrop-blur-2xl text-slate-100 select-none overflow-hidden">
      {/* Canvas Viewport */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden relative">
        {/* Main Ribbon Toolbar */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl">
          {/* Tool selector */}
          <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => { sound.playClick(); setTool('ink'); }}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs ${
                tool === 'ink' ? 'bg-sky-500/30 text-sky-200 border border-sky-400/40 font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Liquid Ink Pen"
            >
              <Brush className="w-3.5 h-3.5" />
              <span>Ink</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setTool('calligraphy'); }}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs ${
                tool === 'calligraphy' ? 'bg-sky-500/30 text-sky-200 border border-sky-400/40 font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Calligraphy Chisel Pen"
            >
              <Paintbrush className="w-3.5 h-3.5" />
              <span>Chisel</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setTool('glow'); }}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs ${
                tool === 'glow' ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Laser Glow Beam"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Glow</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setTool('highlighter'); }}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs ${
                tool === 'highlighter' ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40 font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Translucent Highlighter"
            >
              <Highlighter className="w-3.5 h-3.5" />
              <span>Highlight</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setTool('line'); }}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs ${
                tool === 'line' ? 'bg-white/20 text-white border border-white/20 font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Straight Line"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { sound.playClick(); setTool('rect'); }}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs ${
                tool === 'rect' ? 'bg-white/20 text-white border border-white/20 font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Rectangle Frame"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { sound.playClick(); setTool('circle'); }}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs ${
                tool === 'circle' ? 'bg-white/20 text-white border border-white/20 font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Ellipse / Circle"
            >
              <Circle className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { sound.playClick(); setTool('text'); }}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs ${
                tool === 'text' ? 'bg-violet-500/30 text-violet-200 border border-violet-400/40 font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Typographic Label Stamp"
            >
              <Type className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { sound.playClick(); setTool('eraser'); }}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs ${
                tool === 'eraser' ? 'bg-rose-500/30 text-rose-200 border border-rose-400/40 font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Eraser"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Eraser</span>
            </button>
          </div>

          {/* Color palette */}
          <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/5">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => { sound.playClick(); setColor(c); if (tool === 'eraser') setTool('ink'); }}
                style={{ backgroundColor: c }}
                className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                  color === c && tool !== 'eraser' ? 'scale-125 ring-2 ring-sky-400 ring-offset-1 ring-offset-slate-900 shadow-md' : 'hover:scale-110 opacity-80 hover:opacity-100'
                }`}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => { setColor(e.target.value); if (tool === 'eraser') setTool('ink'); }}
              className="w-4 h-4 rounded cursor-pointer bg-transparent border-0 opacity-80 hover:opacity-100"
              title="Custom Color"
            />
          </div>

          {/* Stroke Width Slider */}
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-black/30 px-2.5 py-1 rounded-xl border border-white/5">
            <span className="text-[11px] font-mono text-slate-400">Size {size}px</span>
            <input
              type="range"
              min="1"
              max="48"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-16 accent-sky-400 h-1 bg-white/20 rounded cursor-pointer"
            />
          </div>

          {/* Undo / Redo & Transformations */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className={`p-1.5 rounded-lg bg-white/5 border border-white/5 transition-colors ${
                canUndo ? 'text-slate-200 hover:text-white hover:bg-white/10 cursor-pointer' : 'text-slate-600 opacity-40 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className={`p-1.5 rounded-lg bg-white/5 border border-white/5 transition-colors ${
                canRedo ? 'text-slate-200 hover:text-white hover:bg-white/10 cursor-pointer' : 'text-slate-600 opacity-40 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRotate90}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 cursor-pointer"
              title="Rotate 90° Clockwise"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleFlipHorizontal}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 cursor-pointer"
              title="Flip Horizontal"
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
            </button>
            <label className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 cursor-pointer" title="Load Image onto Canvas">
              <Upload className="w-3.5 h-3.5" />
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && loadImageFile(e.target.files[0])} />
            </label>
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-200 border border-white/5 cursor-pointer"
              title="Clear Canvas"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 rounded-lg font-medium shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Text Annotation input if text tool active */}
        {tool === 'text' && (
          <div className="mb-2 p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs animate-in fade-in">
            <span className="text-slate-400">Stamp Text:</span>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="flex-1 bg-black/40 border border-white/15 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-sky-400"
            />
            <span className="text-[11px] text-slate-500">Click anywhere on canvas to place text stamp</span>
          </div>
        )}

        {/* Canvas Viewport (Touch & Pointer Reactive) */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDropImage}
          className={`flex-1 relative flex items-center justify-center rounded-2xl overflow-hidden border border-white/15 bg-black/50 shadow-2xl ${
            isDragOver ? 'ring-2 ring-sky-400 bg-sky-500/10' : ''
          }`}
          style={{ touchAction: 'none' }}
        >
          <canvas
            ref={canvasRef}
            width={960}
            height={620}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              touchAction: 'none',
              filter: `blur(${glassBlur}px) contrast(${contrast}%) saturate(${saturation}%) brightness(${brightness}%)`,
            }}
            className="w-full h-full object-contain cursor-crosshair touch-none transition-[filter] duration-75 select-none"
          />

          {specularRim && (
            <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/20 bg-gradient-to-t from-transparent via-transparent to-white/5" />
          )}

          {/* Quick status bar at bottom of canvas */}
          <div className="absolute bottom-2 left-3 pointer-events-none flex items-center gap-3 text-[10px] text-slate-400 font-mono bg-black/60 px-2 py-0.5 rounded-lg backdrop-blur-md border border-white/10">
            <span>Canvas 960×620</span>
            <span>Tool: {tool.toUpperCase()}</span>
            <span>Size: {size}px</span>
            <span>Ink Color: {color}</span>
          </div>
        </div>
      </div>

      {/* Right Properties & Glass Refraction Panel */}
      <aside className="w-64 border-l border-white/10 p-4 flex flex-col bg-white/[0.02]">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-4 pb-2 border-b border-white/10">
          <Sliders className="w-3.5 h-3.5 text-sky-400" />
          <span>Glass Refraction Filters</span>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Diffusion Blur</span>
              <span className="font-mono tabular-nums">{glassBlur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="16"
              value={glassBlur}
              onChange={(e) => setGlassBlur(Number(e.target.value))}
              className="w-full accent-sky-400 h-1 bg-white/20 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Contrast</span>
              <span className="font-mono tabular-nums">{contrast}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full accent-sky-400 h-1 bg-white/20 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Vibrancy Saturation</span>
              <span className="font-mono tabular-nums">{saturation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="250"
              value={saturation}
              onChange={(e) => setSaturation(Number(e.target.value))}
              className="w-full accent-sky-400 h-1 bg-white/20 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Luminance Exposure</span>
              <span className="font-mono tabular-nums">{brightness}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="160"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-sky-400 h-1 bg-white/20 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Ink Opacity</span>
              <span className="font-mono tabular-nums">{opacity}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-sky-400 h-1 bg-white/20 rounded cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t border-white/10">
            <label className="flex items-center justify-between cursor-pointer text-slate-300">
              <span>Specular Rim Highlight</span>
              <input
                type="checkbox"
                checked={specularRim}
                onChange={(e) => setSpecularRim(e.target.checked)}
                className="accent-sky-400 rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                sound.playClick();
                setGlassBlur(0);
                setContrast(105);
                setSaturation(115);
                setBrightness(100);
                setOpacity(100);
              }}
              className="w-full py-1.5 text-center text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="mt-auto p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-400 leading-relaxed space-y-2">
          <p className="font-medium text-slate-200 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
            Drawing Tips
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Press and drag with finger, stylus, or mouse to draw.</li>
            <li>Press <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px]">Ctrl+Z</kbd> to undo, <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px]">Ctrl+Y</kbd> to redo.</li>
            <li>Drag & drop image files onto the canvas to edit.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};
