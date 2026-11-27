/**
 * AVIS CLIENTS — aucun avis n'est inventé.
 *
 * `googleRating` : à renseigner uniquement avec la note vérifiée sur la fiche Google
 *  (valeur + nombre d'avis + date de relevé). null = non affichée.
 * `testimonials` : avis réels uniquement, recopiés avec l'accord de leur auteur
 *  ou issus de la fiche Google (prénom + initiale, date, lien source).
 */
export interface Testimonial {
  author: string;
  rating: number;
  text: string;
  date: string;
  sourceUrl: string;
}

export const googleRating: { value: number; count: number; checkedAt: string } | null = null;

export const testimonials: Testimonial[] = [];

export const googleLinks = {
  /** Fiche Google (recherche, fonctionne sans identifiant). */
  reviews: 'https://www.google.com/maps/search/?api=1&query=Chez+Atakan+Saint-Est%C3%A8ve',
  /**
   * Lien « laisser un avis ». Avec le Place ID de la fiche :
   * https://search.google.com/local/writereview?placeid=<PLACE_ID>
   * Tant qu'il n'est pas renseigné, on renvoie vers la fiche.
   */
  placeId: null as string | null,
};

export const writeReviewUrl = () =>
  googleLinks.placeId
    ? `https://search.google.com/local/writereview?placeid=${googleLinks.placeId}`
    : googleLinks.reviews;
