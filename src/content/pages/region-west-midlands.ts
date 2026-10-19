import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'region-west-midlands',
  group: 'regions',
  order: 50,
  tool: { kind: 'ct', props: { council: 'wolverhampton', band: 1 } },
  related: ['council-tax-birmingham', 'council-tax-coventry', 'council-tax-increase-2026', 'challenge-council-tax-band'],
  sources: ['mhclg_levels', 'mhclg_release', 'gov_who_pays'],
  slug: 'west-midlands-council-tax',
  nav: 'West Midlands',
  card: '30 councils, from the Black Country to the Welsh border, with Shropshire and Worcestershire\'s 9 % limits.',
  title: 'West Midlands Council Tax 2026/27: 30 Councils by Band',
  description: 'West Midlands council tax 2026/27 for 30 councils, Dudley to Walsall: Bands A, D and H, the 9 % rises allowed in Shropshire and Worcestershire, county shares.',
  h1: 'West Midlands council tax 2026/27',
  intro: 'Seven metropolitan boroughs, four unitary councils and three two-tier counties, two of which were allowed to raise bills by up to nine per cent.',
  resume: (h) => {
    const L = h.E.inRegion('West Midlands'); const s = [...L].sort((a, b) => a.bandD - b.bandD); const lo = s[0], hi = s[s.length - 1];
    const ex = h.P.referendum.exceptions2627.filter((e) => /Shropshire|Worcestershire/.test(e.name));
    return `The West Midlands region has ${L.length} billing authorities for ${h.P.taxYear}, with Band D charges from ${h.m2(lo.bandD)} in ${lo.name} to ${h.m2(hi.bandD)} in ${hi.name} for a home with two adults, and a simple average of ${h.m2(h.E.average(L))}. The seven metropolitan boroughs, Birmingham, Coventry, Dudley, Sandwell, Solihull, Walsall and Wolverhampton, share the same police and fire precepts, so their bills differ only by the councils' own charges. Two councils in the region received special referendum limits this year: ${ex.map((e) => `${e.name} ${h.pc(e.limit)}`).join(' and ')}. The Worcestershire limit applies to the county's share, which reaches every district below it, so Worcester, Wychavon and Wyre Forest had among the largest total rises in England. Staffordshire and Warwickshire districts have two-tier bills too, while Herefordshire, Shropshire, Telford and Wrekin and Stoke-on-Trent are unitary.`;
  },
  faqs: (h) => [
    { q: 'Why did Shropshire council tax go up by 9 % this year?', a: `Shropshire Council asked the government for a higher limit because of pressure on its budget, and was allowed to raise its own share by up to ${h.pc(h.P.referendum.exceptions2627.find((e) => e.name === 'Shropshire')!.limit)} for ${h.P.taxYear} without a referendum. With police and fire added, the total Band D rose by ${h.pc(h.E.change(h.c('shropshire'))!.rate, 1)} to ${h.m2(h.c('shropshire').bandD)}.` },
    { q: 'Which Black Country council has the lowest council tax?', a: `Among Dudley, Sandwell, Walsall and Wolverhampton, ${h.c('dudley').name} has the lowest Band D at ${h.m2(h.c('dudley').bandD)} for ${h.P.taxYear}, and ${h.c('walsall').name} the highest at ${h.m2(h.c('walsall').bandD)}. In Band B, common across the Black Country, the gap between the two is ${h.m(h.E.bandCharge(h.c('walsall'), 1) - h.E.bandCharge(h.c('dudley'), 1))} a year for two adults.` },
    { q: 'Does the West Midlands mayor charge a council tax precept?', a: 'Not this year. The West Midlands Combined Authority, which covers the seven metropolitan boroughs, sets no council tax precept for 2026/27 according to the government\'s table. The police precept is set by the West Midlands police and crime commissioner and the fire precept by the fire authority.' },
  ],
  body: (h) => {
    const L = h.E.inRegion('West Midlands'); const w = L.filter((c) => c.county === 'Worcestershire');
    const wy = h.c('wychavon');
    return `
<h2>All ${L.length} councils</h2>
${h.councilTable(L, `Two adults, main home, ${h.P.taxYear}. County, police, fire and average parish precepts included.`)}

<h2>Worcestershire's higher limit, district by district</h2>
<p>Worcestershire County Council's share is the same in each of its ${w.length} districts, so its larger rise moved all of them up together. Their total Band D changes for ${h.P.taxYear}: ${w.map((c) => `${c.name} ${h.pc(h.E.change(c)!.rate, 1)}`).join(', ')}. In ${h.ca('wychavon', 'Wychavon')} the county takes ${h.m2(wy.parts.county)} of a ${h.m2(wy.bandD)} Band D bill; the district itself only ${h.m2(wy.parts.council)}.</p>

<h2>Shropshire and the Marches</h2>
<p>${h.ca('shropshire', 'Shropshire')} and ${h.ca('herefordshire', 'Herefordshire')} are large rural unitary councils with many parishes: ${h.c('shropshire').parishes} and ${h.c('herefordshire').parishes} respectively, averaging ${h.m2(h.c('shropshire').parts.parish)} and ${h.m2(h.c('herefordshire').parts.parish)} at Band D. Both share West Mercia Police with Worcestershire and Telford and Wrekin, at ${h.m2(h.c('shropshire').parts.police)} at Band D.</p>

<h2>The metropolitan boroughs</h2>
<p>The West Midlands police and fire precepts add ${h.m2(h.c('dudley').parts.police + h.c('dudley').parts.fire)} at Band D in all seven boroughs. ${h.ca('birmingham', 'Birmingham')}, the largest council in England by population, charges ${h.m2(h.c('birmingham').bandD)}. ${h.ca('coventry', 'Coventry')} charges ${h.m2(h.c('coventry').bandD)}, and ${h.ca('solihull', 'Solihull')}, with its ${h.c('solihull').parishes} parishes, ${h.m2(h.c('solihull').bandD)}.</p>

<h2>Staffordshire and Warwickshire</h2>
<p>Staffordshire's eight districts and Warwickshire's five each pay their county's share plus their own. ${h.ca('stoke-on-trent', 'Stoke-on-Trent')}, a unitary city inside Staffordshire, has one of the lowest Band D charges in the region at ${h.m2(h.c('stoke-on-trent').bandD)}, and most of its homes are in Band A.</p>

<h2>What a typical home pays</h2>
<p>Band D is a poor guide to the bills most households in the region receive. In the Black Country and Stoke-on-Trent most homes are in Bands A and B, which pay six and seven ninths of Band D; in Solihull, Warwickshire and the rural districts of Worcestershire and Shropshire many more are in Bands D to F. A Band B home in ${h.ca('sandwell', 'Sandwell')} pays ${h.m2(h.E.bandCharge(h.c('sandwell'), 1))} for ${h.P.taxYear}, a Band E home in ${h.ca('stratford-on-avon', 'Stratford-on-Avon')} ${h.m2(h.E.bandCharge(h.c('stratford-on-avon'), 4))}. The table above shows Band A and the top band for each council, so you can see both ends of the scale before choosing your own band in the calculator.</p>
<p>The single person discount, the student exemption and the Disabled Band Reduction apply in the same way in every council of the region; only the premiums on second and empty homes depend on each council's own decision.</p>

<h2>Using the calculator</h2>
<p>The calculator above opens on Wolverhampton, Band B. Choose your council and band, then the household, to see the ${h.P.taxYear} bill and its monthly instalments.</p>
`;
  },
});
