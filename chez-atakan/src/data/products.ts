import type { Category, Product } from '../lib/types';
import { eur } from '../lib/money';

/**
 * CARTE — tarifs relevés sur une photographie publique de la carte.
 * Modifier les prix ici : tout le site (carte, configurateur, panier, commande) se recalcule.
 *
 * Règle : aucune composition n'est inventée. Quand elle n'est pas connue,
 * `composition: null` et la description reste neutre.
 */

export const categories: Category[] = [
  { id: 'sandwichs', label: 'Sandwichs', tagline: 'Le pain du boulanger, la broche, ta sauce.' },
  { id: 'burgers', label: 'Burgers', tagline: 'Simples, doubles, triples : à toi de voir.' },
  { id: 'tacos', label: 'Tacos', tagline: "Jusqu'à trois viandes, roulé et grillé." },
  { id: 'bowls', label: 'Bowls', tagline: 'Une ou deux viandes, servies en bol.' },
  { id: 'texmex', label: 'Tex-Mex', tagline: 'Nuggets dorés, à partager ou pas.' },
  { id: 'accompagnements', label: 'Accompagnements', tagline: 'Les frites qui vont avec tout.' },
  { id: 'enfants', label: 'Menus enfants', tagline: 'Pour les petites faims.' },
];

const NEUTRAL = 'Recette de la maison. Composition détaillée communiquée au comptoir.';

