import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-durham',
  group: 'councils',
  order: 170,
  tool: { kind: 'ct', props: { council: 'durham', band: 0 } },
  related: ['region-north-east', 'council-tax-newcastle-upon-tyne', 'empty-property-council-tax', 'council-tax-disabled-band-reduction'],
  sources: ['mhclg_levels', 'mhclg_premiums', 'gov_disabled', 'gov_ctr'],
  slug: 'durham-council-tax',
  nav: 'County Durham',
  card: 'County Durham bands for 2026/27, the parish share across 129 local councils, and the premiums on empty and second homes.',
  title: 'Durham Council Tax 2026/27: Band A to H and Parish Charges',
  description: 'Durham council tax 2026/27 from Band A upwards, the parish and town council share, premiums of up to 300 % on empty homes and a North East comparison.',
  h1: 'County Durham council tax 2026/27',
  intro: 'A large unitary county with a parish or town council in most communities and bills that start well below the English average in the lowest band.',
  resume: (h) => {
    const c = h.c('durham'); const ch = h.E.change(c)!; const p = c.parts;
    const a = h.E.bill({ council: 'durham', band: 0 }); const a1 = h.E.bill({ council: 'durham', band: 0, household: 'one' });
    const ne = h.E.inRegion('North East'); const r = h.E.rankIn(c, ne);
    return `Durham County Council's Band D figure for ${h.P.taxYear} is ${h.m2(c.bandD)}, an average that includes the precepts of ${h.num(c.parishes!)} parish and town councils and rose by ${h.pc(ch.rate, 1)} from ${h.m2(c.bandDPrev!)}. The calculator opens on Band A, the band charged at six ninths of Band D: two adults there pay ${h.m2(a.annual)} a year and a single adult ${h.m2(a1.annual)}, or ${h.m2(a.regular)} a month over ten months. Of the Band D total, ${h.m2(p.council)} goes to the county council itself, ${h.m2(p.parish)} on average to the parish, ${h.m2(p.police)} to the police and ${h.m2(p.fire)} to fire and rescue. In the North East, Durham comes ${r.rank} of ${r.of} by Band D, from the dearest, and its figure is ${h.m(Math.abs(c.bandD - h.P.averages.england.bandD))} ${c.bandD > h.P.averages.england.bandD ? 'above' : 'below'} the English average of ${h.m2(h.P.averages.england.bandD)}. Homes empty for years can pay up to four times the normal charge.`;
  },
  faqs: (h) => {
    const c = h.c('durham');
    return [
      { q: 'How much more does a long-term empty home pay in County Durham?', a: `Durham County Council charges double after one year empty and unfurnished, three times after five years and four times after ten, the highest tiers allowed. For a Band A house empty for ten years that is ${h.m2(h.E.bill({ council: 'durham', band: 0, occupancy: 'empty', emptyYears: 10 }).annual)} instead of ${h.m2(h.E.bandCharge(c, 0))}. In the first year empty, the normal charge applies with no discount.` },
      { q: 'Do Durham University students pay council tax?', a: `Not if every adult in the home is a full-time student: the home is then exempt, whether it is a hall, a college room or a shared house. Students should give the council proof of their course from the university. If a non-student lives with them, that person pays the bill with the ${h.pc(h.P.discounts.singlePerson)} reduction for an adult counted alone.` },
      { q: 'Does County Durham charge a premium on holiday cottages?', a: `A furnished home that is nobody's main residence counts as a second home and has paid twice the normal charge in County Durham since 1 April 2025, under the council's 100 % premium. A Band C cottage therefore pays ${h.m2(h.E.bill({ council: 'durham', band: 2, occupancy: 'second' }).annual)}. Homes let as holiday accommodation for enough days a year may instead pay business rates.` },
    ];
  },
  body: (h) => {
    const c = h.c('durham'); const ne = h.E.inRegion('North East');
    const near = ['northumberland', 'gateshead', 'sunderland', 'hartlepool', 'stockton-on-tees', 'darlington'];
    const rows = [c, ...near.map((id) => h.c(id))].map((x) => [x.id === c.id ? '<strong>Durham</strong>' : h.ca(x.id), h.m2(h.E.bandCharge(x, 0)), h.m2(h.E.bandCharge(x, 1)), h.m2(x.bandD), x.parts.parish ? h.m2(x.parts.parish) : 'none']);
    const own = c.bandD - c.parts.parish;
    const dbr = h.E.bill({ council: 'durham', band: 0, disabled: true });
    return `
<h2>County Durham, every band</h2>
${h.bandTable('durham')}
<p>Bands follow the values of April 1991, and house prices in the North East were then among the lowest in England, so lower bands are common across the county. That is why this page starts on Band A rather than Band D. Each step up to Band D adds one ninth of the Band D charge; above it the steps grow to two and then three ninths.</p>

<h2>A county of parishes</h2>
<p>County Durham has ${h.num(c.parishes!)} parish and town councils, from small villages to some of the larger towns. The council's own charge, together with the police and fire precepts, is ${h.m2(own)} at Band D everywhere; the parish precept then varies from place to place, which is why the ${h.m2(c.parts.parish)} in the figures above is only an average. Look for the parish line on your bill to see the real amount. The last column of the table shows how much weight this local layer has in Durham compared with its neighbours.</p>
${h.table(['Council', 'Band A', 'Band B', 'Band D', 'Parish average at D'], rows, `${h.P.taxYear}, two adults, main home, from the ${h.src('mhclg_levels', 'MHCLG council tax tables')}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The North East average Band D is ${h.m2(h.E.average(ne))}. The ${h.a('region-north-east', 'North East page')} ranks all ${ne.length} councils, and ${h.ca('newcastle-upon-tyne')} has its own page.</p>

<h2>Empty and second homes</h2>
<p>Since 1 April 2025, County Durham has added a 100 % premium to second homes. Homes empty and unfurnished pay 100 % extra between one and five years, 200 % from five years and 300 % from ten. For the first year a vacant home pays the full charge, with no empty discount. The exceptions in the ${h.src('mhclg_premiums', 'government guidance')}, for example for homes on the market or awaiting probate, apply in Durham too, and the ${h.a('empty-property-council-tax', 'empty property page')} explains how to claim one.</p>

<h2>Reductions that matter in the lower bands</h2>
<p>A home adapted for a disabled resident, for example with an extra bathroom or space for a wheelchair, is charged one band lower. In Band A there is no lower band, so the charge falls to five ninths of Band D: ${h.m2(dbr.annual)} instead of ${h.m2(h.E.bandCharge(c, 0))}. The ${h.src('gov_disabled', 'GOV.UK rules')} and the ${h.a('council-tax-disabled-band-reduction', 'Disabled Band Reduction guide')} explain the test. Households on a low income can apply for ${h.src('gov_ctr', 'Council Tax Reduction')}, which Durham runs under its own local scheme and which the calculator does not include. It is applied after every discount shown on this page, so the figures above are the starting point for any claim.</p>
`;
  },
});
