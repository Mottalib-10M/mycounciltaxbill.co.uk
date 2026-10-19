/**
 * Mini-calculators, one per subject (RECETTE §9.3). Each one calls the tested engine of
 * `lib/engine/counciltax.ts`; none computes council tax on its own. A page sets its defaults through the
 * `props` of its ToolDef (same ids as the inputs; a council is given by its id, `{ "council": "leeds" }`).
 */
import type { MiniSpec } from './mini-types';
import { P } from './engine/params';
import * as E from './engine/counciltax';
import { formatMoney as fm } from './format';

const m = (n: number) => fm(Math.round(n), 0);
const m2 = (n: number) => fm(n, 2);
const TY = P.taxYear;
/** Councils in alphabetical order; the select value is the index in this list. */
export const COUNCIL_LIST = [...E.COUNCILS].sort((a, b) => a.name.localeCompare(b.name, 'en-GB'));
export const councilIndex = (id: string) => { const i = COUNCIL_LIST.findIndex((c) => c.id === id); if (i < 0) throw new Error(`Unknown council ${id}`); return i; };
const COUNCIL_OPTS = COUNCIL_LIST.map((c, i) => ({ value: String(i), label: c.nation === 'england' ? c.name : `${c.name} (${E.NATION_NAME[c.nation]})` }));
const optsFor = (n: E.Nation) => COUNCIL_LIST.map((c, i) => ({ c, i })).filter((x) => x.c.nation === n).map(({ c, i }) => ({ value: String(i), label: c.name }));
const BANDS9 = P.bands.wales.letters.map((l, i) => ({ value: String(i), label: `Band ${l}` }));
const BANDS8 = P.bands.england.letters.map((l, i) => ({ value: String(i), label: `Band ${l}` }));
const C = (v: Record<string, number>) => COUNCIL_LIST[Math.max(0, Math.min(COUNCIL_LIST.length - 1, Math.round(v.council)))];
const band = (c: E.Council, b: number) => Math.min(Math.round(b), E.letters(c.nation).length - 1);
const council = (def: string, label = 'Council') => ({ id: 'council', label, def: councilIndex(def), options: COUNCIL_OPTS });
const bandIn = (def = 3, nineBands = false) => ({ id: 'band', label: 'Band', def, options: nineBands ? BANDS9 : BANDS8, help: 'Band I exists only in Wales' });
const bill = (c: E.Council, b: number, o: Partial<E.BillInput> = {}) => E.bill({ council: c.id, band: band(c, b), ...o });
const YESNO = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];

