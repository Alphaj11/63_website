'use client';
import { useState } from 'react';
import { Stars } from './GoogleRatingSummary';
import type { Review } from '@/services/reviews/types';
import { useT } from '@/store/lang';

const CARD = 'relative flex h-full min-h-[340px] flex-col border border-white/10 bg-gradient-to-b from-[#1d1c1b] to-[#141414] p-7 sm:p-8';

/** Avis affiché tel quel : texte original, note, auteur, date, source. */
export function ReviewCard({ review }: { review: Review }) {
  const { lang, t } = useT();
  const [open, setOpen] = useState(false);
  const long = review.text.length > 320;
  const date = review.relativeTime ?? new Date(review.publishTime).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { month: 'long', year: 'numeric' });

  return (
    <article className={CARD}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-ember via-crust/40 to-transparent" />
      <div className="flex items-center justify-between">
        <Stars value={review.rating} />
        <span className="sr-only">{review.rating} / 5</span>
        <span className="font-serif text-6xl leading-none text-ember/40" aria-hidden>“</span>
      </div>
      <blockquote className={`mt-4 flex-1 font-serif text-lg leading-relaxed text-bone/90 ${!open && long ? 'line-clamp-[8]' : ''}`} lang={review.languageCode}>
        {review.text}
      </blockquote>
      {long && (
        <button type="button" onClick={() => setOpen((o) => !o)} className="mt-2 self-start text-xs uppercase tracking-widest text-crust hover:underline">
          {open ? t({ fr: 'Réduire', en: 'Show less' }) : t({ fr: 'Lire la suite', en: 'Read more' })}
        </button>
      )}
      <footer className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
        {review.authorPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={review.authorPhotoUrl} alt="" width={40} height={40} loading="lazy" referrerPolicy="no-referrer" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <span className="grid h-10 w-10 place-items-center rounded-full bg-ember/20 font-display text-crust">{review.authorName.charAt(0)}</span>
        )}
        <div className="min-w-0 flex-1">
          {review.authorUri ? (
            <a href={review.authorUri} target="_blank" rel="noopener noreferrer" className="block truncate font-semibold text-bone hover:underline">{review.authorName}</a>
          ) : (
            <span className="block truncate font-semibold text-bone">{review.authorName}</span>
          )}
          <span className="text-xs text-bone/50">{date}</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-bone/40">{review.source === 'google' ? t({ fr: 'Avis Google', en: 'Google review' }) : t({ fr: 'Avis Google (relevé)', en: 'Google review (copied)' })}</span>
      </footer>
    </article>
  );
}

/** Emplacement visuellement abouti, sans faux contenu. */
export function ReviewPlaceholder({ index, loading }: { index: number; loading: boolean }) {
  const { t } = useT();
  return (
    <article className={`${CARD} border-dashed`} aria-label={loading ? t({ fr: 'Chargement des avis', en: 'Loading reviews' }) : t({ fr: `Emplacement d’avis n° ${index + 1}`, en: `Review slot #${index + 1}` })}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-ember/50 via-crust/20 to-transparent" />
      <div className="flex items-center justify-between">
        <Stars value={null} />
        <span className="font-serif text-6xl leading-none text-white/10" aria-hidden>“</span>
      </div>
      <div className="mt-6 flex-1 space-y-3" aria-hidden>
        {[92, 100, 84, 96, 60].map((w, i) => (
          <div key={i} className={`h-3 bg-white/[0.06] ${loading ? 'animate-pulse' : ''}`} style={{ width: `${w}%` }} />
        ))}
      </div>
      {!loading && (
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-crust/70">
          {t({ fr: `Emplacement avis Google n° ${index + 1}`, en: `Google review slot #${index + 1}` })}
          <span className="mt-1 block normal-case tracking-normal text-bone/40">{t({ fr: 'En attente des avis officiels du restaurant.', en: 'Awaiting the restaurant’s official reviews.' })}</span>
        </p>
      )}
      <footer className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5" aria-hidden>
        <span className="h-10 w-10 rounded-full bg-white/[0.06]" />
        <div className="flex-1 space-y-2"><div className="h-2.5 w-28 bg-white/[0.08]" /><div className="h-2 w-16 bg-white/[0.05]" /></div>
      </footer>
    </article>
  );
}
