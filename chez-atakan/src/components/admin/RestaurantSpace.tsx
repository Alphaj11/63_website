import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, BellOff, Bike, Check, ChefHat, Lock, Phone, Printer, RotateCcw, Store, Trash2, X } from 'lucide-react';
import type { Order, OrderStatus } from '../../lib/types';
import { NEXT_STATUS, orders, STATUS_LABEL } from '../../services/orders';
import { euros } from '../../lib/money';
import { DEMO_MODE, DEMO_STAFF_PIN } from '../../data/restaurant';
import { buildOrder, uid } from '../../lib/order';
import { readJSON, writeJSON } from '../../lib/storage';
import { Logo } from '../ui/Logo';

const ETA_CHOICES = [10, 15, 20, 30, 45];
const REFUSAL_REASONS = ['Rupture de stock', 'Hors zone de livraison', 'Trop de commandes en cours', 'Restaurant fermé'];

const COLUMNS: { id: string; title: string; statuses: OrderStatus[] }[] = [
  { id: 'new', title: 'Nouvelles', statuses: ['nouvelle'] },
  { id: 'kitchen', title: 'En cuisine', statuses: ['acceptee', 'en_preparation'] },
  { id: 'ready', title: 'Prêtes', statuses: ['prete'] },
  { id: 'done', title: 'Terminées', statuses: ['terminee', 'refusee'] },
];

/** Petit signal sonore (Web Audio, aucun fichier) à l'arrivée d'une commande. */
function beep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.18].forEach((t) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.15);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.16);
    });
  } catch {
    /* audio indisponible */
  }
}

const time = (iso: string) => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

