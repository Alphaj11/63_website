'use client';
import { useT } from '@/store/lang';
import type { L } from '@/lib/types';

/** Pastille signalant clairement une donnée de démonstration. */
export function DemoBadge({ label, title }: { label?: L; title?: L }) {
  const { t } = useT();
  return (
    <span title={t(title ?? { fr: 'Données de démonstration, non officielles', en: 'Demo data, not official' })}
      className="inline-flex items-center gap-1.5 border border-crust/40 bg-coal/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-crust backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-crust" />
      {t(label ?? { fr: 'Démo', en: 'Demo' })}
    </span>
  );
}
