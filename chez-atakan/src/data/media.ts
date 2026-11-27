/**
 * MÉDIATHÈQUE — bibliothèque d'images locale.
 *
 * Chaque visuel est identifié par une clé (ex. « product-kebab ») et correspond à un fichier
 * déposé dans src/assets/{products,ingredients,images}/<clé>.{avif,webp,jpg}.
 * Aucune URL distante n'est utilisée dans les composants.
 *
 * Pour remplacer une photo : déposer le fichier avec le même nom (les formats .avif et .webp
 * sont générés par `npm run images`) et mettre à jour src/data/credits.ts.
 * Si un fichier manque, le composant <Photo> affiche un cadre neutre « photo à venir »
 * (jamais une illustration ou un emoji à la place d'un aliment).
 */

const files = import.meta.glob('../assets/{products,ingredients,images}/*.{avif,webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export interface MediaSource {
  avif?: string;
  webp?: string;
  fallback?: string;
}

const library: Record<string, MediaSource> = {};
for (const [path, url] of Object.entries(files)) {
  const match = path.match(/\/([^/]+)\.(avif|webp|jpe?g|png)$/);
  if (!match) continue;
  const [, key, ext] = match;
  const entry = (library[key] ??= {});
  if (ext === 'avif') entry.avif = url;
  else if (ext === 'webp') entry.webp = url;
  else entry.fallback = url;
}

/** Alias : un produit peut réutiliser la photo d'un autre pour rester cohérent. */
const aliases: Record<string, string> = {
  // Composition non communiquée : on réutilise la photo du produit le plus proche.
  'product-big': 'product-kebab',
  'product-duo-burger': 'product-double-burger',
  'product-double-steak': 'meat-steak',
};

export function media(key: string): MediaSource | null {
  const direct = library[key];
  if (direct && (direct.webp || direct.fallback || direct.avif)) return direct;
  const alias = aliases[key];
  if (alias) return media(alias);
  return null;
}

export const mediaKeys = () => Object.keys(library);
