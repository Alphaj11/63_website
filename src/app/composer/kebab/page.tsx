import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BuilderPage } from '../BuilderPage';
import { KebabBuilder } from '@/components/builders/Builders';

export const metadata: Metadata = { title: 'Composer mon kebab', description: 'Composez votre kebab couche par couche : pain, viande, crudités, sauces et suppléments.' };

export default function Page() {
  return (
    <BuilderPage kind="kebab">
      <Suspense fallback={null}><KebabBuilder /></Suspense>
    </BuilderPage>
  );
}
