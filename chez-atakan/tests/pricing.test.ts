import { describe, expect, it } from 'vitest';
import { unitPrice, lineLabel, validate, sameConfig } from '../src/lib/pricing';
import { products } from '../src/data/products';
import { buildOrder, whatsappMessage } from '../src/lib/order';

const cfg = (productId: string, o: Partial<{ asMenu: boolean; meats: string[]; sauces: string[]; supplements: string[] }> = {}) => ({
  productId,
  asMenu: false,
  meats: [],
  sauces: [],
  supplements: [],
  ...o,
});

describe('prix de la carte', () => {
  it('sandwichs seul / menu', () => {
    expect(unitPrice(cfg('kebab'))).toBe(650);
    expect(unitPrice(cfg('kebab', { asMenu: true }))).toBe(950);
    expect(unitPrice(cfg('big', { asMenu: true }))).toBe(1350);
    expect(unitPrice(cfg('triple-burger'))).toBe(990);
  });
  it('tacos selon le nombre de viandes', () => {
    expect(unitPrice(cfg('tacos', { meats: ['poulet'] }))).toBe(650);
    expect(unitPrice(cfg('tacos', { meats: ['poulet', 'kebab'] }))).toBe(850);
    expect(unitPrice(cfg('tacos', { meats: ['poulet', 'kebab', 'nuggets'] }))).toBe(1050);
  });
  it('bowls 1 ou 2 viandes', () => {
    expect(unitPrice(cfg('bowl', { meats: ['steak'] }))).toBe(850);
    expect(unitPrice(cfg('bowl', { meats: ['steak', 'tenders'] }))).toBe(1050);
  });
  it('suppléments à 1 €, uniquement sur les produits concernés', () => {
    expect(unitPrice(cfg('kebab', { supplements: ['oeuf'] }))).toBe(750);
    expect(unitPrice(cfg('kebab', { asMenu: true, supplements: ['oeuf', 'galette-pdt'] }))).toBe(1150);
    expect(unitPrice(cfg('bowl', { meats: ['steak'], supplements: ['oeuf'] }))).toBe(850);
  });
  it('accompagnements et menu enfant', () => {
    expect(unitPrice(cfg('petite-frite'))).toBe(250);
    expect(unitPrice(cfg('grande-frite'))).toBe(350);
    expect(unitPrice(cfg('nuggets-10'))).toBe(900);
    expect(unitPrice(cfg('menu-enfant'))).toBe(600);
  });
  it('chaque produit a un prix et une photo', () => {
    for (const p of products) {
      expect(p.price ?? p.pricesByMeatCount?.[0]).toBeGreaterThan(0);
      expect(p.image).toBeTruthy();
    }
  });
});

describe('configurateur', () => {
  it('exige le bon nombre de viandes', () => {
    expect(validate(cfg('tacos', { meats: ['poulet'] }), 2)).toMatch(/encore 1/);
    expect(validate(cfg('tacos', { meats: ['poulet', 'kebab'] }), 2)).toBeNull();
  });
  it('libellés', () => {
    expect(lineLabel(cfg('tacos', { meats: ['poulet', 'kebab'] }))).toBe('French Tacos 2 viandes');
    expect(lineLabel(cfg('kebab', { asMenu: true }))).toBe('Kebab · Menu');
  });
  it('fusionne les configurations identiques (ordre des sauces indifférent)', () => {
    expect(sameConfig(cfg('kebab', { sauces: ['blanche', 'harissa'] }), cfg('kebab', { sauces: ['harissa', 'blanche'] }))).toBe(true);
    expect(sameConfig(cfg('kebab'), cfg('kebab', { asMenu: true }))).toBe(false);
  });
});

describe('commande', () => {
  it('calcule les totaux et le message WhatsApp', () => {
    const order = buildOrder({
      sequence: 7,
      mode: 'livraison',
      deliveryFee: null,
      customer: { name: 'Test', phone: '0600000000', address: '1 rue', postalCode: '66240', city: 'Saint-Estève', addressComplement: '', instructions: '' },
      lines: [
        { lineId: 'a', quantity: 2, config: cfg('tacos', { meats: ['poulet', 'kebab'], sauces: ['algerienne'] }) },
        { lineId: 'b', quantity: 1, config: cfg('grande-frite') },
      ],
    });
    expect(order.number).toBe('A-007');
    expect(order.subtotal).toBe(2050);
    expect(order.total).toBe(2050);
    expect(order.status).toBe('nouvelle');
    const msg = whatsappMessage(order);
    expect(msg).toContain('Livraison : à confirmer');
    expect(msg).toContain('Sauces : Algérienne');
  });
});
