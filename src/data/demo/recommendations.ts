/**
 * DÉMONSTRATION — règles de suggestions (ventes complémentaires), modifiables par le restaurant.
 * Une suggestion n'est jamais ajoutée automatiquement : le client doit cliquer.
 */
import type { BuilderKind, L } from '@/lib/types';

export interface Recommendation {
  /** Produit simple (voir simpleProducts) ou option de supplément d'un configurateur. */
  productId: string;
  reason: L;
}

export const cartRecommendations: Record<BuilderKind | 'simple', Recommendation[]> = {
  tacos: [{ productId: 'soda-33', reason: { fr: 'Une boisson fraîche avec votre tacos ?', en: 'A cold drink with your tacos?' } }],
  kebab: [{ productId: 'frites', reason: { fr: 'Le kebab se partage bien avec des frites.', en: 'Kebab goes well with fries.' } }],
  kumpir: [{ productId: 'ayran', reason: { fr: 'L’ayran, l’accord classique.', en: 'Ayran, the classic pairing.' } }],
  assiette: [{ productId: 'soda-33', reason: { fr: 'Complétez avec une boisson.', en: 'Add a drink.' } }],
  simple: [],
};

/** Suggestion discrète affichée pendant la composition, à l'étape indiquée. */
export const builderHints: Partial<Record<BuilderKind, { stepId: string; optionId: string; text: L }>> = {
  tacos: { stepId: 'supplements', optionId: 'cheddar', text: { fr: 'Souvent ajouté : cheddar fondu.', en: 'Often added: melted cheddar.' } },
  kebab: { stepId: 'supplements', optionId: 'cheddar', text: { fr: 'Souvent ajouté : cheddar.', en: 'Often added: cheddar.' } },
  assiette: { stepId: 'supplements', optionId: 'oeuf', text: { fr: 'Pour une assiette complète : l’œuf.', en: 'For a full platter: a fried egg.' } },
};
