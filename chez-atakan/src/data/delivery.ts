import type { Cents } from '../lib/types';

/**
 * Livraison et retrait.
 *
 * ⚠️ Les communes desservies, les frais et le minimum de commande n'ont PAS été communiqués.
 * Tant que `zones` est vide et `fee` vaut null, le site l'indique honnêtement
 * (« zone et frais à confirmer ») au lieu d'inventer des valeurs.
 */
export interface DeliveryZone {
  postalCode: string;
  city: string;
  /** Frais propres à la zone, sinon `delivery.fee`. */
  fee?: Cents;
}

export const delivery = {
  pickupEnabled: true,
  deliveryEnabled: true,
  /** Exemple de saisie : { postalCode: '66240', city: 'Saint-Estève', fee: 200 } */
  zones: [] as DeliveryZone[],
  /** Frais par défaut en centimes. null = non communiqué. */
  fee: null as Cents | null,
  /** Minimum de commande en centimes pour la livraison. null = non communiqué. */
  minimumOrder: null as Cents | null,
  /** Délai indicatif affiché au client. null = non communiqué. */
  estimatedMinutes: null as number | null,
};

export type ZoneCheck =
  | { status: 'unconfigured' }
  | { status: 'ok'; zone: DeliveryZone; fee: Cents | null }
  | { status: 'outside' };

/** Vérifie un code postal contre la configuration. */
export function checkZone(postalCode: string): ZoneCheck {
  if (delivery.zones.length === 0) return { status: 'unconfigured' };
  const zone = delivery.zones.find((z) => z.postalCode === postalCode.trim());
  if (!zone) return { status: 'outside' };
  return { status: 'ok', zone, fee: zone.fee ?? delivery.fee };
}
