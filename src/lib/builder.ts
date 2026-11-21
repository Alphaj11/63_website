import type { BuilderConfig, BuilderStep, Cents, L, Selection } from './types';

/** Maximum effectif d'une étape (peut dépendre d'une autre étape, ex. taille du tacos). */
export function stepMax(config: BuilderConfig, step: BuilderStep, sel: Selection): number {
  if (!step.maxFromStep) return step.max;
  const src = config.steps.find((s) => s.id === step.maxFromStep);
  const chosen = src?.options.find((o) => sel[src.id]?.[0] === o.id);
  return chosen?.maxMeats ?? step.max;
}

/** Bascule une option en respectant min/max. Retourne une nouvelle sélection. */
export function toggleOption(config: BuilderConfig, sel: Selection, stepId: string, optionId: string): Selection {
  const step = config.steps.find((s) => s.id === stepId);
  if (!step) return sel;
  const max = stepMax(config, step, sel);
  const current = sel[stepId] ?? [];
  let next: string[];
  if (max === 1) next = [optionId];
  else if (current.includes(optionId)) next = current.filter((id) => id !== optionId);
  else if (current.length >= max) next = [...current.slice(1), optionId];
  else next = [...current, optionId];
  const out: Selection = { ...sel, [stepId]: next };
  // Réduction de la taille : on retire les viandes en trop.
  for (const s of config.steps) {
    if (s.maxFromStep === stepId) {
      const m = stepMax(config, s, out);
      if ((out[s.id]?.length ?? 0) > m) out[s.id] = out[s.id].slice(0, m);
    }
  }
  return out;
}

export function computePrice(config: BuilderConfig, sel: Selection): Cents {
  let total = config.basePrice;
  for (const step of config.steps) {
    for (const id of sel[step.id] ?? []) total += step.options.find((o) => o.id === id)?.price ?? 0;
  }
  return total;
}

export function isStepValid(config: BuilderConfig, step: BuilderStep, sel: Selection): boolean {
  const n = sel[step.id]?.length ?? 0;
  return n >= step.min && n <= stepMax(config, step, sel);
}

export function isComplete(config: BuilderConfig, sel: Selection): boolean {
  return config.steps.every((s) => isStepValid(config, s, sel));
}

/** Détail lisible de la composition (pour le panier et le récapitulatif). */
export function describe(config: BuilderConfig, sel: Selection): { step: L; label: L; price: Cents; base: boolean }[] {
  const out: { step: L; label: L; price: Cents; base: boolean }[] = [];
  config.steps.forEach((step, i) => {
    for (const id of sel[step.id] ?? []) {
      const o = step.options.find((x) => x.id === id);
      if (o && o.visual !== 'none') out.push({ step: step.title, label: o.label, price: o.price, base: i === 0 });
    }
  });
  return out;
}

export function emptySelection(config: BuilderConfig): Selection {
  return Object.fromEntries(config.steps.map((s) => [s.id, []]));
}

/** Clés visuelles sélectionnées dans une étape, dans l'ordre. */
export function visualsOf(config: BuilderConfig, sel: Selection, stepId: string) {
  const step = config.steps.find((s) => s.id === stepId);
  if (!step) return [];
  return (sel[stepId] ?? [])
    .map((id) => step.options.find((o) => o.id === id))
    .filter((o): o is NonNullable<typeof o> => !!o && o.visual !== 'none');
}
