/**
 * AVIS VALIDÉS MANUELLEMENT — vide par défaut.
 *
 * À utiliser uniquement si l'API Google n'est pas disponible, avec des avis RÉELS
 * transmis ou validés par le restaurant, recopiés mot pour mot, avec leur date et
 * leur note d'origine. Ne jamais inventer, résumer ou reformuler un avis.
 *
 * Exemple de format :
 * {
 *   id: 'manual-1',
 *   authorName: 'Prénom N.',
 *   rating: 5,
 *   text: 'Texte original de l’avis, sans modification.',
 *   publishTime: '2026-10-02T00:00:00Z',
 *   source: 'manual',
 * }
 */
import type { PlaceSummary, Review } from './types';

export const manualReviews: Review[] = [];

/** Note moyenne et nombre d'avis RELEVÉS sur la fiche Google, avec la date du relevé. Laisser null tant que non vérifié. */
export const manualSummary: Pick<PlaceSummary, 'rating' | 'userRatingCount' | 'fetchedAt'> = {
  rating: null,
  userRatingCount: null,
  fetchedAt: null,
};
