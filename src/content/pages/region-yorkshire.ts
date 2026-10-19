import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'region-yorkshire',
  group: 'regions',
  order: 30,
  tool: { kind: 'ct', props: { council: 'kirklees', band: 1 } },
  related: ['council-tax-leeds', 'council-tax-sheffield', 'council-tax-bradford', 'check-council-tax-band'],
  sources: ['mhclg_levels', 'mhclg_release', 'voa_check'],
  slug: 'yorkshire-council-tax',
  nav: 'Yorkshire and the Humber',
  card: 'All 15 Yorkshire and Humber councils, with the three police areas and the mayors.',
  title: 'Yorkshire Council Tax 2026/27: All 15 Councils by Band',
  description: 'Yorkshire and the Humber council tax 2026/27 for all 15 councils, Doncaster to North Yorkshire: Bands A, D and H, the change on last year and police shares.',
  h1: 'Yorkshire and the Humber council tax 2026/27',
  intro: 'Fifteen councils, each sending a single bill, and four police forces that explain much of the difference between them.',
  resume: (h) => {
    const L = h.E.inRegion('Yorkshire and the Humber'); const s = [...L].sort((a, b) => a.bandD - b.bandD); const lo = s[0], hi = s[s.length - 1];
    return `Every council in Yorkshire and the Humber is now a single tier: nine metropolitan boroughs in West and South Yorkshire, and six unitary councils including North Yorkshire, created in 2023 from the old county and its districts. For ${h.P.taxYear} their Band D charges for two adults run from ${h.m2(lo.bandD)} in ${lo.name} to ${h.m2(hi.bandD)} in ${hi.name}, with a simple average of ${h.m2(h.E.average(L))}. The four police forces set different precepts: West Yorkshire's is ${h.m2(h.c('leeds').parts.police)} at Band D, South Yorkshire's ${h.m2(h.c('doncaster').parts.police)}, Humberside's ${h.m2(h.c('kingston-upon-hull').parts.police)} and North Yorkshire's ${h.m2(h.c('north-yorkshire').parts.police)}. In West and South Yorkshire the elected mayor sets the police precept. Most homes in the region are in Bands A to C, so the usual bill is between two thirds and eight ninths of the Band D figure.`;
  },
  faqs: (h) => [
    { q: 'Who sets the police part of council tax in West Yorkshire?', a: `The Mayor of West Yorkshire, who took over the police and crime commissioner's role. The police precept for ${h.P.taxYear} is ${h.m2(h.c('leeds').parts.police)} at Band D in all five West Yorkshire councils, scaled by band. It is shown as a separate line on bills from Leeds, Bradford, Kirklees, Calderdale and Wakefield.` },
    { q: 'Why is North Yorkshire council tax higher than Leeds?', a: `North Yorkshire's Band D of ${h.m2(h.c('north-yorkshire').bandD)} includes a higher police precept, a combined authority precept and many parish and town councils, averaging ${h.m2(h.c('north-yorkshire').parts.parish)} at Band D. Leeds charges ${h.m2(h.c('leeds').bandD)}. Bands also differ: rural North Yorkshire has more homes in the upper bands.` },
    { q: 'Is Hull council tax among the lowest in Yorkshire?', a: `Hull's Band D for ${h.P.taxYear} is ${h.m2(h.c('kingston-upon-hull').bandD)}, ranked ${h.E.rankIn(h.c('kingston-upon-hull'), h.E.inRegion('Yorkshire and the Humber')).rank} of 15 in the region from the dearest. Because most homes in Hull are in Band A, the bill most households receive is two thirds of that figure, and less again for a single adult.` },
  ],
  body: (h) => {
    const L = h.E.inRegion('Yorkshire and the Humber'); const W = ['leeds', 'bradford', 'kirklees', 'calderdale', 'wakefield'].map((id) => h.c(id));
    const ny = h.c('north-yorkshire');
    return `
<h2>The fifteen councils</h2>
${h.councilTable(L, `Two adults, main home, ${h.P.taxYear}. Police, fire, combined authority and average parish precepts included.`)}

<h2>West Yorkshire: one police line, five council charges</h2>
<p>The five West Yorkshire councils share the same police and fire precepts, so their differences are entirely their own: ${W.map((c) => `${c.name} ${h.m2(c.bandD)}`).join(', ')} at Band D. In a Band B home, which is the most common band in Bradford and Kirklees, the gap between the cheapest and the dearest of the five is ${h.m(Math.max(...W.map((c) => h.E.bandCharge(c, 1))) - Math.min(...W.map((c) => h.E.bandCharge(c, 1))))} a year.</p>

<h2>North Yorkshire and York</h2>
<p>North Yorkshire Council and the City of York share a mayoral combined authority, which adds ${h.m2(ny.parts.combined)} at Band D to both; on their bills it takes the place of a separate fire line. North Yorkshire has ${ny.parishes} parishes and towns, more than any other council in the region, and its parish average hides a wide range: some villages pay almost nothing, some market towns well above the average. Your bill names your parish and its exact charge.</p>

<h2>The Humber</h2>
<p>Hull, the East Riding, North Lincolnshire and North East Lincolnshire form the Humber part of the region, policed by Humberside Police. ${h.ca('kingston-upon-hull', 'Hull')} has one of the highest shares of Band A homes in England, while the ${h.ca('east-riding-of-yorkshire', 'East Riding')}, with its villages and coast, has many more homes in Bands D to F. The same Band D charge therefore means a very different average bill in each.</p>

<h2>South Yorkshire</h2>
<p>Barnsley, Doncaster, Rotherham and Sheffield share South Yorkshire Police and South Yorkshire Fire, which together add ${h.m2(h.c('doncaster').parts.police + h.c('doncaster').parts.fire)} at Band D. ${h.ca('doncaster', 'Doncaster')} has the lowest Band D in the region at ${h.m2(h.c('doncaster').bandD)}, while ${h.ca('sheffield', 'Sheffield')} charges ${h.m2(h.c('sheffield').bandD)}. Doncaster, with ${h.c('doncaster').parishes} parishes, also has more parish councils than Sheffield, whose city area has very few, so the gap between the two council charges themselves is even wider than the totals suggest.</p>

<h2>Using the calculator</h2>
<p>The calculator above opens on Kirklees, Band B. Choose your council and band, then the household. The bill is worked out from the official Band D figure using the national ratios, so it matches your council's table to the penny, apart from the parish part, which is averaged. In North Yorkshire, with its hundreds of parishes, check the exact parish figure on your bill.</p>
`;
  },
});
