'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { builders } from '@/data/menu';
import type { BuilderKind } from '@/lib/types';
import { useT } from '@/store/lang';

export function BuilderPage({ kind, children }: { kind: BuilderKind; children: ReactNode }) {
  const { t } = useT();
  const c = builders[kind];
  return (
    <div className="pt-20 lg:pt-24">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-3 px-4 pb-5 pt-4 lg:px-8">
        <div>
          <Link href="/composer/" className="text-xs uppercase tracking-widest text-bone/50 hover:text-bone">← {t({ fr: 'Composer', en: 'Build' })}</Link>
          <h1 className="display-xl mt-1 text-5xl sm:text-6xl">{t(c.name)}</h1>
        </div>
        <p className="max-w-sm font-serif italic text-crust/80">{t(c.tagline)}</p>
      </div>
      {children}
    </div>
  );
}
