import { VirtualFile } from '../types/os';

export const INITIAL_FILES: VirtualFile[] = [
  // Root / Desktop items
  {
    id: 'folder-documents',
    name: 'Documents',
    type: 'folder',
    parentId: null,
    size: '4 items',
    updatedAt: 'Today at 09:15',
    tags: ['work', 'essential'],
  },
  {
    id: 'folder-projects',
    name: 'Projects',
    type: 'folder',
    parentId: null,
    size: '3 items',
    updatedAt: 'Yesterday',
    tags: ['dev'],
  },
  {
    id: 'folder-visuals',
    name: 'Visuals',
    type: 'folder',
    parentId: null,
    size: '3 items',
    updatedAt: 'Nov 4',
    tags: ['design'],
  },
  {
    id: 'doc-welcome',
    name: 'Welcome to Aetheris.md',
    type: 'document',
    parentId: null,
    size: '2.4 KB',
    updatedAt: 'Just now',
    tags: ['system'],
    content: `# Welcome to Aetheris Liquid OS

A virtual desktop environment engineered with an uncompromising liquid glass aesthetic.

### Core Philosophy
1. **Light & Refraction**: Transparent surfaces layered with specular highlights, physical refraction, and organic depth.
2. **Zero-Slop Cleanliness**: Every control is functional. No fake pills, no synthetic status metrics, no chatbot clutter.
3. **Fluid Interactivity**: Physics-driven window drag & resize, dynamic dock magnification, ambient procedural audio, and an interactive fluid canvas.
4. **Functional Office Suite**: Production-grade document writer (Word), spreadsheet engine with live formulas (Excel), presentation deck creator (PowerPoint), and modular workspace (Notion).
`,
  },
  {
    id: 'file-word-doc',
    name: 'Strategy Proposal.docx',
    type: 'document',
    parentId: null,
    size: '14.2 KB',
    updatedAt: 'Today at 10:20',
    tags: ['office', 'word'],
  },
  {
    id: 'file-excel-sheet',
    name: 'Q4 Financial Ledger.xlsx',
    type: 'sheet',
    parentId: null,
    size: '22.8 KB',
    updatedAt: 'Today at 11:45',
    tags: ['office', 'excel'],
  },
  {
    id: 'file-powerpoint-deck',
    name: 'Aetheris Vision Deck.pptx',
    type: 'presentation',
    parentId: null,
    size: '18.5 KB',
    updatedAt: 'Yesterday',
    tags: ['office', 'powerpoint'],
  },
  {
    id: 'doc-liquid-manifesto',
    name: 'Liquid Glass Spec.md',
    type: 'document',
    parentId: 'folder-documents',
    size: '1.8 KB',
    updatedAt: 'Nov 5',
    tags: ['spec'],
    content: `# Liquid Glass User Interface Specification

### Optical Properties
- **Base Translucency**: 12% to 22% luminance transmission
- **Multi-layer Specular**: High-light rim gradient reflecting an overhead warm white light source
- **Backdrop Diffusion**: 28px dual-pass Gaussian blur with 190% saturation boost
- **Caustic Dynamic**: Live reactive fluid canvas refracting through surface panes

### Component Geometry
- Window corners: 16px radius with matching 12px inner element radius
- Hairline border: 1px continuous alpha border with 24% white intensity
- Minimalist traffic lights: Ruby Close, Amber Minimize, Jade Maximize
`,
  },
  {
    id: 'doc-quarterly-plan',
    name: 'Design System Notes.md',
    type: 'document',
    parentId: 'folder-documents',
    size: '1.2 KB',
    updatedAt: 'Oct 28',
    tags: ['work'],
    content: `# Design System Guidelines

- Focus on human-crafted typography over default styles
- Muted chromatic palettes with restrained 10% high-intent accents
- Always pair numerical figures with tabular alignment (tabular-nums)
- Avoid pill enclosures for static metadata; use clean unboxed text
`,
  },
  {
    id: 'code-fluid-engine',
    name: 'FluidSimulator.ts',
    type: 'code',
    parentId: 'folder-projects',
    size: '4.6 KB',
    updatedAt: 'Nov 3',
    tags: ['code', 'dev'],
    content: `// Aetheris High-Performance Fluid Compositor
export class FluidField {
  private width: number;
  private height: number;
  private density: Float32Array;
  private velocityX: Float32Array;
  private velocityY: Float32Array;

  constructor(w: number, h: number) {
    this.width = w;
    this.height = h;
    const size = w * h;
    this.density = new Float32Array(size);
    this.velocityX = new Float32Array(size);
    this.velocityY = new Float32Array(size);
  }

  public step(dt: number, viscosity: number): void {
    // Advection and diffusion integration step
  }
}`,
  },
  {
    id: 'img-aurora',
    name: 'Boreal Prism.svg',
    type: 'image',
    parentId: 'folder-visuals',
    size: '3.1 KB',
    updatedAt: 'Nov 1',
    tags: ['art'],
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2310b981"/><stop offset="50%" stop-color="%2306b6d4"/><stop offset="100%" stop-color="%233b82f6"/></linearGradient></defs><rect width="600" height="400" fill="%23090d16"/><circle cx="300" cy="200" r="140" fill="url(%23g1)" filter="blur(40px)" opacity="0.8"/></svg>',
  },
  {
    id: 'img-solstice',
    name: 'Solstice Horizon.svg',
    type: 'image',
    parentId: 'folder-visuals',
    size: '2.8 KB',
    updatedAt: 'Oct 30',
    tags: ['art'],
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f59e0b"/><stop offset="60%" stop-color="%23ef4444"/><stop offset="100%" stop-color="%236366f1"/></linearGradient></defs><rect width="600" height="400" fill="%230f0f18"/><ellipse cx="280" cy="220" rx="180" ry="100" fill="url(%23g2)" filter="blur(45px)" opacity="0.85"/></svg>',
  }
];
