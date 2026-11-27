'use client';
import { motion } from 'framer-motion';
import { useSafeReducedMotion } from '@/lib/useSafeReducedMotion';
import { useEffect, useMemo, useState } from 'react';
import { IngredientDefs } from './IngredientDefs';
import { IngredientLayer } from './IngredientLayer';
import { CookingAnimation, CookingDefs } from './CookingAnimation';
import { visualsOf } from '@/lib/builder';
import { usePhoto } from '@/lib/usePhoto';
import { PHOTOS } from '@/data/media';
import { PhotoTile, photoUrlFor } from './PhotoIngredient';
import { rng } from '@/lib/rng';
import type { BuilderConfig, Selection } from '@/lib/types';

export type TacosPhase = 'build' | 'fold' | 'grill' | 'done';

const C = 300, R = 230, H = 150;
const W = Math.sqrt(R * R - H * H); // demi-corde
const FLAPS = {
  top: `M${C - W},${C - H} A${R} ${R} 0 0 1 ${C + W},${C - H} Z`,
  bottom: `M${C + W},${C + H} A${R} ${R} 0 0 1 ${C - W},${C + H} Z`,
  left: `M${C - H},${C + W} A${R} ${R} 0 0 1 ${C - H},${C - W} Z`,
  right: `M${C + H},${C - W} A${R} ${R} 0 0 1 ${C + H},${C + W} Z`,
};
const FOLD_ORDER = ['top', 'bottom', 'left', 'right'] as const;
const REGION = { cx: C, cy: C, rx: 128, ry: 128 };

