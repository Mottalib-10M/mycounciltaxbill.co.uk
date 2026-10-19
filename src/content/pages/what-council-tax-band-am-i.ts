import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'what-council-tax-band-am-i',
  group: 'bands',
  order: 20,
  mini: { kind: 'mini:band-from-value', props: { nation: 0, value: 61000 } },
  related: ['council-tax-bands', 'check-council-tax-band', 'challenge-council-tax-band', 'council-tax-moving-house'],
  sources: ['gov_bands', 'voa_check', 'voa_band_review', 'saa', 'leg_lgfa_ratios'],
  slug: 'what-council-tax-band-am-i',
  nav: 'Estimate your band',
  card: 'Turn a 1991 or 2003 value into a band, and the band into a bill, before you buy or rent.',
  title: 'Council Tax Band Estimate: Turn a 1991 Value Into a Band',
  description: 'Estimate which council tax band a home is in: bring today\'s price back to 1991 or 2003, read the band from the official ranges, then see its 2026/27 bill.',
  h1: 'Which council tax band is my home in?',
  intro: 'The official answer is one search away. When there is no answer yet, or you doubt it, this is how to estimate one.',
  resume: (h) => {
    const E = h.P.bands.england;
    const b = h.E.bandFromValue('england', 61000);
    return `The quickest way to know your council tax band is to look the address up on the official search service, or read it on your bill. Estimating a band yourself is useful when the home is new, when you are about to buy or rent and want to know the bill, or when you suspect the band is wrong. The method is the same as the valuers': work out what the home would have sold for on ${E.valuationDate} in England and Scotland, or on ${h.P.bands.wales.valuationDate} in Wales, then find that figure in the ranges set by law. A home that would have fetched £61,000 in England in 1991 is in Band ${E.letters[b]}, the range ${E.ranges[b]}. The estimate is only a guide: the band on the official list is the one that counts, and only the Valuation Office or a Scottish assessor can change it.`;
  },
  faqs: (h) => [
    { q: 'How do I convert my house price today into a 1991 value?', a: 'Divide today\'s price by how much prices in your area have risen since 1991, using the official UK House Price Index for your local authority, which starts in 1995 for most areas and can be extended back with regional series. The result is rough: prices of different kinds of home rose at different speeds, so treat any band near a boundary as uncertain.' },
    { q: 'What council tax band is a new build home put in?', a: 'The Valuation Office bands a new home once it is ready to live in, by asking what it would have sold for on the valuation date with the area as it is today. It compares the home with similar existing homes nearby. The developer usually tells buyers the expected band, but only the official list is binding.' },
    { q: 'Can I find out the band before I buy a house?', a: `Yes, the band of any existing home is public and can be searched by postcode. With it you can work out the ${h.P.taxYear} bill exactly, including discounts, with the calculator on the home page. Ask about the band before you offer: a home in Band E costs ${h.pc(11 / 9 - 1, 0)} more than one in Band D in the same council.` },
  ],
  body: (h) => {
    const B = h.P.bands;
    const ex = [['england', 48000], ['england', 125000], ['wales', 118000], ['scotland', 44000]] as const;
    const rows = ex.map(([n, v]) => { const b = h.E.bandFromValue(n, v); return [h.E.NATION_NAME[n], h.m(v), `Band ${B[n].letters[b]}`, B[n].ranges[b], h.m(h.P.averages[n].bandD * h.E.ratio(n, b))]; });
    const case1 = h.E.bandFromValue('england', 340000 / 4.1);
    return `
<h2>Step 1: look for the official band first</h2>
<p>Every home already in the valuation list has a band you can read in seconds on the official search service, for England and Wales (${h.src('voa_check', 'GOV.UK, check your Council Tax band')}) and for Scotland (${h.src('saa', 'Scottish Assessors Association')}). Estimating is only worth it for a home that is not on the list yet, or to test whether a band looks right. The ${h.a('check-council-tax-band', 'guide to checking a band')} explains what the search shows.</p>

<h2>Step 2: bring the value back to the valuation date</h2>
<p>A band is never based on today's value. You need the price the home would have fetched on the valuation date, as it was then or, for a new home, as it is now in today's surroundings. Three ways get you there, from best to roughest:</p>
<ul>
<li><strong>A real sale near the date.</strong> If the home itself, or an identical one next door, sold between 1989 and 1993 in England (2001 to 2005 in Wales), that price is the strongest evidence there is.</li>
<li><strong>Today's price divided by local growth.</strong> Take a recent sale price and divide it by the rise in prices in your area since the valuation date. In much of the South East prices have risen four times or more since 1991; in parts of the North East much less.</li>
<li><strong>The neighbours' bands.</strong> Homes of the same type, size and age on the same street should be in the same band. If five identical homes are in Band C, yours almost certainly belongs there too.</li>
</ul>
<p>As a worked case: a semi in Kent sold for £340,000 last year. If prices in the area are about 4.1 times their 1991 level, the 1991 value is about ${h.m(340000 / 4.1)}, which falls in Band ${B.england.letters[case1]} (${B.england.ranges[case1]}).</p>

<h2>Step 3: read the band from the ranges</h2>
<p>The ranges are set in law and the same for every council of a nation (${h.src('leg_lgfa_ratios', 'section 5 of the 1992 Act')}). The calculator at the top does the lookup. A few examples, with what the band costs at each nation's average Band D for ${h.P.taxYear}:</p>
${h.table(['Nation', 'Value on the valuation date', 'Band', 'Range', 'At the average Band D'], rows, 'Scottish figure excludes water and waste water charges.', ['l', 'r', 'l', 'l', 'r'])}

<h2>Step 4: turn the band into a bill</h2>
<p>A band means nothing until it is priced by a council. The same Band C costs a different sum in each of the ${h.E.COUNCILS.length} councils of Britain: ${h.m2(h.E.bandCharge(h.c('wandsworth'), 2))} in ${h.c('wandsworth').name} and ${h.m2(h.E.bandCharge(h.c('rutland'), 2))} in ${h.c('rutland').name}. Pick the council and band in the ${h.a('home', 'calculator')} and add who lives there: a single adult, students, an adapted home for a disabled resident.</p>

<h2>Why estimates go wrong</h2>
<p>A band near a boundary is a coin toss. If your estimate lands within ten per cent of the top or bottom of a range, either band is possible. Several things push the result off:</p>
<ul>
<li>prices of flats, terraces and detached homes did not rise at the same pace, so a local average index can mislead for one type of home;</li>
<li>the band reflects the home as it was when it was banded, so an extension built later is not part of the band until the home is sold;</li>
<li>the 1991 market was falling sharply after the 1989 peak, so sales from 1989 and 1993 tell different stories;</li>
<li>in Wales the 2003 values were set at a time of fast rises, so a few months either way change the figure.</li>
</ul>
<p>The Valuation Office explains the factors it takes into account, among them size, layout, character and location (${h.src('gov_bands', 'GOV.UK, how bands are assessed')}).</p>

<h2>When the estimate and the official band disagree</h2>
<p>If your estimate is one band lower than the official list, check the neighbours before anything else. A difference against the whole street suggests your estimate is wrong; a difference against identical homes nearby suggests the band may be. In the second case the Valuation Office accepts a band review with evidence of up to five similar homes in a lower band (${h.src('voa_band_review', 'GOV.UK, band review')}). The ${h.a('challenge-council-tax-band', 'challenge guide')} sets out the two routes, the deadlines and the risk that the band goes up instead.</p>
${h.box('Buying or renting', '<p>Estate agents are expected to show the council tax band in a listing. If the listing has none, search it yourself before viewing: in a high Band D council the gap between two bands can be several hundred pounds a year.</p>', 'tip')}

<h2>Three homes, three estimates</h2>
<p>The three cases below show how the method works in practice, and when an estimate is worth acting on.</p>
<p><strong>A 1930s semi in Leeds.</strong> The owners know it sold in 1992 for £58,000, in a falling market. The figure sits in the Band C range, close to the middle, and the official band is C. Nothing to do.</p>
<p><strong>A new flat in Manchester.</strong> No band yet. Similar flats in the next block, built in 2019, are all in Band B. The new flat will very likely join them, and the ${h.P.taxYear} bill in ${h.c('manchester').name} is then ${h.m2(h.E.bandCharge(h.c('manchester'), 1))} for two adults, before any discount.</p>
<p><strong>A cottage in Gwynedd.</strong> The home is Band E, but three identical cottages in the row are Band D and one sold in 2003 for £110,000, inside the Welsh Band D range of ${B.wales.ranges[3]}. Here the estimate and the street agree with each other and disagree with the list: a case worth putting to the Valuation Office, with the addresses of the three cottages and the 2003 sale price and date as evidence.</p>

<h2>What the estimate cannot tell you</h2>
<p>An estimate gives a band, not a bill. The bill also depends on the parish or community council, on who counts as an adult in the home, and on whether the home is anyone's main residence. A second home in many English councils pays double the band charge, and a home empty for years can pay up to four times. Those rules are on the pages on ${h.a('second-home-council-tax', 'second homes')} and ${h.a('empty-property-council-tax', 'empty homes')}.</p>

<h2>Wales and Scotland</h2>
<p>In Wales the estimate uses 2003 values and nine bands, the top one, Band I, for homes worth ${B.wales.ranges[8]} then. Welsh bands will change when the ${h.a('wales-council-tax-revaluation', 'revaluation')} planned from 2028 takes effect, with new values and new ranges still to come. In Scotland the date is 1991 but the brackets are lower, from ${B.scotland.ranges[0]} for Band A to ${B.scotland.ranges[7]} for Band H, because Scottish prices were lower then. A Scottish home worth £60,000 in 1991 is in Band ${B.scotland.letters[h.E.bandFromValue('scotland', 60000)]}, where the same value in England would be Band ${B.england.letters[h.E.bandFromValue('england', 60000)]}.</p>
`;
  },
});
