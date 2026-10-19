import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-wandsworth',
  group: 'councils',
  order: 130,
  tool: { kind: 'ct', props: { council: 'wandsworth', band: 4 } },
  related: ['region-london', 'council-tax-westminster', 'second-home-council-tax', 'council-tax-bands'],
  sources: ['mhclg_levels', 'mhclg_release', 'gov_second_empty', 'voa_check'],
  slug: 'wandsworth-council-tax',
  nav: 'Wandsworth',
  card: 'The lowest Band D in England, why the Mayor of London takes about half of it, and every Wandsworth band.',
  title: 'Wandsworth Council Tax 2026/27: Lowest Band D in England',
  description: 'Wandsworth council tax 2026/27 for Bands A to H, the borough and Mayor of London shares, a comparison with Lambeth and Merton, and the second home premium.',
  h1: 'Wandsworth council tax 2026/27',
  intro: 'The cheapest Band D of any billing authority in England, and a bill in which the Mayor\'s precept weighs as much as the borough.',
  resume: (h) => {
    const c = h.c('wandsworth'); const ch = h.E.change(c)!; const p = c.parts;
    const r = h.E.rankIn(c, h.E.inNation('england'));
    const e = h.E.bill({ council: 'wandsworth', band: 4 });
    return `Wandsworth has the lowest Band D council tax in England for ${h.P.taxYear}: ${h.m2(c.bandD)} for a home with two adults, ${r.rank === r.of ? 'last' : `number ${r.rank}`} of ${r.of} English billing authorities ranked from the dearest. The figure rose by ${h.pc(ch.rate, 1)} from ${h.m2(c.bandDPrev!)}. Only ${h.m2(p.council)} of it is the borough's own charge, including ${h.m2(p.asc!)} of adult social care precept; the other ${h.m2(p.county)} is the precept of the Greater London Authority, which every London borough collects. The average Band D in England is ${h.m2(h.P.averages.england.bandD)}, so a Wandsworth household pays ${h.m(h.P.averages.england.bandD - c.bandD)} less at the same band. Many homes in the borough sit in higher bands, so the typical bill is above Band D: a Band E home pays ${h.m2(e.annual)}, or ${h.m2(e.regular)} a month over ten instalments, and a Band H home ${h.m2(h.E.bandCharge(c, 7))}.`;
  },
  faqs: (h) => {
    const c = h.c('wandsworth');
    return [
      { q: 'Why is Wandsworth council tax the lowest in England?', a: `The borough's own charge is set each year by its councillors, and Wandsworth has chosen to keep it among the lowest in the country for decades, funding more of its spending from other income. Its own share for ${h.P.taxYear} is ${h.m2(c.parts.council)} at Band D. The Greater London Authority precept is identical across London, so the borough charge alone decides why Wandsworth comes first.` },
      { q: 'How much of a Wandsworth bill goes to the Mayor of London?', a: `At Band D, ${h.m2(c.parts.county)} of the ${h.m2(c.bandD)} goes to the Greater London Authority, which is ${h.pc(c.parts.county / c.bandD, 0)} of the bill. That pays mainly for the Metropolitan Police, with the London Fire Brigade and the Mayor's transport and housing work. In most other boroughs the same sum is only a quarter of the bill.` },
      { q: 'Does Wandsworth charge extra on second homes?', a: `Yes. Wandsworth Council says its current premium on second homes is 100 %, which doubles the bill on a furnished home that is nobody's main residence. A Band E second home therefore costs ${h.m2(h.E.bill({ council: 'wandsworth', band: 4, occupancy: 'second' }).annual)} a year. Homes empty and unfurnished for more than a year carry a separate premium that grows with time.` },
    ];
  },
  body: (h) => {
    const c = h.c('wandsworth');
    const near = ['lambeth', 'merton', 'richmond-upon-thames', 'hammersmith-and-fulham', 'kingston-upon-thames', 'westminster'];
    const rows = [c, ...near.map((id) => h.c(id))].map((x) => [x.id === 'wandsworth' ? '<strong>Wandsworth</strong>' : h.ca(x.id), h.m2(x.parts.council), h.m2(x.bandD), h.m2(h.E.bandCharge(x, 4)), h.pc(x.parts.county / x.bandD, 0)]);
    const L = h.E.inRegion('London');
    const lam = h.c('lambeth');
    const gap = h.E.bandCharge(lam, 4) - h.E.bandCharge(c, 4);
    return `
<h2>Wandsworth charges for ${h.P.taxYear}, band by band</h2>
${h.bandTable('wandsworth')}
<p>Band H in Wandsworth, the band for homes worth ${h.P.bands.england.ranges[7]} in 1991, costs less than Band D in ${h.num(h.E.inNation('england').filter((x) => x.bandD > h.E.bandCharge(c, 7)).length)} of the ${h.num(h.E.inNation('england').length)} English billing authorities. That is the practical effect of a very low borough charge: the ratios between bands are the same everywhere, but they multiply a smaller base.</p>

<h2>Two authorities, one bill</h2>
<p>A Wandsworth bill has only two lines. The borough sets its own charge, and the Mayor of London sets the Greater London Authority precept. There are no parish councils, no county council and no separate police or fire precept outside the Mayor's share, because the Metropolitan Police and the London Fire Brigade are funded through it. Because the borough's part is so small, any rise in the Mayor's precept moves the Wandsworth bill proportionally more than in boroughs where the local charge is larger.</p>
<p>The table compares the borough's own Band D charge with its neighbours and shows what share of each bill the Mayor takes.</p>
${h.table(['Borough', 'Borough share at D', 'Band D', 'Band E', 'Mayor\'s share'], rows, `${h.P.taxYear}, two adults, main home. Source: ${h.src('mhclg_levels', 'MHCLG council tax levels')}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Crossing the border into ${h.ca('lambeth')} adds ${h.m(gap)} a year to a Band E home. Across all ${L.length} London authorities the average Band D is ${h.m2(h.E.average(L))}; the ${h.a('region-london', 'London table')} ranks every borough.</p>

<h2>Higher bands in a high-value borough</h2>
<p>Bands in England still rest on values at 1 April 1991, and London prices were already high then, so a large share of London homes sits in Bands E to H and the Band D figure understates the typical payment. Before buying, look up the band of the exact flat or house on the ${h.src('voa_check', 'GOV.UK band search')}; a conversion or extension can sit in a different band from the rest of the street. The ${h.a('council-tax-bands', 'bands guide')} explains the 1991 value ranges.</p>

<h2>Premiums and discounts</h2>
<p>Wandsworth applies a 100 % premium to second homes, the most the law allows, and a further premium on homes left empty and unfurnished for more than a year, which increases with the time a home has been empty. Exceptions exist, for example for homes being actively marketed for sale or let, under the ${h.src('gov_second_empty', 'national rules on second homes and empty properties')}. A person living alone still receives ${h.pc(h.P.discounts.singlePerson)} off, which in Band E brings the bill to ${h.m2(h.E.bill({ council: 'wandsworth', band: 4, household: 'one' }).annual)}. The ${h.a('second-home-council-tax', 'second home guide')} explains how the premium is calculated.</p>
<p>The ${h.src('mhclg_release', 'statistical release')} for England confirms each year which authority has the lowest Band D. Figures for 2027/28 are to come.</p>
`;
  },
});
