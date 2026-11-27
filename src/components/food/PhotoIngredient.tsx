'use client';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { hashString, rng } from '@/lib/rng';
import { PHOTOS, photoUrl, type PhotoSource } from '@/data/media';
import type { VisualKey } from '@/lib/types';
import type { Region } from './IngredientLayer';

/**
 * Ingrédient rendu à partir d'une vraie photo (texture), au lieu d'un dessin vectoriel.
 * - `mass` : plusieurs amas irréguliers aux bords fondus, chacun montrant une partie différente de la photo.
 * - `piece` : morceaux découpés (rondelle, lamelle, œuf…) remplis par la photo, avec ombrage et ombre portée.
 */

interface Shape { d: string; tile: number; size: number }

const blob = (r: () => number, rx: number, ry: number, pts = 11, jitter = 0.26) => {
  const c: [number, number][] = [];
  for (let i = 0; i < pts; i++) {
    const a = (i / pts) * Math.PI * 2;
    const k = 1 - jitter + r() * jitter;
    c.push([Math.cos(a) * rx * k, Math.sin(a) * ry * k]);
  }
  let d = '';
  c.forEach(([x, y], i) => {
    const [nx, ny] = c[(i + 1) % pts];
    const mx = (x + nx) / 2; const my = (y + ny) / 2;
    d += i === 0 ? `M${mx.toFixed(1)},${my.toFixed(1)} ` : `Q${x.toFixed(1)},${y.toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)} `;
  });
  const [x0, y0] = c[0]; const [x1, y1] = c[1];
  return d + `Q${x0.toFixed(1)},${y0.toFixed(1)} ${((x0 + x1) / 2).toFixed(1)},${((y0 + y1) / 2).toFixed(1)} Z`;
};

/** Formes des morceaux (centrées sur 0,0, échelle ~40 px comme les symboles vectoriels). */
const PIECES: Partial<Record<VisualKey, (r: () => number) => Shape>> = {
  tomato: () => ({ d: 'M-19,0 A19,19 0 1 0 19,0 A19,19 0 1 0 -19,0Z', tile: 40, size: 19 }),
  pickle: () => ({ d: 'M-12,0 A12,11 0 1 0 12,0 A12,11 0 1 0 -12,0Z', tile: 26, size: 12 }),
  merguez: (r) => ({ d: blob(r, 11, 9, 9, 0.12), tile: 26, size: 11 }),
  egg: (r) => ({ d: blob(r, 34, 26, 12, 0.22), tile: 78, size: 32 }),
  tenders: (r) => ({ d: blob(r, 26, 12, 10, 0.2), tile: 58, size: 24 }),
  cordon: (r) => ({ d: blob(r, 22, 15, 10, 0.12), tile: 50, size: 20 }),
  steak: (r) => ({ d: blob(r, 27, 8, 10, 0.14), tile: 58, size: 25 }),
  pepper: () => ({ d: 'M-17,-2 Q0,-8 17,-2 Q18,1 16,3 Q0,-3 -16,3 Q-18,1 -17,-2Z', tile: 38, size: 16 }),
};

const DENSITY: Partial<Record<VisualKey, number>> = {
  tomato: 8, pickle: 11, merguez: 14, egg: 1.6, tenders: 9, cordon: 8, steak: 5, pepper: 12,
};

export function hasPhoto(visual: VisualKey) {
  return !!PHOTOS[visual];
}

export function photoFor(visual: VisualKey): PhotoSource | undefined {
  return PHOTOS[visual];
}

/** Zone utile d'une photo, centrée sur l'origine, dans un carré de `size`. */
export function PhotoTile({ src, size }: { src: PhotoSource; size: number }) {
  const W = src.aspect * 1000;
  const [cx, cy, cw, ch] = src.crop;
  return (
    <svg x={-size / 2} y={-size / 2} width={size} height={size} overflow="hidden"
      viewBox={`${(cx * W).toFixed(1)} ${(cy * 1000).toFixed(1)} ${(cw * W).toFixed(1)} ${(ch * 1000).toFixed(1)}`} preserveAspectRatio="xMidYMid slice">
      <image href={photoUrl(src)} width={W} height={1000} preserveAspectRatio="none" style={src.tone ? { filter: src.tone } : undefined} />
    </svg>
  );
}

/** Motif SVG qui affiche la zone utile d'une photo dans une tuile carrée centrée sur l'origine. */
export function PhotoPattern({ id, src, tile }: { id: string; src: PhotoSource; tile: number }) {
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" x={-tile / 2} y={-tile / 2} width={tile} height={tile}>
      <g transform={`translate(${tile / 2} ${tile / 2})`}><PhotoTile src={src} size={tile} /></g>
    </pattern>
  );
}

interface Props {
  visual: VisualKey;
  region: Region;
  seed: string;
  density: number;
  scale: number;
  drop: number;
  delay: number;
  squash: number;
  count?: number;
  animated: boolean;
}

