'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { safeStorage } from '@/lib/storage';
import type { CartLine, Cents, ServiceMode } from '@/lib/types';

interface CartState {
  lines: CartLine[];
  mode: ServiceMode;
  table: number | null;
  drawerOpen: boolean;
  lastAdded: string | null;
  add: (line: Omit<CartLine, 'lineId'>) => string;
  replace: (lineId: string, line: Omit<CartLine, 'lineId' | 'qty'>) => void;
  remove: (lineId: string) => void;
  setQty: (lineId: string, qty: number) => void;
  clear: () => void;
  setMode: (m: ServiceMode) => void;
  setTable: (t: number | null) => void;
  openDrawer: (open: boolean) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      mode: 'a-emporter',
      table: null,
      drawerOpen: false,
      lastAdded: null,
      add: (line) => {
        const lineId = uid();
        set((s) => {
          // Produit simple identique : on incrémente la quantité.
          if (line.kind === 'simple') {
            const existing = s.lines.find((l) => l.kind === 'simple' && l.productId === line.productId);
            if (existing) return { lines: s.lines.map((l) => (l === existing ? { ...l, qty: l.qty + line.qty } : l)), lastAdded: existing.lineId, drawerOpen: true };
          }
          return { lines: [...s.lines, { ...line, lineId }], lastAdded: lineId, drawerOpen: true };
        });
        return lineId;
      },
      replace: (lineId, line) => set((s) => ({ lines: s.lines.map((l) => (l.lineId === lineId ? { ...l, ...line } : l)), lastAdded: lineId, drawerOpen: true })),
      remove: (lineId) => set((s) => ({ lines: s.lines.filter((l) => l.lineId !== lineId) })),
      setQty: (lineId, qty) => set((s) => ({ lines: qty <= 0 ? s.lines.filter((l) => l.lineId !== lineId) : s.lines.map((l) => (l.lineId === lineId ? { ...l, qty: Math.min(qty, 20) } : l)) })),
      clear: () => set({ lines: [], lastAdded: null }),
      setMode: (mode) => set({ mode }),
      setTable: (table) => set({ table, mode: table ? 'sur-place' : 'a-emporter' }),
      openDrawer: (drawerOpen) => set({ drawerOpen }),
    }),
    { name: 'gh63-cart', storage: safeStorage, skipHydration: true, partialize: (s) => ({ lines: s.lines, mode: s.mode, table: s.table }) },
  ),
);

export const cartTotal = (lines: CartLine[]): Cents => lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
export const cartCount = (lines: CartLine[]): number => lines.reduce((n, l) => n + l.qty, 0);
