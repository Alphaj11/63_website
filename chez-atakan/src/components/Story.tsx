import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { Photo } from './ui/Photo';
import { Reveal } from './ui/Reveal';

/**
 * NOTRE UNIVERS — uniquement des éléments fournis par le restaurant :
 * savoir-faire du kebab, générosité, pain façonné par un boulanger, préparation à la commande,
 * produits frais et cuisine du quotidien. Aucun fournisseur, aucune origine inventés.
 */
const chapters = [
  {
    n: '01',
    title: 'La broche',
    kicker: 'Le savoir-faire',
    text: 'Tout commence ici, devant la broche. C’est le cœur de la maison et le savoir-faire qu’on met dans chaque kebab, service après service.',
    image: 'story-broche',
    alt: 'Viande de kebab taillée sur la broche',
  },
  {
    n: '02',
    title: 'Le pain',
    kicker: 'Façonné par un boulanger',
    text: 'Notre pain est façonné sur mesure par un boulanger, pour nos sandwichs. Un vrai pain, pensé pour tenir tout ce qu’on met dedans.',
    image: 'story-pain',
    alt: 'Pain légèrement toasté',
  },
  {
    n: '03',
    title: 'La générosité',
    kicker: 'Des portions qui calent',
    text: 'Ici, on ne compte pas. Les portions sont généreuses, parce qu’un kebab doit se terminer avec le sourire, pas avec un petit creux.',
    image: 'story-generosite',
    alt: 'Assiette généreuse de viande grillée et de frites',
  },
  {
    n: '04',
    title: 'À la commande',
    kicker: 'Préparé devant toi',
    text: 'Chaque commande est préparée au moment où tu la passes. Ta viande, tes sauces, ton format : on assemble ton repas, rien que pour toi.',
    image: 'story-preparation',
    alt: 'Préparation d’une commande en cuisine',
  },
  {
    n: '05',
    title: 'Frais, chaque jour',
    kicker: 'La cuisine du quotidien',
    text: 'Des produits frais et une cuisine faite tous les jours. Pas de mise en scène : juste ce qu’on aime manger.',
    image: 'story-frais',
    alt: 'Légumes frais : tomates, salade, oignons',
  },
];

function Chapter({ c, i }: { c: (typeof chapters)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%']);
  const flip = i % 2 === 1;

  return (
    <div ref={ref} className="relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <div className={`relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[16/10] lg:col-span-7 lg:aspect-[5/4] ${flip ? 'lg:order-2' : ''}`}>
        <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
          <Photo name={c.image} alt={c.alt} className="h-full w-full" sizes="(min-width:1024px) 58vw, 100vw" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
        <span className="display absolute bottom-4 left-5 text-7xl text-cream/90 sm:text-8xl">{c.n}</span>
      </div>
      <Reveal className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
        <p className="eyebrow">{c.kicker}</p>
        <h3 className="display mt-3 text-5xl sm:text-7xl">{c.title}</h3>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/75">{c.text}</p>
      </Reveal>
    </div>
  );
}

export function Story() {
  return (
    <section id="univers" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-16 max-w-3xl sm:mb-24">
          <p className="eyebrow">Notre univers</p>
          <h2 className="display mt-4 text-6xl sm:text-8xl">
            Face au grill, <span className="text-ember">pas derrière un écran.</span>
          </h2>
        </Reveal>
        <div className="flex flex-col gap-24 sm:gap-32">
          {chapters.map((c, i) => (
            <Chapter key={c.n} c={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
