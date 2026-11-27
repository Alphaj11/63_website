'use client';
import { useEffect, useState } from 'react';

type Status = 'loading' | 'ready' | 'error';
const cache = new Map<string, Status>();
const waiters = new Map<string, Set<(s: Status) => void>>();

function load(url: string) {
  if (cache.has(url)) return;
  cache.set(url, 'loading');
  const img = new Image();
  img.decoding = 'async';
  const done = (s: Status) => {
    cache.set(url, s);
    waiters.get(url)?.forEach((fn) => fn(s));
    waiters.delete(url);
  };
  img.onload = () => done('ready');
  img.onerror = () => done('error');
  // Un CDN qui ne répond pas ne doit pas bloquer la scène : repli vectoriel après 8 s.
  setTimeout(() => { if (cache.get(url) === 'loading') done('error'); }, 8000);
  img.src = url;
}

/** Précharge une image et indique si elle est prête. `null` = pas de photo pour cet élément. */
export function usePhoto(url: string | null): Status | null {
  const [status, setStatus] = useState<Status | null>(() => (url ? cache.get(url) ?? 'loading' : null));
  useEffect(() => {
    if (!url) { setStatus(null); return; }
    load(url);
    const current = cache.get(url)!;
    setStatus(current);
    if (current !== 'loading') return;
    const fn = (s: Status) => setStatus(s);
    if (!waiters.has(url)) waiters.set(url, new Set());
    waiters.get(url)!.add(fn);
    return () => { waiters.get(url)?.delete(fn); };
  }, [url]);
  return status;
}

/** Précharge une liste d'images sans attendre (ex. dès l'ouverture d'un configurateur). */
export function preloadPhotos(urls: string[]) {
  if (typeof window === 'undefined') return;
  urls.forEach(load);
}
