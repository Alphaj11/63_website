'use client';
import { motion } from 'framer-motion';
import { Fragment, useState } from 'react';
import { mapsLinks, restaurant } from '@/data/restaurant';
import { ui } from '@/i18n/ui';
import { useT } from '@/store/lang';

/**
 * Nous trouver. La carte Google n'est chargée qu'après accord du visiteur (service tiers / traceurs).
 * Les horaires ne sont affichés qu'une fois vérifiés (restaurant.openingHours).
 */
export function LocationSection() {
  const { t, lang } = useT();
  const [mapConsent, setMapConsent] = useState(false);
  const hours = restaurant.openingHours;

  return (
    <section id="nous-trouver" aria-labelledby="loc-title" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:px-8">
        <div>
          <p className="eyebrow">{t(ui.nav.find)}</p>
          <h2 id="loc-title" className="display-xl mt-3 text-6xl sm:text-7xl">
            {t({ fr: 'Rue de Marseille,', en: 'Rue de Marseille,' })}<br /><span className="text-ember">Lyon 7</span>
          </h2>

          <address className="mt-8 space-y-1 not-italic">
            <div className="text-xl text-bone">{restaurant.name}</div>
            <div className="text-bone/70">{restaurant.address.street}</div>
            <div className="text-bone/70">{restaurant.address.postalCode} {restaurant.address.city}, {restaurant.address.country}</div>
            <a href={`tel:${restaurant.phone.e164}`} className="mt-3 inline-block font-display text-3xl tracking-wide text-crust hover:text-bone">{restaurant.phone.display}</a>
          </address>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={mapsLinks.directions} target="_blank" rel="noopener noreferrer" className="btn-primary">{t(ui.common.directions)} ↗</a>
            <a href={`tel:${restaurant.phone.e164}`} className="btn-ghost">{t(ui.common.call)}</a>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-megawide text-bone/50">{t({ fr: 'Horaires', en: 'Opening hours' })}</h3>
            {hours ? (
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
                {hours.map((h) => (<Fragment key={h.fr}><dt className="text-bone/60">{lang === 'fr' ? h.fr : h.en}</dt><dd>{h.hours}</dd></Fragment>))}
              </dl>
            ) : (
              <p className="mt-3 text-sm text-bone/60">{t({ fr: 'Horaires en cours de vérification. Appelez-nous pour connaître les horaires du jour.', en: 'Opening hours being verified. Please call us for today’s hours.' })}</p>
            )}
          </div>

          <p className="mt-10 max-w-md text-sm leading-relaxed text-bone/45">
            {t({
              fr: 'Kebab Grill House 63 : votre restaurant kebab à Lyon 7, au 40 rue de Marseille, dans le 7e arrondissement. Kebab, tacos, kumpir et assiettes grillées.',
              en: 'Kebab Grill House 63: your kebab restaurant in Lyon’s 7th district, at 40 rue de Marseille. Kebab, tacos, kumpir and grilled platters.',
            })}
          </p>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="relative min-h-[380px] overflow-hidden border border-white/10 bg-[#121212] lg:min-h-[560px]">
          {mapConsent ? (
            <iframe title={t({ fr: 'Carte Google Maps', en: 'Google Maps' })} src={mapsLinks.embed} className="absolute inset-0 h-full w-full grayscale-[0.6] invert-[0.92] hue-rotate-180"
              loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          ) : (
            <div className="absolute inset-0 grid place-items-center p-8 text-center">
              <StylizedMap />
              <div className="relative max-w-sm">
                <p className="text-sm text-bone/70">{t({ fr: 'La carte interactive est fournie par Google Maps, qui peut déposer des cookies.', en: 'The interactive map is provided by Google Maps, which may set cookies.' })}</p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={() => setMapConsent(true)} className="btn-ghost bg-coal/70 backdrop-blur">{t({ fr: 'Afficher la carte', en: 'Show the map' })}</button>
                  <a href={mapsLinks.search} target="_blank" rel="noopener noreferrer" className="self-center text-xs uppercase tracking-widest text-crust underline-offset-4 hover:underline">{t({ fr: 'Ouvrir dans Google Maps', en: 'Open in Google Maps' })} ↗</a>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/** Plan stylisé (illustratif, non géographique) en attendant le consentement. */
function StylizedMap() {
  return (
    <svg viewBox="0 0 600 560" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full opacity-60" aria-hidden>
      <defs><radialGradient id="pin-glow"><stop offset="0" stopColor="#D34B25" stopOpacity=".6" /><stop offset="1" stopColor="#D34B25" stopOpacity="0" /></radialGradient></defs>
      {Array.from({ length: 14 }).map((_, i) => <path key={`h${i}`} d={`M-20 ${i * 44} L620 ${i * 44 + 60}`} stroke="#2a2826" strokeWidth={i % 4 === 0 ? 7 : 2} />)}
      {Array.from({ length: 12 }).map((_, i) => <path key={`v${i}`} d={`M${i * 56} -20 L${i * 56 - 70} 580`} stroke="#2a2826" strokeWidth={i % 3 === 0 ? 6 : 2} />)}
      <path d="M-20 120 C 120 160, 160 340, 80 600" stroke="#1d2a33" strokeWidth="38" fill="none" />
      <circle cx="330" cy="290" r="90" fill="url(#pin-glow)" />
      <path d="M330 250c-20 0-34 15-34 33 0 26 34 55 34 55s34-29 34-55c0-18-14-33-34-33Z" fill="#D34B25" />
      <circle cx="330" cy="283" r="11" fill="#151515" />
    </svg>
  );
}
