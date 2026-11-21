import { createJSONStorage, type StateStorage } from 'zustand/middleware';

/** localStorage protégé : navigation privée, stockage bloqué, rendu serveur. */
const safe: StateStorage = {
  getItem: (k) => { try { return typeof window === 'undefined' ? null : window.localStorage.getItem(k); } catch { return null; } },
  setItem: (k, v) => { try { window.localStorage.setItem(k, v); } catch { /* stockage indisponible */ } },
  removeItem: (k) => { try { window.localStorage.removeItem(k); } catch { /* ignore */ } },
};
export const safeStorage = createJSONStorage(() => safe);
