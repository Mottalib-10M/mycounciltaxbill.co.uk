import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'region-east-of-england',
  group: 'regions',
  order: 60,
  tool: { kind: 'ct', props: { council: 'colchester', band: 3 } },
  related: ['council-tax-increase-2026', 'second-home-council-tax', 'council-tax-students', 'what-council-tax-band-am-i'],
  sources: ['mhclg_levels', 'mhclg_release', 'gov_second_empty'],
  slug: 'east-of-england-council-tax',
  nav: 'East of England',
  card: '45 councils across Essex, Hertfordshire, Norfolk, Suffolk, Cambridgeshire and Bedfordshire.',
  title: 'East of England Council Tax 2026/27: 45 Councils by Band',
  description: 'East of England council tax 2026/27 for 45 councils in Essex, Hertfordshire, Norfolk, Suffolk, Cambridgeshire and Bedfordshire, with every band and the change.',
  h1: 'East of England council tax 2026/27',
  intro: 'The region with the most shire districts, where five county councils take the lion\'s share of most bills.',
  resume: (h) => {
    const L = h.E.inRegion('East of England'); const s = [...L].sort((a, b) => a.bandD - b.bandD); const lo = s[0], hi = s[s.length - 1];
    const dist = L.filter((c) => c.cls === 'Shire district');
    return `The East of England has ${L.length} billing authorities, ${dist.length} of them shire districts under five county councils: Essex, Hertfordshire, Norfolk, Suffolk and Cambridgeshire. The other ${L.length - dist.length} are unitary councils: Bedford, Central Bedfordshire, Luton, Peterborough, Southend-on-Sea and Thurrock. For ${h.P.taxYear}, Band D for two adults runs from ${h.m2(lo.bandD)} in ${lo.name} to ${h.m2(hi.bandD)} in ${hi.name}, a narrow range for so many councils, with a simple average of ${h.m2(h.E.average(L))}. In the Cambridgeshire districts and Peterborough the bill also carries a mayoral precept of ${h.m2(h.c('cambridge').parts.combined)} at Band D for the Cambridgeshire and Peterborough Combined Authority. Parish and town councils cover most of the rural parts of the region, and their precepts explain much of the spread between neighbouring districts in the same county, often more than the districts' own charges do.`;
  },
  faqs: (h) => [
    { q: 'How much does Essex County Council take from a council tax bill?', a: `In ${h.c('chelmsford').name}, Essex County Council takes ${h.m2(h.c('chelmsford').parts.county)} of the ${h.m2(h.c('chelmsford').bandD)} Band D bill for ${h.P.taxYear}. The city council keeps ${h.m2(h.c('chelmsford').parts.council)}, parishes take ${h.m2(h.c('chelmsford').parts.parish)} on average, and the rest goes to the Essex police, fire and crime commissioner, who sets both the police and the fire precepts.` },
    { q: 'Why is there a mayor\'s share on Cambridgeshire council tax bills?', a: `The Cambridgeshire and Peterborough Combined Authority, led by an elected mayor, sets a precept of its own. For ${h.P.taxYear} it is ${h.m2(h.c('cambridge').parts.combined)} at Band D, the same in Peterborough and the five Cambridgeshire districts, and scaled to the band on each bill.` },
    { q: 'Why is Thurrock council tax lower than in the Essex districts?', a: `Thurrock's Band D of ${h.m2(h.c('thurrock').bandD)} is the lowest in the region for ${h.P.taxYear}. A unitary council sends a single council charge, while the Essex districts around it add a district share to Essex County Council's. Compare the band charge of the home rather than the council's reputation.` },
  ],
  body: (h) => {
    const L = h.E.inRegion('East of England');
    const cty = ['Essex', 'Hertfordshire', 'Norfolk', 'Suffolk', 'Cambridgeshire'].map((n) => { const d = L.filter((c) => c.county === n); const x = d[0]; return `${n}: ${d.length} districts, average Band D ${h.m2(h.E.average(d))}, county share ${h.m2(x.parts.county)}`; });
    return `
<h2>Every council in the East of England</h2>
${h.councilTable(L, `Two adults, main home, ${h.P.taxYear}. County, mayoral, police, fire and average parish precepts included.`)}

<h2>Five counties, five county shares</h2>
<ul>${cty.map((x) => `<li>${x}</li>`).join('')}</ul>
<p>Because the county share is the same across each county, the ranking inside a county is set by two things: the district's own charge and the average parish precept. In Hertfordshire, for instance, ${h.ca('st-albans', 'St Albans')} and ${h.ca('watford', 'Watford')} share Hertfordshire County Council's charge, but Watford's district charge is higher and St Albans has more parishes.</p>

<h2>Unitary towns</h2>
<p>${h.ca('luton', 'Luton')}, ${h.ca('southend-on-sea', 'Southend-on-Sea')} and ${h.ca('thurrock', 'Thurrock')} are urban unitary councils, each with a single council charge. ${h.ca('central-bedfordshire', 'Central Bedfordshire')} and ${h.ca('bedford', 'Bedford')} replaced Bedfordshire County Council in 2009. ${h.ca('peterborough', 'Peterborough')} is unitary but inside the Cambridgeshire and Peterborough mayoral area.</p>

<h2>Coast and countryside</h2>
<p>North Norfolk and the Suffolk coast have many second homes and holiday lets. Their councils can now charge a premium of up to ${h.pc(h.P.premiums.england.secondHomeMax)} on second homes and up to ${h.pc(h.P.premiums.england.emptyTiers[2].max)} on homes empty for ten years, explained in the guides on ${h.a('second-home-council-tax', 'second homes')} and ${h.a('empty-property-council-tax', 'empty homes')}. Check your district's own rate: the calculator lets you enter it.</p>

<h2>Parishes and towns</h2>
<p>Parish precepts vary more in this region than almost anywhere. ${h.ca('central-bedfordshire', 'Central Bedfordshire')} has ${h.c('central-bedfordshire').parishes} parish and town councils, averaging ${h.m2(h.c('central-bedfordshire').parts.parish)} at Band D, which helps place it near the top of the table. ${h.ca('watford', 'Watford')} has none, so its bill is made of the county, district, police and fire shares only. Within a district with many parishes, a home in a town with a large town council can pay noticeably more than a home in a small village.</p>
<p>Your annual bill names your parish and gives its own charge for your band. The figures in the table and the calculator use the district average.</p>

<h2>Using the calculator</h2>
<p>The calculator above opens on Colchester, Band D. Choose your council, band and household; the result shows the annual bill, the monthly instalments and how it splits between county, district, police, fire and parish.</p>
`;
  },
});
