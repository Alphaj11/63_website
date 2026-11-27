import type { Order, OrderStatus } from '../../lib/types';

/**
 * PASSERELLE DE COMMANDE.
 *
 * Le frontend ne parle qu'à cette interface. Aujourd'hui : `localGateway` (démo, stockage
 * dans le navigateur). Demain : `httpGateway` (API du restaurant), sans toucher aux écrans.
 *
 * Un backend réel devra fournir :
 *  POST   /orders               → crée la commande, renvoie Order
 *  GET    /orders?since=…       → liste pour l'espace restaurant (authentifié)
 *  PATCH  /orders/:id           → { status, etaMinutes?, refusalReason? }
 *  GET    /orders/:id           → suivi côté client
 *  + un canal temps réel (SSE / WebSocket) pour `subscribe`.
 * Le paiement en ligne viendra se brancher entre la création et l'acceptation.
 */
export interface OrderGateway {
  readonly kind: 'demo-local' | 'http';
  submit(order: Order): Promise<Order>;
  list(): Promise<Order[]>;
  get(id: string): Promise<Order | null>;
  updateStatus(id: string, status: OrderStatus, extra?: Partial<Pick<Order, 'etaMinutes' | 'refusalReason'>>): Promise<Order | null>;
  /** Notifie à chaque changement. Renvoie la fonction de désabonnement. */
  subscribe(listener: () => void): () => void;
  clear?(): Promise<void>;
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  nouvelle: 'Nouvelle',
  acceptee: 'Acceptée',
  en_preparation: 'En préparation',
  prete: 'Prête',
  terminee: 'Terminée',
  refusee: 'Refusée',
};

/** Statut suivant proposé à l'équipe. */
export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  acceptee: 'en_preparation',
  en_preparation: 'prete',
  prete: 'terminee',
};

export function withStatus(order: Order, status: OrderStatus, extra: Partial<Order> = {}): Order {
  const at = new Date().toISOString();
  return { ...order, ...extra, status, updatedAt: at, history: [...order.history, { status, at }] };
}
