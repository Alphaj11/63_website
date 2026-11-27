import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { categories, products } from '../data/products';
import { ProductCard } from './ProductCard';
import { Reveal } from './ui/Reveal';
import { sauces } from '../data/sauces';
import { supplements } from '../data/ingredients';
import { euros } from '../lib/money';

export function Menu() {
  const [active, setActive] = useState(categories[0].id);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Catégorie active selon le défilement (scroll spy)
  useEffect(() => {
    const els = categories.map((c) => document.getElementById(`cat-${c.id}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id.replace('cat-', '') as typeof active);
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Garde l'onglet actif visible sur mobile
  useEffect(() => {
    // Défilement horizontal uniquement : ne doit jamais faire bouger la page.
    const bar = tabsRef.current;
    const tab = bar?.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    if (bar && tab) bar.scrollTo({ left: tab.offsetLeft - bar.clientWidth / 2 + tab.clientWidth / 2, behavior: 'smooth' });
  }, [active]);

  return (
    <section id="carte" className="relative bg-coal/40 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">La carte</p>
          <h2 className="display mt-4 text-6xl sm:text-8xl">
            Choisis. <span className="text-ember">Compose.</span> Savoure.
          </h2>
          <p className="mt-5 max-w-xl text-lg text-cream/70">
            Sandwichs, burgers, tacos, bowls : chaque produit se personnalise. Les prix se mettent à jour à chaque choix.
          </p>
        </Reveal>
      </div>

      <div className="sticky top-16 z-30 mt-12 border-y border-cream/10 bg-night/85 backdrop-blur-xl">
        <div ref={tabsRef} role="tablist" aria-label="Catégories de la carte" className="scrollbar-none mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 sm:px-6">
          {categories.map((c) => (
            <button
              key={c.id}
              data-cat={c.id}
              role="tab"
              aria-selected={active === c.id}
              onClick={() => document.getElementById(`cat-${c.id}`)?.scrollIntoView({ behavior: 'smooth' })}
              className={`relative shrink-0 rounded-full px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] transition ${
                active === c.id ? 'text-night' : 'text-cream/70 hover:text-cream'
              }`}
            >
              {active === c.id && (
                <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-ember" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
              )}
              <span className="relative">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {categories.map((c) => {
          const list = products.filter((p) => p.category === c.id);
          return (
            <div key={c.id} id={`cat-${c.id}`} className="scroll-mt-36 pt-16">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
                <h3 className="display text-5xl text-cream sm:text-6xl">{c.label}</h3>
                <p className="text-sm text-cream/55">{c.tagline}</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          );
        })}

        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          <div className="panel p-6">
            <h3 className="display text-3xl">Nos sauces</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {sauces.map((s) => (
                <li key={s.id} className="inline-flex items-center gap-2 rounded-full border border-cream/10 px-3 py-1.5 text-sm">
                  <span className="h-3 w-3 rounded-full ring-1 ring-cream/20" style={{ background: s.color }} aria-hidden />
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="panel p-6">
            <h3 className="display text-3xl">Suppléments</h3>
            <ul className="mt-4 space-y-2 text-cream/80">
              {supplements.map((s) => (
                <li key={s.id} className="flex justify-between border-b border-cream/10 pb-2">
                  <span>{s.name}</span>
                  <span className="font-semibold text-ember-light">+{euros(s.price)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ash">Tarifs relevés sur la carte du restaurant, susceptibles d’évoluer.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
