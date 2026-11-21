'use client';
import { useEffect } from 'react';
import { useCart } from '@/store/cart';
import { useLangStore } from '@/store/lang';

/** Recharge panier et langue depuis le stockage local après l'hydratation (pas d'écart serveur/client). */
export function StoreHydrator() {
  useEffect(() => {
    void useLangStore.persist.rehydrate();
    void useCart.persist.rehydrate();
  }, []);
  return null;
}
