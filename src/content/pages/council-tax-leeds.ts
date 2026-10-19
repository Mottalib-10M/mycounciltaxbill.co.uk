import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-leeds',
  group: 'councils',
  order: 20,
  tool: { kind: 'ct', props: { council: 'leeds', band: 1 } },
  related: ['region-yorkshire', 'council-tax-bands', 'council-tax-monthly-payments', 'second-home-council-tax'],
  sources: ['mhclg_levels', 'mhclg_release', 'gov_bands', 'gov_paying'],
  slug: 'leeds-council-tax',
  nav: 'Leeds',
  card: 'Leeds bands for 2026/27, the parish and town council precepts and how the city compares with West Yorkshire.',
  title: 'Leeds Council Tax 2026/27: Every Band and Parish Precepts',
  description: 'Leeds council tax 2026/27 for Bands A to H, with the parish and town council precepts of Wetherby or Otley, the West Yorkshire police share and nearby charges.',
  h1: 'Leeds council tax 2026/27',
  intro: 'One city charge, a West Yorkshire police and fire share, and a parish precept that depends on where in the district you live.',
  resume: (h) => {
    const c = h.c('leeds'); const ch = h.E.change(c)!; const b = h.E.bill({ council: 'leeds', band: 1 });
    const Y = h.E.inRegion('Yorkshire and the Humber'); const r = h.E.rankIn(c, Y);
    return `A Band D home in Leeds pays ${h.m2(c.bandD)} of council tax in ${h.P.taxYear}, against ${h.m2(c.bandDPrev!)} a year earlier, a rise of ${h.pc(ch.rate, 1)}. That figure is the average across the district, including the precepts of parish and town councils, and it ranks ${r.rank} of ${r.of} in Yorkshire and the Humber counted from the dearest, so Leeds sits near the cheaper end of the region. Most Leeds homes are in the lower bands: Band A costs ${h.m2(h.E.bandCharge(c, 0))} and Band B ${h.m2(b.annual)} for two adults, or ${h.m2(h.E.bill({ council: 'leeds', band: 1, household: 'one' }).annual)} for an adult living alone. Out of each Band D bill, ${h.m2(c.parts.police)} goes to West Yorkshire policing and ${h.m2(c.parts.fire)} to the West Yorkshire Fire and Rescue Authority. The figures come from the government's council tax levels for England, published in March 2026.`;
  },
  faqs: (h) => {
    const c = h.c('leeds');
    return [
      { q: 'Why does a house in Wetherby pay more council tax than one in Headingley?', a: `Wetherby has a town council and Headingley has none, so a Wetherby bill carries an extra precept for local services such as allotments, halls or Christmas lights. The rest of the bill, the city charge and the police and fire shares, is the same at any Leeds address in the same band. The Leeds Band D figure of ${h.m2(c.bandD)} already includes the parish average.` },
      { q: 'Who sets the police part of a Leeds council tax bill?', a: `The Mayor of West Yorkshire, who carries out the role of police and crime commissioner for the county. The police precept is ${h.m2(c.parts.police)} at Band D for ${h.P.taxYear}, identical in Leeds, Bradford, Calderdale, Kirklees and Wakefield. Leeds City Council collects it on the same bill and passes it on, but does not decide the amount.` },
      { q: 'Is Leeds council tax cheaper than Bradford?', a: `Yes, at every band. Band D costs ${h.m2(c.bandD)} in Leeds and ${h.m2(h.c('bradford').bandD)} in Bradford, a gap of ${h.m(h.c('bradford').bandD - c.bandD)} a year. Both councils pay the same West Yorkshire police and fire precepts, so the difference lies entirely in what each city council and its parishes charge.` },
    ];
  },
  body: (h) => {
    const c = h.c('leeds'); const p = c.parts;
    const wy = ['leeds', 'bradford', 'kirklees', 'calderdale', 'wakefield', 'york'];
    const rows = wy.map((id) => { const x = h.c(id); return [id === 'leeds' ? '<strong>Leeds</strong>' : h.ca(id), h.m2(h.E.bandCharge(x, 0)), h.m2(h.E.bandCharge(x, 1)), h.m2(x.bandD), h.pc(h.E.change(x)!.rate, 1)]; });
    return `
<h2>Leeds charges band by band</h2>
${h.bandTable('leeds')}
<p>The ratios are fixed by law: Band A is two thirds of Band D and Band H is double it. Your band depends on what the home was worth on 1 April 1991, and you can look it up on the ${h.src('gov_bands', 'GOV.UK band search')} before reading across the row. A detailed guide to the eight letters is on the ${h.a('council-tax-bands', 'council tax bands page')}.</p>

<h2>Parish and town councils in Leeds</h2>
<p>Large parts of the district outside the inner city are parished. The government table records ${c.parishes} parish areas in Leeds, and the council's own list of ${h.P.taxYear} precepts runs from Aberford and District to Wetherby, taking in Otley, Horsforth, Morley, Boston Spa and Kippax on the way. Each one sets its own precept, and there is no national limit on how much it can rise this year. Wetherby has the largest Band D precept on the list and Arthington the smallest.</p>
<p>Spread over every home in the district, these precepts come to ${h.m2(p.parish)} at Band D, which is why the published Leeds figure is an average. A household in an unparished ward such as Chapel Allerton or Armley pays slightly less than the calculator shows; a household in a town with an active council pays a little more. The precept appears as its own line on the bill.</p>

<h2>What the city keeps and what it passes on</h2>
<p>Leeds City Council keeps ${h.m2(p.council)} of the Band D charge, of which ${h.m2(p.asc!)} is the adult social care precept. The rest goes to two West Yorkshire bodies: ${h.m2(p.police)} for policing, set by the Mayor of West Yorkshire, and ${h.m2(p.fire)} for the fire and rescue authority. Both rose by the most the government allowed without a referendum for ${h.P.taxYear}: ${h.m(h.P.referendum.england.policeCash)} for police and ${h.m(h.P.referendum.england.fireCash)} for fire at Band D. A comparison with the rest of West Yorkshire and with York:</p>
${h.table(['Council', 'Band A', 'Band B', 'Band D', 'Change'], rows, `${h.P.taxYear}, two adults, main home. The West Yorkshire police and fire precepts are the same in the first five.`, ['l', 'r', 'r', 'r', 'r'])}
<p>For the wider picture across the region, including Hull, Sheffield and North Yorkshire, see the ${h.a('region-yorkshire', 'Yorkshire and the Humber page')}.</p>

<h2>Homes that are not anyone's main residence</h2>
<p>Leeds charges a premium on long-term empty homes and, since April 2025, on furnished second homes; its website says a second home pays at least double. The national ceilings are ${h.pc(h.P.premiums.england.secondHomeMax)} for a second home and up to ${h.pc(h.P.premiums.england.emptyTiers[2].max)} after ten years empty, explained on the ${h.a('second-home-council-tax', 'second homes page')}. Check the rate on your own bill and enter it in the calculator.</p>

<h2>Spreading the payments</h2>
<p>A Band B bill of ${h.m2(h.E.bill({ council: 'leeds', band: 1 }).annual)} works out at ${h.m2(h.E.bill({ council: 'leeds', band: 1, instalments: 12 }).perMonth12)} a month if you ask for twelve instalments instead of ten. The ${h.src('gov_paying', 'GOV.UK guidance on paying')} sets out your right to the longer plan; the ${h.a('council-tax-monthly-payments', 'monthly payments guide')} shows how the first instalment is rounded.</p>
`;
  },
});
