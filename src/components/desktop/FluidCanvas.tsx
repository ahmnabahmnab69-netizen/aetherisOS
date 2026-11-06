import React, { useEffect, useRef } from 'react';
import { WallpaperPreset } from '../../types/os';

interface FluidCanvasProps {
  preset: WallpaperPreset;
  interactive?: boolean;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  colorIndex: number;
  phase: number;
}

export const FluidCanvas: React.FC<FluidCanvasProps> = ({ preset, interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const ripplesRef = useRef<Ripple[]>([]);
  const orbsRef = useRef<Orb[]>([]);

  // Color palettes per preset
  const getPalette = (presetName: WallpaperPreset) => {
    switch (presetName) {
      case 'fluid-opaline':
        return {
          bg: '#0a0d18',
          colors: [
            'rgba(99, 102, 241, 0.45)',  // Indigo
            'rgba(14, 165, 233, 0.40)',  // Sky Blue
            'rgba(168, 85, 247, 0.35)',  // Violet
            'rgba(45, 212, 191, 0.38)',  // Teal
            'rgba(244, 114, 182, 0.28)', // Rose
          ],
          rippleColor: 'rgba(125, 211, 252, 0.35)',
        };
      case 'deep-obsidian':
        return {
          bg: '#05070c',
          colors: [
            'rgba(30, 41, 59, 0.85)',   // Slate
            'rgba(51, 65, 85, 0.65)',   // Steel
            'rgba(15, 23, 42, 0.9)',    // Deep Navy
            'rgba(71, 85, 105, 0.45)',  // Silver
            'rgba(148, 163, 184, 0.25)', // Chrome
          ],
          rippleColor: 'rgba(203, 213, 225, 0.3)',
        };
      case 'solstice-amber':
        return {
          bg: '#100a08',
          colors: [
            'rgba(245, 158, 11, 0.48)', // Amber
            'rgba(239, 68, 68, 0.40)',  // Crimson
            'rgba(217, 119, 6, 0.45)',  // Gold
            'rgba(180, 83, 9, 0.35)',   // Warm Bronze
            'rgba(251, 191, 36, 0.30)', // Sunlight
          ],
          rippleColor: 'rgba(252, 211, 77, 0.4)',
        };
      case 'boreal-emerald':
        return {
          bg: '#04100c',
          colors: [
            'rgba(16, 185, 129, 0.45)', // Emerald
            'rgba(6, 182, 212, 0.40)',  // Cyan
            'rgba(5, 150, 105, 0.42)',  // Jade
            'rgba(20, 184, 166, 0.38)', // Teal
            'rgba(52, 211, 153, 0.30)', // Mint
          ],
          rippleColor: 'rgba(110, 231, 183, 0.35)',
        };
      case 'crystal-pearl':
      default:
        return {
          bg: '#0b1120',
          colors: [
            'rgba(186, 230, 253, 0.45)', // Ice Blue
            'rgba(224, 231, 255, 0.40)', // Pearl
            'rgba(147, 197, 253, 0.42)', // Soft Azure
            'rgba(196, 181, 253, 0.32)', // Crystal Lavender
            'rgba(241, 245, 249, 0.35)', // Frost
          ],
          rippleColor: 'rgba(240, 249, 255, 0.4)',
        };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Initialize orbs
      if (orbsRef.current.length === 0) {
        const orbs: Orb[] = [];
        const count = 6;
        for (let i = 0; i < count; i++) {
          orbs.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.min(width, height) * (0.35 + Math.random() * 0.25),
            colorIndex: i % 5,
            phase: Math.random() * Math.PI * 2,
          });
        }
        orbsRef.current = orbs;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientY : (e as MouseEvent).clientY;
      mouseRef.current.x = clientX;
      mouseRef.current.y = clientY;
      mouseRef.current.active = true;

      // Occasional small micro-ripple on motion
      if (Math.random() < 0.12) {
        const palette = getPalette(preset);
        ripplesRef.current.push({
          x: clientX,
          y: clientY,
          radius: 10,
          maxRadius: 180 + Math.random() * 80,
          alpha: 0.25,
          color: palette.rippleColor,
        });
      }
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const palette = getPalette(preset);
      ripplesRef.current.push({
        x: clientX,
        y: clientY,
        radius: 15,
        maxRadius: 320,
        alpha: 0.45,
        color: palette.rippleColor,
      });
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchstart', onPointerDown, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.006;
      const palette = getPalette(preset);

      // Deep canvas background
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, width, height);

      // Render floating fluid orbs with radial blur and harmonic movement
      const orbs = orbsRef.current;
      orbs.forEach((orb) => {
        orb.phase += 0.004;
        orb.x += orb.vx + Math.sin(orb.phase) * 0.3;
        orb.y += orb.vy + Math.cos(orb.phase * 0.8) * 0.3;

        // Soft bounce boundaries
        if (orb.x < -orb.radius * 0.2) orb.vx = Math.abs(orb.vx);
        if (orb.x > width + orb.radius * 0.2) orb.vx = -Math.abs(orb.vx);
        if (orb.y < -orb.radius * 0.2) orb.vy = Math.abs(orb.vy);
        if (orb.y > height + orb.radius * 0.2) orb.vy = -Math.abs(orb.vy);

        // Gentle cursor push
        if (mouseRef.current.active) {
          const dx = orb.x - mouseRef.current.x;
          const dy = orb.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 400 && dist > 1) {
            const force = (400 - dist) / 400 * 0.15;
            orb.x += (dx / dist) * force * 15;
            orb.y += (dy / dist) * force * 15;
          }
        }

        // Draw radial gradient orb
        const grad = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius
        );
        const col = palette.colors[orb.colorIndex % palette.colors.length];
        grad.addColorStop(0, col);
        grad.addColorStop(0.6, col.replace(/[\d.]+\)$/, '0.12)'));
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render interactive fluid ripples
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 3.8;
        r.alpha *= 0.96;

        if (r.alpha <= 0.01 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = r.color.replace(/[\d.]+\)$/, `${r.alpha})`);
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner caustic ring
        ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(1, r.radius * 0.8), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Very fine grain overlay for organic glass tactile texture
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchstart', onPointerDown);
    };
  }, [preset, interactive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
      {/* Subtle organic vignette & caustic sheen */}
      <div className="absolute inset-0 bg-radial-vignette opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_60%)] pointer-events-none" />
    </div>
  );
};
