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

export const credits: Credit[] = [
  { key: 'hero-broche', author: 'engin akyurt', source: 'Unsplash', url: 'https://unsplash.com/photos/Vq995Fnrw4A', license: 'Licence Unsplash' },
  { key: 'story-broche', author: 'Francis Ledger', source: 'Unsplash', url: 'https://unsplash.com/photos/orIQn6nszgo', license: 'Licence Unsplash' },
  { key: 'story-preparation', author: 'Taeyoon Moon', source: 'Unsplash', url: 'https://unsplash.com/photos/TA2we7vayGU', license: 'Licence Unsplash' },
  { key: 'story-pain', author: 'Maite Paternain', source: 'Unsplash', url: 'https://unsplash.com/photos/UVNguozJOPE', license: 'Licence Unsplash' },
  { key: 'story-generosite', author: 'Gang Hao', source: 'Unsplash', url: 'https://unsplash.com/photos/gM5Bdzp7LhY', license: 'Licence Unsplash' },
  { key: 'story-frais', author: 'Andres Carreno', source: 'Unsplash', url: 'https://unsplash.com/photos/RqS7r2CzL68', license: 'Licence Unsplash' },
  { key: 'meat-kebab', author: 'engin akyurt', source: 'Unsplash', url: 'https://unsplash.com/photos/9Lsxip60s20', license: 'Licence Unsplash' },
  { key: 'meat-poulet', author: 'aly', source: 'Unsplash', url: 'https://unsplash.com/photos/0dW1rNcbadM', license: 'Licence Unsplash' },
  { key: 'meat-steak', author: 'Izzy Park', source: 'Unsplash', url: 'https://unsplash.com/photos/OKBCiPpTHag', license: 'Licence Unsplash' },
  { key: 'meat-tenders', author: 'Léo Roza', source: 'Unsplash', url: 'https://unsplash.com/photos/P_z_xlMGuEk', license: 'Licence Unsplash' },
  { key: 'meat-nuggets', author: 'Dynamic Wang', source: 'Unsplash', url: 'https://unsplash.com/photos/WScUzPUGkQQ', license: 'Licence Unsplash' },
  { key: 'meat-cordon-bleu', author: 'Mark König', source: 'Unsplash', url: 'https://unsplash.com/photos/MyfbM2QYF4o', license: 'Licence Unsplash' },
  { key: 'product-kebab', author: 'Yoad Shejtman', source: 'Unsplash', url: 'https://unsplash.com/photos/sPmF7MNzdnU', license: 'Licence Unsplash' },
  { key: 'product-galette', author: 'Anima Visual', source: 'Unsplash', url: 'https://unsplash.com/photos/jhTzMj5aJQk', license: 'Licence Unsplash' },
  { key: 'product-chicken-tikka', author: 'Alexander Mils', source: 'Unsplash', url: 'https://unsplash.com/photos/SNLfVYmL8os', license: 'Licence Unsplash' },
  { key: 'product-royal', author: 'Bayuaji Abiyu', source: 'Unsplash', url: 'https://unsplash.com/photos/xq04aTV-LVk', license: 'Licence Unsplash' },
  { key: 'product-blinde', author: 'Bayuaji Abiyu', source: 'Unsplash', url: 'https://unsplash.com/photos/_JIRNUeDGy8', license: 'Licence Unsplash' },
  { key: 'product-tacos', author: 'Omar Hakeem', source: 'Unsplash', url: 'https://unsplash.com/photos/APbsVh624WA', license: 'Licence Unsplash' },
  { key: 'product-bowl', author: 'Rimsha Noor', source: 'Unsplash', url: 'https://unsplash.com/photos/1RE1sDbR4Go', license: 'Licence Unsplash' },
  { key: 'product-burger', author: 'amirali mirhashemian', source: 'Unsplash', url: 'https://unsplash.com/photos/MNHQqLNEvow', license: 'Licence Unsplash' },
  { key: 'product-double-burger', author: 'amirali mirhashemian', source: 'Unsplash', url: 'https://unsplash.com/photos/jh5XyK4Rr3Y', license: 'Licence Unsplash' },
  { key: 'product-triple-burger', author: 'Sol Ingrao', source: 'Unsplash', url: 'https://unsplash.com/photos/j1NmLRIlJGI', license: 'Licence Unsplash' },
  { key: 'product-chicken-burger', author: 'David Foodphototasty', source: 'Unsplash', url: 'https://unsplash.com/photos/VFVnZfogE7s', license: 'Licence Unsplash' },
  { key: 'product-double-chicken', author: 'Sultan Abdulrazzaq', source: 'Unsplash', url: 'https://unsplash.com/photos/UDYjeBwFZf8', license: 'Licence Unsplash' },
  { key: 'product-nuggets', author: 'Stu Moffat', source: 'Unsplash', url: 'https://unsplash.com/photos/xTJSYt4doqo', license: 'Licence Unsplash' },
  { key: 'product-nuggets-10', author: 'Lee Milo', source: 'Unsplash', url: 'https://unsplash.com/photos/bG8sQGD8Bi8', license: 'Licence Unsplash' },
  { key: 'product-menu-enfant', author: 'Tyson', source: 'Unsplash', url: 'https://unsplash.com/photos/UmkODKl4E1M', license: 'Licence Unsplash' },
  { key: 'product-frites', author: 'Mitchell Luo', source: 'Unsplash', url: 'https://unsplash.com/photos/ChXHveqrb28', license: 'Licence Unsplash' },
  { key: 'product-grande-frite', author: 'Cindy Bartillon', source: 'Unsplash', url: 'https://unsplash.com/photos/-doMDpFipzQ', license: 'Licence Unsplash' },
  { key: 'extra-oeuf', author: 'Jonathan Cooper', source: 'Unsplash', url: 'https://unsplash.com/photos/Bl2PZj_TgpE', license: 'Licence Unsplash' },
  { key: 'extra-galette-pdt', author: 'tommao wang', source: 'Unsplash', url: 'https://unsplash.com/photos/Dut3u5zJ0vE', license: 'Licence Unsplash' },
];
