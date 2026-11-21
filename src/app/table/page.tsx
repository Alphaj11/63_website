import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TableWelcome } from './TableWelcome';

export const metadata: Metadata = { title: 'Bienvenue à table', robots: { index: false } };

export default function Page() {
  return <Suspense fallback={null}><TableWelcome /></Suspense>;
}
