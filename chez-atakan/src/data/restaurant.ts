/**
 * Informations du restaurant.
 *
 * ✅ = information fournie dans le cahier des charges.
 * ⚠️ = à faire confirmer par le restaurateur avant la mise en ligne publique.
 */

/**
 * MODE DÉMONSTRATION.
 * true  → aucune commande n'est transmise, aucun paiement, confirmation « démo » affichée.
 * false → les commandes passent par la passerelle configurée (src/services/orders).
 *         Ne passer à false qu'une fois un vrai backend branché (VITE_ORDERS_API_URL).
 */
export const DEMO_MODE = (import.meta.env.VITE_DEMO_MODE ?? 'true') !== 'false';

export const restaurant = {
  name: 'Chez Atakan',
  slogan: 'Le goût du grill, la générosité en plus.',
  // ✅
  address: {
    street: '1 Avenue du Maréchal Joffre',
    postalCode: '66240',
    city: 'Saint-Estève',
    country: 'France',
  },
  // ✅
  phone: { display: '07 73 12 99 76', e164: '+33773129976' },
  // ✅
  instagram: { handle: '@chez_atakan', url: 'https://www.instagram.com/chez_atakan/' },
  maps: {
    /** Lien Google Maps (recherche par adresse, ne nécessite aucune clé). */
    url: 'https://www.google.com/maps/search/?api=1&query=Chez+Atakan+1+Avenue+du+Mar%C3%A9chal+Joffre+66240+Saint-Est%C3%A8ve',
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=1+Avenue+du+Mar%C3%A9chal+Joffre+66240+Saint-Est%C3%A8ve',
    /** Carte intégrée, chargée seulement après un clic (aucun traceur au chargement). */
    embed:
      'https://www.google.com/maps?q=1+Avenue+du+Mar%C3%A9chal+Joffre+66240+Saint-Est%C3%A8ve&output=embed',
  },
  /**
   * WhatsApp : transmission du récapitulatif de commande au restaurant.
   * ⚠️ Désactivé tant que le propriétaire n'a pas validé la fonctionnalité.
   */
  whatsapp: { enabled: false, number: '33773129976' },
};

export type DayHours = { day: string; slots: [string, string][] };

/**
 * ⚠️ Horaires actuellement référencés : à faire confirmer par le restaurateur.
 * Passer `hoursConfirmed` à true une fois validés (le bandeau « à confirmer » disparaît).
 */
export const hoursConfirmed = false;

const service: [string, string][] = [
  ['11:30', '14:30'],
  ['18:00', '23:00'],
];

/** Index 0 = lundi … 6 = dimanche. */
export const openingHours: DayHours[] = [
  { day: 'Lundi', slots: service },
  { day: 'Mardi', slots: [] },
  { day: 'Mercredi', slots: service },
  { day: 'Jeudi', slots: service },
  { day: 'Vendredi', slots: service },
  { day: 'Samedi', slots: service },
  { day: 'Dimanche', slots: service },
];

/** Contenu d'un « menu » (formule). ⚠️ Non communiqué : affichage neutre. */
export const menuFormulaDescription: string | null = null;

/**
 * Espace restaurant (démo) : code d'accès simple pour éviter les clics accidentels.
 * Ce n'est PAS une sécurité : en production, l'authentification se fait côté serveur.
 */
export const DEMO_STAFF_PIN = '6624';
