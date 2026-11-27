# GRILL HOUSE 63 — Enter the Grill Experience

Prototype interactif du site de **Kebab Grill House 63** (40 rue de Marseille, 69007 Lyon), conçu comme démonstration commerciale.

**Digital experience by QAMAR CONCEPTION.**

> ⚠️ **Démonstration.** La carte, les ingrédients, les options et les tarifs sont des **données de démonstration** clairement signalées sur le site. La commande est **simulée** : rien n'est transmis au restaurant, aucun paiement n'est encaissé. Les avis Google sont en **mode démonstration** tant que l'API n'est pas connectée : aucun avis n'est inventé.

## Ce que contient le prototype

| Fonction | État |
|---|---|
| Accueil cinématographique (broche 3D WebGL, lumière rouge, fumée, braises, mouvement de caméra) | ✅ Intro de ~4 s, « Passer l'intro », jamais rejouée dans la session, alternative 2D sans WebGL / mouvement réduit |
| Configurateur **tacos** signature : ingrédients en **textures photo réelles**, sauces nappées brillantes, pliage, puis **séquence vidéo réelle** au grill (mains, presse, sortie dorée), passable | ✅ Médias d'illustration Pexels, à remplacer par ceux du restaurant |
| Configurateurs **kebab** (empilement + fermeture + papier), **kumpir** (ouverture, beurre, fromage, garnitures), **assiette** (dressage par zones) | ✅ |
| Prix recalculé à chaque choix, récapitulatif, ajout / modification / suppression / quantités | ✅ |
| Panier persistant (navigation et rechargement), sur place / à emporter (option à confirmer), page de validation simulée | ✅ |
| Suggestions discrètes (boisson, frites, supplément) configurables | ✅ |
| Notre univers (storytelling au scroll, emplacements photos/vidéos réelles) | ✅ |
| Avis Google « Ils en parlent mieux que nous. » : note, nombre d'avis, carrousel, boutons officiels | ✅ Interface finie, **mode démo** + intégration prête (voir [docs/AVIS-GOOGLE.md](docs/AVIS-GOOGLE.md)) |
| Nous trouver : adresse, appel, itinéraire, carte Google chargée après consentement | ✅ Horaires masqués tant qu'ils ne sont pas vérifiés |
| Français / anglais (bascule visible, mémorisée) | ✅ |
| QR codes de table (générateur imprimable `/qr/` + page d'arrivée `/table/?t=12`) | ✅ Démo |
| Programme de fidélité Grill House Club + campagne de Noël | ⏳ Reporté à une prochaine étape : emplacement réservé dans la navigation (`/fidelite/`) |

## Stack

Next.js 15 (App Router, export statique) · React 19 · TypeScript · Tailwind CSS · Framer Motion · Three.js / React Three Fiber · Zustand · QRCode.

Les scènes de composition sont dessinées en **SVG vectoriel animé** (chaque ingrédient est un calque indépendant qui se superpose), ce qui reste léger, net sur tous les écrans et fonctionne sans WebGL. La 3D est réservée à l'accueil et chargée en différé.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # tests des prix, du configurateur et de la sélection d'avis
npm run build      # export statique dans ./out
```

## Structure

```
src/
  app/                    pages (accueil, univers, carte, composer/*, avis, fidelite, nous-trouver, commande, table, qr)
  components/
    hero/                 HeroExperience, CinematicIntro, DonerScene3D (WebGL), HeroFallback (2D)
    builders/             BuilderShell + TacosBuilder, KebabBuilder, KumpirBuilder, PlateBuilder
    food/                 IngredientDefs (bibliothèque SVG), IngredientLayer, CookingAnimation,
                          TacosScene, KebabScene, KumpirScene, PlateScene
    reviews/              GoogleReviews, GoogleRatingSummary, ReviewCarousel, ReviewCard
    Navigation, CartDrawer, MenuExplorer, RestaurantStory, LocationSection, LanguageSwitcher, Footer, Logo
  data/
    restaurant.ts         données OFFICIELLES (adresse, téléphone) + champs à vérifier (horaires, halal…)
    menu.ts               point d'entrée de la carte (bascule démo → officielle)
    demo/menu.ts          ⚠️ carte de démonstration
    demo/recommendations.ts  ⚠️ règles de suggestions de démonstration
  services/
    reviews/              couche de service des avis (client, sélection, avis manuels, types)
    order/gateway.ts      passerelle de commande (démo aujourd'hui, prête pour un vrai système)
  store/                  panier et langue (Zustand, stockage local protégé)
integrations/google-reviews/route.ts   route serveur Places API, à activer sur un hébergement avec serveur
docs/                     DONNEES.md, AVIS-GOOGLE.md
```

## Déploiement

Le site est publié sur **GitHub Pages** par le workflow `.github/workflows/deploy.yml` à chaque push sur `main` (`GITHUB_PAGES=true` active le `basePath` `/63_website`).

Pour un nom de domaine propre (ex. `grillhouse63.fr`), ou pour activer les avis Google en direct, un hébergement avec serveur (Vercel, Netlify…) est recommandé : voir [docs/AVIS-GOOGLE.md](docs/AVIS-GOOGLE.md).

## Remplacer les données de démonstration

Tout est expliqué dans [docs/DONNEES.md](docs/DONNEES.md) : carte et tarifs, horaires, halal, sur place / à emporter, logo, photos et vidéos, suggestions.

## Accessibilité et performance

- Navigation au clavier, lien d'évitement, focus visibles, libellés ARIA (carrousel, étapes, quantités).
- `prefers-reduced-motion` respecté : intro sautée, 2D statique, animations coupées.
- WebGL chargé en différé, désactivé sans support / économie de données ; alternative 2D.
- Polices auto-hébergées (aucun appel à Google Fonts), aucun traceur. La carte Google ne se charge qu'après clic.
- Les animations ne bloquent jamais l'accès à la carte, à la commande ou aux avis.
