import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChefHat, Clock, MessageCircle, PackageCheck, Store, XCircle } from 'lucide-react';
import type { Order, OrderStatus as Status } from '../lib/types';
import { orders, STATUS_LABEL } from '../services/orders';
import { euros } from '../lib/money';
import { navigate } from '../hooks/useRoute';
import { restaurant } from '../data/restaurant';
import { whatsappLink, whatsappMessage } from '../lib/order';
import { FlameMark } from './ui/Logo';

const TIMELINE: { status: Status; label: string; icon: typeof Check }[] = [
  { status: 'nouvelle', label: 'Reçue', icon: Clock },
  { status: 'acceptee', label: 'Acceptée', icon: Check },
  { status: 'en_preparation', label: 'Au grill', icon: ChefHat },
  { status: 'prete', label: 'Prête', icon: PackageCheck },
];
const ORDER: Status[] = ['nouvelle', 'acceptee', 'en_preparation', 'prete', 'terminee'];

/** Écran de confirmation + suivi en direct (mis à jour par l'espace restaurant). */
export function OrderStatus({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    const load = () => orders.get(id).then(setOrder);
    load();
    return orders.subscribe(load);
  }, [id]);

  if (order === undefined) return <div className="min-h-[70vh]" />;
  if (order === null)
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-4 text-center">
        <div>
          <p className="display text-5xl">Commande introuvable</p>
          <p className="mt-3 text-cream/65">Elle a peut-être été effacée de ce navigateur.</p>
          <button onClick={() => navigate('')} className="btn-primary mt-8">
            Retour à l’accueil
          </button>
        </div>
      </div>
    );

  const reached = ORDER.indexOf(order.status);
  const refused = order.status === 'refusee';

  return (
    <div className="relative mx-auto max-w-3xl overflow-hidden px-4 pb-32 pt-10 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(255,106,0,.3),transparent)]" aria-hidden />

      <div className="relative text-center">
        <motion.div initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }} className="relative mx-auto grid h-28 w-28 place-items-center">
          <motion.span className="absolute inset-0 rounded-full border-2 border-ember" animate={{ scale: [1, 1.35], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} />
          <span className="grid h-24 w-24 place-items-center rounded-full bg-ember/15 ring-1 ring-ember/50">
            {refused ? <XCircle className="h-12 w-12 text-ember" /> : <FlameMark className="h-12 w-12" />}
          </span>
        </motion.div>

        {order.demo && (
          <p className="mx-auto mt-6 inline-block rounded-full bg-ember px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-night">
            Commande de démonstration
          </p>
        )}
        <h1 className="display mt-4 text-5xl sm:text-7xl">{refused ? 'Commande refusée' : order.demo ? 'C’est dans la boîte (démo)' : 'Commande envoyée'}</h1>
        <p className="mt-3 text-lg text-cream/75">
          Commande <strong className="text-cream">{order.number}</strong> · {order.mode === 'livraison' ? 'Livraison' : 'Retrait sur place'} · {euros(order.total)}
        </p>
        {order.demo && (
          <p className="mx-auto mt-4 max-w-xl text-sm text-cream/65">
            Rien n’a été transmis au restaurant et aucun paiement n’a été effectué. Cette commande existe uniquement dans ce navigateur, pour montrer le parcours complet.
          </p>
        )}
      </div>

      {/* Suivi */}
      <div className="panel relative mt-10 p-6">
        <div className="flex items-center justify-between">
          <h2 className="display text-3xl">Suivi</h2>
          <span className="text-sm text-cream/60">{STATUS_LABEL[order.status]}</span>
        </div>
        {refused ? (
          <p className="mt-4 text-cream/80">Le restaurant n’a pas pu accepter cette commande{order.refusalReason ? ` : ${order.refusalReason}` : '.'}</p>
        ) : (
          <ol className="mt-6 grid grid-cols-4 gap-2">
            {TIMELINE.map((t, i) => {
              const done = reached >= i;
              const Icon = t.icon;
              return (
                <li key={t.status} className="flex flex-col items-center text-center">
                  <motion.span animate={{ backgroundColor: done ? '#FF6A00' : 'rgba(245,240,232,.08)', color: done ? '#080808' : 'rgba(245,240,232,.5)' }} className="grid h-12 w-12 place-items-center rounded-full">
                    <Icon className="h-5 w-5" />
                  </motion.span>
                  <span className={`mt-2 text-xs uppercase tracking-[0.12em] ${done ? 'text-cream' : 'text-cream/45'}`}>{t.label}</span>
                </li>
              );
            })}
          </ol>
        )}
        <AnimatePresence>
          {order.etaMinutes && !refused && order.status !== 'terminee' && (
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-xl bg-ember/10 p-3 text-center text-sm">
              Délai annoncé par le restaurant : <strong>{order.etaMinutes} min</strong>
            </motion.p>
          )}
        </AnimatePresence>
        {order.demo && order.status === 'nouvelle' && (
          <p className="mt-6 text-center text-sm text-cream/60">
            Pour voir la suite, ouvre l’
            <a href="#/restaurant" target="_blank" rel="noreferrer" className="text-ember-light underline">
              espace restaurant
            </a>{' '}
            dans un nouvel onglet et accepte la commande : ce suivi se met à jour en direct.
          </p>
        )}
      </div>

      {/* Détail */}
      <div className="panel mt-5 p-6">
        <h2 className="display text-3xl">Détail</h2>
        <ul className="mt-4 divide-y divide-cream/10">
          {order.lines.map((l, i) => (
            <li key={i} className="py-3">
              <div className="flex justify-between gap-3">
                <span className="font-semibold">
                  {l.quantity} × {l.label}
                </span>
                <span>{euros(l.total)}</span>
              </div>
              <ul className="text-xs text-cream/55">
                {l.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-cream/10 pt-3 font-semibold">
          <span>Total {order.mode === 'livraison' && order.deliveryFee === null ? '(hors livraison)' : ''}</span>
          <span className="text-ember-light">{euros(order.total)}</span>
        </div>
      </div>

      {/* WhatsApp : seulement si le restaurant a validé la fonctionnalité */}
      <div className="panel mt-5 p-6">
        <h2 className="display flex items-center gap-2 text-3xl">
          <MessageCircle className="h-6 w-6 text-ember" /> WhatsApp
        </h2>
        {restaurant.whatsapp.enabled && !order.demo ? (
          <>
            <p className="mt-2 text-sm text-cream/70">Envoie ce récapitulatif au restaurant : le message s’ouvre dans WhatsApp, c’est toi qui l’envoies.</p>
            <a href={whatsappLink(order)} target="_blank" rel="noreferrer" className="btn-primary mt-4">
              Ouvrir WhatsApp
            </a>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-cream/70">
              L’envoi du récapitulatif par WhatsApp est prêt, mais désactivé tant que le restaurant ne l’a pas validé. Aperçu du message qui serait préparé :
            </p>
            <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-night p-4 text-xs text-cream/75">{whatsappMessage(order)}</pre>
          </>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button onClick={() => navigate('')} className="btn-ghost">
          <Store className="h-4 w-4" /> Retour à l’accueil
        </button>
        <a href={`tel:${restaurant.phone.e164}`} className="btn-primary">
          Appeler le restaurant
        </a>
      </div>
    </div>
  );
}
