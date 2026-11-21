'use client';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ReviewCard, ReviewPlaceholder } from './ReviewCard';
import type { Review } from '@/services/reviews/types';
import { useT } from '@/store/lang';

/**
 * Carrousel accessible : défilement natif (tactile fluide sur mobile), aimantation,
 * boutons précédent / suivant, plusieurs cartes sur ordinateur, une carte principale sur mobile.
 */
export function ReviewCarousel({ reviews, loading, placeholders }: { reviews: Review[]; loading: boolean; placeholders: boolean }) {
  const { t } = useT();
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const count = loading || placeholders ? 3 : reviews.length;

  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    setIndex(Math.round(el.scrollLeft / (card.offsetWidth + 20)));
  }, []);

  useEffect(() => { onScroll(); }, [count, onScroll]);

  const go = (dir: number) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: 'smooth' });
  };

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={t({ fr: 'Avis clients', en: 'Customer reviews' })}>
      <ul ref={track} onScroll={onScroll}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 lg:mx-0 lg:px-0">
        {Array.from({ length: count }).map((_, i) => (
          <motion.li key={i} className="w-[86%] shrink-0 snap-center sm:w-[60%] lg:w-[calc((100%-40px)/3)] lg:snap-start"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
            aria-roledescription="slide" aria-label={`${i + 1} / ${count}`}>
            {loading || placeholders ? <ReviewPlaceholder index={i} loading={loading} /> : <ReviewCard review={reviews[i]} />}
          </motion.li>
        ))}
      </ul>
      {count > 1 && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex gap-1.5" aria-hidden>
            {Array.from({ length: count }).map((_, i) => (
              <span key={i} className={`h-1 transition-all duration-500 ${i === index ? 'w-8 bg-ember' : 'w-3 bg-white/15'}`} />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(-1)} className="grid h-11 w-11 place-items-center border border-white/15 hover:border-crust" aria-label={t({ fr: 'Avis précédent', en: 'Previous review' })}>←</button>
            <button type="button" onClick={() => go(1)} className="grid h-11 w-11 place-items-center border border-white/15 hover:border-crust" aria-label={t({ fr: 'Avis suivant', en: 'Next review' })}>→</button>
          </div>
        </div>
      )}
    </div>
  );
}
