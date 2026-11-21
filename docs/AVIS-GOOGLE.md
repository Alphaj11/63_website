# Activer les avis Google

La section « ILS EN PARLENT MIEUX QUE NOUS. » est terminée visuellement. Elle fonctionne selon trois états, sans jamais inventer d'avis :

| État | Quand | Ce qui s'affiche |
|---|---|---|
| **Démo** | Rien n'est configuré (état actuel) | Bandeau « MODE DÉMONSTRATION », emplacements vides, aucune note ni nombre d'avis |
| **Manuel** | Des avis réels sont saisis dans `src/services/reviews/manual-reviews.ts` | Les avis recopiés mot pour mot, note et nombre d'avis seulement s'ils ont été relevés et datés |
| **Direct** | La route serveur répond (`NEXT_PUBLIC_REVIEWS_ENDPOINT`) | Note moyenne, nombre total d'avis et avis fournis par Google, actualisés (cache 6 h) |

## Pourquoi pas directement sur GitHub Pages ?

GitHub Pages ne sert que des fichiers statiques. La clé Google Places **ne doit jamais** être envoyée au navigateur. Il faut donc une petite route serveur, fournie dans `integrations/google-reviews/route.ts`.

## Procédure (hébergement avec serveur : Vercel, Netlify, VPS Node)

1. **Clé API** : dans la Google Cloud Console, créer un projet, activer **Places API (New)**, créer une clé et la **restreindre** à cette API (et, si possible, aux IP du serveur).
2. **Place ID** : retrouver l'identifiant de la fiche « Kebab Grill House 63 » avec l'outil officiel *Place ID Finder* de Google.
3. Copier `integrations/google-reviews/route.ts` vers `src/app/api/reviews/route.ts`.
4. Dans `next.config.mjs`, retirer `output: 'export'` (la route a besoin d'un serveur).
5. Variables d'environnement (voir `.env.example`) :
   - `GOOGLE_PLACES_API_KEY` — **serveur uniquement**
   - `GOOGLE_PLACE_ID`
   - `NEXT_PUBLIC_REVIEWS_ENDPOINT=/api/reviews`
   - `NEXT_PUBLIC_GOOGLE_PLACE_ID` — active les boutons officiels « Voir tous nos avis Google » et « Laisser un avis »
6. Déployer. La section passe automatiquement en mode **Direct**.

### Variante : garder GitHub Pages
Héberger uniquement la route sur un service serverless (Vercel, Cloudflare Workers…), puis définir dans le dépôt GitHub (*Settings → Secrets and variables → Actions → Variables*) :
`NEXT_PUBLIC_REVIEWS_ENDPOINT=https://…/api/reviews` et `NEXT_PUBLIC_GOOGLE_PLACE_ID=…`. Le workflow les injecte au build. Penser à autoriser l'origine `https://alphaj11.github.io` (CORS) sur la route.

## Limites et règles à respecter

- L'API Places renvoie **au maximum 5 avis** par fiche (sélection faite par Google). La note moyenne et le nombre total d'avis restent ceux de la fiche, non filtrés.
- La sélection (`src/services/reviews/select.ts`) ne fait que **trier** : les avis détaillés évoquant la viande, les portions, les sauces, l'accueil passent en premier ; un 4★ détaillé peut précéder un 5★ très court ; aucun avis < 4★ n'est mis en avant ; **les textes ne sont jamais modifiés**.
- Afficher le nom de l'auteur, sa photo et le lien vers son profil tels que fournis (`authorAttribution`), ainsi que l'attribution « Google ».
- Ne pas stocker les avis au-delà de ce que permettent les conditions de Google Maps Platform (le cache de la route est de 6 h).
- N'utiliser le logo Google qu'en respectant les règles de marque ; le site affiche par défaut une mention texte.

## Mode manuel (sans API)

Uniquement avec des avis **réels**, transmis ou validés par le restaurant, recopiés **mot pour mot** avec leur note et leur date d'origine, dans `src/services/reviews/manual-reviews.ts`. Pour afficher la note moyenne et le nombre d'avis, les relever sur la fiche et renseigner la date du relevé (`fetchedAt`) ; sans date, ils ne sont pas affichés.
