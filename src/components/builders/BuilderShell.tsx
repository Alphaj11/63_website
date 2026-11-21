'use client';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { IngredientDefs } from '@/components/food/IngredientDefs';
import { SAUCE_COLORS } from '@/components/food/IngredientLayer';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { builderHints } from '@/data/demo/recommendations';
import { computePrice, describe, emptySelection, isComplete, isStepValid, stepMax, toggleOption } from '@/lib/builder';
import { formatPrice } from '@/lib/money';
import type { BuilderConfig, BuilderOption, Selection } from '@/lib/types';
import { ui } from '@/i18n/ui';
import { useCart } from '@/store/cart';
import { useT } from '@/store/lang';

export type ScenePhase = string;
export interface SceneProps { sel: Selection; phase: string; onPhaseEnd: (p: string) => void }

interface Props {
  config: BuilderConfig;
  /** Phases jouées après « Terminer », dans l'ordre (ex. ['fold', 'grill']). */
  finale: string[];
  finaleLabels: Record<string, { fr: string; en: string }>;
  renderScene: (props: SceneProps) => ReactNode;
  /** Ratio de la scène (hauteur/largeur). */
  aspect?: string;
}

export function BuilderShell({ config, finale, finaleLabels, renderScene, aspect = 'aspect-square' }: Props) {
  const { lang, t } = useT();
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get('edit');
  const cart = useCart();
  const editingLine = editId ? cart.lines.find((l) => l.lineId === editId && l.kind === config.kind) : undefined;

  const [sel, setSel] = useState<Selection>(() => emptySelection(config));
  const [stepIdx, setStepIdx] = useState(0);
  const [phase, setPhase] = useState<string>('build');

  // Mode édition : on recharge la composition depuis le panier.
  useEffect(() => {
    if (editingLine?.selection) { setSel(editingLine.selection); setStepIdx(config.steps.length - 1); setPhase('build'); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingLine?.lineId]);

  const step = config.steps[stepIdx];
  const price = computePrice(config, sel);
  const complete = isComplete(config, sel);
  const building = phase === 'build';
  const done = phase === 'done';
  const hint = builderHints[config.kind];

  const onPhaseEnd = useCallback((p: string) => {
    setPhase((cur) => {
      if (cur !== p) return cur;
      const i = finale.indexOf(p);
      return i >= 0 && i < finale.length - 1 ? finale[i + 1] : 'done';
    });
  }, [finale]);

  const choose = (o: BuilderOption) => {
    if (!building) return;
    setSel((s) => toggleOption(config, s, step.id, o.id));
  };

  const finish = () => {
    if (!complete) {
      const firstInvalid = config.steps.findIndex((s) => !isStepValid(config, s, sel));
      if (firstInvalid >= 0) setStepIdx(firstInvalid);
      return;
    }
    setPhase(finale[0] ?? 'done');
  };

  const restart = () => { setPhase('build'); setSel(emptySelection(config)); setStepIdx(0); };
  const editAgain = () => { setPhase('build'); };

  const addToCart = () => {
    const details = describe(config, sel).map((d) => ({ label: d.label, price: d.base ? 0 : d.price }));
    const payload = { kind: config.kind, productId: config.kind, name: config.name, selection: sel, details, unitPrice: price };
    if (editingLine) { cart.replace(editingLine.lineId, payload); router.replace(`/composer/${config.kind}/`); restart(); }
    else cart.add({ ...payload, qty: 1 });
  };

  const summary = useMemo(() => describe(config, sel), [config, sel]);
  const max = stepMax(config, step, sel);
  const chosen = sel[step.id] ?? [];

  return (
    <div className="relative">
      {/* Icônes d'ingrédients partagées */}
      <svg width="0" height="0" className="absolute" aria-hidden><IngredientDefs p="ic" /></svg>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:px-8">
        {/* ---------- Scène ---------- */}
        <div className="sticky top-16 z-20 -mx-4 bg-coal px-4 pb-2 lg:top-24 lg:mx-0 lg:self-start lg:bg-transparent lg:p-0">
          <div className="stage relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,rgba(211,75,37,0.28),transparent_60%)]" />
            <div className="absolute left-3 top-3 z-10 flex items-center gap-2 lg:left-4 lg:top-4">
              <DemoBadge />
            </div>
            <div className="absolute right-3 top-3 z-10 text-right lg:right-4 lg:top-4">
              <div className="text-[10px] uppercase tracking-megawide text-crust/60">{t({ fr: 'Prix', en: 'Price' })}</div>
              <motion.div key={price} initial={{ scale: 1.25, color: '#D34B25' }} animate={{ scale: 1, color: '#E9C88D' }} transition={{ duration: 0.5 }}
                className="font-display text-2xl tabular-nums lg:text-3xl" aria-live="polite">{formatPrice(price, lang)}</motion.div>
            </div>
            <div className={`relative mx-auto h-[36vh] max-w-full ${aspect} lg:h-auto lg:w-full lg:max-w-[620px]`}>
              {renderScene({ sel, phase, onPhaseEnd })}
            </div>
            <AnimatePresence>
              {!building && !done && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="absolute inset-x-0 bottom-5 text-center font-display text-lg uppercase tracking-[0.25em] text-crust" aria-live="polite">
                  {t(finaleLabels[phase] ?? { fr: '', en: '' })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ---------- Panneau de choix ---------- */}
        <div className="pb-28 lg:pb-12">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key="steps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}>
                {/* Étapes */}
                <ol className="mb-6 flex flex-wrap gap-2" aria-label={t({ fr: 'Étapes', en: 'Steps' })}>
                  {config.steps.map((s, i) => {
                    const valid = isStepValid(config, s, sel) && (sel[s.id]?.length ?? 0) > 0;
                    return (
                      <li key={s.id}>
                        <button type="button" onClick={() => building && setStepIdx(i)} disabled={!building}
                          aria-current={i === stepIdx ? 'step' : undefined}
                          className={`group flex items-center gap-2 border px-3 py-1.5 text-xs uppercase tracking-widest transition ${i === stepIdx ? 'border-ember bg-ember/15 text-bone' : 'border-white/10 text-bone/60 hover:border-crust/40 hover:text-bone'}`}>
                          <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${valid ? 'bg-crust text-coal' : 'bg-white/10'}`}>{valid ? '✓' : i + 1}</span>
                          {t(s.title)}
                        </button>
                      </li>
                    );
                  })}
                </ol>

                <div className="mb-2 text-xs uppercase tracking-megawide text-ember">{t(ui.builder.step)} {stepIdx + 1} / {config.steps.length}</div>
                <h2 className="font-display text-4xl uppercase text-bone sm:text-5xl">{t(step.title)}</h2>
                <p className="mt-2 text-sm text-bone/60">
                  {step.hint ? `${t(step.hint)} ` : ''}
                  {max > 1 ? `${t(ui.builder.choose)} ${t(ui.builder.upTo)} ${max}. ` : ''}
                  <span className="text-bone/40">({step.min > 0 ? t(ui.builder.required) : t(ui.builder.optional)})</span>
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3" role="group" aria-label={t(step.title)}>
                  {step.options.map((o) => {
                    const active = chosen.includes(o.id);
                    return (
                      <motion.button key={o.id} type="button" whileTap={{ scale: 0.96 }} onClick={() => choose(o)} disabled={!building}
                        aria-pressed={active}
                        className={`option-tile relative flex min-h-[92px] flex-col items-start justify-between gap-2 border p-3 text-left transition ${active ? 'border-ember bg-gradient-to-br from-ember/25 to-transparent' : 'border-white/10 bg-white/[0.02] hover:border-crust/40'}`}>
                        <OptionIcon option={o} />
                        <span className="text-sm font-semibold leading-tight text-bone">{t(o.label)}</span>
                        <span className="text-xs tabular-nums text-crust/80">{o.price ? `${stepIdx === 0 ? '' : '+'}${formatPrice(o.price, lang)}` : t(ui.builder.included)}</span>
                        {active && <motion.span layoutId={`dot-${step.id}-${o.id}`} className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-ember shadow-[0_0_12px_#D34B25]" />}
                      </motion.button>
                    );
                  })}
                </div>

                {hint && hint.stepId === step.id && !chosen.includes(hint.optionId) && (
                  <motion.button type="button" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSel((s) => toggleOption(config, s, hint.stepId, hint.optionId))}
                    className="mt-5 flex w-full items-center justify-between gap-3 border border-dashed border-crust/30 px-4 py-3 text-left text-sm text-bone/70 hover:border-crust/60">
                    <span>💡 {t(hint.text)}</span>
                    <span className="shrink-0 text-crust">+ {t(ui.cart.add)}</span>
                  </motion.button>
                )}

                {/* Navigation (bureau) */}
                <div className="mt-8 hidden items-center gap-3 lg:flex">
                  <button type="button" onClick={() => setStepIdx((i) => Math.max(0, i - 1))} disabled={stepIdx === 0 || !building} className="btn-ghost">{t(ui.builder.prev)}</button>
                  {stepIdx < config.steps.length - 1 ? (
                    <button type="button" onClick={() => setStepIdx((i) => i + 1)} disabled={!building || !isStepValid(config, step, sel)} className="btn-primary">{t(ui.builder.next)}</button>
                  ) : (
                    <button type="button" onClick={finish} disabled={!building} className="btn-primary">{t(ui.builder.finish)}</button>
                  )}
                  {!complete && stepIdx === config.steps.length - 1 && <span className="text-xs text-bone/50">{t({ fr: 'Complétez les étapes obligatoires.', en: 'Complete the required steps.' })}</span>}
                </div>
              </motion.div>
            ) : (
              <motion.div key="summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="text-xs uppercase tracking-megawide text-ember">{t(ui.builder.summary)}</div>
                <h2 className="mt-1 font-display text-5xl uppercase text-bone">{t(config.name)}</h2>
                <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
                  {summary.map((d, i) => (
                    <li key={i} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                      <span><span className="text-bone/40">{t(d.step)} · </span><span className="text-bone">{t(d.label)}</span></span>
                      <span className="tabular-nums text-crust/80">{d.price ? formatPrice(d.price, lang) : '—'}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-baseline justify-between">
                  <span className="text-sm uppercase tracking-megawide text-bone/60">{t(ui.cart.total)}</span>
                  <span className="font-display text-4xl text-crust">{formatPrice(price, lang)}</span>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={addToCart} className="btn-primary">{editingLine ? t(ui.builder.update) : t(ui.builder.addToCart)}</button>
                  <button type="button" onClick={editAgain} className="btn-ghost">{t(ui.cart.edit)}</button>
                  <button type="button" onClick={restart} className="btn-ghost">{t(ui.builder.restart)}</button>
                </div>
                <p className="mt-6 text-xs text-bone/40">{t(ui.demo.menu)}</p>
                <Link href="/composer/" className="mt-4 inline-block text-sm text-crust underline-offset-4 hover:underline">← {t({ fr: 'Composer autre chose', en: 'Build something else' })}</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Barre d'action mobile */}
      {!done && (
        <div className="fixed inset-x-0 bottom-[64px] z-30 border-t border-white/10 bg-coal/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <button type="button" onClick={() => setStepIdx((i) => Math.max(0, i - 1))} disabled={stepIdx === 0 || !building} className="btn-ghost !px-3" aria-label={t(ui.builder.prev)}>←</button>
            <div className="flex-1 text-xs text-bone/60">{t(ui.builder.step)} {stepIdx + 1}/{config.steps.length}<div className="font-display text-xl text-crust">{formatPrice(price, lang)}</div></div>
            {stepIdx < config.steps.length - 1 ? (
              <button type="button" onClick={() => setStepIdx((i) => i + 1)} disabled={!building || !isStepValid(config, step, sel)} className="btn-primary">{t(ui.builder.next)}</button>
            ) : (
              <button type="button" onClick={finish} disabled={!building} className="btn-primary">{t(ui.builder.finish)}</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function OptionIcon({ option }: { option: BuilderOption }) {
  const v = option.visual;
  if (v.startsWith('sauce-') || v === 'cheesesauce') {
    const c = v === 'cheesesauce' ? '#f5bd3c' : (SAUCE_COLORS[v]?.[0] ?? option.swatch ?? '#ccc');
    return <span className="h-7 w-7 rounded-full border border-white/20 shadow-inner" style={{ background: `radial-gradient(circle at 35% 30%, #fff8, ${c} 45%)` }} />;
  }
  if (v === 'none') return <span className="grid h-7 w-7 place-items-center rounded-full border border-white/20 text-bone/50">∅</span>;
  if (v === 'size') return <span className="font-display text-2xl leading-none text-crust">{option.id.toUpperCase()}</span>;
  const key = v.startsWith('bread-') ? null : v;
  if (!key) return <span className="h-7 w-10 rounded-[50%] border border-crust/50 bg-gradient-to-b from-crust to-crust-600" />;
  return (
    <svg viewBox="-24 -24 48 48" className="h-8 w-8" aria-hidden>
      <use href={`#ic-${key}`} />
    </svg>
  );
}