const SPECS: Record<string, MiniSpec> = {
  'band-list': {
    title: `Every band in one council, ${TY}`, cta: 'Work out your own bill with discounts', ctaPage: 'home',
    inputs: [council('leeds')],
    run: (v) => { const c = C(v); const L = E.letters(c.nation);
      return { head: [`Band D in ${c.name}`, m2(c.bandD)], rows: E.bandCharges(c).map((x, i) => [`Band ${L[i]}${i === 3 ? '' : ` (${P.bands[c.nation].num[i]}/${P.bands[c.nation].den})`}`, m2(x)]),
        note: c.nation === 'scotland' ? 'Scottish Water charges are added on top of these figures.' : 'Two adults, main home, parish or community precept averaged over the council area.' }; },
  },
  spd: {
    title: `Single person discount in pounds, ${TY}`, cta: 'Full bill with every discount', ctaPage: 'home',
    inputs: [council('manchester'), bandIn(1, true)],
    run: (v) => { const c = C(v); const full = bill(c, v.band); const one = bill(c, v.band, { household: 'one' });
      return { head: ['You save a year', m(full.annual - one.annual)], rows: [['Bill for two adults', m2(full.annual)], ['Bill living alone', m2(one.annual)], ['Saving each month (10 payments)', m2((full.annual - one.annual) / 10)]],
        note: c.nation === 'scotland' ? 'In Scotland the 25 % also comes off the water and waste water charges.' : undefined }; },
  },
  'band-from-value': {
    title: 'Which band a value falls in', cta: 'See what that band costs with your discounts', ctaPage: 'home',
    inputs: [{ id: 'nation', label: 'Nation', def: 0, options: [{ value: '0', label: 'England (1991 values)' }, { value: '1', label: 'Wales (2003 values)' }, { value: '2', label: 'Scotland (1991 values)' }] },
      { id: 'value', label: 'Value on the valuation date', def: 75000, unit: '£', max: 100_000_000, help: 'What the home would have sold for then, not today' }],
    run: (v) => { const n: E.Nation = v.nation === 1 ? 'wales' : v.nation === 2 ? 'scotland' : 'england'; const b = E.bandFromValue(n, v.value); const L = E.letters(n);
      const avg = P.averages[n].bandD * E.ratio(n, b);
      return { head: ['Band', L[b]], rows: [['Value range', P.bands[n].ranges[b]], ['Share of Band D', `${P.bands[n].num[b]}/${P.bands[n].den}`], [`At the ${E.NATION_NAME[n]} average Band D`, m(avg)]] }; },
  },
  'band-lower': {
    title: 'What one band lower would save', cta: 'How to challenge a band', ctaPage: 'challenge-council-tax-band',
    inputs: [council('bristol'), bandIn(3, true), { id: 'years', label: 'Years at this address', def: 6, unit: 'yrs', max: 60, decimals: 0 }],
    run: (v) => { const c = C(v); const b = band(c, v.band); if (b === 0) return { head: ['Already the lowest band', m(0)], rows: [['Band A charge', m2(E.bandCharge(c, 0))]] };
      const now = bill(c, b), low = bill(c, b - 1); const y = now.annual - low.annual;
      return { head: ['Saving a year', m(y)], rows: [[`Band ${E.letters(c.nation)[b]}`, m2(now.annual)], [`Band ${E.letters(c.nation)[b - 1]}`, m2(low.annual)], [`Over ${Math.round(v.years)} years at ${TY} rates`, m(y * Math.round(v.years))]],
        note: 'A challenge can also move the band up. The refund covers the time you lived there, at each year’s rates.' }; },
  },
  'second-home': {
    title: `Second home council tax, ${TY}`, cta: 'Compare with an empty home or a main home', ctaPage: 'home',
    inputs: [council('cornwall'), bandIn(3, true), { id: 'premium', label: 'Premium your council charges', def: 100, unit: '%', max: 900, help: 'England up to 100 %, Wales up to 300 %' }],
    run: (v) => { const c = C(v); const main = bill(c, v.band); const sec = bill(c, v.band, { occupancy: 'second', premium: v.premium / 100 });
      return { head: ['Second home bill', m(sec.annual)], rows: [['As a main home (two adults)', m2(main.annual)], [`Premium applied (${Math.round(sec.premiumRate * 100)} %)`, m2(sec.premium)], ['Per instalment (10)', m2(sec.annual / 10)]], note: sec.premiumNote }; },
  },
  empty: {
    title: 'Empty home premium by years empty', cta: 'Full bill for any kind of home', ctaPage: 'home',
    inputs: [council('liverpool'), bandIn(2, true), { id: 'years', label: 'Empty and unfurnished for', def: 6, unit: 'yrs', max: 100, decimals: 1 }],
    run: (v) => { const c = C(v); const e = bill(c, v.band, { occupancy: 'empty', emptyYears: v.years }); const main = bill(c, v.band);
      return { head: ['Bill at the highest premium allowed', m(e.annual)], rows: [['Normal charge', m2(main.annual)], [`Premium (${Math.round(e.premiumRate * 100)} %)`, m2(e.premium)], ['Times the normal bill', `${(e.annual / main.annual).toFixed(1)} ×`]], note: e.premiumNote }; },
  },
  disabled: {
    title: 'Disabled Band Reduction in pounds', cta: 'Add a discount for who lives there', ctaPage: 'home',
    inputs: [council('leicester'), bandIn(1, true), { id: 'one', label: 'Living alone as well?', def: 0, options: YESNO }],
    run: (v) => { const h: E.Household = v.one === 1 ? 'one' : 'two'; const c = C(v); const a = bill(c, v.band, { household: h }); const b = bill(c, v.band, { household: h, disabled: true });
      return { head: ['Saving a year', m(a.annual - b.annual)], rows: [['Bill without the reduction', m2(a.annual)], ['Bill with the reduction', m2(b.annual)], ['Charged at', b.chargedRatio]] }; },
  },
  students: {
    title: 'Student house: exempt, discounted or full bill', cta: 'Work out any other household', ctaPage: 'home',
    inputs: [council('nottingham'), bandIn(1, true), { id: 'others', label: 'Adults living there who are not students', def: 1, options: [{ value: '0', label: 'None' }, { value: '1', label: 'One' }, { value: '2', label: 'Two or more' }] }],
    run: (v) => { const c = C(v); const h: E.Household = v.others === 0 ? 'exempt' : v.others === 1 ? 'one' : 'two'; const r = bill(c, v.band, { household: h }); const full = bill(c, v.band);
      return { head: [v.others === 0 ? 'Exempt: nothing to pay' : 'Bill for the household', m(r.annual)], rows: [['Full bill for the band', m2(full.annual)], ['Discount', v.others === 0 ? '100 %' : v.others === 1 ? '25 %' : 'none'], ['Paid by', v.others === 0 ? 'nobody' : 'the adults who are not students']] }; },
  },
  disregards: {
    title: 'How many adults count, and the discount', cta: 'Full bill with this household', ctaPage: 'home',
    inputs: [council('sheffield'), bandIn(1, true), { id: 'adults', label: 'Adults aged 18 or over', def: 3, max: 20, decimals: 0 }, { id: 'disregarded', label: 'Of whom disregarded', def: 2, max: 20, decimals: 0, help: 'Students, apprentices, live-in carers, severely mentally impaired' }],
    run: (v) => { const c = C(v); const counted = Math.max(0, Math.round(v.adults) - Math.round(v.disregarded)); const h: E.Household = counted >= 2 ? 'two' : counted === 1 ? 'one' : 'none'; const r = bill(c, v.band, { household: h });
      return { head: ['Bill for the year', m(r.annual)], rows: [['Adults who count', String(counted)], ['Discount', `${Math.round(r.discountRate * 100)} %`], ['Saving', m2(r.discount + r.waterDiscount)]], note: counted === 0 ? 'If everyone is a full-time student or severely mentally impaired, the home is exempt instead of 50 % off.' : undefined }; },
  },
  instalments: {
    title: '10 or 12 instalments, to the penny', cta: 'Get the yearly bill for your home', ctaPage: 'home',
    inputs: [{ id: 'annual', label: 'Bill for the year', def: 2245, unit: '£', max: 1_000_000, decimals: 2 }],
    run: (v) => { const a = E.instalmentPlan(v.annual, 10), b = E.instalmentPlan(v.annual, 12);
      return { head: ['Monthly over 12', m2(b.regular)], rows: [['10 payments: first', m2(a.first)], ['10 payments: the other nine', m2(a.regular)], ['12 payments: first', m2(b.first)], ['12 payments: the other eleven', m2(b.regular)]], note: 'Each payment after the first is rounded to the nearest pound; the first takes the difference.' }; },
  },
  move: {
    title: 'Council tax for part of the year', cta: 'Full year bill', ctaPage: 'home',
    inputs: [council('city-of-edinburgh'), bandIn(2, true), { id: 'days', label: 'Days you are liable in 2026/27', def: 120, unit: 'days', max: 365, decimals: 0, help: 'Count the day you move in, not the day you leave' }],
    run: (v) => { const c = C(v); const r = bill(c, v.band); const part = E.forDays(r.annual, v.days);
      return { head: ['Due for those days', m2(part)], rows: [['Whole year', m2(r.annual)], ['Per day', m2(r.daily)], ['Days counted', String(Math.round(Math.min(v.days, P.daysInYear)))]] }; },
  },
  increase: {
    title: `How much the bill rose for ${TY}`, cta: 'Your 2026/27 bill with discounts', ctaPage: 'home',
    inputs: [council('birmingham'), bandIn(1, true)],
    run: (v) => { const c = C(v); const b = band(c, v.band); const ch = E.change(c); const now = E.bandCharge(c, b); const prev = c.bandDPrev ? c.bandDPrev * E.ratio(c.nation, b) : 0;
      return { head: ['Rise this year', m(now - prev)], rows: [['2025/26', m2(prev)], ['2026/27', m2(now)], ['Change', ch ? `${(ch.rate * 100).toFixed(1)} %` : 'n/a']], note: 'Two adults, main home, before water charges in Scotland.' }; },
  },
  'scotland-water': {
    title: `Scottish bill with water, ${TY}`, cta: 'All the options for a Scottish home', ctaPage: 'home',
    inputs: [{ id: 'council', label: 'Scottish council', def: councilIndex('glasgow-city'), options: optsFor('scotland') }, bandIn(2), { id: 'one', label: 'One adult only?', def: 0, options: YESNO }],
    run: (v) => { const c = C(v); const r = bill(c, v.band, { household: v.one === 1 ? 'one' : 'two' });
      return { head: ['Total bill', m(r.annual)], rows: [['Council tax', m2(r.councilTax)], ['Water', m2(r.water * (1 - r.discountRate))], ['Waste water', m2(r.sewerage * (1 - r.discountRate))]] }; },
  },
  'wales-band': {
    title: `Welsh bill, bands A to I, ${TY}`, cta: 'Full Welsh bill with premiums', ctaPage: 'home',
    inputs: [{ id: 'council', label: 'Welsh council', def: councilIndex('cardiff'), options: optsFor('wales') }, bandIn(3, true), { id: 'shift', label: 'If revaluation moved you', def: 1, options: [{ value: '-1', label: 'One band down' }, { value: '0', label: 'No change' }, { value: '1', label: 'One band up' }] }],
    run: (v) => { const c = C(v); const b = band(c, v.band); const nb = Math.max(0, Math.min(8, b + Math.round(v.shift))); const a = E.bandCharge(c, b), z = E.bandCharge(c, nb);
      return { head: [`Band ${E.letters('wales')[b]} today`, m2(a)], rows: [[`Band ${E.letters('wales')[nb]} at ${TY} rates`, m2(z)], ['Difference a year', `${z >= a ? '+' : '−'}${m(Math.abs(z - a))}`]], note: 'New bands and rates for 2028 have not been published; this only moves you within today’s nine bands.' }; },
  },
  annex: {
    title: 'Annex used by family: the 50 % discount', cta: 'Bill for the main house', ctaPage: 'home',
    inputs: [council('wiltshire'), bandIn(0, true), { id: 'use', label: 'Who uses the annex', def: 0, options: [{ value: '0', label: 'A relative, as their own home' }, { value: '1', label: 'Part of the main home' }, { value: '2', label: 'A dependent relative aged 65+' }, { value: '3', label: 'Let to someone else' }] }],
    run: (v) => { const c = C(v); const full = bill(c, v.band); const u = Math.round(v.use); const due = u === 2 ? 0 : u === 3 ? full.annual : Math.round(full.annual * (1 - P.discounts.annexFamily) * 100) / 100;
      return { head: ['Annex bill for the year', m(due)], rows: [['Full charge for its band', m2(full.annual)], ['Rule', u === 2 ? 'Exempt (class W)' : u === 3 ? 'No family discount' : '50 % family annex discount'], ['In Wales or Scotland', 'local rules differ']], note: c.nation === 'england' ? undefined : 'The 50 % annex discount is an English rule; this council is outside England, so check its own policy.' }; },
  },
};

export function getSpec(kind: string): MiniSpec {
  const s = SPECS[kind];
  if (!s) throw new Error(`Unknown mini-spec: ${kind}`);
  return s;
}
export const SPEC_IDS = Object.keys(SPECS);
