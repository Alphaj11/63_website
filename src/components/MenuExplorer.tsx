'use client';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { DemoBadge } from './ui/DemoBadge';
import { KebabScene } from './food/KebabScene';
import { KumpirScene } from './food/KumpirScene';
import { PlateScene } from './food/PlateScene';
import { TacosScene } from './food/TacosScene';
import { builders, MENU_IS_DEMO, simpleProducts } from '@/data/menu';
import { formatPrice } from '@/lib/money';
import type { BuilderConfig, BuilderKind, Cents } from '@/lib/types';
import { ui } from '@/i18n/ui';
import { useCart } from '@/store/cart';
import { useT } from '@/store/lang';

/** Prix « à partir de » : prix de base + option la moins chère de chaque étape obligatoire. */
export function minPrice(c: BuilderConfig): Cents {
  return c.basePrice + c.steps.filter((s) => s.min > 0).reduce((sum, s) => sum + Math.min(...s.options.map((o) => o.price)), 0);
}

const ORDER: BuilderKind[] = ['tacos', 'kebab', 'kumpir', 'assiette'];

function Preview({ kind }: { kind: BuilderKind }) {
  const c = builders[kind];
  const props = { config: c, sel: c.preview, still: true, p: `pv-${kind}` } as const;
  if (kind === 'tacos') return <TacosScene {...props} phase="build" />;
  if (kind === 'kebab') return <KebabScene {...props} phase="build" />;
  if (kind === 'kumpir') return <KumpirScene {...props} phase="build" />;
  return <PlateScene {...props} phase="build" />;
}

export function MenuExplorer({ teaser = false }: { teaser?: boolean }) {
  const { lang, t } = useT();
  const add = useCart((s) => s.add);
  const [tab, setTab] = useState<'signatures' | 'sides' | 'drinks'>('signatures');
  const tabs = [
    { id: 'signatures', label: { fr: 'Signatures', en: 'Signatures' } },
    { id: 'sides', label: { fr: 'Accompagnements', en: 'Sides' } },
    { id: 'drinks', label: { fr: 'Boissons', en: 'Drinks' } },
  ] as const;

  return (
    <div>
      {!teaser && (
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div role="tablist" aria-label={t(ui.nav.menu)} className="flex gap-1 border border-white/10 p-1">
            {tabs.map((tb) => (
              <button key={tb.id} role="tab" type="button" aria-selected={tab === tb.id} onClick={() => setTab(tb.id)}
                className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${tab === tb.id ? 'text-coal' : 'text-bone/60 hover:text-bone'}`}>
                {tab === tb.id && <motion.span layoutId="menu-tab" className="absolute inset-0 bg-crust" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span className="relative">{t(tb.label)}</span>
              </button>
            ))}
          </div>
          {MENU_IS_DEMO && <p className="flex items-center gap-2 text-xs text-bone/50"><DemoBadge /> {t(ui.demo.menu)}</p>}
        </div>
      )}

      <AnimatePresence mode="wait">
        {tab === 'signatures' ? (
          <motion.ul key="sig" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" role="tabpanel">
            {ORDER.map((k, i) => {
              const c = builders[k];
              return (
                <motion.li key={k} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}>
                  <Link href={`/composer/${k}/`} className="group relative flex h-full flex-col overflow-hidden border border-white/10 bg-gradient-to-b from-[#1c1b1a] to-[#111] transition hover:border-ember/60">
                    {k === 'tacos' && <span className="absolute left-4 top-4 z-10 bg-ember px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em]">{t({ fr: 'Expérience signature', en: 'Signature experience' })}</span>}
                    <div className="relative aspect-[4/3.4] overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(211,75,37,.28),transparent_65%)] transition-opacity duration-500 group-hover:opacity-100 sm:opacity-60" />
                      <div className="absolute inset-0 p-3 transition-transform duration-700 ease-out group-hover:scale-[1.06]"><Preview kind={k} /></div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-3xl uppercase">{t(c.name)}</h3>
                      <p className="mt-1 flex-1 text-sm text-bone/60">{t(c.tagline)}</p>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-sm text-bone/50">{t({ fr: 'dès', en: 'from' })} <span className="font-display text-xl text-crust">{formatPrice(minPrice(c), lang)}</span></span>
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-ember transition group-hover:translate-x-1">{t(ui.nav.composeShort)} →</span>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        ) : (
          <motion.ul key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="tabpanel"
            className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {simpleProducts.filter((p) => p.category === tab).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 bg-coal p-5">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center border border-white/10" aria-hidden>{p.visual === 'drink' ? <CupIcon /> : <FriesIcon />}</span>
                  <div><h3 className="font-semibold">{t(p.label)}</h3><p className="text-sm text-crust">{formatPrice(p.price, lang)}</p></div>
                </div>
                <button type="button" onClick={() => add({ kind: 'simple', productId: p.id, name: p.label, details: [], unitPrice: p.price, qty: 1 })}
                  className="border border-crust/40 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-crust hover:bg-crust/10" aria-label={`${t(ui.cart.add)} ${t(p.label)}`}>
                  + {t(ui.cart.add)}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

const CupIcon = () => (
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none"><path d="M9 9h14l-1.6 18a1.5 1.5 0 0 1-1.5 1.4h-7.8a1.5 1.5 0 0 1-1.5-1.4L9 9Z" fill="#D34B25" /><path d="M8 9h16" stroke="#E9C88D" strokeWidth="2" strokeLinecap="round" /><path d="M17 9l3-6h3" stroke="#E9C88D" strokeWidth="1.6" strokeLinecap="round" /><path d="M11 16h10" stroke="#151515" strokeWidth="1.4" /></svg>
);
const FriesIcon = () => (
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none">{[9, 12, 15, 18, 21].map((x, i) => <rect key={x} x={x} y={4 + (i % 2) * 3} width="2.6" height="14" rx="1" fill="#f2c25c" />)}<path d="M7 14h18l-2.2 14H9.2L7 14Z" fill="#D34B25" /><path d="M11 20c3 2 7 2 10 0" stroke="#E9C88D" strokeWidth="1.4" /></svg>
);
