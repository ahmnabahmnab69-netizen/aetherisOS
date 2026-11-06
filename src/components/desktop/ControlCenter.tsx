import React from 'react';
import { 
  Wifi, 
  Bluetooth, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Music, 
  Radio, 
  HardDrive, 
  Battery, 
  Sparkles,
  Power,
  Lock,
  Play,
  Pause,
  ChevronRight
} from 'lucide-react';
import { SystemSettings, WallpaperPreset } from '../../types/os';
import { sound } from '../../utils/sound';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  onOpenApp: (appId: any) => void;
  onRestartSystem: () => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenApp,
  onRestartSystem,
}) => {
  if (!isOpen) return null;

  const isAmbientPlaying = sound.isPlayingAmbient();
  const currentTrack = sound.getCurrentTrack();

  const handleToggleAmbient = () => {
    sound.playClick();
    sound.toggleAmbient();
    onUpdateSettings({});
  };

  return (
    <>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-40 bg-transparent"
      />
      {/* GNOME Quick Settings Dropdown Container */}
      <div className="fixed top-9 right-3 z-50 w-84 rounded-3xl liquid-glass-panel p-4 select-none shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95 duration-150 border border-white/20">
        {/* GNOME Quick Settings Pill Toggles (2x2 grid) */}
        <div className="grid grid-cols-2 gap-2">
          {/* Wi-Fi Pill */}
          <button
            onClick={() => sound.playClick()}
            className="p-3 rounded-2xl bg-sky-500/25 border border-sky-400/40 flex items-center justify-between text-left transition-all hover:bg-sky-500/35"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                <Wifi className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block truncate">Liquid Net</span>
                <span className="text-[10px] text-sky-200 block truncate">Connected</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-sky-300 shrink-0" />
          </button>

          {/* Bluetooth Pill */}
          <button
            onClick={() => sound.playClick()}
            className="p-3 rounded-2xl bg-indigo-500/25 border border-indigo-400/40 flex items-center justify-between text-left transition-all hover:bg-indigo-500/35"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-indigo-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                <Bluetooth className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block truncate">Bluetooth</span>
                <span className="text-[10px] text-indigo-200 block truncate">Spatial Audio</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
          </button>

          {/* Dark Style / Liquid Opacity */}
          <button
            onClick={() => {
              sound.playClick();
              onUpdateSettings({ fluidInteractive: !settings.fluidInteractive });
            }}
            className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left transition-all ${
              settings.fluidInteractive
                ? 'bg-violet-500/25 border-violet-400/40 text-white'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-violet-300" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold block truncate">Fluid Ripples</span>
              <span className="text-[10px] text-slate-400 block truncate">{settings.fluidInteractive ? 'On' : 'Off'}</span>
            </div>
          </button>

          {/* Audio Feedback / Tactile sound */}
          <button
            onClick={() => {
              sound.playClick();
              sound.setMuted(!settings.soundEnabled);
              onUpdateSettings({ soundEnabled: !settings.soundEnabled });
            }}
            className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left transition-all ${
              settings.soundEnabled
                ? 'bg-emerald-500/25 border-emerald-400/40 text-white'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold block truncate">Tactile Audio</span>
              <span className="text-[10px] text-slate-400 block truncate">{settings.soundEnabled ? 'Active' : 'Muted'}</span>
            </div>
          </button>
        </div>

        {/* Volume Slider Bar (GNOME style) */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2 font-medium">
              <Volume2 className="w-4 h-4 text-slate-300" />
              Volume Level
            </span>
            <span className="font-mono text-[11px] tabular-nums text-slate-400">80%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue={80}
            className="w-full accent-sky-400 h-1.5 bg-white/20 rounded cursor-pointer"
          />
        </div>

        {/* Display Glass Opacity Slider */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2 font-medium">
              <Sun className="w-4 h-4 text-amber-300" />
              Glass Translucency
            </span>
            <span className="font-mono text-[11px] tabular-nums text-slate-400">
              {Math.round(settings.glassOpacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="6"
            max="35"
            value={settings.glassOpacity * 100}
            onChange={(e) => onUpdateSettings({ glassOpacity: Number(e.target.value) / 100 })}
            className="w-full accent-amber-300 h-1.5 bg-white/20 rounded cursor-pointer"
          />
        </div>

        {/* Ambient Synthesizer Player Tile */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-semibold text-white truncate">{currentTrack}</h5>
              <span className="text-[10px] text-slate-400 block truncate">Ambient Flow Engine</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleAmbient}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {isAmbientPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>
            <button
              onClick={() => { onClose(); onOpenApp('audio'); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              title="Open Sound Flow App"
            >
              <Music className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* GNOME Bottom Quick Actions Row (Settings, Lock, Power) */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => { onClose(); onOpenApp('settings'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => { sound.playClick(); onRestartSystem(); onClose(); }}
              className="p-2 rounded-xl hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
              title="Restart / Reset Workspace"
            >
              <Power className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
