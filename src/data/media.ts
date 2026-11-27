import type { VisualKey } from '@/lib/types';

/**
 * Médias d'ILLUSTRATION (banque Pexels, licence libre : https://www.pexels.com/license/).
 * Ils ne représentent PAS les produits du restaurant : ils servent à rendre la démonstration
 * plus réaliste et sont à remplacer par de vraies photos / vidéos de Grill House 63
 * (voir docs/DONNEES.md § 5).
 *
 * Les fichiers sont chargés depuis le CDN de Pexels. En cas d'échec (hors ligne, blocage),
 * les scènes retombent automatiquement sur les illustrations vectorielles.
 */

export interface PhotoSource {
  /** Identifiant Pexels. */
  id: string;
  ext: 'jpeg' | 'png';
  /** Rapport largeur / hauteur de la photo d'origine. */
  aspect: number;
  /** Zone utile de la photo [x, y, largeur, hauteur] en fractions (0–1). */
  crop: [number, number, number, number];
  /**
   * `mass` : ingrédient en vrac (viande émincée, frites, salade…) rendu en amas aux bords fondus.
   * `piece` : morceau distinct (rondelle, œuf, lamelle…) découpé selon une forme.
   */
  mode: 'mass' | 'piece';
  /** Correction colorimétrique légère (ex. assombrir une viande crue). */
  tone?: string;
}

const P = (id: string, ext: PhotoSource['ext'], aspect: number, crop: PhotoSource['crop'], mode: PhotoSource['mode'], tone?: string): PhotoSource =>
  ({ id, ext, aspect, crop, mode, tone });

export const PHOTOS: Partial<Record<VisualKey | 'tortilla', PhotoSource>> = {
  doner: P('30328049', 'png', 0.6667, [0.39, 0.22, 0.2, 0.5], 'mass'),
  chicken: P('6107757', 'jpeg', 0.6667, [0.03, 0.33, 0.48, 0.38], 'mass'),
  minced: P('7340942', 'jpeg', 1.5038, [0.12, 0.25, 0.76, 0.58], 'mass'),
  tenders: P('9872916', 'jpeg', 1.5038, [0.22, 0.12, 0.6, 0.66], 'piece'),
  cordon: P('9872916', 'jpeg', 1.5038, [0.3, 0.2, 0.45, 0.5], 'piece'),
  merguez: P('10794112', 'jpeg', 0.6667, [0.07, 0.17, 0.3, 0.22], 'piece', 'sepia(.35) saturate(1.5) brightness(.72) contrast(1.15)'),
  steak: P('28292008', 'jpeg', 0.6667, [0.6, 0.52, 0.26, 0.14], 'piece'),
  lettuce: P('28524414', 'jpeg', 0.5618, [0.12, 0.18, 0.76, 0.64], 'mass'),
  cabbage: P('5876006', 'jpeg', 1.5038, [0.06, 0.1, 0.88, 0.8], 'mass'),
  onion: P('36895463', 'jpeg', 1.5038, [0.56, 0.68, 0.34, 0.2], 'mass'),
  redonion: P('5876006', 'jpeg', 1.5038, [0.3, 0.3, 0.4, 0.4], 'mass', 'saturate(.55) brightness(1.15)'),
  tomato: P('3296645', 'jpeg', 1.4925, [0.02, 0.04, 0.62, 0.92], 'piece'),
  pickle: P('39490165', 'jpeg', 0.7491, [0.25, 0.25, 0.5, 0.4], 'piece', 'sepia(.25) saturate(.9) brightness(.9)'),
  carrot: P('1306559', 'jpeg', 1.7391, [0.36, 0.42, 0.3, 0.3], 'mass'),
  pepper: P('14845773', 'jpeg', 1, [0.1, 0.32, 0.2, 0.4], 'piece'),
  fries: P('15754939', 'jpeg', 0.6667, [0.06, 0.06, 0.8, 0.86], 'mass'),
  rice: P('36346840', 'jpeg', 1.5038, [0.1, 0.1, 0.8, 0.8], 'mass'),
  bulgur: P('5114289', 'jpeg', 1.5038, [0.1, 0.1, 0.8, 0.8], 'mass'),
  grated: P('5908230', 'jpeg', 0.7407, [0.22, 0.63, 0.56, 0.11], 'mass'),
  egg: P('722223', 'jpeg', 1.5038, [0.13, 0.08, 0.78, 0.84], 'piece'),
  tortilla: P('7129400', 'jpeg', 0.6667, [0.5, 0.4, 0.38, 0.24], 'mass'),
};

/** URL d'une photo Pexels, dimensionnée selon la zone utile. */
export function photoUrl(src: PhotoSource): string {
  const w = Math.min(2400, Math.max(800, Math.round(720 / src.crop[2] / 100) * 100));
  return `https://images.pexels.com/photos/${src.id}/pexels-photo-${src.id}.${src.ext}?auto=compress&cs=tinysrgb&w=${w}`;
}

/** Séquence vidéo du final tacos : de vraies mains posent le tacos dans le grill. */
export interface VideoClip {
  id: string;
  src: string;
  /** Début et fin (secondes) de l'extrait utilisé. */
  from: number;
  to: number;
  caption: { fr: string; en: string };
}

const V = (id: string, fps: number) => `https://videos.pexels.com/video-files/${id}/${id}-sd_640_360_${fps}fps.mp4`;

export const GRILL_SEQUENCE: VideoClip[] = [
  { id: '5528087', src: V('5528087', 25), from: 5.6, to: 9.8, caption: { fr: 'Direction le grill', en: 'Into the grill' } },
  { id: '5780030', src: V('5780030', 24), from: 0.3, to: 6.8, caption: { fr: 'Pressé à la plancha', en: 'Pressed on the grill' } },
  { id: '5780035', src: V('5780035', 24), from: 0.3, to: 4.6, caption: { fr: 'Doré, marqué, prêt', en: 'Golden, marked, ready' } },
];

/** Image figée en fin de séquence (dernier plan) : tacos dorés sur le grill, sans mains. */
export const GRILL_HOLD_AT = 2.2;

export const MEDIA_CREDIT = {
  fr: 'Photos et vidéos d’illustration : Pexels (licence libre). À remplacer par les médias du restaurant.',
  en: 'Illustrative photos and videos: Pexels (free licence). To be replaced with the restaurant’s own media.',
};
