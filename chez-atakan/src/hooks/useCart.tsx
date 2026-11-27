import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CartLine, Configuration } from '../lib/types';
import { sameConfig, unitPrice } from '../lib/pricing';
import { productById } from '../data/products';
import { uid } from '../lib/order';
import { useLocalStorage } from './useLocalStorage';

interface CartState {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  /** Incrémenté à chaque ajout : déclenche l'animation du compteur. */
  pulse: number;
  open: () => void;
  close: () => void;
  add: (config: Configuration, quantity?: number) => void;
  replace: (lineId: string, config: Configuration, quantity: number) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [stored, setLines] = useLocalStorage<CartLine[]>('atakan:cart:v1', []);
  const [isOpen, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);
  // Nettoie les lignes dont le produit n'existe plus (carte modifiée).
  const lines = useMemo(() => stored.filter((l) => productById(l.config.productId)), [stored]);

  const add = useCallback(
    (config: Configuration, quantity = 1) => {
      setLines((prev) => {
        const existing = prev.find((l) => sameConfig(l.config, config));
        if (existing) return prev.map((l) => (l === existing ? { ...l, quantity: Math.min(l.quantity + quantity, 30) } : l));
        return [...prev, { lineId: uid(), config, quantity }];
      });
      setPulse((p) => p + 1);
    },
    [setLines],
  );

  const value = useMemo<CartState>(
    () => ({
      lines,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      subtotal: lines.reduce((s, l) => s + unitPrice(l.config) * l.quantity, 0),
      isOpen,
      pulse,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      replace: (lineId, config, quantity) =>
        setLines((prev) => prev.map((l) => (l.lineId === lineId ? { ...l, config, quantity } : l))),
      setQuantity: (lineId, quantity) =>
        setLines((prev) =>
          quantity <= 0
            ? prev.filter((l) => l.lineId !== lineId)
            : prev.map((l) => (l.lineId === lineId ? { ...l, quantity: Math.min(quantity, 30) } : l)),
        ),
      remove: (lineId) => setLines((prev) => prev.filter((l) => l.lineId !== lineId)),
      clear: () => setLines([]),
      has: (productId) => lines.some((l) => l.config.productId === productId),
    }),
    [lines, isOpen, pulse, add, setLines],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans <CartProvider>');
  return ctx;
}
