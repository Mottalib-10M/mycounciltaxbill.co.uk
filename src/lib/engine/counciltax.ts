/**
 * Council tax engine, 2026/27. Pure functions; every figure comes from params-2026.json or from
 * councils-2026.json (official tables). Tested in tests/engine.test.ts against the official band
 * tables and the Highland Council bill examples.
 *
 * Order of a bill (Local Government Finance Act 1992, s.5, s.11, s.11B; Reductions for Disabilities
 * Regulations 1992): the band charge (Band D x ratio of the band, one band lower when the Disabled
 * Band Reduction applies), then the discount for who lives there or the premium for a second or
 * long-term empty home, then, in Scotland, Scottish Water's water and waste water charges.
 */
import { P } from './params';
import DATA from '../../data/councils-2026.json';

export type Nation = 'england' | 'wales' | 'scotland';
export interface Council {
  id: string; name: string; nation: Nation; ons: string | null; region: string; cls: string; county: string | null;
  bandD: number; bandDPrev: number | null; bands: number[] | null;
  parts: { council: number; parish: number; county: number; police: number; fire: number; combined: number; asc: number | null };
  parishes: number | null;
}
export const COUNCILS = DATA.councils as Council[];
export const councilById = (id: string): Council => {
  const c = COUNCILS.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown council: ${id}`);
  return c;
};
export const NATIONS: Nation[] = ['england', 'wales', 'scotland'];
export const NATION_NAME: Record<Nation, string> = { england: 'England', wales: 'Wales', scotland: 'Scotland' };

const r2 = (x: number) => Math.round(x * 100) / 100;
export const letters = (n: Nation) => P.bands[n].letters;
/** Ratio of a band to Band D: 6/9 for A in England, 240/360 in Scotland, 21/9 for I in Wales. */
export const ratio = (n: Nation, band: number) => P.bands[n].num[band] / P.bands[n].den;
/** Ratio charged when the Disabled Band Reduction applies: the band below, or 5/9 of D for Band A. */
export function disabledRatio(n: Nation, band: number) {
  if (band > 0) return ratio(n, band - 1);
  return ratio(n, 0) * 5 / 6; // 6/9 -> 5/9 ; 240/360 -> 200/360
}
/** Charge for a band in a council, two adults, main home, rounded to the penny as councils publish it. */
export const bandCharge = (c: Council, band: number) => r2(c.bandD * ratio(c.nation, band));
export const bandCharges = (c: Council) => letters(c.nation).map((_, i) => bandCharge(c, i));

/** Scottish Water's 2026/27 charges for a band, the same in every council area. */
export function scottishWater(band: number, disabled = false) {
  const W = P.scottishWater;
  if (!disabled) return { water: W.water[band], sewerage: W.sewerage[band] };
  if (band > 0) return { water: W.water[band - 1], sewerage: W.sewerage[band - 1] };
  return { water: r2(W.water[3] * 200 / 360), sewerage: r2(W.sewerage[3] * 200 / 360) };
}

export type Occupancy = 'main' | 'second' | 'empty';
/** Who lives there, counted as the 1992 Act counts adults (people disregarded are not counted). */
export type Household = 'two' | 'one' | 'none' | 'exempt';
export interface BillInput {
  council: string;
  band: number;
  occupancy?: Occupancy;
  household?: Household;
  disabled?: boolean;
  /** Years a home has stood empty and unfurnished (England tiers at 1, 5 and 10 years). */
  emptyYears?: number;
  /** Premium as a share of the normal charge (1 = +100 %). Undefined: the default of the nation. */
  premium?: number;
  instalments?: 10 | 12;
  /** Scotland: include water and waste water (false for a septic tank or private supply). */
  water?: boolean;
}
export interface BillLine { label: string; amount: number }
export interface Bill {
  council: Council; band: string; nation: Nation;
  bandCharge: number; chargedRatio: string; disabledApplied: boolean;
  discountRate: number; discount: number; premiumRate: number; premium: number; premiumNote: string;
  councilTax: number; water: number; sewerage: number; waterDiscount: number;
  annual: number; instalments: number; first: number; regular: number; perMonth12: number; daily: number;
  exempt: boolean; lines: BillLine[]; parts: BillLine[]; rule: string;
}

/** Highest premium a council may charge for this home under the national rules. */
export function maxPremium(n: Nation, occupancy: Occupancy, emptyYears = 0): number | null {
  if (occupancy === 'main') return 0;
  if (n === 'england') {
    if (occupancy === 'second') return P.premiums.england.secondHomeMax;
    let m = 0;
    for (const t of P.premiums.england.emptyTiers) if (emptyYears >= t.years) m = t.max;
    return m;
  }
  if (n === 'wales') return occupancy === 'empty' && emptyYears < P.premiums.wales.emptyFromYears ? 0 : P.premiums.wales.max;
  // Scotland: national default 100 % from 1 April 2026; each council may set it above or below.
  return occupancy === 'empty' && emptyYears < P.premiums.scotland.emptyFromYears ? 0 : null;
}
/** Premium the calculator applies when the user has not typed one. */
export function defaultPremium(n: Nation, occupancy: Occupancy, emptyYears = 0): number {
  if (occupancy === 'main') return 0;
  if (n === 'scotland') return occupancy === 'empty' && emptyYears < P.premiums.scotland.emptyFromYears ? 0 : P.premiums.scotland.default;
  if (n === 'wales') return occupancy === 'empty' && emptyYears < P.premiums.wales.emptyFromYears ? 0 : 1;
  return maxPremium(n, occupancy, emptyYears) ?? 0;
}

/** Instalments as the 1992 regulations set them: all but the first rounded to the nearest pound. */
export function instalmentPlan(total: number, n: number) {
  if (total <= 0) return { first: 0, regular: 0 };
  const per = total / n;
  if (Number.isInteger(r2(per))) return { first: r2(per), regular: r2(per) };
  const regular = Math.round(per);
  return { first: r2(total - regular * (n - 1)), regular };
}

export function bill(i: BillInput): Bill {
  const c = councilById(i.council);
  const n = c.nation;
  const L = letters(n);
  const band = Math.max(0, Math.min(L.length - 1, Math.round(i.band)));
  const occupancy = i.occupancy ?? 'main';
  const household = occupancy === 'main' ? i.household ?? 'two' : 'none';
  const disabled = !!i.disabled && occupancy === 'main';
  const exempt = occupancy === 'main' && household === 'exempt';
  const rt = disabled ? disabledRatio(n, band) : ratio(n, band);
  const charge = r2(c.bandD * rt);
  const discountRate = exempt ? 1 : occupancy === 'main' ? (household === 'one' ? P.discounts.singlePerson : household === 'none' ? P.discounts.allDisregarded : 0) : 0;
  const cap = maxPremium(n, occupancy, i.emptyYears ?? 0);
  let premiumRate = occupancy === 'main' ? 0 : i.premium ?? defaultPremium(n, occupancy, i.emptyYears ?? 0);
  premiumRate = Math.max(0, cap === null ? Math.min(premiumRate, 9) : Math.min(premiumRate, cap));
  const discount = r2(charge * discountRate);
  const premium = r2(charge * premiumRate);
  const councilTax = r2(charge - discount + premium);
  let water = 0, sewerage = 0, waterDiscount = 0;
  if (n === 'scotland' && i.water !== false) {
    const w = scottishWater(band, disabled);
    water = w.water; sewerage = w.sewerage;
    waterDiscount = r2((water + sewerage) * discountRate);
  }
  const annual = r2(councilTax + water + sewerage - waterDiscount);
  const nInst = i.instalments ?? (P.instalments.default as 10);
  const plan = instalmentPlan(annual, nInst);
  const fr = `${P.bands[n].num[band]}/${P.bands[n].den}`;
  const chargedRatio = disabled ? (band > 0 ? `${P.bands[n].num[band - 1]}/${P.bands[n].den} (Band ${L[band - 1]})` : `${n === 'scotland' ? 200 : 5}/${P.bands[n].den}`) : fr;
  const lines: BillLine[] = [{ label: `Band ${disabled ? (band > 0 ? L[band - 1] : 'A reduced') : L[band]} charge`, amount: charge }];
  if (discount) lines.push({ label: exempt ? 'Exempt: everyone is a full-time student or otherwise exempt' : discountRate === P.discounts.singlePerson ? 'Single person discount (25 %)' : 'Everyone disregarded (50 %)', amount: -discount });
  if (premium) lines.push({ label: `${occupancy === 'second' ? 'Second home' : 'Empty home'} premium (${Math.round(premiumRate * 100)} %)`, amount: premium });
  if (water) { lines.push({ label: 'Scottish Water: water', amount: water }, { label: 'Scottish Water: waste water', amount: sewerage }); if (waterDiscount) lines.push({ label: 'Same discount on water charges', amount: -waterDiscount }); }
  const scale = c.bandD ? councilTax / c.bandD : 0;
  const parts: BillLine[] = n === 'scotland' ? [{ label: c.name, amount: councilTax }] : ([
    [n === 'wales' ? `${c.name} Council` : c.cls === 'Shire district' ? `${c.name} District Council` : `${c.name}`, c.parts.council],
    [n === 'wales' ? 'Community council (average)' : 'Parish or town council (average)', c.parts.parish],
    [c.region === 'London' ? 'Greater London Authority' : c.county ? `${c.county} County Council` : 'County council', c.parts.county],
    ['Police', c.parts.police], ['Fire and rescue', c.parts.fire], ['Combined authority', c.parts.combined],
  ] as Array<[string, number]>).filter(([, v]) => v > 0).map(([label, v]) => ({ label, amount: r2(v * scale) }));
  const premiumNote = occupancy === 'main' ? '' : n === 'england'
    ? (occupancy === 'second' ? `England: up to ${Math.round(P.premiums.england.secondHomeMax * 100)} % from ${P.premiums.england.secondHomeFrom.slice(0, 4)}, only where your council has decided to charge it.` : 'England: up to 100 % after 1 year empty, 200 % after 5 years, 300 % after 10 years, if your council charges it.')
    : n === 'wales' ? 'Wales: each council sets its own premium, from 0 to 300 %.' : 'Scotland: 100 % unless your council has set another rate from 1 April 2026.';
  const rule = exempt ? 'Exempt dwelling: nothing to pay' : disabled ? `Disabled Band Reduction: charged at ${chargedRatio} of Band D` : discountRate ? `Band ${L[band]} at ${fr} of Band D, less ${Math.round(discountRate * 100)} %` : premiumRate ? `Band ${L[band]} at ${fr} of Band D, plus ${Math.round(premiumRate * 100)} %` : `Band ${L[band]} at ${fr} of Band D`;
  return {
    council: c, band: L[band], nation: n, bandCharge: charge, chargedRatio, disabledApplied: disabled,
    discountRate, discount, premiumRate, premium, premiumNote, councilTax, water, sewerage, waterDiscount,
    annual, instalments: nInst, first: plan.first, regular: plan.regular, perMonth12: r2(annual / 12), daily: annual / P.daysInYear,
    exempt, lines, parts, rule,
  };
}

/** Council tax for part of the year: a daily charge (moving in or out). */
export const forDays = (annual: number, days: number) => r2(annual * Math.max(0, Math.min(days, P.daysInYear)) / P.daysInYear);
/** Days between two ISO dates, both included, within the 2026/27 year. */
export function daysBetween(fromIso: string, toIso: string) {
  const a = Date.parse(fromIso), b = Date.parse(toIso);
  const s = Math.max(a, Date.parse(P.valid_from)), e = Math.min(b, Date.parse(P.valid_to));
  return e < s ? 0 : Math.round((e - s) / 86400000) + 1;
}

/** Band from the value on the valuation date (1991 England and Scotland, 2003 Wales). */
export function bandFromValue(n: Nation, value: number) {
  const up = P.bands[n].upper;
  for (let i = 0; i < up.length; i++) if (up[i] === null || value <= (up[i] as number)) return i;
  return up.length - 1;
}

/** Year-on-year change of the Band D figure. */
export function change(c: Council) {
  if (!c.bandDPrev) return null;
  return { amount: r2(c.bandD - c.bandDPrev), rate: c.bandD / c.bandDPrev - 1 };
}

/** Councils of a nation or of an English region, with a rank by Band D (1 = highest). */
export const inNation = (n: Nation) => COUNCILS.filter((c) => c.nation === n);
export const inRegion = (region: string) => COUNCILS.filter((c) => c.region === region || (region === 'Wales' && c.nation === 'wales') || (region === 'Scotland' && c.nation === 'scotland'));
export function rankIn(c: Council, list: Council[]) {
  const sorted = [...list].sort((a, b) => b.bandD - a.bandD);
  return { rank: sorted.findIndex((x) => x.id === c.id) + 1, of: sorted.length };
}
export const ENGLISH_REGIONS = ['North East', 'North West', 'Yorkshire and the Humber', 'East Midlands', 'West Midlands', 'East of England', 'London', 'South East', 'South West'];
export const average = (list: Council[]) => list.reduce((s, c) => s + c.bandD, 0) / (list.length || 1);
