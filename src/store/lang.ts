'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { safeStorage } from '@/lib/storage';
import type { L, Lang } from '@/lib/types';

interface LangState { lang: Lang; setLang: (l: Lang) => void }

export const useLangStore = create<LangState>()(
  persist((set) => ({ lang: 'fr', setLang: (lang) => set({ lang }) }), { name: 'gh63-lang', storage: safeStorage, skipHydration: true }),
);

/** Hook pratique : `const { lang, t } = useT(); t({ fr, en })` */
export function useT() {
  const lang = useLangStore((s) => s.lang);
  return { lang, t: (l: L) => l[lang] };
}
