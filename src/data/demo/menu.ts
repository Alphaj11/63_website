/**
 * ⚠️  DONNÉES DE DÉMONSTRATION — NON OFFICIELLES  ⚠️
 *
 * Ingrédients, options, suppléments et tarifs ci-dessous sont des exemples
 * destinés à la démonstration commerciale. Ils ne représentent PAS la carte
 * de Kebab Grill House 63 tant qu'elle n'a pas été validée par l'établissement.
 *
 * Pour passer en production : copier ce fichier dans `src/data/official/menu.ts`,
 * remplacer les valeurs par la carte validée, puis changer l'import dans
 * `src/data/menu.ts` (voir docs/DONNEES.md).
 *
 * Les prix sont en centimes : 850 = 8,50 €.
 */
import type { BuilderConfig, BuilderOption, SimpleProduct } from '@/lib/types';

const sauces: BuilderOption[] = [
  { id: 'blanche', label: { fr: 'Blanche', en: 'White sauce' }, price: 0, visual: 'sauce-white', swatch: '#f1ebe0' },
  { id: 'algerienne', label: { fr: 'Algérienne', en: 'Algerian' }, price: 0, visual: 'sauce-algerian', swatch: '#e8923a' },
  { id: 'samourai', label: { fr: 'Samouraï', en: 'Samurai' }, price: 0, visual: 'sauce-samurai', swatch: '#e06a2a' },
  { id: 'harissa', label: { fr: 'Harissa', en: 'Harissa' }, price: 0, visual: 'sauce-harissa', swatch: '#b8261a' },
  { id: 'andalouse', label: { fr: 'Andalouse', en: 'Andalouse' }, price: 0, visual: 'sauce-andalouse', swatch: '#ee8a4b' },
  { id: 'biggy', label: { fr: 'Biggy', en: 'Biggy' }, price: 0, visual: 'sauce-biggy', swatch: '#e9b76a' },
  { id: 'bbq', label: { fr: 'Barbecue', en: 'BBQ' }, price: 0, visual: 'sauce-bbq', swatch: '#5b2414' },
  { id: 'ketchup', label: { fr: 'Ketchup', en: 'Ketchup' }, price: 0, visual: 'sauce-ketchup', swatch: '#c3221b' },
  { id: 'mayo', label: { fr: 'Mayonnaise', en: 'Mayonnaise' }, price: 0, visual: 'sauce-mayo', swatch: '#f4e3a6' },
];

const meats: BuilderOption[] = [
  { id: 'kebab', label: { fr: 'Viande kebab', en: 'Kebab meat' }, price: 0, visual: 'doner' },
  { id: 'poulet', label: { fr: 'Poulet mariné', en: 'Marinated chicken' }, price: 0, visual: 'chicken' },
  { id: 'hachee', label: { fr: 'Viande hachée', en: 'Minced beef' }, price: 0, visual: 'minced' },
  { id: 'cordon', label: { fr: 'Cordon bleu', en: 'Cordon bleu' }, price: 0, visual: 'cordon' },
  { id: 'tenders', label: { fr: 'Tenders', en: 'Chicken tenders' }, price: 0, visual: 'tenders' },
  { id: 'merguez', label: { fr: 'Merguez', en: 'Merguez' }, price: 0, visual: 'merguez' },
];

const extras: BuilderOption[] = [
  { id: 'cheddar', label: { fr: 'Cheddar', en: 'Cheddar' }, price: 100, visual: 'cheddar' },
  { id: 'rape', label: { fr: 'Fromage râpé', en: 'Grated cheese' }, price: 100, visual: 'grated' },
  { id: 'oeuf', label: { fr: 'Œuf', en: 'Fried egg' }, price: 100, visual: 'egg' },
  { id: 'poivrons', label: { fr: 'Poivrons grillés', en: 'Grilled peppers' }, price: 80, visual: 'pepper' },
];

