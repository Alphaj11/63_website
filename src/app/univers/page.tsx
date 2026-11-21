import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { RestaurantStory } from '@/components/RestaurantStory';

export const metadata: Metadata = { title: 'Notre univers', description: 'Grill House 63, kebab à Lyon 7 : la générosité, le grill, la préparation, l’accueil et les spécialités de la maison.' };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow={{ fr: 'Notre univers', en: 'Our world' }} title={{ fr: 'Le grill', en: 'The grill' }} accent={{ fr: 'comme signature.', en: 'as a signature.' }}
        intro={{ fr: 'Rue de Marseille, à Lyon 7. Une adresse de street food qui prend son temps là où ça compte : le feu, la viande, les sauces et l’accueil.', en: 'Rue de Marseille, Lyon 7. A street-food address that takes its time where it matters: fire, meat, sauces and hospitality.' }} />
      <RestaurantStory />
    </>
  );
}
