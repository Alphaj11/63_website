import { useState } from 'react';
import { Clock, MapPin, Navigation, Phone } from 'lucide-react';
import { Reveal } from './ui/Reveal';
import { ToConfirm } from './ui/DemoBadge';
import { InstagramIcon } from './ui/InstagramIcon';
import { hoursConfirmed, openingHours, restaurant } from '../data/restaurant';

/** Index du jour : 0 = lundi. */
const todayIndex = () => (new Date().getDay() + 6) % 7;

function openNow(): boolean {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  return openingHours[todayIndex()].slots.some(([a, b]) => {
    const [ah, am] = a.split(':').map(Number);
    const [bh, bm] = b.split(':').map(Number);
    return mins >= ah * 60 + am && mins < bh * 60 + bm;
  });
}

export function Location() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const today = todayIndex();
  const open = openNow();
  const a = restaurant.address;

  return (
    <section id="infos" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">Infos pratiques</p>
          <h2 className="display mt-4 text-6xl sm:text-8xl">
            Viens <span className="text-ember">nous voir</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-5">
          <div className="panel flex flex-col p-6 sm:p-8 lg:col-span-2">
            <p className="display text-4xl">Chez Atakan</p>
            <address className="mt-4 flex gap-3 not-italic text-cream/85">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-ember" aria-hidden />
              <span>
                {a.street}
                <br />
                {a.postalCode} {a.city}
                <br />
                {a.country}
              </span>
            </address>
            <p className="mt-3 flex gap-3 text-cream/85">
              <Phone className="h-5 w-5 shrink-0 text-ember" aria-hidden /> {restaurant.phone.display}
            </p>
            <p className="mt-3 flex gap-3 text-cream/85">
              <InstagramIcon className="h-5 w-5 shrink-0 text-ember" /> {restaurant.instagram.handle}
            </p>

            <div className="mt-8 grid gap-2 sm:grid-cols-2">
              <a href={`tel:${restaurant.phone.e164}`} className="btn-primary">
                <Phone className="h-4 w-4" /> Appeler
              </a>
              <a href={restaurant.maps.directions} target="_blank" rel="noreferrer" className="btn-ghost">
                <Navigation className="h-4 w-4" /> Itinéraire
              </a>
              <a href={restaurant.instagram.url} target="_blank" rel="noreferrer" className="btn-ghost">
                <InstagramIcon className="h-4 w-4" /> Instagram
              </a>
              <a href={restaurant.maps.url} target="_blank" rel="noreferrer" className="btn-ghost">
                <MapPin className="h-4 w-4" /> Google Maps
              </a>
            </div>
          </div>

          <div className="panel p-6 sm:p-8 lg:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="display flex items-center gap-3 text-4xl">
                <Clock className="h-7 w-7 text-ember" aria-hidden /> Horaires
              </h3>
              {hoursConfirmed ? (
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${open ? 'bg-ember text-night' : 'bg-cream/10 text-cream/70'}`}>
                  {open ? 'Ouvert maintenant' : 'Fermé actuellement'}
                </span>
              ) : (
                <ToConfirm>Horaires à confirmer par le restaurant</ToConfirm>
              )}
            </div>
            <table className="mt-6 w-full text-left">
              <caption className="sr-only">Horaires d’ouverture</caption>
              <tbody>
                {openingHours.map((d, i) => (
                  <tr key={d.day} className={`border-b border-cream/10 ${i === today ? 'text-ember-light' : 'text-cream/80'}`}>
                    <th scope="row" className="py-3 font-medium">
                      {d.day}
                      {i === today && <span className="ml-2 text-xs uppercase tracking-[0.14em]">aujourd’hui</span>}
                    </th>
                    <td className="py-3 text-right tabular-nums">{d.slots.length ? d.slots.map(([o, c]) => `${o.replace(':', 'h')} – ${c.replace(':', 'h')}`).join('  ·  ') : 'Fermé'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-cream/10 lg:col-span-5">
            {mapLoaded ? (
              <iframe title="Carte : Chez Atakan, Saint-Estève" src={restaurant.maps.embed} className="h-[360px] w-full grayscale-[.4] invert-[.9] hue-rotate-180" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <button onClick={() => setMapLoaded(true)} className="grid h-[260px] w-full place-items-center bg-[radial-gradient(60%_80%_at_50%_50%,rgba(255,106,0,.18),#111)] text-center">
                <span>
                  <MapPin className="mx-auto h-8 w-8 text-ember" />
                  <span className="mt-3 block font-display text-2xl font-bold uppercase">Afficher la carte interactive</span>
                  <span className="mt-1 block text-xs text-ash">Chargée depuis Google Maps uniquement après ce clic.</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
