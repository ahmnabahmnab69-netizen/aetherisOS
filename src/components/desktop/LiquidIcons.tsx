import React from 'react';
import { AppId } from '../../types/os';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Bespoke Liquid Glass App Icons.
 * Hand-crafted with multi-layered optical glass geometry, specular rims,
 * and delicate etched detailing—moving away from generic AI candy gradients.
 */

// 1. Files: Frosted Sapphire Folio with etched document index tabs
export const FilesGlassIcon: React.FC<IconProps> = ({ className = 'w-full h-full', size = 48 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
    <defs>
      <linearGradient id="files-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
      </linearGradient>
      <linearGradient id="files-glass-back" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#0284c7" stopOpacity="0.75" />
      </linearGradient>
      <linearGradient id="files-glass-front" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#0369a1" stopOpacity="0.6" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#files-bg)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
    <path d="M10 16C10 14.8954 10.8954 14 12 14H20L23 17H36C37.1046 17 38 17.8954 38 19V32C38 33.1046 37.1046 34 36 34H12C10.8954 34 10 33.1046 10 32V16Z" fill="url(#files-glass-back)" opacity="0.85" />
    <rect x="14" y="19" width="20" height="13" rx="2" fill="#ffffff" fillOpacity="0.8" />
    <line x1="17" y1="23" x2="27" y2="23" stroke="#0284c7" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="17" y1="26" x2="30" y2="26" stroke="#0284c7" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M8 22C8 20.8954 8.89543 20 10 20H38C39.1046 20 40 20.8954 40 22V33C40 34.6569 38.6569 36 37 36H11C9.34315 36 8 34.6569 8 33V22Z" fill="url(#files-glass-front)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
  </svg>
);

// 2. Notes: Etched Quartz Writing Slab
export const NotesGlassIcon: React.FC<IconProps> = ({ className = 'w-full h-full', size = 48 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
    <defs>
      <linearGradient id="notes-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#272118" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#120e0a" stopOpacity="0.95" />
      </linearGradient>
      <linearGradient id="notes-slab" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#notes-bg)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
    <rect x="12" y="10" width="24" height="28" rx="4" fill="url(#notes-slab)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
    <line x1="17" y1="16" x2="25" y2="16" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="17" y1="21" x2="31" y2="21" stroke="#92400e" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
    <line x1="17" y1="25" x2="29" y2="25" stroke="#92400e" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
    <line x1="17" y1="29" x2="27" y2="29" stroke="#92400e" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
  </svg>
);

// 3. Studio: Prismatic Optical Glass Lens
export const StudioGlassIcon: React.FC<IconProps> = ({ className = 'w-full h-full', size = 48 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
    <defs>
      <linearGradient id="studio-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1f182f" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#0c0916" stopOpacity="0.95" />
      </linearGradient>
      <linearGradient id="prism-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#studio-bg)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
    <circle cx="24" cy="24" r="14" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
    <circle cx="24" cy="24" r="11" fill="url(#prism-grad)" />
    <circle cx="24" cy="24" r="6" fill="#0f0b1e" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
    <path d="M17 18C19 15 23 14 27 15" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
  </svg>
);

// 4. Audio: Acoustic Glass Waveform Chamber
export const AudioGlassIcon: React.FC<IconProps> = ({ className = 'w-full h-full', size = 48 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
    <defs>
      <linearGradient id="audio-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0f261e" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#06120d" stopOpacity="0.95" />
      </linearGradient>
      <linearGradient id="wave-grad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#059669" />
        <stop offset="50%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#6ee7b7" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#audio-bg)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
    <rect x="14" y="20" width="3" height="8" rx="1.5" fill="url(#wave-grad)" />
    <rect x="19" y="15" width="3" height="18" rx="1.5" fill="url(#wave-grad)" />
    <rect x="24" y="11" width="3" height="26" rx="1.5" fill="#34d399" />
    <rect x="29" y="17" width="3" height="14" rx="1.5" fill="url(#wave-grad)" />
    <rect x="34" y="22" width="3" height="4" rx="1.5" fill="url(#wave-grad)" opacity="0.8" />
  </svg>
);

// 5. Terminal: Smoked Obsidian Slate
export const TerminalGlassIcon: React.FC<IconProps> = ({ className = 'w-full h-full', size = 48 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
    <defs>
      <linearGradient id="term-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e222d" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#0b0d12" stopOpacity="0.98" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#term-bg)" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
    <path d="M15 18L22 24L15 30" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="25" y1="28" x2="33" y2="28" stroke="#f1f5f9" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

// 6. Calculator: Frosted Glass Numeric Matrix
export const CalcGlassIcon: React.FC<IconProps> = ({ className = 'w-full h-full', size = 48 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
    <defs>
      <linearGradient id="calc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#162032" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#080e18" stopOpacity="0.95" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#calc-bg)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
    <rect x="11" y="10" width="26" height="8" rx="2" fill="#0369a1" fillOpacity="0.35" stroke="rgba(56,189,248,0.4)" strokeWidth="0.8" />
    <circle cx="33" cy="14" r="1.5" fill="#38bdf8" />
    <circle cx="15" cy="23" r="2.2" fill="#ffffff" fillOpacity="0.8" />
    <circle cx="24" cy="23" r="2.2" fill="#ffffff" fillOpacity="0.8" />
    <circle cx="33" cy="23" r="2.2" fill="#f59e0b" fillOpacity="0.9" />
    <circle cx="15" cy="30" r="2.2" fill="#ffffff" fillOpacity="0.8" />
    <circle cx="24" cy="30" r="2.2" fill="#ffffff" fillOpacity="0.8" />
    <circle cx="33" cy="30" r="2.2" fill="#38bdf8" fillOpacity="0.9" />
  </svg>
);

// 7. Gallery: Curated Glass Slide Mount
export const GalleryGlassIcon: React.FC<IconProps> = ({ className = 'w-full h-full', size = 48 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
    <defs>
      <linearGradient id="gal-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2b141d" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#12070c" stopOpacity="0.95" />
      </linearGradient>
      <linearGradient id="sun-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fb7185" />
        <stop offset="100%" stopColor="#f43f5e" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#gal-bg)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
    <rect x="10" y="10" width="28" height="28" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
    <circle cx="18" cy="19" r="4" fill="url(#sun-grad)" />
    <path d="M12 34L20 23L27 30L31 26L36 34H12Z" fill="#fda4af" fillOpacity="0.8" />
  </svg>
);

// 8. Settings: Precision Dual-Ring Bezel
export const SettingsGlassIcon: React.FC<IconProps> = ({ className = 'w-full h-full', size = 48 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
    <defs>
      <linearGradient id="set-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#222734" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#0f1118" stopOpacity="0.95" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#set-bg)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
    <circle cx="24" cy="24" r="11" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeDasharray="3 3.5" />
    <circle cx="24" cy="24" r="5" fill="#38bdf8" fillOpacity="0.8" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
  </svg>
);

// 9. Trash: Smoked glass receptacle
export const TrashGlassIcon: React.FC<IconProps> = ({ className = 'w-full h-full', size = 48 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
    <defs>
      <linearGradient id="trash-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e2430" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#0c0e14" stopOpacity="0.95" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#trash-bg)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
    <path d="M14 16H34M20 16V13C20 12.4477 20.4477 12 21 12H27C27.5523 12 28 12.4477 28 13V16M16 16L18 34C18 35.1046 18.8954 36 20 36H28C29.1046 36 30 35.1046 30 34L32 16" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ----------------------------------------------------
// NEW OFFICE SUITE LIQUID GLASS ICONS
// ----------------------------------------------------

// 10. Word: Cobalt Frosted Document with embossed 'W' monograph & structured lines
export const WordGlassIcon: React.FC<IconProps> = ({ className = 'w-full h-full', size = 48 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
    <defs>
      <linearGradient id="word-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#0c1938" stopOpacity="0.98" />
      </linearGradient>
      <linearGradient id="word-glass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.65" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#word-bg)" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
    {/* Page sheet */}
    <rect x="14" y="9" width="22" height="30" rx="3" fill="#ffffff" fillOpacity="0.85" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
    {/* Page text lines */}
    <line x1="20" y1="15" x2="31" y2="15" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="20" y1="19" x2="31" y2="19" stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="20" y1="23" x2="29" y2="23" stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="20" y1="27" x2="31" y2="27" stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round" />
    {/* Frosted 'W' Badge Badge Overlap */}
    <rect x="8" y="16" width="16" height="16" rx="4" fill="url(#word-glass)" stroke="#ffffff" strokeWidth="1" shadow-lg="true" />
    <path d="M11 20L13.5 28L16 22L18.5 28L21 20" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 11. Excel: Emerald Frosted Matrix with tabular cell grid & 'X' monogram
export const ExcelGlassIcon: React.FC<IconProps> = ({ className = 'w-full h-full', size = 48 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
    <defs>
      <linearGradient id="excel-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#064e3b" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#022c22" stopOpacity="0.98" />
      </linearGradient>
      <linearGradient id="excel-glass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#excel-bg)" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
    {/* Grid matrix slab */}
    <rect x="14" y="9" width="22" height="30" rx="3" fill="#ffffff" fillOpacity="0.9" />
    {/* Grid hairline lines */}
    <line x1="14" y1="17" x2="36" y2="17" stroke="#a7f3d0" strokeWidth="1" />
    <line x1="14" y1="24" x2="36" y2="24" stroke="#a7f3d0" strokeWidth="1" />
    <line x1="14" y1="31" x2="36" y2="31" stroke="#a7f3d0" strokeWidth="1" />
    <line x1="25" y1="9" x2="25" y2="39" stroke="#a7f3d0" strokeWidth="1" />
    {/* Frosted 'X' Badge Overlap */}
    <rect x="8" y="16" width="16" height="16" rx="4" fill="url(#excel-glass)" stroke="#ffffff" strokeWidth="1" />
    <path d="M12 20L20 28M20 20L12 28" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 12. PowerPoint: Solar Amber Slide Deck with projection beam & 'P' monogram
export const PowerPointGlassIcon: React.FC<IconProps> = ({ className = 'w-full h-full', size = 48 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
    <defs>
      <linearGradient id="ppt-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7c2d12" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#380d04" stopOpacity="0.98" />
      </linearGradient>
      <linearGradient id="ppt-glass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fb923c" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#c2410c" stopOpacity="0.75" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#ppt-bg)" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
    {/* Slide canvas */}
    <rect x="14" y="12" width="24" height="24" rx="3" fill="#ffffff" fillOpacity="0.9" />
    {/* Mini slide presentation graphic */}
    <rect x="18" y="16" width="16" height="3" rx="1" fill="#ea580c" />
    <path d="M18 29L23 23L27 26L31 21L34 29H18Z" fill="#fed7aa" />
    <circle cx="30" cy="19" r="1.5" fill="#f97316" />
    {/* Frosted 'P' Badge Overlap */}
    <rect x="8" y="16" width="16" height="16" rx="4" fill="url(#ppt-glass)" stroke="#ffffff" strokeWidth="1" />
    <path d="M13 28V20H17C18.6569 20 20 21.3431 20 23C20 24.6569 18.6569 26 17 26H13" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 13. Notion: Titanium Smoked Workspace with modular block geometry & 'N' monogram
export const NotionGlassIcon: React.FC<IconProps> = ({ className = 'w-full h-full', size = 48 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
    <defs>
      <linearGradient id="notion-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#27272a" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#09090b" stopOpacity="0.98" />
      </linearGradient>
      <linearGradient id="notion-glass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f4f4f5" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#d4d4d8" stopOpacity="0.8" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#notion-bg)" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
    {/* Notion cube / notebook outline */}
    <rect x="10" y="9" width="28" height="30" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    {/* Bold sculptural 'N' Monograph */}
    <path d="M16 16V32L28 18V32" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="16" y1="16" x2="19" y2="16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <line x1="25" y1="32" x2="31" y2="32" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 14. Matrix AI: Cybernetic Obsidian Hexagon with glowing neural nodes & quantum matrix ring
export const MatrixGlassIcon: React.FC<IconProps> = ({ className = 'w-full h-full', size = 48 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" className={className}>
    <defs>
      <linearGradient id="matrix-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#022c22" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#083344" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
      </linearGradient>
      <linearGradient id="matrix-core-glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
      </linearGradient>
      <radialGradient id="matrix-orb" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#a7f3d0" stopOpacity="1" />
        <stop offset="60%" stopColor="#10b981" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#047857" stopOpacity="0.2" />
      </radialGradient>
      <filter id="matrix-blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" />
      </filter>
    </defs>
    {/* Base obsidian glass container */}
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#matrix-bg)" stroke="rgba(45,212,191,0.3)" strokeWidth="1" />
    {/* Outer orbital quantum circle */}
    <circle cx="24" cy="24" r="14" stroke="#0d9488" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
    {/* Concentric rotating hex geometry */}
    <path d="M24 13L33 18.5V29.5L24 35L15 29.5V18.5L24 13Z" stroke="url(#matrix-core-glow)" strokeWidth="1.5" fill="rgba(13,148,136,0.12)" />
    {/* Inner cybernetic node lattice */}
    <circle cx="24" cy="24" r="3.5" fill="url(#matrix-orb)" filter="url(#matrix-blur)" />
    <circle cx="24" cy="24" r="2.5" fill="#ffffff" />
    {/* Satellite quantum spark nodes */}
    <circle cx="24" cy="15" r="1.5" fill="#38bdf8" />
    <circle cx="31.5" cy="19.5" r="1.5" fill="#34d399" />
    <circle cx="31.5" cy="28.5" r="1.5" fill="#38bdf8" />
    <circle cx="24" cy="33" r="1.5" fill="#34d399" />
    <circle cx="16.5" cy="28.5" r="1.5" fill="#38bdf8" />
    <circle cx="16.5" cy="19.5" r="1.5" fill="#34d399" />
    {/* Light rays */}
    <line x1="24" y1="16.5" x2="24" y2="21.5" stroke="#2dd4bf" strokeWidth="0.8" strokeOpacity="0.7" />
    <line x1="24" y1="26.5" x2="24" y2="31.5" stroke="#2dd4bf" strokeWidth="0.8" strokeOpacity="0.7" />
    <line x1="18" y1="20.5" x2="21.5" y2="22.5" stroke="#2dd4bf" strokeWidth="0.8" strokeOpacity="0.7" />
    <line x1="26.5" y1="25.5" x2="30" y2="27.5" stroke="#2dd4bf" strokeWidth="0.8" strokeOpacity="0.7" />
  </svg>
);

// Master App Icon Resolver
export const AppGlassIcon: React.FC<{ appId: AppId; size?: number; className?: string }> = ({ appId, size, className }) => {
  switch (appId) {
    case 'files': return <FilesGlassIcon size={size} className={className} />;
    case 'notes': return <NotesGlassIcon size={size} className={className} />;
    case 'studio': return <StudioGlassIcon size={size} className={className} />;
    case 'audio': return <AudioGlassIcon size={size} className={className} />;
    case 'terminal': return <TerminalGlassIcon size={size} className={className} />;
    case 'calc': return <CalcGlassIcon size={size} className={className} />;
    case 'gallery': return <GalleryGlassIcon size={size} className={className} />;
    case 'settings': return <SettingsGlassIcon size={size} className={className} />;
    case 'word': return <WordGlassIcon size={size} className={className} />;
    case 'excel': return <ExcelGlassIcon size={size} className={className} />;
    case 'powerpoint': return <PowerPointGlassIcon size={size} className={className} />;
    case 'notion': return <NotionGlassIcon size={size} className={className} />;
    case 'matrix': return <MatrixGlassIcon size={size} className={className} />;
    default: return <FilesGlassIcon size={size} className={className} />;
  }
};
