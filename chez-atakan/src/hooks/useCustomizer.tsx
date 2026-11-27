import { createContext, useContext, useState, type ReactNode } from 'react';
import type { BuilderKind, CartLine } from '../lib/types';

/** Ouverture du configurateur depuis n'importe où (carte, panier, hero…). */
export type CustomizerRequest =
  | { kind: BuilderKind; productId?: string; line?: undefined }
  | { kind: BuilderKind; productId: string; line: CartLine };

interface CustomizerState {
  request: CustomizerRequest | null;
  openCustomizer: (r: CustomizerRequest) => void;
  closeCustomizer: () => void;
}

const Ctx = createContext<CustomizerState | null>(null);

export function CustomizerProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<CustomizerRequest | null>(null);
  return (
    <Ctx.Provider value={{ request, openCustomizer: setRequest, closeCustomizer: () => setRequest(null) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCustomizer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCustomizer doit être utilisé dans <CustomizerProvider>');
  return ctx;
}
