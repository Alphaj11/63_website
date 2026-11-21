import type { Review } from './types';

/**
 * Sélection des avis les plus utiles à afficher.
 * - On ne garde que des avis réels fournis par la source (aucune génération).
 * - Le texte n'est jamais modifié : seul l'ordre change.
 * - Les avis 4★ détaillés peuvent passer devant des 5★ très courts.
 * - Aucun avis < 4★ n'est mis en avant, mais la note moyenne affichée reste celle de Google (non filtrée).
 */
const THEMES: { theme: string; words: RegExp }[] = [
  { theme: 'viande', words: /\b(viande|grill|grillé|broche|meat|kebab|döner|doner|poulet|chicken)\b/i },
  { theme: 'portions', words: /\b(généreu|copieu|portion|quantité|généreux|generous|huge|big)\w*/i },
  { theme: 'sauces', words: /\b(sauce|sauces|fromagère|préparation|frais|fraîche|fresh)\b/i },
  { theme: 'accueil', words: /\b(accueil|service|souriant|gentil|sympa|aimable|staff|friendly|welcom)\w*/i },
  { theme: 'global', words: /\b(excellent|délicieux|parfait|top|meilleur|recommande|delicious|best|amazing)\w*/i },
];

export function scoreReview(r: Review): number {
  if (r.rating < 4 || !r.text?.trim()) return -1;
  const len = r.text.trim().length;
  let score = r.rating * 10;
  score += Math.min(len, 400) / 20; // avis détaillé
  if (len < 40) score -= 15; // trop court pour convaincre
  for (const t of THEMES) if (t.words.test(r.text)) score += 6;
  return score;
}

export function selectBestReviews(reviews: Review[], max = 8): Review[] {
  const seen = new Set<string>();
  return reviews
    .filter((r) => { const k = `${r.authorName}|${r.text}`; if (seen.has(k)) return false; seen.add(k); return true; })
    .map((r) => ({ r, s: scoreReview(r) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => b.s - a.s || b.r.publishTime.localeCompare(a.r.publishTime))
    .slice(0, max)
    .map((x) => x.r);
}

export function themesOf(r: Review): string[] {
  return THEMES.filter((t) => t.words.test(r.text)).map((t) => t.theme);
}
