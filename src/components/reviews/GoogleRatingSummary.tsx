'use client';
import { motion } from 'framer-motion';
import type { PlaceSummary, ReviewsStatus } from '@/services/reviews/types';
import { useT } from '@/store/lang';

export function Stars({ value, size = 18, className = '' }: { value: number | null; size?: number; className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = value == null ? 0 : Math.max(0, Math.min(1, value - i));
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24">
            <defs><linearGradient id={`st-${i}-${fill}`}><stop offset={fill} stopColor="#E9C88D" /><stop offset={fill} stopColor="transparent" /></linearGradient></defs>
            <path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.6Z" fill={`url(#st-${i}-${fill})`} stroke="#E9C88D" strokeWidth="1.1" />
          </svg>
        );
      })}
    </span>
  );
}

/** Note moyenne + nombre d'avis : affichés uniquement s'ils proviennent d'une source vérifiée et datée. */
export function GoogleRatingSummary({ summary, status, loading }: { summary: PlaceSummary | null; status: ReviewsStatus; loading: boolean }) {
  const { lang, t } = useT();
  const verified = summary?.rating != null && (status === 'live' || (status === 'manual' && !!summary.fetchedAt));
  const nf = new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { maximumFractionDigits: 1, minimumFractionDigits: 1 });

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
      className="relative border border-crust/20 bg-gradient-to-br from-white/[0.04] to-transparent p-6 sm:p-8">
      <div className="absolute -top-px left-6 h-px w-24 bg-ember" />
      <div className="flex items-center gap-6">
        <div className={`font-display text-7xl leading-none sm:text-8xl ${verified ? 'gold-text' : 'text-white/15'}`} aria-live="polite">
          {loading ? <span className="inline-block h-16 w-28 animate-pulse bg-white/5" /> : verified ? nf.format(summary!.rating!) : '–,–'}
        </div>
        <div>
          <Stars value={verified ? summary!.rating : null} size={22} />
          <p className="mt-2 text-sm text-bone/70">
            {verified && summary!.userRatingCount != null
              ? t({ fr: `${summary!.userRatingCount.toLocaleString('fr-FR')} avis Google`, en: `${summary!.userRatingCount.toLocaleString('en-GB')} Google reviews` })
              : t({ fr: 'Nombre d’avis : en attente de connexion', en: 'Review count: awaiting connection' })}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-widest text-bone/40">
            {verified && summary?.fetchedAt
              ? `${t({ fr: 'Mis à jour le', en: 'Updated' })} ${new Date(summary.fetchedAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')}`
              : t({ fr: 'Note Google vérifiée affichée ici', en: 'Verified Google rating shown here' })}
          </p>
        </div>
      </div>
      {verified && <span className="sr-only">{t({ fr: `Note moyenne ${summary!.rating} sur 5`, en: `Average rating ${summary!.rating} out of 5` })}</span>}
    </motion.div>
  );
}
