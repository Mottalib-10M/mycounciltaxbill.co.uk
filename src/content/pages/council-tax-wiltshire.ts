import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-wiltshire',
  group: 'councils',
  order: 160,
  tool: { kind: 'ct', props: { council: 'wiltshire', band: 4 } },
  related: ['region-south-west', 'council-tax-annexes', 'council-tax-increase-2026', 'second-home-council-tax'],
  sources: ['mhclg_levels', 'leg_annex', 'leg_exempt', 'gov_second_empty'],
  slug: 'wiltshire-council-tax',
  nav: 'Wiltshire',
  card: 'Wiltshire bands for 2026/27, why each town and parish pays a different amount, and the rules for family annexes.',
  title: 'Wiltshire Council Tax 2026/27: Bands, Parishes and Annexes',
  description: 'Wiltshire council tax 2026/27 for every band, why town and parish precepts make bills differ from village to village, family annex discounts and nearby areas.',
  h1: 'Wiltshire council tax 2026/27',
  intro: 'One unitary council for the whole county, and more than two hundred town and parish councils that each add their own precept.',
  resume: (h) => {
    const c = h.c('wiltshire'); const ch = h.E.change(c)!; const p = c.parts;
    const e = h.E.bill({ council: 'wiltshire', band: 4 });
    return `The average Band D council tax in Wiltshire for ${h.P.taxYear} is ${h.m2(c.bandD)}, ${h.pc(ch.rate, 1)} higher than the ${h.m2(c.bandDPrev!)} charged in 2025/26. The word average matters here: Wiltshire has ${h.num(c.parishes!)} town and parish councils, and their precepts add a mean of ${h.m2(p.parish)} at Band D, so the real figure on a bill depends on the parish where the home stands. The rest of the Band D total is ${h.m2(p.council)} for Wiltshire Council, which includes ${h.m2(p.asc!)} of adult social care precept, ${h.m2(p.police)} for the police and ${h.m2(p.fire)} for fire and rescue. A Band E home, where the calculator starts, pays ${h.m2(e.annual)} with two adults, or ${h.m2(e.first)} in April followed by nine payments of ${h.m2(e.regular)}. A family annex lived in by a relative can be exempt or receive ${h.pc(h.P.discounts.annexFamily)} off, a rule that often matters in a rural county.`;
  },
  faqs: (h) => {
    const c = h.c('wiltshire'); const own = c.bandD - c.parts.parish;
    return [
      { q: 'Why is my Wiltshire bill different from a friend\'s in the next village?', a: `Wiltshire Council, the police and fire charge the same in every parish: ${h.m2(own)} at Band D together for ${h.P.taxYear}. The town or parish precept is the only part that changes. Larger towns fund more local services and set higher precepts, while some small parishes ask for very little, so two Band D homes a few miles apart can pay noticeably different totals.` },
      { q: 'Do I pay council tax on a granny annexe in Wiltshire?', a: `An annexe that is a separate home is banded on its own. If a dependent relative aged 65 or over, or a person with a severe mental impairment, lives there, it is exempt. If another family member lives in it, or you use it as part of your own home, the 2013 annex regulations give a ${h.pc(h.P.discounts.annexFamily)} discount.` },
      { q: 'Is Wiltshire council tax higher than Swindon?', a: `Yes at Band D: ${h.m2(c.bandD)} on average in Wiltshire against ${h.m2(h.c('swindon').bandD)} in Swindon for ${h.P.taxYear}. Both are unitary councils, and the gap partly reflects the larger parish share across rural Wiltshire. Swindon's figure also includes parish precepts, averaged over the borough, so both numbers move a little from one street to the next.` },
    ];
  },
  body: (h) => {
    const c = h.c('wiltshire'); const p = c.parts;
    const near = ['swindon', 'bath-and-north-east-somerset', 'south-gloucestershire', 'somerset', 'dorset', 'cotswold', 'test-valley'];
    const rows = [c, ...near.map((id) => h.c(id))].sort((x, y) => y.bandD - x.bandD).map((x) => [x.id === c.id ? '<strong>Wiltshire</strong>' : h.ca(x.id), h.m2(x.parts.parish), h.m2(x.bandD), h.m2(h.E.bandCharge(x, 4)), h.pc(h.E.change(x)!.rate, 1)]);
    const sw = h.E.inRegion('South West'); const r = h.E.rankIn(c, sw);
    const share = p.parish / c.bandD;
    const annex = h.E.bandCharge(c, 0) * (1 - h.P.discounts.annexFamily);
    return `
<h2>Wiltshire charges by band, before the parish adjustment</h2>
${h.bandTable('wiltshire')}
<p>Read this table as a county average. The council publishes a separate set of band charges for each town and parish, because the precept differs in each one. Parish precepts make up ${h.pc(share, 1)} of the average Band D bill in Wiltshire, a far larger share than in most of England, where many urban areas have no parish at all.</p>

<h2>Town and parish councils</h2>
<p>Wiltshire Council runs the main services across the whole county, from schools to waste collection, while each town or parish council decides its own budget for local facilities and sets a precept to pay for it. A town council that runs open spaces or community buildings needs more than a small village that funds a hall and a clerk. The result is a wide spread of local charges on top of the ${h.m2(c.bandD - p.parish)} that every Band D home pays to Wiltshire Council, the police and fire. Your annual bill names the parish and shows its line separately, so it is the best way to see what you pay; the calculator above uses the county average.</p>

<h2>Wiltshire and its neighbours</h2>
<p>The comparison below includes the parish column, which explains part of the differences. Wiltshire ranks ${r.rank} of ${r.of} South West councils by Band D, from the dearest, and the ${h.a('region-south-west', 'South West page')} has the full list.</p>
${h.table(['Council', 'Parish average at D', 'Band D', 'Band E', 'Change on 2025/26'], rows, `${h.P.taxYear}, two adults, main home, from the ${h.src('mhclg_levels', 'government council tax levels')}.`, ['l', 'r', 'r', 'r', 'r'])}

<h2>Annexes on farms and family homes</h2>
<p>Converted barns, stables and garages used by relatives are a frequent case in the countryside. If an annexe has its own kitchen and bathroom it is usually banded separately by the Valuation Office Agency. The ${h.src('leg_exempt', 'Exempt Dwellings Order')} removes the charge entirely when the annexe is lived in by a dependent relative of the main household, for instance a parent aged 65 or over. Otherwise, an annexe used by a family member or as part of the main home receives a ${h.pc(h.P.discounts.annexFamily)} discount, so a Band A annexe would cost about ${h.m(annex)} a year at the average county rate. The ${h.a('council-tax-annexes', 'annexes guide')} sets out each case.</p>

<h2>Second homes and empty homes</h2>
<p>English councils may add up to 100 % on second homes and between 100 % and 300 % on long-term empty homes, depending on how long they have been empty. Check Wiltshire Council's own decision for ${h.P.taxYear} before relying on a figure, then select the case in the calculator and type the rate. The ${h.src('gov_second_empty', 'GOV.UK rules')} and the ${h.a('second-home-council-tax', 'second home guide')} explain who is caught and the exceptions.</p>
`;
  },
});
