'use client';
import { motion } from 'framer-motion';

/**
 * Plancha / presse à panini en SVG.
 * `state` : hidden → visible (grill chaud) → pressing (presse abaissée) → lifted.
 */
export function CookingAnimation({ state, cx = 300, cy = 300, w = 400 }: { state: 'hidden' | 'visible' | 'pressing' | 'lifted'; cx?: number; cy?: number; w?: number }) {
  const shown = state !== 'hidden';
  const pressing = state === 'pressing';
  const h = w * 0.86;
  const x = cx - w / 2;
  const y = cy - h / 2;
  return (
    <>
      {/* Plaque inférieure */}
      <motion.g initial={false} animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 0.9 }} transition={{ duration: 0.6 }} style={{ originX: 0.5, originY: 0.5 }}>
        <rect x={x - 18} y={y - 18} width={w + 36} height={h + 36} rx="26" fill="#0b0b0b" stroke="#2d2a27" strokeWidth="2" />
        <rect x={x} y={y} width={w} height={h} rx="14" fill="#1a1715" />
        {Array.from({ length: 11 }).map((_, i) => {
          const yy = y + 18 + i * ((h - 36) / 10);
          return (
            <g key={i}>
              <rect x={x + 12} y={yy - 3} width={w - 24} height="6" rx="3" fill="#2b2522" />
              <motion.rect x={x + 12} y={yy - 2} width={w - 24} height="4" rx="2" fill="#ff5a1f"
                initial={false} animate={{ opacity: shown ? [0.35, 0.75, 0.45, 0.8] : 0 }}
                transition={{ duration: 2.2, repeat: Infinity, repeatType: 'mirror', delay: i * 0.08 }} />
            </g>
          );
        })}
        <rect x={x} y={y} width={w} height={h} rx="14" fill="url(#grill-glow)" opacity=".6" />
      </motion.g>

      {/* Fumée de cuisson */}
      {pressing && (
        <g filter="url(#smoke-blur)">
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.circle key={i} cx={x + 40 + i * (w - 80) / 8} cy={y + 30} r={22 + (i % 3) * 8} fill="#d9d2c8"
              initial={{ opacity: 0, y: 0, scale: 0.6 }}
              animate={{ opacity: [0, 0.35, 0], y: -180 - (i % 4) * 30, scale: 1.8 }}
              transition={{ duration: 2.4, delay: i * 0.12, repeat: 1, ease: 'easeOut' }} />
          ))}
        </g>
      )}

      {/* Presse supérieure */}
      <motion.g initial={false}
        animate={{ y: pressing ? 0 : -h - 220, opacity: state === 'hidden' ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: pressing ? 16 : 22 }}>
        <rect x={x - 22} y={y - 10} width={w + 44} height={h + 20} rx="28" fill="url(#press-metal)" stroke="#4a4541" strokeWidth="2" />
        <rect x={x + w * 0.2} y={y + h * 0.42} width={w * 0.6} height={h * 0.16} rx="14" fill="#151312" stroke="#5b5650" />
        <text x={cx} y={y + h * 0.52} textAnchor="middle" fill="#E9C88D" fontSize="20" letterSpacing="6" fontFamily="Anton, sans-serif">GRILL HOUSE 63</text>
      </motion.g>
    </>
  );
}

/** Dégradés communs au grill (à placer dans <defs>). */
export function CookingDefs() {
  return (
    <>
      <radialGradient id="grill-glow" cx="50%" cy="50%" r="60%">
        <stop offset="0" stopColor="#ff6a2a" stopOpacity=".35" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="press-metal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3a3734" />
        <stop offset="0.5" stopColor="#1d1b19" />
        <stop offset="1" stopColor="#2c2926" />
      </linearGradient>
      <filter id="smoke-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" /></filter>
    </>
  );
}
