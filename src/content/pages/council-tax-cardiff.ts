import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-cardiff',
  group: 'councils',
  order: 200,
  tool: { kind: 'ct', props: { council: 'cardiff', band: 3 } },
  related: ['region-wales', 'wales-council-tax-revaluation', 'second-home-council-tax', 'check-council-tax-band'],
  sources: ['wales_levels', 'wales_reform', 'wales_premiums', 'gov_bands', 'voa_check'],
  slug: 'cardiff-council-tax',
  nav: 'Cardiff',
  card: 'Cardiff bands A to I for 2026/27, the police and community council shares, Welsh premiums and the 2028 revaluation.',
  title: 'Cardiff Council Tax 2026/27: Bands A to I Explained',
  description: 'Cardiff council tax 2026/27 for all nine Welsh bands, the police share, community councils, premiums on second homes and what the 2028 revaluation means.',
  h1: 'Cardiff council tax 2026/27',
  intro: 'The capital of Wales charges one of the lowest Band D rates in the country, on a scale of nine bands that England does not have.',
  resume: (h) => {
    const c = h.c('cardiff'); const ch = h.E.change(c)!; const p = c.parts;
    const W = h.E.inNation('wales'); const r = h.E.rankIn(c, W);
    const d = h.E.bill({ council: 'cardiff', band: 3 });
    return `Cardiff Council's Band D council tax for ${h.P.taxYear} is ${h.m2(c.bandD)}, up ${h.pc(ch.rate, 1)} from ${h.m2(c.bandDPrev!)}, which puts the city ${r.of - r.rank + 1 === 1 ? 'lowest' : `${r.of - r.rank + 1} from the bottom`} of the ${r.of} Welsh councils and ${h.m(h.P.averages.wales.bandD - c.bandD)} under the Welsh average of ${h.m2(h.P.averages.wales.bandD)}. The total has three parts at Band D: ${h.m2(p.council)} for the council, ${h.m2(p.police)} for the South Wales Police and Crime Commissioner and an average of ${h.m2(p.parish)} for community councils. Two adults in Band D pay ${h.m2(d.first)} in the first month and ${h.m2(d.regular)} in each of the nine that follow. Bands in Wales run from A to I and rest on values at ${h.P.bands.wales.valuationDate}; Band I, the ninth, pays ${h.P.bands.wales.num[8]}/${h.P.bands.wales.den} of Band D, or ${h.m2(h.E.bandCharge(c, 8))} in Cardiff. Every home will be revalued for April 2028 and the new bands are to come.`;
  },
  faqs: (h) => {
    const c = h.c('cardiff');
    return [
      { q: 'What does a Band I home pay in Cardiff?', a: `Band I covers homes worth more than ${h.m(h.P.bands.wales.upper[7]!)} on the 2003 valuation date and pays ${h.P.bands.wales.num[8]}/${h.P.bands.wales.den} of Band D. In Cardiff that is ${h.m2(h.E.bandCharge(c, 8))} for ${h.P.taxYear} with two adults, or ${h.m2(h.E.bill({ council: 'cardiff', band: 8, household: 'one' }).annual)} for one adult, the same Welsh ratio as in the other councils.` },
      { q: 'Why is there no fire and rescue line on a Cardiff bill?', a: 'In Wales the fire and rescue authorities are funded by contributions from the councils they cover, so their cost is part of the council\'s own share rather than a separate precept. A Cardiff bill therefore shows only the council, the police and crime commissioner and, where there is one, the community council.' },
      { q: 'Do all Cardiff homes pay a community council precept?', a: `No. Community councils cover only some parts of the city, and only homes in those areas pay their precept. The Welsh Government table spreads the total over the whole city as an average of ${h.m2(c.parts.parish)} at Band D, so a home outside a community council area pays slightly less than the figures shown here.` },
    ];
  },
  body: (h) => {
    const c = h.c('cardiff');
    const near = ['vale-of-glamorgan', 'newport', 'caerphilly', 'rhondda-cynon-taf', 'bridgend', 'merthyr-tydfil'];
    const rows = [c, ...near.map((id) => h.c(id))].sort((x, y) => x.bandD - y.bandD).map((x) => [x.id === c.id ? '<strong>Cardiff</strong>' : h.ca(x.id), h.m2(h.E.bandCharge(x, 2)), h.m2(x.bandD), h.m2(x.parts.police), x.bandDPrev ? h.pc(h.E.change(x)!.rate, 1) : 'n/a']);
    const vg = h.c('vale-of-glamorgan');
    const E3 = h.E.bill({ council: 'cardiff', band: 4 });
    return `
<h2>Nine bands, A to I</h2>
${h.bandTable('cardiff')}
<p>The Welsh scale is the English one with an extra band on top. Bands A to H keep the same fractions of Band D, from six ninths to eighteen ninths, but they were redrawn on ${h.P.bands.wales.valuationDate} values in the last Welsh revaluation, and Band I was added for the most valuable homes. A Band E house in Cardiff, worth ${h.P.bands.wales.ranges[4]} in 2003, pays ${h.m2(E3.annual)} this year. The ${h.src('gov_bands', 'Valuation Office Agency guidance')} gives every Welsh value range.</p>

<h2>Cardiff and the South Wales councils</h2>
<p>Cardiff shares its police force with neighbouring councils, so the police share is identical or close across the area and the difference comes from what each council charges for itself. The table sorts them from the cheapest Band D.</p>
${h.table(['Council', 'Band C', 'Band D', 'Police at D', 'Change on 2025/26'], rows, `${h.P.taxYear}, two adults, main home, from the ${h.src('wales_levels', 'Welsh Government council tax levels')}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>A move across the boundary to the ${h.ca('vale-of-glamorgan')} adds ${h.m(vg.bandD - c.bandD)} a year at Band D. The ${h.a('region-wales', 'Wales page')} ranks all ${h.E.inNation('wales').length} councils.</p>

<h2>Community councils</h2>
<p>Community councils in Wales are the equivalent of English parish councils. Only parts of Cardiff have one, and each adds its own precept to the bills of the homes it represents, which is why the average community council share in the city is as low as ${h.m2(c.parts.parish)} at Band D. If your annual notice lists a community council, your charge is a little above the city-wide average used on this page.</p>

<h2>Second homes and long-term empty homes in Wales</h2>
<p>Welsh councils may charge a premium of up to ${h.pc(h.P.premiums.wales.max)} on second homes and on homes empty for a year or more, under the ${h.src('wales_premiums', 'Welsh Government premiums guidance')}. Each council chooses its own rate and can set different rates for different lengths of time empty. Check Cardiff Council's rate for ${h.P.taxYear} before relying on a figure, then type it into the calculator; the ${h.a('second-home-council-tax', 'second home guide')} explains the exceptions, such as homes on the market or awaiting probate.</p>

<h2>The 2028 revaluation</h2>
<p>Every home in Wales is to be revalued, with new bands taking effect in April 2028, and then every five years, as set out on the ${h.src('wales_reform', 'Welsh Government reform page')}. Some Cardiff homes will move up a band and others down; the new bands, their value ranges and their ratios are still to come. Until then, the current band on the ${h.src('voa_check', 'GOV.UK search')} is the one used for your bill, and the ${h.a('wales-council-tax-revaluation', 'revaluation guide')} follows each step of the reform.</p>
`;
  },
});
