'use client';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ui } from '@/i18n/ui';
import { cartCount, useCart } from '@/store/cart';
import { useT } from '@/store/lang';
import { useHydrated } from '@/lib/useHydrated';

export const NAV = [
  { href: '/', label: ui.nav.home },
  { href: '/univers/', label: ui.nav.universe },
  { href: '/carte/', label: ui.nav.menu },
  { href: '/composer/', label: ui.nav.compose },
  { href: '/avis/', label: ui.nav.reviews },
  { href: '/fidelite/', label: ui.nav.loyalty, soon: true },
  { href: '/nous-trouver/', label: ui.nav.find },
];

const norm = (p: string) => p.replace(/\/+$/, '') || '/';

export function Navigation() {
  const { t } = useT();
  const pathname = norm(usePathname() ?? '/');
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lines = useCart((s) => s.lines);
  const openDrawer = useCart((s) => s.openDrawer);
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(lines) : 0;

  useMotionValueEvent(scrollY, 'change', (v) => setSolid(v > 40));
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(norm(href)));

  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ember focus:px-4 focus:py-2">{t(ui.nav.skip)}</a>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${solid || pathname !== '/' ? 'border-b border-white/5 bg-coal/80 backdrop-blur-xl' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:h-20 lg:px-8">
          <Link href="/" className="shrink-0" aria-label="Grill House 63 — accueil"><Logo /></Link>

          <nav className="hidden xl:block" aria-label="Navigation principale">
            <ul className="flex items-center gap-0.5 2xl:gap-2">
              {NAV.slice(1).map((n) => (
                <li key={n.href}>
                  <Link href={n.href} aria-current={isActive(n.href) ? 'page' : undefined}
                    className={`relative whitespace-nowrap px-2 py-2 text-[10.5px] font-semibold uppercase tracking-[0.13em] transition ${isActive(n.href) ? 'text-bone' : 'text-bone/60 hover:text-bone'}`}>
                    {t(n.label)}
                    {n.soon && <span className="ml-1.5 align-super text-[8px] tracking-widest text-crust/70">{t(ui.nav.soon)}</span>}
                    {isActive(n.href) && <motion.span layoutId="nav-underline" className="absolute inset-x-2 -bottom-0.5 h-px bg-ember" />}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <button type="button" onClick={() => openDrawer(true)} className="relative hidden h-10 w-10 place-items-center border border-white/10 text-bone/80 hover:border-crust/50 sm:grid" aria-label={`${t(ui.nav.cart)} (${count})`}>
              <CartIcon />
              {count > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1 text-[10px] font-bold">{count}</span>}
            </button>
            <Link href="/carte/" className="btn-primary hidden !px-5 !py-2.5 sm:inline-flex">{t(ui.nav.order)}</Link>
            <button type="button" className="grid h-10 w-10 place-items-center border border-white/10 xl:hidden" aria-expanded={menuOpen} aria-controls="menu-mobile"
              onClick={() => setMenuOpen((o) => !o)} aria-label={t(ui.nav.more)}>
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 top-0 h-px w-5 bg-bone transition ${menuOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
                <span className={`absolute bottom-0 left-0 h-px w-5 bg-bone transition ${menuOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Menu plein écran (mobile / tablette) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div id="menu-mobile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-coal/[0.98] px-6 pb-28 pt-24 xl:hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(211,75,37,.22),transparent_55%)]" />
            <nav aria-label="Navigation mobile" className="relative">
              <ul className="space-y-1">
                {NAV.map((n, i) => (
                  <motion.li key={n.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                    <Link href={n.href} className={`flex items-baseline gap-3 py-2 font-display text-4xl uppercase ${isActive(n.href) ? 'text-ember' : 'text-bone'}`}>
                      <span className="w-8 font-sans text-xs text-crust/50">0{i + 1}</span>{t(n.label)}
                      {n.soon && <span className="font-sans text-[10px] tracking-widest text-crust/70">{t(ui.nav.soon)}</span>}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <Link href="/carte/" className="btn-primary mt-8 w-full">{t(ui.nav.order)}</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barre mobile : accès permanent au panier */}
      <nav aria-label="Raccourcis" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-coal/95 backdrop-blur-xl sm:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <ul className="grid h-16 grid-cols-4 text-[10px] font-semibold uppercase tracking-widest">
          <li><Link href="/carte/" className={`flex h-full flex-col items-center justify-center gap-1 ${isActive('/carte/') ? 'text-ember' : 'text-bone/70'}`}><MenuIcon />{t(ui.nav.menu)}</Link></li>
          <li><Link href="/composer/" className={`flex h-full flex-col items-center justify-center gap-1 ${isActive('/composer/') ? 'text-ember' : 'text-bone/70'}`}><FlameIcon />{t(ui.nav.composeShort)}</Link></li>
          <li><Link href="/avis/" className={`flex h-full flex-col items-center justify-center gap-1 ${isActive('/avis/') ? 'text-ember' : 'text-bone/70'}`}><StarIcon />{t(ui.nav.reviews)}</Link></li>
          <li>
            <button type="button" onClick={() => openDrawer(true)} className="relative flex h-full w-full flex-col items-center justify-center gap-1 text-bone">
              <span className="relative"><CartIcon />{count > 0 && <span className="absolute -right-3 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-ember px-1 text-[9px]">{count}</span>}</span>
              {t(ui.nav.cart)}
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

export const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M4 7h16l-1.5 12.5a1 1 0 0 1-1 .9H6.5a1 1 0 0 1-1-.9L4 7Z" /><path d="M8.5 7V5.5a3.5 3.5 0 0 1 7 0V7" /></svg>
);
const MenuIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M5 4h14v16H5z" /><path d="M8 9h8M8 13h8M8 17h5" /></svg>);
const FlameIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M12 3c2 4 6 6 6 11a6 6 0 0 1-12 0c0-3 1.5-4.5 3-6 0 2 .8 3.4 2 4-1-4 .5-7 1-9Z" /></svg>);
const StarIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8L12 3Z" /></svg>);
