import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-newcastle-upon-tyne',
  group: 'councils',
  order: 110,
  tool: { kind: 'ct', props: { council: 'newcastle-upon-tyne', band: 0 } },
  related: ['region-north-east', 'council-tax-students', 'challenge-council-tax-band', 'empty-property-council-tax'],
  sources: ['mhclg_levels', 'mhclg_release', 'gov_students', 'gov_second_empty'],
  slug: 'newcastle-council-tax',
  nav: 'Newcastle',
  card: 'Newcastle upon Tyne bands for 2026/27, its six parishes and how the city compares with Gateshead and the rest of Tyneside.',
  title: 'Newcastle Council Tax 2026/27: Bands and Tyneside Compared',
  description: 'Newcastle upon Tyne council tax 2026/27 for every band, the six parish precepts, the police and fire shares, and how it compares with Gateshead and Sunderland.',
  h1: 'Newcastle upon Tyne council tax 2026/27',
  intro: 'A city bill with a few parishes on its northern edge and police and fire shares common to Tyneside.',
  resume: (h) => {
    const c = h.c('newcastle-upon-tyne'); const ch = h.E.change(c)!; const NE = h.E.inRegion('North East'); const r = h.E.rankIn(c, NE);
    const a = h.E.bill({ council: 'newcastle-upon-tyne', band: 0 });
    return `For ${h.P.taxYear}, Newcastle City Council has set an average Band D council tax of ${h.m2(c.bandD)}, an increase of ${h.pc(ch.rate, 1)} on the previous ${h.m2(c.bandDPrev!)}. Among the ${r.of} councils of the North East it is ${r.rank}${r.rank === 1 ? 'st' : r.rank === 2 ? 'nd' : r.rank === 3 ? 'rd' : 'th'} from the top, in a region where Band D charges are generally above the England average of ${h.m2(h.P.averages.england.bandD)}. Two adults in a Band A home, the lowest band, pay ${h.m2(a.annual)} this year, and a single adult in the same home ${h.m2(h.E.bill({ council: 'newcastle-upon-tyne', band: 0, household: 'one' }).annual)}. Of the Band D total, ${h.m2(c.parts.police)} is the police precept and ${h.m2(c.parts.fire)} the fire precept, both shared with the other Tyne and Wear councils. A handful of parishes in the north and west of the city add a small local charge; elsewhere there is none. The figures come from the government's March 2026 tables.`;
  },
  faqs: (h) => {
    const c = h.c('newcastle-upon-tyne'); const g = h.c('gateshead');
    return [
      { q: 'Is Gateshead council tax higher than Newcastle?', a: `Yes, at every band. Gateshead charges ${h.m2(g.bandD)} at Band D against ${h.m2(c.bandD)} in Newcastle, so crossing the Tyne Bridge into Gateshead adds ${h.m(h.E.bandCharge(g, 0) - h.E.bandCharge(c, 0))} a year to a Band A bill. The police and fire shares are identical on both banks; only the councils' own charges differ.` },
      { q: 'Which parts of Newcastle pay a parish precept?', a: `The council's list of ${h.P.taxYear} precepts covers six areas: Brunswick, Dinnington, Hazlerigg, North Fenham and Blakelaw, North Gosforth and Woolsington. Hazlerigg has the highest charge of the six. The rest of the city has no parish, so most households pay slightly less than the Band D average of ${h.m2(c.bandD)} shown here.` },
      { q: 'Do Newcastle students in shared flats pay council tax?', a: 'Not if every resident is a full-time student. The property is then exempt, provided each student gives the council a certificate from their university or college. If a non-student moves in, that person becomes liable, and the bill is reduced by a quarter when they are the only adult who counts.' },
    ];
  },
  body: (h) => {
    const c = h.c('newcastle-upon-tyne'); const p = c.parts;
    const tw = h.E.inRegion('North East').filter((x) => x.parts.police === p.police).sort((x, y) => y.bandD - x.bandD);
    const rows = tw.map((x) => [x.id === 'newcastle-upon-tyne' ? '<strong>Newcastle upon Tyne</strong>' : h.ca(x.id), h.m2(h.E.bandCharge(x, 0)), h.m2(h.E.bandCharge(x, 1)), h.m2(x.bandD), x.parts.fire ? h.m2(x.parts.fire) : 'none']);
    const north = h.c('northumberland');
    return `
<h2>Bands A to H in Newcastle</h2>
${h.bandTable('newcastle-upon-tyne')}
<p>The table uses the city's average Band D, which includes ${h.m2(p.parish)} of parish precepts spread over every home. Outside the six parished areas the true charge is a pound or two lower at Band D.</p>

<h2>One police force, two fire arrangements</h2>
<p>The police precept of ${h.m2(p.police)} at Band D is the same across the five Tyne and Wear councils and Northumberland. The fire precept of ${h.m2(p.fire)} is paid only in Tyne and Wear; ${north.name} shows no separate fire line in the government table. No combined authority or mayoral precept appears on a Newcastle bill this year. Newcastle City Council keeps ${h.m2(p.council)}, with ${h.m2(p.asc!)} of it raised for adult social care.</p>
${h.table(['Council', 'Band A', 'Band B', 'Band D', 'Fire at D'], rows, `Councils sharing the same police precept, ${h.P.taxYear}, two adults, main home.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Newcastle sits in the middle of the group, cheaper than Gateshead and Northumberland, dearer than North and South Tyneside and well above Sunderland, which has the lowest Band D of any council in the North East. The ${h.a('region-north-east', 'North East overview')} adds Durham, Teesside and Darlington.</p>

<h2>Student houses and halls</h2>
<p>Student housing follows national rules, the same in Jesmond as anywhere in England. A house where everyone is a full-time student is exempt, and halls of residence are outside council tax altogether. The ${h.src('gov_students', 'GOV.UK guidance for students')} and the ${h.a('council-tax-students', 'student page')} explain who qualifies and what happens over the summer between courses. Landlords of houses in multiple occupation are usually the liable person instead of the tenants.</p>

<h2>Empty homes and second homes</h2>
<p>The city's website lists a ${h.pc(h.P.premiums.england.secondHomeMax)} premium on furnished second homes from April 2025, and premiums of ${h.pc(h.P.premiums.england.emptyTiers[0].max)}, ${h.pc(h.P.premiums.england.emptyTiers[1].max)} and ${h.pc(h.P.premiums.england.emptyTiers[2].max)} on homes empty and unfurnished for one, five and ten years. The ${h.src('gov_second_empty', 'national rules')} list the exceptions; the ${h.a('empty-property-council-tax', 'empty property guide')} explains the tiers.</p>

<h2>Questioning your band</h2>
<p>Bands were set on 1991 values and are not reviewed automatically. If similar homes in your street sit in a lower band, the ${h.a('challenge-council-tax-band', 'band challenge guide')} sets out how to ask the Valuation Office for a review, and the risk that the band could rise as well as fall. Keep paying the current bill while the review runs: if the band is lowered, the council refunds the difference for the period covered, and the calculator above shows what the new band would cost.</p>
`;
  },
});
