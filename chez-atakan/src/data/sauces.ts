import type { Sauce } from '../lib/types';

/** Sauces de la carte (✅ liste fournie). Les couleurs servent uniquement à l'animation. */
export const sauces: Sauce[] = [
  { id: 'blanche', name: 'Blanche', color: '#EFE9DC', image: 'sauce-blanche' },
  { id: 'ketchup', name: 'Ketchup', color: '#B3170E', image: 'sauce-ketchup' },
  { id: 'samourai', name: 'Samouraï', color: '#E0702A', image: 'sauce-samourai' },
  { id: 'harissa', name: 'Harissa', color: '#9E1B0F', image: 'sauce-harissa' },
  { id: 'andalouse', name: 'Andalouse', color: '#E58B3A', image: 'sauce-andalouse' },
  { id: 'moutarde', name: 'Moutarde', color: '#D9A21B', image: 'sauce-moutarde' },
  { id: 'barbecue', name: 'Barbecue', color: '#4A1D0E', image: 'sauce-barbecue' },
  { id: 'biggy', name: 'Biggy', color: '#E9A866', image: 'sauce-biggy' },
  { id: 'mayonnaise', name: 'Mayonnaise', color: '#F2E3B3', image: 'sauce-mayonnaise' },
  { id: 'algerienne', name: 'Algérienne', color: '#D9773A', image: 'sauce-algerienne' },
];

/**
 * Règles de sauces. ⚠️ À confirmer par le restaurant :
 * - le nombre de sauces autorisées par produit ;
 * - si les sauces supplémentaires sont payantes (aucun prix n'est inventé : 0 par défaut).
 */
export const sauceRules = {
  confirmed: false,
  allowMultiple: true,
  maxSauces: 2,
};
