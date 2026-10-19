/**
 * Engine tests (RECETTE §4, §17.4). Official references:
 * - MHCLG Table 9, 2026-27: area council tax by band, two adults, every English billing authority.
 * - Scottish Government, Council Tax by band 2026-27 (raw file in data/raw/).
 * - Highland Council, Council Tax and Scottish Water charges 2026 to 2027 (read 2026-10-19):
 *   Band D 1,633.99; Band A council tax 1,089.33, water 201.30, waste water 233.58, total 1,524.21;
 *   single occupier 1,143.15; Disabled Band Reduction 907.77 + 167.75 + 194.65 = 1,270.17, single 952.63.
 * - East Ayrshire Council 2026-27: Band D 1,717.28 + 301.95 + 350.37 = 2,369.60; Band H total 5,511.98.
 */
import { describe, it, expect } from 'vitest';
import * as E from '../src/lib/engine/counciltax';
import { P } from '../src/lib/engine/params';
import { getSpec, SPEC_IDS } from '../src/lib/mini-specs';

describe('council data', () => {
  it('has every council of the three tables', () => {
    expect(E.inNation('england')).toHaveLength(296);
    expect(E.inNation('wales')).toHaveLength(22);
    expect(E.inNation('scotland')).toHaveLength(32);
    expect(new Set(E.COUNCILS.map((c) => c.id)).size).toBe(350);
  });
  it('England: every band charge equals Table 9 to the penny', () => {
    let n = 0;
    for (const c of E.inNation('england')) {
      E.bandCharges(c).forEach((x, i) => { expect(Math.abs(x - c.bands![i]), `${c.name} band ${i}`).toBeLessThanOrEqual(0.011); n++; });
    }
    expect(n).toBe(296 * 8);
  });
  it('England: Band D is the sum of its parts', () => {
    for (const c of E.inNation('england')) {
      const p = c.parts; const s = p.council + p.parish + p.county + p.police + p.fire + p.combined;
      expect(Math.abs(s - c.bandD), c.name).toBeLessThan(0.05);
    }
  });
  it('Wales: Band D is the sum of county, community and police', () => {
    for (const c of E.inNation('wales')) { const p = c.parts; expect(Math.abs(p.council + p.parish + p.police - c.bandD), c.name).toBeLessThan(0.02); }
  });
  it('published averages and extremes', () => {
    expect(E.councilById('birmingham').bandD).toBe(2362.9);
    expect(E.councilById('cardiff').bandD).toBe(2013.18);
    expect(E.councilById('merthyr-tydfil').bandD).toBe(2593.6);
    expect(E.councilById('glasgow-city').bandD).toBe(1706);
    expect(E.councilById('city-of-edinburgh').bandD).toBe(1626.05);
  });
});

describe('band ratios', () => {
  it('Scotland Band H is 882/360 (Glasgow 4,179.70 in the Scottish table)', () => {
    expect(E.bandCharge(E.councilById('glasgow-city'), 7)).toBe(4179.7);
    expect(E.bandCharge(E.councilById('city-of-edinburgh'), 4)).toBe(2136.45);
  });
  it('Wales Band I is 21/9', () => {
    expect(E.bandCharge(E.councilById('cardiff'), 8)).toBe(Math.round(2013.18 * 21 / 9 * 100) / 100);
    expect(E.letters('wales')).toHaveLength(9);
  });
  it('band from value at the valuation date', () => {
    expect(E.bandFromValue('england', 40000)).toBe(0);
    expect(E.bandFromValue('england', 40001)).toBe(1);
    expect(E.bandFromValue('england', 320001)).toBe(7);
    expect(E.bandFromValue('wales', 424001)).toBe(8);
    expect(E.bandFromValue('scotland', 58000)).toBe(3);
    expect(E.bandFromValue('scotland', 58001)).toBe(4);
  });
});

describe('Highland Council table 2026 to 2027', () => {
  it('Band A, two adults', () => {
    const r = E.bill({ council: 'highland', band: 0 });
    expect(r.councilTax).toBe(1089.33);
    expect(r.water).toBe(201.3);
    expect(r.sewerage).toBe(233.58);
    expect(r.annual).toBe(1524.21);
  });
  it('Band A, single occupier 25 % off council tax and water', () => {
    expect(Math.abs(E.bill({ council: 'highland', band: 0, household: 'one' }).annual - 1143.15)).toBeLessThanOrEqual(0.011);
  });
  it('Disabled Band Reduction in Band A', () => {
    const r = E.bill({ council: 'highland', band: 0, disabled: true });
    expect(r.councilTax).toBe(907.77);
    expect(r.water).toBe(167.75);
    expect(r.sewerage).toBe(194.65);
    expect(r.annual).toBe(1270.17);
    expect(Math.abs(E.bill({ council: 'highland', band: 0, disabled: true, household: 'one' }).annual - 952.63)).toBeLessThanOrEqual(0.011);
  });
  it('Band H for two adults', () => {
    expect(E.bill({ council: 'highland', band: 7 }).annual).toBe(5307.92);
  });
  it('second home: premium on council tax only, water at the normal rate', () => {
    const r = E.bill({ council: 'highland', band: 0, occupancy: 'second' });
    expect(r.premiumRate).toBe(1);
    expect(r.annual).toBe(Math.round((1089.33 * 2 + 434.88) * 100) / 100);
  });
});

