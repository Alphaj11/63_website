import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Minus, Plus, X } from 'lucide-react';
import type { BuilderKind, Configuration, Product } from '../lib/types';
import { products, productById } from '../data/products';
import { meats as allMeats, supplements as allSupplements, meatRules } from '../data/ingredients';
import { sauces as allSauces, sauceRules } from '../data/sauces';
import { menuFormulaDescription } from '../data/restaurant';
import { euros } from '../lib/money';
import { lineDetails, unitPrice, validate } from '../lib/pricing';
import { useCart } from '../hooks/useCart';
import { useCustomizer, type CustomizerRequest } from '../hooks/useCustomizer';
import { IngredientLayers } from './IngredientLayers';
import { Photo } from './ui/Photo';
import { ToConfirm } from './ui/DemoBadge';

type StepId = 'product' | 'formula' | 'count' | 'meats' | 'sauces' | 'extras' | 'recap';

const STEP_LABEL: Record<StepId, string> = {
  product: 'Ton produit',
  formula: 'Seul ou en menu',
  count: 'Nombre de viandes',
  meats: 'Tes viandes',
  sauces: 'Tes sauces',
  extras: 'Suppléments',
  recap: 'Récapitulatif',
};

/** Étapes de chaque configurateur — pilotées par les données (prix, suppléments applicables). */
function stepsFor(kind: BuilderKind, product: Product): StepId[] {
  const hasExtras = allSupplements.some((s) => s.appliesTo.includes(product.category));
  const steps: StepId[] = [];
  if (kind === 'sandwich' || kind === 'burger') steps.push('product', 'formula', 'sauces');
  if (kind === 'tacos' || kind === 'bowl') steps.push('count', 'meats', 'sauces');
  if (kind !== 'simple' && hasExtras) steps.push('extras');
  steps.push('recap');
  return steps;
}

const TITLE: Record<BuilderKind, string> = {
  sandwich: 'Compose ton sandwich',
  burger: 'Compose ton burger',
  tacos: 'Compose ton tacos',
  bowl: 'Compose ton bowl',
  simple: 'Ajoute à ta commande',
};

function initialProductId(req: CustomizerRequest): string {
  if (req.productId) return req.productId;
  const map: Record<BuilderKind, string> = { sandwich: 'kebab', burger: 'burger', tacos: 'tacos', bowl: 'bowl', simple: 'petite-frite' };
  return map[req.kind];
}

export function ProductCustomizer() {
  const { request } = useCustomizer();
  return <AnimatePresence>{request && <CustomizerDialog key={request.line?.lineId ?? request.productId ?? request.kind} request={request} />}</AnimatePresence>;
}

