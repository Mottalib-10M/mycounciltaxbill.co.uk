import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'region-north-east',
  group: 'regions',
  order: 10,
  tool: { kind: 'ct', props: { council: 'sunderland', band: 0 } },
  related: ['council-tax-newcastle-upon-tyne', 'council-tax-durham', 'council-tax-increase-2026', 'council-tax-disabled-band-reduction'],
  sources: ['mhclg_levels', 'mhclg_release', 'voa_check'],
  slug: 'north-east-council-tax',
  nav: 'North East',
  card: 'Twelve councils from Northumberland to Redcar, with high Band D charges and mostly low bands.',
  title: 'North East Council Tax 2026/27: All 12 Councils by Band',
  description: 'North East council tax 2026/27 for all 12 councils: Bands A, D and H, the change on last year, the police and fire shares, and why bills differ so much.',
  h1: 'North East council tax 2026/27',
  intro: 'High charges per band, low bands per home: the region where the Band D figure misleads the most.',
  resume: (h) => {
    const L = h.E.inRegion('North East'); const s = [...L].sort((a, b) => a.bandD - b.bandD); const lo = s[0], hi = s[s.length - 1];
    return `The North East has ${L.length} councils, all of them unitary or metropolitan, so each sends a single bill without a county council share. For ${h.P.taxYear} their Band D charges run from ${h.m2(lo.bandD)} in ${lo.name} to ${h.m2(hi.bandD)} in ${hi.name}, with a simple average of ${h.m2(h.E.average(L))}, above the English average of ${h.m2(h.P.averages.england.bandD)}. That headline is misleading for most households, because the region has more homes in Band A than any other part of England: a Band A home in ${hi.name} pays ${h.m2(h.E.bandCharge(hi, 0))}, and in ${lo.name} ${h.m2(h.E.bandCharge(lo, 0))}. Three police areas share the region, Northumbria, Durham and Cleveland, and their precepts explain part of the gap between the north and south of it. Neither of the region's two combined authorities sets a council tax precept this year.`;
  },
  faqs: (h) => [
    { q: 'Why is council tax so high in the North East when house prices are low?', a: 'Partly because councils there raise less from business rates and have long relied more on government grant, and a large share of homes in Band A means the Band D charge has to be higher to raise the same sum. A typical household pays far less than the Band D figure, because most homes are in Bands A and B.' },
    { q: 'Which North East council has the cheapest council tax?', a: `${[...h.E.inRegion('North East')].sort((a, b) => a.bandD - b.bandD)[0].name} has the lowest Band D charge in the region for ${h.P.taxYear}, at ${h.m2([...h.E.inRegion('North East')].sort((a, b) => a.bandD - b.bandD)[0].bandD)} for two adults. Compare by your band, not Band D: the gap between councils in Band A is two thirds of the Band D gap, so the saving from moving is smaller than it looks.` },
    { q: 'Is the North East mayor adding to council tax this year?', a: 'No. The North East Combined Authority and the Tees Valley Combined Authority, which each have an elected mayor, set no council tax precept for 2026/27 according to the government\'s table. Police and fire precepts remain separate and are set by the police and crime commissioners and the fire authorities.' },
  ],
  body: (h) => {
    const L = h.E.inRegion('North East'); const tw = ['newcastle-upon-tyne', 'gateshead', 'sunderland', 'south-tyneside', 'north-tyneside'].map((id) => h.c(id));
    const north = h.c('sunderland').parts, tees = h.c('middlesbrough').parts;
    return `
<h2>Every council in the North East</h2>
${h.councilTable(L, `Two adults, main home, ${h.P.taxYear}, from the highest Band D. Police, fire and average parish precepts included.`)}

<h2>Band A is the band that matters here</h2>
<p>Band D is the reference band for every comparison, but in the North East it describes a minority of homes. Terraced streets built for shipyards, mines and steelworks were valued in 1991 well under the Band A ceiling of ${h.P.bands.england.ranges[0].replace('up to ', '')}. For those homes the bill is two thirds of the table's Band D column. A single adult, common in the region's older housing, takes a further ${h.pc(h.P.discounts.singlePerson)} off: a Band A home in ${h.ca('gateshead', 'Gateshead')} with one adult pays ${h.m2(h.E.bill({ council: 'gateshead', band: 0, household: 'one' }).annual)} this year.</p>

<h2>Tyne and Wear side by side</h2>
<p>The five Tyne and Wear councils share Northumbria Police and Tyne and Wear Fire, so their bills differ only by the councils' own charges. Their Band D figures for ${h.P.taxYear}: ${tw.map((c) => `${c.name} ${h.m2(c.bandD)}`).join(', ')}. Police and fire together add ${h.m2(north.police + north.fire)} at Band D in all five. On Teesside, Cleveland Police and Cleveland Fire add ${h.m2(tees.police + tees.fire)}, so the same Band D council charge produces a different total.</p>

<h2>Small rises this year</h2>
<p>Several North East councils raised their bills by less than the ${h.pc(h.P.referendum.england.total, 2)} allowed. The smallest total rises in England were on Teesside, where ${h.ca('hartlepool', 'Hartlepool')} and ${h.ca('middlesbrough', 'Middlesbrough')} went up by ${h.pc(h.E.change(h.c('hartlepool'))!.rate, 1)}. The ${h.a('council-tax-increase-2026', 'increase page')} compares them with the rest of England.</p>

<h2>Most of the bill is the council's own</h2>
<p>With no county tier, a North East bill has fewer parts than one in the Midlands or the South. In ${h.ca('sunderland', 'Sunderland')}, for example, the city council's own charge is ${h.m2(h.c('sunderland').parts.council)} of the ${h.m2(h.c('sunderland').bandD)} Band D bill, including ${h.m2(h.c('sunderland').parts.asc!)} raised for adult social care; the rest is police, fire and a very small parish share. Decisions taken in the town hall therefore explain almost all of the differences in the table above.</p>

<h2>Using the calculator</h2>
<p>The calculator above starts on Sunderland, Band A. Change the council and band, then say who lives in the home: the region has many single-adult and student households, and Durham and Newcastle have large student populations, covered in the ${h.a('council-tax-students', 'student guide')}. Parish precepts are small in the urban councils and larger in ${h.ca('northumberland', 'Northumberland')} and ${h.ca('durham', 'County Durham')}, where a village bill can be a little above the figure shown.</p>
`;
  },
});
