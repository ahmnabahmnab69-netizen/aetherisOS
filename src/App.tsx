import React, { useState, useEffect, useCallback } from 'react';
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Upload,
  Sparkles,
  LayoutGrid
} from 'lucide-react';

import { AppId, WindowInstance, VirtualFile, SystemSettings, WallpaperPreset } from './types/os';
import { INITIAL_FILES } from './utils/initialFiles';
import { sound } from './utils/sound';

import { FluidCanvas } from './components/desktop/FluidCanvas';
import { GnomeTopBar } from './components/desktop/GnomeTopBar';
import { ActivitiesOverview } from './components/desktop/ActivitiesOverview';
import { GnomeAppGrid } from './components/desktop/GnomeAppGrid';
import { LiquidDock } from './components/desktop/LiquidDock';
import { WindowFrame } from './components/desktop/WindowFrame';
import { ControlCenter } from './components/desktop/ControlCenter';
import { SpotlightSearch } from './components/desktop/SpotlightSearch';
import { DesktopContextMenu } from './components/desktop/DesktopContextMenu';
import { 
  AppGlassIcon, 
  FilesGlassIcon, 
  NotesGlassIcon, 
  GalleryGlassIcon,
  WordGlassIcon,
  ExcelGlassIcon,
  PowerPointGlassIcon,
  NotionGlassIcon
} from './components/desktop/LiquidIcons';

import { FilesApp } from './components/apps/FilesApp';
import { NotesApp } from './components/apps/NotesApp';
import { StudioApp } from './components/apps/StudioApp';
import { AudioApp } from './components/apps/AudioApp';
import { TerminalApp } from './components/apps/TerminalApp';
import { CalculatorApp } from './components/apps/CalculatorApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { GalleryApp } from './components/apps/GalleryApp';
import { WordApp } from './components/apps/WordApp';
import { ExcelApp } from './components/apps/ExcelApp';
import { PowerPointApp } from './components/apps/PowerPointApp';
import { NotionApp } from './components/apps/NotionApp';
import { MatrixApp } from './components/apps/MatrixApp';

const STORAGE_KEY_FILES = 'aetheris_gnome_files_v1';
const STORAGE_KEY_SETTINGS = 'aetheris_gnome_settings_v1';

