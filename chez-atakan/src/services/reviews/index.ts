import { googleRating, testimonials, type Testimonial } from '../../data/reviews';

/**
 * Couche d'accès aux avis.
 * Aujourd'hui : données saisies à la main (src/data/reviews.ts).
 * Demain : VITE_REVIEWS_ENDPOINT pointe vers une petite fonction serveur qui interroge
 * l'API Google Places (la clé API ne doit jamais être exposée dans le site statique).
 */
export interface ReviewsPayload {
  rating: { value: number; count: number; checkedAt: string } | null;
  reviews: Testimonial[];
  source: 'manual' | 'google-places';
}

export async function loadReviews(): Promise<ReviewsPayload> {
  const endpoint = import.meta.env.VITE_REVIEWS_ENDPOINT as string | undefined;
  if (endpoint) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return { ...(await res.json()), source: 'google-places' } as ReviewsPayload;
    } catch {
      /* repli sur les données manuelles */
    }
  }
  return { rating: googleRating, reviews: testimonials, source: 'manual' };
}
