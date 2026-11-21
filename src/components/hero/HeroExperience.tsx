'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSafeReducedMotion } from '@/lib/useSafeReducedMotion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CinematicIntro } from './CinematicIntro';
import { HeroFallback } from './HeroFallback';
import { ui } from '@/i18n/ui';
import { useT } from '@/store/lang';

const DonerScene3D = dynamic(() => import('./DonerScene3D'), { ssr: false, loading: () => null });

function canUseWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

/**
 * Accueil cinématographique.
 * Scénario : écran noir → lumière rouge → fumée → broche → caméra → particules → titre → accroche → boutons.
 * L'intro dure ~4 s, se passe en un clic, et n'est jamais rejouée dans la même session.
 */
export function HeroExperience() {
  const { t } = useT();
  const reduce = useSafeReducedMotion();
  const [mode, setMode] = useState<'pending' | '3d' | '2d'>('pending');
  const [lowPower, setLowPower] = useState(false);
  const [skip, setSkip] = useState(false);
  const [ready, setReady] = useState(false);
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const sceneY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.2]);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('gh63-intro') === '1'; sessionStorage.setItem('gh63-intro', '1'); } catch { /* ignore */ }
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (seen || rm) setSkip(true);
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const weak = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 3;
    const saveData = !!nav.connection?.saveData;
    setLowPower(weak || window.innerWidth < 768);
    setMode(!rm && !saveData && canUseWebGL() ? '3d' : '2d');
    setReady(true);
  }, []);

  const instant = skip;
  const d = (s: number) => (instant ? 0 : s);

  return (
    <section ref={section} className="relative h-[100svh] min-h-[620px] overflow-hidden bg-coal" aria-label="Grill House 63">
      {/* Lumière rouge */}
      <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: instant ? 0.2 : 1.4, delay: d(0.3) }}
        style={{ background: 'radial-gradient(ellipse 60% 55% at 62% 58%, rgba(211,75,37,.38), transparent 70%), radial-gradient(ellipse 40% 30% at 20% 100%, rgba(233,200,141,.10), transparent 70%)' }} />

      {/* Scène */}
      <motion.div className="absolute inset-0 md:left-[18%]" style={reduce ? undefined : { y: sceneY, opacity: sceneOpacity }}>
        {mode === '3d' && <DonerScene3D skip={skip} lowPower={lowPower} />}
        {mode === '2d' && <HeroFallback instant={instant} />}
      </motion.div>

      {/* Fumée qui traverse l'écran */}
      {!reduce && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen" aria-hidden>
          <motion.div className="absolute -left-1/2 top-[30%] h-[60%] w-[200%] blur-3xl"
            initial={{ x: '-30%', opacity: 0 }} animate={{ x: '10%', opacity: [0, 0.5, 0.18] }} transition={{ duration: instant ? 0.01 : 5, delay: d(0.9), ease: 'easeOut' }}
            style={{ background: 'radial-gradient(ellipse 30% 40% at 30% 50%, rgba(230,220,205,.22), transparent 70%), radial-gradient(ellipse 25% 30% at 65% 40%, rgba(230,220,205,.15), transparent 70%)' }} />
          <div className="absolute inset-0 animate-drift opacity-40" style={{ background: 'radial-gradient(ellipse 35% 25% at 70% 20%, rgba(220,210,195,.08), transparent 70%)' }} />
        </div>
      )}

      {/* Vignette + grain */}
      <div className="grain pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,.75)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-coal to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-coal via-coal/60 to-transparent lg:hidden" />
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-coal/80 to-transparent lg:block" />

      {/* Titre */}
      <motion.div key={skip ? 'skip' : 'play'} style={reduce ? undefined : { y: titleY }} className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-28 sm:pb-24 lg:justify-center lg:px-8 lg:pb-0">
        <motion.p className="eyebrow mb-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: ready ? 1 : 0, y: 0 }} transition={{ delay: d(2.0), duration: 0.6 }}>
          Enter the grill experience · {t(ui.hero.location)}
        </motion.p>
        <h1 className="display-xl text-[19vw] sm:text-[15vw] lg:text-[10.5rem]">
          <span className="sr-only">Kebab Grill House 63 — Lyon 7</span>
          <span aria-hidden className="block overflow-hidden">
            {'GRILL'.split('').map((c, i) => (
              <motion.span key={i} className="inline-block text-bone" initial={{ y: '110%' }} animate={{ y: ready ? '0%' : '110%' }}
                transition={{ delay: d(2.2 + i * 0.06), duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>{c}</motion.span>
            ))}
          </span>
          <span aria-hidden className="block overflow-hidden">
            {'HOUSE'.split('').map((c, i) => (
              <motion.span key={i} className="inline-block text-bone" initial={{ y: '110%' }} animate={{ y: ready ? '0%' : '110%' }}
                transition={{ delay: d(2.4 + i * 0.06), duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>{c}</motion.span>
            ))}
            <motion.span className="ml-[0.12em] inline-block text-ember [text-shadow:0_0_60px_rgba(211,75,37,.6)]" initial={{ y: '110%' }} animate={{ y: ready ? '0%' : '110%' }}
              transition={{ delay: d(2.8), duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>63</motion.span>
          </span>
        </h1>
        <motion.p className="mt-5 max-w-xl font-serif text-xl italic text-crust sm:text-2xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: ready ? 1 : 0, y: 0 }} transition={{ delay: d(3.2), duration: 0.8 }}>
          <span className="uppercase not-italic tracking-[0.18em] text-sm font-sans font-semibold text-bone/80 sm:text-base">{t(ui.hero.tagline1)}</span>
          <br />{t(ui.hero.tagline2)}
        </motion.p>
        <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" initial={{ opacity: 0, y: 14 }} animate={{ opacity: ready ? 1 : 0, y: 0 }} transition={{ delay: d(3.5), duration: 0.7 }}>
          <Link href="/carte/" className="btn-primary">{t(ui.hero.discover)}</Link>
          <Link href="/composer/" className="btn-ghost backdrop-blur">{t(ui.hero.compose)}</Link>
        </motion.div>
      </motion.div>

      <CinematicIntro skip={skip} onSkip={() => setSkip(true)} />

      <motion.div className="absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-megawide text-bone/40 sm:flex lg:bottom-8"
        initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: d(4.2) }} aria-hidden>
        {t(ui.hero.scroll)}
        <motion.span className="h-8 w-px bg-gradient-to-b from-crust to-transparent" animate={reduce ? {} : { scaleY: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} style={{ originY: 0 }} />
      </motion.div>
    </section>
  );
}
