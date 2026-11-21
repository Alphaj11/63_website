'use client';
import { motion } from 'framer-motion';
import { useSafeReducedMotion } from '@/lib/useSafeReducedMotion';
import { useMemo } from 'react';
import { hashString, rng } from '@/lib/rng';
import type { VisualKey } from '@/lib/types';

export interface Region { cx: number; cy: number; rx: number; ry: number }

/** Nombre de morceaux pour une région de ~150px de rayon. */
const DENSITY: Partial<Record<VisualKey, number>> = {
  doner: 26, chicken: 18, minced: 18, cordon: 9, tenders: 10, merguez: 12, steak: 4,
  lettuce: 14, tomato: 9, onion: 12, redonion: 12, cabbage: 16, pickle: 12, corn: 20, olive: 16, carrot: 16, pepper: 12,
  fries: 22, rice: 22, bulgur: 22, cheddar: 7, grated: 18, egg: 2, butter: 1,
};

/** Largeur approximative d'un morceau (évite qu'il dépasse de la zone). */
const SIZE: Partial<Record<VisualKey, number>> = { steak: 22, egg: 20, fries: 20, doner: 22, tenders: 22, merguez: 21, cordon: 19 };

export const SAUCE_COLORS: Record<string, [string, string]> = {
  'sauce-white': ['#f3eee4', '#ffffff'],
  'sauce-algerian': ['#e3862f', '#ffc78f'],
  'sauce-samurai': ['#d9612a', '#ffb28a'],
  'sauce-harissa': ['#a8231a', '#ff7a6a'],
  'sauce-andalouse': ['#e8823f', '#ffc39a'],
  'sauce-biggy': ['#e2ae5e', '#fff0c8'],
  'sauce-bbq': ['#4f1e10', '#a2543a'],
  'sauce-ketchup': ['#b51d17', '#ff6f66'],
  'sauce-mayo': ['#f1dc95', '#fffbe6'],
};

export const isSauce = (v: VisualKey) => v.startsWith('sauce-');

interface Props {
  /** Préfixe des symboles (voir IngredientDefs). */
  p: string;
  visual: VisualKey;
  region: Region;
  seed: string;
  /** Multiplicateur de densité. */
  density?: number;
  /** Échelle des morceaux. */
  scale?: number;
  /** Hauteur de chute (px) pour l'animation d'entrée. */
  drop?: number;
  delay?: number;
  /** Écrase verticalement les morceaux (vue de profil / trois-quarts). */
  squash?: number;
  /** Rendu statique (aperçus de la carte). */
  still?: boolean;
  /** Nombre exact de morceaux (remplace le calcul par densité, utile pour les couches fines). */
  count?: number;
}

export function IngredientLayer({ p, visual, region, seed, density = 1, scale = 1, drop = 160, delay = 0, squash = 1, still, count }: Props) {
  const reduce = useSafeReducedMotion();
  const animated = !still && !reduce;

  const pieces = useMemo(() => {
    const r = rng(hashString(seed + visual));
    const area = (region.rx * region.ry) / (150 * 150);
    const n = count ?? Math.max(1, Math.round((DENSITY[visual] ?? 10) * area * density));
    const margin = (SIZE[visual] ?? 14) * scale * 0.6;
    const out: { x: number; y: number; rot: number; s: number; flip: boolean }[] = [];
    for (let i = 0; i < n; i++) {
      // Répartition uniforme dans l'ellipse (racine carrée pour éviter l'agglomération au centre).
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r());
      const x = region.cx + Math.cos(a) * d * Math.max(region.rx - margin, 4);
      const y = region.cy + Math.sin(a) * d * Math.max(region.ry - margin * squash, 2);
      out.push({ x, y, rot: r() * 360, s: scale * (0.82 + r() * 0.36), flip: r() > 0.5 });
    }
    // Les morceaux du fond sont dessinés d'abord.
    return out.sort((a, b) => a.y - b.y);
  }, [seed, visual, region.cx, region.cy, region.rx, region.ry, density, scale, squash, count]);

  if (visual === 'none' || visual === 'size') return null;
  if (isSauce(visual)) return <SauceDrizzle visual={visual} region={region} seed={seed} delay={delay} animated={animated} />;
  if (visual === 'cheesesauce') return <CheeseFlow p={p} region={region} seed={seed} delay={delay} animated={animated} />;

  return (
    <g filter={`url(#${p}-f-soft)`}>
      {pieces.map((pc, i) => (
        <g key={i} transform={`translate(${pc.x.toFixed(1)} ${pc.y.toFixed(1)}) scale(1 ${squash})`}>
          <motion.g
            initial={animated ? { y: -drop - (i % 5) * 12, opacity: 0, rotate: pc.rot - 90, scale: pc.s * 1.15 } : false}
            animate={{ y: 0, opacity: 1, rotate: pc.rot, scale: pc.s }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.7, delay: delay + i * 0.022 }}
          >
            <use href={`#${p}-${visual}`} transform={pc.flip ? 'scale(-1 1)' : undefined} />
          </motion.g>
        </g>
      ))}
    </g>
  );
}

