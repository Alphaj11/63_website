'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useT } from '@/store/lang';

/**
 * Emplacement réservé au futur programme « Grill House Club » (carte digitale, points,
 * récompenses, campagne GRILL HOUSE CHRISTMAS EDITION). Volontairement non développé
 * dans cette version : à ajouter dans une prochaine étape.
 */
export function LoyaltySoon() {
  const { t } = useT();
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_70%_40%,rgba(211,75,37,.2),transparent_70%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="eyebrow">{t({ fr: 'Fidélité', en: 'Loyalty' })}</p>
          <h1 className="display-xl mt-3 text-6xl sm:text-8xl">Grill House <span className="text-ember">Club</span></h1>
          <p className="mt-6 max-w-md text-lg text-bone/65">{t({ fr: 'Le programme de fidélité arrive bientôt. Cet espace est réservé à la future carte de membre digitale.', en: 'The loyalty programme is coming soon. This space is reserved for the future digital membership card.' })}</p>
          <Link href="/composer/" className="btn-primary mt-8">{t({ fr: 'En attendant, composer un repas', en: 'Meanwhile, build a meal' })}</Link>
        </div>
        <motion.div initial={{ rotateY: -20, rotateX: 10, opacity: 0 }} animate={{ rotateY: -8, rotateX: 6, opacity: 1 }} transition={{ duration: 1.2 }}
          className="mx-auto aspect-[1.586] w-full max-w-md [perspective:1000px]" aria-hidden>
          <div className="relative h-full w-full overflow-hidden rounded-2xl border border-crust/30 bg-gradient-to-br from-[#202020] via-[#151515] to-[#0c0c0c] p-7 shadow-[0_40px_100px_-30px_rgba(211,75,37,.5)]">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-ember/20 blur-3xl" />
            <div className="flex h-full flex-col justify-between">
              <div className="flex justify-between"><span className="font-display text-xl tracking-widest">GRILL HOUSE <span className="text-ember">63</span></span><span className="text-[10px] uppercase tracking-megawide text-crust">Club</span></div>
              <div className="h-8 w-11 rounded bg-gradient-to-br from-crust to-crust-600 opacity-80" />
              <div className="flex items-end justify-between"><span className="text-xs uppercase tracking-[0.3em] text-bone/50">{t({ fr: 'Bientôt disponible', en: 'Coming soon' })}</span><span className="font-display text-crust">— — —</span></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
