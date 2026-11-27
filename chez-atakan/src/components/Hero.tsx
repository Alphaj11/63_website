import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ChevronDown, Flame, UtensilsCrossed } from 'lucide-react';
import { Photo } from './ui/Photo';
import { FlameMark } from './ui/Logo';
import { goToSection } from '../hooks/useRoute';
import { restaurant } from '../data/restaurant';

const WORD = 'ATAKAN';

/** Braises et fumée en CSS pur (transform/opacity) : légères, coupées si mouvement réduit. */
function Embers({ count = 22 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        s: `${2 + ((i * 7) % 4)}px`,
        t: `${6 + ((i * 13) % 7)}s`,
        d: `${-((i * 1.7) % 9)}s`,
        dx: `${((i % 5) - 2) * 18}px`,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p, i) => (
        <span
          key={i}
          className="ember-particle"
          style={{ left: p.left, ['--s' as string]: p.s, ['--t' as string]: p.t, ['--d' as string]: p.d, ['--dx' as string]: p.dx }}
        />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <span
          key={`s${i}`}
          className="smoke"
          style={{
            left: `${15 + i * 22}%`,
            bottom: '10%',
            width: '38vw',
            height: '38vw',
            ['--t' as string]: `${12 + i * 3}s`,
            ['--d' as string]: `${-i * 3}s`,
            ['--dx' as string]: `${i % 2 ? -60 : 60}px`,
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, reduce ? 1.08 : 1.18]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative -mt-16 flex min-h-[100svh] items-end overflow-hidden pb-20 pt-28 sm:items-center sm:pb-0">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Photo name="hero-broche" alt="Broche de kebab dorée en cuisson devant le grill" priority className="h-full w-full" />
      </motion.div>

      {/* Lumière du grill : dégradés chauds + vignettage */}
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_70%_100%,rgba(255,106,0,.35),transparent_60%)] mix-blend-screen animate-flicker" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/30" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_40%,transparent_40%,rgba(8,8,8,.85))]" aria-hidden />
      <Embers />

      <motion.div style={{ opacity: fade }} className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-5 flex items-center gap-3"
        >
          <FlameMark className="h-6 w-6" />
          <span className="eyebrow">Saint-Estève · Perpignan</span>
        </motion.div>

        <h1 className="sr-only">Chez Atakan, {restaurant.slogan}</h1>
        <div aria-hidden className="select-none">
          <motion.span
            initial={{ opacity: 0, letterSpacing: '0.9em' }}
            animate={{ opacity: 1, letterSpacing: '0.5em' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="block font-display text-lg font-bold uppercase text-ember-light sm:text-2xl"
          >
            Chez
          </motion.span>
          <span className="display flex text-[22vw] text-cream sm:text-[15vw] lg:text-[12rem]">
            {WORD.split('').map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: '40%', filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: '0%', filter: 'blur(0px)' }}
                transition={{ delay: 0.25 + i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block bg-gradient-to-b from-cream via-cream to-ember-light bg-clip-text text-transparent"
              >
                {ch}
              </motion.span>
            ))}
          </span>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.7 }}
          className="mt-4 max-w-xl font-display text-2xl font-bold uppercase leading-tight text-cream sm:text-4xl"
        >
          Le goût du grill, <span className="text-ember-light">la générosité en plus.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.7 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <button onClick={() => goToSection('carte')} className="btn-primary">
            <UtensilsCrossed className="h-4 w-4" aria-hidden /> Découvrir la carte
          </button>
          <button onClick={() => goToSection('composer')} className="btn-ghost">
            <Flame className="h-4 w-4" aria-hidden /> Composer mon repas
          </button>
        </motion.div>
      </motion.div>

      <button
        onClick={() => goToSection('univers')}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-[10px] uppercase tracking-[0.3em] text-cream/60 sm:flex"
        aria-label="Faire défiler vers Notre univers"
      >
        Entrer
        <motion.span animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>
    </section>
  );
}
