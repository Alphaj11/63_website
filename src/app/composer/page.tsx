import type { Metadata } from 'next';
import { MenuExplorer } from '@/components/MenuExplorer';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = { title: 'Composer mon repas', description: 'Composez votre tacos, kebab, kumpir ou assiette et regardez-le prendre forme ingrédient par ingrédient.' };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow={{ fr: 'Composer mon repas', en: 'Build my meal' }} title={{ fr: 'Par quoi', en: 'Where do we' }} accent={{ fr: 'on commence ?', en: 'start?' }} />
      <section className="mx-auto max-w-7xl px-4 pb-24 lg:px-8"><MenuExplorer teaser /></section>
    </>
  );
}
