import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-liverpool',
  group: 'councils',
  order: 40,
  tool: { kind: 'ct', props: { council: 'liverpool', band: 0 } },
  related: ['region-north-west', 'council-tax-disregards', 'empty-property-council-tax', 'check-council-tax-band'],
  sources: ['mhclg_levels', 'mhclg_release', 'voa_check', 'gov_second_empty'],
  slug: 'liverpool-council-tax',
  nav: 'Liverpool',
  card: 'Liverpool bands for 2026/27, the Merseyside police and fire shares and the Liverpool City Region mayoral precept.',
  title: 'Liverpool Council Tax 2026/27: Band A to H Charges Explained',
  description: 'Liverpool council tax 2026/27 for each band, with the Merseyside police and fire precepts, the City Region mayor\'s share and the five other city region areas.',
  h1: 'Liverpool council tax 2026/27',
  intro: 'The highest Band D in the North West, made of a city charge, two Merseyside precepts and a small share for the city region mayor.',
  resume: (h) => {
    const c = h.c('liverpool'); const ch = h.E.change(c)!; const NW = h.E.inRegion('North West'); const r = h.E.rankIn(c, NW);
    const a = h.E.bill({ council: 'liverpool', band: 0 });
    return `Liverpool City Council has set a Band D council tax of ${h.m2(c.bandD)} for ${h.P.taxYear}, ${h.pc(ch.rate, 1)} more than the ${h.m2(c.bandDPrev!)} charged in 2025/26. It ranks ${r.rank} of the ${r.of} council areas of the North West, counted from the most expensive. In practice few Liverpool households pay the Band D rate, because the city's housing is weighted towards the lowest band: a Band A home with two adults pays ${h.m2(a.annual)}, and a single adult in Band A pays ${h.m2(h.E.bill({ council: 'liverpool', band: 0, household: 'one' }).annual)}. Each Band D bill includes ${h.m2(c.parts.police)} for Merseyside Police, ${h.m2(c.parts.fire)} for Merseyside Fire and Rescue and ${h.m2(c.parts.combined)} for the Liverpool City Region Combined Authority, whose elected mayor sets that precept. Liverpool has no parish councils. Figures are from the March 2026 government tables of council tax levels in England.`;
  },
  faqs: (h) => {
    const c = h.c('liverpool'); const w = h.c('wirral');
    return [
      { q: 'How much of Liverpool council tax goes to the metro mayor?', a: `${h.m2(c.parts.combined)} at Band D in ${h.P.taxYear}, the smallest line on the bill, scaled to your band so a Band A home pays two thirds of it. The Liverpool City Region Combined Authority uses its precept for mayoral functions across the six council areas. The city council's own charge, ${h.m2(c.parts.council)}, is ${Math.round(c.parts.council / c.parts.combined)} times larger.` },
      { q: 'Is it cheaper to live on the Wirral than in Liverpool for council tax?', a: `A little. Band D in ${w.name} is ${h.m2(w.bandD)} against ${h.m2(c.bandD)} in Liverpool, so a Band A home saves ${h.m(h.E.bandCharge(c, 0) - h.E.bandCharge(w, 0))} a year across the Mersey. The two boroughs share the Merseyside police and fire precepts and the mayoral precept, so the saving comes from Wirral's lower borough charge.` },
      { q: 'Can a Liverpool household in Band A get a smaller bill?', a: `Yes, in three ways. A single adult gets ${h.pc(h.P.discounts.singlePerson)} off; a home adapted for a disabled resident is charged at five ninths of Band D instead of six; and the city's Council Tax Support scheme reduces the bill for low incomes. Some adults, such as carers or apprentices, are disregarded when the council counts who lives there.` },
    ];
  },
  body: (h) => {
    const c = h.c('liverpool'); const p = c.parts;
    const lcr = h.E.inRegion('North West').filter((x) => x.parts.combined === p.combined).sort((x, y) => y.bandD - x.bandD);
    const rows = lcr.map((x) => [x.id === 'liverpool' ? '<strong>Liverpool</strong>' : h.ca(x.id), h.m2(h.E.bandCharge(x, 0)), h.m2(x.bandD), h.m2(x.parts.police), h.m2(x.parts.fire)]);
    const halton = h.c('halton');
    return `
<h2>Liverpool charges for ${h.P.taxYear}</h2>
${h.bandTable('liverpool')}
<p>Every figure above follows from the Band D charge and the fixed ratios in law. If you are not sure which row is yours, the ${h.src('voa_check', 'Valuation Office search')} gives the band of any address in seconds, and the ${h.a('check-council-tax-band', 'band checking guide')} explains what to do if it looks wrong.</p>

<h2>Four bodies on one bill</h2>
<p>The city council keeps ${h.m2(p.council)} of Band D, including ${h.m2(p.asc!)} raised for adult social care. Merseyside Police receive ${h.m2(p.police)} through the police and crime commissioner, and Merseyside Fire and Rescue ${h.m2(p.fire)}. The last line, ${h.m2(p.combined)}, is the mayoral precept of the Liverpool City Region Combined Authority. Put together, the precepts for other bodies come to ${h.pc((p.police + p.fire + p.combined) / c.bandD, 1)} of the Band D total, a smaller share than in many cities, because the city council's own charge is high. The bill you receive in March lists each of these lines with its percentage change on the year before, so you can see which body raised its share most. None of the three precepting bodies can be challenged through the city council: questions about their budgets go to the commissioner, the fire authority or the combined authority directly.</p>

<h2>The six areas of the Liverpool City Region</h2>
<p>The mayoral precept is levied in the five Merseyside boroughs and in Halton, across the river in Cheshire. Halton's police and fire shares come from Cheshire, not Merseyside, so its bill mixes the two areas. Sorted from the highest Band D:</p>
${h.table(['Council', 'Band A', 'Band D', 'Police at D', 'Fire at D'], rows, `${h.P.taxYear}, two adults, main home. Each pays the same mayoral precept of ${h.m2(p.combined)} at Band D.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Liverpool tops the group and ${halton.name} is the cheapest at ${h.m2(halton.bandD)}. Greater Manchester, Lancashire and Cumbria are covered on the ${h.a('region-north-west', 'North West region page')}, where Liverpool is the dearest of all.</p>

<h2>Empty homes and second homes in the city</h2>
<p>Councils in England may add up to ${h.pc(h.P.premiums.england.emptyTiers[0].max)} to the bill of a home left empty and unfurnished for a year, rising to ${h.pc(h.P.premiums.england.emptyTiers[1].max)} after five years and ${h.pc(h.P.premiums.england.emptyTiers[2].max)} after ten, and up to ${h.pc(h.P.premiums.england.secondHomeMax)} on a furnished second home. The ${h.src('gov_second_empty', 'GOV.UK rules on empty and second homes')} list the exceptions, such as a home being marketed for sale. Liverpool decides its own rates, so check the current figure with the council before you use the calculator; the ${h.a('empty-property-council-tax', 'empty property guide')} explains the tiers.</p>

<h2>Who counts as an adult in the house</h2>
<p>The bill assumes two adults unless the council is told otherwise. Many people are left out of the count, among them full-time students, people with a severe mental impairment and some live-in carers. If everyone but one adult is disregarded, the ${h.pc(h.P.discounts.singlePerson)} discount applies; the ${h.a('council-tax-disregards', 'disregards guide')} lists each group.</p>
`;
  },
});
