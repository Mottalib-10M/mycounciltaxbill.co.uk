import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'region-london',
  group: 'regions',
  order: 70,
  tool: { kind: 'ct', props: { council: 'lambeth', band: 2 } },
  related: ['council-tax-wandsworth', 'council-tax-westminster', 'council-tax-bands', 'council-tax-increase-2026'],
  sources: ['mhclg_levels', 'mhclg_release', 'gov_who_pays'],
  slug: 'london-council-tax',
  nav: 'London',
  card: 'All 33 London boroughs ranked, with the Greater London Authority share and every band.',
  title: 'London Council Tax 2026/27: All 33 Boroughs by Band',
  description: 'London council tax 2026/27 for all 33 boroughs, from Wandsworth to Kingston upon Thames, with Band A, D and H, the change on last year and the Mayor\'s share.',
  h1: 'London council tax 2026/27, borough by borough',
  intro: 'The same Mayor\'s precept everywhere, then a borough charge that varies by more than a thousand pounds.',
  resume: (h) => {
    const L = h.E.inRegion('London'); const s = [...L].sort((a, b) => a.bandD - b.bandD);
    const lo = s[0], hi = s[s.length - 1], gla = h.c('lambeth').parts.county;
    return `Council tax in London for ${h.P.taxYear} ranges from ${h.m2(lo.bandD)} at Band D in ${lo.name}, the lowest of any council in England, to ${h.m2(hi.bandD)} in ${hi.name}, for a home with two adults. Every borough bill contains the same precept of ${h.m2(gla)} at Band D for the Greater London Authority, which pays for the Metropolitan Police, the London Fire Brigade and the Mayor's other services; the rest is the borough's own charge, and that is where the gap comes from. ${lo.name} and ${s[1].name} keep their own share near ${h.m(lo.parts.council)} thanks partly to large commercial incomes and a long policy of low charges. The average across the ${L.length} London billing authorities, including the City of London, is ${h.m2(h.E.average(L))}. Band A pays two thirds of these figures, Band H twice as much.`;
  },
  faqs: (h) => {
    const city = h.c('city-of-london');
    return [
      { q: 'Why is council tax in the City of London different from the boroughs?', a: `The City of London Corporation has its own police force, so it collects only ${h.m2(city.parts.county)} at Band D for the Greater London Authority instead of the full precept paid in the 32 boroughs. Its total Band D charge is ${h.m2(city.bandD)} for ${h.P.taxYear}, with fewer than ten thousand residents paying it.` },
      { q: 'Do London homes have higher bands than the rest of England?', a: 'Yes. Bands are based on 1991 values and London prices were already high, so a much larger share of London homes sits in Bands E to H than elsewhere in England. A low Band D charge such as Westminster\'s is therefore applied to many homes in the upper bands, and the bill per home is higher than the Band D figure suggests.' },
      { q: 'Which London borough has the highest council tax?', a: 'At Band D, the highest charges for 2026/27 are in outer boroughs: Kingston upon Thames, Croydon and Harrow lead the table below. Croydon was allowed a rise of almost 15 % in 2023 after its financial crisis. Inner boroughs tend to charge less, partly because they draw more income from commercial property.' },
    ];
  },
  body: (h) => {
    const L = h.E.inRegion('London'); const gla = h.c('lambeth').parts.county;
    const inner = L.filter((c) => c.cls.startsWith('Inner')), outer = L.filter((c) => c.cls.startsWith('Outer'));
    const w = h.c('wandsworth'), k = h.c('kingston-upon-thames');
    const gap = h.E.bill({ council: 'kingston-upon-thames', band: 4 }).annual - h.E.bill({ council: 'wandsworth', band: 4 }).annual;
    return `
<h2>All London boroughs, ${h.P.taxYear}</h2>
${h.councilTable(L, `Two adults, main home, ${h.P.taxYear}. Sorted from the highest Band D. The Greater London Authority precept is included.`)}
<p>The average Band D charge is ${h.m2(h.E.average(inner))} in the ${inner.length} inner London authorities and ${h.m2(h.E.average(outer))} in the ${outer.length} outer boroughs. The difference matters for a family moving across the city: a Band E home costs ${h.m(gap)} a year more in ${h.ca('kingston-upon-thames', k.name)} than in ${h.ca('wandsworth', w.name)}, for exactly the same type of house.</p>

<h2>What the Mayor's share pays for</h2>
<p>The Greater London Authority precept is set by the Mayor and approved by the London Assembly. At ${h.m2(gla)} for Band D it is about a quarter of the average London bill, and most of it goes to the Mayor's Office for Policing and Crime. It is the same in all 32 boroughs, which is why the borough charge alone explains the ranking. London has no parish councils except Queen's Park in Westminster, so the parish share is almost nil.</p>

<h2>How fast London bills are rising</h2>
<p>Every London borough raised its charge for ${h.P.taxYear}. Most boroughs added close to the ${h.pc(h.P.referendum.england.total)} allowed without a local referendum, the core limit plus the adult social care precept, and the Greater London Authority added its own increase on top. Because the Mayor's share is a flat sum, it weighs more in a low charging borough: in Wandsworth it is about half the Band D bill, in Kingston upon Thames about a fifth. The column on the right of the table shows each total change against 2025/26, so you can see which boroughs moved least.</p>

<h2>How to use the table and the calculator</h2>
<p>Find your band on the Valuation Office Agency's search service, then read across. The calculator at the top starts on Lambeth, Band C; choose your borough and band, then say who lives in the home. A single adult saves ${h.pc(h.P.discounts.singlePerson)}, a student-only household pays nothing, and an adapted home for a disabled resident is charged one band lower. Many boroughs charge the maximum premium on second homes and on homes left empty, which the calculator applies when you select them.</p>
${h.box('Before you move', `<p>Compare the band of the home with the borough, not only the Band D figure. A Band H home in Westminster pays ${h.m2(h.E.bandCharge(h.c('westminster'), 7))}, less than a Band C home in Croydon at ${h.m2(h.E.bandCharge(h.c('croydon'), 2))}.</p>`, 'tip')}
`;
  },
});