function CustomizerDialog({ request }: { request: CustomizerRequest }) {
  const cart = useCart();
  const { closeCustomizer } = useCustomizer();
  const editing = request.line;
  const init = editing?.config;

  const [productId, setProductId] = useState(init?.productId ?? initialProductId(request));
  const product = productById(productId)!;
  const kind = product.builder;
  const steps = useMemo(() => stepsFor(kind, product), [kind, product]);

  const [stepIndex, setStepIndex] = useState(0);
  const [asMenu, setAsMenu] = useState(init?.asMenu ?? false);
  const [meatCount, setMeatCount] = useState(init?.meats.length || 1);
  const [meats, setMeats] = useState<string[]>(init?.meats ?? []);
  const [sauces, setSauces] = useState<string[]>(init?.sauces ?? []);
  const [extras, setExtras] = useState<string[]>(init?.supplements ?? []);
  const [quantity, setQuantity] = useState(editing?.quantity ?? 1);
  const [note, setNote] = useState(init?.note ?? '');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const applicableExtras = extras.filter((id) => allSupplements.find((s) => s.id === id)?.appliesTo.includes(product.category));
  const config: Configuration = {
    productId,
    asMenu: product.menuPrice !== undefined ? asMenu : false,
    meats: product.pricesByMeatCount ? meats.slice(0, meatCount) : [],
    sauces: kind === 'simple' ? [] : sauces,
    supplements: applicableExtras,
    note: note.trim() || undefined,
  };
  const price = unitPrice({ ...config, meats: product.pricesByMeatCount ? Array(meatCount).fill('x') : [] });

  // Verrouillage du défilement, Échap pour fermer, focus initial
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCustomizer();
    window.addEventListener('keydown', onKey);
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [closeCustomizer]);

  useEffect(() => setError(null), [step, meats, meatCount]);

  const canNext = (): string | null => {
    if (step === 'meats' && meats.length < meatCount) {
      const left = meatCount - meats.length;
      return `Choisis encore ${left} viande${left > 1 ? 's' : ''}.`;
    }
    return null;
  };

  const next = () => {
    const err = canNext();
    if (err) return setError(err);
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  const submit = () => {
    const err = validate(config, product.pricesByMeatCount ? meatCount : undefined);
    if (err) {
      setError(err);
      const idx = steps.indexOf('meats');
      if (idx >= 0) setStepIndex(idx);
      return;
    }
    if (editing) cart.replace(editing.lineId, config, quantity);
    else cart.add(config, quantity);
    setDone(true);
    window.setTimeout(() => {
      closeCustomizer();
      if (!editing) cart.open();
    }, 650);
  };

  const addMeat = (id: string) =>
    setMeats((m) => (m.length >= meatCount || (!meatRules.allowRepeat && m.includes(id)) ? m : [...m, id]));
  const removeMeat = (id: string) =>
    setMeats((m) => {
      const i = m.lastIndexOf(id);
      return i < 0 ? m : [...m.slice(0, i), ...m.slice(i + 1)];
    });
  const toggleSauce = (id: string) =>
    setSauces((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id);
      if (!sauceRules.allowMultiple) return [id];
      if (s.length >= sauceRules.maxSauces) return [...s.slice(1), id];
      return [...s, id];
    });
  const toggleExtra = (id: string) => setExtras((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));

  const siblings = products.filter((p) => p.builder === kind);

  return (
    <motion.div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button className="absolute inset-0 bg-night/80 backdrop-blur-sm" onClick={closeCustomizer} aria-label="Fermer le configurateur" tabIndex={-1} />
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="customizer-title"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 32 }}
        className="relative flex h-[100dvh] w-full max-w-6xl flex-col overflow-hidden bg-coal outline-none sm:h-[min(860px,94dvh)] sm:rounded-[2rem] sm:border sm:border-cream/10 lg:flex-row"
      >
        {/* Scène visuelle */}
        <div className="relative h-[38dvh] shrink-0 lg:h-auto lg:w-[55%]">
          <IngredientLayers
            product={product}
            meats={config.meats}
            sauces={config.sauces}
            supplements={config.supplements}
            asMenu={config.asMenu}
            final={step === 'recap'}
          />
          <button onClick={closeCustomizer} className="absolute left-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-night/70 backdrop-blur lg:hidden" aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Étapes */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-cream/10 px-5 py-4 sm:px-7">
            <div>
              <p className="eyebrow">
                {editing ? 'Modifier' : 'Étape'} {stepIndex + 1}/{steps.length} · {STEP_LABEL[step]}
              </p>
              <h2 id="customizer-title" className="display mt-1 text-3xl sm:text-4xl">
                {TITLE[kind]}
              </h2>
            </div>
            <button onClick={closeCustomizer} className="hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-cream/15 hover:border-ember lg:grid" aria-label="Fermer">
              <X className="h-5 w-5" />
            </button>
          </div>

          <ol className="flex gap-1 px-5 pt-3 sm:px-7" aria-label="Progression">
            {steps.map((s, i) => (
              <li key={s} className="h-1 flex-1 overflow-hidden rounded-full bg-cream/10">
                <motion.div className="h-full bg-ember" initial={false} animate={{ width: i <= stepIndex ? '100%' : '0%' }} transition={{ duration: 0.35 }} />
              </li>
            ))}
          </ol>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
                {step === 'product' && (
                  <div className="grid grid-cols-2 gap-3">
                    {siblings.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setProductId(p.id)}
                        aria-pressed={p.id === productId}
                        className={`group overflow-hidden rounded-2xl border text-left transition ${p.id === productId ? 'border-ember bg-ember/10' : 'border-cream/10 hover:border-cream/30'}`}
                      >
                        <Photo name={p.image} alt="" className="aspect-[16/10] w-full" sizes="200px" />
                        <div className="flex items-center justify-between gap-2 p-3">
                          <span className="font-display text-xl font-bold uppercase leading-none">{p.name}</span>
                          <span className="text-sm text-ember-light">{euros(p.price ?? 0)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {step === 'formula' && product.menuPrice !== undefined && (
                  <div className="grid gap-3">
                    {[
                      { v: false, label: `${product.name} seul`, price: product.price ?? 0 },
                      { v: true, label: `${product.name} en menu`, price: product.menuPrice },
                    ].map((o) => (
                      <button
                        key={String(o.v)}
                        onClick={() => setAsMenu(o.v)}
                        aria-pressed={asMenu === o.v}
                        className={`flex min-h-16 items-center justify-between rounded-2xl border px-5 text-left transition ${asMenu === o.v ? 'border-ember bg-ember/10' : 'border-cream/10 hover:border-cream/30'}`}
                      >
                        <span className="font-display text-2xl font-bold uppercase">{o.label}</span>
                        <span className="font-semibold text-ember-light">{euros(o.price)}</span>
                      </button>
                    ))}
                    <p className="text-sm text-cream/60">
                      {menuFormulaDescription ?? 'Le contenu exact de la formule menu sera précisé par le restaurant.'}
                    </p>
                  </div>
                )}

                {step === 'count' && product.pricesByMeatCount && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {product.pricesByMeatCount.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setMeatCount(i + 1);
                          setMeats((m) => m.slice(0, i + 1));
                        }}
                        aria-pressed={meatCount === i + 1}
                        className={`flex flex-col items-start rounded-2xl border p-5 text-left transition ${meatCount === i + 1 ? 'border-ember bg-ember/10' : 'border-cream/10 hover:border-cream/30'}`}
                      >
                        <span className="display text-6xl text-ember">{i + 1}</span>
                        <span className="mt-1 text-sm uppercase tracking-[0.14em] text-cream/70">viande{i > 0 ? 's' : ''}</span>
                        <span className="mt-3 font-semibold">{euros(p)}</span>
                      </button>
                    ))}
                  </div>
                )}

                {step === 'meats' && (
                  <div>
                    <p className="mb-4 flex flex-wrap items-center gap-2 text-sm text-cream/70">
                      {meats.length}/{meatCount} choisie{meatCount > 1 ? 's' : ''}.
                      {meatRules.allowRepeat && ' Tu peux prendre plusieurs fois la même.'}
                      {meatRules.allowRepeat && !meatRules.confirmed && <ToConfirm />}
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {allMeats.map((m) => {
                        const n = meats.filter((x) => x === m.id).length;
                        const full = meats.length >= meatCount;
                        return (
                          <div key={m.id} className={`relative overflow-hidden rounded-2xl border transition ${n ? 'border-ember bg-ember/10' : 'border-cream/10'}`}>
                            <button onClick={() => addMeat(m.id)} disabled={full && !n} className="block w-full text-left disabled:opacity-40" aria-label={`Ajouter ${m.name}`}>
                              <Photo name={m.image} alt="" className="aspect-square w-full" sizes="180px" />
                              <span className="block px-3 pb-1 pt-2 font-display text-xl font-bold uppercase">{m.name}</span>
                            </button>
                            <div className="flex items-center justify-between px-3 pb-3">
                              <button onClick={() => removeMeat(m.id)} disabled={!n} className="grid h-9 w-9 place-items-center rounded-full border border-cream/20 disabled:opacity-30" aria-label={`Retirer ${m.name}`}>
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="font-semibold" aria-live="polite">{n}</span>
                              <button onClick={() => addMeat(m.id)} disabled={full} className="grid h-9 w-9 place-items-center rounded-full bg-ember text-night disabled:opacity-30" aria-label={`Ajouter ${m.name}`}>
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <AnimatePresence>
                              {n > 0 && (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-ember text-sm font-bold text-night">
                                  {n}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 'sauces' && (
                  <div>
                    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-cream/70">
                      {sauceRules.allowMultiple ? `Jusqu'à ${sauceRules.maxSauces} sauces.` : 'Une sauce.'} Facultatif.
                      {!sauceRules.confirmed && <ToConfirm>Règle à confirmer</ToConfirm>}
                    </div>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Sauces">
                      {allSauces.map((s) => (
                        <button key={s.id} onClick={() => toggleSauce(s.id)} aria-pressed={sauces.includes(s.id)} className="chip">
                          <span className="h-4 w-4 rounded-full ring-1 ring-cream/25" style={{ background: s.color }} aria-hidden />
                          {s.name}
                          {sauces.includes(s.id) && <Check className="h-4 w-4 text-ember-light" aria-hidden />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 'extras' && (
                  <div className="grid gap-3">
                    {allSupplements
                      .filter((s) => s.appliesTo.includes(product.category))
                      .map((s) => (
                        <button
                          key={s.id}
                          onClick={() => toggleExtra(s.id)}
                          aria-pressed={extras.includes(s.id)}
                          className={`flex min-h-16 items-center gap-4 rounded-2xl border p-3 text-left transition ${extras.includes(s.id) ? 'border-ember bg-ember/10' : 'border-cream/10 hover:border-cream/30'}`}
                        >
                          <Photo name={s.image} alt="" className="h-14 w-14 shrink-0 rounded-xl" sizes="56px" small />
                          <span className="flex-1 font-semibold">{s.name}</span>
                          <span className="text-ember-light">+{euros(s.price)}</span>
                          <span className={`grid h-7 w-7 place-items-center rounded-full border ${extras.includes(s.id) ? 'border-ember bg-ember text-night' : 'border-cream/25'}`}>
                            {extras.includes(s.id) && <Check className="h-4 w-4" />}
                          </span>
                        </button>
                      ))}
                    <p className="text-xs text-ash">Facultatif. Produits concernés à confirmer par le restaurant.</p>
                  </div>
                )}

                {step === 'recap' && (
                  <div>
                    <div className="panel p-5">
                      <p className="display text-3xl">{product.name}</p>
                      <p className="mt-1 text-sm text-cream/60">{product.description}</p>
                      <ul className="mt-4 space-y-1 text-sm text-cream/85">
                        {product.menuPrice !== undefined && <li>Formule : {config.asMenu ? 'menu' : 'seul'}</li>}
                        {lineDetails({ ...config, note: undefined }).map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                        {product.composition && <li>Contient : {product.composition.join(', ')}</li>}
                      </ul>
                    </div>
                    <label className="label mt-5" htmlFor="note">
                      Une précision ? (facultatif)
                    </label>
                    <input id="note" className="field" maxLength={120} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex. sans oignons" />
                    <div className="mt-5 flex items-center justify-between">
                      <span className="label mb-0">Quantité</span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center rounded-full border border-cream/20" aria-label="Diminuer la quantité">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center text-lg font-semibold" aria-live="polite">{quantity}</span>
                        <button onClick={() => setQuantity((q) => Math.min(30, q + 1))} className="grid h-11 w-11 place-items-center rounded-full border border-cream/20" aria-label="Augmenter la quantité">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Barre d'action */}
          <div className="border-t border-cream/10 bg-night/60 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7">
            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="mb-3 text-sm font-medium text-ember-light">
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="flex items-center gap-3">
              {stepIndex > 0 && (
                <button onClick={back} className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-cream/20" aria-label="Étape précédente">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-ash">Total</p>
                <motion.p key={price * quantity} initial={{ y: -6, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} className="font-display text-3xl font-bold text-ember-light">
                  {euros(price * quantity)}
                </motion.p>
              </div>
              {step !== 'recap' ? (
                <button onClick={next} className="btn-primary">
                  Suivant <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button onClick={submit} className="btn-primary min-w-[11rem]" disabled={done}>
                  {done ? (
                    <>
                      <Check className="h-4 w-4" /> {editing ? 'Modifié' : 'Ajouté'}
                    </>
                  ) : editing ? (
                    'Enregistrer'
                  ) : (
                    'Ajouter au panier'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
