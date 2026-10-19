/**
 * Council tax bill 2026/27 (main tool): council x band x who lives there x kind of home. The figure is
 * the bill the council sends: band charge, discount or premium, Scottish Water in Scotland, then the
 * 10 or 12 instalments as the 1992 regulations round them.
 * Hydration (RECETTE §17.5): first render = props defaults; link parameters applied in an effect.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import StackedBar from '../ui/StackedBar';
import CouncilSelect from './CouncilSelect';
import { bill, councilById, letters, maxPremium, defaultPremium, rankIn, inNation, NATION_NAME, COUNCILS, type Household, type Occupancy } from '../../lib/engine/counciltax';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props { council?: string; band?: number; household?: Household; occupancy?: Occupancy; methodHref: string; challengeHref?: string; idPrefix?: string }
const m = (n: number) => formatMoney(Math.round(n), 0);
const m2 = (n: number) => formatMoney(n, 2);
const HOUSEHOLD = [
  { value: 'two', label: 'Two or more adults who count' },
  { value: 'one', label: 'One adult who counts (25 % off)' },
  { value: 'none', label: 'Nobody counts, all disregarded (50 % off)' },
  { value: 'exempt', label: 'Only full-time students (exempt)' },
];
const OCC = [{ value: 'main', label: 'Someone’s main home' }, { value: 'second', label: 'Second home, furnished' }, { value: 'empty', label: 'Empty and unfurnished' }];
const COLORS = ['#1F3A68', '#7a8fb3', '#8A1538', '#b45309', '#475569', '#14532d', '#0e7490'];

export default function CouncilCalc({ council: c0 = 'birmingham', band: b0 = 1, household: h0 = 'two', occupancy: o0 = 'main', methodHref, challengeHref, idPrefix = 'ct' }: Props) {
  const [council, setCouncil] = useState(c0);
  const [band, setBand] = useState(b0);
  const [household, setHousehold] = useState<Household>(h0);
  const [occupancy, setOccupancy] = useState<Occupancy>(o0);
  const [disabled, setDisabled] = useState(false);
  const [years, setYears] = useState(2);
  const [premiumPc, setPremiumPc] = useState<number | null>(null);
  const [inst, setInst] = useState<10 | 12>(10);
  const [water, setWater] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const u = readParams(window.location.search);
    if (!u.toString()) return;
    const c = str(u, 'c', c0); if (COUNCILS.some((x) => x.id === c)) setCouncil(c);
    setBand(num(u, 'b', b0)); setHousehold((str(u, 'h', h0) as Household)); setOccupancy(str(u, 'o', o0) as Occupancy);
    setDisabled(str(u, 'd', '0') === '1'); setYears(num(u, 'y', 2)); setInst(num(u, 'i', 10) === 12 ? 12 : 10); setWater(str(u, 'w', '1') !== '0');
    const pp = u.get('p'); setPremiumPc(pp === null ? null : num(u, 'p', 100));
  }, []);
  useEffect(() => { updateURL({ c: council, b: band, h: household === 'two' ? undefined : household, o: occupancy === 'main' ? undefined : occupancy, d: disabled ? 1 : undefined, y: occupancy === 'empty' ? years : undefined, p: premiumPc ?? undefined, i: inst === 12 ? 12 : undefined, w: water ? undefined : 0 }); }, [council, band, household, occupancy, disabled, years, premiumPc, inst, water]);

  const c = councilById(council);
  const L = letters(c.nation);
  const b = Math.min(band, L.length - 1);
  const cap = maxPremium(c.nation, occupancy, years);
  const premium = premiumPc === null ? defaultPremium(c.nation, occupancy, years) : premiumPc / 100;
  const r = useMemo(() => bill({ council, band: b, household, occupancy, disabled, emptyYears: years, premium, instalments: inst, water }), [council, b, household, occupancy, disabled, years, premium, inst, water]);
  const rk = rankIn(c, inNation(c.nation));
  const cheapest = inNation(c.nation).reduce((a, x) => (x.bandD < a.bandD ? x : a));
  const share = () => { try { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard refused */ } };
  const id = (x: string) => `${idPrefix}-${x}`;
  const capText = occupancy === 'main' ? '' : cap === null ? 'Your council sets it; 100 % is the national default' : cap === 0 ? 'No premium at this stage' : `Up to ${Math.round(cap * 100)} % here; 0 if your council does not charge it`;

  return (
    <div data-chrome className="rechner border border-navy-300 bg-white p-4 sm:p-5">
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,25rem)]">
        <form className="grid content-start gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <CouncilSelect id={id('council')} label="Council" value={council} onChange={(v) => { setCouncil(v); setPremiumPc(null); }} />
            <SelectField id={id('band')} label="Band" value={String(b)} onChange={(v) => setBand(Number(v))} options={L.map((l, i) => ({ value: String(i), label: `Band ${l}` }))} />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <SelectField id={id('occ')} label="The home is" value={occupancy} onChange={(v) => { setOccupancy(v as Occupancy); setPremiumPc(null); }} options={OCC} />
            {occupancy === 'main'
              ? <SelectField id={id('hh')} label="Who lives there" value={household} onChange={(v) => setHousehold(v as Household)} options={HOUSEHOLD} help="Students, apprentices, carers and under-18s do not count" />
              : <NumberField id={id('prem')} label="Premium your council charges" value={Math.round(premium * 100)} onChange={(v) => setPremiumPc(v)} unit="%" max={900} help={capText} />}
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            {occupancy === 'empty'
              ? <NumberField id={id('years')} label="Empty since (years)" value={years} onChange={(v) => { setYears(v); setPremiumPc(null); }} unit="yrs" max={100} decimals={1} help="Unfurnished and nobody’s home" />
              : <Toggle id={id('dis')} label="Adapted for a disabled resident" value={disabled ? '1' : '0'} onChange={(v) => setDisabled(v === '1')} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} />}
            <Toggle id={id('inst')} label="Monthly instalments" value={String(inst)} onChange={(v) => setInst(v === '12' ? 12 : 10)} options={[{ value: '10', label: '10' }, { value: '12', label: '12' }]} />
          </div>
          {c.nation === 'scotland' && (
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
              <Toggle id={id('water')} label="Mains water and sewer" value={water ? '1' : '0'} onChange={(v) => setWater(v === '1')} options={[{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }]} />
            </div>
          )}
        </form>
        <div data-resultat aria-live="polite" className="self-start border-l-4 border-accent-500 bg-accent-50 p-4">
          <p className="text-sm font-medium text-navy-700">{c.name}, Band {L[b]}, {P.taxYear}</p>
          <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{m(r.annual)}<span className="ml-1 text-base font-medium text-navy-700">a year</span></p>
          <p className="mt-1 text-sm text-navy-800">{r.annual > 0 ? (r.first === r.regular ? <>{inst} payments of <strong className="tabular-nums">{m2(r.regular)}</strong></> : <>First payment <strong className="tabular-nums">{m2(r.first)}</strong>, then {inst - 1} of <strong className="tabular-nums">{m2(r.regular)}</strong></>) : 'Nothing to pay while this lasts'}</p>
          <table className="ledger mt-3 w-full text-sm"><tbody>
            {r.lines.map((l) => <tr key={l.label}><td className="pr-2 text-navy-700">{l.label}</td><td className="tabular-nums text-right text-navy-900">{l.amount < 0 ? `−${m2(-l.amount)}` : m2(l.amount)}</td></tr>)}
            <tr className="total"><td>Bill for the year</td><td className="tabular-nums text-right">{m2(r.annual)}</td></tr>
          </tbody></table>
          <p className="mt-2 text-xs text-navy-600">{r.rule}. {r.premiumNote}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-4 border-t border-navy-200 pt-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-navy-900">Where the council tax goes</p>
          {r.councilTax > 0 && r.parts.length > 1
            ? <div className="mt-2"><StackedBar ariaPrefix="Council tax by body" total={Math.max(r.councilTax, 1)} segments={r.parts.map((p, i) => ({ label: p.label, value: p.amount, color: COLORS[i % COLORS.length] }))} /></div>
            : <p className="mt-2 text-sm text-navy-800">{c.nation === 'scotland' ? 'In Scotland the council sets a single figure: police and fire are funded nationally.' : 'Nothing is due on this home.'}</p>}
        </div>
        <div>
          <p className="text-sm font-semibold text-navy-900">How {c.name} compares</p>
          <p className="mt-2 text-sm text-navy-800">Band D here is {m2(c.bandD)}, number {rk.rank} of {rk.of} in {NATION_NAME[c.nation]} (1 = dearest). The same band in {cheapest.name}, the cheapest, costs {m(r.annual * cheapest.bandD / c.bandD)} on the same terms{c.nation === 'scotland' && water ? ', water aside' : ''}.</p>
          {challengeHref && <p className="mt-1 text-xs text-navy-600">Think the band is wrong? <a className="underline" href={challengeHref}>How a band challenge works</a></p>}
        </div>
      </div>
      <div aria-hidden="true" className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-300 bg-white/95 px-4 py-2 text-sm text-navy-900 shadow-[0_-2px_6px_rgba(0,0,0,0.06)] lg:hidden print:hidden">{c.name} Band {L[b]}: <strong className="tabular-nums">{m(r.annual)}</strong> a year · about <strong className="tabular-nums">{m(r.annual / inst)}</strong> a month over {inst}</div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <button type="button" onClick={share} className="rounded border border-navy-300 px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">{copied ? 'Link copied' : 'Copy a link to this bill'}</button>
        <button type="button" onClick={() => window.print()} className="rounded border border-navy-300 px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">Print</button>
        <a href={methodHref} className="text-accent-700 underline underline-offset-2">How this is calculated</a>
        <span className="text-xs text-navy-600">{c.nation === 'england' ? 'Parish part is the council-wide average; your parish may differ by a few pounds.' : c.nation === 'wales' ? 'Community council part is the council-wide average.' : 'Water and waste water are Scottish Water’s 2026/27 charges.'} Council Tax Reduction for low incomes is not included.</span>
      </div>
    </div>
  );
}
