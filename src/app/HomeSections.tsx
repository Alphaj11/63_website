'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LocationSection } from '@/components/LocationSection';
import { MenuExplorer } from '@/components/MenuExplorer';
import { RestaurantStory } from '@/components/RestaurantStory';
import { GoogleReviews } from '@/components/reviews/GoogleReviews';
import { ui } from '@/i18n/ui';
import { useT } from '@/store/lang';

function Marquee() {
  const words = ['Kebab', 'Tacos', 'Kumpir', 'Assiettes', 'Grill', 'Lyon 7', 'Rue de Marseille'];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-ember py-4" aria-hidden>
      <motion.div className="flex w-max gap-10 whitespace-nowrap font-display text-3xl uppercase tracking-wide text-coal"
        animate={{ x: ['0%', '-50%'] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>
        {[...words, ...words, ...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center gap-10">{w}<span className="text-crust">✦</span></span>
        ))}
      </motion.div>
    </div>
  );
}

export function HomeSections() {
  const { t } = useT();
  return (
    <>
      <Marquee />

      {/* La carte */}
      <section id="carte" className="relative py-24 sm:py-32" aria-labelledby="home-menu">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow">{t(ui.nav.menu)}</p>
              <h2 id="home-menu" className="display-xl mt-3 text-6xl sm:text-7xl lg:text-8xl">
                {t({ fr: 'Composez.', en: 'Build it.' })}<br /><span className="gold-text">{t({ fr: 'Regardez-le prendre forme.', en: 'Watch it come together.' })}</span>
              </h2>
            </div>
            <p className="max-w-sm text-bone/60">{t({ fr: 'Chaque ingrédient apparaît, se pose, se superpose. Le prix suit en direct. Du pain à la dernière sauce, c’est vous qui décidez.', en: 'Every ingredient drops in and layers up. The price updates live. From bread to the last sauce, you decide.' })}</p>
          </div>
          <MenuExplorer teaser />
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/composer/tacos/" className="btn-primary">{t({ fr: 'Composer mon tacos', en: 'Build my tacos' })}</Link>
            <Link href="/carte/" className="btn-ghost">{t({ fr: 'Toute la carte', en: 'Full menu' })}</Link>
          </div>
        </div>
      </section>

      {/* Univers */}
      <section aria-labelledby="home-universe" className="relative border-t border-white/5 bg-[#121212] pt-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="eyebrow">{t(ui.nav.universe)}</p>
          <h2 id="home-universe" className="display-xl mt-3 max-w-4xl text-6xl sm:text-7xl">{t({ fr: 'Ici, le grill', en: 'Here, the grill' })} <span className="text-ember">{t({ fr: 'donne le ton.', en: 'sets the tone.' })}</span></h2>
        </div>
        <RestaurantStory teaser />
      </section>

      <GoogleReviews compact />
      <LocationSection />
    </>
  );
}
