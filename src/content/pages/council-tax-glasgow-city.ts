import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-glasgow-city',
  group: 'councils',
  order: 180,
  tool: { kind: 'ct', props: { council: 'glasgow-city', band: 2 } },
  related: ['region-scotland', 'scotland-council-tax', 'council-tax-city-of-edinburgh', 'council-tax-single-person-discount'],
  sources: ['scot_datasets', 'scot_water', 'saa', 'scot_circular_2026', 'leg_scot_ratios'],
  slug: 'glasgow-council-tax',
  nav: 'Glasgow',
  card: 'Glasgow bands for 2026/27 with Scottish Water charges included, the Scottish band ratios and how the city compares with its neighbours.',
  title: 'Glasgow Council Tax 2026/27: Bands A to H With Water Charges',
  description: 'Glasgow council tax 2026/27 for every band, with the Scottish Water charges on the same bill, the Scottish band ratios and a comparison with nearby councils.',
  h1: 'Glasgow City council tax 2026/27',
  intro: 'One council, one bill, and two charges on it: council tax for the city and water and waste water for Scottish Water.',
  resume: (h) => {
    const c = h.c('glasgow-city'); const ch = h.E.change(c)!;
    const b = h.E.bill({ council: 'glasgow-city', band: 2 });
    const r = h.E.rankIn(c, h.E.inNation('scotland'));
    return `Glasgow City Council has set its Band D council tax at ${h.m2(c.bandD)} for ${h.P.taxYear}, up from ${h.m2(c.bandDPrev!)}, an increase of ${h.pc(ch.rate, 1)}. That makes Glasgow ${r.rank} of the ${r.of} Scottish councils when ranked from the highest Band D, against a Scottish average of ${h.m2(h.P.averages.scotland.bandD)}. The council also collects Scottish Water's charges, which rose by ${h.pc(h.P.scottishWater.increase, 1)} this year, so the amount you pay is higher than the council tax alone. A Band C flat with two adults pays ${h.m2(b.councilTax)} of council tax plus ${h.m2(b.water)} for water and ${h.m2(b.sewerage)} for waste water, ${h.m2(b.annual)} in all, or ${h.m2(b.regular)} a month over ten instalments. Scottish bands use their own ratios to Band D, expressed in 360ths, and the four top bands have paid more since ${h.P.bands.scotland.ratioChange.split(' (')[0]}. An adult living alone gets ${h.pc(h.P.discounts.singlePerson)} off both charges.`;
  },
  faqs: (h) => {
    const c = h.c('glasgow-city');
    const w = h.E.bill({ council: 'glasgow-city', band: 0 });
    return [
      { q: 'Is the water charge on a Glasgow council tax bill the same in every band?', a: `No. Scottish Water sets a charge for each band and the council collects it with council tax. In ${h.P.taxYear} a Band A home pays ${h.m2(w.water + w.sewerage)} for water and waste water combined, while Band H pays ${h.m2(h.P.scottishWater.water[7] + h.P.scottishWater.sewerage[7])}. These amounts are the same in Glasgow as in every other Scottish council area.` },
      { q: 'How does Glasgow council tax compare with East Dunbartonshire and East Renfrewshire?', a: `At Band D, Glasgow charges ${h.m2(c.bandD)}, East Dunbartonshire ${h.m2(h.c('east-dunbartonshire').bandD)} and East Renfrewshire ${h.m2(h.c('east-renfrewshire').bandD)} for ${h.P.taxYear}, before water. Where a council area has more homes in the higher bands, the typical household bill can be higher than the Band D rate suggests.` },
      { q: 'Where do I find the band of a Glasgow flat?', a: 'Scottish bands are set by the local assessor, not by the Valuation Office Agency used in England and Wales. The Scottish Assessors Association search covers every address in Glasgow and shows the band of each home. A tenement flat and its neighbour on the same landing can be in different bands.' },
    ];
  },
  body: (h) => {
    const c = h.c('glasgow-city'); const L = h.E.letters('scotland'); const S = h.P.bands.scotland;
    const rows = L.map((l, i) => { const b = h.E.bill({ council: 'glasgow-city', band: i }); return [`Band ${l}`, `${S.num[i]}/${S.den}`, h.m2(b.councilTax), h.m2(b.water + b.sewerage), h.m2(b.annual)]; });
    const near = ['east-dunbartonshire', 'east-renfrewshire', 'renfrewshire', 'west-dunbartonshire', 'north-lanarkshire', 'south-lanarkshire'];
    const nrows = [c, ...near.map((id) => h.c(id))].sort((x, y) => y.bandD - x.bandD).map((x) => [x.id === c.id ? '<strong>Glasgow City</strong>' : h.ca(x.id), h.m2(h.E.bandCharge(x, 2)), h.m2(x.bandD), x.bandDPrev ? h.pc(h.E.change(x)!.rate, 1) : 'n/a']);
    const one = h.E.bill({ council: 'glasgow-city', band: 2, household: 'one' });
    const sec = h.E.bill({ council: 'glasgow-city', band: 2, occupancy: 'second' });
    return `
<h2>What each band pays in Glasgow</h2>
${h.bandTable('glasgow-city')}
<p>The table already includes water and waste water, because that is how the bill reaches you. The split below separates the two parts.</p>
${h.table(['Band', 'Ratio to D', 'Council tax', 'Water and waste water', 'Total bill'], rows, `Glasgow City, ${h.P.taxYear}, two adults. Council tax from the ${h.src('scot_datasets', 'Scottish Government band table')}, water from ${h.src('scot_water', 'Scottish Water')}.`, ['l', 'l', 'r', 'r', 'r'])}

<h2>Scottish ratios are not the English ones</h2>
<p>In England, Band E pays eleven ninths of Band D. In Scotland it pays ${S.num[4]}/${S.den}, and Band H pays ${S.num[7]}/${S.den}, close to two and a half times Band D. The ${h.src('leg_scot_ratios', '2016 order that changed the proportions')} raised Bands E to H and left A to D alone. In a city where much of the housing is flats, the change mostly reached the larger houses. The Scottish values are also lower: Band A covers homes worth ${S.ranges[0]} in 1991, against ${h.P.bands.england.ranges[0]} in England.</p>

<h2>Glasgow among its neighbours</h2>
${h.table(['Council', 'Band C', 'Band D', 'Change on 2025/26'], nrows, `${h.P.taxYear}, council tax only, before water and waste water.`, ['l', 'r', 'r', 'r'])}
<p>The full list of ${h.E.inNation('scotland').length} councils is on the ${h.a('region-scotland', 'Scotland page')}, and the ${h.a('scotland-council-tax', 'guide to council tax in Scotland')} covers the rules that differ from England. ${h.ca('city-of-edinburgh')} charges ${h.m2(h.c('city-of-edinburgh').bandD)} at Band D for comparison.</p>

<h2>Discounts, water and second homes</h2>
<p>The single person discount reduces the water lines too, so a Band C flat with one adult costs ${h.m2(one.annual)} for the year. Full-time students living only with other students are exempt from council tax and from the water charges. A home that is nobody's main residence is different: under the ${h.src('scot_circular_2026', 'Scottish Government circular on second and empty homes')}, the default premium from ${h.date(h.P.premiums.scotland.from)} is ${h.pc(h.P.premiums.scotland.default)}, but each council may set its own rate, and no premium applies to the water charges. At the default rate a Band C second home in Glasgow would pay ${h.m2(sec.annual)}. Check Glasgow City Council's own decision for ${h.P.taxYear} before relying on that figure.</p>
<h2>Paying the Glasgow bill</h2>
<p>The council spreads the annual amount, water included, over ten monthly instalments by default, and a request for twelve lowers each payment. On a Band C bill the twelve month figure is about ${h.m2(h.E.bill({ council: 'glasgow-city', band: 2 }).perMonth12)}. Households on a low income can apply for Council Tax Reduction, which in Scotland can also cut the water and waste water charges, by up to ${h.pc(h.P.scottishWater.ctrReductionMax)}; the calculator does not model it, because it depends on income and savings. If you move within the city, the council closes one account and opens another, each charged by the day.</p>
<p>To confirm your band, use the ${h.src('saa', 'Scottish Assessors Association search')}. Rates for 2027/28 are to come.</p>
`;
  },
});