export const products: Product[] = [
  // ─── SANDWICHS ────────────────────────────────────────────────
  {
    id: 'kebab',
    category: 'sandwichs',
    name: 'Kebab',
    description: 'Le classique de la broche, dans le pain de la maison.',
    composition: null,
    builder: 'sandwich',
    image: 'product-kebab',
    price: eur(6.5),
    menuPrice: eur(9.5),
    featured: true,
  },
  {
    id: 'galette',
    category: 'sandwichs',
    name: 'Galette',
    description: 'Roulé en galette. ' + NEUTRAL,
    composition: null,
    builder: 'sandwich',
    image: 'product-galette',
    price: eur(7),
    menuPrice: eur(10),
  },
  {
    id: 'chicken-tikka',
    category: 'sandwichs',
    name: 'Chicken Tikka',
    description: 'Poulet façon tikka. ' + NEUTRAL,
    composition: null,
    builder: 'sandwich',
    image: 'product-chicken-tikka',
    price: eur(7),
    menuPrice: eur(10),
  },
  {
    id: 'royal',
    category: 'sandwichs',
    name: 'Royal',
    description: NEUTRAL,
    composition: null,
    builder: 'sandwich',
    image: 'product-royal',
    price: eur(9),
    menuPrice: eur(12),
    toConfirm: 'Composition du Royal',
  },
  {
    id: 'blinde',
    category: 'sandwichs',
    name: 'Blindé',
    description: NEUTRAL,
    composition: null,
    builder: 'sandwich',
    image: 'product-blinde',
    price: eur(9),
    menuPrice: eur(12),
    toConfirm: 'Composition du Blindé',
  },
  {
    id: 'big',
    category: 'sandwichs',
    name: 'Big',
    description: 'Le plus grand de la carte. ' + NEUTRAL,
    composition: null,
    builder: 'sandwich',
    image: 'product-big',
    price: eur(10.5),
    menuPrice: eur(13.5),
    featured: true,
    toConfirm: 'Composition du Big',
  },
  {
    id: 'double-steak',
    category: 'sandwichs',
    name: 'Double Steak',
    description: 'Deux steaks hachés dans le pain. ' + NEUTRAL,
    composition: null,
    builder: 'sandwich',
    image: 'product-double-steak',
    price: eur(7),
    menuPrice: eur(10),
  },

  // ─── BURGERS ──────────────────────────────────────────────────
  {
    id: 'burger',
    category: 'burgers',
    name: 'Burger',
    description: 'Un steak haché, le burger tout simplement.',
    composition: null,
    builder: 'burger',
    image: 'product-burger',
    price: eur(6.5),
    menuPrice: eur(9.5),
  },
  {
    id: 'double-burger',
    category: 'burgers',
    name: 'Double Burger',
    description: 'Deux steaks hachés pour les grosses faims.',
    composition: null,
    builder: 'burger',
    image: 'product-double-burger',
    price: eur(8.5),
    menuPrice: eur(11.5),
    featured: true,
  },
  {
    id: 'triple-burger',
    category: 'burgers',
    name: 'Triple Burger',
    description: 'Trois steaks hachés. Il faut le voir pour y croire.',
    composition: null,
    builder: 'burger',
    image: 'product-triple-burger',
    price: eur(9.9),
    menuPrice: eur(12.9),
  },
  {
    id: 'chicken-burger',
    category: 'burgers',
    name: 'Chicken Burger',
    description: 'Le burger version poulet.',
    composition: null,
    builder: 'burger',
    image: 'product-chicken-burger',
    price: eur(6.5),
    menuPrice: eur(9.5),
  },
  {
    id: 'double-chicken',
    category: 'burgers',
    name: 'Double Chicken',
    description: 'Le chicken burger, en double.',
    composition: null,
    builder: 'burger',
    image: 'product-double-chicken',
    price: eur(8.5),
    menuPrice: eur(11.5),
  },
  {
    id: 'duo-burger',
    category: 'burgers',
    name: 'Duo Burger',
    description: NEUTRAL,
    composition: null,
    builder: 'burger',
    image: 'product-duo-burger',
    price: eur(9.9),
    menuPrice: eur(12.9),
    toConfirm: 'Composition du Duo Burger',
  },

  // ─── TACOS ────────────────────────────────────────────────────
  {
    id: 'tacos',
    category: 'tacos',
    name: 'French Tacos',
    description: 'Choisis 1, 2 ou 3 viandes et tes sauces. On roule, on grille.',
    composition: null,
    builder: 'tacos',
    image: 'product-tacos',
    pricesByMeatCount: [eur(6.5), eur(8.5), eur(10.5)],
    featured: true,
  },

  // ─── BOWLS ────────────────────────────────────────────────────
  {
    id: 'bowl',
    category: 'bowls',
    name: 'Bowl',
    description: 'Une ou deux viandes au choix, servies en bol.',
    composition: null,
    builder: 'bowl',
    image: 'product-bowl',
    pricesByMeatCount: [eur(8.5), eur(10.5)],
  },

  // ─── TEX-MEX ──────────────────────────────────────────────────
  {
    id: 'nuggets-5',
    category: 'texmex',
    name: 'Nuggets x5',
    description: 'Cinq nuggets dorés.',
    composition: null,
    builder: 'simple',
    image: 'product-nuggets',
    price: eur(5),
  },
  {
    id: 'nuggets-10',
    category: 'texmex',
    name: 'Nuggets x10',
    description: 'Dix nuggets, pour partager (ou pas).',
    composition: null,
    builder: 'simple',
    image: 'product-nuggets-10',
    price: eur(9),
  },

  // ─── ACCOMPAGNEMENTS ──────────────────────────────────────────
  {
    id: 'petite-frite',
    category: 'accompagnements',
    name: 'Petite frite',
    description: 'Frites dorées, portion petite faim.',
    composition: null,
    builder: 'simple',
    image: 'product-frites',
    price: eur(2.5),
  },
  {
    id: 'grande-frite',
    category: 'accompagnements',
    name: 'Grande frite',
    description: 'Frites dorées, la grande portion.',
    composition: null,
    builder: 'simple',
    image: 'product-grande-frite',
    price: eur(3.5),
  },

  // ─── MENUS ENFANTS ────────────────────────────────────────────
  {
    id: 'menu-enfant',
    category: 'enfants',
    name: 'Menu enfant',
    description: '5 nuggets, frites et une Capri-Sun.',
    composition: ['5 nuggets', 'Frites', 'Capri-Sun'],
    builder: 'simple',
    image: 'product-menu-enfant',
    price: eur(6),
  },
];

export const productById = (id: string): Product | undefined => products.find((p) => p.id === id);
