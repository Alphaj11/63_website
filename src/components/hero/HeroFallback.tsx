'use client';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { rng } from '@/lib/rng';

/**
 * Alternative 2D (sans WebGL, économie de données ou mouvement réduit).
 * Broche illustrée en SVG, texture qui défile pour simuler la rotation, braises en CSS.
 */
export function HeroFallback({ instant }: { instant: boolean }) {
  const strips = useMemo(() => {
    const r = rng(7);
    let y = 0; const out: { y: number; h: number; c: string }[] = [];
    while (y < 520) { const h = 8 + r() * 18; out.push({ y, h, c: `hsl(${16 + r() * 14},${48 + r() * 20}%,${18 + r() * 22}%)` }); y += h * 0.8; }
    return out;
  }, []);
  const embers = useMemo(() => {
    const r = rng(11);
    return Array.from({ length: 26 }).map(() => ({ left: 30 + r() * 55, delay: r() * 6, dur: 5 + r() * 5, size: 2 + r() * 3 }));
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden>
      <div className="absolute inset-0 flex items-center justify-center pt-16">
      <motion.svg viewBox="0 0 600 700" className="h-[84%] w-auto"
        initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: instant ? 0.2 : 1.4, delay: instant ? 0 : 1.1 }}>
        <defs>
          <clipPath id="hf-cone"><path d="M188,110 Q300,90 412,110 L370,600 Q300,616 230,600 Z" /></clipPath>
          <linearGradient id="hf-shade" x1="0" x2="1">
            <stop offset="0" stopColor="#000" stopOpacity=".75" /><stop offset=".35" stopColor="#000" stopOpacity="0" />
            <stop offset=".55" stopColor="#ffb070" stopOpacity=".18" /><stop offset="1" stopColor="#000" stopOpacity=".8" />
          </linearGradient>
          <radialGradient id="hf-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ff4a12" stopOpacity=".7" /><stop offset="1" stopColor="#ff4a12" stopOpacity="0" /></radialGradient>
          <pattern id="hf-char" width="80" height="60" patternUnits="userSpaceOnUse">
            <ellipse cx="20" cy="14" rx="9" ry="3" fill="#1c0802" opacity=".5" /><ellipse cx="60" cy="40" rx="7" ry="2.5" fill="#1c0802" opacity=".45" />
            <ellipse cx="44" cy="22" rx="5" ry="2" fill="#f0a060" opacity=".25" />
          </pattern>
        </defs>
        <ellipse cx="110" cy="360" rx="120" ry="300" fill="url(#hf-glow)" />
        <rect x="70" y="80" width="40" height="560" rx="6" fill="#121212" stroke="#2a2a2a" />
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} x="104" y={110 + i * 56} width="4" height="34" rx="2" fill="#ff4a12" className="animate-flicker" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
        <rect x="296" y="20" width="8" height="640" fill="#8c8c8c" />
        <g clipPath="url(#hf-cone)">
          <motion.g animate={instant ? {} : { x: [0, -80] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
            {strips.map((s, i) => <rect key={i} x="100" y={90 + s.y} width="500" height={s.h} fill={s.c} />)}
            <rect x="100" y="90" width="500" height="540" fill="url(#hf-char)" />
          </motion.g>
          <rect x="180" y="80" width="240" height="560" fill="url(#hf-shade)" />
        </g>
        <ellipse cx="300" cy="612" rx="110" ry="12" fill="#555" />
      </motion.svg>
      </div>
      {embers.map((e, i) => (
        <span key={i} className="absolute bottom-0 rounded-full bg-[#ffb070] shadow-[0_0_8px_#ff7a2a]"
          style={{ left: `${e.left}%`, width: e.size, height: e.size, animation: `rise ${e.dur}s linear ${e.delay}s infinite` }} />
      ))}
      <style>{`@keyframes rise{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-90vh) translateX(20px);opacity:0}}`}</style>
    </div>
  );
}
