import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'scotland-council-tax',
  group: 'nations',
  order: 10,
  mini: { kind: 'mini:scotland-water', props: { council: 'stirling', band: 4 } },
  related: ['region-scotland', 'council-tax-glasgow-city', 'council-tax-city-of-edinburgh', 'second-home-council-tax'],
  sources: ['leg_scot_ratios', 'scot_datasets', 'scot_water', 'highland_charges', 'saa', 'scot_circular_2026'],
  slug: 'scotland-council-tax',
  nav: 'Scotland',
  card: 'Bands on 1991 values, the ratios changed in 2017, Scottish Water on the bill and the 2026 premiums.',
  title: 'Council Tax Scotland 2026/27: Bands, Ratios and Water Bills',
  description: 'Council tax in Scotland for 2026/27: bands on 1991 values, the 2017 ratios, Scottish Water charges, assessors and the new premiums on second and empty homes.',
  h1: 'Council tax in Scotland, 2026/27',
  intro: 'Same eight letters as England, but different values, different ratios, a water bill on top and its own assessors.',
  resume: (h) => {
    const P = h.P; const S = P.bands.scotland; const st = h.E.bill({ council: 'stirling', band: 4 });
    return `Scottish council tax uses eight bands, A to H, based on what a home would have sold for on ${S.valuationDate}, but the value ranges are lower than in England, from ${S.ranges[0]} for Band A to ${S.ranges[7]} for Band H. Since ${S.ratioChange.split(' (')[0]} the four upper bands pay a larger share of Band D than before, under the Council Tax (Substitution of Proportion) (Scotland) Order 2016: Band E now pays ${S.num[4]}/${S.den} of Band D and Band H ${S.num[7]}/${S.den}. Each council adds Scottish Water's water and waste water charges, which are the same everywhere and rose ${h.pc(P.scottishWater.increase)} this year. A Band E home in Stirling with two adults pays ${h.m2(st.councilTax)} of council tax plus ${h.m2(st.water + st.sewerage)} for water, ${h.m2(st.annual)} in all for ${P.taxYear}. Bands are set by local assessors, not by the Valuation Office Agency, and from ${h.date(P.premiums.scotland.from)} councils charge second homes and long-term empty homes a premium of ${h.pc(P.premiums.scotland.default)} by default.`;
  },
  faqs: (h) => {
    const P = h.P; const W = P.scottishWater;
    const sh = h.E.bill({ council: 'shetland-islands', band: 1 }); const shOne = h.E.bill({ council: 'shetland-islands', band: 1, household: 'one' });
    return [
      { q: 'Why is my Scottish council tax bill higher than the band charge my council publishes?', a: `Because the published band charge is council tax only, and the bill also carries Scottish Water's charges. At Band D they add ${h.m2(W.water[3])} for water and ${h.m2(W.sewerage[3])} for waste water in ${W.year}, whichever council you live in. The council collects them with the tax and passes them on to Scottish Water.` },
      { q: 'Does the single person discount in Scotland reduce the water charges too?', a: `Yes. The ${h.pc(P.discounts.singlePerson)} comes off the council tax and off both Scottish Water charges. In Shetland a Band B home with two adults pays ${h.m2(sh.annual)} including water, and an adult living alone pays ${h.m2(shOne.annual)}. A premium on a second home, by contrast, is never applied to the water charges.` },
      { q: 'Who decides my council tax band in Scotland?', a: 'The assessor for your area, an independent official who keeps the council tax valuation list. The Scottish Assessors Association website lets you search any address. If you think a band is wrong you make a proposal to the assessor, normally within six months of becoming the owner or the person liable, and an appeal goes to the Local Taxation Chamber.' },
      { q: 'Do I pay waste water charges if my house has a septic tank in Scotland?', a: 'No. The waste water charge is only due on homes connected to the public sewer, and the water charge only on homes supplied by Scottish Water. A rural home with a septic tank and a mains supply pays the council tax and the water charge alone; tell the council if the bill includes a charge for a service you do not receive.' },
    ];
  },
  body: (h) => {
    const P = h.P; const S = P.bands.scotland; const W = P.scottishWater; const avg = P.averages.scotland.bandD;
    const rows = S.letters.map((l, i) => [`Band ${l}`, S.ranges[i], `${S.num[i]}/${S.den}`, `${W.ratioNum[i]}/${W.ratioDen}`, h.m2(avg * S.num[i] / S.den)]);
    const ab = h.c('aberdeenshire'); const old = (c: typeof ab, b: number) => c.bandD * W.ratioNum[b] / W.ratioDen;
    const gNow = h.E.bandCharge(ab, 6), gOld = old(ab, 6), hNow = h.E.bandCharge(ab, 7), hOld = old(ab, 7);
    const wrows = S.letters.map((l, i) => [`Band ${l}`, h.m2(W.water[i]), h.m2(W.sewerage[i]), h.m2(W.water[i] + W.sewerage[i]), h.m2((W.water[i] + W.sewerage[i]) / P.instalments.default)]);
    const ar = h.E.bill({ council: 'argyll-and-bute', band: 4 }), arSec = h.E.bill({ council: 'argyll-and-bute', band: 4, occupancy: 'second' });
    const mo = h.E.bill({ council: 'moray', band: 2, household: 'one', water: false });
    const fife = h.E.bill({ council: 'fife', band: 3 });
    return `
<h2>The eight Scottish bands and what each one pays</h2>
<p>A Scottish band records the open market value a home would have had on ${S.valuationDate}, with the size, layout and location it has now. The ranges are lower than England's for the same letters, because Scottish prices were lower in 1991. The last column applies each ratio to the Scottish average Band D of ${h.m2(avg)} for ${P.taxYear}, before water.</p>
${h.table(['Band', `Value on ${S.valuationDate}`, 'Share of D now', 'Share of D before 2017', 'At the average Band D'], rows, `${P.taxYear}. Average Band D from the Scottish Government datasets, water and waste water excluded.`, ['l', 'l', 'l', 'l', 'r'])}
<p>The Band D figures for each of the ${h.E.inNation('scotland').length} councils come from the ${h.src('scot_datasets', 'Scottish Government council tax datasets')}. They are lower than the English average of ${h.m2(P.averages.england.bandD)}, partly because Scottish bills do not include police or fire precepts: Police Scotland and the Scottish Fire and Rescue Service are national bodies funded by the Scottish Government.</p>

<h2>One value, two different letters</h2>
<p>Because the Scottish ranges are narrower, the same 1991 value lands in a higher letter north of the border. A house that would have fetched £50,000 in April 1991 is in Band ${h.E.letters('england')[h.E.bandFromValue('england', 50000)]} in England but Band ${S.letters[h.E.bandFromValue('scotland', 50000)]} in Scotland; one worth £100,000 is Band ${h.E.letters('england')[h.E.bandFromValue('england', 100000)]} in England and Band ${S.letters[h.E.bandFromValue('scotland', 100000)]} in Scotland. Comparing letters between the two countries therefore says little about what a home costs. The fair comparison is the bill itself, band charge plus water, for the address you are looking at.</p>
<p>The letters also tell you nothing about today's price. Both England and Scotland still band homes on their 1991 values, more than thirty years ago, and neither has held a general revaluation since council tax began in 1993. Scotland has looked at reform several times, and the change of ratios in 2017 was the main result so far: it made larger homes pay more without revaluing anyone. Any further reform of the Scottish bands is to come, and no new valuation date has been set.</p>

<h2>The 2017 change to the upper bands</h2>
<p>Until March 2017 the Scottish ratios were the same as in England: six ninths of Band D for Band A up to eighteen ninths for Band H. The ${h.src('leg_scot_ratios', 'Council Tax (Substitution of Proportion) (Scotland) Order 2016')} raised the proportions of Bands E, F, G and H from ${S.ratioChange.split(' (')[0]}, with ${S.ratioChange.split(' (')[1].replace(')', '').replace('raised', 'increased')}. Bands A to D did not move.</p>
<p>The effect is easy to measure in Aberdeenshire, where Band D is ${h.m2(ab.bandD)} this year. A Band G home pays ${h.m2(gNow)}; on the pre-2017 ratio it would pay ${h.m(gOld)}, so the change adds ${h.m(gNow - gOld)} a year. In Band H the gap is ${h.m(hNow - hOld)}: ${h.m2(hNow)} against ${h.m(hOld)}. The old ratios have not disappeared entirely: Scottish Water still sets its charges on them, as the next table shows.</p>

<h2>Scottish Water charges on the council tax bill</h2>
<p>Every council in Scotland collects water and waste water charges for Scottish Water with the council tax. They depend only on the band, not on the council, and for ${W.year} they rose by ${h.pc(W.increase)} (${h.src('scot_water', 'Scottish Water, charges 2026 to 2027')}):</p>
${h.table(['Band', 'Water', 'Waste water', 'Both', `Each of ${P.instalments.default} payments`], wrows, `Scottish Water, ${W.year}. Charged in every council area.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Three rules change these figures for some homes. The ${h.pc(P.discounts.singlePerson)} single occupier discount applies to the water charges as well as to the tax, and so does the Disabled Band Reduction, as the ${h.src('highland_charges', 'Highland Council table for 2026 to 2027')} sets out. People who receive Council Tax Reduction can get a reduction of up to ${h.pc(W.ctrReductionMax)} on the water charges. And the charges only apply to the services a home actually receives: a cottage in Moray on a private water supply and a septic tank, lived in by one adult in Band C, pays ${h.m2(mo.annual)} of council tax and no water charges at all.</p>

<h2>Assessors, not the Valuation Office Agency</h2>
<p>In England and Wales bands are set by the Valuation Office Agency. In Scotland the job belongs to local assessors, each covering one or several council areas, and the ${h.src('saa', 'Scottish Assessors Association')} publishes the band of every address. A new home is banded by the assessor when it is completed. An existing home keeps its band until a sale after extension or improvement, a demolition or a successful appeal on a similar property gives the assessor a reason to look again.</p>
<p>If you think a band is too high, the route is a proposal to the assessor. A new owner, tenant or other person liable can lodge one within six months of becoming liable; outside that window the grounds are narrow, for example when a comparable home in the same street has had its band lowered on appeal. The assessor considers the proposal and, if it is refused, the appeal is heard by the Local Taxation Chamber of the First-tier Tribunal for Scotland. A proposal can lead to a higher band as well as a lower one.</p>

<h2>Second homes and empty homes from 1 April 2026</h2>
<p>The rules changed this year. Regulations made in 2025 set a national default premium of ${h.pc(P.premiums.scotland.default)} on second homes and on homes empty for ${P.premiums.scotland.emptyFromYears} year or more, and each council can set a different rate, higher or lower, or none at all (${h.src('scot_circular_2026', 'Scottish Government finance circular 6/2026')}). A second home here means a furnished home that is nobody's main residence but is lived in for at least ${P.premiums.scotland.minOccupationDays} days in a 12 month period. The premium applies to the council tax only, never to the water charges.</p>
<p>On a Band E holiday home in Argyll and Bute at the default rate, the bill goes from ${h.m2(ar.annual)} as a main home with two adults to ${h.m2(arSec.annual)}. Some councils charge the full default, some have chosen a different rate, and the calculator above lets you type the rate your council has set. One protection already in force since 2023 stays: the empty homes premium cannot be charged for six months after a new owner buys a home that has been empty for at least 12 months, while it is being repaired or renovated.</p>

<h2>Discounts and reductions that work the same way</h2>
<p>The main reductions mirror the rest of Britain. One adult who counts gets ${h.pc(P.discounts.singlePerson)} off, a home where nobody counts gets ${h.pc(P.discounts.allDisregarded)}, and a home where every resident is a full-time student is exempt. The Disabled Band Reduction moves the charge one band lower, and in Band A to 200/360 of Band D. Council Tax Reduction for people on a low income is claimed from the council under Scottish rules, and it brings the water charge reduction with it.</p>

<h2>Reading a typical Scottish bill</h2>
<p>A Band D home in Fife with two adults is billed ${h.m2(fife.annual)} for ${P.taxYear}: ${h.m2(fife.councilTax)} of council tax and ${h.m2(fife.water + fife.sewerage)} of water and waste water. Collected over ${P.instalments.default} months, each instalment is about ${h.m2(fife.annual / P.instalments.default)}. Scottish councils usually set their rates in February, and the figures for 2027/28 are to come. The ${h.a('region-scotland', `table of all ${h.E.inNation('scotland').length} councils`)} ranks them by Band D, and the pages on ${h.ca('glasgow-city')} and ${h.ca('city-of-edinburgh')} go through those two cities band by band.</p>
`;
  },
});
