'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { GRILL_HOLD_AT as HOLD_AT, GRILL_SEQUENCE, MEDIA_CREDIT } from '@/data/media';
import { useT } from '@/store/lang';

/**
 * Final immersif du tacos : séquence vidéo réelle (mains qui posent le tacos dans le grill,
 * presse, sortie doré). Montage de plans enchaînés, passable à tout moment.
 * Si la vidéo ne démarre pas (réseau, blocage), `onFail` rend la main à l'animation vectorielle.
 */
export function GrillVideo({ active, hold, warm, onEnd, onFail }: { active: boolean; hold: boolean; warm: boolean; onEnd: () => void; onFail: () => void }) {
  const { t } = useT();
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [idx, setIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);
  const [frozen, setFrozen] = useState(false);
  const endRef = useRef(onEnd); endRef.current = onEnd;
  const last = GRILL_SEQUENCE.length - 1;

  /** Fin de séquence (ou « Passer ») : on fige le dernier plan sur le tacos doré, puis on passe au récapitulatif. */
  const finish = () => {
    refs.current.forEach((v, i) => { if (v && i !== last) v.pause(); });
    const v = refs.current[last];
    setIdx(last);
    if (v && startedRef.current) {
      v.pause();
      try { v.currentTime = HOLD_AT; } catch { /* ignore */ }
      setFrozen(true);
    }
    endRef.current();
  };
  const finishRef = useRef(finish); finishRef.current = finish;
  const failRef = useRef(onFail); failRef.current = onFail;

  const durations = GRILL_SEQUENCE.map((c) => c.to - c.from);
  const total = durations.reduce((a, b) => a + b, 0);
  const offset = durations.slice(0, idx).reduce((a, b) => a + b, 0);

  // Réinitialisation et garde-fou : si rien ne joue au bout de 7 s, repli vectoriel.
  useEffect(() => {
    if (!active) {
      if (hold) return;
      setIdx(0); setElapsed(0); setStarted(false); setFrozen(false); startedRef.current = false;
      refs.current.forEach((v) => v?.pause());
      return;
    }
    const tm = setTimeout(() => {
      if (!startedRef.current) failRef.current();
    }, 7000);
    return () => clearTimeout(tm);
  }, [active, hold]);

  // Lecture du plan courant.
  useEffect(() => {
    if (!active) return;
    const clip = GRILL_SEQUENCE[idx];
    const v = refs.current[idx];
    if (!v) return;
    let finished = false;
    let last = performance.now();
    const next = () => {
      if (finished) return;
      finished = true;
      v.pause();
      if (idx < GRILL_SEQUENCE.length - 1) setIdx(idx + 1);
      else finishRef.current();
    };
    const start = () => {
      try { v.currentTime = clip.from; } catch { /* ignore */ }
      v.play().then(() => { setStarted(true); startedRef.current = true; }).catch(() => { if (idx === 0) failRef.current(); else next(); });
    };
    const onTime = () => {
      last = performance.now();
      setElapsed(Math.max(0, v.currentTime - clip.from));
      if (v.currentTime >= clip.to) next();
    };
    // Vidéo déjà en erreur (préchargement échoué) : repli immédiat, sans attendre le garde-fou.
    if (v.error || v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      if (idx === 0) failRef.current(); else next();
      return;
    }
    if (v.readyState >= 1) start(); else v.addEventListener('loadedmetadata', start, { once: true });
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('ended', next);
    // Plan bloqué (réseau) : on passe au suivant plutôt que de figer l'écran.
    const watchdog = setInterval(() => { if (startedRef.current) { if (performance.now() - last > 5000) next(); } }, 1000);
    return () => {
      v.removeEventListener('loadedmetadata', start);
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('ended', next);
      clearInterval(watchdog);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, idx]);

  const progress = Math.min(1, (offset + elapsed) / total);
  const clip = GRILL_SEQUENCE[idx];
  const holding = hold && frozen;
  const caption = holding ? { fr: 'Prêt. Bien chaud.', en: 'Ready. Piping hot.' } : clip.caption;

  return (
    <div className={`absolute inset-0 z-[15] ${active ? '' : 'pointer-events-none'}`} aria-hidden={!active && !holding}>
      <motion.div className="absolute inset-0 overflow-hidden bg-black" initial={false}
        animate={{ opacity: (active && started) || holding ? 1 : 0 }} transition={{ duration: 0.6 }}>
        {GRILL_SEQUENCE.map((c, i) => (
          <video key={c.id} ref={(el) => { refs.current[i] = el; }}
            src={`${c.src}#t=${c.from}`} muted playsInline disablePictureInPicture
            preload={warm || active ? 'auto' : 'none'}
            onError={() => { if (active && i === idx) { if (i === 0) failRef.current(); else endRef.current(); } }}
            className="absolute inset-0 h-full w-full scale-[1.06] object-cover transition-opacity duration-500"
            style={{ opacity: i === idx ? 1 : 0, filter: 'contrast(1.08) saturate(1.12) sepia(.12)' }} />
        ))}
        {/* Étalonnage chaud + vignettage cinéma */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_45%,rgba(0,0,0,.75))]" />
        <div className="absolute inset-0 mix-blend-soft-light bg-[linear-gradient(180deg,rgba(211,75,37,.35),transparent_40%,rgba(233,200,141,.18))]" />
        <div className="absolute inset-x-0 top-0 h-[9%] bg-black" />
        <div className="absolute inset-x-0 bottom-0 h-[9%] bg-black" />

        <AnimatePresence mode="wait">
          <motion.div key={holding ? 'hold' : clip.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4 }}
            className="absolute inset-x-0 bottom-[12%] text-center font-display text-lg uppercase tracking-[0.25em] text-bone drop-shadow-[0_2px_8px_rgba(0,0,0,.8)] lg:text-2xl">
            {t(caption)}
          </motion.div>
        </AnimatePresence>
        <div className={`absolute inset-x-[8%] bottom-[10%] h-[2px] overflow-hidden rounded bg-white/15 transition-opacity ${holding ? 'opacity-0' : ''}`}>
          <div className="h-full bg-ember transition-[width] duration-200" style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="absolute inset-x-0 bottom-[2.5%] hidden px-3 text-center text-[9px] text-bone/55 sm:block lg:text-[10px]">{t(MEDIA_CREDIT)}</p>
      </motion.div>
      {active && started && (
        <button type="button" onClick={() => finishRef.current()}
          className="absolute right-3 top-[11%] z-10 rounded-full border border-bone/30 bg-black/50 px-3 py-1 text-[11px] uppercase tracking-widest text-bone backdrop-blur hover:border-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember">
          {t({ fr: 'Passer', en: 'Skip' })}
        </button>
      )}
    </div>
  );
}
