import type { Metadata } from 'next';
import { Checkout } from './Checkout';

export const metadata: Metadata = { title: 'Validation de la commande', robots: { index: false } };

export default function Page() { return <Checkout />; }
