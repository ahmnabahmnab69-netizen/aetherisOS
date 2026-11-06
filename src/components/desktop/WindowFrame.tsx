import React, { useState } from 'react';
import { 
  Minus, 
  Square, 
  X, 
  Copy, 
  Sliders, 
  ZoomIn, 
  ZoomOut 
} from 'lucide-react';
import { WindowInstance } from '../../types/os';
import { sound } from '../../utils/sound';
import { AppGlassIcon } from './LiquidIcons';

interface WindowFrameProps {
  window: WindowInstance;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onUpdateBounds: (bounds: { x: number; y: number; width: number; height: number }) => void;
  onUpdateOpacity: (opacity: number) => void;
  children: React.ReactNode;
}

// Utility to extract coordinates from either mouse, touch, or pointer event
const getCoords = (e: MouseEvent | TouchEvent | PointerEvent | React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
  if ('touches' in e && e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  if ('changedTouches' in e && e.changedTouches && e.changedTouches.length > 0) {
    return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  }
  if ('clientX' in e) {
    return { x: e.clientX, y: e.clientY };
  }
  return { x: 0, y: 0 };
};

export const WindowFrame: React.FC<WindowFrameProps> = ({
  window: win,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onUpdateBounds,
  onUpdateOpacity,
  children,
}) => {
  const [showOpacitySlider, setShowOpacitySlider] = useState(false);
  const [isDraggingNow, setIsDraggingNow] = useState(false);

  // Universal Drag Handler for Mouse, Touch & Finger
  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    if (win.isMaximized) return;
    // Don't drag if tapping interactive buttons, inputs, sliders
    if ((e.target as HTMLElement).closest('button, input, select, textarea, [data-no-drag]')) return;

    if (e.cancelable) {
      e.preventDefault();
    }
    onFocus();
    setIsDraggingNow(true);

    const { x: startMouseX, y: startMouseY } = getCoords(e);
    const initialX = win.x;
    const initialY = win.y;

    const onPointerMove = (moveEvent: MouseEvent | TouchEvent | PointerEvent) => {
      if (moveEvent.cancelable) {
        moveEvent.preventDefault();
      }
      const { x: currentX, y: currentY } = getCoords(moveEvent);
      const deltaX = currentX - startMouseX;
      const deltaY = currentY - startMouseY;

      // Free movement bounds across desktop:
      // Minimum 80px left visible on screen to grab, titlebar kept below GNOME top bar (32px)
      const topBarHeight = 32;
      const minX = -win.width + 80;
      const maxX = window.innerWidth - 80;
      const minY = topBarHeight;
      const maxY = window.innerHeight - 50;

      const newX = Math.max(minX, Math.min(maxX, initialX + deltaX));
      const newY = Math.max(minY, Math.min(maxY, initialY + deltaY));

      onUpdateBounds({
        x: newX,
        y: newY,
        width: win.width,
        height: win.height,
      });
    };

    const onPointerEnd = () => {
      setIsDraggingNow(false);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerEnd);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerEnd);
      window.removeEventListener('touchcancel', onPointerEnd);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
    };

    // Attach passive: false listeners to ensure touch scrolling is locked during window movement
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerEnd);
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerEnd);
    window.addEventListener('touchcancel', onPointerEnd);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerEnd);
    window.addEventListener('pointercancel', onPointerEnd);
  };

  // Universal 8-direction Resizing for Mouse, Touch & Finger
  const handleStartResize = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent, direction: string) => {
    if (win.isMaximized) return;
    e.stopPropagation();
    if (e.cancelable) {
      e.preventDefault();
    }
    onFocus();

    const { x: startMouseX, y: startMouseY } = getCoords(e);
    const startX = win.x;
    const startY = win.y;
    const startW = win.width;
    const startH = win.height;

    const onPointerMove = (moveEvent: MouseEvent | TouchEvent | PointerEvent) => {
      if (moveEvent.cancelable) {
        moveEvent.preventDefault();
      }
      const { x: currentX, y: currentY } = getCoords(moveEvent);
      const dx = currentX - startMouseX;
      const dy = currentY - startMouseY;

      let newX = startX;
      let newY = startY;
      let newW = startW;
      let newH = startH;

      if (direction.includes('e')) {
        newW = Math.max(win.minWidth, startW + dx);
      }
      if (direction.includes('w')) {
        const calculatedW = startW - dx;
        if (calculatedW >= win.minWidth) {
          newW = calculatedW;
          newX = startX + dx;
        }
      }
      if (direction.includes('s')) {
        newH = Math.max(win.minHeight, startH + dy);
      }
      if (direction.includes('n')) {
        const calculatedH = startH - dy;
        if (calculatedH >= win.minHeight) {
          newH = calculatedH;
          newY = startY + dy;
        }
      }

      onUpdateBounds({ x: newX, y: newY, width: newW, height: newH });
    };

    const onPointerEnd = () => {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerEnd);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerEnd);
      window.removeEventListener('touchcancel', onPointerEnd);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerEnd);
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerEnd);
    window.addEventListener('touchcancel', onPointerEnd);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerEnd);
    window.addEventListener('pointercancel', onPointerEnd);
  };

  // Quick step resize buttons (+ / -)
  const handleScaleWindow = (deltaW: number, deltaH: number) => {
    sound.playClick();
    const newW = Math.max(win.minWidth, Math.min(window.innerWidth - 30, win.width + deltaW));
    const newH = Math.max(win.minHeight, Math.min(window.innerHeight - 80, win.height + deltaH));
    const newX = Math.max(10, Math.min(window.innerWidth - newW - 10, win.x - deltaW / 2));
    const newY = Math.max(36, Math.min(window.innerHeight - newH - 50, win.y - deltaH / 2));
    onUpdateBounds({ x: newX, y: newY, width: newW, height: newH });
  };

  if (win.isMinimized) {
    return null;
  }

  const opacity = win.glassOpacity ?? 0.16;

  return (
    <div
      onMouseDown={onFocus}
      onTouchStart={onFocus}
      style={{
        transform: `translate3d(${win.x}px, ${win.y}px, 0)`,
        width: `${win.width}px`,
        height: `${win.height}px`,
        zIndex: win.zIndex,
        backgroundColor: `rgba(10, 16, 28, ${opacity})`,
      }}
      className={`absolute top-0 left-0 pointer-events-auto rounded-2xl flex flex-col overflow-hidden transition-shadow duration-150 border backdrop-blur-2xl ${
        isActive
          ? 'border-white/30 shadow-[0_24px_64px_-10px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-white/10'
          : 'border-white/14 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.45)] opacity-95'
      }`}
    >
      {/* Specular Rim Sheen */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-10" />

      {/* GNOME HeaderBar - Draggable via Mouse, Touch & Finger */}
      <header
        onMouseDown={handleStartDrag}
        onTouchStart={handleStartDrag}
        onDoubleClick={onMaximize}
        style={{ touchAction: 'none' }}
        className={`h-11 px-3 flex items-center justify-between select-none shrink-0 transition-colors relative touch-none ${
          isDraggingNow ? 'cursor-grabbing' : 'cursor-grab'
        } ${isActive ? 'bg-white/[0.08] border-b border-white/12' : 'bg-white/[0.03] border-b border-white/8'}`}
      >
        {/* Left: Quick Scale & Opacity Tools */}
        <div className="flex items-center gap-1 z-10" data-no-drag>
          <button
            onClick={(e) => { e.stopPropagation(); handleScaleWindow(-120, -80); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Compact Size (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleScaleWindow(120, 80); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Expand Size (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Opacity slider dropdown */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowOpacitySlider(!showOpacitySlider); }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                showOpacitySlider ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title="Window Translucency"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {showOpacitySlider && (
              <div 
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="absolute left-0 top-9 z-50 p-2.5 rounded-xl bg-slate-900/95 border border-white/20 shadow-2xl backdrop-blur-2xl flex items-center gap-2 text-xs text-slate-300 w-44"
              >
                <span className="text-[10px] text-slate-400">Glass:</span>
                <input
                  type="range"
                  min="6"
                  max="50"
                  value={Math.round(opacity * 100)}
                  onChange={(e) => onUpdateOpacity(Number(e.target.value) / 100)}
                  className="w-full accent-sky-400 h-1 bg-white/20 rounded cursor-pointer"
                />
                <span className="font-mono text-[10px] tabular-nums text-slate-400 w-6">
                  {Math.round(opacity * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Center: GNOME Centered Window Title & Icon (Clicks pass through to header for easy dragging) */}
        <div className="absolute inset-x-24 inset-y-0 flex items-center justify-center gap-2 text-xs font-semibold text-slate-200 tracking-tight truncate pointer-events-none">
          <div className="w-4 h-4 shrink-0">
            <AppGlassIcon appId={win.appId} size={16} />
          </div>
          <span className="truncate">{win.title}</span>
        </div>

        {/* Right: GNOME Action Buttons (Minimize, Maximize, Close) */}
        <div className="flex items-center gap-1.5 z-10" data-no-drag>
          <button
            onClick={(e) => { e.stopPropagation(); sound.playWindowClose(); onMinimize(); }}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Minimize"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); sound.playClick(); onMaximize(); }}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title={win.isMaximized ? "Restore" : "Maximize"}
          >
            {win.isMaximized ? (
              <Copy className="w-3 h-3" />
            ) : (
              <Square className="w-2.5 h-2.5" />
            )}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); sound.playWindowClose(); onClose(); }}
            className="w-7 h-7 rounded-full bg-white/8 hover:bg-rose-500 hover:text-white text-slate-300 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            title="Close"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Main App Content Viewport */}
      <div className="flex-1 overflow-hidden relative flex flex-col pointer-events-auto">
        {children}
      </div>

      {/* 8-Directional Resizing Borders & Corners (Touch-Action: None, Generous Hit Zones) */}
      {!win.isMaximized && (
        <>
          {/* North */}
          <div
            onMouseDown={(e) => handleStartResize(e, 'n')}
            onTouchStart={(e) => handleStartResize(e, 'n')}
            style={{ touchAction: 'none' }}
            className="absolute top-0 inset-x-3 h-3 cursor-ns-resize hover:bg-white/10 active:bg-sky-400/20 transition-colors z-20 touch-none"
          />
          {/* South */}
          <div
            onMouseDown={(e) => handleStartResize(e, 's')}
            onTouchStart={(e) => handleStartResize(e, 's')}
            style={{ touchAction: 'none' }}
            className="absolute bottom-0 inset-x-3 h-3 cursor-ns-resize hover:bg-white/10 active:bg-sky-400/20 transition-colors z-20 touch-none"
          />
          {/* West */}
          <div
            onMouseDown={(e) => handleStartResize(e, 'w')}
            onTouchStart={(e) => handleStartResize(e, 'w')}
            style={{ touchAction: 'none' }}
            className="absolute left-0 inset-y-3 w-3 cursor-ew-resize hover:bg-white/10 active:bg-sky-400/20 transition-colors z-20 touch-none"
          />
          {/* East */}
          <div
            onMouseDown={(e) => handleStartResize(e, 'e')}
            onTouchStart={(e) => handleStartResize(e, 'e')}
            style={{ touchAction: 'none' }}
            className="absolute right-0 inset-y-3 w-3 cursor-ew-resize hover:bg-white/10 active:bg-sky-400/20 transition-colors z-20 touch-none"
          />
          {/* North-West */}
          <div
            onMouseDown={(e) => handleStartResize(e, 'nw')}
            onTouchStart={(e) => handleStartResize(e, 'nw')}
            style={{ touchAction: 'none' }}
            className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize hover:bg-white/20 active:bg-sky-400/30 rounded-tl-xl z-20 touch-none"
          />
          {/* North-East */}
          <div
            onMouseDown={(e) => handleStartResize(e, 'ne')}
            onTouchStart={(e) => handleStartResize(e, 'ne')}
            style={{ touchAction: 'none' }}
            className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize hover:bg-white/20 active:bg-sky-400/30 rounded-tr-xl z-20 touch-none"
          />
          {/* South-West */}
          <div
            onMouseDown={(e) => handleStartResize(e, 'sw')}
            onTouchStart={(e) => handleStartResize(e, 'sw')}
            style={{ touchAction: 'none' }}
            className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize hover:bg-white/20 active:bg-sky-400/30 rounded-bl-xl z-20 touch-none"
          />
          {/* South-East (with tactile ridges) */}
          <div
            onMouseDown={(e) => handleStartResize(e, 'se')}
            onTouchStart={(e) => handleStartResize(e, 'se')}
            style={{ touchAction: 'none' }}
            className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize flex items-end justify-end p-1 text-white/30 hover:text-white/80 active:text-sky-300 z-20 touch-none"
          >
            <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor">
              <circle cx="5" cy="5" r="1" /><circle cx="1" cy="5" r="1" /><circle cx="5" cy="1" r="1" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
};
