import { useState } from 'react';
import { media } from '../../data/media';

interface PhotoProps {
  /** Clé de la médiathèque (src/data/media.ts). */
  name: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Image principale au-dessus de la ligne de flottaison : chargement prioritaire. */
  priority?: boolean;
  sizes?: string;
  /** Masque la mention « photo à venir » (vignettes trop petites). */
  small?: boolean;
}

/**
 * Photo locale en AVIF / WebP avec repli JPEG, chargement différé et fondu d'apparition.
 * Si le fichier n'a pas encore été déposé, affiche un cadre neutre (jamais d'illustration).
 */
export function Photo({ name, alt, className = '', imgClassName = '', priority, sizes = '100vw', small }: PhotoProps) {
  const src = media(name);
  const [loaded, setLoaded] = useState(false);

  if (!src) {
    return (
      <div
        role="img"
        aria-label={`${alt} (photo à venir)`}
        className={`relative overflow-hidden bg-[radial-gradient(120%_90%_at_50%_100%,rgba(255,106,0,.28),rgba(17,17,17,1)_60%)] ${className}`}
      >
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.025)_0_2px,transparent_2px_14px)]" />
        {!small && <span className="absolute bottom-3 left-3 rounded-full border border-cream/15 bg-night/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/60">
          Photo à venir
        </span>}
      </div>
    );
  }

  return (
    <picture className={`block overflow-hidden bg-coal ${className}`}>
      {src.avif && <source srcSet={src.avif} type="image/avif" sizes={sizes} />}
      {src.webp && <source srcSet={src.webp} type="image/webp" sizes={sizes} />}
      <img
        src={src.fallback ?? src.webp ?? src.avif}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // eslint-disable-next-line react/no-unknown-property
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </picture>
  );
}
