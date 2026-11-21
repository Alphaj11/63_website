/**
 * ROUTE SERVEUR — Avis Google (Places API New)
 * ------------------------------------------------------------
 * GitHub Pages est un hébergement statique : cette route ne peut PAS y tourner.
 * Sur un hébergement avec serveur (Vercel, Netlify, VPS Node) :
 *   1. Copier ce fichier vers  src/app/api/reviews/route.ts
 *   2. Retirer `output: 'export'` de next.config.mjs
 *   3. Définir GOOGLE_PLACES_API_KEY et GOOGLE_PLACE_ID (variables serveur, jamais NEXT_PUBLIC_)
 *   4. Définir NEXT_PUBLIC_REVIEWS_ENDPOINT=/api/reviews
 * Voir docs/AVIS-GOOGLE.md.
 *
 * - La clé API reste côté serveur.
 * - Cache de 6 h (revalidate) pour limiter les requêtes et les coûts.
 * - Erreurs et indisponibilité : réponse 503 propre, le site bascule en mode dégradé.
 * - Les textes sont renvoyés tels quels, avec l'attribution de l'auteur fournie par Google.
 */
import { NextResponse } from 'next/server';

export const revalidate = 21600; // 6 h

type GoogleReview = {
  name: string;
  rating: number;
  text?: { text: string; languageCode?: string };
  originalText?: { text: string; languageCode?: string };
  publishTime: string;
  relativePublishTimeDescription?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
};

export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) {
    return NextResponse.json({ status: 'demo', reviews: [], summary: null, attribution: null, message: 'not-configured' }, { status: 503 });
  }
  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=fr`, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'rating,userRatingCount,reviews,googleMapsUri,googleMapsLinks',
      },
      next: { revalidate },
    });
    if (!res.ok) throw new Error(`Places API ${res.status}`);
    const place = await res.json();
    const reviews = ((place.reviews ?? []) as GoogleReview[]).map((r) => ({
      id: r.name,
      authorName: r.authorAttribution?.displayName ?? 'Utilisateur Google',
      authorPhotoUrl: r.authorAttribution?.photoUri,
      authorUri: r.authorAttribution?.uri,
      rating: r.rating,
      // Texte original de l'auteur si disponible (pas de traduction automatique imposée).
      text: r.originalText?.text ?? r.text?.text ?? '',
      languageCode: r.originalText?.languageCode ?? r.text?.languageCode,
      publishTime: r.publishTime,
      relativeTime: r.relativePublishTimeDescription,
      source: 'google' as const,
    }));
    return NextResponse.json({
      status: 'live',
      summary: {
        rating: place.rating ?? null,
        userRatingCount: place.userRatingCount ?? null,
        googleMapsUri: place.googleMapsUri ?? null,
        reviewsUri: place.googleMapsLinks?.reviewsUri ?? place.googleMapsUri ?? null,
        writeAReviewUri: place.googleMapsLinks?.writeAReviewUri ?? null,
        fetchedAt: new Date().toISOString(),
      },
      reviews,
      attribution: 'Google',
    }, { headers: { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400' } });
  } catch (e) {
    console.error('[reviews]', e);
    return NextResponse.json({ status: 'error', reviews: [], summary: null, attribution: null, message: 'unavailable' }, { status: 503 });
  }
}
