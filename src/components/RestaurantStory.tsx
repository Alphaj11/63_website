'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef, type ReactNode } from 'react';
import { ui } from '@/i18n/ui';
import type { L } from '@/lib/types';
import { useT } from '@/store/lang';

/**
 * « Notre univers » — storytelling au scroll.
 * Les textes présentent l'intention de la maison ; ils sont à valider par l'établissement
 * (aucun témoignage, label ou certification inventé). Les cadres attendent les vraies photos/vidéos.
 */
const CHAPTERS: { id: string; kicker: L; title: L; body: L; motif: 'portion' | 'grill' | 'prep' | 'welcome' | 'signature'; media: L }[] = [
  {
    id: 'generosite', motif: 'portion',
    kicker: { fr: '01 — La générosité', en: '01 — Generosity' },
    title: { fr: 'Des portions qui ne font pas semblant.', en: 'Portions that don’t pretend.' },
    body: { fr: 'Ici, on sert comme on aimerait être servi : un sandwich bien garni, une assiette pleine, de quoi repartir rassasié.', en: 'We serve the way we’d like to be served: a well-filled sandwich, a full plate, enough to leave satisfied.' },
    media: { fr: 'Photo : une assiette servie au comptoir', en: 'Photo: a plate served at the counter' },
  },
  {
    id: 'grill', motif: 'grill',
    kicker: { fr: '02 — Le grill', en: '02 — The grill' },
    title: { fr: 'Le feu, la broche, le geste.', en: 'Fire, spit, and craft.' },
    body: { fr: 'La viande tourne devant la flamme, se colore, puis se taille au couteau, au moment de la commande.', en: 'The meat turns in front of the flame, takes on colour, then is carved to order.' },
    media: { fr: 'Vidéo : la broche en cuisson (plan serré)', en: 'Video: the spit roasting (close-up)' },
  },
  {
    id: 'preparation', motif: 'prep',
    kicker: { fr: '03 — La préparation', en: '03 — Preparation' },
    title: { fr: 'Le soin, avant tout.', en: 'Care, above all.' },
    body: { fr: 'Crudités, sauces, garnitures : chaque élément est préparé avec attention pour que chaque bouchée ait du goût.', en: 'Veg, sauces, toppings: every element is prepared with care so that every bite has flavour.' },
    media: { fr: 'Photo : mise en place en cuisine', en: 'Photo: kitchen prep station' },
  },
  {
    id: 'accueil', motif: 'welcome',
    kicker: { fr: '04 — L’accueil', en: '04 — Hospitality' },
    title: { fr: 'Entrez en client, revenez en habitué.', en: 'Come in as a guest, come back as a regular.' },
    body: { fr: 'Un sourire, un conseil sur la sauce, un mot pour les habitués de la rue de Marseille : l’accueil fait partie de la recette.', en: 'A smile, a tip on the sauce, a word for the rue de Marseille regulars: hospitality is part of the recipe.' },
    media: { fr: 'Photo : l’équipe derrière le comptoir', en: 'Photo: the team behind the counter' },
  },
  {
    id: 'specialites', motif: 'signature',
    kicker: { fr: '05 — Les spécialités', en: '05 — Specialities' },
    title: { fr: 'Kebab, tacos, kumpir, assiettes.', en: 'Kebab, tacos, kumpir, platters.' },
    body: { fr: 'Les incontournables de la maison, à composer selon vos envies, du pain jusqu’à la dernière sauce.', en: 'The house classics, built your way, from the bread to the last drizzle of sauce.' },
    media: { fr: 'Photo : les spécialités en plan large', en: 'Photo: the specialities, wide shot' },
  },
];

