/**
 * Logo typographique TEMPORAIRE — à remplacer par le véritable logo du restaurant.
 * Pour le remplacer : déposer le fichier dans /public/brand/logo.svg et
 * passer USE_REAL_LOGO à true (voir docs/DONNEES.md).
 */
import { asset } from '@/lib/asset';

const USE_REAL_LOGO = false;

export function Logo({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  if (USE_REAL_LOGO) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={asset('/brand/logo.svg')} alt="Grill House 63" className={className} />;
  }
  return (
    <span className={`inline-flex items-center gap-2 leading-none ${className}`} aria-label="Grill House 63">
      <svg viewBox="0 0 40 40" className="h-8 w-8 shrink-0" aria-hidden>
        <path d="M20 3c3 6 9 9 9 17a9 9 0 0 1-18 0c0-4 2-6 4-8 0 3 1 5 3 6-1-6 1-11 2-15z" fill="#D34B25" />
        <path d="M20 17c2 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4 0 1 .5 2 1.5 2.5C19 21 19.5 19 20 17z" fill="#E9C88D" />
        <path d="M6 33h28M9 37h22" stroke="#E9C88D" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {!compact && (
        <span className="flex flex-col">
          <span className="font-display text-[19px] tracking-[0.08em] text-bone">GRILL HOUSE <span className="text-ember">63</span></span>
          <span className="mt-0.5 text-[8.5px] font-semibold uppercase tracking-[0.42em] text-crust/70">Kebab · Lyon 7</span>
        </span>
      )}
    </span>
  );
}
