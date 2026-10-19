import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-cornwall',
  group: 'councils',
  order: 70,
  tool: { kind: 'ct', props: { council: 'cornwall', band: 2 } },
  related: ['region-south-west', 'second-home-council-tax', 'empty-property-council-tax', 'what-council-tax-band-am-i'],
  sources: ['mhclg_levels', 'mhclg_premiums', 'gov_second_empty', 'gov_bands'],
  slug: 'cornwall-council-tax',
  nav: 'Cornwall',
  card: 'Cornwall bands for 2026/27, the town and parish precepts that make up a large share of the bill, and the second homes premium.',
  title: 'Cornwall Council Tax 2026/27: Bands, Parishes, Second Homes',
  description: 'Cornwall council tax 2026/27 for each band, the town and parish precepts, the Devon and Cornwall police share and the 100 % premium on furnished second homes.',
  h1: 'Cornwall council tax 2026/27',
  intro: 'A single unitary council, a town or parish council in almost every community, and a doubled bill for second homes that continues this year.',
  resume: (h) => {
    const c = h.c('cornwall'); const ch = h.E.change(c)!; const b = h.E.bill({ council: 'cornwall', band: 2 });
    return `The average Band D council tax in Cornwall for ${h.P.taxYear} is ${h.m2(c.bandD)}, up ${h.pc(ch.rate, 1)} from ${h.m2(c.bandDPrev!)}. Cornwall Council raised its own part by ${h.pc(h.P.referendum.england.total)}, including the ${h.pc(h.P.referendum.england.asc)} adult social care precept, and the Devon and Cornwall Police and Crime Commissioner added ${h.m(h.P.referendum.england.policeCash)} at Band D, taking the police share to ${h.m2(c.parts.police)}. What makes Cornwall unusual is the weight of local councils: its ${c.parishes} parishes add an average of ${h.m2(c.parts.parish)} at Band D, far more than in any city, so the bill differs noticeably from one town to the next. A Band C home with two adults pays ${h.m2(b.annual)} on the Cornwall average. A furnished second home pays double, because the council has kept the ${h.pc(h.P.premiums.england.secondHomeMax)} premium for ${h.P.taxYear}, giving ${h.m2(h.E.bill({ council: 'cornwall', band: 2, occupancy: 'second' }).annual)} in Band C.`;
  },
  faqs: (h) => {
    const c = h.c('cornwall');
    return [
      { q: 'Is the Cornwall second homes premium still charged in 2026/27?', a: `Yes. Cornwall Council's page on council tax for 2026 says it will continue to charge the ${h.pc(h.P.premiums.england.secondHomeMax)} premium introduced on 1 April 2025. Exceptions include annexes used as part of the main home, job-related homes, some seasonal homes and, for up to a year, homes being actively marketed for sale or let.` },
      { q: 'Why is my parish precept so high in Cornwall?', a: `Town and parish councils pay for their own local services, which can include public toilets, open spaces or community halls, and they raise the money through a precept on the council tax bill. Across Cornwall the average comes to ${h.m2(c.parts.parish)} at Band D, but each council sets its own and there is no national cap this year.` },
      { q: 'Where is the fire service on a Cornwall council tax bill?', a: `There is no separate fire authority line. The government table shows no fire precept for Cornwall, unlike neighbouring Plymouth, where a separate fire precept of ${h.m2(h.c('plymouth').parts.fire)} at Band D is added. In Cornwall, fire and rescue is therefore funded from within the council's own share of the bill rather than by a separate precepting authority.` },
    ];
  },
  body: (h) => {
    const c = h.c('cornwall'); const p = c.parts;
    const ids = ['cornwall', 'plymouth', 'torridge', 'west-devon', 'isles-of-scilly'];
    const rows = ids.map((id) => { const x = h.c(id); return [id === 'cornwall' ? '<strong>Cornwall</strong>' : h.ca(id), h.m2(x.bandD), h.m2(x.parts.parish), h.m2(x.parts.police), h.m2(x.parts.fire)]; });
    const share = p.parish / c.bandD;
    const sec = [1, 2, 4].map((b) => [`Band ${h.E.letters('england')[b]}`, h.m2(h.E.bill({ council: 'cornwall', band: b }).annual), h.m2(h.E.bill({ council: 'cornwall', band: b, occupancy: 'second' }).annual)]);
    return `
<h2>Cornwall bands on the county average</h2>
${h.bandTable('cornwall')}
<p>These are averages: the precept of your own town or parish council replaces the ${h.m2(p.parish)} spread across the county in the figures above. Cornwall Council publishes the list of every parish charge, and the bill shows yours as a separate line.</p>

<h2>Town and parish councils</h2>
<p>The government table counts ${c.parishes} parishes in Cornwall, ranging from large town councils to small rural parishes with a handful of councillors. Parish precepts make up ${h.pc(share, 1)} of the average Band D bill, against well under one per cent in most large cities. They are not limited by the government's referendum rules this year, so a town council can raise its charge by more than Cornwall Council itself. The county council keeps ${h.m2(p.council)}, including ${h.m2(p.asc!)} for adult social care.</p>

<h2>Cornwall against its neighbours</h2>
${h.table(['Council', 'Band D', 'Parish average', 'Police', 'Fire'], rows, `${h.P.taxYear}, Band D, two adults, main home.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The Isles of Scilly, policed by the same commissioner, has its own council and the lowest Band D in the region. Plymouth, across the Tamar, has no parishes but pays a separate fire precept. The ${h.a('region-south-west', 'South West overview')} compares every council from Gloucestershire to Dorset.</p>

<h2>What a second home costs</h2>
<p>Owners of a furnished home that nobody lives in as their main residence pay twice the band charge in ${h.P.taxYear}. The single person discount does not apply, since no one lives there:</p>
${h.table(['Band', 'Main home, two adults', 'Second home'], sec, 'Cornwall average, with the 100 % second homes premium.', ['l', 'r', 'r'])}
<p>The national framework, including the prescribed exceptions, is in the ${h.src('mhclg_premiums', 'government guidance on premiums')} and the ${h.a('second-home-council-tax', 'second homes guide')}. Homes left empty and unfurnished also attract a premium after a year, up to ${h.pc(h.P.premiums.england.emptyTiers[2].max)} after ten years under the ${h.src('gov_second_empty', 'national rules')}; check Cornwall's current rate before using the calculator, and see the ${h.a('empty-property-council-tax', 'empty homes page')} for the tiers.</p>

<h2>Holiday lets are treated differently</h2>
<p>A self-catering property that is available and actually let to the public for long enough each year is not charged council tax at all: the Valuation Office moves it to the business rates list, and the owner deals with business rates instead. A furnished home used only by its owner and family, or let for too few days, stays on the council tax list and pays the premium. If the use of a property changes, the band or the rating can change too, so owners should tell both the council and the Valuation Office. The premium is worked out on the band charge after the parish precept, so it doubles the town or parish line as well.</p>

<h2>Finding your band</h2>
<p>Bands still rest on what a home was worth in 1991, so a band can look low against today's prices. The ${h.src('gov_bands', 'GOV.UK search')} shows the band of any address, and ${h.a('what-council-tax-band-am-i', 'this guide')} explains how to read the result.</p>
`;
  },
});
