import type { Meat, Supplement } from '../lib/types';
import { eur } from '../lib/money';

/** Viandes disponibles pour tacos et bowls (✅ liste fournie). */
export const meats: Meat[] = [
  { id: 'poulet', name: 'Poulet', image: 'meat-poulet' },
  { id: 'kebab', name: 'Kebab', image: 'meat-kebab' },
  { id: 'steak', name: 'Steak haché', image: 'meat-steak' },
  { id: 'cordon-bleu', name: 'Cordon bleu', image: 'meat-cordon-bleu' },
  { id: 'tenders', name: 'Tenders', image: 'meat-tenders' },
  { id: 'nuggets', name: 'Nuggets', image: 'meat-nuggets' },
];

/**
 * Suppléments (✅ « Supplément œuf ou galette de pommes de terre : 1 € »).
 * ⚠️ `appliesTo` : produits concernés à confirmer par le restaurant.
 */
export const supplements: Supplement[] = [
  { id: 'oeuf', name: 'Œuf', price: eur(1), image: 'extra-oeuf', appliesTo: ['sandwichs', 'burgers', 'tacos'] },
  {
    id: 'galette-pdt',
    name: 'Galette de pommes de terre',
    price: eur(1),
    image: 'extra-galette-pdt',
    appliesTo: ['sandwichs', 'burgers', 'tacos'],
  },
];

/** ⚠️ Possibilité de choisir deux fois la même viande : à confirmer par le restaurant. */
export const meatRules = { allowRepeat: true, confirmed: false };
