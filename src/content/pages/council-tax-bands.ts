import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-bands',
  group: 'bands',
  order: 10,
  mini: { kind: 'mini:band-list', props: { council: 'leeds' } },
  related: ['what-council-tax-band-am-i', 'check-council-tax-band', 'challenge-council-tax-band', 'scotland-council-tax'],
  sources: ['gov_bands', 'leg_lgfa_ratios', 'leg_scot_ratios', 'mhclg_levels', 'wales_levels', 'scot_datasets'],
  slug: 'council-tax-bands',
  nav: 'Council tax bands explained',
  card: 'The value ranges and fractions of Band D in England, Wales and Scotland, with real charges.',
  title: 'Council Tax Bands 2026/27: Value Ranges and Charges by Band',
  description: 'Council tax bands A to H, and I in Wales: 1991 and 2003 value ranges, the share of Band D each band pays, and what each band costs in 2026/27 across Britain.',
  h1: 'Council tax bands: ranges, ratios and what each band costs',
  intro: 'Eight bands in England and Scotland, nine in Wales, all priced as a fraction of Band D.',
  resume: (h) => {
    const E = h.P.bands.england, W = h.P.bands.wales, S = h.P.bands.scotland, A = h.P.averages;
    return `Every home in England and Scotland is in one of eight council tax bands, A to H, and every home in Wales in one of nine, A to I. The band depends on what the home would have sold for on ${E.valuationDate} in England and Scotland, or on ${W.valuationDate} in Wales, not on its value today: in England Band A covers homes worth ${E.ranges[0]} then and Band H homes worth ${E.ranges[7]}. Each band pays a fixed fraction of the Band D charge that your council sets each year. In England and Wales Band A pays ${E.num[0]}/${E.den} of Band D and Band H ${E.num[7]}/${E.den}, twice as much; in Scotland the fractions have been steeper since ${S.ratioChange.split(' (')[0]}. With the ${h.P.taxYear} average Band D of ${h.m2(A.england.bandD)} in England, that puts Band A at ${h.m(A.england.bandD * E.num[0] / E.den)} and Band H at ${h.m(A.england.bandD * E.num[7] / E.den)} a year, before any discount.`;
  },
  faqs: (h) => [
    { q: 'Why is my council tax band based on 1991 prices?', a: 'Council tax replaced the community charge in April 1993, and the homes in England and Scotland were valued then at the price they would have fetched on 1 April 1991. England has never been revalued since. Wales was revalued once, using 1 April 2003 prices, which is why it has a ninth band.' },
    { q: 'Which council tax band is the most common?', a: `In England Band B and Band C each hold far more homes than Band H, and Band D is the reference band used for comparisons rather than the typical one. The average Band D charge of ${h.m2(h.P.averages.england.bandD)} is therefore higher than what most households pay.` },
    { q: 'Does a bigger council tax band mean a bigger bill in every council?', a: `Within one council, yes: each band pays more than the band below. Between councils, no. A Band H home in ${h.c('wandsworth').name} pays ${h.m2(h.E.bandCharge(h.c('wandsworth'), 7))} this year, less than a Band D home in ${h.c('rutland').name} at ${h.m2(h.c('rutland').bandD)}. The council's own spending decides the Band D figure; the band only sets your share of it.` },
  ],
  body: (h) => {
    const B = h.P.bands;
    const rowsEW = B.wales.letters.map((l, i) => [`Band ${l}`, B.england.ranges[i] ?? 'none', B.wales.ranges[i], `${B.england.num[i]}/9`]);
    const rowsS = B.scotland.letters.map((l, i) => [`Band ${l}`, B.scotland.ranges[i], `${B.scotland.num[i]}/360`, h.pc(B.scotland.num[i] / 360, 1)]);
    const pick = ['sunderland', 'surrey-heath', 'swansea', 'aberdeenshire'];
    const rowsCost = pick.map((id) => { const c = h.c(id); const L = h.E.letters(c.nation); return [h.ca(id), h.m2(h.E.bandCharge(c, 0)), h.m2(h.E.bandCharge(c, 3)), h.m2(h.E.bandCharge(c, L.length - 1)), `Band ${L[L.length - 1]}`]; });
    return `
<h2>The value ranges</h2>
<p>A band is a bracket of values, set in law and the same for every council of the nation. In England and Wales they are fixed by section 5 of the Local Government Finance Act 1992 (${h.src('leg_lgfa_ratios', 'section 5 of the 1992 Act')}); the Valuation Office explains how it places a home in its band (${h.src('gov_bands', 'GOV.UK, how bands are assessed')}).</p>
${h.table(['Band', `England, value on ${B.england.valuationDate}`, `Wales, value on ${B.wales.valuationDate}`, 'Share of Band D'], rowsEW, 'Band I exists only in Wales.', ['l', 'l', 'l', 'l'])}
<p>The Welsh brackets are higher because they use prices twelve years later. They are not a guide to a Welsh home's value today either: they too are frozen, and the ${h.a('wales-council-tax-revaluation', 'Welsh revaluation')} planned for 2028 will set new ones.</p>

<h2>Scotland's own ratios</h2>
<p>Scotland uses the same 1991 date as England but lower brackets, because house prices there were lower in 1991. Since ${B.scotland.ratioChange}, the four upper bands pay more than the English fractions (${h.src('leg_scot_ratios', 'Council Tax (Substitution of Proportion) (Scotland) Order 2016')}):</p>
${h.table(['Band', 'Value on 1 April 1991', 'Share of Band D', 'As a percentage'], rowsS, undefined, ['l', 'l', 'l', 'r'])}
<p>A Scottish Band H home pays ${h.pc(B.scotland.num[7] / 360, 1)} of Band D against ${h.pc(B.england.num[7] / 9, 1)} in England. Scottish bills also carry water and waste water charges, which keep the older, flatter ratios; they are explained on the ${h.a('scotland-council-tax', 'Scotland page')}.</p>

<h2>From Band D to every band</h2>
<p>Each council sets a single figure, the Band D charge, and the law turns it into the other bands. That is why the band matters more than the council in the range of possible bills: within a council, Band H always pays three times Band A in England and Wales. Four councils far apart show how wide the spread is in ${h.P.taxYear}:</p>
${h.table(['Council', 'Band A', 'Band D', 'Top band', ''], rowsCost, 'Two adults, main home. Scottish figures exclude water here.', ['l', 'r', 'r', 'r', 'l'])}
<p>The calculator above lists every band for the council you choose. The full ${h.a('home', 'bill calculator')} then applies who lives in the home and any premium.</p>

<h2>How a home got its band</h2>
<p>In 1991 and 1992, valuers placed some twenty million homes in England and Wales in bands in a short time, often without going inside, using sales of similar homes. That speed explains why mistakes still turn up: identical houses on one road can sit in different bands. New homes are banded when they are built, by asking what they would have been worth on the valuation date, given the area as it is now. A home that is split into flats gets one band per flat; two flats merged into a house get a single band.</p>
<p>An extension or a new kitchen does not change the band while you own the home. The Valuation Office only takes improvements into account when the home is next sold, or if there is a general revaluation. Physical changes to the area, such as a new main road, can on the other hand justify a lower band at any time.</p>
<p>Bands do not drift with the market either. A home that has doubled in price since you bought it stays in the same band, and so does one that has lost value. Only a sale after improvements, a physical change, a successful challenge or a revaluation moves it, which is why two neighbours who bought twenty years apart pay the same.</p>

<h2>Bands and the bill</h2>
<p>The band charge is a starting point. A household's real bill then changes with:</p>
<ul>
<li>who lives there, through the ${h.a('council-tax-single-person-discount', 'single person discount')}, the ${h.a('council-tax-disregards', 'people who are disregarded')} and the ${h.a('council-tax-students', 'student exemption')};</li>
<li>the home itself, through the ${h.a('council-tax-disabled-band-reduction', 'Disabled Band Reduction')}, which charges an adapted home at the band below, and the rules for ${h.a('council-tax-annexes', 'annexes')};</li>
<li>how it is used, through the premiums on ${h.a('second-home-council-tax', 'second homes')} and ${h.a('empty-property-council-tax', 'empty homes')}, which multiply the band charge.</li>
</ul>
<p>The Disabled Band Reduction is the only rule that works by moving a home to another band; everything else is a percentage of the band charge.</p>

<h2>Finding and checking your band</h2>
<p>Your band is printed on every bill. You can also look it up, and see your neighbours' bands, on the official search service; the ${h.a('check-council-tax-band', 'page on checking a band')} shows how. If you think a home is in the wrong band, the ${h.a('what-council-tax-band-am-i', 'band estimator')} turns a 1991 or 2003 value into a band, and the ${h.a('challenge-council-tax-band', 'challenge guide')} explains when and how to ask for a change, and the risk that the band goes up.</p>

<h2>Why Band D is the yardstick</h2>
<p>Band D was the middle of the 1991 value range and the band an average home was expected to fall in when the tax was designed. Every official table, every press comparison and every referendum limit uses it. That makes Band D a good way to compare councils but a poor picture of a typical bill: in the North East and much of the Midlands most homes are in Bands A and B, and pay two thirds or less of the Band D figure, while in London and the South East a large share of homes sit above it.</p>
<p>The ratios also explain why council tax is often called regressive. A Band H home worth ten times a Band A home pays only three times as much in England. The Scottish change of 2017 and the Welsh ninth band were both attempts to make the top of the scale pay a little more.</p>

<h2>Bands and the type of home</h2>
<p>A band says nothing about the kind of property, only its value on the valuation date. A two-bedroom flat in Kensington and a detached farmhouse in Durham can share Band E. The ratios are the same for houses, flats, houseboats and caravans on residential pitches: each dwelling has its own entry in the valuation list. Houses in multiple occupation are usually banded as one dwelling, with the landlord liable for the bill, unless the rooms are self-contained.</p>
<p>A home with a self-contained annex usually has two bands, one for the main house and one for the annex. Both can be cut or removed by the discounts and exemptions on the ${h.a('council-tax-annexes', 'annex page')}.</p>

<h2>Northern Ireland</h2>
<p>Northern Ireland has no council tax and no bands. Homes pay domestic rates, based on each property's capital value on 1 January 2005 multiplied by a regional and a district rate. Nothing on this site applies there.</p>

<h2>Where the charges come from</h2>
<p>Band D figures for ${h.P.taxYear} come from the three official tables published in March 2026: council tax levels set by local authorities in England (${h.src('mhclg_levels', 'MHCLG')}), council tax levels in Wales (${h.src('wales_levels', 'Welsh Government')}), and the Scottish Government's council tax datasets (${h.src('scot_datasets', 'Scottish Government')}). England's figures include the average parish precept of each council; Welsh figures include police and community councils.</p>
`;
  },
});
