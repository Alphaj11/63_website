'use client';
import Link from 'next/link';
import { Logo } from './Logo';
import { NAV } from './Navigation';
import { mapsLinks, restaurant } from '@/data/restaurant';
import { ui } from '@/i18n/ui';
import { useT } from '@/store/lang';

export function Footer() {
  const { t } = useT();
  return (
    <footer className="relative border-t border-white/10 bg-[#0f0f0f] pb-24 pt-16 sm:pb-10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm font-serif text-lg italic text-bone/60">{t(ui.hero.tagline1)} {t(ui.hero.tagline2)}</p>
        </div>
        <nav aria-label="Pied de page">
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.href}><Link href={n.href} className="text-bone/60 hover:text-bone">{t(n.label)}{n.soon ? ` · ${t(ui.nav.soon)}` : ''}</Link></li>
            ))}
            <li><Link href="/qr/" className="text-bone/60 hover:text-bone">{t({ fr: 'QR codes de table (démo)', en: 'Table QR codes (demo)' })}</Link></li>
          </ul>
        </nav>
        <div className="text-sm text-bone/60">
          <address className="not-italic">
            {restaurant.address.street}<br />{restaurant.address.postalCode} {restaurant.address.city}
          </address>
          <a href={`tel:${restaurant.phone.e164}`} className="mt-2 block text-crust hover:text-bone">{restaurant.phone.display}</a>
          <a href={mapsLinks.directions} target="_blank" rel="noopener noreferrer" className="mt-2 block hover:text-bone">{t(ui.common.directions)} ↗</a>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-white/10 px-4 pt-6 text-xs text-bone/40 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>{t({ fr: 'Prototype de démonstration. Carte, tarifs et commande simulés : aucune commande n’est transmise, aucun paiement n’est encaissé.', en: 'Demo prototype. Menu, prices and ordering are simulated: no order is sent, no payment is taken.' })}</p>
        <p className="shrink-0 uppercase tracking-[0.25em]">Digital experience by <span className="text-crust">Qamar Conception</span></p>
      </div>
    </footer>
  );
}
