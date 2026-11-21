import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BuilderPage } from '../BuilderPage';
import { KumpirBuilder } from '@/components/builders/Builders';

export const metadata: Metadata = { title: 'Composer mon kumpir', description: 'Composez votre kumpir : pomme de terre fondante, beurre, fromage, garnitures et sauces.' };

export default function Page() {
  return (
    <BuilderPage kind="kumpir">
      <Suspense fallback={null}><KumpirBuilder /></Suspense>
    </BuilderPage>
  );
}