function PinGate({ onOk }: { onOk: () => void }) {
  const [pin, setPin] = useState('');
  const [err, setErr] = useState(false);
  return (
    <div className="grid min-h-[80vh] place-items-center px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (pin === DEMO_STAFF_PIN) onOk();
          else setErr(true);
        }}
        className="panel w-full max-w-sm p-8 text-center"
      >
        <Lock className="mx-auto h-8 w-8 text-ember" />
        <h1 className="display mt-4 text-4xl">Espace restaurant</h1>
        <p className="mt-2 text-sm text-cream/65">Réservé à l’équipe Chez Atakan.</p>
        <label htmlFor="pin" className="label mt-6 text-left">
          Code d’accès
        </label>
        <input id="pin" className="field text-center text-2xl tracking-[0.5em]" inputMode="numeric" maxLength={8} value={pin} onChange={(e) => (setPin(e.target.value), setErr(false))} autoFocus aria-invalid={err} />
        {err && <p className="mt-2 text-sm text-ember-light">Code incorrect.</p>}
        <button className="btn-primary mt-5 w-full">Entrer</button>
        {DEMO_MODE && (
          <p className="mt-4 text-xs text-ash">
            Démo : code <strong className="text-cream">{DEMO_STAFF_PIN}</strong>. Ce code évite les clics accidentels, ce n’est pas une sécurité : en production, la connexion se fera côté serveur.
          </p>
        )}
      </form>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [refusing, setRefusing] = useState(false);
  const next = NEXT_STATUS[order.status];
  const update = (s: OrderStatus, extra?: Parameters<typeof orders.updateStatus>[2]) => orders.updateStatus(order.id, s, extra);
  const c = order.customer;

  return (
    <motion.article layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`print-ticket rounded-2xl border bg-night/60 p-4 ${order.status === 'nouvelle' ? 'border-ember shadow-ember' : 'border-cream/10'}`}>
      <header className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-3xl font-bold leading-none">{order.number}</p>
          <p className="mt-1 text-xs text-cream/60">
            {time(order.createdAt)} · {STATUS_LABEL[order.status]}
            {order.etaMinutes ? ` · ${order.etaMinutes} min` : ''}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${order.mode === 'livraison' ? 'bg-ember/15 text-ember-light' : 'bg-cream/10 text-cream'}`}>
          {order.mode === 'livraison' ? <Bike className="h-3.5 w-3.5" /> : <Store className="h-3.5 w-3.5" />}
          {order.mode}
        </span>
      </header>

      <ul className="mt-3 space-y-2 border-y border-cream/10 py-3 text-sm">
        {order.lines.map((l, i) => (
          <li key={i}>
            <p className="font-semibold">
              {l.quantity} × {l.label}
            </p>
            {l.details.map((d) => (
              <p key={d} className="text-xs text-cream/60">
                {d}
              </p>
            ))}
          </li>
        ))}
      </ul>

      <div className="mt-3 space-y-0.5 text-sm">
        <p className="font-semibold">{c.name}</p>
        <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1 text-ember-light">
          <Phone className="h-3.5 w-3.5" /> {c.phone}
        </a>
        {order.mode === 'livraison' && (
          <p className="text-cream/75">
            {c.address}, {c.postalCode} {c.city}
            {c.addressComplement && ` · ${c.addressComplement}`}
          </p>
        )}
        {c.instructions && <p className="text-xs italic text-cream/60">« {c.instructions} »</p>}
        <p className="pt-1 font-display text-2xl font-bold">
          {euros(order.total)}
          {order.mode === 'livraison' && order.deliveryFee === null && <span className="ml-1 text-xs font-normal text-ash">+ livraison</span>}
        </p>
        {order.refusalReason && <p className="text-xs text-ember-light">Motif : {order.refusalReason}</p>}
      </div>

      <div className="no-print mt-4 space-y-2">
        {order.status === 'nouvelle' && !refusing && (
          <>
            <p className="text-xs uppercase tracking-[0.14em] text-cream/60">Accepter avec un délai</p>
            <div className="grid grid-cols-5 gap-1.5">
              {ETA_CHOICES.map((m) => (
                <button key={m} onClick={() => update('acceptee', { etaMinutes: m })} className="min-h-11 rounded-xl bg-ember text-sm font-bold text-night hover:bg-ember-light">
                  {m}′
                </button>
              ))}
            </div>
            <button onClick={() => setRefusing(true)} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-cream/15 text-sm text-cream/80 hover:border-ember">
              <X className="h-4 w-4" /> Refuser
            </button>
          </>
        )}
        {refusing && (
          <div className="space-y-1.5">
            <p className="text-xs uppercase tracking-[0.14em] text-cream/60">Motif du refus</p>
            {REFUSAL_REASONS.map((r) => (
              <button key={r} onClick={() => update('refusee', { refusalReason: r })} className="block min-h-11 w-full rounded-xl border border-cream/15 px-3 text-left text-sm hover:border-ember">
                {r}
              </button>
            ))}
            <button onClick={() => setRefusing(false)} className="w-full py-2 text-xs text-ash">
              Annuler
            </button>
          </div>
        )}
        {next && (
          <button onClick={() => update(next)} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-ember font-semibold text-night hover:bg-ember-light">
            {next === 'en_preparation' && <ChefHat className="h-4 w-4" />}
            {next === 'prete' && <Check className="h-4 w-4" />}
            {next === 'terminee' && <Check className="h-4 w-4" />}
            {next === 'en_preparation' ? 'Lancer la préparation' : next === 'prete' ? 'Marquer prête' : order.mode === 'livraison' ? 'Marquer livrée' : 'Marquer retirée'}
          </button>
        )}
        {order.status !== 'nouvelle' && (
          <button onClick={() => window.print()} className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl text-xs text-cream/60 hover:text-cream">
            <Printer className="h-3.5 w-3.5" /> Imprimer le ticket
          </button>
        )}
      </div>
    </motion.article>
  );
}

/**
 * ESPACE RESTAURANT — réception et validation des commandes.
 *
 * En démo (passerelle locale) : affiche les commandes passées depuis CE navigateur,
 * en direct entre onglets. Avec un backend (passerelle HTTP), le même écran affichera
 * les commandes de tous les clients, sur la tablette du comptoir.
 */
export function RestaurantSpace() {
  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem('atakan:staff') === '1';
    } catch {
      return false;
    }
  });
  const [list, setList] = useState<Order[]>([]);
  const [sound, setSound] = useState(() => readJSON('atakan:staff-sound', true));
  const [tab, setTab] = useState('new');
  const known = useRef<Set<string> | null>(null);

  const refresh = useCallback(() => {
    orders.list().then((all) => {
      const fresh = all.filter((o) => o.status === 'nouvelle' && known.current && !known.current.has(o.id));
      if (fresh.length && sound) beep();
      known.current = new Set(all.map((o) => o.id));
      setList(all);
    });
  }, [sound]);

  useEffect(() => {
    if (!authed) return;
    refresh();
    return orders.subscribe(refresh);
  }, [authed, refresh]);

  useEffect(() => writeJSON('atakan:staff-sound', sound), [sound]);

  const newCount = list.filter((o) => o.status === 'nouvelle').length;
  useEffect(() => {
    document.title = newCount ? `(${newCount}) Espace restaurant · Chez Atakan` : 'Espace restaurant · Chez Atakan';
    return () => {
      document.title = 'Chez Atakan — Le goût du grill';
    };
  }, [newCount]);

  const today = useMemo(() => {
    const d = new Date().toDateString();
    const t = list.filter((o) => new Date(o.createdAt).toDateString() === d && o.status !== 'refusee');
    return { count: t.length, total: t.reduce((s, o) => s + o.total, 0) };
  }, [list]);

  const createTestOrder = async () => {
    const seq = readJSON<number>('atakan:order-seq', 0) + 1;
    writeJSON('atakan:order-seq', seq);
    await orders.submit(
      buildOrder({
        sequence: seq,
        mode: seq % 2 ? 'livraison' : 'retrait',
        deliveryFee: null,
        customer: { name: 'Client test', phone: '06 00 00 00 00', address: '10 rue de l’Exemple', postalCode: '66240', city: 'Saint-Estève', addressComplement: '', instructions: '' },
        lines: [
          { lineId: uid(), quantity: 1, config: { productId: 'tacos', asMenu: false, meats: ['poulet', 'kebab'], sauces: ['algerienne'], supplements: [] } },
          { lineId: uid(), quantity: 1, config: { productId: 'kebab', asMenu: true, meats: [], sauces: ['blanche', 'harissa'], supplements: [] } },
        ],
      }),
    );
  };

  if (!authed)
    return (
      <PinGate
        onOk={() => {
          try {
            sessionStorage.setItem('atakan:staff', '1');
          } catch {
            /* ignore */
          }
          setAuthed(true);
        }}
      />
    );

  return (
    <div className="mx-auto max-w-[1500px] px-4 pb-20 pt-6 sm:px-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo compact />
          <div>
            <h1 className="display text-3xl sm:text-4xl">Espace restaurant</h1>
            <p className="text-xs text-cream/60">
              Aujourd’hui : {today.count} commande{today.count > 1 ? 's' : ''} · {euros(today.total)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSound((s: boolean) => !s)} className="chip" aria-pressed={sound}>
            {sound ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />} Son {sound ? 'activé' : 'coupé'}
          </button>
          {DEMO_MODE && (
            <>
              <button onClick={createTestOrder} className="chip">
                <RotateCcw className="h-4 w-4" /> Commande test
              </button>
              <button onClick={() => orders.clear?.()} className="chip">
                <Trash2 className="h-4 w-4" /> Vider la démo
              </button>
            </>
          )}
        </div>
      </div>

      {DEMO_MODE && (
        <div className="no-print mt-5 rounded-2xl border border-ember/40 bg-ember/10 p-4 text-sm text-cream/85">
          <strong>Démonstration sans serveur.</strong> Cet écran affiche uniquement les commandes passées depuis ce navigateur (elles arrivent en direct si le site est ouvert dans un autre onglet). Pour recevoir les commandes de vrais clients sur la tablette du restaurant, il faudra brancher un backend : l’écran est déjà prêt pour ça.
        </div>
      )}

      {/* Onglets mobiles */}
      <div className="no-print mt-6 flex gap-1 overflow-x-auto lg:hidden" role="tablist">
        {COLUMNS.map((col) => {
          const n = list.filter((o) => col.statuses.includes(o.status)).length;
          return (
            <button key={col.id} role="tab" aria-selected={tab === col.id} onClick={() => setTab(col.id)} className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold ${tab === col.id ? 'bg-ember text-night' : 'bg-cream/5 text-cream/70'}`}>
              {col.title} ({n})
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        {COLUMNS.map((col) => {
          const items = list.filter((o) => col.statuses.includes(o.status));
          return (
            <section key={col.id} className={`${tab === col.id ? 'block' : 'hidden'} rounded-3xl bg-coal/70 p-3 lg:block`} aria-label={col.title}>
              <h2 className="no-print mb-3 flex items-center justify-between px-1 font-display text-2xl font-bold uppercase">
                {col.title}
                <span className={`grid h-7 min-w-7 place-items-center rounded-full px-1 text-sm ${col.id === 'new' && items.length ? 'bg-ember text-night' : 'bg-cream/10'}`}>{items.length}</span>
              </h2>
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {items.map((o) => (
                    <OrderCard key={o.id} order={o} />
                  ))}
                </AnimatePresence>
                {items.length === 0 && <p className="px-1 py-6 text-center text-sm text-cream/40">Aucune commande</p>}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
