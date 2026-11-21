'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { GoogleRatingSummary } from './GoogleRatingSummary';
import { ReviewCarousel } from './ReviewCarousel';
import { mapsLinks } from '@/data/restaurant';
import { getReviews } from '@/services/reviews/client';
import type { ReviewsPayload } from '@/services/reviews/types';
import { useT } from '@/store/lang';

/**
 * « ILS EN PARLENT MIEUX QUE NOUS. » — preuve sociale.
 * Aucune donnée inventée : en l'absence de connexion, la section reste en mode démonstration explicite.
 */
export function GoogleReviews({ compact = false }: { compact?: boolean }) {
  const { t } = useT();
  const [data, setData] = useState<ReviewsPayload | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    getReviews(ctrl.signal).then(setData);
    return () => ctrl.abort();
  }, []);

  const loading = !data;
  const status = data?.status ?? 'demo';
  const allReviewsUrl = data?.summary.reviewsUri ?? data?.summary.googleMapsUri ?? mapsLinks.place ?? mapsLinks.search;
  const writeUrl = data?.summary.writeAReviewUri ?? mapsLinks.writeReview;

  return (
    <section id="avis" className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="avis-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(211,75,37,.16),transparent_70%)]" />
      <div className="pointer-events-none absolute -right-40 top-20 font-display text-[28rem] leading-none text-white/[0.018]" aria-hidden>★</div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <motion.p className="eyebrow" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              {t({ fr: 'Avis Google', en: 'Google reviews' })}
            </motion.p>
            <motion.h2 id="avis-title" className="display-xl mt-3 text-6xl sm:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8 }}>
              {t({ fr: 'Ils en parlent', en: 'They say it' })}<br /><span className="gold-text">{t({ fr: 'mieux que nous.', en: 'better than us.' })}</span>
            </motion.h2>
            <motion.p className="mt-5 max-w-lg font-serif text-xl italic text-bone/70" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              {t({ fr: 'Votre satisfaction est notre plus belle récompense.', en: 'Your satisfaction is our finest reward.' })}
            </motion.p>
          </div>
          <GoogleRatingSummary summary={data?.summary ?? null} status={status} loading={loading} />
        </div>

        {(status === 'demo' || status === 'error') && !loading && (
          <div role="note" className="mt-10 flex flex-col gap-2 border border-crust/30 bg-crust/[0.04] px-5 py-4 text-sm text-bone/75 sm:flex-row sm:items-center sm:justify-between">
            <span>
              <strong className="mr-2 text-crust">{t({ fr: 'MODE DÉMONSTRATION', en: 'DEMO MODE' })}</strong>
              {status === 'error'
                ? t({ fr: 'Le service d’avis est momentanément indisponible. Aucun avis n’est affiché à la place des vrais.', en: 'The reviews service is temporarily unavailable. No reviews are shown in place of real ones.' })
                : t({ fr: 'Les avis Google ne sont pas encore connectés. Les emplacements ci-dessous accueilleront les avis réels du restaurant.', en: 'Google reviews are not connected yet. The slots below will show the restaurant’s real reviews.' })}
            </span>
          </div>
        )}

        <div className="mt-10">
          <ReviewCarousel reviews={data?.reviews ?? []} loading={loading} placeholders={!loading && (data?.reviews.length ?? 0) === 0} />
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <a href={allReviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            {t({ fr: 'Voir tous nos avis Google', en: 'See all our Google reviews' })} ↗
          </a>
          {writeUrl ? (
            <a href={writeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">{t({ fr: 'Laisser un avis', en: 'Leave a review' })} ↗</a>
          ) : (
            <span className="flex flex-col">
              <button type="button" disabled className="btn-ghost" aria-describedby="write-review-note">{t({ fr: 'Laisser un avis', en: 'Leave a review' })}</button>
              <span id="write-review-note" className="mt-1.5 text-[11px] text-bone/40">{t({ fr: 'Lien officiel activé dès que l’identifiant Google de la fiche est configuré.', en: 'Official link enabled once the Google listing ID is configured.' })}</span>
            </span>
          )}
          {!compact && data?.attribution && <span className="text-xs text-bone/40 sm:ml-auto">{t({ fr: 'Source', en: 'Source' })} : {data.attribution}</span>}
        </div>
      </div>
    </section>
  );
}
