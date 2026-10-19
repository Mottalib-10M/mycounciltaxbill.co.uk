import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'region-east-midlands',
  group: 'regions',
  order: 40,
  tool: { kind: 'ct', props: { council: 'derby', band: 1 } },
  related: ['council-tax-nottingham', 'council-tax-leicester', 'council-tax-increase-2026', 'council-tax-annexes'],
  sources: ['mhclg_levels', 'mhclg_release', 'gov_bands'],
  slug: 'east-midlands-council-tax',
  nav: 'East Midlands',
  card: '35 councils, four two-tier counties and two of the highest Band D charges in England.',
  title: 'East Midlands Council Tax 2026/27: 35 Councils, Every Band',
  description: 'East Midlands council tax 2026/27 for 35 councils: Nottingham and Rutland at the top, Lincolnshire districts at the bottom, county shares and every band.',
  h1: 'East Midlands council tax 2026/27',
  intro: 'Mostly two-tier: a district sends the bill, a county takes most of it.',
  resume: (h) => {
    const L = h.E.inRegion('East Midlands'); const s = [...L].sort((a, b) => a.bandD - b.bandD); const lo = s[0], hi = s[s.length - 1];
    const dist = L.filter((c) => c.cls === 'Shire district');
    return `The East Midlands has ${L.length} councils for ${h.P.taxYear}: ${dist.length} shire districts in Derbyshire, Leicestershire, Lincolnshire and Nottinghamshire, and ${L.length - dist.length} unitary councils, among them the three cities of Derby, Leicester and Nottingham, Rutland and the two Northamptonshire councils. Band D runs from ${h.m2(lo.bandD)} in ${lo.name} to ${h.m2(hi.bandD)} in ${hi.name}, which has one of the highest charges in England; ${h.ca('rutland', 'Rutland')} is close behind at ${h.m2(h.c('rutland').bandD)}. The simple average is ${h.m2(h.E.average(L))}. In the two-tier counties the county council takes the largest share of every bill, so neighbouring districts in the same county differ only by their own charge, a few hundred pounds at most, and by parish precepts. The calculator works out any band and household from these official figures, published by the government in March 2026.`;
  },
  faqs: (h) => [
    { q: 'Why is Rutland council tax so high?', a: `Rutland is one of England's smallest councils by population and a unitary council, so its single council charge covers all services that a county and a district would share elsewhere, for few taxpayers. Its Band D for ${h.P.taxYear} is ${h.m2(h.c('rutland').bandD)}. The county's police and fire precepts, shared with Leicestershire, are added on top of the council's own charge.` },
    { q: 'How much of a Lincolnshire district bill goes to the county council?', a: `In ${h.c('south-kesteven').name}, for example, Lincolnshire County Council takes ${h.m2(h.c('south-kesteven').parts.county)} of the ${h.m2(h.c('south-kesteven').bandD)} Band D bill, against ${h.m2(h.c('south-kesteven').parts.council)} for the district itself. Police and parishes make up the rest: Lincolnshire's fire service is run by the county council, so there is no separate fire line. The proportions are similar in the other six districts.` },
    { q: 'Do the East Midlands mayor and combined county authority add to council tax?', a: `Not in ${h.P.taxYear}. The East Midlands Combined County Authority, which covers Derbyshire, Nottinghamshire, Derby and Nottingham, sets no council tax precept according to the government\'s table. Bills in those areas consist of the council, police, fire and parish shares, as in the rest of the region.` },
  ],
  body: (h) => {
    const L = h.E.inRegion('East Midlands');
    const counties = ['Derbyshire', 'Leicestershire', 'Lincolnshire', 'Nottinghamshire'].map((n) => { const d = L.filter((c) => c.county === n); return `${n} ${h.m2(h.E.average(d))} across ${d.length} districts`; });
    const nott = h.c('nottingham'), rush = h.c('rushcliffe');
    return `
<h2>All East Midlands councils</h2>
${h.councilTable(L, `Two adults, main home, ${h.P.taxYear}. County, police, fire and average parish precepts included.`)}

<h2>The four counties</h2>
<p>Average Band D by county for ${h.P.taxYear}: ${counties.join('; ')}. The county share is the same in each district of a county, so the ranking inside a county is set by the districts' own charges and by their parishes. In Leicestershire and Derbyshire the fire authority covers both the county and its city, so a home in the city of Leicester and one in Blaby pay the same fire precept.</p>

<h2>City and suburb: Nottingham and Rushcliffe</h2>
<p>${h.ca('nottingham', 'Nottingham')} charges ${h.m2(nott.bandD)} at Band D, the top of the regional table. ${h.ca('rushcliffe', 'Rushcliffe')}, across the Trent, charges ${h.m2(rush.bandD)}, made up of the Nottinghamshire County Council share, a small district charge and parish precepts. Nottingham's homes are mostly in Bands A and B, Rushcliffe's are more often in C to E, so the bills households actually pay are closer than the Band D figures suggest. A Band A home in Nottingham pays ${h.m2(h.E.bandCharge(nott, 0))}; a Band D home in Rushcliffe ${h.m2(rush.bandD)}.</p>

<h2>Northamptonshire</h2>
<p>Since 2021 Northamptonshire has had two unitary councils, ${h.ca('north-northamptonshire', 'North Northamptonshire')} and ${h.ca('west-northamptonshire', 'West Northamptonshire')}, in place of a county council and seven districts. Each sends a single council charge, with Northamptonshire's police and fire precepts, both set by the county's police, fire and crime commissioner.</p>

<h2>Lincolnshire: the lowest charges</h2>
<p>The bottom of the regional table belongs to Lincolnshire. ${h.ca('south-kesteven', 'South Kesteven')} has the lowest Band D in the East Midlands at ${h.m2(h.c('south-kesteven').bandD)}, and ${h.ca('east-lindsey', 'East Lindsey')}, on the coast, is close behind. Lincolnshire County Council runs the fire service itself, so its bills have no separate fire line, and the county's share is lower than Nottinghamshire's. A Band C home in South Kesteven pays ${h.m2(h.E.bandCharge(h.c('south-kesteven'), 2))} this year; the same band in Rushcliffe ${h.m2(h.E.bandCharge(rush, 2))}.</p>

<h2>Using the calculator</h2>
<p>The calculator above opens on Derby, Band B. Change the council and band to see your bill, and add who lives in the home. For a parish with a high precept, the real bill can be slightly above the figure shown; the parish charge for your village or town is printed on your annual bill.</p>
`;
  },
});