export const tacos: BuilderConfig = {
  kind: 'tacos',
  name: { fr: 'Tacos signature', en: 'Signature tacos' },
  tagline: { fr: 'Plié, grillé, doré. Composé par vous.', en: 'Folded, grilled, golden. Built by you.' },
  basePrice: 0,
  steps: [
    {
      id: 'taille', title: { fr: 'La taille', en: 'Size' }, min: 1, max: 1,
      hint: { fr: 'La taille fixe le nombre de viandes.', en: 'Size sets how many meats you get.' },
      options: [
        { id: 'm', label: { fr: 'M · 1 viande', en: 'M · 1 meat' }, price: 750, visual: 'size', maxMeats: 1 },
        { id: 'l', label: { fr: 'L · 2 viandes', en: 'L · 2 meats' }, price: 950, visual: 'size', maxMeats: 2 },
        { id: 'xl', label: { fr: 'XL · 3 viandes', en: 'XL · 3 meats' }, price: 1250, visual: 'size', maxMeats: 3 },
      ],
    },
    { id: 'viandes', title: { fr: 'Les viandes', en: 'Meats' }, min: 1, max: 3, maxFromStep: 'taille', options: meats },
    {
      id: 'frites', title: { fr: 'Les frites', en: 'Fries' }, min: 1, max: 1,
      options: [
        { id: 'avec', label: { fr: 'Avec frites', en: 'With fries' }, price: 0, visual: 'fries' },
        { id: 'sans', label: { fr: 'Sans frites', en: 'No fries' }, price: 0, visual: 'none' },
      ],
    },
    {
      id: 'fromagere', title: { fr: 'Sauce fromagère', en: 'Cheese sauce' }, min: 1, max: 1,
      options: [
        { id: 'maison', label: { fr: 'Sauce fromagère', en: 'Cheese sauce' }, price: 0, visual: 'cheesesauce', swatch: '#f2c14e' },
        { id: 'sans', label: { fr: 'Sans', en: 'None' }, price: 0, visual: 'none' },
      ],
    },
    { id: 'sauces', title: { fr: 'Les sauces', en: 'Sauces' }, hint: { fr: "Jusqu'à 2 sauces.", en: 'Up to 2 sauces.' }, min: 0, max: 2, options: sauces },
    { id: 'supplements', title: { fr: 'Les suppléments', en: 'Extras' }, min: 0, max: 4, options: extras },
  ],
  preview: { taille: ['l'], viandes: ['kebab', 'poulet'], frites: ['avec'], fromagere: ['maison'], sauces: ['algerienne'], supplements: [] },
};

export const kebab: BuilderConfig = {
  kind: 'kebab',
  name: { fr: 'Kebab', en: 'Kebab' },
  tagline: { fr: 'Couche après couche, jusqu’à la dernière bouchée.', en: 'Layer by layer, down to the last bite.' },
  basePrice: 0,
  steps: [
    {
      id: 'pain', title: { fr: 'Le pain', en: 'Bread' }, min: 1, max: 1,
      options: [
        { id: 'pita', label: { fr: 'Pain pita', en: 'Pita bread' }, price: 750, visual: 'bread-pita' },
        { id: 'galette', label: { fr: 'Galette', en: 'Flatbread wrap' }, price: 750, visual: 'bread-galette' },
        { id: 'turc', label: { fr: 'Pain turc', en: 'Turkish bread' }, price: 800, visual: 'bread-turkish' },
      ],
    },
    {
      id: 'viande', title: { fr: 'La viande', en: 'Meat' }, min: 1, max: 1,
      options: [meats[0], meats[1], meats[2]],
    },
    {
      id: 'crudites', title: { fr: 'Les crudités', en: 'Fresh veg' }, min: 0, max: 5,
      options: [
        { id: 'salade', label: { fr: 'Salade', en: 'Lettuce' }, price: 0, visual: 'lettuce' },
        { id: 'tomate', label: { fr: 'Tomate', en: 'Tomato' }, price: 0, visual: 'tomato' },
        { id: 'oignon', label: { fr: 'Oignon', en: 'Onion' }, price: 0, visual: 'onion' },
        { id: 'oignonrouge', label: { fr: 'Oignon rouge', en: 'Red onion' }, price: 0, visual: 'redonion' },
        { id: 'chou', label: { fr: 'Chou rouge', en: 'Red cabbage' }, price: 0, visual: 'cabbage' },
      ],
    },
    { id: 'sauces', title: { fr: 'Les sauces', en: 'Sauces' }, hint: { fr: "Jusqu'à 2 sauces.", en: 'Up to 2 sauces.' }, min: 0, max: 2, options: sauces },
    { id: 'supplements', title: { fr: 'Les suppléments', en: 'Extras' }, min: 0, max: 4, options: extras },
  ],
  preview: { pain: ['pita'], viande: ['kebab'], crudites: ['salade', 'tomate', 'oignonrouge'], sauces: ['blanche'], supplements: [] },
};

