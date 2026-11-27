import { useEffect, useState } from 'react';

/**
 * Routage par ancre (#/commande, #/restaurant…) : fonctionne sur GitHub Pages
 * sans configuration serveur. Les ancres simples (#carte) restent des liens de section.
 */
export type Route = { page: 'home' } | { page: 'checkout' } | { page: 'order'; id: string } | { page: 'restaurant' };

function parse(hash: string): Route {
  const h = hash.replace(/^#/, '');
  if (h.startsWith('/commande/')) return { page: 'order', id: decodeURIComponent(h.slice('/commande/'.length)) };
  if (h === '/commande') return { page: 'checkout' };
  if (h === '/restaurant') return { page: 'restaurant' };
  return { page: 'home' };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash));
  useEffect(() => {
    const on = () => setRoute(parse(window.location.hash));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export const navigate = (hash: string) => {
  window.location.hash = hash;
  window.scrollTo({ top: 0 });
};

/** Défile vers une section de l'accueil, en revenant à l'accueil si besoin. */
export function goToSection(id: string) {
  const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (window.location.hash.startsWith('#/')) {
    window.location.hash = '';
    window.setTimeout(scroll, 80);
  } else scroll();
}
