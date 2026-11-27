import type { CartLine, CustomerDetails, FulfilmentMode, Order } from './types';
import { lineDetails, lineLabel, unitPrice } from './pricing';
import { DEMO_MODE, restaurant } from '../data/restaurant';
import { euros } from './money';

export const uid = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`).toString();

export const subtotalOf = (lines: CartLine[]) => lines.reduce((s, l) => s + unitPrice(l.config) * l.quantity, 0);

export function buildOrder(params: {
  lines: CartLine[];
  mode: FulfilmentMode;
  customer: CustomerDetails;
  deliveryFee: number | null;
  sequence: number;
}): Order {
  const now = new Date().toISOString();
  const lines = params.lines.map((l) => {
    const unit = unitPrice(l.config);
    return {
      label: lineLabel(l.config),
      details: lineDetails(l.config),
      quantity: l.quantity,
      unitPrice: unit,
      total: unit * l.quantity,
      config: l.config,
    };
  });
  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const fee = params.mode === 'livraison' ? params.deliveryFee : 0;
  return {
    id: uid(),
    number: `A-${String(params.sequence).padStart(3, '0')}`,
    createdAt: now,
    updatedAt: now,
    demo: DEMO_MODE,
    mode: params.mode,
    customer: params.customer,
    lines,
    subtotal,
    deliveryFee: fee,
    total: subtotal + (fee ?? 0),
    status: 'nouvelle',
    history: [{ status: 'nouvelle', at: now }],
  };
}

/** Texte du récapitulatif envoyé par WhatsApp (quand le restaurant l'aura validé). */
export function whatsappMessage(order: Order): string {
  const c = order.customer;
  const rows = order.lines.flatMap((l) => [
    `• ${l.quantity} × ${l.label} — ${euros(l.total)}`,
    ...l.details.map((d) => `   ${d}`),
  ]);
  return [
    `Commande ${order.number} — ${restaurant.name}`,
    order.mode === 'livraison' ? 'Mode : livraison' : 'Mode : retrait sur place',
    '',
    ...rows,
    '',
    `Sous-total : ${euros(order.subtotal)}`,
    order.mode === 'livraison'
      ? `Livraison : ${order.deliveryFee === null ? 'à confirmer' : euros(order.deliveryFee)}`
      : '',
    `Total : ${euros(order.total)}${order.deliveryFee === null && order.mode === 'livraison' ? ' (hors livraison)' : ''}`,
    '',
    `Nom : ${c.name}`,
    `Téléphone : ${c.phone}`,
    order.mode === 'livraison' ? `Adresse : ${c.address}, ${c.postalCode} ${c.city}` : '',
    c.addressComplement ? `Complément : ${c.addressComplement}` : '',
    c.instructions ? `Instructions : ${c.instructions}` : '',
    'Paiement : à régler au restaurant ou à la livraison',
  ]
    .filter((x, i, arr) => x !== '' || arr[i - 1] !== '')
    .join('\n');
}

export const whatsappLink = (order: Order) =>
  `https://wa.me/${restaurant.whatsapp.number}?text=${encodeURIComponent(whatsappMessage(order))}`;
