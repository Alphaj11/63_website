import type { Order } from '../../lib/types';
import { readJSON, writeJSON } from '../../lib/storage';
import { withStatus, type OrderGateway } from './gateway';

/**
 * Passerelle de DÉMONSTRATION.
 * Les commandes sont enregistrées dans le localStorage de CE navigateur uniquement.
 * L'espace restaurant ouvert dans un autre onglet du même navigateur les reçoit en direct
 * (événement `storage` + BroadcastChannel). Rien ne quitte l'appareil.
 */
const KEY = 'atakan:demo-orders:v1';
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('atakan-orders') : null;
const listeners = new Set<() => void>();

const load = (): Order[] => readJSON<Order[]>(KEY, []);
const save = (orders: Order[]) => {
  writeJSON(KEY, orders.slice(0, 200));
  listeners.forEach((l) => l());
  channel?.postMessage('changed');
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) listeners.forEach((l) => l());
  });
  channel?.addEventListener('message', () => listeners.forEach((l) => l()));
}

export const localGateway: OrderGateway = {
  kind: 'demo-local',
  async submit(order) {
    save([order, ...load()]);
    return order;
  },
  async list() {
    return load();
  },
  async get(id) {
    return load().find((o) => o.id === id) ?? null;
  },
  async updateStatus(id, status, extra = {}) {
    const orders = load();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx < 0) return null;
    orders[idx] = withStatus(orders[idx], status, extra);
    save(orders);
    return orders[idx];
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  async clear() {
    save([]);
  },
};
