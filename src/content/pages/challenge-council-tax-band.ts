import { definePage } from '../../lib/guide-types';
export default definePage({
  id: 'challenge-council-tax-band', group: 'discounts', order: 1,
  mini: { kind: 'mini:band-lower' }, related: ['home'], sources: ['gov_who_pays', 'leg_lgfa_discounts'],
  slug: 'challenge-council-tax-band', nav: 'Single person discount', card: 'test',
  title: 'Single Person Discount Council Tax 2026/27: 25 % Off', description: 'x', h1: 'Single person discount', intro: 'x',
  resume: (h) => `x ${h.m(1)}`, faqs: () => [], body: () => '<p>x</p>',
});
