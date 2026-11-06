import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Battery, 
  Volume2, 
  VolumeX, 
  Search, 
  Sliders, 
  Music, 
  Sparkles,
  Command,
  ChevronDown,
  RotateCcw,
  Moon,
  Info
} from 'lucide-react';
import { AppId, WindowInstance } from '../../types/os';
import { sound } from '../../utils/sound';

interface TopMenuBarProps {
  activeWindow: WindowInstance | null;
  onOpenApp: (appId: AppId) => void;
  onToggleControlCenter: () => void;
  onToggleSpotlight: () => void;
  onRestartSystem: () => void;
  clock24h?: boolean;
}

export const TopMenuBar: React.FC<TopMenuBarProps> = ({
  activeWindow,
  onOpenApp,
  onToggleControlCenter,
  onToggleSpotlight,
  onRestartSystem,
  clock24h = false,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [showCalendarFlyout, setShowCalendarFlyout] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isAudioPlaying, setIsAudioPlaying] = useState(sound.isPlayingAmbient());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: !clock24h,
        })
      );
      setDateStr(
        now.toLocaleDateString([], {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [clock24h]);

  // Periodic ambient sound playing check
  useEffect(() => {
    const checkAudio = setInterval(() => {
      setIsAudioPlaying(sound.isPlayingAmbient());
    }, 500);
    return () => clearInterval(checkAudio);
  }, []);

  // Contextual menu items based on active app
  const getContextualMenus = () => {
    if (!activeWindow) {
      return [
        { label: 'File', items: ['New Window', 'Open File...', 'Close All'] },
        { label: 'Edit', items: ['Undo', 'Redo', 'Preferences...'] },
        { label: 'View', items: ['Icons', 'List', 'Refresh Desktop'] },
        { label: 'Window', items: ['Minimize All', 'Bring All to Front'] },
        { label: 'Help', items: ['Aetheris OS Guide', 'Keyboard Shortcuts'] },
      ];
    }

    switch (activeWindow.appId) {
      case 'files':
        return [
          { label: 'File', items: ['New Folder', 'New Document', 'Import File...', 'Close Window'] },
          { label: 'Edit', items: ['Select All', 'Cut', 'Copy', 'Move to Trash'] },
          { label: 'View', items: ['As Grid', 'As List', 'Sort by Name', 'Sort by Date'] },
          { label: 'Go', items: ['Desktop', 'Documents', 'Projects', 'Visuals', 'Trash'] },
        ];
      case 'notes':
        return [
          { label: 'File', items: ['New Note', 'Export Markdown', 'Duplicate', 'Close Window'] },
          { label: 'Edit', items: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste'] },
          { label: 'Format', items: ['Bold', 'Italic', 'Heading 1', 'Heading 2', 'Bulleted List'] },
          { label: 'View', items: ['Toggle Live Preview', 'Word Count Details'] },
        ];
      case 'studio':
        return [
          { label: 'Canvas', items: ['Clear Canvas', 'Invert Colors', 'Export High-Res PNG'] },
          { label: 'Brush', items: ['Fluid Ink', 'Glass Glow', 'Eraser', 'Increase Size'] },
          { label: 'Filters', items: ['Reset Filters', 'Preset Soft Glass', 'Preset Radiant'] },
        ];
      case 'audio':
        return [
          { label: 'Playback', items: ['Play / Pause', 'Next Soundscape', 'Previous Soundscape'] },
          { label: 'Audio FX', items: ['Deep Filter Cutoff', 'Wide Spatial Reverb', 'Reset Equalizer'] },
        ];
      case 'terminal':
        return [
          { label: 'Shell', items: ['Clear Buffer', 'Run Neofetch', 'Show Commands', 'Reset Shell'] },
          { label: 'Edit', items: ['Copy', 'Paste', 'Clear Line'] },
        ];
      default:
        return [
          { label: 'File', items: ['Close Window'] },
          { label: 'Edit', items: ['Copy', 'Paste'] },
          { label: 'Window', items: ['Minimize', 'Zoom'] },
        ];
    }
  };

  const handleMenuClick = (menuLabel: string) => {
    sound.playClick();
    setActiveMenu(activeMenu === menuLabel ? null : menuLabel);
  };

  const handleItemClick = (actionName: string) => {
    sound.playClick();
    setActiveMenu(null);
    if (actionName === 'Preferences...') onOpenApp('settings');
    if (actionName === 'Close Window' && activeWindow) {
      // Handled via window controls
    }
    if (actionName === 'Play / Pause') {
      sound.toggleAmbient();
    }
  };

  const activeAppName = activeWindow 
    ? activeWindow.title.split(' ')[0] 
    : 'Aetheris';

  return (
    <>
      <header className="fixed top-0 inset-x-0 h-8 z-40 bg-slate-950/40 backdrop-blur-2xl border-b border-white/10 px-3 flex items-center justify-between text-xs text-slate-200 select-none shadow-xs">
        {/* Left Zone: Brand & Contextual App Menus */}
        <div className="flex items-center gap-4">
          {/* Apple/System Menu */}
          <div className="relative">
            <button
              onClick={() => handleMenuClick('system')}
              className="flex items-center gap-1.5 font-bold text-white hover:text-sky-300 transition-colors py-1 px-1 rounded"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-400 opacity-90 shadow-sm" />
              <span className="tracking-tight text-xs">Aetheris</span>
            </button>

            {/* System Dropdown */}
            {activeMenu === 'system' && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
                <div className="absolute left-0 top-7 z-50 w-52 rounded-xl liquid-glass-panel py-1 text-xs text-slate-200 shadow-2xl border border-white/15">
                  <button
                    onClick={() => { setActiveMenu(null); onOpenApp('settings'); }}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-white/10 flex items-center justify-between text-slate-200 hover:text-white"
                  >
                    <span>About Aetheris Liquid OS</span>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => { setActiveMenu(null); onOpenApp('settings'); }}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-white/10 flex items-center justify-between text-slate-200 hover:text-white"
                  >
                    <span>System Preferences...</span>
                    <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <div className="h-[1px] bg-white/10 my-1" />
                  <button
                    onClick={() => {
                      setActiveMenu(null);
                      sound.setMuted(!sound.getMuted());
                    }}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-white/10 flex items-center justify-between text-slate-200 hover:text-white"
                  >
                    <span>{sound.getMuted() ? 'Unmute Audio' : 'Mute Audio FX'}</span>
                  </button>
                  <button
                    onClick={() => { setActiveMenu(null); onRestartSystem(); }}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-white/10 flex items-center justify-between text-rose-300 hover:text-rose-200"
                  >
                    <span>Reset Workspace</span>
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Active Application Name */}
          <span className="font-semibold text-white tracking-tight cursor-default">
            {activeAppName}
          </span>

          {/* Contextual Menus */}
          <nav className="hidden sm:flex items-center gap-1 text-slate-300">
            {getContextualMenus().map((menu) => {
              const isMenuOpen = activeMenu === menu.label;
              return (
                <div key={menu.label} className="relative">
                  <button
                    onClick={() => handleMenuClick(menu.label)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      isMenuOpen ? 'bg-white/15 text-white' : 'hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {menu.label}
                  </button>

                  {isMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
                      <div className="absolute left-0 top-6 z-50 w-44 rounded-xl liquid-glass-panel py-1 text-xs text-slate-200 shadow-2xl border border-white/15">
                        {menu.items.map((item) => (
                          <button
                            key={item}
                            onClick={() => handleItemClick(item)}
                            className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors block"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right Zone: System Status & Control Triggers */}
        <div className="flex items-center gap-3">
          {/* Ambient Sound Player Indicator */}
          {isAudioPlaying && (
            <button
              onClick={() => onOpenApp('audio')}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/30 transition-colors animate-pulse"
              title="Ambient Sound Playing"
            >
              <Music className="w-3 h-3" />
              <span className="text-[10px] font-medium hidden md:inline">Flow</span>
            </button>
          )}

          {/* Wi-Fi Indicator */}
          <div className="flex items-center text-slate-300 hover:text-white cursor-default" title="Liquid Network Connected">
            <Wifi className="w-3.5 h-3.5" />
          </div>

          {/* Battery status */}
          <div className="flex items-center gap-1 text-[11px] font-mono tabular-nums text-slate-300" title="Battery 98%">
            <Battery className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">98%</span>
          </div>

          {/* Volume button with dropdown slider */}
          <div className="relative">
            <button
              onClick={() => setShowVolumePopup(!showVolumePopup)}
              className="p-1 rounded text-slate-300 hover:text-white transition-colors"
              title="Volume Control"
            >
              {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {showVolumePopup && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowVolumePopup(false)} />
                <div className="absolute right-0 top-7 z-50 p-3 rounded-xl liquid-glass-panel shadow-2xl border border-white/15 w-44 space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>Volume</span>
                    <span className="font-mono tabular-nums">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full accent-sky-400 h-1 bg-white/20 rounded cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>

          {/* Spotlight Search Icon */}
          <button
            onClick={onToggleSpotlight}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
            title="Spotlight Search (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Liquid Control Center Toggle */}
          <button
            onClick={onToggleControlCenter}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Liquid Control Center"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* Date & Time with interactive calendar drop */}
          <div className="relative">
            <button
              onClick={() => setShowCalendarFlyout(!showCalendarFlyout)}
              className="flex items-center gap-2 px-1.5 py-0.5 rounded text-slate-200 hover:text-white hover:bg-white/10 transition-colors font-mono tabular-nums text-xs"
            >
              <span className="hidden md:inline text-slate-400">{dateStr}</span>
              <span className="font-medium text-white">{timeStr}</span>
            </button>

            {/* Calendar flyout */}
            {showCalendarFlyout && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowCalendarFlyout(false)} />
                <div className="absolute right-0 top-7 z-50 p-4 rounded-2xl liquid-glass-panel shadow-2xl border border-white/15 w-64 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>{new Date().toLocaleDateString([], { month: 'long', year: 'numeric' })}</span>
                    <span className="text-[11px] text-sky-400 font-mono">{timeStr}</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-slate-400">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                      <span key={i} className="py-1 font-semibold">{d}</span>
                    ))}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                      const isToday = d === new Date().getDate();
                      return (
                        <div
                          key={d}
                          className={`py-1 rounded text-center transition-colors ${
                            isToday ? 'bg-sky-500 text-white font-bold shadow-xs' : 'text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {d}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
