import type { Cents } from './types';

const fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

/** 950 → « 9,50 € » */
export const euros = (cents: Cents): string => fmt.format(cents / 100);

/** Prix saisis en euros dans les fichiers de données → centimes. */
export const eur = (value: number): Cents => Math.round(value * 100);
