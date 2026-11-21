import type { Metadata } from 'next';
import { LocationSection } from '@/components/LocationSection';

export const metadata: Metadata = { title: 'Nous trouver', description: 'Kebab Grill House 63 : 40 rue de Marseille, 69007 Lyon. Itinéraire, téléphone 04 87 78 10 94.' };

export default function Page() {
  return <div className="pt-16"><LocationSection /></div>;
}
