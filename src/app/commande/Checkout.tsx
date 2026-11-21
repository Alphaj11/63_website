'use client';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { restaurant } from '@/data/restaurant';
import { formatPrice } from '@/lib/money';
import { useHydrated } from '@/lib/useHydrated';
import { ui } from '@/i18n/ui';
import { getOrderGateway, type OrderResult } from '@/services/order/gateway';
import { cartTotal, useCart } from '@/store/cart';
import { useT } from '@/store/lang';

export function Checkout() {
  const { lang, t } = useT();
  const hydrated = useHydrated();
  const { lines, mode, setMode, table, clear } = useCart();
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<OrderResult | null>(null);
  const total = cartTotal(lines);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const res = await getOrderGateway().submit({ lines, total, mode, table, customer: { name, note } });
    setSending(false);
    setResult(res);
    if (res.ok) clear();
  };

  if (!hydrated) return <div className="min-h-[60vh]" />;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-28 sm:pt-36 lg:px-8">
      <AnimatePresence mode="wait">
        {result?.ok ? (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="stage relative overflow-hidden p-8 text-center sm:p-14">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
              className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-ember text-4xl shadow-[0_0_60px_rgba(211,75,37,.6)]">✓</motion.div>
            <h1 className="display-xl mt-8 text-5xl sm:text-6xl">{t({ fr: 'Commande simulée', en: 'Simulated order' })}</h1>
            <p className="mt-3 font-display text-2xl tracking-widest text-crust">{result.reference}</p>
            <p className="mx-auto mt-6 max-w-lg text-bone/70">
              {t({ fr: 'Ceci est une démonstration : aucune commande n’a été transmise au restaurant et aucun paiement n’a été encaissé. En production, le client recevrait ici sa confirmation et son heure de retrait.', en: 'This is a demo: no order was sent to the restaurant and no payment was taken. In production, the customer would see their confirmation and pickup time here.' })}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/" className="btn-ghost">{t(ui.common.backHome)}</Link>
              <a href={`tel:${restaurant.phone.e164}`} className="btn-primary">{t({ fr: 'Commander par téléphone', en: 'Order by phone' })}</a>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="eyebrow">{t({ fr: 'Validation', en: 'Checkout' })}</p>
            <h1 className="display-xl mt-3 text-6xl sm:text-7xl">{t({ fr: 'Votre commande', en: 'Your order' })}</h1>
            <div role="note" className="mt-6 flex items-start gap-3 border border-crust/30 bg-crust/[0.04] p-4 text-sm text-bone/75">
              <DemoBadge />
              <span>{t({ fr: 'Validation simulée : rien n’est envoyé ni encaissé. L’architecture est prête pour un système de commande et un paiement sécurisé hébergé par un prestataire.', en: 'Simulated checkout: nothing is sent or charged. The architecture is ready for an ordering system and secure hosted payment.' })}</span>
            </div>

            {lines.length === 0 ? (
              <div className="mt-12 text-center"><p className="text-bone/60">{t(ui.cart.empty)}</p><Link href="/composer/" className="btn-primary mt-6">{t(ui.cart.emptyCta)}</Link></div>
            ) : (
              <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
                <div className="space-y-6">
                  <fieldset>
                    <legend className="mb-3 text-xs font-semibold uppercase tracking-megawide text-bone/50">{t({ fr: 'Mode', en: 'Mode' })}</legend>
                    <div className="grid grid-cols-2 border border-white/10 text-sm font-semibold uppercase tracking-widest">
                      {(['a-emporter', 'sur-place'] as const).map((m) => (
                        <button key={m} type="button" onClick={() => setMode(m)} aria-pressed={mode === m} className={`py-3 ${mode === m ? 'bg-crust text-coal' : 'text-bone/60'}`}>
                          {m === 'sur-place' ? t(ui.cart.dineIn) : t(ui.cart.takeaway)}
                        </button>
                      ))}
                    </div>
                    {!restaurant.serviceModesConfirmed && <p className="mt-1.5 text-xs text-bone/40">{t(ui.cart.modeUnconfirmed)}</p>}
                    {table && <p className="mt-2 text-sm text-crust">{t(ui.cart.table)} {table}</p>}
                  </fieldset>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-megawide text-bone/50">{t({ fr: 'Prénom (pour l’appel au comptoir)', en: 'First name (for pickup)' })}</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="given-name" maxLength={40}
                      className="w-full border border-white/15 bg-transparent px-4 py-3 text-bone outline-none focus:border-crust" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-megawide text-bone/50">{t({ fr: 'Note (facultatif)', en: 'Note (optional)' })}</span>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={200}
                      className="w-full border border-white/15 bg-transparent px-4 py-3 text-bone outline-none focus:border-crust" />
                  </label>
                </div>
                <aside className="stage h-fit p-6">
                  <ul className="divide-y divide-white/10">
                    {lines.map((l) => (
                      <li key={l.lineId} className="flex justify-between gap-4 py-3 text-sm">
                        <span><span className="text-bone/50">{l.qty} × </span>{t(l.name)}
                          {l.details.length > 0 && <span className="block text-xs text-bone/45">{l.details.map((d) => t(d.label)).join(', ')}</span>}
                        </span>
                        <span className="shrink-0 tabular-nums text-crust">{formatPrice(l.unitPrice * l.qty, lang)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-4">
                    <span className="text-sm uppercase tracking-megawide text-bone/60">{t(ui.cart.total)}</span>
                    <span className="font-display text-4xl text-crust">{formatPrice(total, lang)}</span>
                  </div>
                  <button type="submit" disabled={sending} className="btn-primary mt-6 w-full">
                    {sending ? t({ fr: 'Envoi simulé…', en: 'Simulating…' }) : t({ fr: 'Simuler la commande', en: 'Simulate order' })}
                  </button>
                  <p className="mt-3 text-center text-[11px] text-bone/40">{t({ fr: 'Aucun paiement demandé sur ce site.', en: 'No payment is requested on this site.' })}</p>
                </aside>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
