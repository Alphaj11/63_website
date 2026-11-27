import { useEffect, useState } from 'react';
import { ExternalLink, PenLine, Star } from 'lucide-react';
import { Reveal } from './ui/Reveal';
import { googleLinks, writeReviewUrl } from '../data/reviews';
import { loadReviews, type ReviewsPayload } from '../services/reviews';

/** Avis clients : uniquement des données vérifiées. Rien n'est affiché par défaut. */
export function Reviews() {
  const [data, setData] = useState<ReviewsPayload | null>(null);
  useEffect(() => {
    loadReviews().then(setData);
  }, []);

  return (
    <section id="avis" className="relative bg-coal/40 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="eyebrow">Avis clients</p>
            <h2 className="display mt-4 text-6xl sm:text-8xl">
              Ceux qui sont <span className="text-ember">passés au grill</span>
            </h2>
          </div>
          <div className="lg:text-right">
            {data?.rating ? (
              <div className="inline-flex items-center gap-4">
                <span className="display text-7xl text-ember-light">{data.rating.value.toFixed(1).replace('.', ',')}</span>
                <span className="text-left">
                  <span className="flex" aria-label={`${data.rating.value} sur 5`}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < Math.round(data.rating!.value) ? 'fill-ember text-ember' : 'text-cream/25'}`} />
                    ))}
                  </span>
                  <span className="mt-1 block text-sm text-cream/60">
                    {data.rating.count} avis Google · relevé le {new Date(data.rating.checkedAt).toLocaleDateString('fr-FR')}
                  </span>
                </span>
              </div>
            ) : (
              <p className="max-w-md text-cream/65 lg:ml-auto">
                La note Google s’affichera ici dès qu’elle aura été vérifiée. Aucun avis n’est inventé : en attendant, lis-les directement sur Google.
              </p>
            )}
          </div>
        </Reveal>

        {data && data.reviews.length > 0 && (
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {data.reviews.map((r) => (
              <li key={r.author + r.date} className="panel flex flex-col p-6">
                <span className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < r.rating ? 'fill-ember text-ember' : 'text-cream/25'}`} />
                  ))}
                </span>
                <blockquote className="mt-4 flex-1 text-cream/85">« {r.text} »</blockquote>
                <a href={r.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 text-sm text-ash hover:text-cream">
                  {r.author} · {r.date}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a href={googleLinks.reviews} target="_blank" rel="noreferrer" className="btn-primary">
            <ExternalLink className="h-4 w-4" /> Voir les avis Google
          </a>
          <a href={writeReviewUrl()} target="_blank" rel="noreferrer" className="btn-ghost">
            <PenLine className="h-4 w-4" /> Laisser un avis
          </a>
        </div>
      </div>
    </section>
  );
}
