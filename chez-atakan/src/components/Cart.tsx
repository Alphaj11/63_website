import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Minus, Pencil, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useCustomizer } from '../hooks/useCustomizer';
import { navigate } from '../hooks/useRoute';
import { productById } from '../data/products';
import { lineDetails, lineLabel, unitPrice } from '../lib/pricing';
import { euros } from '../lib/money';
import { Photo } from './ui/Photo';
import { delivery } from '../data/delivery';

/** Suggestions discrètes : n'apparaissent que si le produit n'est pas déjà dans le panier. */
const SUGGESTIONS = [
  { productId: 'nuggets-5', text: 'Tu veux ajouter des nuggets ?' },
  { productId: 'grande-frite', text: 'Une grande frite pour accompagner ?' },
];

export function Cart() {
  const cart = useCart();
  const { openCustomizer } = useCustomizer();

  useEffect(() => {
    if (!cart.isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cart.close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [cart.isOpen, cart]);

  const suggestions = SUGGESTIONS.filter((s) => !cart.has(s.productId) && productById(s.productId)).slice(0, 1);
  const min = delivery.minimumOrder;
  const progress = min ? Math.min(1, cart.subtotal / min) : Math.min(1, cart.count / 4);

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <motion.div className="fixed inset-0 z-[65]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="absolute inset-0 bg-night/70 backdrop-blur-sm" onClick={cart.close} aria-label="Fermer le panier" tabIndex={-1} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 34 }}
            className="absolute right-0 top-0 flex h-[100dvh] w-full max-w-md flex-col border-l border-cream/10 bg-coal"
          >
            <div className="flex items-center justify-between border-b border-cream/10 px-5 py-4">
              <div>
                <p className="eyebrow">Ta commande</p>
                <h2 id="cart-title" className="display text-4xl">
                  Panier
                </h2>
              </div>
              <button onClick={cart.close} className="grid h-11 w-11 place-items-center rounded-full border border-cream/15" aria-label="Fermer le panier" autoFocus>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Barre de progression : articles + total */}
            <div className="px-5 pt-4">
              <div className="flex justify-between text-xs uppercase tracking-[0.16em] text-cream/70">
                <span>
                  {cart.count} article{cart.count > 1 ? 's' : ''}
                </span>
                <span className="font-semibold text-cream">{euros(cart.subtotal)}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream/10">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-ember to-ember-light" animate={{ width: `${progress * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
              </div>
              {min && cart.subtotal < min && (
                <p className="mt-2 text-xs text-ash">Encore {euros(min - cart.subtotal)} pour le minimum de livraison.</p>
              )}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              {cart.lines.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <ShoppingBag className="mx-auto h-10 w-10 text-ember" />
                    <p className="display mt-4 text-3xl">Ton panier a faim</p>
                    <p className="mt-2 text-sm text-cream/60">Compose ton repas ou pioche dans la carte.</p>
                    <button
                      onClick={() => {
                        cart.close();
                        openCustomizer({ kind: 'tacos' });
                      }}
                      className="btn-primary mt-6"
                    >
                      Composer un tacos
                    </button>
                  </div>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {cart.lines.map((line) => {
                      const product = productById(line.config.productId)!;
                      const unit = unitPrice(line.config);
                      return (
                        <motion.li
                          key={line.lineId}
                          layout
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 60, height: 0, marginTop: 0 }}
                          className="flex gap-3 rounded-2xl border border-cream/10 bg-night/40 p-3"
                        >
                          <Photo name={product.image} alt={product.name} className="h-20 w-20 shrink-0 rounded-xl" sizes="80px" small />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-display text-xl font-bold uppercase leading-tight">{lineLabel(line.config)}</p>
                              <p className="shrink-0 font-semibold text-ember-light">{euros(unit * line.quantity)}</p>
                            </div>
                            <ul className="mt-1 space-y-0.5 text-xs text-cream/60">
                              {lineDetails(line.config).map((d) => (
                                <li key={d}>{d}</li>
                              ))}
                            </ul>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button onClick={() => cart.setQuantity(line.lineId, line.quantity - 1)} className="grid h-9 w-9 place-items-center rounded-full border border-cream/20" aria-label={`Retirer un ${product.name}`}>
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-5 text-center font-semibold">{line.quantity}</span>
                                <button onClick={() => cart.setQuantity(line.lineId, line.quantity + 1)} className="grid h-9 w-9 place-items-center rounded-full border border-cream/20" aria-label={`Ajouter un ${product.name}`}>
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="flex items-center gap-1">
                                {product.builder !== 'simple' && (
                                  <button
                                    onClick={() => openCustomizer({ kind: product.builder, productId: product.id, line })}
                                    className="grid h-9 w-9 place-items-center rounded-full text-cream/70 hover:text-ember-light"
                                    aria-label={`Modifier la composition de ${product.name}`}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                )}
                                <button onClick={() => cart.remove(line.lineId)} className="grid h-9 w-9 place-items-center rounded-full text-cream/70 hover:text-ember-light" aria-label={`Supprimer ${product.name}`}>
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}

              {cart.lines.length > 0 &&
                suggestions.map((s) => {
                  const p = productById(s.productId)!;
                  return (
                    <motion.div key={s.productId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-5 flex items-center gap-3 rounded-2xl border border-dashed border-cream/15 p-3">
                      <Photo name={p.image} alt={p.name} className="h-12 w-12 shrink-0 rounded-lg" sizes="48px" small />
                      <div className="flex-1">
                        <p className="text-sm text-cream/85">{s.text}</p>
                        <p className="text-xs text-ash">
                          {p.name} · {euros(p.price ?? 0)}
                        </p>
                      </div>
                      <button
                        onClick={() => cart.add({ productId: p.id, asMenu: false, meats: [], sauces: [], supplements: [] })}
                        className="grid h-10 w-10 place-items-center rounded-full bg-ember/15 text-ember-light hover:bg-ember hover:text-night"
                        aria-label={`Ajouter ${p.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </motion.div>
                  );
                })}
            </div>

            {cart.lines.length > 0 && (
              <div className="border-t border-cream/10 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="text-sm uppercase tracking-[0.16em] text-cream/70">Sous-total</span>
                  <span className="font-display text-3xl font-bold">{euros(cart.subtotal)}</span>
                </div>
                <button
                  onClick={() => {
                    cart.close();
                    navigate('/commande');
                  }}
                  className="btn-primary w-full"
                >
                  Passer commande <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={cart.clear} className="mt-2 w-full py-2 text-xs uppercase tracking-[0.16em] text-ash hover:text-cream">
                  Vider le panier
                </button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Barre de panier permanente sur mobile. */
export function MobileCartBar() {
  const cart = useCart();
  return (
    <AnimatePresence>
      {cart.count > 0 && !cart.isOpen && (
        <motion.button
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          onClick={cart.open}
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex min-h-14 items-center justify-between rounded-full bg-ember px-5 font-semibold text-night shadow-ember md:hidden"
          aria-label={`Voir le panier, ${cart.count} articles, ${euros(cart.subtotal)}`}
        >
          <span className="flex items-center gap-2">
            <motion.span key={cart.pulse} animate={{ scale: [1.4, 1] }} className="grid h-7 min-w-7 place-items-center rounded-full bg-night px-1 text-sm text-cream">
              {cart.count}
            </motion.span>
            Voir le panier
          </span>
          <span>{euros(cart.subtotal)}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
