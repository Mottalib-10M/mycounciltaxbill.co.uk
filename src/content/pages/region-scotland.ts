import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'region-scotland',
  group: 'regions',
  order: 110,
  tool: { kind: 'ct', props: { council: 'fife', band: 2 } },
  related: ['scotland-council-tax', 'council-tax-glasgow-city', 'council-tax-city-of-edinburgh', 'council-tax-increase-2026'],
  sources: ['scot_datasets', 'scot_water', 'saa'],
  slug: 'scotland-council-tax-by-council',
  nav: 'Scotland',
  card: 'All Scottish councils ranked by Band D for 2026/27, with the rise on last year and water on top.',
  title: 'Scottish Council Tax by Council 2026/27: Bands A to H',
  description: 'Scottish council tax 2026/27 for all 32 councils, from Midlothian to South Lanarkshire, with Band A, D and H, the rise on last year and the water charges.',
  h1: 'Scottish council tax 2026/27, council by council',
  intro: 'Every Scottish council by Band D, with one water bill shared by all and rises well above the English limit.',
  resume: (h) => {
    const L = h.E.inRegion('Scotland'); const s = [...L].sort((a, b) => b.bandD - a.bandD); const hi = s[0], lo = s[s.length - 1];
    const W = h.P.scottishWater; const rs = [...L].sort((a, b) => h.E.change(b)!.rate - h.E.change(a)!.rate);
    return `The ${L.length} Scottish councils charge between ${h.m2(lo.bandD)} at Band D in ${lo.name} and ${h.m2(hi.bandD)} in ${hi.name} for ${h.P.taxYear}, before water. On top of that every Band D home pays ${h.m2(W.water[3] + W.sewerage[3])} to Scottish Water for water and waste water, the same in every council. The Scottish Government's average Band D, weighted by the number of homes in each council, is ${h.m2(h.P.averages.scotland.bandD)}. Bills rose sharply after the national freeze of 2024/25 came to an end: the increase for ${h.P.taxYear} ranges from ${h.pc(h.E.change(rs[rs.length - 1])!.rate, 1)} in ${rs[rs.length - 1].name} to ${h.pc(h.E.change(rs[0])!.rate, 1)} in ${rs[0].name}. Scottish bills contain no police or fire precept and no parish share, so the whole council tax figure is the council's own. Band A pays ${h.P.bands.scotland.num[0]}/${h.P.bands.scotland.den} of Band D and Band H ${h.P.bands.scotland.num[7]}/${h.P.bands.scotland.den}.`;
  },
  faqs: (h) => {
    const L = h.E.inRegion('Scotland'); const s = [...L].sort((a, b) => a.bandD - b.bandD);
    const isl = ['shetland-islands', 'orkney-islands', 'na-h-eileanan-siar'].map((id) => h.c(id));
    return [
      { q: 'Which council in Scotland has the lowest council tax for 2026/27?', a: `${s[0].name}, at ${h.m2(s[0].bandD)} for Band D before water, followed by ${s[1].name} at ${h.m2(s[1].bandD)} and ${s[2].name} at ${h.m2(s[2].bandD)}. With Scottish Water's charges added, a Band D home in ${s[0].name} pays ${h.m2(h.E.bill({ council: s[0].id, band: 3 }).annual)} in total for the year.` },
      { q: 'Is council tax lower on the Scottish islands?', a: `Two of the three island councils are among the cheapest: ${isl[0].name} charges ${h.m2(isl[0].bandD)} at Band D and ${isl[2].name} ${h.m2(isl[2].bandD)}. ${isl[1].name} is closer to the middle of the table at ${h.m2(isl[1].bandD)}. Water charges are the same as on the mainland.` },
      { q: 'Why did Scottish council tax rise so much in 2026?', a: 'Each Scottish council sets its own Band D charge, and no referendum limit like the English one applies. Many councils used that freedom to close budget gaps for 2026/27, and several set rises well above the English limit, as the change column of the table shows. Water and waste water charges rose on top, by the same percentage everywhere.' },
    ];
  },
  body: (h) => {
    const L = h.E.inRegion('Scotland'); const W = h.P.scottishWater;
    const f = h.c('fife'); const fb = h.E.bill({ council: 'fife', band: 2 }); const fOne = h.E.bill({ council: 'fife', band: 2, household: 'one' });
    const simple = h.E.average(L);
    const over = L.filter((c) => h.E.change(c)!.rate > h.P.referendum.england.total).length;
    return `
<h2>All Scottish councils, ${h.P.taxYear}</h2>
${h.councilTable(L, `Council tax only, two adults, main home, ${h.P.taxYear}. Scottish Water charges are added to every bill. Sorted from the highest Band D.`)}
<p>Band D figures come from the ${h.src('scot_datasets', 'Scottish Government council tax datasets')}. A plain average of the ${L.length} councils gives ${h.m2(simple)}, slightly above the weighted national figure, because several of the largest councils by number of homes, such as South Lanarkshire, North Lanarkshire, Fife and Edinburgh, sit in the lower half of the table.</p>

<h2>Rises above the English limit</h2>
<p>Councils in England cannot raise their charge by more than ${h.pc(h.P.referendum.england.total)} without a local referendum. Scotland has no such rule this year, and ${over} of the ${L.length} Scottish councils raised Band D by more than that. The highest rises are in the right-hand column; most of the councils with the largest increases are rural or mixed areas, while the big cities rose less.</p>

<h2>The water part of the bill</h2>
<p>Each band also pays ${h.src('scot_water', 'Scottish Water')}'s two charges, which this year went up by ${h.pc(W.increase)}. At Band A they total ${h.m2(W.water[0] + W.sewerage[0])}, at Band D ${h.m2(W.water[3] + W.sewerage[3])} and at Band H ${h.m2(W.water[7] + W.sewerage[7])}. The calculator includes them automatically and leaves them out if you select a home without a mains connection.</p>

<h2>Reading the ranking with care</h2>
<p>A low Band D figure does not always mean a low bill. Council areas differ in their mix of homes: in Edinburgh, East Dunbartonshire or East Renfrewshire a large share of homes sits in Bands E to H, which pay more than Band D, while in Glasgow, Inverclyde or North Lanarkshire most homes are in Bands A to C. The amount a household actually pays depends on the band of its own home, so compare the column for your band rather than Band D alone. Since the upper bands were made dearer in 2017, that gap between the band columns is wider in Scotland than in England.</p>

<h2>Using the calculator for a Scottish home</h2>
<p>The calculator opens on Fife, Band C, where two adults pay ${h.m2(fb.annual)} with water, or ${h.m2(fb.annual / h.P.instalments.default)} in each of ${h.P.instalments.default} instalments. Living alone brings the bill to ${h.m2(fOne.annual)}, because the ${h.pc(h.P.discounts.singlePerson)} discount applies to water too. Fife's Band D charge is ${h.m2(f.bandD)}, up ${h.pc(h.E.change(f)!.rate, 1)}. Pick your council and band; if you do not know the band, the ${h.src('saa', 'Scottish Assessors Association search')} gives it for any address.</p>
${h.box('Second and empty homes', `<p>Since ${h.date(h.P.premiums.scotland.from)} the default premium on second homes and long-term empty homes is ${h.pc(h.P.premiums.scotland.default)}, but each council can set its own rate. The ${h.a('scotland-council-tax', 'Scottish council tax guide')} explains the rules, bands and ratios in detail.</p>`, 'info')}
`;
  },
});
