'use client';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { BASE_PATH } from '@/lib/asset';
import { useT } from '@/store/lang';

/** Génère des QR codes imprimables pour les tables (pointent vers /table/?t=N). Tout est calculé dans le navigateur. */
export function QrGenerator() {
  const { t } = useT();
  const [count, setCount] = useState(8);
  const [codes, setCodes] = useState<{ n: number; url: string; svg: string }[]>([]);

  useEffect(() => {
    const origin = window.location.origin + BASE_PATH;
    Promise.all(Array.from({ length: count }).map(async (_, i) => {
      const url = `${origin}/table/?t=${i + 1}`;
      const svg = await QRCode.toString(url, { type: 'svg', margin: 1, color: { dark: '#151515', light: '#f4ede2' }, errorCorrectionLevel: 'M' });
      return { n: i + 1, url, svg };
    })).then(setCodes);
  }, [count]);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-28 pt-28 lg:px-8">
      <div className="print:hidden">
        <DemoBadge label={{ fr: 'Outil restaurant · démo', en: 'Restaurant tool · demo' }} />
        <h1 className="display-xl mt-4 text-6xl">{t({ fr: 'QR codes de table', en: 'Table QR codes' })}</h1>
        <p className="mt-3 max-w-xl text-bone/65">{t({ fr: 'Chaque QR code ouvre la carte, le configurateur et le panier avec le numéro de table pré-rempli.', en: 'Each QR code opens the menu, builder and cart with the table number pre-filled.' })}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-3 text-sm">{t({ fr: 'Nombre de tables', en: 'Number of tables' })}
            <input type="number" min={1} max={60} value={count} onChange={(e) => setCount(Math.max(1, Math.min(60, Number(e.target.value) || 1)))}
              className="w-20 border border-white/15 bg-transparent px-3 py-2" />
          </label>
          <button type="button" onClick={() => window.print()} className="btn-ghost">{t({ fr: 'Imprimer', en: 'Print' })}</button>
        </div>
      </div>
      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-3">
        {codes.map((c) => (
          <li key={c.n} className="flex flex-col items-center border border-white/10 bg-[#1a1a1a] p-5 text-center print:break-inside-avoid">
            <Logo compact />
            <div className="mt-3 w-full max-w-[170px] [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: c.svg }} />
            <div className="mt-3 font-display text-2xl uppercase">{t({ fr: 'Table', en: 'Table' })} {c.n}</div>
            <a href={c.url} className="mt-1 break-all text-[10px] text-bone/40 hover:text-crust">{c.url.replace(/^https?:\/\//, '')}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
