import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ArrowRight,
  Command,
  Calculator as CalcIcon,
  Folder,
  FileText
} from 'lucide-react';
import { AppId, VirtualFile } from '../../types/os';
import { sound } from '../../utils/sound';
import { AppGlassIcon } from './LiquidIcons';

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  files: VirtualFile[];
  onOpenApp: (appId: AppId) => void;
  onOpenFile: (file: VirtualFile) => void;
  onExecuteCommand?: (cmd: string) => void;
}

interface SearchResult {
  id: string;
  type: 'app' | 'file' | 'calc';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
}

export const SpotlightSearch: React.FC<SpotlightProps> = ({
  isOpen,
  onClose,
  files,
  onOpenApp,
  onOpenFile,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const appResults: SearchResult[] = [
    { id: 'app-matrix', type: 'app', title: 'Matrix AI (Co-Pilot)', subtitle: 'Cybernetic Operating System Intelligence & Gemini Assistant', icon: <AppGlassIcon appId="matrix" size={28} />, action: () => onOpenApp('matrix') },
    { id: 'app-word', type: 'app', title: 'Liquid Word (Docs)', subtitle: 'Rich Text Publishing, Tables & Word Documents', icon: <AppGlassIcon appId="word" size={28} />, action: () => onOpenApp('word') },
    { id: 'app-excel', type: 'app', title: 'Liquid Excel (Sheets)', subtitle: 'Formula Engine, Tabular Ledger & CSV Export', icon: <AppGlassIcon appId="excel" size={28} />, action: () => onOpenApp('excel') },
    { id: 'app-powerpoint', type: 'app', title: 'Liquid PowerPoint (Slides)', subtitle: 'Presentation Slide Engine & Presenter View', icon: <AppGlassIcon appId="powerpoint" size={28} />, action: () => onOpenApp('powerpoint') },
    { id: 'app-notion', type: 'app', title: 'Liquid Workspace (Notion)', subtitle: 'Multi-view Kanban Board & Modular Spec Canvas', icon: <AppGlassIcon appId="notion" size={28} />, action: () => onOpenApp('notion') },
    { id: 'app-files', type: 'app', title: 'Liquid Files', subtitle: 'Storage & Document Organizer', icon: <AppGlassIcon appId="files" size={28} />, action: () => onOpenApp('files') },
    { id: 'app-notes', type: 'app', title: 'Liquid Notes', subtitle: 'Distraction-Free Markdown Prose & Specs', icon: <AppGlassIcon appId="notes" size={28} />, action: () => onOpenApp('notes') },
    { id: 'app-studio', type: 'app', title: 'Liquid Studio', subtitle: 'Optical Canvas & Glass Filter Lab', icon: <AppGlassIcon appId="studio" size={28} />, action: () => onOpenApp('studio') },
    { id: 'app-audio', type: 'app', title: 'Ambient Audio Flow', subtitle: 'Procedural Atmospheric Soundscapes', icon: <AppGlassIcon appId="audio" size={28} />, action: () => onOpenApp('audio') },
    { id: 'app-terminal', type: 'app', title: 'Liquid Shell', subtitle: 'Unix Shell & Command Interface', icon: <AppGlassIcon appId="terminal" size={28} />, action: () => onOpenApp('terminal') },
    { id: 'app-calc', type: 'app', title: 'Calculator & Converter', subtitle: 'Scientific Matrix & Unit Converter', icon: <AppGlassIcon appId="calc" size={28} />, action: () => onOpenApp('calc') },
    { id: 'app-gallery', type: 'app', title: 'Visuals Gallery', subtitle: 'Photography & Optical EXIF Inspector', icon: <AppGlassIcon appId="gallery" size={28} />, action: () => onOpenApp('gallery') },
    { id: 'app-settings', type: 'app', title: 'System Preferences', subtitle: 'Fluid Dynamics & Glass Tuner', icon: <AppGlassIcon appId="settings" size={28} />, action: () => onOpenApp('settings') },
  ];

  let results: SearchResult[] = [];
  const q = query.trim().toLowerCase();

  // Math evaluation
  if (/^[\d\s+\-*/().%^]+$/.test(q) && q.length > 2) {
    try {
      // eslint-disable-next-line no-eval
      const mathRes = Function(`"use strict"; return (${q})`)();
      results.push({
        id: 'math-result',
        type: 'calc',
        title: `${mathRes}`,
        subtitle: `Calculated: ${q}`,
        icon: <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 font-mono font-bold text-xs"><CalcIcon className="w-4 h-4" /></div>,
        action: () => {},
      });
    } catch {}
  }

  // Apps match
  const matchedApps = appResults.filter(a => a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q));
  results.push(...matchedApps);

  // Files match
  if (q.length > 0) {
    const matchedFiles = files
      .filter(f => f.name.toLowerCase().includes(q))
      .map((f): SearchResult => ({
        id: `file-${f.id}`,
        type: 'file',
        title: f.name,
        subtitle: `Virtual File · ${f.size} · ${f.updatedAt}`,
        icon: (
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
            {f.type === 'folder' ? <Folder className="w-4 h-4 text-sky-400" /> : <FileText className="w-4 h-4 text-slate-300" />}
          </div>
        ),
        action: () => onOpenFile(f),
      }));
    results.push(...matchedFiles);
  }

  if (!q) {
    results = appResults.slice(0, 5);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(results.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = results[selectedIndex];
      if (current) {
        sound.playClick();
        current.action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity"
      />
      <div className="fixed top-28 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg select-none">
        <div className="liquid-glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/20 p-2">
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-3.5 py-3 border-b border-white/10">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
              onKeyDown={handleKeyDown}
              placeholder="Search apps, files, or evaluate arithmetic..."
              className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:outline-none text-sm font-sans"
            />
            <div className="flex items-center gap-1 text-[10px] text-slate-400 border border-white/10 rounded px-1.5 py-0.5 font-mono">
              <span>ESC</span>
            </div>
          </div>

          {/* Results List */}
          <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
            {results.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No matching results found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sound.playClick();
                      item.action();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                      isSelected
                        ? 'bg-white/15 text-white shadow-xs'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-medium text-white block truncate">{item.title}</span>
                        <span className="text-[11px] text-slate-400 block truncate">{item.subtitle}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer tips */}
          <div className="px-3 py-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Command className="w-3 h-3" />
              <span>Use ↑ ↓ to navigate</span>
            </span>
            <span>Press Enter to launch</span>
          </div>
        </div>
      </div>
    </>
  );
};
