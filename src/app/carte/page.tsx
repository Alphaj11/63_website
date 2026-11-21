import type { Metadata } from 'next';
import { MenuExplorer } from '@/components/MenuExplorer';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = { title: 'La carte', description: 'La carte de Grill House 63, kebab et tacos à Lyon 7 : kebab, tacos, kumpir, assiettes, accompagnements et boissons.' };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow={{ fr: 'La carte', en: 'Menu' }} title={{ fr: 'Choisissez.', en: 'Choose.' }} accent={{ fr: 'Composez.', en: 'Build.' }}
        intro={{ fr: 'Quatre signatures à composer pas à pas, et de quoi les accompagner.', en: 'Four signatures to build step by step, and everything to go with them.' }} />
      <section className="mx-auto max-w-7xl px-4 pb-24 lg:px-8"><MenuExplorer /></section>
    </>
  );
}
