import { DEMO_MODE } from '../../data/restaurant';

/** Bandeau visible tant que DEMO_MODE est actif. */
export function DemoBanner() {
  if (!DEMO_MODE) return null;
  return (
    <div className="relative z-50 bg-ember px-4 py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-night">
      Démonstration · aucune commande n'est transmise · aucun paiement
    </div>
  );
}

export function ToConfirm({ children = 'À confirmer' }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-ember/40 bg-ember/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ember-light">
      {children}
    </span>
  );
}
