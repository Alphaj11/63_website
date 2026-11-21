'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ui } from '@/i18n/ui';
import { useT } from '@/store/lang';

const DURATION = 4200;

/** Voile noir d'ouverture + bouton « Passer l'intro ». N'empêche jamais l'accès au contenu. */
export function CinematicIntro({ skip, onSkip }: { skip: boolean; onSkip: () => void }) {
  const { t } = useT();
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (skip) { setPlaying(false); return; }
    const timer = setTimeout(() => setPlaying(false), DURATION);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onSkip(); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(timer); window.removeEventListener('keydown', onKey); };
  }, [skip, onSkip]);

  return (
    <>
      <AnimatePresence>
        {!skip && (
          <motion.div key="veil" className="pointer-events-none absolute inset-0 z-20 bg-black" initial={{ opacity: 1 }} animate={{ opacity: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 1.6, delay: 0.25, ease: 'easeOut' }} aria-hidden />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {playing && (
          <motion.div key="skip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.4 }}
            className="absolute bottom-24 right-4 z-30 flex items-center gap-3 sm:bottom-8 lg:right-8">
            <div className="hidden h-px w-24 overflow-hidden bg-white/15 sm:block" aria-hidden>
              <motion.div className="h-full bg-ember" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: DURATION / 1000, ease: 'linear' }} />
            </div>
            <button type="button" onClick={onSkip} className="border border-white/20 bg-black/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-bone/80 backdrop-blur hover:border-crust hover:text-crust">
              {t(ui.hero.skipIntro)} →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
