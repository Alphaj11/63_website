import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectBestReviews } from '../src/services/reviews/select.ts';
import type { Review } from '../src/services/reviews/types.ts';

const r = (id: string, rating: number, text: string): Review => ({ id, authorName: id, rating, text, publishTime: '2026-01-01T00:00:00Z', source: 'google' });

test('les avis ne sont jamais modifiés et les < 4★ ne sont pas mis en avant', () => {
  const input = [r('a', 5, 'Top'), r('b', 3, 'Moyen, la viande était froide ce jour-là.'), r('c', 4, 'Viande très bien grillée, portions généreuses et accueil souriant. Les sauces sont maison et excellentes.')];
  const out = selectBestReviews(input);
  assert.deepEqual(out.map((x) => x.id), ['c', 'a']);
  assert.equal(out[0].text, input[2].text);
});

test('un 4★ détaillé passe devant un 5★ très court', () => {
  const out = selectBestReviews([r('court', 5, 'Bien'), r('detail', 4, 'La viande est excellente et généreuse, le service rapide, je recommande vivement cette adresse du 7e.')]);
  assert.equal(out[0].id, 'detail');
});

test('aucun avis inventé : liste vide en entrée = liste vide en sortie', () => {
  assert.deepEqual(selectBestReviews([]), []);
});
