import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BuilderPage } from '../BuilderPage';
import { PlateBuilder } from '@/components/builders/Builders';

export const metadata: Metadata = { title: 'Composer mon assiette', description: 'Composez votre assiette : viande, salade, crudités, accompagnements, sauces et suppléments.' };

export default function Page() {
  return (
    <BuilderPage kind="assiette">
      <Suspense fallback={null}><PlateBuilder /></Suspense>
    </BuilderPage>
  );
}