export default function App() {
  // 1. Files state with LocalStorage persistence
  const [files, setFiles] = useState<VirtualFile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FILES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_FILES;
  });

  const handleUpdateFiles = useCallback((newFiles: VirtualFile[]) => {
    setFiles(newFiles);
    try {
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(newFiles));
    } catch {}
  }, []);

  // 2. Settings state
  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      wallpaper: 'fluid-opaline',
      glassBlur: 28,
      glassOpacity: 0.16,
      specularSheen: 0.32,
      soundEnabled: true,
      dockMagnification: true,
      clockFormat24h: false,
      fluidInteractive: true,
    };
  });

  const handleUpdateSettings = useCallback((newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--glass-blur', `${settings.glassBlur}px`);
    document.documentElement.style.setProperty('--glass-opacity', `${settings.glassOpacity}`);
    document.documentElement.style.setProperty('--specular-opacity', `${settings.specularSheen}`);
  }, [settings.glassBlur, settings.glassOpacity, settings.specularSheen]);

  // 3. GNOME Workspaces & Activities State
  const [workspaces, setWorkspaces] = useState<number[]>([0, 1]);
  const [currentWorkspace, setCurrentWorkspace] = useState<number>(0);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [appGridOpen, setAppGridOpen] = useState(false);
  const [activitiesSearch, setActivitiesSearch] = useState('');

  // 4. Window Manager State
  const [windows, setWindows] = useState<WindowInstance[]>(() => {
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 900;

    return [
      {
        id: 'win-notes-init',
        appId: 'notes',
        title: 'Welcome to Aetheris.md',
        x: Math.max(30, (screenW - 780) / 2 - 120),
        y: Math.max(50, (screenH - 520) / 2 - 40),
        width: 760,
        height: 520,
        minWidth: 460,
        minHeight: 340,
        isMinimized: false,
        isMaximized: false,
        zIndex: 10,
        glassOpacity: 0.18,
      },
      {
        id: 'win-files-init',
        appId: 'files',
        title: 'Liquid Files',
        x: Math.max(50, (screenW - 680) / 2 + 180),
        y: Math.max(70, (screenH - 460) / 2 + 30),
        width: 680,
        height: 480,
        minWidth: 460,
        minHeight: 340,
        isMinimized: false,
        isMaximized: false,
        zIndex: 11,
        glassOpacity: 0.20,
      }
    ];
  });

  const [activeWindowId, setActiveWindowId] = useState<string | null>('win-files-init');
  const [nextZ, setNextZ] = useState(12);

  // 5. Modals & Context Menus
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Desktop selection & drag-and-drop
  const [selectedDesktopFileId, setSelectedDesktopFileId] = useState<string | null>(null);
  const [isDesktopDragOver, setIsDesktopDragOver] = useState(false);

  // Focus Window
  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ } : w))
    );
    setNextZ((z) => z + 1);
  }, [nextZ]);

  // Launch App
  const launchApp = useCallback((appId: AppId, customData?: any) => {
    sound.playWindowOpen();

    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === existing.id
            ? { ...w, isMinimized: false, zIndex: nextZ, customData: customData || w.customData }
            : w
        )
      );
      setActiveWindowId(existing.id);
      setNextZ((z) => z + 1);
      return;
    }

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    let defW = 760;
    let defH = 500;
    let title = 'Application';

    switch (appId) {
      case 'matrix': defW = 760; defH = 620; title = 'Matrix AI — Cybernetic Co-Pilot'; break;
      case 'word': defW = 860; defH = 580; title = 'Liquid Word — Document Editor'; break;
      case 'excel': defW = 880; defH = 560; title = 'Liquid Excel — Spreadsheets & Formulas'; break;
      case 'powerpoint': defW = 900; defH = 580; title = 'Liquid PowerPoint — Slide Deck'; break;
      case 'notion': defW = 880; defH = 580; title = 'Liquid Workspace — Projects & Kanban'; break;
      case 'files': defW = 820; defH = 520; title = 'Liquid Files'; break;
      case 'notes': defW = 760; defH = 540; title = 'Liquid Notes'; break;
      case 'studio': defW = 920; defH = 600; title = 'Liquid Studio'; break;
      case 'audio': defW = 560; defH = 500; title = 'Ambient Flow'; break;
      case 'terminal': defW = 680; defH = 440; title = 'Liquid Shell'; break;
      case 'calc': defW = 380; defH = 520; title = 'Calculator & Converter'; break;
      case 'settings': defW = 700; defH = 540; title = 'System Preferences'; break;
      case 'gallery': defW = 860; defH = 560; title = 'Visuals Gallery'; break;
    }

    const offset = (windows.length % 5) * 26;
    const x = Math.max(30, (screenW - defW) / 2 + offset);
    const y = Math.max(50, (screenH - defH) / 2 + offset);

    const newWin: WindowInstance = {
      id: `win-${appId}-${Date.now()}`,
      appId,
      title,
      x,
      y,
      width: defW,
      height: defH,
      minWidth: Math.min(360, defW),
      minHeight: Math.min(320, defH),
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZ,
      glassOpacity: settings.glassOpacity,
      customData,
    };

    setWindows((prev) => [...prev, newWin]);
    setActiveWindowId(newWin.id);
    setNextZ((z) => z + 1);
  }, [windows, nextZ, settings.glassOpacity]);

  // Open file handler
  const openFile = useCallback((file: VirtualFile) => {
    const name = file.name.toLowerCase();
    if (file.type === 'sheet' || name.endsWith('.xlsx') || name.endsWith('.csv')) {
      launchApp('excel', { activeFile: file });
    } else if (file.type === 'presentation' || name.endsWith('.pptx') || name.endsWith('.ppt')) {
      launchApp('powerpoint', { activeFile: file });
    } else if (name.endsWith('.docx') || name.endsWith('.doc')) {
      launchApp('word', { activeFile: file });
    } else if (name.endsWith('.notion')) {
      launchApp('notion', { activeFile: file });
    } else if (file.type === 'document' || file.type === 'code') {
      launchApp('notes', { activeFile: file });
    } else if (file.type === 'image') {
      launchApp('gallery', { activeFile: file });
    } else if (file.type === 'folder') {
      launchApp('files', { folderId: file.id });
    }
  }, [launchApp]);

  // Window controls
  const closeWindow = useCallback((id: string) => {
    sound.playWindowClose();
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id);
      if (remaining.length > 0) {
        setActiveWindowId(remaining[remaining.length - 1].id);
      } else {
        setActiveWindowId(null);
      }
    }
  }, [activeWindowId, windows]);

  const minimizeWindow = useCallback((id: string) => {
    sound.playWindowClose();
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id && !w.isMinimized);
      if (remaining.length > 0) {
        setActiveWindowId(remaining[remaining.length - 1].id);
      } else {
        setActiveWindowId(null);
      }
    }
  }, [activeWindowId, windows]);

  const maximizeWindow = useCallback((id: string) => {
    sound.playClick();
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.isMaximized) {
          const prevB = w.preMaximizeBounds || { x: 100, y: 100, width: 720, height: 480 };
          return {
            ...w,
            isMaximized: false,
            x: prevB.x,
            y: prevB.y,
            width: prevB.width,
            height: prevB.height,
          };
        } else {
          return {
            ...w,
            isMaximized: true,
            preMaximizeBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
            x: 8,
            y: 36,
            width: window.innerWidth - 16,
            height: window.innerHeight - 95,
          };
        }
      })
    );
  }, []);

  const updateWindowBounds = useCallback((id: string, bounds: { x: number; y: number; width: number; height: number }) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...bounds, isMaximized: false } : w))
    );
  }, []);

  const updateWindowOpacity = useCallback((id: string, opacity: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, glassOpacity: opacity } : w))
    );
  }, []);

  // Desktop Drag & Drop (External files from user PC)
  const handleDesktopDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDesktopDragOver(true);
  };

  const handleDesktopDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDesktopDragOver(false);
    }
  };

  const handleDesktopDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDesktopDragOver(false);

    const internalFileId = e.dataTransfer.getData('text/plain');
    if (internalFileId) {
      sound.playClick();
      handleUpdateFiles(
        files.map(f => (f.id === internalFileId ? { ...f, parentId: null } : f))
      );
      return;
    }

    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles || droppedFiles.length === 0) return;

    sound.playNotification();
    Array.from(droppedFiles).forEach(file => {
      const reader = new FileReader();
      const isImg = file.type.startsWith('image/');
      reader.onload = () => {
        const result = reader.result as string;
        const newFile: VirtualFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          type: isImg ? 'image' : file.name.endsWith('.ts') || file.name.endsWith('.js') ? 'code' : 'document',
          parentId: null,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          updatedAt: 'Just now',
          content: !isImg ? result : undefined,
          previewUrl: isImg ? result : undefined,
        };
        handleUpdateFiles([...files, newFile]);
      };

      if (isImg) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  // GNOME Super key / Meta key / Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // GNOME Super key (Windows key) toggles Activities
      if (e.key === 'Meta' || e.key === 'OS' || (e.altKey && e.key === 'F1')) {
        e.preventDefault();
        sound.playClick();
        setActivitiesOpen(prev => !prev);
        setAppGridOpen(false);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        sound.playClick();
        setSpotlightOpen(open => !open);
      } else if (e.key === 'Escape') {
        if (appGridOpen) {
          setAppGridOpen(false);
        } else if (activitiesOpen) {
          setActivitiesOpen(false);
        } else {
          setSpotlightOpen(false);
          setQuickSettingsOpen(false);
          setContextMenu(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activitiesOpen, appGridOpen]);

  const handleRestartSystem = useCallback(() => {
    sound.playNotification();
    localStorage.removeItem(STORAGE_KEY_FILES);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    setFiles(INITIAL_FILES);
    setSettings({
      wallpaper: 'fluid-opaline',
      glassBlur: 28,
      glassOpacity: 0.16,
      specularSheen: 0.32,
      soundEnabled: true,
      dockMagnification: true,
      clockFormat24h: false,
      fluidInteractive: true,
    });
    setWindows([]);
  }, []);

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.absolute.top-0.left-0')) return;
    e.preventDefault();
    sound.playClick();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleDesktopMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button, header, input, .liquid-glass-dock')) return;
    setSelectedDesktopFileId(null);
    setContextMenu(null);
    setQuickSettingsOpen(false);
  };

  const renderAppContent = (win: WindowInstance) => {
    switch (win.appId) {
      case 'matrix':
        return <MatrixApp onLaunchApp={launchApp} />;
      case 'word':
        return <WordApp />;
      case 'excel':
        return <ExcelApp />;
      case 'powerpoint':
        return <PowerPointApp />;
      case 'notion':
        return <NotionApp />;
      case 'files':
        return (
          <FilesApp
            files={files}
            onUpdateFiles={handleUpdateFiles}
            onOpenFile={openFile}
          />
        );
      case 'notes':
        return (
          <NotesApp
            initialFile={win.customData?.activeFile}
            files={files}
            onUpdateFiles={handleUpdateFiles}
          />
        );
      case 'studio':
        return <StudioApp />;
      case 'audio':
        return <AudioApp />;
      case 'terminal':
        return (
          <TerminalApp
            files={files}
            onUpdateFiles={handleUpdateFiles}
            onSetWallpaper={(theme) => handleUpdateSettings({ wallpaper: theme })}
            onToggleSound={(enabled) => handleUpdateSettings({ soundEnabled: enabled })}
          />
        );
      case 'calc':
        return <CalculatorApp />;
      case 'settings':
        return (
          <SettingsApp
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        );
      case 'gallery':
        return <GalleryApp />;
      default:
        return null;
    }
  };

  const getDesktopIcon = (item: VirtualFile) => {
    const name = item.name.toLowerCase();
    if (item.type === 'folder') return <FilesGlassIcon size={46} />;
    if (item.type === 'sheet' || name.endsWith('.xlsx') || name.endsWith('.csv')) {
      return <ExcelGlassIcon size={46} />;
    }
    if (item.type === 'presentation' || name.endsWith('.pptx') || name.endsWith('.ppt')) {
      return <PowerPointGlassIcon size={46} />;
    }
    if (name.endsWith('.docx') || name.endsWith('.doc')) {
      return <WordGlassIcon size={46} />;
    }
    if (name.endsWith('.notion')) {
      return <NotionGlassIcon size={46} />;
    }
    if (item.type === 'image') return <GalleryGlassIcon size={46} />;
    return <NotesGlassIcon size={46} />;
  };

  const activeWindow = windows.find((w) => w.id === activeWindowId) || null;
  const desktopItems = files.filter((f) => f.parentId === null);

  return (
    <div
      onContextMenu={handleDesktopContextMenu}
      onMouseDown={handleDesktopMouseDown}
      onDragOver={handleDesktopDragOver}
      onDragLeave={handleDesktopDragLeave}
      onDrop={handleDesktopDrop}
      className="relative w-screen h-screen overflow-hidden select-none bg-slate-950 font-sans"
    >
      {/* 1. Dynamic 60fps Liquid Fluid Canvas Background */}
      <FluidCanvas
        preset={settings.wallpaper}
        interactive={settings.fluidInteractive}
      />

      {/* Desktop External Drag-and-drop indicator */}
      {isDesktopDragOver && (
        <div className="absolute inset-0 z-30 bg-sky-500/15 backdrop-blur-xs border-4 border-dashed border-sky-400/60 flex flex-col items-center justify-center pointer-events-none">
          <Upload className="w-16 h-16 text-sky-300 animate-bounce mb-3" />
          <h3 className="text-xl font-bold text-white tracking-tight">Drop files onto Aetheris Desktop</h3>
          <p className="text-sm text-sky-200 mt-1">Files will be added directly into your workspace</p>
        </div>
      )}

      {/* 2. Desktop Items Grid (GNOME clean desktop with bespoke liquid glass icons) */}
      <div className="absolute top-12 right-6 z-10 flex flex-col gap-3 items-end pointer-events-auto">
        {desktopItems.map((item) => {
          const isSelected = selectedDesktopFileId === item.id;
          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', item.id);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                setSelectedDesktopFileId(item.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                openFile(item);
              }}
              className={`group flex flex-col items-center justify-center w-24 p-2 rounded-xl transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white/20 border border-white/30 backdrop-blur-md shadow-lg ring-1 ring-white/20'
                  : 'hover:bg-white/10 hover:border hover:border-white/15'
              }`}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1 drop-shadow-md">
                {getDesktopIcon(item)}
              </div>
              <span className="text-xs font-medium text-slate-100 text-center truncate max-w-full drop-shadow-md group-hover:text-white px-1">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* 3. Windows Layer */}
      <div className={`absolute inset-0 pointer-events-none z-20 transition-all duration-200 ${activitiesOpen ? 'scale-90 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        {windows.map((win) => (
          <WindowFrame
            key={win.id}
            window={win}
            isActive={win.id === activeWindowId}
            onFocus={() => focusWindow(win.id)}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => maximizeWindow(win.id)}
            onUpdateBounds={(b) => updateWindowBounds(win.id, b)}
            onUpdateOpacity={(o) => updateWindowOpacity(win.id, o)}
          >
            {renderAppContent(win)}
          </WindowFrame>
        ))}
      </div>

      {/* 4. GNOME Top Bar */}
      <GnomeTopBar
        activeWindow={activeWindow}
        activitiesOpen={activitiesOpen}
        onToggleActivities={() => setActivitiesOpen(open => !open)}
        onOpenApp={launchApp}
        onToggleQuickSettings={() => setQuickSettingsOpen(open => !open)}
        quickSettingsOpen={quickSettingsOpen}
        clock24h={settings.clockFormat24h}
      />

      {/* 5. GNOME Dash / Suspended Liquid Dock */}
      {!activitiesOpen && (
        <LiquidDock
          openWindows={windows}
          activeWindowId={activeWindowId}
          onLaunchApp={launchApp}
          onRestoreWindow={(winId) => {
            setWindows((prev) =>
              prev.map((w) => (w.id === winId ? { ...w, isMinimized: false } : w))
            );
            focusWindow(winId);
          }}
          dockMagnification={settings.dockMagnification}
        />
      )}

      {/* 6. GNOME Activities Overview Overlay */}
      <ActivitiesOverview
        isOpen={activitiesOpen && !appGridOpen}
        onClose={() => setActivitiesOpen(false)}
        windows={windows}
        activeWindowId={activeWindowId}
        onSelectWindow={focusWindow}
        onCloseWindow={closeWindow}
        workspaces={workspaces}
        currentWorkspace={currentWorkspace}
        onSelectWorkspace={setCurrentWorkspace}
        onOpenAppGrid={() => setAppGridOpen(true)}
        onLaunchApp={launchApp}
        searchQuery={activitiesSearch}
        onSearchChange={setActivitiesSearch}
      />

      {/* 7. GNOME Show Applications 9-Dots Grid */}
      <GnomeAppGrid
        isOpen={appGridOpen}
        onClose={() => {
          setAppGridOpen(false);
          setActivitiesOpen(false);
        }}
        onLaunchApp={launchApp}
      />

      {/* 8. GNOME Quick Settings Panel */}
      <ControlCenter
        isOpen={quickSettingsOpen}
        onClose={() => setQuickSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenApp={launchApp}
        onRestartSystem={handleRestartSystem}
      />

      {/* 9. Spotlight Search */}
      <SpotlightSearch
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        files={files}
        onOpenApp={launchApp}
        onOpenFile={openFile}
      />

      {/* 10. Desktop Context Menu */}
      {contextMenu && (
        <DesktopContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onCreateFolder={() => {
            const count = files.filter((f) => f.parentId === null && f.type === 'folder').length;
            const newFolder: VirtualFile = {
              id: `folder-${Date.now()}`,
              name: `Folder ${count > 0 ? count + 1 : ''}`.trim(),
              type: 'folder',
              parentId: null,
              size: '0 items',
              updatedAt: 'Just now',
            };
            handleUpdateFiles([...files, newFolder]);
          }}
          onCreateNote={() => {
            const count = files.filter((f) => f.type === 'document').length;
            const newDoc: VirtualFile = {
              id: `doc-${Date.now()}`,
              name: `Document ${count + 1}.md`,
              type: 'document',
              parentId: null,
              size: '0.1 KB',
              updatedAt: 'Just now',
              content: '# New Document\n\n- [ ] Task 1',
              tags: ['quick-note'],
            };
            handleUpdateFiles([...files, newDoc]);
            openFile(newDoc);
          }}
          onOpenTerminal={() => launchApp('terminal')}
          onOpenSettings={() => launchApp('settings')}
          onChangeWallpaper={() => {
            const presets: WallpaperPreset[] = [
              'fluid-opaline',
              'deep-obsidian',
              'solstice-amber',
              'boreal-emerald',
              'crystal-pearl',
            ];
            const currIdx = presets.indexOf(settings.wallpaper);
            const nextPreset = presets[(currIdx + 1) % presets.length];
            handleUpdateSettings({ wallpaper: nextPreset });
          }}
        />
      )}
    </div>
  );
}
