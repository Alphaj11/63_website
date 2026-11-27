/**
 * Optimise les photos sources (media-src/) en AVIF + WebP dans src/assets/.
 *
 *   media-src/products/product-kebab.jpg  →  src/assets/products/product-kebab.{avif,webp}
 *
 * Usage : npm run images
 * Les originaux restent dans media-src/ (non publiés), seuls les formats optimisés sont servis.
 */
import { readdir, mkdir, stat } from 'node:fs/promises';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const SRC = 'media-src';
const OUT = 'src/assets';
const WIDTH = { images: 2000, products: 1200, ingredients: 700 };

for (const folder of Object.keys(WIDTH)) {
  const dir = join(SRC, folder);
  let files = [];
  try {
    files = await readdir(dir);
  } catch {
    continue;
  }
  await mkdir(join(OUT, folder), { recursive: true });
  for (const file of files) {
    if (!/\.(jpe?g|png|webp|avif)$/i.test(file)) continue;
    const { name } = parse(file);
    const input = sharp(join(dir, file)).rotate().resize({ width: WIDTH[folder], withoutEnlargement: true });
    const avif = join(OUT, folder, `${name}.avif`);
    const webp = join(OUT, folder, `${name}.webp`);
    await input.clone().avif({ quality: 52, effort: 5 }).toFile(avif);
    await input.clone().webp({ quality: 74 }).toFile(webp);
    const [a, w] = await Promise.all([stat(avif), stat(webp)]);
    console.log(`${folder}/${name}  avif ${(a.size / 1024).toFixed(0)} Ko · webp ${(w.size / 1024).toFixed(0)} Ko`);
  }
}