export const kumpir: BuilderConfig = {
  kind: 'kumpir',
  name: { fr: 'Kumpir', en: 'Kumpir' },
  tagline: { fr: 'La pomme de terre fondante, garnie à votre façon.', en: 'A melting baked potato, loaded your way.' },
  basePrice: 850,
  steps: [
    {
      id: 'base', title: { fr: 'La base', en: 'Base' }, min: 1, max: 1,
      hint: { fr: 'Beurre et fromage fondus dans la pomme de terre.', en: 'Butter and cheese melted into the potato.' },
      options: [
        { id: 'classique', label: { fr: 'Beurre & fromage', en: 'Butter & cheese' }, price: 0, visual: 'butter' },
        { id: 'beurre', label: { fr: 'Beurre seul', en: 'Butter only' }, price: 0, visual: 'butter' },
      ],
    },
    {
      id: 'garnitures', title: { fr: 'Les garnitures', en: 'Toppings' }, hint: { fr: 'Jusqu’à 5 garnitures.', en: 'Up to 5 toppings.' }, min: 0, max: 5,
      options: [
        { id: 'mais', label: { fr: 'Maïs', en: 'Sweetcorn' }, price: 0, visual: 'corn' },
        { id: 'olives', label: { fr: 'Olives', en: 'Olives' }, price: 0, visual: 'olive' },
        { id: 'cornichons', label: { fr: 'Cornichons', en: 'Pickles' }, price: 0, visual: 'pickle' },
        { id: 'chou', label: { fr: 'Chou rouge', en: 'Red cabbage' }, price: 0, visual: 'cabbage' },
        { id: 'carottes', label: { fr: 'Carottes râpées', en: 'Grated carrot' }, price: 0, visual: 'carrot' },
        { id: 'tomate', label: { fr: 'Tomate', en: 'Tomato' }, price: 0, visual: 'tomato' },
      ],
    },
    {
      id: 'proteine', title: { fr: 'Viande (option)', en: 'Meat (optional)' }, min: 0, max: 1,
      options: [
        { id: 'kebab', label: { fr: 'Viande kebab', en: 'Kebab meat' }, price: 200, visual: 'doner' },
        { id: 'poulet', label: { fr: 'Poulet mariné', en: 'Marinated chicken' }, price: 200, visual: 'chicken' },
      ],
    },
    { id: 'sauces', title: { fr: 'Les sauces', en: 'Sauces' }, min: 0, max: 2, options: sauces },
  ],
  preview: { base: ['classique'], garnitures: ['mais', 'olives', 'chou', 'carottes'], proteine: [], sauces: ['blanche'] },
};

export const assiette: BuilderConfig = {
  kind: 'assiette',
  name: { fr: 'Assiette', en: 'Platter' },
  tagline: { fr: 'L’assiette complète, dressée sous vos yeux.', en: 'The full platter, plated before your eyes.' },
  basePrice: 0,
  steps: [
    { id: 'viande', title: { fr: 'La viande', en: 'Meat' }, min: 1, max: 1,
      options: [
        { ...meats[0], price: 1150 },
        { ...meats[1], price: 1150 },
        { id: 'steak', label: { fr: 'Steaks hachés', en: 'Beef patties' }, price: 1200, visual: 'steak' },
        { ...meats[5], price: 1200 },
      ] },
    { id: 'salade', title: { fr: 'La salade', en: 'Salad' }, min: 1, max: 1,
      options: [
        { id: 'oui', label: { fr: 'Avec salade', en: 'With salad' }, price: 0, visual: 'lettuce' },
        { id: 'non', label: { fr: 'Sans salade', en: 'No salad' }, price: 0, visual: 'none' },
      ] },
    { id: 'crudites', title: { fr: 'Les crudités', en: 'Fresh veg' }, min: 0, max: 3,
      options: [
        { id: 'tomate', label: { fr: 'Tomate', en: 'Tomato' }, price: 0, visual: 'tomato' },
        { id: 'oignonrouge', label: { fr: 'Oignon rouge', en: 'Red onion' }, price: 0, visual: 'redonion' },
        { id: 'chou', label: { fr: 'Chou rouge', en: 'Red cabbage' }, price: 0, visual: 'cabbage' },
      ] },
    { id: 'accompagnement', title: { fr: 'L’accompagnement', en: 'Side' }, min: 1, max: 2,
      options: [
        { id: 'frites', label: { fr: 'Frites', en: 'Fries' }, price: 0, visual: 'fries' },
        { id: 'riz', label: { fr: 'Riz', en: 'Rice' }, price: 0, visual: 'rice' },
        { id: 'boulgour', label: { fr: 'Boulgour', en: 'Bulgur' }, price: 0, visual: 'bulgur' },
      ] },
    { id: 'sauces', title: { fr: 'Les sauces', en: 'Sauces' }, min: 0, max: 2, options: sauces },
    { id: 'supplements', title: { fr: 'Les suppléments', en: 'Extras' }, min: 0, max: 3, options: extras.slice(0, 3) },
  ],
  preview: { viande: ['kebab'], salade: ['oui'], crudites: ['tomate', 'oignonrouge'], accompagnement: ['frites'], sauces: ['blanche'], supplements: [] },
};

export const builders = { tacos, kebab, kumpir, assiette } as const;

export const simpleProducts: SimpleProduct[] = [
  { id: 'frites', category: 'sides', label: { fr: 'Frites', en: 'Fries' }, price: 300, visual: 'fries' },
  { id: 'frites-cheddar', category: 'sides', label: { fr: 'Frites cheddar', en: 'Cheddar fries' }, price: 450, visual: 'fries' },
  { id: 'tenders-x4', category: 'sides', label: { fr: 'Tenders ×4', en: 'Tenders ×4' }, price: 500, visual: 'tenders' },
  { id: 'soda-33', category: 'drinks', label: { fr: 'Soda 33 cl', en: 'Soft drink 33 cl' }, price: 200, visual: 'drink' },
  { id: 'eau-50', category: 'drinks', label: { fr: 'Eau 50 cl', en: 'Water 50 cl' }, price: 150, visual: 'drink' },
  { id: 'ayran', category: 'drinks', label: { fr: 'Ayran', en: 'Ayran (yogurt drink)' }, price: 200, visual: 'drink' },
];
