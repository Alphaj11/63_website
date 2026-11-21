import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center px-4 pt-20 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="display-xl mt-3 text-7xl">Plat introuvable</h1>
        <p className="mt-3 text-bone/60">Cette page n’est pas (ou plus) à la carte. · This page isn’t on the menu.</p>
        <Link href="/" className="btn-primary mt-8">Accueil</Link>
      </div>
    </section>
  );
}
