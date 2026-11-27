import { productById } from '../data/products';
import { meats } from '../data/ingredients';
import { supplements } from '../data/ingredients';
import { sauces } from '../data/sauces';
import type { Cents, Configuration, Product } from './types';

/** Prix de départ affiché sur la carte (« dès … »). */
export function basePrice(product: Product): Cents {
  if (product.pricesByMeatCount) return product.pricesByMeatCount[0];
  return product.price ?? 0;
}

/** Nombre maximal de viandes pour un produit à prix par viande. */
export const maxMeats = (product: Product): number => product.pricesByMeatCount?.length ?? 0;

/** Prix unitaire d'une configuration. Seule source de vérité des prix du site. */
export function unitPrice(config: Configuration): Cents {
  const product = productById(config.productId);
  if (!product) return 0;

  let price: Cents;
  if (product.pricesByMeatCount) {
    const count = Math.min(Math.max(config.meats.length, 1), product.pricesByMeatCount.length);
    price = product.pricesByMeatCount[count - 1];
  } else if (config.asMenu && product.menuPrice !== undefined) {
    price = product.menuPrice;
  } else {
    price = product.price ?? 0;
  }

  for (const id of config.supplements) {
    const s = supplements.find((x) => x.id === id);
    if (s && s.appliesTo.includes(product.category)) price += s.price;
  }
  return price;
}

/** Libellé principal d'une ligne de panier. */
export function lineLabel(config: Configuration): string {
  const product = productById(config.productId);
  if (!product) return 'Produit indisponible';
  if (product.pricesByMeatCount) {
    const n = config.meats.length;
    return `${product.name} ${n} viande${n > 1 ? 's' : ''}`;
  }
  if (product.menuPrice !== undefined) return `${product.name} ${config.asMenu ? '· Menu' : '· Seul'}`;
  return product.name;
}

/** Détail lisible d'une configuration (panier, récapitulatif, espace restaurant, WhatsApp). */
export function lineDetails(config: Configuration): string[] {
  const out: string[] = [];
  if (config.meats.length) {
    out.push('Viandes : ' + config.meats.map((id) => meats.find((m) => m.id === id)?.name ?? id).join(', '));
  }
  if (config.sauces.length) {
    out.push('Sauces : ' + config.sauces.map((id) => sauces.find((s) => s.id === id)?.name ?? id).join(', '));
  }
  if (config.supplements.length) {
    out.push(
      'Suppléments : ' + config.supplements.map((id) => supplements.find((s) => s.id === id)?.name ?? id).join(', '),
    );
  }
  if (config.note?.trim()) out.push('Note : ' + config.note.trim());
  return out;
}

/** Vérifie qu'une configuration est complète avant l'ajout au panier. */
export function validate(config: Configuration, requiredMeats?: number): string | null {
  const product = productById(config.productId);
  if (!product) return 'Produit introuvable.';
  if (product.pricesByMeatCount) {
    const need = requiredMeats ?? config.meats.length;
    if (need < 1) return 'Choisis au moins une viande.';
    if (config.meats.length < need) return `Choisis encore ${need - config.meats.length} viande(s).`;
  }
  return null;
}

/** Deux configurations identiques fusionnent dans le panier. */
export const sameConfig = (a: Configuration, b: Configuration): boolean =>
  a.productId === b.productId &&
  a.asMenu === b.asMenu &&
  a.meats.join() === b.meats.join() &&
  [...a.sauces].sort().join() === [...b.sauces].sort().join() &&
  [...a.supplements].sort().join() === [...b.supplements].sort().join() &&
  (a.note ?? '') === (b.note ?? '');
