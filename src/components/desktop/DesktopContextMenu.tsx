import React from 'react';
import { 
  FolderPlus, 
  FilePlus, 
  Terminal, 
  Image as ImageIcon, 
  Info, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface DesktopContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onCreateFolder: () => void;
  onCreateNote: () => void;
  onOpenTerminal: () => void;
  onOpenSettings: () => void;
  onChangeWallpaper: () => void;
}

export const DesktopContextMenu: React.FC<DesktopContextMenuProps> = ({
  x,
  y,
  onClose,
  onCreateFolder,
  onCreateNote,
  onOpenTerminal,
  onOpenSettings,
  onChangeWallpaper,
}) => {
  // Constrain to window bounds
  const clampedX = Math.min(x, window.innerWidth - 200);
  const clampedY = Math.min(y, window.innerHeight - 240);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-transparent" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <div
        style={{ left: `${clampedX}px`, top: `${clampedY}px` }}
        className="fixed z-50 w-52 rounded-xl liquid-glass-panel py-1 text-xs text-slate-200 shadow-2xl border border-white/20 select-none animate-in fade-in zoom-in-95 duration-100"
      >
        <button
          onClick={() => { sound.playClick(); onCreateFolder(); onClose(); }}
          className="w-full text-left px-3.5 py-1.5 hover:bg-white/10 flex items-center gap-2.5 text-slate-200 hover:text-white"
        >
          <FolderPlus className="w-4 h-4 text-sky-400" />
          <span>New Folder</span>
        </button>

        <button
          onClick={() => { sound.playClick(); onCreateNote(); onClose(); }}
          className="w-full text-left px-3.5 py-1.5 hover:bg-white/10 flex items-center gap-2.5 text-slate-200 hover:text-white"
        >
          <FilePlus className="w-4 h-4 text-amber-300" />
          <span>New Document</span>
        </button>

        <button
          onClick={() => { sound.playClick(); onOpenTerminal(); onClose(); }}
          className="w-full text-left px-3.5 py-1.5 hover:bg-white/10 flex items-center gap-2.5 text-slate-200 hover:text-white"
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Open Liquid Shell</span>
        </button>

        <div className="h-[1px] bg-white/10 my-1" />

        <button
          onClick={() => { sound.playClick(); onChangeWallpaper(); onClose(); }}
          className="w-full text-left px-3.5 py-1.5 hover:bg-white/10 flex items-center gap-2.5 text-slate-200 hover:text-white"
        >
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>Cycle Fluid Wallpaper</span>
        </button>

        <button
          onClick={() => { sound.playClick(); onOpenSettings(); onClose(); }}
          className="w-full text-left px-3.5 py-1.5 hover:bg-white/10 flex items-center gap-2.5 text-slate-200 hover:text-white"
        >
          <ImageIcon className="w-4 h-4 text-rose-400" />
          <span>Change Wallpaper...</span>
        </button>

        <div className="h-[1px] bg-white/10 my-1" />

        <button
          onClick={() => { sound.playClick(); onOpenSettings(); onClose(); }}
          className="w-full text-left px-3.5 py-1.5 hover:bg-white/10 flex items-center gap-2.5 text-slate-400 hover:text-white"
        >
          <Info className="w-4 h-4 text-slate-400" />
          <span>Get System Info</span>
        </button>
      </div>
    </>
  );
};
