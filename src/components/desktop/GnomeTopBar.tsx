import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Battery, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Music, 
  Moon, 
  Sun,
  Power,
  ChevronDown,
  Bell,
  Calendar as CalendarIcon
} from 'lucide-react';
import { AppId, WindowInstance } from '../../types/os';
import { sound } from '../../utils/sound';

interface GnomeTopBarProps {
  activeWindow: WindowInstance | null;
  activitiesOpen: boolean;
  onToggleActivities: () => void;
  onOpenApp: (appId: AppId) => void;
  onToggleQuickSettings: () => void;
  quickSettingsOpen: boolean;
  clock24h?: boolean;
}

export const GnomeTopBar: React.FC<GnomeTopBarProps> = ({
  activeWindow,
  activitiesOpen,
  onToggleActivities,
  onOpenApp,
  onToggleQuickSettings,
  quickSettingsOpen,
  clock24h = false,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [showCalendarFlyout, setShowCalendarFlyout] = useState(false);
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

  useEffect(() => {
    const checkAudio = setInterval(() => {
      setIsAudioPlaying(sound.isPlayingAmbient());
    }, 600);
    return () => clearInterval(checkAudio);
  }, []);

  const activeAppName = activeWindow ? activeWindow.title.split(' ')[0] : null;

  return (
    <>
      <header className="fixed top-0 inset-x-0 h-8 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-white/10 px-3 flex items-center justify-between text-xs text-slate-200 select-none shadow-md">
        {/* Left Zone: GNOME Activities Button & Active App Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onToggleActivities();
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activitiesOpen
                ? 'bg-white/25 text-white shadow-xs ring-1 ring-white/30'
                : 'bg-white/8 hover:bg-white/15 text-slate-200 hover:text-white'
            }`}
          >
            Activities
          </button>

          {/* Matrix AI Quick Summon Pill */}
          <button
            onClick={() => {
              sound.playWindowOpen();
              onOpenApp('matrix');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 hover:text-emerald-200 text-xs font-medium transition-all"
            title="Summon Matrix AI Co-Pilot"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Matrix AI</span>
          </button>

          {activeAppName && !activitiesOpen && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-white font-medium text-xs">
              <span>{activeAppName}</span>
            </div>
          )}
        </div>

        {/* Center Zone: GNOME Centered Clock & Calendar Dropdown */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <button
            onClick={() => {
              sound.playClick();
              setShowCalendarFlyout(!showCalendarFlyout);
            }}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              showCalendarFlyout
                ? 'bg-white/20 text-white'
                : 'hover:bg-white/10 text-slate-200 hover:text-white'
            }`}
          >
            <span className="text-slate-400 font-normal">{dateStr}</span>
            <span className="font-semibold text-white">{timeStr}</span>
          </button>

          {/* GNOME Central Calendar & Notification Drawer */}
          {showCalendarFlyout && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowCalendarFlyout(false)} />
              <div className="absolute left-1/2 -translate-x-1/2 top-9 z-50 p-4 rounded-2xl liquid-glass-panel shadow-2xl border border-white/20 w-80 space-y-4 animate-in fade-in zoom-in-95 duration-100">
                {/* Header */}
                <div className="flex items-center justify-between text-xs font-semibold text-white pb-2 border-b border-white/10">
                  <span>{new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  <span className="text-sky-400 font-mono text-[11px]">{timeStr}</span>
                </div>

                {/* Notifications section */}
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 text-center text-slate-400 text-xs">
                  <Bell className="w-4 h-4 mx-auto mb-1 text-slate-500" />
                  <span>No new notifications</span>
                </div>

                {/* Calendar grid */}
                <div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-slate-400 mb-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                      <span key={i} className="py-1 font-semibold">{d}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                      const isToday = d === new Date().getDate();
                      return (
                        <div
                          key={d}
                          className={`py-1 rounded-md transition-colors ${
                            isToday ? 'bg-sky-500 text-white font-bold shadow-xs' : 'text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {d}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Zone: GNOME Aggregate Quick Settings Pill */}
        <div className="flex items-center gap-2">
          {/* Ambient flow mini pill */}
          {isAudioPlaying && (
            <button
              onClick={() => onOpenApp('audio')}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/30 text-[11px] font-medium transition-colors"
            >
              <Music className="w-3 h-3 animate-pulse" />
              <span>Playing</span>
            </button>
          )}

          {/* GNOME Signature Aggregate Quick Settings Capsule */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleQuickSettings();
            }}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
              quickSettingsOpen
                ? 'bg-white/20 border-white/30 text-white shadow-xs'
                : 'bg-white/8 border-white/10 hover:bg-white/15 text-slate-200 hover:text-white'
            }`}
            title="GNOME Quick Settings"
          >
            <Wifi className="w-3.5 h-3.5" />
            <Volume2 className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">98%</span>
            </div>
          </button>
        </div>
      </header>
    </>
  );
};