describe('East Ayrshire 2026-27', () => {
  it('Band D and Band H with water', () => {
    expect(E.bill({ council: 'east-ayrshire', band: 3 }).annual).toBe(2369.6);
    expect(E.bill({ council: 'east-ayrshire', band: 7 }).annual).toBe(5511.98);
  });
});

describe('England and Wales rules', () => {
  const b = (o: Partial<E.BillInput>) => E.bill({ council: 'birmingham', band: 1, ...o });
  it('single person discount and everyone disregarded', () => {
    expect(b({ household: 'one' }).annual).toBe(1378.36);
    expect(b({ household: 'one' }).discount).toBe(459.45);
    expect(b({ household: 'none' }).annual).toBe(918.9);
    expect(b({ household: 'exempt' }).annual).toBe(0);
  });
  it('Disabled Band Reduction: one band lower, 5/9 in Band A', () => {
    expect(b({ disabled: true }).annual).toBe(1575.27);
    expect(E.bill({ council: 'birmingham', band: 0, disabled: true }).annual).toBe(Math.round(2362.9 * 5 / 9 * 100) / 100);
  });
  it('England empty homes premium caps: 0, 100, 200, 300 %', () => {
    expect(b({ occupancy: 'empty', emptyYears: 0.5 }).premiumRate).toBe(0);
    expect(b({ occupancy: 'empty', emptyYears: 1 }).premiumRate).toBe(1);
    expect(b({ occupancy: 'empty', emptyYears: 5 }).premiumRate).toBe(2);
    expect(b({ occupancy: 'empty', emptyYears: 10 }).premiumRate).toBe(3);
    expect(b({ occupancy: 'empty', emptyYears: 12, premium: 5 }).premiumRate).toBe(3);
    expect(b({ occupancy: 'empty', emptyYears: 12 }).annual).toBe(Math.round(1837.81 * 4 * 100) / 100);
  });
  it('England second homes: at most 100 %', () => {
    expect(b({ occupancy: 'second', premium: 3 }).premiumRate).toBe(1);
    expect(b({ occupancy: 'second', premium: 0 }).annual).toBe(1837.81);
  });
  it('Wales premiums up to 300 %', () => {
    expect(E.bill({ council: 'gwynedd', band: 3, occupancy: 'second', premium: 1.5 }).premiumRate).toBe(1.5);
    expect(E.bill({ council: 'gwynedd', band: 3, occupancy: 'second', premium: 4 }).premiumRate).toBe(3);
  });
  it('Scotland: 100 % by default, council rate accepted', () => {
    expect(E.bill({ council: 'midlothian', band: 3, occupancy: 'second' }).premiumRate).toBe(P.premiums.scotland.default);
    expect(E.bill({ council: 'midlothian', band: 3, occupancy: 'empty', emptyYears: 3, premium: 3 }).premiumRate).toBe(3);
    expect(E.bill({ council: 'midlothian', band: 3, occupancy: 'empty', emptyYears: 0.5 }).premiumRate).toBe(0);
  });
});

describe('instalments (1992 regulations, Schedule 1)', () => {
  it('nine rounded to the pound, first takes the rest', () => {
    const p = E.instalmentPlan(1837.81, 10);
    expect(p.regular).toBe(184);
    expect(p.first).toBe(181.81);
    expect(p.first + 9 * p.regular).toBeCloseTo(1837.81, 2);
  });
  it('exact division', () => { expect(E.instalmentPlan(1200, 12)).toEqual({ first: 100, regular: 100 }); });
  it('daily charge', () => { expect(E.forDays(3650, 73)).toBe(730); expect(E.daysBetween('2026-04-01', '2027-03-31')).toBe(365); });
});

describe('mini-specs run on their defaults', () => {
  for (const id of SPEC_IDS) it(id, () => {
    const s = getSpec(id); const v = Object.fromEntries(s.inputs.map((i) => [i.id, i.def]));
    const o = s.run(v); expect(o.head[1]).toBeTruthy(); expect(o.rows.length).toBeGreaterThan(0);
  });
});
