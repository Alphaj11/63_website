/**
 * Crédits photo. Chaque image déposée dans src/assets doit apparaître ici
 * avec sa source et sa licence (Unsplash License, Pexels License, photo du restaurant…).
 * Cette liste est affichée en pied de page et reprise dans le README.
 */
export interface Credit {
  key: string;
  author: string;
  source: string;
  url: string;
  license: string;
}

export const credits: Credit[] = [];
