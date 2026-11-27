import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import type { BuilderKind } from '../lib/types';
import { Photo } from './ui/Photo';
import { Reveal } from './ui/Reveal';
import { useCustomizer } from '../hooks/useCustomizer';
import { productById } from '../data/products';
import { basePrice } from '../lib/pricing';
import { euros } from '../lib/money';

const builders: { kind: BuilderKind; productId: string; title: string; line: string }[] = [
  { kind: 'tacos', productId: 'tacos', title: 'Tacos', line: '1, 2 ou 3 viandes, tes sauces.' },
  { kind: 'sandwich', productId: 'kebab', title: 'Sandwich', line: 'Kebab, galette, tikka… seul ou en menu.' },
  { kind: 'burger', productId: 'burger', title: 'Burger', line: 'Simple, double ou triple.' },
  { kind: 'bowl', productId: 'bowl', title: 'Bowl', line: 'Une ou deux viandes.' },
];

export function Compose() {
  const { openCustomizer } = useCustomizer();
  return (
    <section id="composer" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_20%,rgba(255,106,0,.12),transparent)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Le configurateur</p>
          <h2 className="display mt-4 text-6xl sm:text-8xl">
            Compose <span className="text-ember">ton repas</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg text-cream/70">Choisis ta base, tes viandes, tes sauces. Ton produit se construit sous tes yeux, le prix suit.</p>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {builders.map((b, i) => {
            const p = productById(b.productId)!;
            return (
              <motion.button
                key={b.kind}
                onClick={() => openCustomizer({ kind: b.kind, productId: b.productId })}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="group relative aspect-[3/4] overflow-hidden rounded-[1.75rem] text-left ring-1 ring-cream/10 sm:aspect-[4/5]"
              >
                <Photo name={p.image} alt={b.title} className="absolute inset-0 h-full w-full" imgClassName="transition-transform duration-[900ms] group-hover:scale-110" sizes="(min-width:1024px) 25vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-ember-light">dès {euros(basePrice(p))}</p>
                  <p className="display mt-1 text-5xl">{b.title}</p>
                  <p className="mt-1 text-sm text-cream/70">{b.line}</p>
                </div>
                <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-ember text-night transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
