export type AppId = 
  | 'files'
  | 'notes'
  | 'studio'
  | 'audio'
  | 'terminal'
  | 'calc'
  | 'settings'
  | 'gallery'
  | 'word'
  | 'excel'
  | 'powerpoint'
  | 'notion'
  | 'matrix';

export interface AppMetadata {
  id: AppId;
  name: string;
  iconName: string;
  defaultTitle: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  description: string;
}

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isMinimized: boolean;
  isMaximized: boolean;
  preMaximizeBounds?: { x: number; y: number; width: number; height: number };
  zIndex: number;
  glassOpacity?: number;
  customData?: any;
}

export type FileType = 'folder' | 'document' | 'image' | 'audio' | 'code' | 'sheet' | 'presentation';

export interface VirtualFile {
  id: string;
  name: string;
  type: FileType;
  parentId: string | null; // null represents Root/Desktop
  size: string;
  updatedAt: string;
  content?: string;
  tags?: string[];
  previewUrl?: string;
}

export type WallpaperPreset = 
  | 'fluid-opaline'
  | 'deep-obsidian'
  | 'solstice-amber'
  | 'boreal-emerald'
  | 'crystal-pearl';

export interface SystemSettings {
  wallpaper: WallpaperPreset;
  glassBlur: number; // 10 to 50 px
  glassOpacity: number; // 0.05 to 0.4
  specularSheen: number; // 0.1 to 0.7
  soundEnabled: boolean;
  dockMagnification: boolean;
  clockFormat24h: boolean;
  fluidInteractive: boolean;
}
