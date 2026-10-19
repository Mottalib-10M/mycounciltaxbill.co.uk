import { definePage } from '../../lib/guide-types';

const CITIES = ['birmingham', 'bristol', 'leeds', 'liverpool', 'manchester', 'newcastle-upon-tyne', 'nottingham', 'sheffield'];
const NOTTS = ['ashfield', 'bassetlaw', 'broxtowe', 'gedling', 'mansfield', 'newark-and-sherwood', 'rushcliffe'];

export default definePage({
  id: 'council-tax-nottingham',
  group: 'councils',
  order: 100,
  tool: { kind: 'ct', props: { council: 'nottingham', band: 0 } },
  related: ['region-east-midlands', 'council-tax-bands', 'council-tax-increase-2026', 'council-tax-monthly-payments'],
  sources: ['mhclg_levels', 'mhclg_release', 'gov_paying', 'gov_bands'],
  slug: 'nottingham-council-tax',
  nav: 'Nottingham',
  card: 'Nottingham bands for 2026/27, the highest Band D of the big English cities, and the Nottinghamshire police and fire shares.',
  title: 'Nottingham Council Tax 2026/27: Bands and Big City Ranking',
  description: 'Nottingham council tax 2026/27 for Bands A to H, why its Band D is the highest of the large English cities, the police and fire shares and the county gap.',
  h1: 'Nottingham council tax 2026/27',
  intro: 'The dearest Band D of England\'s large regional cities, even after a rise in the council\'s own share below the usual limit.',
  resume: (h) => {
    const c = h.c('nottingham'); const ch = h.E.change(c)!; const a = h.E.bill({ council: 'nottingham', band: 0 });
    const L = CITIES.map((id) => h.c(id)); const r = h.E.rankIn(c, L);
    return `Nottingham's Band D council tax for ${h.P.taxYear} is ${h.m2(c.bandD)}, up ${h.pc(ch.rate, 1)} from ${h.m2(c.bandDPrev!)}, for two adults in their main home. Of the ${r.of} largest regional cities of England, from Birmingham to Newcastle, it ranks ${r.rank === 1 ? 'first' : r.rank}, the most expensive at Band D, and it ranks ${h.E.rankIn(c, h.E.inRegion('East Midlands')).rank} of ${h.E.rankIn(c, h.E.inRegion('East Midlands')).of} council areas in the East Midlands. The city council's own share rose by 3.5 % this year according to its published charges, less than the ${h.pc(h.P.referendum.england.total)} it could have added, while the police and fire precepts rose faster. In Band A, the lowest band, the bill is ${h.m2(a.annual)} for two adults and ${h.m2(h.E.bill({ council: 'nottingham', band: 0, household: 'one' }).annual)} for one. Of the Band D total, ${h.m2(c.parts.police)} goes to the Nottinghamshire Police and Crime Commissioner and ${h.m2(c.parts.fire)} to the fire and rescue authority.`;
  },
  faqs: (h) => {
    const c = h.c('nottingham'); const r = h.c('rushcliffe');
    return [
      { q: 'Is it cheaper to live in West Bridgford than in Nottingham for council tax?', a: `Yes. West Bridgford is in Rushcliffe, where Band D averages ${h.m2(r.bandD)} including county, district and parish shares, against ${h.m2(c.bandD)} in the city. A Band A home pays ${h.m(h.E.bandCharge(c, 0) - h.E.bandCharge(r, 0))} a year less there. Police and fire precepts are identical on both sides of the Trent.` },
      { q: 'Why did Nottingham council tax rise less than in most cities this year?', a: `The total Band D bill rose by ${h.pc(h.E.change(c)!.rate, 1)}, below the England average of ${h.pc(h.P.averages.england.change, 1)}, because the city council chose a rise of 3.5 % in its own share, under the ${h.pc(h.P.referendum.england.total)} limit. The police commissioner and the fire authority both increased their precepts by more than five per cent, so the overall change ends up between the two.` },
      { q: 'How much is a Band C home in Nottingham?', a: `${h.m2(h.E.bandCharge(c, 2))} a year for two adults in ${h.P.taxYear}, or ${h.m2(h.E.bill({ council: 'nottingham', band: 2, household: 'one' }).annual)} for an adult living alone. Spread over the standard ten instalments, the two-adult bill is about ${h.m(h.E.bandCharge(c, 2) / 10)} a month from April to January. Over twelve instalments it falls to about ${h.m(h.E.bandCharge(c, 2) / 12)}, with the same yearly total.` },
    ];
  },
  body: (h) => {
    const c = h.c('nottingham'); const p = c.parts;
    const L = CITIES.map((id) => h.c(id)).sort((x, y) => y.bandD - x.bandD);
    const rows = L.map((x) => [x.id === 'nottingham' ? '<strong>Nottingham</strong>' : h.ca(x.id), h.m2(h.E.bandCharge(x, 0)), h.m2(x.bandD), h.pc(h.E.change(x)!.rate, 1)]);
    const notts = NOTTS.map((id) => h.c(id)); const hi = [...notts].sort((x, y) => y.bandD - x.bandD)[0];
    return `
<h2>Nottingham band charges</h2>
${h.bandTable('nottingham')}
<p>Nottingham has no parish councils, so this table is exact for every address inside the city boundary. The second column gives the fixed fraction of Band D for each band: a Band H home pays three times as much as a Band A home, whatever the house is worth today. The single adult column applies the national discount of a quarter, which a household can claim whenever only one adult counts, even if children or disregarded adults live there too.</p>

<h2>Eight cities compared</h2>
<p>The table ranks the largest English cities outside London by Band D. Band A is shown as well, since lower bands are common in all of these cities and the Band D figure overstates a typical bill.</p>
${h.table(['City', 'Band A', 'Band D', 'Change'], rows, `${h.P.taxYear}, two adults, main home, police, fire and any mayoral precept included.`, ['l', 'r', 'r', 'r'])}
<p>The spread between the dearest and cheapest city on this list is ${h.m(L[0].bandD - L[L.length - 1].bandD)} a year at Band D. Part of it is police and fire, which differ by force area, but most comes from the city councils' own charges, shaped by years of local decisions on spending and on previous rises.</p>

<h2>What the bill is made of</h2>
<p>The city council's share is ${h.m2(p.council)}, including ${h.m2(p.asc!)} of adult social care precept. The Police and Crime Commissioner takes ${h.m2(p.police)} and the fire and rescue authority ${h.m2(p.fire)}. Both of those also apply across Nottinghamshire, which is why comparisons with the county isolate the council charge.</p>

<h2>Crossing the city boundary</h2>
<p>Nottinghamshire's seven districts all have lower Band D charges than the city, even though their residents pay three tiers: the county council, the district and often a parish. The dearest of them is ${hi.name} at ${h.m2(hi.bandD)}. For the city, Derby and Leicester as well, see the ${h.a('region-east-midlands', 'East Midlands ranking')}. The ${h.a('council-tax-increase-2026', 'guide to the 2026 increases')} explains why each council could add up to ${h.pc(h.P.referendum.england.total)}.</p>

<h2>Bands and payments</h2>
<p>Your band rests on a 1991 valuation, and the ${h.src('gov_bands', 'GOV.UK band search')} confirms it for any address; the ${h.a('council-tax-bands', 'bands guide')} explains the ratios. Paying over twelve months rather than ten is a right if you ask, as the ${h.src('gov_paying', 'GOV.UK page on paying')} sets out, and the ${h.a('council-tax-monthly-payments', 'monthly payments guide')} shows the effect on each instalment. If you cannot pay, contact the council early: arrears lead to a reminder, then to the whole year falling due.</p>
`;
  },
});
