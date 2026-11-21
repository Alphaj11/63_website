'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { ui } from '@/i18n/ui';
import { useCart } from '@/store/cart';
import { useT } from '@/store/lang';

/** Page d'arrivée d'un QR code de table : /table/?t=12 */
export function TableWelcome() {
  const { t } = useT();
  const params = useSearchParams();
  const raw = Number(params.get('t'));
  const table = Number.isInteger(raw) && raw > 0 && raw < 1000 ? raw : null;
  const setTable = useCart((s) => s.setTable);
  const openDrawer = useCart((s) => s.openDrawer);

  useEffect(() => { if (table) setTable(table); }, [table, setTable]);

  const tiles = [
    { href: '/carte/', label: ui.nav.menu, sub: { fr: 'Toute la carte', en: 'Full menu' } },
    { href: '/composer/', label: ui.nav.compose, sub: { fr: 'Tacos, kebab, kumpir, assiette', en: 'Tacos, kebab, kumpir, platter' } },
    { action: () => openDrawer(true), label: ui.nav.cart, sub: { fr: 'Voir ma commande', en: 'View my order' } },
    { href: '/fidelite/', label: ui.nav.loyalty, sub: { fr: 'Bientôt disponible', en: 'Coming soon' } },
    { href: '/carte/', label: { fr: 'Offres du moment', en: 'Current offers' }, sub: { fr: 'Emplacement démo', en: 'Demo slot' } },
  ];

  return (
    <section className="mx-auto max-w-3xl px-4 pb-28 pt-28">
      <DemoBadge label={{ fr: 'Expérience QR · démo', en: 'QR experience · demo' }} />
      <h1 className="display-xl mt-4 text-6xl sm:text-7xl">
        {t({ fr: 'Bienvenue', en: 'Welcome' })}{table ? <><br /><span className="text-ember">{t(ui.cart.table)} {table}</span></> : null}
      </h1>
      <p className="mt-4 text-bone/65">{t({ fr: 'Composez, commandez, on s’occupe du reste.', en: 'Build, order, we’ll take care of the rest.' })}</p>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {tiles.map((tile, i) => {
          const inner = (
            <>
              <span className="font-display text-3xl uppercase">{t(tile.label)}</span>
              <span className="mt-1 block text-sm text-bone/55">{t(tile.sub)}</span>
              <span className="absolute right-5 top-5 text-ember">→</span>
            </>
          );
          const cls = 'relative block w-full border border-white/10 bg-white/[0.02] p-6 text-left transition hover:border-ember/60';
          return (
            <motion.li key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              {'href' in tile && tile.href ? <Link href={tile.href} className={cls}>{inner}</Link> : <button type="button" onClick={tile.action} className={cls}>{inner}</button>}
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