/** Filet de sauce : tracé en zigzag qui se dessine progressivement. */
function SauceDrizzle({ visual, region, seed, delay, animated }: { visual: VisualKey; region: Region; seed: string; delay: number; animated: boolean }) {
  const [base, hi] = SAUCE_COLORS[visual] ?? ['#eee', '#fff'];
  const d = useMemo(() => {
    const r = rng(hashString(seed + visual));
    const k = 3.2 + r() * 1.6; // nombre d'allers-retours
    const phase = r() * Math.PI * 2;
    const pts: string[] = [];
    const N = 90;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const y = region.cy - region.ry * 0.72 + t * region.ry * 1.44 + Math.sin(t * 40 + phase) * 2;
      const edge = Math.sqrt(Math.max(0.08, 1 - Math.pow((y - region.cy) / region.ry, 2)));
      const x = region.cx + Math.sin(t * Math.PI * 2 * k + phase) * region.rx * 0.78 * edge + (r() - 0.5) * 3;
      pts.push(`${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, [seed, visual, region.cx, region.cy, region.rx, region.ry]);

  const tr = { duration: 1.1, ease: [0.45, 0, 0.2, 1] as const, delay };
  return (
    <g>
      <motion.path d={d} fill="none" stroke="#000" strokeOpacity=".22" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" transform="translate(0 2)"
        initial={animated ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={tr} />
      <motion.path d={d} fill="none" stroke={base} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"
        initial={animated ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={tr} />
      <motion.path d={d} fill="none" stroke={hi} strokeOpacity=".6" strokeWidth="1.3" strokeLinecap="round" transform="translate(-0.8 -1.2)"
        initial={animated ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={tr} />
    </g>
  );
}

/** Sauce fromagère : nappe qui coule et se répand, avec quelques coulures. */
function CheeseFlow({ p, region, seed, delay, animated }: { p: string; region: Region; seed: string; delay: number; animated: boolean }) {
  const { blob, drips } = useMemo(() => {
    const r = rng(hashString(seed + 'cheese'));
    const pts = 22;
    let d = '';
    const coords: [number, number][] = [];
    for (let i = 0; i < pts; i++) {
      const a = (i / pts) * Math.PI * 2;
      const k = 0.74 + r() * 0.2;
      coords.push([region.cx + Math.cos(a) * region.rx * k, region.cy + Math.sin(a) * region.ry * k]);
    }
    coords.forEach(([x, y], i) => {
      const [nx, ny] = coords[(i + 1) % pts];
      const mx = (x + nx) / 2; const my = (y + ny) / 2;
      d += i === 0 ? `M${mx.toFixed(1)},${my.toFixed(1)} ` : `Q${x.toFixed(1)},${y.toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)} `;
    });
    const [x0, y0] = coords[0]; const [x1, y1] = coords[1];
    d += `Q${x0.toFixed(1)},${y0.toFixed(1)} ${((x0 + x1) / 2).toFixed(1)},${((y0 + y1) / 2).toFixed(1)} Z`;
    const ds = Array.from({ length: 5 }).map(() => {
      const a = Math.PI * (0.15 + r() * 0.7);
      const x = region.cx + Math.cos(a) * region.rx * 0.78;
      const y = region.cy + Math.sin(a) * region.ry * 0.78;
      return { x, y, len: 10 + r() * 18 };
    });
    return { blob: d, drips: ds };
  }, [seed, region.cx, region.cy, region.rx, region.ry]);

  return (
    <g>
      <motion.path d={blob} fill={`url(#${p}-g-cheese)`} opacity={0.66}
        style={{ transformBox: 'fill-box', transformOrigin: '50% 0%' }}
        initial={animated ? { scaleY: 0.05, scaleX: 0.6, opacity: 0 } : false}
        animate={{ scaleY: 1, scaleX: 1, opacity: 0.66 }}
        transition={{ duration: 1.3, ease: [0.3, 0.7, 0.2, 1], delay }} />
      <motion.path d={blob} fill="none" stroke="#fff3c0" strokeOpacity=".55" strokeWidth="2" transform="translate(-2 -3) scale(1)"
        initial={animated ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: delay + 0.5 }} />
      {drips.map((dr, i) => (
        <motion.path key={i} d={`M${dr.x.toFixed(1)},${dr.y.toFixed(1)} l0,${dr.len.toFixed(1)}`} stroke="#f5bd3c" strokeWidth="6" strokeLinecap="round"
          initial={animated ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: delay + 0.9 + i * 0.12 }} />
      ))}
    </g>
  );
}
