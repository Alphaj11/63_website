'use client';
import { motion } from 'framer-motion';
import { useSafeReducedMotion } from '@/lib/useSafeReducedMotion';
import { useEffect } from 'react';
import { IngredientDefs } from './IngredientDefs';
import { IngredientLayer } from './IngredientLayer';
import { visualsOf } from '@/lib/builder';
import type { BuilderConfig, Selection } from '@/lib/types';

export type KumpirPhase = 'build' | 'serve' | 'done';

const CX = 300, CY = 222;

export function KumpirScene({ config, sel, phase, onPhaseEnd, still, p = 'kp' }: {
  config: BuilderConfig; sel: Selection; phase: KumpirPhase; onPhaseEnd?: (p: KumpirPhase) => void; still?: boolean; p?: string;
}) {
  const reduce = useSafeReducedMotion() || still;
  useEffect(() => {
    if (phase !== 'serve') return;
    const t = setTimeout(() => onPhaseEnd?.('serve'), reduce ? 50 : 1600);
    return () => clearTimeout(t);
  }, [phase, reduce, onPhaseEnd]);

  const base = sel.base?.[0];
  const open = !!base;
  const withCheese = base === 'classique';
  const toppings = visualsOf(config, sel, 'garnitures');
  const protein = visualsOf(config, sel, 'proteine');
  const sauces = visualsOf(config, sel, 'sauces');
  const served = phase !== 'build';
  const d = (s: number) => (reduce ? 0 : s);

  return (
    <div className="relative h-full w-full [perspective:1200px]">
      <motion.div className="h-full w-full" initial={false} animate={reduce ? {} : { rotateX: served ? 8 : 14, scale: served ? 1.05 : 1 }} transition={{ duration: 1.1 }}>
        <svg viewBox="0 0 600 440" className="h-full w-full overflow-visible" role="img" aria-label="Kumpir en préparation">
          <defs>
            <radialGradient id={`${p}-skin`} cx="45%" cy="35%" r="70%">
              <stop offset="0" stopColor="#a8703e" />
              <stop offset="0.7" stopColor="#7a4a22" />
              <stop offset="1" stopColor="#4a2a12" />
            </radialGradient>
            <radialGradient id={`${p}-flesh`} cx="50%" cy="45%" r="60%">
              <stop offset="0" stopColor="#fff6d9" />
              <stop offset="0.7" stopColor="#f6e2a6" />
              <stop offset="1" stopColor="#e2c07a" />
            </radialGradient>
            <radialGradient id={`${p}-butter`} cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#fff3a8" stopOpacity=".95" />
              <stop offset="1" stopColor="#f7d56a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`${p}-foil`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#d9dcdf" /><stop offset=".4" stopColor="#8d9298" /><stop offset=".7" stopColor="#eef0f2" /><stop offset="1" stopColor="#6b7076" />
            </linearGradient>
            <filter id={`${p}-blur`}><feGaussianBlur stdDeviation="9" /></filter>
          </defs>
          <IngredientDefs p={p} />

          {/* Assiette de présentation */}
          <motion.g initial={false} animate={{ opacity: served ? 1 : 0.0, scale: served ? 1 : 0.92 }} style={{ originX: 0.5, originY: 0.5 }} transition={{ duration: 0.8 }}>
            <ellipse cx={CX} cy={CY + 44} rx="292" ry="168" fill="#0e0d0c" stroke="#E9C88D" strokeOpacity=".35" strokeWidth="2" />
            <ellipse cx={CX} cy={CY + 44} rx="264" ry="150" fill="none" stroke="#E9C88D" strokeOpacity=".12" strokeWidth="1" />
          </motion.g>
          <ellipse cx={CX} cy={CY + 80} rx="240" ry="70" fill="#000" opacity=".6" filter={`url(#${p}-blur)`} />

          {/* Papier aluminium */}
          <path d={`M${CX - 252},${CY + 34} Q${CX - 262},${CY + 140} ${CX},${CY + 156} Q${CX + 262},${CY + 140} ${CX + 252},${CY + 34} Q${CX + 200},${CY + 96} ${CX},${CY + 104} Q${CX - 200},${CY + 96} ${CX - 252},${CY + 34}Z`} fill={`url(#${p}-foil)`} opacity=".9" />

          {/* Pomme de terre : peau */}
          <ellipse cx={CX} cy={CY + 18} rx="230" ry="126" fill={`url(#${p}-skin)`} />
          {[[-150, 40], [-60, 70], [80, 64], [170, 30], [-190, 0]].map(([x, y], i) => (
            <ellipse key={i} cx={CX + x} cy={CY + y} rx="6" ry="3" fill="#3b1f0b" opacity=".45" />
          ))}

          {/* Ouverture : la chair apparaît */}
          <motion.ellipse cx={CX} cy={CY} rx="198" ry="102" fill={`url(#${p}-flesh)`} initial={false}
            animate={{ scaleX: open ? 1 : 0.04, scaleY: open ? 1 : 0.4 }} style={{ originX: 0.5, originY: 0.5 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }} />
          {/* Lèvres de la peau */}
          <motion.path d={`M${CX - 230},${CY + 18} Q${CX},${CY - 150} ${CX + 230},${CY + 18}`} fill="none" stroke="#5c3416" strokeWidth="10" strokeLinecap="round"
            initial={false} animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.4 }} />
          <motion.ellipse cx={CX} cy={CY} rx="200" ry="104" fill="none" stroke="#6b3d18" strokeWidth="7" initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ delay: d(0.2) }} />

          {open && (
            <>
              {/* Beurre : un cube qui fond */}
              <motion.g initial={reduce ? false : { y: -140, opacity: 0 }} animate={{ y: 0, opacity: [1, 1, 0] }} transition={{ duration: 1.6, times: [0, 0.4, 1], delay: d(0.4) }}>
                <use href={`#${p}-butter`} transform={`translate(${CX} ${CY - 6}) scale(1.6)`} />
              </motion.g>
              <motion.ellipse cx={CX} cy={CY} rx="160" ry="80" fill={`url(#${p}-butter)`} initial={reduce ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }} style={{ originX: 0.5, originY: 0.5 }} transition={{ duration: 1.2, delay: d(1.1) }} />
              {withCheese && (
                <IngredientLayer p={p} visual="grated" seed="kumpir-cheese" region={{ cx: CX, cy: CY, rx: 176, ry: 88 }} delay={d(1.6)} count={70} scale={1.1} squash={0.8} still={still} />
              )}
            </>
          )}

          {/* Garnitures en sections, comme au comptoir */}
          {toppings.map((t, i) => {
            const n = toppings.length;
            const span = Math.min(370, 84 * n);
            const x = CX - span / 2 + (span / n) * (i + 0.5);
            const edge = 1 - Math.pow((x - CX) / 196, 2);
            return (
              <IngredientLayer key={t.id} p={p} visual={t.visual} seed={`kp-${t.id}`} still={still}
                region={{ cx: x, cy: CY - 2, rx: Math.min(42, span / n / 2 + 2), ry: 80 * Math.sqrt(Math.max(edge, 0.3)) }}
                squash={0.8} count={t.visual === 'corn' || t.visual === 'olive' ? 16 : 14} scale={1.2} drop={140} />
            );
          })}
          {protein.map((pr) => (
            <IngredientLayer key={pr.id} p={p} visual={pr.visual} seed="kp-protein" region={{ cx: CX, cy: CY - 4, rx: 90, ry: 46 }} squash={0.8} count={18} scale={1.3} still={still} />
          ))}
          {sauces.map((s, i) => (
            <IngredientLayer key={s.id} p={p} visual={s.visual} seed={`kp-s${i}`} region={{ cx: CX, cy: CY - 2, rx: 168 - i * 14, ry: 76 - i * 6 }} still={still} />
          ))}

          {/* Vapeur */}
          {open && !reduce && (
            <g filter={`url(#${p}-blur)`}>
              {[0, 1, 2].map((i) => (
                <motion.ellipse key={i} cx={CX - 70 + i * 70} cy={CY - 50} rx="18" ry="36" fill="#f4ede2"
                  initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 0.22, 0], y: -110 }} transition={{ duration: 3.2, delay: 0.8 + i * 0.7, repeat: Infinity }} />
              ))}
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
