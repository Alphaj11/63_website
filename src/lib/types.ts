/** Texte bilingue. Toute chaîne affichée au client passe par ce type. */
export type L = { fr: string; en: string };
export type Lang = 'fr' | 'en';

/** Prix en centimes d'euro pour éviter les erreurs d'arrondi. */
export type Cents = number;

export type BuilderKind = 'tacos' | 'kebab' | 'kumpir' | 'assiette';

/** Clé de rendu visuel d'un ingrédient (voir components/food/IngredientDefs). */
export type VisualKey =
  | 'doner' | 'chicken' | 'minced' | 'cordon' | 'tenders' | 'merguez' | 'steak'
  | 'lettuce' | 'tomato' | 'onion' | 'redonion' | 'cabbage' | 'pickle' | 'corn' | 'olive' | 'carrot' | 'pepper'
  | 'fries' | 'rice' | 'bulgur' | 'cheddar' | 'grated' | 'egg' | 'butter' | 'cheesesauce'
  | 'sauce-white' | 'sauce-algerian' | 'sauce-samurai' | 'sauce-harissa' | 'sauce-ketchup'
  | 'sauce-mayo' | 'sauce-bbq' | 'sauce-biggy' | 'sauce-andalouse'
  | 'bread-pita' | 'bread-galette' | 'bread-turkish'
  | 'size' | 'none' | 'drink' | 'side';

export interface BuilderOption {
  id: string;
  label: L;
  price: Cents;
  visual: VisualKey;
  description?: L;
  /** Pour l'option « taille » du tacos : nombre de viandes autorisées. */
  maxMeats?: number;
  /** Teinte d'accent de la pastille (sauces, etc.). */
  swatch?: string;
}

export interface BuilderStep {
  id: string;
  title: L;
  hint?: L;
  min: number;
  max: number;
  /** Le maximum est fourni par l'option choisie dans une autre étape (ex. taille du tacos). */
  maxFromStep?: string;
  options: BuilderOption[];
}

export interface BuilderConfig {
  kind: BuilderKind;
  name: L;
  tagline: L;
  basePrice: Cents;
  steps: BuilderStep[];
  /** Sélection par défaut pour l'aperçu de la carte. */
  preview: Selection;
}

/** Sélection : id d'étape -> ids d'options. */
export type Selection = Record<string, string[]>;

export interface SimpleProduct {
  id: string;
  category: 'sides' | 'drinks';
  label: L;
  description?: L;
  price: Cents;
  visual: VisualKey;
}

export interface CartLine {
  lineId: string;
  kind: BuilderKind | 'simple';
  productId: string;
  name: L;
  selection?: Selection;
  /** Détail lisible (ingrédients + suppléments) figé au moment de l'ajout. */
  details: { label: L; price: Cents }[];
  unitPrice: Cents;
  qty: number;
}

export type ServiceMode = 'sur-place' | 'a-emporter';
