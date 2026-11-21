import type { Metadata } from 'next';
import { LoyaltySoon } from './LoyaltySoon';

export const metadata: Metadata = { title: 'Fidélité — Grill House Club', description: 'Le programme de fidélité Grill House Club arrive bientôt.' };

export default function Page() { return <LoyaltySoon />; }
