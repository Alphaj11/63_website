import { Logo } from './ui/Logo';
import { InstagramIcon } from './ui/InstagramIcon';
import { restaurant, DEMO_MODE } from '../data/restaurant';
import { credits } from '../data/credits';
import { goToSection } from '../hooks/useRoute';

export function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-night pb-28 pt-16 md:pb-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-cream/60">Chez Atakan, on ne se contente pas de commander un kebab. On entre dans l’expérience.</p>
        </div>
        <nav aria-label="Pied de page" className="grid grid-cols-2 gap-2 text-sm text-cream/70">
          {[
            ['univers', 'Notre univers'],
            ['carte', 'La carte'],
            ['composer', 'Composer'],
            ['avis', 'Avis'],
            ['infos', 'Infos pratiques'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => goToSection(id)} className="py-1 text-left hover:text-ember-light">
              {label}
            </button>
          ))}
          <a href="#/restaurant" className="py-1 hover:text-ember-light">
            Espace restaurant
          </a>
        </nav>
        <div className="text-sm text-cream/70">
          <p>
            {restaurant.address.street}, {restaurant.address.postalCode} {restaurant.address.city}
          </p>
          <a href={`tel:${restaurant.phone.e164}`} className="mt-1 block hover:text-ember-light">
            {restaurant.phone.display}
          </a>
          <a href={restaurant.instagram.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-2 hover:text-ember-light">
            <InstagramIcon className="h-4 w-4" /> {restaurant.instagram.handle}
          </a>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl space-y-2 px-4 text-xs text-ash sm:px-6">
        {DEMO_MODE && <p>Site de démonstration : les commandes ne sont pas transmises et aucun paiement n’est effectué.</p>}
        <p>Tarifs relevés sur la carte du restaurant, donnés à titre indicatif.</p>
        {credits.length > 0 && (
          <details>
            <summary className="cursor-pointer hover:text-cream">Crédits photo</summary>
            <ul className="mt-2 space-y-1">
              {credits.map((c) => (
                <li key={c.key}>
                  <a href={c.url} target="_blank" rel="noreferrer" className="hover:text-cream">
                    {c.author}
                  </a>{' '}
                  · {c.source} · {c.license}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </footer>
  );
}
