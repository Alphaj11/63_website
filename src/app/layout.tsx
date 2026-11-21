import '@fontsource/anton/400.css';
import '@fontsource-variable/fraunces/index.css';
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource-variable/manrope/index.css';
import './globals.css';
import type { Metadata, Viewport } from 'next';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { StoreHydrator } from '@/components/StoreHydrator';
import { restaurant } from '@/data/restaurant';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL + '/'),
  title: {
    default: 'Grill House 63 — Kebab Lyon 7, rue de Marseille | Kebab, tacos, kumpir',
    template: '%s | Grill House 63 · Kebab Lyon 7',
  },
  description:
    'Kebab Grill House 63, restaurant kebab à Lyon 7 : 40 rue de Marseille, 69007 Lyon. Kebab, tacos, kumpir et assiettes grillées à composer en ligne. Tél. 04 87 78 10 94.',
  keywords: ['kebab Lyon 7', 'restaurant kebab Lyon', 'tacos Lyon 7', 'kebab rue de Marseille', 'kumpir Lyon', 'Grill House 63'],
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: ['en_GB'],
    siteName: 'Grill House 63',
    title: 'Grill House 63 — Enter the Grill Experience',
    description: 'Le goût du grill. L’expérience en plus. Kebab, tacos et kumpir au 40 rue de Marseille, Lyon 7.',
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = { themeColor: '#151515', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

/** Données structurées : uniquement des informations vérifiées (pas d'horaires, de note ni de prix tant qu'ils ne sont pas validés). */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: restaurant.name,
  url: SITE_URL,
  telephone: restaurant.phone.e164,
  servesCuisine: ['Kebab', 'Tacos', 'Turkish', 'Street food'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: restaurant.address.street,
    postalCode: restaurant.address.postalCode,
    addressLocality: restaurant.address.city,
    addressCountry: 'FR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <StoreHydrator />
        <Navigation />
        <main id="contenu">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
