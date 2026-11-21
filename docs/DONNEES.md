# Remplacer les données de démonstration

Règle d'or : **ne jamais inventer** d'ingrédient, de tarif, d'horaire, d'avis ou d'URL. Tant qu'une information n'est pas validée par l'établissement, elle reste signalée « Démo » ou masquée.

## 1. Informations du restaurant — `src/data/restaurant.ts`

| Champ | Aujourd'hui | À faire |
|---|---|---|
| `address`, `phone` | Renseignés (fournis dans le cahier des charges) | Vérifier |
| `openingHours` | `null` → le site affiche « Horaires en cours de vérification » | Remplir après validation, ex. `[{ fr: 'Lundi', en: 'Monday', hours: '11:30 – 23:00' }, …]` |
| `halalConfirmed` | `null` → aucune mention halal | Passer à `true` **uniquement** après confirmation écrite ; ajouter alors « restaurant halal Lyon 7 » dans les textes SEO |
| `serviceModesConfirmed` | `false` → « Option à confirmer » sous Sur place / À emporter | Passer à `true` après confirmation |
| `googlePlaceId` | Variable `NEXT_PUBLIC_GOOGLE_PLACE_ID` | Voir AVIS-GOOGLE.md |

## 2. Carte, options et tarifs

1. Copier `src/data/demo/menu.ts` vers `src/data/official/menu.ts`.
2. Y remplacer les étapes, options et prix (en **centimes** : `850` = 8,50 €) par la carte validée.
   - Chaque option a un `visual` (rendu de l'ingrédient). Les visuels disponibles sont listés dans `VisualKey` (`src/lib/types.ts`) ; un nouvel ingrédient se dessine dans `src/components/food/IngredientDefs.tsx`.
   - `maxMeats` sur les tailles de tacos fixe le nombre de viandes autorisées.
3. Dans `src/data/menu.ts`, remplacer `./demo/menu` par `./official/menu` et passer `MENU_IS_DEMO` à `false` : les pastilles « Démo » de la carte disparaissent.
4. Retirer la pastille « Démo » de la scène du configurateur (`BuilderShell.tsx`) et « Tarifs démo » du panier (`CartDrawer.tsx`).

## 3. Suggestions (ventes complémentaires) — `src/data/demo/recommendations.ts`

- `cartRecommendations` : produit suggéré dans le panier selon ce qui s'y trouve.
- `builderHints` : suggestion discrète pendant la composition (étape + option).
Aucune suggestion n'est ajoutée automatiquement.

## 4. Logo

Le logo actuel est **typographique et temporaire** (`src/components/Logo.tsx`).
Déposer le vrai fichier dans `public/brand/logo.svg` (ou `.png`) puis passer `USE_REAL_LOGO` à `true`.

## 5. Photos et vidéos

Les cadres « Emplacement photo réelle » de *Notre univers* (`src/components/RestaurantStory.tsx`) attendent les vrais médias.
Déposer les fichiers dans `public/media/` (WebP/AVIF pour les photos, MP4 H.264 + WebM pour les vidéos, < 2 Mo si possible) et remplacer le motif SVG du cadre par une balise `<img loading="lazy">` ou `<video muted playsInline autoPlay loop>`.
Les visuels actuels sont des **illustrations**, ils ne prétendent pas représenter le restaurant.

## 6. Textes de présentation

Les textes de *Notre univers* décrivent une intention (générosité, grill, accueil). Ils sont à relire et valider par l'établissement. N'ajouter ni témoignage, ni label, ni certification non vérifiés.

## 7. Commande et paiement

`src/services/order/gateway.ts` : remplacer `DemoOrderGateway` par une implémentation reliée au système réel (caisse, plateforme de commande). Le paiement doit passer par une **page hébergée par un prestataire certifié** (ex. Stripe Checkout) : aucune saisie de carte sur le site.

## 8. QR codes de table

`/qr/` génère des QR codes imprimables vers `/table/?t=N`. Une fois le domaine définitif en place, régénérer et réimprimer les codes depuis ce domaine.
