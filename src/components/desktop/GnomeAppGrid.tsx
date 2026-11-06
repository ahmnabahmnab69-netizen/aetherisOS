import React from 'react';
import { AppId } from '../../types/os';
import { sound } from '../../utils/sound';
import { AppGlassIcon } from './LiquidIcons';
import { X } from 'lucide-react';

interface GnomeAppGridProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchApp: (appId: AppId) => void;
}

export const GnomeAppGrid: React.FC<GnomeAppGridProps> = ({ isOpen, onClose, onLaunchApp }) => {
  if (!isOpen) return null;

  const allApps: { id: AppId; name: string; category: string }[] = [
    { id: 'matrix', name: 'Matrix AI', category: 'Neural Core & Co-Pilot' },
    { id: 'word', name: 'Word Docs', category: 'Office & Publishing' },
    { id: 'excel', name: 'Excel Sheets', category: 'Finance & Ledger' },
    { id: 'powerpoint', name: 'PowerPoint', category: 'Presentations & Decks' },
    { id: 'notion', name: 'Notion Workspace', category: 'Projects & Kanban' },
    { id: 'studio', name: 'Studio', category: 'Graphics & Ink Lab' },
    { id: 'files', name: 'Files', category: 'System & Storage' },
    { id: 'notes', name: 'Notes', category: 'Markdown Prose' },
    { id: 'audio', name: 'Sound Flow', category: 'Ambient Audio' },
    { id: 'terminal', name: 'Terminal', category: 'Developer CLI' },
    { id: 'calc', name: 'Calculator', category: 'Unit Converter' },
    { id: 'gallery', name: 'Gallery', category: 'Photography' },
    { id: 'settings', name: 'Settings', category: 'System Control' },
  ];

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playClick();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-3xl flex flex-col items-center justify-center p-8 select-none animate-in fade-in zoom-in-95 duration-200"
    >
      <button
        onClick={() => {
          sound.playClick();
          onClose();
        }}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight">Applications & Office Suite</h2>
        <p className="text-xs text-slate-400 mt-1">Aetheris GNOME Shell · Liquid Productivity Environment</p>
      </div>

      {/* 4x3 App Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl w-full max-h-[70vh] overflow-y-auto p-2">
        {allApps.map((app) => (
          <button
            key={app.id}
            onClick={() => {
              sound.playWindowOpen();
              onLaunchApp(app.id);
              onClose();
            }}
            className="group flex flex-col items-center p-3.5 rounded-2xl hover:bg-white/10 transition-all transform hover:-translate-y-1 active:translate-y-0 text-center"
          >
            <div className="w-14 h-14 flex items-center justify-center mb-2.5 drop-shadow-xl group-hover:scale-105 transition-transform">
              <AppGlassIcon appId={app.id} size={56} />
            </div>
            <span className="text-xs font-semibold text-white tracking-tight group-hover:text-sky-300 transition-colors truncate max-w-full">
              {app.name}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 truncate max-w-full">
              {app.category}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-8">
        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
        <div className="w-2 h-2 rounded-full bg-white/30" />
      </div>
    </div>
  );
};
