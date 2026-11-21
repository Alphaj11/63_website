import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', 'univers/', 'carte/', 'composer/', 'composer/tacos/', 'composer/kebab/', 'composer/kumpir/', 'composer/assiette/', 'avis/', 'nous-trouver/', 'fidelite/'];
  return pages.map((p) => ({ url: `${SITE_URL}/${p}`, changeFrequency: 'weekly', priority: p === '' ? 1 : 0.7 }));
}
