import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computePrice, isComplete, toggleOption, emptySelection, stepMax } from '../src/lib/builder.ts';
import type { BuilderConfig } from '../src/lib/types.ts';

const cfg: BuilderConfig = {
  kind: 'tacos', name: { fr: 'T', en: 'T' }, tagline: { fr: '', en: '' }, basePrice: 0, preview: {},
  steps: [
    { id: 'taille', title: { fr: '', en: '' }, min: 1, max: 1, options: [
      { id: 'm', label: { fr: 'M', en: 'M' }, price: 750, visual: 'size', maxMeats: 1 },
      { id: 'xl', label: { fr: 'XL', en: 'XL' }, price: 1250, visual: 'size', maxMeats: 3 },
    ] },
    { id: 'viandes', title: { fr: '', en: '' }, min: 1, max: 3, maxFromStep: 'taille', options: [
      { id: 'a', label: { fr: 'A', en: 'A' }, price: 0, visual: 'doner' },
      { id: 'b', label: { fr: 'B', en: 'B' }, price: 0, visual: 'chicken' },
      { id: 'c', label: { fr: 'C', en: 'C' }, price: 0, visual: 'merguez' },
    ] },
    { id: 'sup', title: { fr: '', en: '' }, min: 0, max: 2, options: [
      { id: 'x', label: { fr: 'X', en: 'X' }, price: 100, visual: 'cheddar' },
      { id: 'y', label: { fr: 'Y', en: 'Y' }, price: 80, visual: 'egg' },
    ] },
  ],
};

test('le prix suit la taille et les suppléments', () => {
  let s = emptySelection(cfg);
  assert.equal(computePrice(cfg, s), 0);
  s = toggleOption(cfg, s, 'taille', 'xl');
  assert.equal(computePrice(cfg, s), 1250);
  s = toggleOption(cfg, s, 'sup', 'x');
  s = toggleOption(cfg, s, 'sup', 'y');
  assert.equal(computePrice(cfg, s), 1430);
  s = toggleOption(cfg, s, 'sup', 'x'); // retrait
  assert.equal(computePrice(cfg, s), 1330);
});

test('le nombre de viandes dépend de la taille et se réduit si la taille baisse', () => {
  let s = toggleOption(cfg, emptySelection(cfg), 'taille', 'xl');
  for (const id of ['a', 'b', 'c']) s = toggleOption(cfg, s, 'viandes', id);
  assert.equal(s.viandes.length, 3);
  s = toggleOption(cfg, s, 'taille', 'm');
  assert.equal(stepMax(cfg, cfg.steps[1], s), 1);
  assert.deepEqual(s.viandes, ['a']);
  s = toggleOption(cfg, s, 'viandes', 'b'); // remplace (max 1)
  assert.deepEqual(s.viandes, ['b']);
});

test('la composition est complète seulement avec les étapes obligatoires', () => {
  let s = emptySelection(cfg);
  assert.equal(isComplete(cfg, s), false);
  s = toggleOption(cfg, s, 'taille', 'm');
  assert.equal(isComplete(cfg, s), false);
  s = toggleOption(cfg, s, 'viandes', 'a');
  assert.equal(isComplete(cfg, s), true);
});