export function TacosScene({ config, sel, phase, onPhaseEnd, still, p = 'tc', externalGrill }: {
  config: BuilderConfig; sel: Selection; phase: TacosPhase; onPhaseEnd?: (p: TacosPhase) => void; still?: boolean; p?: string;
  /** Le passage au grill est joué par une séquence vidéo (GrillVideo) : la scène attend simplement la phase suivante. */
  externalGrill?: boolean;
}) {
  const reduce = useSafeReducedMotion() || still;
  const [grillState, setGrillState] = useState<'hidden' | 'visible' | 'pressing' | 'lifted'>('hidden');

  // Orchestration des phases finales.
  useEffect(() => {
    if (phase === 'fold') {
      const t = setTimeout(() => onPhaseEnd?.('fold'), reduce ? 50 : 2500);
      return () => clearTimeout(t);
    }
    if (phase === 'grill') {
      if (externalGrill && !reduce) { setGrillState('hidden'); return; }
      if (reduce) { setGrillState('lifted'); const t = setTimeout(() => onPhaseEnd?.('grill'), 50); return () => clearTimeout(t); }
      setGrillState('visible');
      const t1 = setTimeout(() => setGrillState('pressing'), 900);
      const t2 = setTimeout(() => setGrillState('lifted'), 3300);
      const t3 = setTimeout(() => onPhaseEnd?.('grill'), 4300);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
    if (phase === 'build') setGrillState('hidden');
    if (phase === 'done') setGrillState((g) => (g === 'hidden' ? 'hidden' : 'lifted'));
  }, [phase, reduce, onPhaseEnd, externalGrill]);

  const tortillaPhoto = usePhoto(photoUrlFor('tortilla')) === 'ready';
  const tort = tortillaPhoto ? `url(#${p}-tphoto)` : `url(#${p}-tortilla)`;
  const size = sel.taille?.[0];
  const sizeScale = size === 'm' ? 0.86 : size === 'xl' ? 1.08 : size === 'l' ? 0.97 : 0.92;
  const folded = phase !== 'build';
  const closed = phase === 'grill' || phase === 'done';
  const golden = grillState === 'lifted' || phase === 'done';

  const meats = visualsOf(config, sel, 'viandes');
  const fries = visualsOf(config, sel, 'frites');
  const cheese = visualsOf(config, sel, 'fromagere');
  const sauces = visualsOf(config, sel, 'sauces');
  const extras = visualsOf(config, sel, 'supplements');

  const spots = useMemo(() => {
    const r = rng(63);
    return Array.from({ length: 70 }).map(() => {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * (R - 8);
      return { x: C + Math.cos(a) * d, y: C + Math.sin(a) * d, rx: 2 + r() * 6, ry: 1.5 + r() * 4, rot: r() * 180, o: 0.12 + r() * 0.3 };
    });
  }, []);

  // Caméra : inclinaison et zoom selon la phase.
  const camera = {
    build: { rotateX: 34, scale: 1, y: 0 },
    fold: { rotateX: 22, scale: 1.04, y: 0 },
    grill: { rotateX: 46, scale: 0.9, y: 10 },
    done: { rotateX: 16, scale: 1.08, y: -6 },
  }[phase];

  return (
    <div className="relative h-full w-full [perspective:1400px]">
      <motion.div className="h-full w-full" initial={false} animate={reduce ? { rotateX: 20 } : camera}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} style={{ transformStyle: 'preserve-3d' }}>
        <svg viewBox="0 0 600 600" className="h-full w-full overflow-visible" role="img"
          aria-label={phase === 'done' ? 'Tacos grillé, prêt' : 'Tortilla en cours de garniture'}>
          <defs>
            <radialGradient id={`${p}-tortilla`} cx={C} cy={C} r={R} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#f6e6c2" />
              <stop offset="0.75" stopColor="#ecd29e" />
              <stop offset="1" stopColor="#d6ac68" />
            </radialGradient>
            <linearGradient id={`${p}-golden`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#e7a34c" />
              <stop offset="0.5" stopColor="#d1883a" />
              <stop offset="1" stopColor="#b8692a" />
            </linearGradient>
            <linearGradient id={`${p}-shine`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity=".55" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            {PHOTOS.tortilla && (
              <pattern id={`${p}-tphoto`} patternUnits="userSpaceOnUse" x={C - R} y={C - R} width={R * 2} height={R * 2}>
                <rect width={R * 2} height={R * 2} fill="#ecd29e" />
                <g transform={`translate(${R} ${R})`}><PhotoTile src={PHOTOS.tortilla} size={R * 2} /></g>
                <rect width={R * 2} height={R * 2} fill={`url(#${p}-tedge)`} />
              </pattern>
            )}
            <radialGradient id={`${p}-tedge`} cx=".5" cy=".5" r=".5">
              <stop offset=".72" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#5a3412" stopOpacity=".35" />
            </radialGradient>
            <clipPath id={`${p}-sq`}><rect x={C - H} y={C - H} width={H * 2} height={H * 2} rx="30" /></clipPath>
            <CookingDefs />
            <filter id="grill-mark-blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.2" /></filter>
          </defs>
          <IngredientDefs p={p} />

          {/* Ombre portée */}
          <ellipse cx={C} cy={C + 18} rx={R * 0.98} ry={R * 0.98} fill="#000" opacity=".45" filter="url(#smoke-blur)" />

          <CookingAnimation state={grillState === 'lifted' && phase === 'done' ? 'lifted' : grillState} />

          <motion.g initial={false} animate={{ scale: closed ? 0.82 : sizeScale, y: grillState === 'pressing' ? 4 : 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 16 }} style={{ originX: 0.5, originY: 0.5 }}>
            {/* Disque complet (sans jointures) tant que la tortilla est ouverte */}
            <motion.circle cx={C} cy={C} r={R} fill={tort} initial={false} animate={{ opacity: folded ? 0 : 1 }} transition={{ duration: 0.2 }} />
            {spots.map((s, i) => (
              <motion.ellipse key={`o${i}`} cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} fill="#9c6224" initial={false} animate={{ opacity: folded || tortillaPhoto ? 0 : s.o }} transform={`rotate(${s.rot} ${s.x} ${s.y})`} />
            ))}
            {/* Base de la tortilla (carré central) */}
            <rect x={C - H} y={C - H} width={H * 2} height={H * 2} fill={tort} />
            {!tortillaPhoto && spots.filter((s) => Math.abs(s.x - C) < H && Math.abs(s.y - C) < H).map((s, i) => (
              <ellipse key={i} cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} fill="#9c6224" opacity={s.o} transform={`rotate(${s.rot} ${s.x} ${s.y})`} />
            ))}

            {/* Garniture : ordre de superposition réaliste */}
            <g opacity={closed ? 0 : 1}>
              {meats.map((m, i) => (
                <IngredientLayer key={`m-${m.id}`} p={p} visual={m.visual} seed={`meat${i}`} still={still}
                  region={{ ...REGION, rx: REGION.rx - i * 8, ry: REGION.ry - i * 8 }} density={meats.length > 1 ? 1.5 / Math.sqrt(meats.length) : 1.9} scale={1.6} />
              ))}
              {fries.map((f) => <IngredientLayer key="fries" p={p} visual={f.visual} seed="fries" region={{ ...REGION, rx: 112, ry: 112 }} scale={1.45} density={1.2} still={still} />)}
              {cheese.map((c) => <IngredientLayer key="cheese" p={p} visual={c.visual} seed="cheese" region={{ ...REGION, rx: 108, ry: 104 }} still={still} />)}
              {extras.map((e, i) => <IngredientLayer key={`e-${e.id}`} p={p} visual={e.visual} seed={`x${i}`} region={{ ...REGION, rx: 100, ry: 100 }} density={1.2} scale={1.5} still={still} />)}
              {sauces.map((s, i) => <IngredientLayer key={`s-${s.id}`} p={p} visual={s.visual} seed={`s${i}`} region={{ ...REGION, rx: 118 - i * 10, ry: 112 - i * 10 }} still={still} />)}
            </g>

            {/* Rabats qui se replient vers le centre */}
            {FOLD_ORDER.map((k, i) => {
              const vertical = k === 'top' || k === 'bottom';
              const origin = k === 'top' ? { originX: 0.5, originY: 1 } : k === 'bottom' ? { originX: 0.5, originY: 0 } : k === 'left' ? { originX: 1, originY: 0.5 } : { originX: 0, originY: 0.5 };
              return (
                <motion.path key={k} d={FLAPS[k]} fill={tort} stroke="#c99a58" strokeWidth={folded ? 1.2 : 0}
                  style={{ ...origin, transformBox: 'fill-box' }}
                  initial={false}
                  animate={{
                    [vertical ? 'scaleY' : 'scaleX']: folded ? -1 : 1,
                    opacity: folded && !closed ? 1 : 0,
                    filter: folded ? 'brightness(0.92)' : 'brightness(1)',
                  }}
                  transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : folded && !closed ? i * 0.42 : 0, ease: [0.6, 0, 0.3, 1], opacity: { duration: 0, delay: closed && !reduce ? 0.5 : 0 } }} />
              );
            })}

            {/* Tacos fermé, puis doré au grill */}
            <motion.g initial={false} animate={{ opacity: closed || phase === 'fold' ? 1 : 0 }}
              transition={{ duration: 0.5, delay: phase === 'fold' && !reduce ? 1.9 : 0 }}>
              <rect x={C - H} y={C - H} width={H * 2} height={H * 2} rx="30" fill={tort} stroke="#c99a58" strokeWidth="2" />
              <path d={`M${C - H + 30},${C - H + 46} Q${C},${C - H + 70} ${C + H - 30},${C - H + 46}`} stroke="#b88a4c" strokeWidth="2" fill="none" opacity=".6" />
              <path d={`M${C - H + 46},${C + H - 30} Q${C - H + 70},${C} ${C - H + 46},${C - H + 30}`} stroke="#b88a4c" strokeWidth="2" fill="none" opacity=".5" />
              <motion.rect x={C - H} y={C - H} width={H * 2} height={H * 2} rx="30" fill={`url(#${p}-golden)`}
                style={tortillaPhoto ? { mixBlendMode: 'multiply' } : undefined}
                initial={false} animate={{ opacity: golden ? (tortillaPhoto ? 0.8 : 0.88) : 0 }} transition={{ duration: 1.2 }} />
              {/* Marques de grill */}
              <g clipPath={`url(#${p}-sq)`}>
                <g filter="url(#grill-mark-blur)">
                {Array.from({ length: 12 }).map((_, i) => {
                  const x0 = C - H - 160 + i * 34;
                  return (
                    <motion.path key={i} d={`M${x0},${C - H - 10} L${x0 + 170},${C + H + 10}`} stroke="#3d1c0a" strokeWidth="9" strokeLinecap="round"
                      initial={false} animate={{ pathLength: golden ? 1 : 0, opacity: golden ? 0.42 : 0 }}
                      transition={{ duration: 0.5, delay: golden && !reduce ? 0.15 + i * 0.05 : 0 }} />
                  );
                })}
                </g>
              </g>
              {/* Reflet final */}
              {phase === 'done' && !reduce && (
                <g clipPath={`url(#${p}-sq)`}>
                  <motion.rect y={C - H - 40} width="90" height={H * 2 + 80} fill={`url(#${p}-shine)`} transform="skewX(-20)"
                    initial={{ x: C - H - 200 }} animate={{ x: C + H + 200 }} transition={{ duration: 1.4, delay: 0.3, repeat: Infinity, repeatDelay: 2.6 }} />
                </g>
              )}
            </motion.g>
          </motion.g>

          {/* Vapeur à la sortie du grill */}
          {phase === 'done' && !reduce && (
            <g filter="url(#smoke-blur)">
              {[0, 1, 2, 3].map((i) => (
                <motion.ellipse key={i} cx={C - 80 + i * 55} cy={C - 120} rx="22" ry="40" fill="#f1e9dc"
                  initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 0.28, 0], y: -140 }}
                  transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }} />
              ))}
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
