import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Product } from '../lib/types';
import { meats as allMeats, supplements as allSupplements } from '../data/ingredients';
import { sauces as allSauces } from '../data/sauces';
import { Photo } from './ui/Photo';

interface Props {
  product: Product;
  meats: string[];
  sauces: string[];
  supplements: string[];
  asMenu: boolean;
  final: boolean;
}

/** Tracé de nappage : une vague par sauce, décalée verticalement. */
const drizzle = (i: number) => {
  const y = 38 + i * 9;
  return `M8 ${y} C 18 ${y - 7}, 26 ${y + 7}, 36 ${y} S 54 ${y - 7}, 64 ${y} S 82 ${y + 7}, 92 ${y}`;
};

/**
 * Scène de composition visuelle.
 * 1. la photo du produit (pain, tortilla, bol) apparaît sous un éclairage de studio ;
 * 2. chaque viande choisie arrive en photo et s'empile comme une couche ;
 * 3. les sauces nappent le produit (tracé animé à la couleur de la sauce) ;
 * 4. au récapitulatif, un balayage de lumière présente le produit fini.
 * Les ingrédients sont montrés en vignettes photo réelles : pas de faux détourage.
 */
export function IngredientLayers({ product, meats, sauces, supplements, asMenu, final }: Props) {
  const reduce = useReducedMotion();
  const meatObjs = meats.map((id, i) => ({ key: `${id}-${i}`, meat: allMeats.find((m) => m.id === id)! })).filter((m) => m.meat);
  const sauceObjs = sauces.map((id) => allSauces.find((s) => s.id === id)!).filter(Boolean);
  const extraObjs = supplements.map((id) => allSupplements.find((s) => s.id === id)!).filter(Boolean);

  return (
    <div className="relative h-full w-full overflow-hidden bg-night">
      {/* éclairage de studio */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_42%,rgba(255,138,36,.22),transparent_70%)]" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[radial-gradient(50%_70%_at_50%_100%,rgba(255,106,0,.25),transparent)]" aria-hidden />

      {/* 1. Base produit */}
      <div className="absolute inset-0 grid place-items-center">
      <motion.div
        key={product.id}
        initial={{ opacity: 0, scale: 0.86, rotate: -3 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="aspect-square h-[78%] max-h-[440px] max-w-[78%]"
      >
        <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,.9),0_0_60px_-10px_rgba(255,106,0,.35)] ring-1 ring-cream/10">
          <Photo name={product.image} alt={product.name} className="h-full w-full" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-night/50 via-transparent to-transparent" />

          {/* 3. Nappage des sauces */}
          <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <filter id="gloss" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="0.35" />
              </filter>
            </defs>
            <AnimatePresence>
              {sauceObjs.map((s, i) => (
                <motion.g key={s.id} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <motion.path
                    d={drizzle(i)}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={3.2}
                    strokeLinecap="round"
                    filter="url(#gloss)"
                    opacity={0.92}
                    initial={{ pathLength: reduce ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, ease: 'easeInOut' }}
                  />
                  <motion.path
                    d={drizzle(i)}
                    fill="none"
                    stroke="rgba(255,255,255,.55)"
                    strokeWidth={0.7}
                    strokeLinecap="round"
                    transform="translate(0,-0.9)"
                    initial={{ pathLength: reduce ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.05 }}
                  />
                </motion.g>
              ))}
            </AnimatePresence>
          </svg>

          {/* 4. Balayage de lumière final */}
          <AnimatePresence>
            {final && !reduce && (
              <motion.div
                key="sweep"
                initial={{ x: '-120%' }}
                animate={{ x: '120%' }}
                transition={{ duration: 1.3, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      </div>

      {/* 2. Couches de viandes (vignettes photo empilées) */}
      <div className="absolute bottom-4 left-4 flex flex-col-reverse items-start gap-0 sm:bottom-6 sm:left-6" aria-live="polite">
        <AnimatePresence>
          {meatObjs.map(({ key, meat }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: -80, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.6 }}
              transition={{ type: 'spring', stiffness: 380, damping: 24 }}
              className="-mt-3 flex items-center gap-2"
              style={{ zIndex: 10 + i }}
            >
              <div className="h-14 w-14 overflow-hidden rounded-full ring-2 ring-ember shadow-lg sm:h-16 sm:w-16">
                <Photo name={meat.image} alt={meat.name} className="h-full w-full" small />
              </div>
              <span className="rounded-full bg-night/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] backdrop-blur">
                {meat.name}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sauces et suppléments en pastilles */}
      <div className="absolute right-4 top-4 flex max-w-[45%] flex-col items-end gap-1.5 sm:right-6 sm:top-6">
        <AnimatePresence>
          {asMenu && (
            <motion.span key="menu" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="rounded-full bg-ember px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-night">
              Formule menu
            </motion.span>
          )}
          {sauceObjs.map((s) => (
            <motion.span
              key={s.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-night/75 px-2.5 py-1 text-[11px] font-semibold backdrop-blur"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} /> {s.name}
            </motion.span>
          ))}
          {extraObjs.map((s) => (
            <motion.span key={s.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="rounded-full border border-cream/20 bg-night/75 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
              + {s.name}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
