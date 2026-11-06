import React from 'react';
import { 
  Sliders, 
  Sparkles, 
  Volume2, 
  Layers, 
  Info, 
  Monitor, 
  Check, 
  Cpu, 
  HardDrive
} from 'lucide-react';
import { SystemSettings, WallpaperPreset } from '../../types/os';
import { sound } from '../../utils/sound';

interface SettingsAppProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({ settings, onUpdateSettings }) => {
  const presets: { id: WallpaperPreset; name: string; gradient: string }[] = [
    { id: 'fluid-opaline', name: 'Opaline Glass', gradient: 'from-indigo-600 via-sky-500 to-rose-400' },
    { id: 'deep-obsidian', name: 'Deep Obsidian', gradient: 'from-slate-900 via-slate-800 to-slate-700' },
    { id: 'solstice-amber', name: 'Solstice Amber', gradient: 'from-amber-600 via-orange-500 to-rose-600' },
    { id: 'boreal-emerald', name: 'Boreal Emerald', gradient: 'from-emerald-700 via-teal-500 to-cyan-500' },
    { id: 'crystal-pearl', name: 'Crystal Pearl', gradient: 'from-sky-300 via-indigo-200 to-slate-400' },
  ];

  return (
    <div className="flex h-full w-full bg-slate-950/75 backdrop-blur-xl text-slate-100 select-none overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">System Preferences</h2>
          <p className="text-xs text-slate-400 mt-0.5">Customize the liquid optics, fluid dynamics, and tactile feedback.</p>
        </div>

        {/* Wallpaper section */}
        <section className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Monitor className="w-4 h-4 text-sky-400" />
            <span>Liquid Canvas Wallpaper</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {presets.map((p) => {
              const isSelected = settings.wallpaper === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    sound.playClick();
                    onUpdateSettings({ wallpaper: p.id });
                  }}
                  className={`group relative p-2.5 rounded-xl border text-left transition-all ${
                    isSelected 
                      ? 'bg-white/15 border-white/30 ring-2 ring-sky-400/50' 
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className={`h-14 rounded-lg bg-gradient-to-br ${p.gradient} mb-2 flex items-center justify-center shadow-inner`}>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-200 group-hover:text-white block truncate">
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
              <span>Interactive Fluid Physics (Cursor ripple)</span>
              <input
                type="checkbox"
                checked={settings.fluidInteractive}
                onChange={(e) => onUpdateSettings({ fluidInteractive: e.target.checked })}
                className="accent-sky-400 rounded cursor-pointer"
              />
            </label>
          </div>
        </section>

        {/* Optical Glass Tuning */}
        <section className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Liquid Glass Optical Tuning</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Backdrop Diffusion Blur</span>
                <span className="font-mono tabular-nums text-slate-400">{settings.glassBlur}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="48"
                value={settings.glassBlur}
                onChange={(e) => onUpdateSettings({ glassBlur: Number(e.target.value) })}
                className="w-full accent-sky-400 h-1.5 bg-white/20 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Glass Translucency Opacity</span>
                <span className="font-mono tabular-nums text-slate-400">{Math.round(settings.glassOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="35"
                value={settings.glassOpacity * 100}
                onChange={(e) => onUpdateSettings({ glassOpacity: Number(e.target.value) / 100 })}
                className="w-full accent-sky-400 h-1.5 bg-white/20 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Specular Rim Reflection</span>
                <span className="font-mono tabular-nums text-slate-400">{Math.round(settings.specularSheen * 100)}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={settings.specularSheen * 100}
                onChange={(e) => onUpdateSettings({ specularSheen: Number(e.target.value) / 100 })}
                className="w-full accent-sky-400 h-1.5 bg-white/20 rounded cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Tactile & System Interaction */}
        <section className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Volume2 className="w-4 h-4 text-sky-400" />
            <span>Interaction & Feedback</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <label className="flex items-center justify-between text-slate-300 cursor-pointer">
              <span>Tactile Audio Effects (Window & button sounds)</span>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => {
                  sound.setMuted(!e.target.checked);
                  onUpdateSettings({ soundEnabled: e.target.checked });
                }}
                className="accent-sky-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-slate-300 cursor-pointer">
              <span>Dock Proximity Magnification</span>
              <input
                type="checkbox"
                checked={settings.dockMagnification}
                onChange={(e) => onUpdateSettings({ dockMagnification: e.target.checked })}
                className="accent-sky-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-slate-300 cursor-pointer">
              <span>24-Hour Military Time Format</span>
              <input
                type="checkbox"
                checked={settings.clockFormat24h}
                onChange={(e) => onUpdateSettings({ clockFormat24h: e.target.checked })}
                className="accent-sky-400 rounded cursor-pointer"
              />
            </label>
          </div>
        </section>

        {/* System Telemetry & About */}
        <section className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Info className="w-4 h-4 text-sky-400" />
            <span>System Information</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="block text-slate-300 font-medium mb-1">Architecture</span>
              <span className="font-mono text-slate-400">Aetheris Vitreous 64-bit</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="block text-slate-300 font-medium mb-1">Window Compositor</span>
              <span className="font-mono text-slate-400">Liquid Refraction 60 FPS</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="block text-slate-300 font-medium mb-1">Display DPI</span>
              <span className="font-mono text-slate-400">{window.devicePixelRatio || 1}x Retina</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="block text-slate-300 font-medium mb-1">Active Memory</span>
              <span className="font-mono text-slate-400">4.2 GB Simulated</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
