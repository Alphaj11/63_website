'use client';
import { useReducedMotion } from 'framer-motion';
import { useHydrated } from './useHydrated';

/** prefers-reduced-motion, appliqué seulement après l'hydratation (évite les écarts serveur/client). */
export function useSafeReducedMotion(): boolean {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  return hydrated && !!reduce;
}
