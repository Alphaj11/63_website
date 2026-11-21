/** @type {import('next').NextConfig} */
// GitHub Pages sert le site sous /63_website. En local (`npm run dev`) on garde la racine.
const isPages = process.env.GITHUB_PAGES === 'true';
const basePath = isPages ? '/63_website' : (process.env.NEXT_PUBLIC_BASE_PATH ?? '');

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  reactStrictMode: true,
};

export default nextConfig;
