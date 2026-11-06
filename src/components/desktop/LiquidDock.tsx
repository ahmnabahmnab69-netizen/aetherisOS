import React, { useState, useRef } from 'react';
import { AppId, WindowInstance } from '../../types/os';
import { sound } from '../../utils/sound';
import { AppGlassIcon, TrashGlassIcon } from './LiquidIcons';

interface DockProps {
  openWindows: WindowInstance[];
  activeWindowId: string | null;
  onLaunchApp: (appId: AppId) => void;
  onRestoreWindow: (windowId: string) => void;
  dockMagnification?: boolean;
}

interface DockItem {
  id: AppId;
  name: string;
}

export const LiquidDock: React.FC<DockProps> = ({
  openWindows,
  activeWindowId,
  onLaunchApp,
  onRestoreWindow,
  dockMagnification = true,
}) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement | null>(null);

  const dockApps: DockItem[] = [
    { id: 'matrix', name: 'Matrix AI Co-Pilot' },
    { id: 'files', name: 'Liquid Files' },
    { id: 'word', name: 'Liquid Docs (Word)' },
    { id: 'excel', name: 'Liquid Sheets (Excel)' },
    { id: 'powerpoint', name: 'Liquid Slides (PowerPoint)' },
    { id: 'notion', name: 'Liquid Workspace (Notion)' },
    { id: 'studio', name: 'Liquid Studio' },
    { id: 'notes', name: 'Liquid Notes' },
    { id: 'audio', name: 'Ambient Sound' },
    { id: 'terminal', name: 'Liquid Shell' },
    { id: 'calc', name: 'Calculator' },
    { id: 'gallery', name: 'Visuals Gallery' },
    { id: 'settings', name: 'Preferences' },
  ];

  const calculateScale = (itemIndex: number, totalItems: number) => {
    if (!dockMagnification || mouseX === null || !dockRef.current) return 1;
    const rect = dockRef.current.getBoundingClientRect();
    const itemWidth = rect.width / totalItems;
    const itemCenter = itemIndex * itemWidth + itemWidth / 2;
    const dist = Math.abs(mouseX - itemCenter);
    const maxDist = 110;
    if (dist < maxDist) {
      return 1 + (1 - dist / maxDist) * 0.35;
    }
    return 1;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      setMouseX(e.clientX - rect.left);
    }
  };

  const handleMouseLeave = () => {
    setMouseX(null);
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 select-none max-w-[95vw]">
      <div
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="liquid-glass-dock px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-2xl relative overflow-x-auto"
      >
        <div className="absolute inset-x-3 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

        {dockApps.map((item, idx) => {
          const isOpen = openWindows.some(w => w.appId === item.id);
          const isActive = openWindows.some(w => w.appId === item.id && w.id === activeWindowId);
          const scale = calculateScale(idx, dockApps.length + 1);

          return (
            <div key={item.id} className="relative group/dock flex flex-col items-center shrink-0">
              <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-slate-950/90 text-white text-[11px] font-medium border border-white/20 opacity-0 group-hover/dock:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl backdrop-blur-md z-50">
                {item.name}
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  const minWin = openWindows.find(w => w.appId === item.id && w.isMinimized);
                  if (minWin) {
                    onRestoreWindow(minWin.id);
                  } else {
                    onLaunchApp(item.id);
                  }
                }}
                style={{
                  transform: `scale(${scale})`,
                  transition: mouseX !== null ? 'transform 0.08s ease-out' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="w-11 h-11 flex items-center justify-center cursor-pointer active:scale-90 transition-all rounded-xl focus:outline-none"
              >
                <AppGlassIcon appId={item.id} size={44} />
              </button>

              <div className="h-1 flex items-center justify-center mt-0.5">
                {isOpen && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      isActive ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]' : 'bg-white/40'
                    }`}
                  />
                )}
              </div>
            </div>
          );
        })}

        <div className="w-[1px] h-7 bg-white/15 mx-1 shrink-0" />

        <div className="relative group/dock flex flex-col items-center shrink-0">
          <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-slate-950/90 text-white text-[11px] font-medium border border-white/20 opacity-0 group-hover/dock:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl backdrop-blur-md">
            Trash
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onLaunchApp('files');
            }}
            className="w-11 h-11 flex items-center justify-center cursor-pointer active:scale-90 transition-all rounded-xl"
          >
            <TrashGlassIcon size={44} />
          </button>
          <div className="h-1 mt-0.5" />
        </div>
      </div>
    </div>
  );
};
