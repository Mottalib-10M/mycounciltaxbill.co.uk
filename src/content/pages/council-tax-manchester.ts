import { definePage } from '../../lib/guide-types';

const GM = ['bolton', 'bury', 'manchester', 'oldham', 'rochdale', 'salford', 'stockport', 'tameside', 'trafford', 'wigan'];

export default definePage({
  id: 'council-tax-manchester',
  group: 'councils',
  order: 30,
  tool: { kind: 'ct', props: { council: 'manchester', band: 0 } },
  related: ['region-north-west', 'council-tax-increase-2026', 'council-tax-students', 'council-tax-single-person-discount'],
  sources: ['mhclg_levels', 'mhclg_release', 'gov_students', 'gov_who_pays'],
  slug: 'manchester-council-tax',
  nav: 'Manchester',
  card: 'Manchester bands for 2026/27 and the two Greater Manchester mayoral precepts for police, fire and transport.',
  title: 'Manchester Council Tax 2026/27: Bands and Mayor\'s Precepts',
  description: 'Manchester council tax 2026/27 by band, with the Greater Manchester Mayor\'s police precept and general precept for fire, and how the ten boroughs compare.',
  h1: 'Manchester council tax 2026/27',
  intro: 'The city charge, plus two precepts set by the Mayor of Greater Manchester: one for policing, one for fire and other mayoral services.',
  resume: (h) => {
    const c = h.c('manchester'); const ch = h.E.change(c)!; const a = h.E.bill({ council: 'manchester', band: 0 });
    const list = GM.map((id) => h.c(id)); const r = h.E.rankIn(c, list);
    return `Manchester City Council's Band D council tax for ${h.P.taxYear} is ${h.m2(c.bandD)} for two adults, up from ${h.m2(c.bandDPrev!)} in 2025/26, an increase of ${h.pc(ch.rate, 1)}. Most homes in the city are in the lowest bands, so a more typical bill is the Band A charge of ${h.m2(a.annual)} a year, or ${h.m2(h.E.bill({ council: 'manchester', band: 0, household: 'one' }).annual)} for an adult living alone. Two of the lines on that bill are set not by the city but by the Mayor of Greater Manchester: a police and crime precept of ${h.m2(c.parts.police)} and a general precept of ${h.m2(c.parts.combined)} at Band D, which pays mainly for the fire and rescue service. There is no separate fire authority line. Among the ten Greater Manchester boroughs, Manchester ranks ${r.rank} of ${r.of} by Band D from the highest, so only a few neighbours charge less.`;
  },
  faqs: (h) => {
    const c = h.c('manchester');
    return [
      { q: 'Why is there no fire authority line on a Manchester council tax bill?', a: `The Greater Manchester Fire and Rescue Service is funded through the Mayor's general precept, ${h.m2(c.parts.combined)} at Band D for ${h.P.taxYear}. The Combined Authority says most of that amount goes to fire and rescue and the rest to other mayoral services such as rough sleeping support and free bus travel for young people.` },
      { q: 'Does Salford pay the same Mayor\'s precept as Manchester?', a: `Yes. Both mayoral precepts are identical in all ten boroughs: ${h.m2(c.parts.police)} for policing and ${h.m2(c.parts.combined)} for the general precept at Band D. Salford still charges more in total, ${h.m2(h.c('salford').bandD)} against ${h.m2(c.bandD)}, because its own city council charge is higher. Moving across the Irwell changes only that local part of the bill.` },
      { q: 'Are Manchester student houses charged council tax?', a: 'Not when everyone living there is a full-time student. The home is exempt and the bill falls to nothing once the council has a student certificate from the university for each occupant. If one adult is not a student, that person pays, with a discount of a quarter if they are the only one who counts.' },
    ];
  },
  body: (h) => {
    const c = h.c('manchester'); const p = c.parts;
    const list = GM.map((id) => h.c(id));
    const tr = h.P.referendum.exceptions2627.find((x) => x.name === 'Trafford')!;
    const rows = [...list].sort((x, y) => x.bandD - y.bandD).map((x) => [x.id === 'manchester' ? '<strong>Manchester</strong>' : h.ca(x.id), h.m2(h.E.bandCharge(x, 0)), h.m2(x.parts.council + x.parts.parish), h.m2(x.bandD)]);
    const mayor = p.police + p.combined;
    const top = [...list].sort((x, y) => y.bandD - x.bandD).slice(0, 3);
    return `
<h2>All eight bands in Manchester</h2>
${h.bandTable('manchester')}
<p>A Band A home pays six ninths of Band D and a Band H home eighteen ninths. The band was fixed on 1991 values, so recent price rises in the city centre have not moved any home into a higher band.</p>

<h2>The Mayor's two precepts</h2>
<p>Greater Manchester has an elected mayor who also holds the powers of police and crime commissioner. That is why the bill shows two mayoral lines. The police and crime precept, ${h.m2(p.police)} at Band D, funds Greater Manchester Police and rose by the ${h.m(h.P.referendum.england.policeCash)} that police bodies could add this year. The general precept, ${h.m2(p.combined)}, covers the fire and rescue service and a set of mayoral programmes; the Combined Authority puts the larger part of it towards fire cover.</p>
<p>Together the two take ${h.m2(mayor)} of a Band D bill, or ${h.pc(mayor / c.bandD, 1)} of it. The city council keeps the remaining ${h.m2(p.council)}, of which ${h.m2(p.asc!)} is the adult social care precept. Manchester has no parish councils, so nothing else is added.</p>

<h2>Ten boroughs, one mayor</h2>
<p>Since the mayoral precepts are the same everywhere, the ranking below is driven only by each borough's own charge, shown in the middle column. Sorted from the cheapest:</p>
${h.table(['Borough', 'Band A', 'Borough charge at D', 'Band D total'], rows, `${h.P.taxYear}, two adults, main home. Mayoral police and general precepts included in the totals.`, ['l', 'r', 'r', 'r'])}
<p>Trafford was one of a handful of councils given a higher limit this year, ${h.pc(tr.limit)} instead of the usual ${h.pc(h.P.referendum.england.total)}. ${top.map((x) => x.name).join(', ').replace(/, ([^,]*)$/, ' and $1')} have the dearest totals. For Liverpool, Lancashire, Cheshire and Cumbria too, see the ${h.a('region-north-west', 'North West overview')}.</p>

<h2>Students, sharers and single adults</h2>
<p>Manchester has one of the largest student populations in the country, and the rules for them are national. A house shared only by full-time students owes nothing; a mixed house pays, with the students ignored when the adults are counted. The ${h.src('gov_students', 'GOV.UK page for students')} and the ${h.a('council-tax-students', 'student guide')} explain the certificates involved. A working adult sharing with students is treated as living alone and gets ${h.pc(h.P.discounts.singlePerson)} off, the ${h.a('council-tax-single-person-discount', 'single person discount')}.</p>

<h2>Before you rely on the figure</h2>
<p>The calculator does not know about Council Tax Support, the city's scheme for low incomes, which comes off after every discount. Premiums on second homes and on homes empty for a year or more are local choices: check what Manchester charges this year and type the rate in. The ${h.a('council-tax-increase-2026', 'page on the 2026 increase')} explains how the limits worked for every council.</p>
`;
  },
});
