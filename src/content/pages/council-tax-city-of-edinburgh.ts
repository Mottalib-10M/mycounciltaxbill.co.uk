import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-city-of-edinburgh',
  group: 'councils',
  order: 190,
  tool: { kind: 'ct', props: { council: 'city-of-edinburgh', band: 4 } },
  related: ['region-scotland', 'second-home-council-tax', 'council-tax-glasgow-city', 'scotland-council-tax'],
  sources: ['scot_datasets', 'scot_circular_2026', 'scot_water', 'saa'],
  slug: 'edinburgh-council-tax',
  nav: 'Edinburgh',
  card: 'Edinburgh bands for 2026/27 with water included, the city\'s second home premium and how it compares with the Lothians.',
  title: 'Edinburgh Council Tax 2026/27: Bands and Second Home Charge',
  description: 'Edinburgh council tax 2026/27 for every band with Scottish Water charges, the city\'s second home premium, the rise decided for January 2027 and nearby areas.',
  h1: 'City of Edinburgh council tax 2026/27',
  intro: 'A Band D rate close to the Scottish average, water charges on the same bill, and a second home premium that is due to rise before the year ends.',
  resume: (h) => {
    const c = h.c('city-of-edinburgh'); const ch = h.E.change(c)!;
    const e = h.E.bill({ council: 'city-of-edinburgh', band: 4 });
    const avg = h.P.averages.scotland.bandD;
    return `The City of Edinburgh Council charges ${h.m2(c.bandD)} at Band D for ${h.P.taxYear}, ${h.pc(ch.rate, 1)} more than the ${h.m2(c.bandDPrev!)} of 2025/26 and ${h.m(Math.abs(avg - c.bandD))} ${c.bandD < avg ? 'below' : 'above'} the Scottish average of ${h.m2(avg)}. A Band E home, where the calculator starts, is charged ${h.P.bands.scotland.num[4]}/${h.P.bands.scotland.den} of Band D: ${h.m2(e.councilTax)} of council tax, to which the council adds ${h.m2(e.water + e.sewerage)} of Scottish Water charges, for a total of ${h.m2(e.annual)}. Spread over ten months that is ${h.m2(e.regular)} a month after a first payment of ${h.m2(e.first)}. Second homes in the city have paid double since 1 April 2024. For ${h.P.taxYear} the premium stays at 100 %, after a planned rise to 300 % in April 2026 was suspended; the council has since decided to apply 300 % from 1 January 2027, so revised bills are to come. The council says this brought second homes into line with its policy on long-term empty homes.`;
  },
  faqs: (h) => {
    const c = h.c('city-of-edinburgh');
    const s = h.E.bill({ council: 'city-of-edinburgh', band: 5, occupancy: 'second', premium: h.P.premiums.scotland.default });
    return [
      { q: 'How much does a second home in Edinburgh pay in 2026/27?', a: `Twice the normal council tax, plus the standard water charges, which are not doubled. A Band F flat used as a second home pays ${h.m2(s.annual)} for ${h.P.taxYear}, against ${h.m2(h.E.bill({ council: 'city-of-edinburgh', band: 5 }).annual)} for a main home. The council has decided to raise the premium to 300 % from 1 January 2027, with revised bills expected in December 2026.` },
      { q: 'Is Edinburgh council tax cheaper than Midlothian?', a: `Yes at every band, because the two councils use the same ratios and Edinburgh's Band D of ${h.m2(c.bandD)} is lower than Midlothian's ${h.m2(h.c('midlothian').bandD)} for ${h.P.taxYear}. The Scottish Water charges are identical in both, so the gap on a Band D bill is ${h.m(h.c('midlothian').bandD - c.bandD)} a year.` },
      { q: 'Does a short-term let in Edinburgh pay council tax or business rates?', a: 'A home let to visitors can move from council tax to non-domestic rates if it is available and actually let for enough days in the year under the Scottish rules. If it does not meet those tests, and nobody lives in it as a main home, it is treated as a second home and the city\'s premium applies. The assessor decides which list it belongs on.' },
    ];
  },
  body: (h) => {
    const c = h.c('city-of-edinburgh'); const S = h.P.bands.scotland;
    const near = ['east-lothian', 'midlothian', 'west-lothian', 'fife', 'scottish-borders', 'glasgow-city'];
    const rows = [c, ...near.map((id) => h.c(id))].sort((x, y) => x.bandD - y.bandD).map((x) => [x.id === c.id ? '<strong>City of Edinburgh</strong>' : h.ca(x.id), h.m2(x.bandD), h.m2(h.E.bandCharge(x, 4)), h.m2(h.E.bandCharge(x, 6)), x.bandDPrev ? h.pc(h.E.change(x)!.rate, 1) : 'n/a']);
    const r = h.E.rankIn(c, h.E.inNation('scotland'));
    const g = h.E.bill({ council: 'city-of-edinburgh', band: 6 });
    const gs = h.E.bill({ council: 'city-of-edinburgh', band: 6, occupancy: 'second', premium: h.P.premiums.scotland.default });
    return `
<h2>Edinburgh charges for ${h.P.taxYear}</h2>
${h.bandTable('city-of-edinburgh')}
<p>Each figure combines the band charge and the water and waste water charges, which ${h.src('scot_water', 'Scottish Water')} sets for every Scottish home and the council collects. In Band G, council tax alone is ${h.m2(g.councilTax)} and water adds ${h.m2(g.water + g.sewerage)}. The Band G ratio of ${S.num[6]}/${S.den} is steeper than England's fifteen ninths, which is why upper band homes in Scotland pay comparatively more.</p>

<h2>The second home premium, step by step</h2>
<p>Scottish councils have been able to charge more on second homes since April 2024. According to the City of Edinburgh Council, its own timeline is:</p>
<ul>
<li>from 1 April 2024, second homes paid 200 % of the normal council tax, a premium of 100 %;</li>
<li>a rise to a 300 % premium planned for 1 April 2026 was suspended, so ${h.P.taxYear} bills carry the standard charge plus 100 %;</li>
<li>on 27 August 2026 the council decided to move from 100 % to 300 % with effect from 1 January 2027, with revised bills to follow in December 2026.</li>
</ul>
<p>The premium applies to council tax only. A Band G second home pays ${h.m2(gs.annual)} for ${h.P.taxYear} at the current rate. The amount from January 2027 is to come once revised bills are issued. The national framework is in the ${h.src('scot_circular_2026', 'Scottish Government circular of March 2026')}, and the ${h.a('second-home-council-tax', 'second home guide')} compares the rules across the UK.</p>

<h2>Edinburgh, the Lothians and Fife</h2>
${h.table(['Council', 'Band D', 'Band E', 'Band G', 'Change on 2025/26'], rows, `${h.P.taxYear}, council tax only, from the ${h.src('scot_datasets', 'Scottish Government datasets')}. Sorted from the lowest Band D.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Edinburgh ranks ${r.rank} of ${r.of} Scottish councils from the highest Band D. Commuters weighing a move to ${h.ca('midlothian')} or ${h.ca('west-lothian')} should compare bands as well as rates, because the same price buys a different band in each area. The ${h.a('region-scotland', 'Scotland page')} has the full table.</p>

<h2>Discounts for main homes</h2>
<p>The premium only concerns homes nobody lives in. For a main home, an adult living alone gets ${h.pc(h.P.discounts.singlePerson)} off both the council tax and the water charges, which brings a Band E bill to ${h.m2(h.E.bill({ council: 'city-of-edinburgh', band: 4, household: 'one' }).annual)}. A flat shared only by full-time students is exempt, and a home adapted for a disabled resident is charged one band lower.</p>

<h2>Checking and appealing a band in Edinburgh</h2>
<p>Bands are set by the local assessor, not by the council, and the ${h.src('saa', 'Scottish Assessors Association portal')} shows the band of every address. A new owner has a limited window after moving in to appeal, so check soon after buying. The ${h.a('scotland-council-tax', 'Scottish council tax guide')} explains the Scottish appeal route and the discounts.</p>
`;
  },
});
