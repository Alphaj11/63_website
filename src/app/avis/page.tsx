import type { Metadata } from 'next';
import { GoogleReviews } from '@/components/reviews/GoogleReviews';

export const metadata: Metadata = { title: 'Nos avis', description: 'Les avis Google de Kebab Grill House 63, kebab rue de Marseille à Lyon 7.' };

export default function Page() {
  return <div className="pt-16"><GoogleReviews /></div>;
}
