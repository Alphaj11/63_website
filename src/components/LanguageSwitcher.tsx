'use client';
import { useEffect } from 'react';
import { useLangStore } from '@/store/lang';

/** Bascule FR / EN, visible en permanence dans l'en-tête. */
export function LanguageSwitcher() {
  const { lang, setLang } = useLangStore();
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return (
    <div role="group" aria-label="Langue / Language" className="flex h-10 items-center border border-white/10 text-[11px] font-bold tracking-widest">
      {(['fr', 'en'] as const).map((l) => (
        <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l}
          className={`h-full px-2.5 transition ${lang === l ? 'bg-crust text-coal' : 'text-bone/60 hover:text-bone'}`}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
