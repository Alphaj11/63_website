import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Bike, Info, Loader2, ShieldCheck, Store } from 'lucide-react';
import type { CustomerDetails, FulfilmentMode } from '../lib/types';
import { useCart } from '../hooks/useCart';
import { navigate } from '../hooks/useRoute';
import { lineDetails, lineLabel, unitPrice } from '../lib/pricing';
import { euros } from '../lib/money';
import { buildOrder } from '../lib/order';
import { checkZone, delivery } from '../data/delivery';
import { DEMO_MODE, restaurant } from '../data/restaurant';
import { orders } from '../services/orders';
import { readJSON, writeJSON } from '../lib/storage';
import { ToConfirm } from './ui/DemoBadge';

const EMPTY: CustomerDetails = { name: '', phone: '', address: '', postalCode: '', city: '', addressComplement: '', instructions: '' };
const FORM_KEY = 'atakan:checkout-form';

/** Les coordonnées restent dans la session du navigateur (sessionStorage), jamais ailleurs en démo. */
function useSessionForm() {
  const [form, setForm] = useState<CustomerDetails>(() => {
    try {
      return { ...EMPTY, ...JSON.parse(sessionStorage.getItem(FORM_KEY) ?? '{}') };
    } catch {
      return EMPTY;
    }
  });
  useEffect(() => {
    try {
      sessionStorage.setItem(FORM_KEY, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [form]);
  return [form, setForm] as const;
}

const phoneOk = (p: string) => /^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(p.trim());

export function Checkout() {
  const cart = useCart();
  const [mode, setMode] = useState<FulfilmentMode>(delivery.deliveryEnabled ? 'livraison' : 'retrait');
  const [form, setForm] = useSessionForm();
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const zone = useMemo(() => (form.postalCode.length === 5 ? checkZone(form.postalCode) : null), [form.postalCode]);
  const fee = mode === 'livraison' ? (zone?.status === 'ok' ? zone.fee : delivery.fee) : 0;
  const total = cart.subtotal + (fee ?? 0);
  const belowMinimum = mode === 'livraison' && delivery.minimumOrder !== null && cart.subtotal < delivery.minimumOrder;

  const set = (k: keyof CustomerDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validateForm = () => {
    const e: typeof errors = {};
    if (form.name.trim().length < 2) e.name = 'Indique ton nom.';
    if (!phoneOk(form.phone)) e.phone = 'Numéro français attendu, ex. 06 12 34 56 78.';
    if (mode === 'livraison') {
      if (form.address.trim().length < 4) e.address = 'Indique ton adresse.';
      if (!/^\d{5}$/.test(form.postalCode.trim())) e.postalCode = 'Code postal à 5 chiffres.';
      else if (zone?.status === 'outside') e.postalCode = 'Ce code postal n’est pas dans la zone de livraison.';
      if (form.city.trim().length < 2) e.city = 'Indique ta commune.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitError(null);
    if (!validateForm() || belowMinimum) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const seq = readJSON<number>('atakan:order-seq', 0) + 1;
      writeJSON('atakan:order-seq', seq);
      const order = buildOrder({ lines: cart.lines, mode, customer: form, deliveryFee: fee, sequence: seq });
      const saved = await orders.submit(order);
      cart.clear();
      navigate(`/commande/${saved.id}`);
    } catch {
      setSubmitError('La commande n’a pas pu être enregistrée. Réessaie ou appelle le restaurant.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-4 text-center">
        <div>
          <p className="display text-5xl">Ton panier est vide</p>
          <p className="mt-3 text-cream/65">Ajoute quelque chose de bon avant de passer commande.</p>
          <a href="#carte" onClick={() => navigate('')} className="btn-primary mt-8">
            Voir la carte
          </a>
        </div>
      </div>
    );
  }

  const field = (k: keyof CustomerDetails, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`f-${k}`} className="label">
        {label}
      </label>
      <input id={`f-${k}`} className={`field ${errors[k] ? 'border-ember' : ''}`} value={form[k]} onChange={set(k)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `e-${k}` : undefined} {...props} />
      {errors[k] && (
        <p id={`e-${k}`} className="mt-1 text-sm text-ember-light">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-32 pt-8 sm:px-6">
      <button onClick={() => navigate('')} className="inline-flex min-h-11 items-center gap-2 text-sm text-cream/70 hover:text-ember-light">
        <ArrowLeft className="h-4 w-4" /> Continuer mes achats
      </button>
      <h1 className="display mt-4 text-6xl sm:text-7xl">
        Ta <span className="text-ember">commande</span>
      </h1>

      {DEMO_MODE && (
        <div className="mt-6 flex gap-3 rounded-2xl border border-ember/40 bg-ember/10 p-4 text-sm text-cream/90">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-ember" />
          <p>
            <strong>Mode démonstration.</strong> Utilise des coordonnées fictives : la commande ne sera pas transmise au restaurant et aucun paiement ne sera demandé. Pour commander pour de vrai, appelle le{' '}
            <a className="underline" href={`tel:${restaurant.phone.e164}`}>
              {restaurant.phone.display}
            </a>
            .
          </p>
        </div>
      )}

      <form onSubmit={submit} noValidate className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-3">
          <fieldset>
            <legend className="display mb-4 text-3xl">1. Livraison ou retrait</legend>
            <div className="grid grid-cols-2 gap-3" role="radiogroup">
              {delivery.deliveryEnabled && (
                <button type="button" role="radio" aria-checked={mode === 'livraison'} onClick={() => setMode('livraison')} className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition ${mode === 'livraison' ? 'border-ember bg-ember/10' : 'border-cream/10 hover:border-cream/30'}`}>
                  <Bike className="h-6 w-6 text-ember" />
                  <span className="mt-2 font-display text-2xl font-bold uppercase">Livraison</span>
                  <span className="text-xs text-cream/60">à domicile</span>
                </button>
              )}
              {delivery.pickupEnabled && (
                <button type="button" role="radio" aria-checked={mode === 'retrait'} onClick={() => setMode('retrait')} className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition ${mode === 'retrait' ? 'border-ember bg-ember/10' : 'border-cream/10 hover:border-cream/30'}`}>
                  <Store className="h-6 w-6 text-ember" />
                  <span className="mt-2 font-display text-2xl font-bold uppercase">Retrait</span>
                  <span className="text-xs text-cream/60">sur place, {restaurant.address.city}</span>
                </button>
              )}
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="display mb-4 text-3xl">2. Tes coordonnées</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {field('name', 'Nom', { autoComplete: 'name', placeholder: 'Ex. Camille D.' })}
              {field('phone', 'Téléphone', { autoComplete: 'tel', inputMode: 'tel', placeholder: '06 12 34 56 78' })}
            </div>
            {mode === 'livraison' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                {field('address', 'Adresse de livraison', { autoComplete: 'street-address', placeholder: 'N° et rue' })}
                <div className="grid grid-cols-2 gap-4">
                  {field('postalCode', 'Code postal', { autoComplete: 'postal-code', inputMode: 'numeric', maxLength: 5 })}
                  {field('city', 'Commune', { autoComplete: 'address-level2' })}
                </div>
                {zone?.status === 'unconfigured' && (
                  <p className="flex flex-wrap items-center gap-2 text-sm text-cream/70">
                    <ToConfirm>Zone de livraison à confirmer</ToConfirm> Le restaurant précisera les communes desservies.
                  </p>
                )}
                {zone?.status === 'ok' && <p className="text-sm text-ember-light">Bonne nouvelle : on livre à {zone.zone.city}.</p>}
                {field('addressComplement', 'Complément d’adresse', { placeholder: 'Bâtiment, étage, digicode…' })}
                <div>
                  <label htmlFor="f-instructions" className="label">
                    Instructions de livraison
                  </label>
                  <textarea id="f-instructions" className="field min-h-24" value={form.instructions} onChange={set('instructions')} maxLength={240} placeholder="Ex. sonner à l’interphone « Dupont »" />
                </div>
              </motion.div>
            )}
          </fieldset>

          <div className="flex gap-3 rounded-2xl border border-cream/10 p-4 text-sm text-cream/70">
            <ShieldCheck className="h-5 w-5 shrink-0 text-ember" />
            <p>Aucun paiement en ligne : le règlement se fait au restaurant ou à la livraison, selon les moyens acceptés par le restaurant.</p>
          </div>
        </div>

        <aside className="lg:col-span-2">
          <div className="panel sticky top-24 p-5 sm:p-6">
            <h2 className="display text-3xl">3. Récapitulatif</h2>
            <ul className="mt-4 divide-y divide-cream/10">
              {cart.lines.map((l) => (
                <li key={l.lineId} className="py-3">
                  <div className="flex justify-between gap-3">
                    <span className="font-semibold">
                      {l.quantity} × {lineLabel(l.config)}
                    </span>
                    <span className="shrink-0">{euros(unitPrice(l.config) * l.quantity)}</span>
                  </div>
                  <ul className="mt-1 text-xs text-cream/55">
                    {lineDetails(l.config).map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-cream/10 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-cream/70">Sous-total</dt>
                <dd>{euros(cart.subtotal)}</dd>
              </div>
              {mode === 'livraison' && (
                <div className="flex justify-between">
                  <dt className="text-cream/70">Livraison</dt>
                  <dd>{fee === null ? <ToConfirm /> : euros(fee)}</dd>
                </div>
              )}
              <div className="flex items-baseline justify-between pt-2">
                <dt className="font-semibold uppercase tracking-[0.14em]">Total</dt>
                <dd className="font-display text-4xl font-bold text-ember-light">{euros(total)}</dd>
              </div>
              {mode === 'livraison' && fee === null && <p className="text-xs text-ash">Hors frais de livraison, à confirmer par le restaurant.</p>}
            </dl>
            {belowMinimum && <p className="mt-3 text-sm text-ember-light">Minimum de commande pour la livraison : {euros(delivery.minimumOrder!)}.</p>}
            {submitError && (
              <p role="alert" className="mt-3 text-sm text-ember-light">
                {submitError}
              </p>
            )}
            <button type="submit" disabled={submitting || belowMinimum} className="btn-primary mt-5 w-full">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {DEMO_MODE ? 'Confirmer la commande de démo' : 'Envoyer ma commande'}
            </button>
            {DEMO_MODE && <p className="mt-2 text-center text-xs text-ash">Rien ne sera envoyé au restaurant.</p>}
          </div>
        </aside>
      </form>
    </div>
  );
}
