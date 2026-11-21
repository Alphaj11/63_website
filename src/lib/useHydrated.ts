'use client';
import { useEffect, useState } from 'react';

/** Vrai après le premier rendu client (évite les écarts d'hydratation avec le stockage local). */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
