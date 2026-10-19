import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-sheffield',
  group: 'councils',
  order: 50,
  tool: { kind: 'ct', props: { council: 'sheffield', band: 0 } },
  related: ['region-yorkshire', 'empty-property-council-tax', 'second-home-council-tax', 'council-tax-moving-house'],
  sources: ['mhclg_levels', 'mhclg_premiums', 'gov_second_empty', 'mhclg_release'],
  slug: 'sheffield-council-tax',
  nav: 'Sheffield',
  card: 'Sheffield bands for 2026/27, the South Yorkshire police and fire shares, Stocksbridge and the premiums on empty homes.',
  title: 'Sheffield Council Tax 2026/27: Band Charges and Premiums',
  description: 'Sheffield council tax 2026/27 for Bands A to H, the South Yorkshire police and fire shares, the Stocksbridge precept and premiums on empty and second homes.',
  h1: 'Sheffield council tax 2026/27',
  intro: 'A city charge that rose by the full limit, police and fire shares common to South Yorkshire, and premiums that the city has confirmed for this year.',
  resume: (h) => {
    const c = h.c('sheffield'); const ch = h.E.change(c)!; const Y = h.E.inRegion('Yorkshire and the Humber'); const r = h.E.rankIn(c, Y);
    const a = h.E.bill({ council: 'sheffield', band: 0 });
    return `In ${h.P.taxYear} the average Band D council tax across Sheffield is ${h.m2(c.bandD)}, which is ${h.pc(ch.rate, 1)} above the 2025/26 level of ${h.m2(c.bandDPrev!)}. The city council's own part went up by ${h.pc(h.P.referendum.england.total)}, the most allowed without a referendum, including ${h.pc(h.P.referendum.england.asc)} for adult social care. In Band A, the lowest band, two adults pay ${h.m2(a.annual)} for the year and a person living alone ${h.m2(h.E.bill({ council: 'sheffield', band: 0, household: 'one' }).annual)}. The Band D figure contains ${h.m2(c.parts.police)} for South Yorkshire policing and ${h.m2(c.parts.fire)} for the South Yorkshire fire service. Sheffield ranks ${r.rank} of ${r.of} councils in Yorkshire and the Humber by Band D, from the top, making it one of the dearer places in the region, though still below the England average of ${h.m2(h.P.averages.england.bandD)}. Every figure here comes from the official government table of council tax levels for England.`;
  },
  faqs: (h) => {
    const c = h.c('sheffield');
    return [
      { q: 'Does Sheffield charge double council tax on a second home?', a: `Yes. Sheffield's ${h.P.taxYear} council tax booklet confirms a premium of ${h.pc(h.P.premiums.england.secondHomeMax)} on a home that is furnished but nobody's main residence, so the owner pays twice the normal band charge. Some homes are excepted for up to a year, for example while being actively marketed for sale or to let.` },
      { q: 'What extra do I pay in Stocksbridge?', a: `Stocksbridge Town Council sets its own precept, collected on the Sheffield bill and shown as a separate line. It is one of only ${c.parishes} parish areas in the city, so most Sheffield addresses pay no parish charge at all. The town council's leaflet with your bill gives this year's amount for each band.` },
      { q: 'Is Sheffield council tax higher than Rotherham or Barnsley?', a: `Yes. Band D is ${h.m2(c.bandD)} in Sheffield, ${h.m2(h.c('rotherham').bandD)} in Rotherham and ${h.m2(h.c('barnsley').bandD)} in Barnsley. All three pay identical South Yorkshire police and fire precepts, so the whole difference comes from each council's own charge and, to a small degree, from parish precepts.` },
    ];
  },
  body: (h) => {
    const c = h.c('sheffield'); const p = c.parts; const E = h.P.premiums.england;
    const sy = ['sheffield', 'rotherham', 'barnsley', 'doncaster'].map((id) => h.c(id));
    const low = [...h.E.inRegion('Yorkshire and the Humber')].sort((x, y) => x.bandD - y.bandD)[0];
    const rows = sy.map((x) => [x.id === 'sheffield' ? '<strong>Sheffield</strong>' : h.ca(x.id), h.m2(h.E.bandCharge(x, 0)), h.m2(h.E.bandCharge(x, 2)), h.m2(x.bandD), h.m(x.bandD - x.bandDPrev!)]);
    const emptyRows = E.emptyTiers.map((t, i) => [`${t.years} year${t.years > 1 ? 's' : ''}${E.emptyTiers[i + 1] ? ` to ${E.emptyTiers[i + 1].years}` : ' or more'}`, h.pc(t.max), h.m2(h.E.bill({ council: 'sheffield', band: 0, occupancy: 'empty', emptyYears: t.years }).annual)]);
    return `
<h2>The Sheffield band table</h2>
${h.bandTable('sheffield')}
<p>These amounts include the average of Sheffield's parish precepts, ${h.m2(p.parish)} at Band D, so a home outside a parish pays a few pounds less than shown and the city's own leaflet lists slightly lower totals.</p>

<h2>South Yorkshire's shared precepts</h2>
<p>Four councils make up South Yorkshire, and they all collect the same two precepts: ${h.m2(p.police)} at Band D for policing and ${h.m2(p.fire)} for the fire and rescue authority. No separate combined authority precept appears in the government figures for the county this year. The city council keeps ${h.m2(p.council)}, with ${h.m2(p.asc!)} of that ring-fenced for adult social care.</p>
${h.table(['Council', 'Band A', 'Band C', 'Band D', 'Rise at D'], rows, `South Yorkshire, ${h.P.taxYear}, two adults, main home.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Sheffield is the dearest of the four, while ${low.name} has the lowest Band D of any council in Yorkshire and the Humber. The ${h.a('region-yorkshire', 'Yorkshire and the Humber page')} ranks all of the region's councils.</p>

<h2>Empty homes cost up to four times as much</h2>
<p>The city's ${h.P.taxYear} booklet confirms that Sheffield applies the full national scale for homes left empty and unfurnished, set out in the ${h.src('mhclg_premiums', 'government guidance on premiums')}. On a Band A home with no one living there, the yearly bill becomes:</p>
${h.table(['Empty for', 'Premium', 'Band A bill'], emptyRows, 'Sheffield, empty and unfurnished, after the first year. A home empty for less than a year pays the normal charge.', ['l', 'r', 'r'])}
<p>A furnished second home pays the ${h.pc(E.secondHomeMax)} premium confirmed in the same booklet. Owners who think an exception applies, such as a home on the market or awaiting probate, should tell the council; the ${h.src('gov_second_empty', 'GOV.UK summary')} and the ${h.a('empty-property-council-tax', 'empty property page')} list them, and the ${h.a('second-home-council-tax', 'second homes guide')} covers holiday lets and job-related homes.</p>

<h2>Paying less when money is tight</h2>
<p>None of the figures above take account of Council Tax Support, the city's own scheme for residents on low incomes, which is assessed separately and comes off the bill after any discount. Pensioners are protected by national rules, while the scheme for working-age residents is set by Sheffield and can change each April. If you fall behind, contact the council as soon as a payment is missed: a single missed instalment can lead to the whole year's balance becoming due, but most councils will agree a new plan before that stage.</p>
<p>A household where every adult but one is disregarded, for example because the others are full-time students or apprentices, still gets the ${h.pc(h.P.discounts.singlePerson)} discount even though more than one person lives there.</p>

<h2>Moving to or within the city</h2>
<p>Council tax is charged by the day, so a mid-year move splits the bill between two addresses. Tell the council the date you get the keys; the ${h.a('council-tax-moving-house', 'moving house guide')} shows how the daily charge works and why a refund may follow when you leave.</p>
`;
  },
});
