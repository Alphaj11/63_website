'use client';
import { motion } from 'framer-motion';
import { useSafeReducedMotion } from '@/lib/useSafeReducedMotion';
import { useEffect } from 'react';
import { IngredientDefs } from './IngredientDefs';
import { IngredientLayer, isSauce } from './IngredientLayer';
import type { BuilderConfig, Selection, VisualKey } from '@/lib/types';

export type KebabPhase = 'build' | 'close' | 'done';

/** Épaisseur visuelle (px) de chaque type d'ingrédient dans l'empilement. */
const THICK: Partial<Record<VisualKey, number>> = {
  doner: 44, chicken: 38, minced: 32, lettuce: 20, tomato: 16, onion: 12, redonion: 12, cabbage: 14,
  cheddar: 12, grated: 10, egg: 14, pepper: 12,
};
/** Nombre de morceaux par couche (couches fines vues de profil). */
const COUNT: Partial<Record<VisualKey, number>> = {
  doner: 70, chicken: 50, minced: 60, lettuce: 26, tomato: 13, onion: 18, redonion: 18, cabbage: 34,
  cheddar: 9, grated: 30, egg: 3, pepper: 18,
};

const BREADS: Record<string, { fill: string; edge: string; spot: string; thick: number; label: string }> = {
  'bread-pita': { fill: '#e9c27e', edge: '#b98140', spot: '#8a5420', thick: 1, label: 'pita' },
  'bread-galette': { fill: '#f1dcae', edge: '#cda56a', spot: '#9a6a32', thick: 0.6, label: 'galette' },
  'bread-turkish': { fill: '#d99a4e', edge: '#9b5c22', spot: '#5e3412', thick: 1.35, label: 'turc' },
};

const BASE_Y = 300;
const X0 = 100, X1 = 500;

