import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BuilderPage } from '../BuilderPage';
import { TacosBuilder } from '@/components/builders/Builders';

export const metadata: Metadata = { title: 'Tacos signature', description: 'Composez votre tacos : taille, viandes, frites, sauce fromagère, sauces, suppléments. Puis regardez-le passer au grill.' };

export default function Page() {
  return (
    <BuilderPage kind="tacos">
      <Suspense fallback={null}><TacosBuilder /></Suspense>
    </BuilderPage>
  );
}
