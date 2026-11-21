/**
 * Couche de service des avis — indépendante de l'interface.
 * Ordre de priorité :
 *   1. Route serveur (NEXT_PUBLIC_REVIEWS_ENDPOINT) → données Google en direct, clé API jamais exposée.
 *   2. Avis validés manuellement (manual-reviews.ts).
 *   3. Mode démonstration : AUCUN avis affiché comme authentique.
 */
import { manualReviews, manualSummary } from './manual-reviews';
import { selectBestReviews } from './select';
import { EMPTY_SUMMARY, type ReviewsPayload } from './types';
import { mapsLinks } from '@/data/restaurant';

const ENDPOINT = process.env.NEXT_PUBLIC_REVIEWS_ENDPOINT || '';
const CACHE_KEY = 'gh63-reviews-v1';
const CACHE_TTL = 60 * 60 * 1000; // 1 h côté navigateur (le serveur a son propre cache)

function fromCache(): ReviewsPayload | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw) as { at: number; data: ReviewsPayload };
    return Date.now() - at < CACHE_TTL ? data : null;
  } catch { return null; }
}

function toCache(data: ReviewsPayload) {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data })); } catch { /* ignore */ }
}

function fallback(message?: string): ReviewsPayload {
  const links = { googleMapsUri: mapsLinks.place, reviewsUri: mapsLinks.place, writeAReviewUri: mapsLinks.writeReview };
  if (manualReviews.length > 0) {
    return {
      status: 'manual',
      summary: { ...EMPTY_SUMMARY, ...links, ...manualSummary },
      reviews: selectBestReviews(manualReviews),
      attribution: 'Avis publiés sur Google, transmis par l’établissement',
      message,
    };
  }
  return { status: message ? 'error' : 'demo', summary: { ...EMPTY_SUMMARY, ...links }, reviews: [], attribution: null, message };
}

export async function getReviews(signal?: AbortSignal): Promise<ReviewsPayload> {
  if (!ENDPOINT) return fallback();
  const cached = fromCache();
  if (cached) return cached;
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 8000);
    signal?.addEventListener('abort', () => ctrl.abort());
    const res = await fetch(ENDPOINT, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as ReviewsPayload;
    const payload: ReviewsPayload = { ...data, status: 'live', reviews: selectBestReviews(data.reviews ?? []) };
    toCache(payload);
    return payload;
  } catch (e) {
    return fallback(e instanceof Error ? e.message : 'unavailable');
  }
}

export const reviewsConfigured = () => !!ENDPOINT || manualReviews.length > 0;
