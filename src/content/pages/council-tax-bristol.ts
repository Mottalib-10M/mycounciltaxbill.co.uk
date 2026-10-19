import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-bristol',
  group: 'councils',
  order: 60,
  tool: { kind: 'ct', props: { council: 'bristol', band: 1 } },
  related: ['region-south-west', 'challenge-council-tax-band', 'council-tax-annexes', 'council-tax-increase-2026'],
  sources: ['mhclg_levels', 'mhclg_release', 'voa_challenge', 'gov_who_pays'],
  slug: 'bristol-council-tax',
  nav: 'Bristol',
  card: 'Bristol bands for 2026/27, the Avon and Somerset police and Avon Fire shares, and the four other former Avon councils.',
  title: 'Bristol Council Tax 2026/27: All Bands and Where It Goes',
  description: 'Bristol council tax 2026/27 for every band, the Avon and Somerset police and Avon Fire shares, and how the city compares with Bath and South Gloucestershire.',
  h1: 'Bristol council tax 2026/27',
  intro: 'One of the highest city charges in England, with police and fire precepts shared across the old county of Avon.',
  resume: (h) => {
    const c = h.c('bristol'); const ch = h.E.change(c)!; const SW = h.E.inRegion('South West'); const r = h.E.rankIn(c, SW);
    const b = h.E.bill({ council: 'bristol', band: 1 });
    return `Bristol City Council's ${h.P.taxYear} council tax is ${h.m2(c.bandD)} at Band D for a household of two adults, compared with ${h.m2(c.bandDPrev!)} the year before, an increase of ${h.pc(ch.rate, 1)}. That puts Bristol ${r.rank} of the ${r.of} council areas in the South West by Band D, from the top, and well above the England average of ${h.m2(h.P.averages.england.bandD)}. In Band B, the annual bill is ${h.m2(b.annual)}, falling to ${h.m2(h.E.bill({ council: 'bristol', band: 1, household: 'one' }).annual)} where one adult lives alone. Within the Band D figure, ${h.m2(c.parts.police)} is collected for the Avon and Somerset Police and Crime Commissioner and ${h.m2(c.parts.fire)} for Avon Fire Authority. Bristol has no parish or town councils, so there is a single rate for each band across the whole city, from Avonmouth to Hengrove, set out in full below.`;
  },
  faqs: (h) => {
    const c = h.c('bristol'); const sg = h.c('south-gloucestershire');
    return [
      { q: 'Why is council tax lower in South Gloucestershire than in Bristol?', a: `Band D is ${h.m2(sg.bandD)} there and ${h.m2(c.bandD)} in Bristol, a gap of ${h.m(c.bandD - sg.bandD)}. Both pay the same Avon and Somerset police precept and the same Avon Fire share, so the gap is the city council's own charge, partly offset by parish precepts that Bristol does not have and South Gloucestershire does.` },
      { q: 'Does the West of England mayor add anything to a Bristol council tax bill?', a: `No precept for a combined authority appears in the government's ${h.P.taxYear} figures for Bristol, so the bill is split between the city council, the police and crime commissioner and the fire authority only. Transport and other regional services are funded in other ways, not through a line on the council tax bill.` },
      { q: 'How much more does a Bristol home in Band C pay than one in Band B?', a: `${h.m2(h.E.bandCharge(c, 2) - h.E.bandCharge(c, 1))} a year for two adults, because Band C is eight ninths of Band D and Band B seven ninths. If you think your home is in the wrong band, the Valuation Office handles challenges, not the city council, and you keep paying the current band until it decides.` },
    ];
  },
  body: (h) => {
    const c = h.c('bristol'); const p = c.parts;
    const avon = ['bristol', 'south-gloucestershire', 'north-somerset', 'bath-and-north-east-somerset'].map((id) => h.c(id));
    const ns = h.P.referendum.exceptions2627.find((x) => x.name === 'North Somerset')!;
    const rows = avon.map((x) => [x.id === 'bristol' ? '<strong>Bristol</strong>' : h.ca(x.id), h.m2(h.E.bandCharge(x, 1)), h.m2(h.E.bandCharge(x, 2)), h.m2(x.bandD), h.m2(x.parts.parish), h.pc(h.E.change(x)!.rate, 1)]);
    const own = p.council; const prec = p.police + p.fire;
    return `
<h2>Bristol, band by band</h2>
${h.bandTable('bristol')}
<p>The column for one adult applies the national discount of a quarter. At the other end, Band G and Band H homes pay fifteen and eighteen ninths of Band D, so a Band H bill is exactly three times a Band A bill.</p>

<h2>The city, the police and the fire authority</h2>
<p>Bristol keeps ${h.m2(own)} of every Band D bill, of which ${h.m2(p.asc!)} is the adult social care precept. The other ${h.m2(prec)} goes to two bodies covering a wider area: the Avon and Somerset Police and Crime Commissioner and Avon Fire Authority. According to the city's own guide to the bill, the police precept rose by about 5.1 % and the fire precept by about 5.5 % this year, more in percentage terms than the city's own increase, because both are allowed to add a fixed sum in pounds rather than a percentage.</p>

<h2>Bristol and the former county of Avon</h2>
<p>The four unitary councils that cover the area once called Avon share one fire authority and, with Somerset, one police and crime commissioner. That makes them easy to compare, because only the council and parish shares differ:</p>
${h.table(['Council', 'Band B', 'Band C', 'Band D', 'Parish average', 'Change'], rows, `${h.P.taxYear}, two adults, main home. Police and fire precepts are the same in all four.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>North Somerset was one of the few councils allowed to go above the usual limit this year, up to ${h.pc(ns.limit)} on its own charge, which explains its larger rise. Bristol remains the dearest of the four. Dorset, Cornwall, Wiltshire and the rest of the region are compared on the ${h.a('region-south-west', 'South West page')}.</p>

<h2>Annexes, empty homes and second homes</h2>
<p>A self-contained annexe has its own band and its own bill, but a relative living in one can have it halved or exempted; the ${h.a('council-tax-annexes', 'annexe guide')} sets out the conditions. The city's website currently lists the full national premiums: ${h.pc(h.P.premiums.england.secondHomeMax)} on a furnished second home from April 2025, and on an empty unfurnished home ${h.pc(h.P.premiums.england.emptyTiers[0].max)} after one year, ${h.pc(h.P.premiums.england.emptyTiers[1].max)} after five and ${h.pc(h.P.premiums.england.emptyTiers[2].max)} after ten. Confirm the rate on your bill before entering it in the calculator.</p>

<h2>If the band looks wrong</h2>
<p>The ${h.src('voa_challenge', 'Valuation Office challenge service')} is the route for a band you think is too high; the ${h.a('challenge-council-tax-band', 'challenge guide')} explains the evidence it expects and the risk that a review moves the band up as well as down. Keep paying while the case is open. The ${h.a('council-tax-increase-2026', 'increase page')} shows how this year's rises compare across England.</p>
`;
  },
});
