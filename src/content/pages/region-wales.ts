import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'region-wales',
  group: 'regions',
  order: 100,
  tool: { kind: 'ct', props: { council: 'swansea', band: 2 } },
  related: ['council-tax-cardiff', 'wales-council-tax-revaluation', 'second-home-council-tax', 'council-tax-bands'],
  sources: ['wales_levels', 'wales_premiums', 'gov_bands'],
  slug: 'wales-council-tax-by-council',
  nav: 'Wales',
  card: 'All Welsh councils ranked by Band D, with Bands A and I and the police share of each area.',
  title: 'Wales Council Tax 2026/27: Every Council, Bands A to I',
  description: 'Wales council tax 2026/27 for all 22 councils, from Merthyr Tydfil to Cardiff, with Band A, D and I, the change on last year and the police area share.',
  h1: 'Council tax in Wales 2026/27, council by council',
  intro: 'Nine bands, four police areas and a gap of several hundred pounds at Band D between the valleys and the capital.',
  resume: (h) => {
    const L = h.E.inRegion('Wales'); const s = [...L].sort((a, b) => b.bandD - a.bandD); const hi = s[0], lo = s[s.length - 1];
    const A = h.P.averages.wales;
    return `Across the ${L.length} Welsh councils, Band D council tax for ${h.P.taxYear} runs from ${h.m2(lo.bandD)} in ${lo.name} to ${h.m2(hi.bandD)} in ${hi.name}, for a home with two adults. The Welsh Government puts the average Band D bill at ${h.m2(A.bandD)}, ${h.pc(A.change, 1)} more than last year, including police and community council precepts. Each bill has three parts: the county or county borough council, the police and crime commissioner for one of four police areas, and on average a small community council precept. Fire and rescue services are paid for through the councils' own budgets, so there is no separate fire line as in much of England. Wales also has a ninth band: Band I pays ${h.P.bands.wales.num[8]}/${h.P.bands.wales.den} of Band D, which in ${hi.name} means ${h.m2(h.E.bandCharge(hi, 8))} a year. Bands rest on ${h.P.bands.wales.valuationDate} values, not 1991 as in England.`;
  },
  faqs: (h) => {
    const L = h.E.inRegion('Wales'); const rises = [...L].sort((a, b) => h.E.change(b)!.rate - h.E.change(a)!.rate);
    const np = h.c('newport'), mo = h.c('monmouthshire');
    return [
      { q: 'Which Welsh council raised council tax the most for 2026/27?', a: `${rises[0].name}, where Band D rose ${h.pc(h.E.change(rises[0])!.rate, 1)} to ${h.m2(rises[0].bandD)}, followed by ${rises[1].name} at ${h.pc(h.E.change(rises[1])!.rate, 1)}. The smallest rise was in ${rises[rises.length - 1].name}, at ${h.pc(h.E.change(rises[rises.length - 1])!.rate, 1)}. These totals combine the council's own increase with that of the police and crime commissioner.` },
      { q: 'Why does Monmouthshire charge more than Newport when they share a police force?', a: `Both pay the same Gwent police precept, ${h.m2(np.parts.police)} at Band D, so the gap comes from the councils and community councils. Monmouthshire's total Band D is ${h.m2(mo.bandD)} against ${h.m2(np.bandD)} in Newport, and its average community council precept is ${h.m2(mo.parts.parish)} against ${h.m2(np.parts.parish)}.` },
      { q: 'How much more is council tax on a second home in Wales?', a: `Welsh councils can add a premium of up to ${h.pc(h.P.premiums.wales.max)} on second homes and on homes empty for a year or more, and each sets its own rate, from nothing to that maximum. Councils in areas with many holiday homes tend to use high rates. The calculator lets you enter your council's rate.` },
    ];
  },
  body: (h) => {
    const L = h.E.inRegion('Wales');
    const areas = [...new Set(L.map((c) => c.region))];
    const arows = areas.map((r) => { const cs = L.filter((c) => c.region === r); return [r.replace(' area', ''), String(cs.length), h.m2(cs[0].parts.police), h.m2(h.E.average(cs))]; });
    const byParish = [...L].sort((a, b) => b.parts.parish - a.parts.parish);
    const sw = h.c('swansea'); const swOne = h.E.bill({ council: 'swansea', band: 2, household: 'one' });
    return `
<h2>All Welsh councils, ${h.P.taxYear}</h2>
${h.councilTable(L, `Two adults, main home, ${h.P.taxYear}. Police and average community council precepts included. Sorted from the highest Band D.`)}
<p>The figures come from the ${h.src('wales_levels', 'Welsh Government table of council tax levels for 2026 to 2027')}. The last band shown is Band I, which exists only in Wales and covers homes worth more than ${h.m(h.P.bands.wales.upper[7]!)} on the 2003 valuation date (${h.src('gov_bands', 'band values for Wales')}).</p>

<p>Set against England, the Welsh average Band D of ${h.m2(h.P.averages.wales.bandD)} is a little below the English average of ${h.m2(h.P.averages.england.bandD)}. Because Welsh bands use 2003 values with their own limits, a Band D home in Wales is not the same kind of home as a Band D home over the border, so the comparison is only a rough guide. Every Welsh council raised its charge this year, with rises shown in the right-hand column.</p>

<h2>The four police areas</h2>
<p>Every Welsh council falls in one police area, and all its homes pay the same police precept for their band. The precept differs between areas, which explains part of the gap between neighbouring councils:</p>
${h.table(['Police area', 'Councils', 'Police, Band D', 'Average Band D'], arows, `${h.P.taxYear}. Average of the councils' total Band D figures.`, ['l', 'r', 'r', 'r'])}
<p>Most of the difference, though, is the councils' own charge. Councils in the south Wales valleys, with lower property values and fewer homes in the upper bands, need a higher Band D figure to raise the same money, which is why several of them sit at the top of the table.</p>

<h2>Community councils</h2>
<p>Most of Wales is covered by town and community councils, which add a small precept. The table spreads it as an average over the whole council area. It weighs most in ${byParish[0].name}, at ${h.m2(byParish[0].parts.parish)} at Band D on average, and least in ${byParish[byParish.length - 1].name}, at ${h.m2(byParish[byParish.length - 1].parts.parish)}. Your own bill names the community council and its exact charge.</p>

<h2>Using the calculator for a Welsh home</h2>
<p>The calculator starts on Swansea, Band C, where two adults pay ${h.m2(h.E.bandCharge(sw, 2))} and an adult living alone ${h.m2(swOne.annual)}. Choose your council and band, from A to I, then who lives there. The ${h.pc(h.P.discounts.singlePerson)} single person discount, the student exemption and the Disabled Band Reduction work as in England. For a second home or a long-term empty home, enter the premium your council has set: the ${h.src('wales_premiums', 'Welsh Government guidance on premiums')} lets each council choose a rate up to ${h.pc(h.P.premiums.wales.max)}.</p>
${h.box('Bands will change', `<p>Wales plans to revalue every home with new bands from 2028. The new values and ratios are still to come; the ${h.a('wales-council-tax-revaluation', 'revaluation page')} sets out what the 2024 Act already fixes.</p>`, 'info')}
`;
  },
});