export function KebabScene({ config, sel, phase, onPhaseEnd, still, p = 'kb' }: {
  config: BuilderConfig; sel: Selection; phase: KebabPhase; onPhaseEnd?: (p: KebabPhase) => void; still?: boolean; p?: string;
}) {
  const reduce = useSafeReducedMotion() || still;

  useEffect(() => {
    if (phase !== 'close') return;
    const t = setTimeout(() => onPhaseEnd?.('close'), reduce ? 50 : 1900);
    return () => clearTimeout(t);
  }, [phase, reduce, onPhaseEnd]);

  const bread = config.steps[0].options.find((o) => o.id === sel.pain?.[0]);
  const b = bread ? BREADS[bread.visual] : null;

  // Construit l'empilement : viande, crudités, suppléments, puis sauces en surface.
  const order = ['viande', 'crudites', 'supplements', 'sauces'];
  let cum = 0;
  const layers: { key: string; visual: VisualKey; cy: number; ry: number; rx: number; idx: number }[] = [];
  let idx = 0;
  for (const stepId of order) {
    const step = config.steps.find((s) => s.id === stepId);
    for (const id of sel[stepId] ?? []) {
      const o = step?.options.find((x) => x.id === id);
      if (!o || o.visual === 'none') continue;
      if (isSauce(o.visual)) {
        layers.push({ key: `${stepId}-${id}`, visual: o.visual, cy: BASE_Y - cum - 4, ry: 10, rx: 170, idx: idx++ });
        cum += 3;
        continue;
      }
      const th = THICK[o.visual] ?? 12;
      layers.push({ key: `${stepId}-${id}`, visual: o.visual, cy: BASE_Y - cum - th / 2, ry: th / 2 + 2, rx: 182 - idx * 3, idx: idx++ });
      cum += th * 0.8;
    }
  }
  const stackH = cum;
  const closed = phase !== 'build';
  const bt = (b?.thick ?? 1);

  const lidY = BASE_Y - stackH - 6;
  const lidAngle = closed ? 1.5 : -30;

  return (
    <div className="relative h-full w-full [perspective:1200px]">
      <motion.div className="h-full w-full" initial={false}
        animate={reduce ? {} : { rotateX: closed ? 6 : 14, rotateY: closed ? -6 : 0, scale: phase === 'done' ? 1.06 : 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
        <svg viewBox="0 0 600 440" className="h-full w-full overflow-visible" role="img" aria-label="Kebab en cours de composition">
          <defs>
            <linearGradient id={`${p}-bread`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={b?.fill ?? '#3a3532'} />
              <stop offset="1" stopColor={b?.edge ?? '#2a2624'} />
            </linearGradient>
            <linearGradient id={`${p}-kraft`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#b48a5a" />
              <stop offset="0.5" stopColor="#d2ab7a" />
              <stop offset="1" stopColor="#a67b4b" />
            </linearGradient>
            <filter id={`${p}-blur`}><feGaussianBlur stdDeviation="8" /></filter>
          </defs>
          <IngredientDefs p={p} />

          {/* Ardoise */}
          <ellipse cx="300" cy="372" rx="260" ry="34" fill="#000" opacity=".55" filter={`url(#${p}-blur)`} />
          <path d="M60,350 L540,350 L520,372 L80,372 Z" fill="#1f1d1b" stroke="#2f2b28" />

          {/* Pain du dessous */}
          {b ? (
            <motion.g key={bread?.id} initial={reduce ? false : { y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 16 }}>
              <path d={`M${X0},${BASE_Y} Q300,${BASE_Y + 22} ${X1},${BASE_Y} Q${X1 + 12},${BASE_Y + 14 * bt} ${X1 - 2},${BASE_Y + 28 * bt} Q300,${BASE_Y + 50 + 22 * bt} ${X0 + 2},${BASE_Y + 28 * bt} Q${X0 - 12},${BASE_Y + 14 * bt} ${X0},${BASE_Y}Z`}
                fill={`url(#${p}-bread)`} stroke={b.edge} strokeWidth="1.5" />
              {[140, 190, 250, 310, 370, 430, 470].map((x, i) => (
                <ellipse key={i} cx={x} cy={BASE_Y + 22 * bt + 8 + (i % 2) * 4} rx="6" ry="2.4" fill={b.spot} opacity=".4" />
              ))}
            </motion.g>
          ) : (
            <path d={`M${X0},${BASE_Y} Q300,${BASE_Y + 22} ${X1},${BASE_Y} Q${X1 + 12},${BASE_Y + 14} ${X1 - 2},${BASE_Y + 28} Q300,${BASE_Y + 72} ${X0 + 2},${BASE_Y + 28} Q${X0 - 12},${BASE_Y + 14} ${X0},${BASE_Y}Z`}
              fill="none" stroke="#E9C88D" strokeOpacity=".35" strokeDasharray="6 8" strokeWidth="2" />
          )}

          {/* Garniture empilée */}
          {layers.map((l) => (
            <IngredientLayer key={l.key} p={p} visual={l.visual} seed={l.key} still={still}
              region={{ cx: 300, cy: l.cy, rx: l.rx, ry: l.ry }} squash={0.62} scale={1.3} drop={120} count={COUNT[l.visual]} />
          ))}

          {/* Pain du dessus, articulé à gauche */}
          {b && (
            <g transform={`translate(${X0 - 4} ${lidY})`}>
              <motion.g initial={false} animate={{ rotate: lidAngle, y: closed ? 2 : 0 }} style={{ originX: 0, originY: 1 }}
                transition={{ type: 'spring', stiffness: 70, damping: 13, delay: closed && !reduce ? 0.1 : 0 }}>
                <path d={`M0,0 Q200,${-40 - 14 * bt} 404,0 Q414,${8 * bt} 402,${16 * bt} Q200,${-14 * bt} 2,${16 * bt} Q-8,${8 * bt} 0,0Z`}
                  fill={`url(#${p}-bread)`} stroke={b.edge} strokeWidth="1.5" transform={`translate(0 ${-16 * bt})`} />
                {[60, 120, 190, 260, 320].map((x, i) => (
                  <ellipse key={i} cx={x} cy={-22 * bt - (i % 2 ? 6 : 2) - Math.sin((x / 404) * Math.PI) * 12} rx="7" ry="2.6" fill={b.spot} opacity=".45" />
                ))}
                {bread?.id === 'turc' && [80, 150, 230, 300].map((x, i) => (
                  <ellipse key={`s${i}`} cx={x} cy={-30 - Math.sin((x / 404) * Math.PI) * 10} rx="2" ry="1.2" fill="#fbf0d6" />
                ))}
              </motion.g>
            </g>
          )}

          {/* Papier kraft qui enveloppe le sandwich à la fermeture */}
          <motion.g initial={false} animate={{ opacity: phase === 'done' ? 1 : 0, y: phase === 'done' ? 0 : 60 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <path d={`M${X0 + 150},${BASE_Y - stackH * 0.4} L${X1 + 14},${BASE_Y - stackH * 0.55} L${X1 + 18},${BASE_Y + 46} L${X0 + 150},${BASE_Y + 60} Z`} fill={`url(#${p}-kraft)`} opacity=".97" />
            <path d={`M${X0 + 150},${BASE_Y - stackH * 0.4} L${X0 + 150},${BASE_Y + 60}`} stroke="#8a6438" strokeWidth="2" />
            <text x={X0 + 300} y={BASE_Y + 22} textAnchor="middle" fill="#151515" fontSize="22" letterSpacing="4" fontFamily="Anton, sans-serif">GH·63</text>
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}
