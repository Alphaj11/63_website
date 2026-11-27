# CHEZ ATAKAN — site immersif de commande en ligne

Site de démonstration pour **Chez Atakan**, 1 Avenue du Maréchal Joffre, 66240 Saint-Estève. Téléphone : 07 73 12 99 76. Instagram : [@chez_atakan](https://www.instagram.com/chez_atakan/).

> **Démonstration.** `DEMO_MODE` est actif : aucune commande n'est transmise au restaurant, aucun paiement n'est demandé, et chaque écran le dit clairement. Les tarifs viennent d'une photographie publique de la carte. Tout ce qui n'a pas été confirmé par le restaurant est signalé « à confirmer » au lieu d'être inventé.

Publication : `https://alphaj11.github.io/63_website/chez-atakan/` (après fusion sur `main`).

## Ce que fait le site

| Fonction | État |
|---|---|
| Hero immersif : photo plein écran de la broche, logo qui apparaît lettre par lettre, lueur de braise, braises et fumée en CSS (coupées si mouvement réduit), deux boutons, invitation au défilement | ✅ |
| Notre univers : 5 chapitres (broche, pain du boulanger, générosité, préparation à la commande, produits frais), photos avec parallaxe léger | ✅ Aucun fournisseur ni origine inventés |
| La carte : 7 catégories, onglets collants avec suivi du défilement, fiches avec photo, description, prix seul / menu, boutons « Personnaliser » et « Ajouter au panier » | ✅ |
| Configurateurs tacos, bowl, sandwich, burger : étapes, scène visuelle qui évolue (base, couches de viandes, nappage animé des sauces, balayage de lumière final), prix recalculé à chaque choix | ✅ |
| Panier latéral : quantités, suppression, modification de la composition, détail, total, barre de progression, suggestions discrètes (nuggets, grande frite), sauvegarde localStorage, barre panier fixe sur mobile | ✅ |
| Commande : livraison ou retrait, coordonnées, adresse, code postal, complément, instructions, validation des champs, récapitulatif | ✅ Zone et frais de livraison configurables (vides = « à confirmer ») |
| Confirmation immersive + suivi en direct de la commande | ✅ Clairement marquée « démonstration » |
| WhatsApp : récapitulatif prêt pour le +33 7 73 12 99 76 | ✅ Désactivé tant que le restaurant ne l'a pas validé (aperçu du message affiché) |
| **Espace restaurant** (`#/restaurant`) : réception des commandes, acceptation avec délai, refus avec motif, suivi (en préparation, prête, livrée / retirée), signal sonore, impression du ticket, chiffre du jour | ✅ Démo locale (voir ci-dessous) |
| Avis clients : note Google et témoignages **uniquement si vérifiés**, boutons « Voir les avis Google » et « Laisser un avis » | ✅ Rien d'affiché tant que rien n'est vérifié |
| Infos pratiques : adresse, appel, Instagram, Google Maps, itinéraire, carte interactive chargée au clic, horaires configurables | ✅ Horaires marqués « à confirmer » |

## L'espace restaurant : ce qu'il fait, et ce qu'il ne peut pas faire sans serveur

Adresse : `…/chez-atakan/#/restaurant`. Code de démonstration : **6624** (dans `src/data/restaurant.ts`).

**Aujourd'hui (sans backend), il peut :**
- afficher les commandes passées **depuis le même navigateur**, et les recevoir en direct si le site client est ouvert dans un autre onglet (signal sonore, compteur dans l'onglet) ;
- accepter une commande avec un délai (10 à 45 min), la refuser avec un motif, la faire avancer (en préparation → prête → livrée / retirée) ;
- répercuter chaque changement en direct sur l'écran de suivi du client (même navigateur) ;
- créer une commande test et vider les données de démo.

**Il ne peut pas, tant qu'aucun serveur n'est branché :**
- recevoir les commandes passées par d'autres clients sur leur téléphone : le site est statique, les données restent dans chaque navigateur ;
- prévenir un client sur son propre téléphone ;
- protéger réellement l'accès : le code 6624 évite les clics accidentels, ce n'est pas une sécurité.

Pour en faire un vrai outil, il suffit de brancher un backend sur la passerelle `src/services/orders` (voir « Évolutions »). Les écrans client et restaurant n'ont pas besoin d'être réécrits.

## Démarrer

```bash
cd chez-atakan
npm install
npm run dev        # http://localhost:5173
npm test           # tests des prix, du configurateur et de la commande
npm run build      # build de production dans ./dist
npm run images     # optimise les photos de media-src/ en AVIF + WebP dans src/assets/
```

## Déploiement GitHub Pages

Le workflow `.github/workflows/deploy.yml` du dépôt construit, à chaque push sur `main` :
- le site existant à la racine (`/63_website/`) ;
- Chez Atakan sous `/63_website/chez-atakan/` (`VITE_BASE=/63_website/chez-atakan/`).

Les liens internes passent par des ancres (`#/commande`, `#/restaurant`) : aucune configuration serveur n'est nécessaire. Le workflow `chez-atakan-ci.yml` vérifie tests et build sur chaque pull request.

Pour publier Chez Atakan à la racine d'un autre dépôt ou sur un nom de domaine, il suffit de changer `VITE_BASE` (`/` pour un domaine dédié).

## Modifier les informations

Tout est dans `src/data/` :

| Fichier | Contenu |
|---|---|
| `products.ts` | catégories, produits, prix seul / menu, prix par nombre de viandes, descriptions, compositions (`null` = non communiquée) |
| `ingredients.ts` | viandes, suppléments (œuf, galette de pommes de terre : 1 €) et produits concernés, règle « même viande deux fois » |
| `sauces.ts` | sauces et règles (nombre maximum, à confirmer) |
| `restaurant.ts` | `DEMO_MODE`, adresse, téléphone, Instagram, liens Maps, horaires (`hoursConfirmed`), WhatsApp (`enabled`), contenu de la formule menu, code de l'espace restaurant |
| `delivery.ts` | livraison / retrait activés, communes et codes postaux desservis, frais, minimum de commande |
| `reviews.ts` | note Google vérifiée, témoignages réels, Place ID pour le lien « laisser un avis » |
| `media.ts` / `credits.ts` | médiathèque photo et crédits |

### Points à faire confirmer par le restaurant avant publication

- Composition du Royal, du Blindé, du Big et du Duo Burger (aujourd'hui : description neutre).
- Contenu de la formule « menu ».
- Nombre de sauces autorisées et éventuel coût des sauces supplémentaires.
- Produits concernés par les suppléments œuf / galette de pommes de terre.
- Possibilité de prendre deux fois la même viande dans un tacos.
- Communes livrées, frais de livraison, minimum de commande.
- Horaires.
- Activation de WhatsApp.
- Note Google et avis à afficher.

## Photos

Règle : **uniquement des photos réelles ou photoréalistes, sous licence permettant l'usage commercial, stockées localement**. Aucune URL distante dans les composants, aucune illustration ou emoji à la place d'un aliment.

- Déposer l'original dans `media-src/{images,products,ingredients}/<clé>.jpg` (clés listées dans `src/data/media.ts` et `src/data/*.ts`), puis `npm run images`.
- Ajouter l'auteur, la source et la licence dans `src/data/credits.ts` (affichés en pied de page) et dans le tableau ci-dessous.
- Un même aliment garde la même photo partout grâce aux alias de `media.ts` (ex. la viande du configurateur = celle des fiches produit).
- Tant qu'une photo manque, un cadre neutre « photo à venir » s'affiche.

Les photos actuelles sont des **photos d'illustration** issues d'Unsplash (licence Unsplash : usage commercial autorisé, sans obligation d'attribution, crédits fournis quand même). Le pied de page le précise. Les meilleures photos resteront celles du restaurant lui-même (broche, pain, produits réels).

### Crédits photo

| Clé | Auteur | Source | Licence |
|---|---|---|---|
| `hero-broche` | engin akyurt | [Unsplash](https://unsplash.com/photos/Vq995Fnrw4A) | Licence Unsplash |
| `story-broche` | Francis Ledger | [Unsplash](https://unsplash.com/photos/orIQn6nszgo) | Licence Unsplash |
| `story-preparation` | Taeyoon Moon | [Unsplash](https://unsplash.com/photos/TA2we7vayGU) | Licence Unsplash |
| `story-pain` | Maite Paternain | [Unsplash](https://unsplash.com/photos/UVNguozJOPE) | Licence Unsplash |
| `story-generosite` | Gang Hao | [Unsplash](https://unsplash.com/photos/gM5Bdzp7LhY) | Licence Unsplash |
| `story-frais` | Andres Carreno | [Unsplash](https://unsplash.com/photos/RqS7r2CzL68) | Licence Unsplash |
| `meat-kebab` | engin akyurt | [Unsplash](https://unsplash.com/photos/9Lsxip60s20) | Licence Unsplash |
| `meat-poulet` | aly | [Unsplash](https://unsplash.com/photos/0dW1rNcbadM) | Licence Unsplash |
| `meat-steak` | Izzy Park | [Unsplash](https://unsplash.com/photos/OKBCiPpTHag) | Licence Unsplash |
| `meat-tenders` | Léo Roza | [Unsplash](https://unsplash.com/photos/P_z_xlMGuEk) | Licence Unsplash |
| `meat-nuggets` | Dynamic Wang | [Unsplash](https://unsplash.com/photos/WScUzPUGkQQ) | Licence Unsplash |
| `meat-cordon-bleu` | Mark König | [Unsplash](https://unsplash.com/photos/MyfbM2QYF4o) | Licence Unsplash |
| `product-kebab` | Yoad Shejtman | [Unsplash](https://unsplash.com/photos/sPmF7MNzdnU) | Licence Unsplash |
| `product-galette` | Anima Visual | [Unsplash](https://unsplash.com/photos/jhTzMj5aJQk) | Licence Unsplash |
| `product-chicken-tikka` | Alexander Mils | [Unsplash](https://unsplash.com/photos/SNLfVYmL8os) | Licence Unsplash |
| `product-royal` | Bayuaji Abiyu | [Unsplash](https://unsplash.com/photos/xq04aTV-LVk) | Licence Unsplash |
| `product-blinde` | Bayuaji Abiyu | [Unsplash](https://unsplash.com/photos/_JIRNUeDGy8) | Licence Unsplash |
| `product-tacos` | Omar Hakeem | [Unsplash](https://unsplash.com/photos/APbsVh624WA) | Licence Unsplash |
| `product-bowl` | Rimsha Noor | [Unsplash](https://unsplash.com/photos/1RE1sDbR4Go) | Licence Unsplash |
| `product-burger` | amirali mirhashemian | [Unsplash](https://unsplash.com/photos/MNHQqLNEvow) | Licence Unsplash |
| `product-double-burger` | amirali mirhashemian | [Unsplash](https://unsplash.com/photos/jh5XyK4Rr3Y) | Licence Unsplash |
| `product-triple-burger` | Sol Ingrao | [Unsplash](https://unsplash.com/photos/j1NmLRIlJGI) | Licence Unsplash |
| `product-chicken-burger` | David Foodphototasty | [Unsplash](https://unsplash.com/photos/VFVnZfogE7s) | Licence Unsplash |
| `product-double-chicken` | Sultan Abdulrazzaq | [Unsplash](https://unsplash.com/photos/UDYjeBwFZf8) | Licence Unsplash |
| `product-nuggets` | Stu Moffat | [Unsplash](https://unsplash.com/photos/xTJSYt4doqo) | Licence Unsplash |
| `product-nuggets-10` | Lee Milo | [Unsplash](https://unsplash.com/photos/bG8sQGD8Bi8) | Licence Unsplash |
| `product-menu-enfant` | Tyson | [Unsplash](https://unsplash.com/photos/UmkODKl4E1M) | Licence Unsplash |
| `product-frites` | Mitchell Luo | [Unsplash](https://unsplash.com/photos/ChXHveqrb28) | Licence Unsplash |
| `product-grande-frite` | Cindy Bartillon | [Unsplash](https://unsplash.com/photos/-doMDpFipzQ) | Licence Unsplash |
| `extra-oeuf` | Jonathan Cooper | [Unsplash](https://unsplash.com/photos/Bl2PZj_TgpE) | Licence Unsplash |
| `extra-galette-pdt` | tommao wang | [Unsplash](https://unsplash.com/photos/Dut3u5zJ0vE) | Licence Unsplash |

## Architecture

```
chez-atakan/
  src/
    components/   Header, Hero, Story, Compose, Menu, ProductCard, ProductCustomizer,
                  IngredientLayers, Cart, Checkout, OrderStatus, Reviews, Location, Footer
      admin/      RestaurantSpace (espace restaurant)
      ui/         Photo, Logo, Reveal, DemoBadge, InstagramIcon
    data/         products, ingredients, sauces, restaurant, delivery, reviews, media, credits
    hooks/        useCart, useCustomizer, useLocalStorage, useRoute
    lib/          pricing (seule source des prix), order, money, storage, types
    services/
      orders/     gateway (interface), localGateway (démo), httpGateway (futur backend)
      reviews/    chargement des avis (manuel ou endpoint Google Places)
    pages/        Home
    styles/       globals.css
    assets/       images, products, ingredients, videos (fichiers optimisés)
  media-src/      photos originales (non publiées)
  scripts/        optimize-images.mjs
  tests/          pricing.test.ts
```

Stack : React 18, Vite 6, TypeScript, Tailwind CSS 3, Motion, Lucide React. Polices auto-hébergées (Big Shoulders Display, Inter). Aucun service externe requis.

## Évolutions prévues

- **Backend de commandes** : implémenter l'API décrite dans `src/services/orders/gateway.ts` (création, liste, changement de statut, temps réel), définir `VITE_ORDERS_API_URL` et `VITE_DEMO_MODE=false`. Supabase, Firebase ou une petite API Node conviennent.
- **Paiement en ligne** : à brancher entre la création de la commande et son acceptation (Stripe, SumUp…). Aucun faux paiement n'est intégré.
- **Tableau de bord restaurateur** : l'espace restaurant actuel en est la base (authentification à faire côté serveur).
- **Avis Google en direct** : fonction serveur qui appelle l'API Google Places (la clé ne doit jamais être dans le site statique), puis `VITE_REVIEWS_ENDPOINT`.

## Accessibilité et performance

- Navigation clavier, lien d'évitement, focus visibles, dialogues `aria-modal` fermables avec Échap, libellés ARIA sur les quantités et les étapes.
- `prefers-reduced-motion` respecté (Motion `reducedMotion="user"` + CSS).
- Images AVIF / WebP, chargement différé, image du hero prioritaire, carte Google chargée uniquement au clic.
- Découpage du code : configurateur, commande, suivi et espace restaurant chargés à la demande.
- Animations limitées à `transform` et `opacity`.
