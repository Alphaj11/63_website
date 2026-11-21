import type { Metadata } from 'next';
import { QrGenerator } from './QrGenerator';

export const metadata: Metadata = { title: 'QR codes de table (démo)', robots: { index: false } };

export default function Page() { return <QrGenerator />; }
