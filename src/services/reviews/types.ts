/** Avis tel que fourni par la source (Google ou validé manuellement). Le texte n'est JAMAIS réécrit. */
export interface Review {
  id: string;
  authorName: string;
  authorPhotoUrl?: string;
  authorUri?: string;
  rating: number; // 1..5
  text: string;
  languageCode?: string;
  publishTime: string; // ISO 8601
  relativeTime?: string; // fourni par Google, ex. « il y a 2 mois »
  source: 'google' | 'manual';
}

export interface PlaceSummary {
  rating: number | null;
  userRatingCount: number | null;
  googleMapsUri: string | null;
  reviewsUri: string | null;
  writeAReviewUri: string | null;
  fetchedAt: string | null;
}

export type ReviewsStatus = 'live' | 'manual' | 'demo' | 'error';

export interface ReviewsPayload {
  status: ReviewsStatus;
  summary: PlaceSummary;
  reviews: Review[];
  /** Mentions d'attribution exigées par la source. */
  attribution: string | null;
  message?: string;
}

export const EMPTY_SUMMARY: PlaceSummary = { rating: null, userRatingCount: null, googleMapsUri: null, reviewsUri: null, writeAReviewUri: null, fetchedAt: null };
