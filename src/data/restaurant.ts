/**
 * DONNÉES OFFICIELLES de l'établissement.
 * Seules les informations fournies dans le cahier des charges sont renseignées.
 * Tout champ `null` est en attente de validation par le restaurant : il n'est PAS affiché comme une information vérifiée.
 */
export const restaurant = {
  name: 'Kebab Grill House 63',
  brand: 'Grill House 63',
  address: {
    street: '40 rue de Marseille',
    postalCode: '69007',
    city: 'Lyon',
    country: 'France',
    full: '40 rue de Marseille, 69007 Lyon, France',
  },
  phone: { display: '04 87 78 10 94', e164: '+33487781094' },

  /** Horaires : à renseigner après vérification. Format libre par jour, ex. { fr: 'Lundi', en: 'Monday', hours: '11:30 – 23:00' }. */
  openingHours: null as null | { fr: string; en: string; hours: string }[],
  /** Certification halal : à confirmer par l'établissement avant toute mention. */
  halalConfirmed: null as null | boolean,
  /** Sur place / à emporter : options affichées au panier, à confirmer par l'établissement. */
  serviceModesConfirmed: false,

  /** Place ID Google (public). Renseigné via NEXT_PUBLIC_GOOGLE_PLACE_ID ou directement ici. */
  googlePlaceId: process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || null,
} as const;

const q = encodeURIComponent(`${restaurant.name}, ${restaurant.address.full}`);

/** Liens construits avec l'API officielle « Maps URLs » de Google (aucune URL inventée). */
export const mapsLinks = {
  search: `https://www.google.com/maps/search/?api=1&query=${q}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${q}`,
  embed: `https://www.google.com/maps?q=${q}&output=embed`,
  /** Fiche officielle : nécessite le Place ID. */
  place: restaurant.googlePlaceId
    ? `https://www.google.com/maps/search/?api=1&query=${q}&query_place_id=${restaurant.googlePlaceId}`
    : null,
  /** Lien officiel de dépôt d'avis : nécessite le Place ID. */
  writeReview: restaurant.googlePlaceId
    ? `https://search.google.com/local/writereview?placeid=${restaurant.googlePlaceId}`
    : null,
};
