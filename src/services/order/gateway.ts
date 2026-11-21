/**
 * Passerelle de commande.
 * Aujourd'hui : DemoOrderGateway — aucune donnée n'est envoyée, aucun paiement n'est encaissé.
 * Demain : implémenter OrderGateway pour le système réel (caisse / plateforme de commande / paiement sécurisé
 * via un prestataire certifié PCI-DSS, ex. Stripe Checkout) et l'injecter dans getOrderGateway().
 */
import type { CartLine, Cents, ServiceMode } from '@/lib/types';

export interface OrderRequest {
  lines: CartLine[];
  total: Cents;
  mode: ServiceMode;
  table: number | null;
  customer: { name: string; phone?: string; note?: string; pickupTime?: string };
}

export interface OrderResult {
  ok: boolean;
  reference: string;
  simulated: boolean;
  /** URL de paiement hébergée par le prestataire (jamais de saisie de carte sur ce site). */
  paymentUrl?: string;
  error?: string;
}

export interface OrderGateway { submit(order: OrderRequest): Promise<OrderResult> }

export class DemoOrderGateway implements OrderGateway {
  async submit(order: OrderRequest): Promise<OrderResult> {
    await new Promise((r) => setTimeout(r, 1200)); // simule le temps réseau
    if (order.lines.length === 0) return { ok: false, reference: '', simulated: true, error: 'empty' };
    const ref = `DEMO-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    return { ok: true, reference: ref, simulated: true };
  }
}

export function getOrderGateway(): OrderGateway {
  return new DemoOrderGateway();
}
