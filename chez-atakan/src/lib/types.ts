/** Types partagés de la carte, du panier et des commandes. */

export type CategoryId =
  | 'sandwichs'
  | 'burgers'
  | 'tacos'
  | 'bowls'
  | 'texmex'
  | 'accompagnements'
  | 'enfants';

/** Type de configurateur ouvert par le bouton « Personnaliser ». */
export type BuilderKind = 'sandwich' | 'burger' | 'tacos' | 'bowl' | 'simple';

/** Montants en centimes pour éviter les erreurs d'arrondi. */
export type Cents = number;

export interface Category {
  id: CategoryId;
  label: string;
  tagline: string;
}

export interface Product {
  id: string;
  category: CategoryId;
  name: string;
  /** Description courte, neutre lorsque la composition n'est pas confirmée. */
  description: string;
  /**
   * Composition détaillée confirmée par le restaurant.
   * `null` = non communiquée : le site affiche une mention neutre, rien n'est inventé.
   */
  composition: string[] | null;
  builder: BuilderKind;
  /** Clé de la photo dans la médiathèque (src/data/media.ts). */
  image: string;
  /** Prix « seul ». Absent pour les produits à prix par nombre de viandes. */
  price?: Cents;
  /** Prix « en menu ». Absent si le produit n'existe pas en menu. */
  menuPrice?: Cents;
  /** Prix selon le nombre de viandes (tacos, bowls). Index 0 = 1 viande. */
  pricesByMeatCount?: Cents[];
  /** Mis en avant sur la carte. */
  featured?: boolean;
  /** Information à faire valider par le restaurateur avant publication. */
  toConfirm?: string;
}

export interface Meat {
  id: string;
  name: string;
  image: string;
}

export interface Sauce {
  id: string;
  name: string;
  /** Couleur indicative utilisée pour l'animation de nappage et la pastille. */
  color: string;
  image: string;
}

export interface Supplement {
  id: string;
  name: string;
  price: Cents;
  image: string;
  appliesTo: CategoryId[];
}

/** Choix faits dans un configurateur : suffit à recalculer le prix. */
export interface Configuration {
  productId: string;
  asMenu: boolean;
  meats: string[];
  sauces: string[];
  supplements: string[];
  note?: string;
}

export interface CartLine {
  lineId: string;
  config: Configuration;
  quantity: number;
}

export type FulfilmentMode = 'livraison' | 'retrait';

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  addressComplement: string;
  instructions: string;
}

export type OrderStatus =
  | 'nouvelle'
  | 'acceptee'
  | 'en_preparation'
  | 'prete'
  | 'terminee'
  | 'refusee';

export interface OrderLine {
  label: string;
  details: string[];
  quantity: number;
  unitPrice: Cents;
  total: Cents;
  config: Configuration;
}

export interface Order {
  id: string;
  /** Numéro court lisible par l'équipe (ex. A-042). */
  number: string;
  createdAt: string;
  updatedAt: string;
  demo: boolean;
  mode: FulfilmentMode;
  customer: CustomerDetails;
  lines: OrderLine[];
  subtotal: Cents;
  /** `null` = frais non configurés (à confirmer par le restaurant). */
  deliveryFee: Cents | null;
  total: Cents;
  status: OrderStatus;
  /** Délai annoncé par le restaurant en minutes, après acceptation. */
  etaMinutes?: number;
  refusalReason?: string;
  history: { status: OrderStatus; at: string }[];
}
