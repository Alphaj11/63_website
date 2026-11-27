import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu as MenuIcon, ShoppingBag, X, Phone } from 'lucide-react';
import { Logo } from './ui/Logo';
import { useCart } from '../hooks/useCart';
import { goToSection } from '../hooks/useRoute';
import { restaurant } from '../data/restaurant';
import { euros } from '../lib/money';

const links = [
  { id: 'univers', label: 'Notre univers' },
  { id: 'carte', label: 'La carte' },
  { id: 'composer', label: 'Composer' },
  { id: 'avis', label: 'Avis' },
  { id: 'infos', label: 'Infos pratiques' },
];

export function Header() {
  const cart = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    goToSection(id);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || menuOpen ? 'border-b border-cream/10 bg-night/85 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <button onClick={() => go('top')} aria-label="Chez Atakan, retour en haut" className="rounded-lg">
          <Logo compact />
        </button>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="rounded-full px-4 py-2 text-[13px] font-medium uppercase tracking-[0.14em] text-cream/75 transition hover:text-ember-light"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={`tel:${restaurant.phone.e164}`} className="hidden h-11 items-center gap-2 rounded-full px-3 text-sm text-cream/80 hover:text-ember-light md:inline-flex">
            <Phone className="h-4 w-4" aria-hidden /> {restaurant.phone.display}
          </a>
          <button
            onClick={cart.open}
            className="relative inline-flex h-11 items-center gap-2 rounded-full bg-ember px-4 text-sm font-semibold text-night shadow-ember transition hover:bg-ember-light active:scale-95"
            aria-label={`Ouvrir le panier, ${cart.count} article${cart.count > 1 ? 's' : ''}`}
          >
            <ShoppingBag className="h-5 w-5" aria-hidden />
            <span className="hidden sm:inline">{cart.count > 0 ? euros(cart.subtotal) : 'Panier'}</span>
            <AnimatePresence>
              {cart.count > 0 && (
                <motion.span
                  key={cart.pulse}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: [1.5, 1], opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                  className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-cream px-1 text-xs font-bold text-night"
                >
                  {cart.count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="grid h-11 w-11 place-items-center rounded-full border border-cream/15 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Navigation mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100dvh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-night lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 pt-6">
              {links.map((l, i) => (
                <motion.li key={l.id} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i + 0.1 }}>
                  <button onClick={() => go(l.id)} className="display w-full py-3 text-left text-5xl text-cream hover:text-ember-light">
                    {l.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 px-6">
              <a href={`tel:${restaurant.phone.e164}`} className="btn-ghost">
                <Phone className="h-4 w-4" /> Appeler · {restaurant.phone.display}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
