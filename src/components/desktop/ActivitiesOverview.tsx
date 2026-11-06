import React from 'react';
import { 
  Search, 
  X, 
  Plus, 
  Layers, 
  LayoutGrid,
  Check
} from 'lucide-react';
import { WindowInstance, AppId, VirtualFile } from '../../types/os';
import { sound } from '../../utils/sound';
import { AppGlassIcon } from './LiquidIcons';

interface ActivitiesOverviewProps {
  isOpen: boolean;
  onClose: () => void;
  windows: WindowInstance[];
  activeWindowId: string | null;
  onSelectWindow: (id: string) => void;
  onCloseWindow: (id: string) => void;
  workspaces: number[];
  currentWorkspace: number;
  onSelectWorkspace: (ws: number) => void;
  onOpenAppGrid: () => void;
  onLaunchApp: (appId: AppId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ActivitiesOverview: React.FC<ActivitiesOverviewProps> = ({
  isOpen,
  onClose,
  windows,
  activeWindowId,
  onSelectWindow,
  onCloseWindow,
  workspaces,
  currentWorkspace,
  onSelectWorkspace,
  onOpenAppGrid,
  onLaunchApp,
  searchQuery,
  onSearchChange,
}) => {
  if (!isOpen) return null;

  const currentWorkspaceWindows = windows.filter(w => !w.isMinimized);

  return (
    <div 
      onClick={(e) => {
        // Clicking backdrop closes activities overview
        if (e.target === e.currentTarget) {
          sound.playClick();
          onClose();
        }
      }}
      className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-2xl flex flex-col items-center justify-between pt-12 pb-6 px-8 select-none animate-in fade-in duration-200"
    >
      {/* Top: GNOME Search Bar */}
      <div className="w-full max-w-lg relative mb-4">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Type to search apps, files, or settings..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          autoFocus
          className="w-full h-10 pl-10 pr-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-sky-400 focus:bg-white/15 transition-all shadow-lg"
        />
      </div>

      {/* Workspace Pager Strip (GNOME signature) */}
      <div className="flex items-center gap-3 mb-4 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        {workspaces.map((ws) => {
          const isActive = ws === currentWorkspace;
          return (
            <button
              key={ws}
              onClick={() => {
                sound.playClick();
                onSelectWorkspace(ws);
              }}
              className={`h-14 w-24 rounded-xl border flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-sky-500/20 border-sky-400 ring-2 ring-sky-400/40 shadow-lg scale-105'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-1 mb-1">
                <span className="text-[11px] font-medium text-white">Desktop {ws + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                {windows.filter(w => !w.isMinimized).slice(0, 3).map((w) => (
                  <div key={w.id} className="w-3 h-2 rounded-xs bg-white/30" />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Center: Live Window Exposé Grid */}
      <div className="flex-1 w-full max-w-5xl flex items-center justify-center p-4">
        {currentWorkspaceWindows.length === 0 ? (
          <div className="text-center text-slate-400">
            <Layers className="w-12 h-12 stroke-1 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-medium">No open windows on this workspace</p>
            <p className="text-xs text-slate-500 mt-0.5">Launch apps from the Dash below or press Escape to return.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-h-[50vh] overflow-y-auto p-2">
            {currentWorkspaceWindows.map((win) => {
              const isWinActive = win.id === activeWindowId;
              return (
                <div
                  key={win.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectWindow(win.id);
                    onClose();
                  }}
                  className={`group relative rounded-2xl border p-3 flex flex-col bg-slate-900/80 backdrop-blur-xl shadow-2xl cursor-pointer transition-all hover:scale-105 ${
                    isWinActive
                      ? 'border-sky-400/80 ring-2 ring-sky-400/30'
                      : 'border-white/15 hover:border-white/30'
                  }`}
                >
                  {/* Top Bar of Preview */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-4 h-4 shrink-0">
                        <AppGlassIcon appId={win.appId} size={16} />
                      </div>
                      <span className="text-xs font-semibold text-white truncate">{win.title}</span>
                    </div>

                    {/* GNOME style close button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playWindowClose();
                        onCloseWindow(win.id);
                      }}
                      className="w-5 h-5 rounded-full bg-white/10 hover:bg-rose-500 hover:text-white text-slate-400 flex items-center justify-center transition-colors"
                      title="Close Window"
                    >
                      <X className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Window Content Silhouette Preview */}
                  <div className="flex-1 min-h-[120px] rounded-xl bg-white/[0.04] border border-white/8 p-3 flex flex-col justify-between overflow-hidden">
                    <div className="space-y-1.5 opacity-60">
                      <div className="w-2/3 h-2 bg-white/20 rounded-full" />
                      <div className="w-1/2 h-1.5 bg-white/15 rounded-full" />
                      <div className="w-3/4 h-1.5 bg-white/10 rounded-full" />
                    </div>
                    <div className="flex justify-end items-center gap-1.5 pt-2">
                      <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                        {win.width}×{win.height}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom: GNOME Dash Container (Centrally Floating) */}
      <div className="mt-auto">
        <div className="liquid-glass-dock px-3 py-2 rounded-2xl flex items-center gap-2.5 shadow-2xl">
          {[
            { id: 'matrix', name: 'Matrix AI' },
            { id: 'word', name: 'Word Docs' },
            { id: 'excel', name: 'Excel Sheets' },
            { id: 'powerpoint', name: 'PowerPoint' },
            { id: 'notion', name: 'Notion Workspace' },
            { id: 'files', name: 'Files' },
            { id: 'notes', name: 'Notes' },
            { id: 'studio', name: 'Studio' },
            { id: 'audio', name: 'Sound Flow' },
            { id: 'terminal', name: 'Terminal' },
            { id: 'calc', name: 'Calculator' },
            { id: 'gallery', name: 'Gallery' },
            { id: 'settings', name: 'Settings' },
          ].map((app) => {
            const isOpen = windows.some(w => w.appId === app.id);
            return (
              <button
                key={app.id}
                onClick={() => {
                  sound.playClick();
                  onLaunchApp(app.id as AppId);
                  onClose();
                }}
                className="group relative w-11 h-11 flex items-center justify-center rounded-xl hover:scale-110 active:scale-95 transition-all"
                title={app.name}
              >
                <AppGlassIcon appId={app.id as AppId} size={42} />
                {isOpen && (
                  <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-sky-400 shadow-xs" />
                )}
              </button>
            );
          })}

          <div className="w-[1px] h-7 bg-white/20 mx-1" />

          {/* GNOME Signature 9-Dots "Show Applications" Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAppGrid();
            }}
            className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 shadow-md"
            title="Show All Applications"
          >
            <LayoutGrid className="w-5 h-5 text-slate-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
