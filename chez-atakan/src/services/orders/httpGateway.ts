import type { Order } from '../../lib/types';
import type { OrderGateway } from './gateway';

/**
 * Passerelle HTTP — squelette prêt pour un futur backend (non utilisée en démo).
 * Activée quand VITE_ORDERS_API_URL est défini ET que DEMO_MODE vaut false.
 * L'authentification de l'espace restaurant (jeton) devra être ajoutée côté serveur.
 */
export function createHttpGateway(baseUrl: string, getToken: () => string | null = () => null): OrderGateway {
  const headers = (): HeadersInit => {
    const token = getToken();
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  };
  const json = async <T>(res: Response): Promise<T> => {
    if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
    return (await res.json()) as T;
  };
  return {
    kind: 'http',
    async submit(order) {
      return json<Order>(await fetch(`${baseUrl}/orders`, { method: 'POST', headers: headers(), body: JSON.stringify(order) }));
    },
    async list() {
      return json<Order[]>(await fetch(`${baseUrl}/orders`, { headers: headers() }));
    },
    async get(id) {
      const res = await fetch(`${baseUrl}/orders/${encodeURIComponent(id)}`, { headers: headers() });
      return res.status === 404 ? null : json<Order>(res);
    },
    async updateStatus(id, status, extra = {}) {
      return json<Order>(
        await fetch(`${baseUrl}/orders/${encodeURIComponent(id)}`, {
          method: 'PATCH',
          headers: headers(),
          body: JSON.stringify({ status, ...extra }),
        }),
      );
    },
    subscribe(listener) {
      // Remplaçable par SSE / WebSocket. Interrogation toutes les 15 s en attendant.
      const t = window.setInterval(listener, 15000);
      return () => window.clearInterval(t);
    },
  };
}
