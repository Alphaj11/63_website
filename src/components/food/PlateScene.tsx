'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useSafeReducedMotion } from '@/lib/useSafeReducedMotion';
import { useEffect } from 'react';
import { IngredientDefs } from './IngredientDefs';
import { IngredientLayer, SAUCE_COLORS } from './IngredientLayer';
import { visualsOf } from '@/lib/builder';
import type { BuilderConfig, Selection } from '@/lib/types';

export type PlatePhase = 'build' | 'serve' | 'done';

const RAMEKINS = [{ x: 190, y: 150 }, { x: 272, y: 116 }];
const CRUDITES = [{ cx: 440, cy: 280 }, { cx: 420, cy: 352 }, { cx: 458, cy: 216 }];

export function PlateScene({ config, sel, phase, onPhaseEnd, still, p = 'pl' }: {
  config: BuilderConfig; sel: Selection; phase: PlatePhase; onPhaseEnd?: (p: PlatePhase) => void; still?: boolean; p?: string;
}) {
  const reduce = useSafeReducedMotion() || still;
  useEffect(() => {
    if (phase !== 'serve') return;
    const t = setTimeout(() => onPhaseEnd?.('serve'), reduce ? 50 : 1500);
    return () => clearTimeout(t);
  }, [phase, reduce, onPhaseEnd]);

  const meat = visualsOf(config, sel, 'viande');
  const salad = visualsOf(config, sel, 'salade');
  const crud = visualsOf(config, sel, 'crudites');
  const sides = visualsOf(config, sel, 'accompagnement');
  const sauces = visualsOf(config, sel, 'sauces');
  const extras = visualsOf(config, sel, 'supplements');
  const served = phase !== 'build';

  return (
    <div className="relative h-full w-full [perspective:1300px]">
      <motion.div className="h-full w-full" initial={false}
        animate={reduce ? { rotateX: 30 } : { rotateX: served ? 28 : 42, rotateZ: served ? -8 : 0, scale: served ? 1.04 : 1 }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}>
        <svg viewBox="0 0 600 600" className="h-full w-full overflow-visible" role="img" aria-label="Assiette en cours de dressage">
          <defs>
            <radialGradient id={`${p}-plate`} cx="45%" cy="40%" r="65%">
              <stop offset="0" stopColor="#2a2725" /><stop offset=".82" stopColor="#1a1817" /><stop offset="1" stopColor="#0b0a0a" />
            </radialGradient>
            <radialGradient id={`${p}-rim`} cx="50%" cy="50%" r="50%">
              <stop offset=".86" stopColor="#000" stopOpacity="0" /><stop offset=".95" stopColor="#E9C88D" stopOpacity=".18" /><stop offset="1" stopColor="#000" stopOpacity=".6" />
            </radialGradient>
            <filter id={`${p}-blur`}><feGaussianBlur stdDeviation="12" /></filter>
          </defs>
          <IngredientDefs p={p} />

          <circle cx="300" cy="318" r="262" fill="#000" opacity=".6" filter={`url(#${p}-blur)`} />
          <circle cx="300" cy="300" r="262" fill={`url(#${p}-plate)`} />
          <circle cx="300" cy="300" r="262" fill={`url(#${p}-rim)`} />
          <circle cx="300" cy="300" r="214" fill="none" stroke="#E9C88D" strokeOpacity=".12" />

          {/* Ramequins de sauce */}
          {RAMEKINS.map((r, i) => {
            const s = sauces[i];
            const [base, hi] = s ? SAUCE_COLORS[s.visual] ?? ['#ddd', '#fff'] : ['#000', '#000'];
            return (
              <g key={i}>
                <circle cx={r.x} cy={r.y} r="38" fill="#0f0e0d" stroke="#3a3632" strokeWidth="3" />
                <AnimatePresence>
                  {s && (
                    <motion.g key={s.id} initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                      style={{ originX: 0.5, originY: 0.5 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                      <circle cx={r.x} cy={r.y} r="30" fill={base} />
                      <ellipse cx={r.x - 9} cy={r.y - 10} rx="10" ry="5" fill={hi} opacity=".55" />
                    </motion.g>
                  )}
                </AnimatePresence>
              </g>
            );
          })}

          {/* Salade */}
          {salad.map((s) => <IngredientLayer key="salad" p={p} visual={s.visual} seed="pl-salad" region={{ cx: 372, cy: 186, rx: 86, ry: 62 }} count={16} scale={1.35} still={still} />)}
          {/* Crudités */}
          {crud.map((c, i) => (
            <IngredientLayer key={c.id} p={p} visual={c.visual} seed={`pl-${c.id}`} region={{ ...CRUDITES[i], rx: 46, ry: 40 }} count={c.visual === 'tomato' ? 5 : 9} scale={1.2} still={still} />
          ))}
          {/* Accompagnements */}
          {sides.map((s, i) => (
            <IngredientLayer key={s.id} p={p} visual={s.visual} seed={`pl-${s.id}`} still={still}
              region={sides.length === 1 ? { cx: 330, cy: 420, rx: 100, ry: 62 } : { cx: i ? 404 : 278, cy: i ? 412 : 432, rx: 64, ry: 52 }}
              count={s.visual === 'fries' ? (sides.length === 1 ? 30 : 20) : (sides.length === 1 ? 34 : 22)} scale={s.visual === 'fries' ? 1.25 : 1.5} />
          ))}
          {/* Viande */}
          {meat.map((m) => <IngredientLayer key={m.id} p={p} visual={m.visual} seed={`pl-${m.id}`} region={{ cx: 222, cy: 300, rx: 104, ry: 92 }} count={m.visual === 'steak' ? 4 : 30} scale={m.visual === 'steak' ? 1.6 : 1.35} still={still} />)}
          {/* Suppléments posés sur la viande */}
          {extras.map((e, i) => <IngredientLayer key={e.id} p={p} visual={e.visual} seed={`pl-x${i}`} region={{ cx: 220 + i * 26, cy: 296 - i * 10, rx: 54, ry: 44 }} density={e.visual === 'egg' ? 0.8 : 1.6} scale={1.3} still={still} />)}

          {/* Vapeur au service */}
          {served && !reduce && (
            <g filter={`url(#${p}-blur)`}>
              {[0, 1, 2].map((i) => (
                <motion.ellipse key={i} cx={200 + i * 40} cy={260} rx="16" ry="40" fill="#f4ede2"
                  initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 0.2, 0], y: -120 }} transition={{ duration: 3, delay: i * 0.6, repeat: Infinity }} />
              ))}
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
