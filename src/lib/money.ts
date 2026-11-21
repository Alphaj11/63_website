import type { Cents, Lang } from './types';

export function formatPrice(cents: Cents, lang: Lang = 'fr'): string {
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}