function Motif({ kind }: { kind: (typeof CHAPTERS)[number]['motif'] }) {
  const common = { fill: 'none', stroke: '#E9C88D', strokeWidth: 1.2, strokeOpacity: 0.55 } as const;
  const shapes: Record<string, ReactNode> = {
    portion: (<><ellipse cx="100" cy="120" rx="80" ry="26" {...common} /><path d="M40 112c10-40 110-40 120 0" {...common} /><path d="M60 100c12-18 70-18 80 0" stroke="#D34B25" strokeWidth="2" fill="none" /></>),
    grill: (<><path d="M100 30c22 30 40 46 40 80a40 40 0 0 1-80 0c0-20 10-32 20-42 0 16 6 26 14 30-6-26 2-50 6-68Z" {...common} /><path d="M100 70c10 14 18 22 18 38a18 18 0 0 1-36 0c0-10 6-16 10-20 0 8 2 12 6 14-2-12 0-22 2-32Z" stroke="#D34B25" strokeWidth="2" fill="none" /></>),
    prep: (<><path d="M50 150 150 50" {...common} /><path d="M140 40l20 20-12 12-20-20z" {...common} /><circle cx="70" cy="70" r="20" {...common} /><circle cx="70" cy="70" r="12" stroke="#D34B25" strokeWidth="2" fill="none" /><circle cx="130" cy="130" r="14" {...common} /></>),
    welcome: (<><path d="M40 150V80l60-40 60 40v70" {...common} /><path d="M85 150v-40h30v40" stroke="#D34B25" strokeWidth="2" fill="none" /><path d="M30 150h140" {...common} /></>),
    signature: (<><rect x="45" y="60" width="50" height="50" rx="10" {...common} /><path d="M110 110c0-30 50-30 50 0" {...common} /><ellipse cx="135" cy="70" rx="22" ry="12" stroke="#D34B25" strokeWidth="2" fill="none" /><path d="M40 140h120" {...common} /></>),
  };
  return <svg viewBox="0 0 200 180" className="h-40 w-40 sm:h-52 sm:w-52" aria-hidden>{shapes[kind]}</svg>;
}

function Chapter({ c, i }: { c: (typeof CHAPTERS)[number]; i: number }) {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['12%', '-12%']);
  const yText = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);
  const flip = i % 2 === 1;
  return (
    <div ref={ref} id={c.id} className="grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-20">
      <motion.figure style={{ y }} className={`relative aspect-[4/5] overflow-hidden border border-white/10 bg-[#121212] sm:aspect-[5/4] ${flip ? 'lg:order-2' : ''}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_80%,rgba(211,75,37,.22),transparent_60%),radial-gradient(ellipse_at_80%_10%,rgba(233,200,141,.08),transparent_50%)]" />
        <div className="grain absolute inset-0" />
        <div className="absolute inset-0 grid place-items-center"><Motif kind={c.motif} /></div>
        <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-white/10 bg-black/40 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-bone/60 backdrop-blur">
          <span>{t(c.media)}</span>
          <span className="shrink-0 text-crust/70">{t(ui.demo.photo)}</span>
        </figcaption>
      </motion.figure>
      <motion.div style={{ y: yText }}>
        <motion.p className="eyebrow" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>{t(c.kicker)}</motion.p>
        <motion.h3 className="display-xl mt-4 text-5xl sm:text-6xl" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>{t(c.title)}</motion.h3>
        <motion.p className="mt-6 max-w-md text-lg leading-relaxed text-bone/70" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>{t(c.body)}</motion.p>
      </motion.div>
    </div>
  );
}

export function RestaurantStory({ teaser = false }: { teaser?: boolean }) {
  const { t } = useT();
  const list = teaser ? CHAPTERS.slice(0, 2) : CHAPTERS;
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8">
      {list.map((c, i) => <Chapter key={c.id} c={c} i={i} />)}
      {teaser ? (
        <div className="pb-10 text-center"><Link href="/univers/" className="btn-ghost">{t({ fr: 'Entrer dans notre univers', en: 'Step into our world' })}</Link></div>
      ) : (
        <p className="pb-16 text-center text-xs text-bone/40">{t({ fr: 'Textes de présentation à valider avec l’établissement. Les cadres accueilleront les vraies photos et vidéos du restaurant.', en: 'Copy to be validated with the restaurant. Frames will hold the restaurant’s real photos and videos.' })}</p>
      )}
    </div>
  );
}