export function PhotoIngredient({ visual, region, seed, density, scale, drop, delay, squash, count, animated }: Props) {
  const src = PHOTOS[visual]!;
  const uid = `ph${hashString(seed + visual + region.cx + region.cy).toString(36)}`;
  const piece = src.mode === 'piece' ? PIECES[visual] : undefined;

  const items = useMemo(() => {
    const r = rng(hashString(seed + visual + 'photo'));
    const area = (region.rx * region.ry) / (150 * 150);
    if (piece) {
      const n = count != null ? Math.max(1, Math.round(count * 0.75)) : Math.max(1, Math.round((DENSITY[visual] ?? 8) * area * density));
      const shape = piece(r);
      const margin = shape.size * scale * 0.7;
      return Array.from({ length: n }).map(() => {
        const a = r() * Math.PI * 2, dd = Math.sqrt(r());
        return {
          x: region.cx + Math.cos(a) * dd * Math.max(region.rx - margin, 3),
          y: region.cy + Math.sin(a) * dd * Math.max(region.ry - margin * squash, 2),
          rot: r() * 360, s: scale * (0.85 + r() * 0.3), d: piece(r).d, tile: shape.tile,
        };
      }).sort((a, b) => a.y - b.y);
    }
    // Couche fine et large (kebab vu de profil) : une bande continue de petits amas qui se chevauchent.
    if (region.rx / region.ry > 3) {
      const h = region.ry * 1.25;
      const n = Math.ceil(region.rx / (h * 0.9)) + 1;
      return Array.from({ length: n }).map((_, i) => {
        const x = region.cx - region.rx + h + (i / Math.max(1, n - 1)) * (region.rx * 2 - h * 2) + (r() - 0.5) * h * 0.4;
        const y = region.cy + (r() - 0.5) * region.ry * 0.5;
        const rr = h * (1.2 + r() * 0.35);
        return { x, y, rot: (r() - 0.5) * 30, s: 1, d: blob(r, rr, h * (0.9 + r() * 0.2), 12, 0.25), tile: rr * 2.4 };
      });
    }
    // Amas : quelques grosses formes qui se chevauchent, plus des petites en bordure.
    const base = Math.min(region.rx, region.ry);
    const big = Math.max(3, Math.round(7 * Math.sqrt(area) * Math.min(1.6, density)));
    const out: { x: number; y: number; rot: number; s: number; d: string; tile: number }[] = [];
    // Petites zones (assiette, crudités) : un vrai tas compact plutôt que des amas épars.
    const compact = area < 0.35;
    const rad = base * (compact ? 0.9 : 0.66);
    for (let i = 0; i < big + 3; i++) {
      const small = i >= big;
      const a = r() * Math.PI * 2, dd = (small ? 0.7 + r() * 0.25 : Math.sqrt(r()) * 0.7) * (compact ? 0.55 : 1);
      const rr = rad * (small ? 0.45 + r() * 0.2 : 0.8 + r() * 0.35);
      out.push({
        x: region.cx + Math.cos(a) * dd * (region.rx - rr * 0.6),
        y: region.cy + Math.sin(a) * dd * (region.ry - rr * 0.6 * squash),
        rot: r() * 360, s: 1, d: blob(r, rr, rr * (0.78 + r() * 0.2), 12, 0.3), tile: rr * 2.3,
      });
    }
    return out.sort((a, b) => a.y - b.y);
  }, [seed, visual, region.cx, region.cy, region.rx, region.ry, density, scale, squash, count, piece]);

  const tiles = [...new Set(items.map((it) => Math.round(it.tile)))];

  return (
    <g>
      <defs>
        {tiles.map((t) => <PhotoPattern key={t} id={`${uid}-t${t}`} src={src} tile={t} />)}
        <radialGradient id={`${uid}-feather`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff" />
          <stop offset={piece ? '0.93' : '0.72'} stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${uid}-m`} maskContentUnits="objectBoundingBox" x="-5%" y="-5%" width="110%" height="110%">
          <rect width="1" height="1" fill={`url(#${uid}-feather)`} />
        </mask>
        <radialGradient id={`${uid}-shade`} cx=".42" cy=".38" r=".62">
          <stop offset="0" stopColor="#fff" stopOpacity=".1" />
          <stop offset=".6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".2" />
        </radialGradient>
        <filter id={`${uid}-sh`} x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation={piece ? 2 : 5} /></filter>
      </defs>
      {items.map((it, i) => (
        <g key={i} transform={`translate(${it.x.toFixed(1)} ${it.y.toFixed(1)}) scale(1 ${squash})`}>
          <motion.g
            initial={animated ? { y: -drop - (i % 4) * 14, opacity: 0, rotate: it.rot - 40, scale: it.s * 1.12 } : false}
            animate={{ y: 0, opacity: 1, rotate: it.rot, scale: it.s }}
            transition={{ type: 'spring', stiffness: 240, damping: 20, mass: 0.8, delay: delay + i * (piece ? 0.03 : 0.06) }}
          >
            <path d={it.d} fill="#000" opacity={piece ? 0.42 : 0.2} transform={`translate(${piece ? 1.5 : 3} ${piece ? 3 : 6})`} filter={`url(#${uid}-sh)`} />
            <path d={it.d} fill={`url(#${uid}-t${Math.round(it.tile)})`} mask={`url(#${uid}-m)`} />
            <path d={it.d} fill={`url(#${uid}-shade)`} mask={`url(#${uid}-m)`} />
          </motion.g>
        </g>
      ))}
    </g>
  );
}

export const photoUrlFor = (visual: VisualKey | 'tortilla') => {
  const s = PHOTOS[visual];
  return s ? photoUrl(s) : null;
};
