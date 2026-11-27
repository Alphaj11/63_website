import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Plus, SlidersHorizontal } from 'lucide-react';
import type { Product } from '../lib/types';
import { Photo } from './ui/Photo';
import { ToConfirm } from './ui/DemoBadge';
import { euros } from '../lib/money';
import { basePrice } from '../lib/pricing';
import { useCart } from '../hooks/useCart';
import { useCustomizer } from '../hooks/useCustomizer';

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const cart = useCart();
  const { openCustomizer } = useCustomizer();
  const [added, setAdded] = useState(false);
  const needsChoice = !!product.pricesByMeatCount; // tacos & bowls : il faut choisir ses viandes
  const hasMenu = product.menuPrice !== undefined;

  const quickAdd = () => {
    if (needsChoice) {
      openCustomizer({ kind: product.builder, productId: product.id });
      return;
    }
    cart.add({ productId: product.id, asMenu: false, meats: [], sauces: [], supplements: [] });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-cream/10 bg-coal"
    >
      <button
        onClick={() => openCustomizer({ kind: product.builder, productId: product.id })}
        className="relative block aspect-[4/3] overflow-hidden text-left"
        aria-label={`Personnaliser ${product.name}`}
        tabIndex={-1}
      >
        <Photo
          name={product.image}
          alt={product.name}
          className="h-full w-full"
          imgClassName="group-hover:scale-[1.06] transition-transform duration-[900ms]"
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/10 to-transparent" />
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(70%_60%_at_50%_100%,rgba(255,106,0,.25),transparent)]" />
        {product.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-ember px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-night">
            Incontournable
          </span>
        )}
      </button>

      <div className="relative -mt-10 flex flex-1 flex-col px-5 pb-5">
        <div className="flex items-end justify-between gap-3">
          <h3 className="display text-4xl">{product.name}</h3>
          <div className="shrink-0 text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-ash">{needsChoice ? 'dès' : hasMenu ? 'seul' : 'prix'}</p>
            <p className="font-display text-2xl font-bold text-ember-light">{euros(basePrice(product))}</p>
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-cream/65">{product.description}</p>
        {hasMenu && (
          <p className="mt-2 text-xs text-cream/55">
            En menu : <span className="font-semibold text-cream/85">{euros(product.menuPrice!)}</span>
          </p>
        )}
        {product.toConfirm && (
          <div className="mt-2">
            <ToConfirm>{product.toConfirm} à confirmer</ToConfirm>
          </div>
        )}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <button
            onClick={() => openCustomizer({ kind: product.builder, productId: product.id })}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-cream/20 text-[12px] font-semibold uppercase tracking-[0.12em] transition hover:border-ember-light hover:text-ember-light"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden /> Personnaliser
          </button>
          <button
            onClick={quickAdd}
            className="relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-ember text-[12px] font-semibold uppercase tracking-[0.12em] text-night transition hover:bg-ember-light active:scale-95"
            aria-label={needsChoice ? `Choisir les viandes de ${product.name}` : `Ajouter ${product.name} au panier`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span key="ok" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4" /> Ajouté
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" /> {needsChoice ? 'Choisir' : 'Ajouter'}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
