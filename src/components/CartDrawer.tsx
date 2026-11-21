'use client';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { DemoBadge } from './ui/DemoBadge';
import { cartRecommendations } from '@/data/demo/recommendations';
import { simpleProducts } from '@/data/menu';
import { restaurant } from '@/data/restaurant';
import { formatPrice } from '@/lib/money';
import { ui } from '@/i18n/ui';
import { cartTotal, useCart } from '@/store/cart';
import { useT } from '@/store/lang';

export function CartDrawer() {
  const { lang, t } = useT();
  const { lines, drawerOpen, openDrawer, setQty, remove, mode, setMode, table, add, lastAdded } = useCart();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && openDrawer(false);
    window.addEventListener('keydown', onKey);
    panel.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, openDrawer]);

  // Suggestions : selon les produits du panier, sans doublon, jamais ajoutées automatiquement.
  const inCart = new Set(lines.map((l) => l.productId));
  const suggestions = [...new Set(lines.flatMap((l) => cartRecommendations[l.kind]?.map((r) => JSON.stringify(r)) ?? []))]
    .map((s) => JSON.parse(s) as (typeof cartRecommendations)['tacos'][number])
    .filter((r) => !inCart.has(r.productId))
    .slice(0, 2)
    .map((r) => ({ r, product: simpleProducts.find((p) => p.id === r.productId)! }))
    .filter((x) => x.product);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div key="veil" className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => openDrawer(false)} />
          <motion.aside key="panel" ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={t(ui.cart.title)}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 260, damping: 32 }}
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col border-l border-white/10 bg-[#121212] outline-none">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="font-display text-2xl uppercase tracking-wide">{t(ui.cart.title)}</h2>
                {table && <p className="text-xs text-crust">{t(ui.cart.table)} {table}</p>}
              </div>
              <button type="button" onClick={() => openDrawer(false)} className="grid h-10 w-10 place-items-center border border-white/10 hover:border-crust/50" aria-label={t(ui.cart.close)}>✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-bone/60">{t(ui.cart.empty)}</p>
                  <Link href="/composer/" onClick={() => openDrawer(false)} className="btn-primary mt-6">{t(ui.cart.emptyCta)}</Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li key={l.lineId} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, backgroundColor: l.lineId === lastAdded ? 'rgba(211,75,37,0.08)' : 'rgba(255,255,255,0.02)' }}
                        exit={{ opacity: 0, x: 40 }} className="border border-white/10 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-bone">{t(l.name)}</h3>
                            {l.details.length > 0 && (
                              <ul className="mt-1 space-y-0.5 text-xs text-bone/55">
                                {l.details.map((d, i) => (
                                  <li key={i}>{t(d.label)}{d.price > 0 ? <span className="text-crust/70"> · +{formatPrice(d.price, lang)}</span> : null}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div className="text-right font-display text-lg tabular-nums text-crust">{formatPrice(l.unitPrice * l.qty, lang)}</div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-white/10" role="group" aria-label={t(ui.cart.qty)}>
                            <button type="button" className="h-8 w-8 hover:bg-white/5" onClick={() => setQty(l.lineId, l.qty - 1)} aria-label="−1">−</button>
                            <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">{l.qty}</span>
                            <button type="button" className="h-8 w-8 hover:bg-white/5" onClick={() => setQty(l.lineId, l.qty + 1)} aria-label="+1">+</button>
                          </div>
                          <div className="flex gap-4 text-xs uppercase tracking-widest">
                            {l.kind !== 'simple' && (
                              <Link href={`/composer/${l.kind}/?edit=${l.lineId}`} onClick={() => openDrawer(false)} className="text-crust hover:underline">{t(ui.cart.edit)}</Link>
                            )}
                            <button type="button" onClick={() => remove(l.lineId)} className="text-bone/50 hover:text-ember">{t(ui.cart.remove)}</button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}

              {suggestions.length > 0 && (
                <div className="mt-6">
                  <div className="eyebrow mb-2">{t(ui.cart.suggestion)}</div>
                  <ul className="space-y-2">
                    {suggestions.map(({ r, product }) => (
                      <li key={product.id} className="flex items-center justify-between gap-3 border border-dashed border-white/15 px-4 py-3 text-sm">
                        <div><div className="text-bone/80">{t(r.reason)}</div><div className="text-xs text-bone/50">{t(product.label)} · {formatPrice(product.price, lang)}</div></div>
                        <button type="button" className="shrink-0 border border-crust/40 px-3 py-1.5 text-xs uppercase tracking-widest text-crust hover:bg-crust/10"
                          onClick={() => add({ kind: 'simple', productId: product.id, name: product.label, details: [], unitPrice: product.price, qty: 1 })}>
                          + {t(ui.cart.add)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-white/10 px-5 py-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
                <fieldset>
                  <legend className="sr-only">Mode</legend>
                  <div className="grid grid-cols-2 border border-white/10 text-xs font-semibold uppercase tracking-widest">
                    {(['a-emporter', 'sur-place'] as const).map((m) => (
                      <button key={m} type="button" onClick={() => setMode(m)} aria-pressed={mode === m}
                        className={`py-2.5 transition ${mode === m ? 'bg-crust text-coal' : 'text-bone/60 hover:text-bone'}`}>
                        {m === 'sur-place' ? t(ui.cart.dineIn) : t(ui.cart.takeaway)}
                      </button>
                    ))}
                  </div>
                  {!restaurant.serviceModesConfirmed && <p className="mt-1.5 text-[11px] text-bone/40">{t(ui.cart.modeUnconfirmed)}</p>}
                </fieldset>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-sm uppercase tracking-megawide text-bone/60">{t(ui.cart.total)}</span>
                  <span className="font-display text-3xl tabular-nums text-crust">{formatPrice(cartTotal(lines), lang)}</span>
                </div>
                <div className="mt-1 flex justify-end"><DemoBadge label={{ fr: 'Tarifs démo', en: 'Demo prices' }} /></div>
                <Link href="/commande/" onClick={() => openDrawer(false)} className="btn-primary mt-4 w-full">{t(ui.cart.checkout)}</Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
