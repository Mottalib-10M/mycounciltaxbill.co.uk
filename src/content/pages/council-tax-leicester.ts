import { definePage } from '../../lib/guide-types';

const COUNTY = ['blaby', 'charnwood', 'harborough', 'hinckley-and-bosworth', 'melton', 'north-west-leicestershire', 'oadby-and-wigston'];

export default definePage({
  id: 'council-tax-leicester',
  group: 'councils',
  order: 90,
  tool: { kind: 'ct', props: { council: 'leicester', band: 0 } },
  related: ['region-east-midlands', 'council-tax-moving-house', 'council-tax-single-person-discount', 'what-council-tax-band-am-i'],
  sources: ['mhclg_levels', 'mhclg_release', 'gov_who_pays', 'gov_second_empty'],
  slug: 'leicester-council-tax',
  nav: 'Leicester',
  card: 'Leicester bands for 2026/27 and how the city\'s single-tier bill compares with the Leicestershire districts around it.',
  title: 'Leicester Council Tax 2026/27: City Bands vs Leicestershire',
  description: 'Leicester council tax 2026/27 for every band, the Leicestershire police and combined fire shares, and why the city costs more than Blaby, Oadby or Charnwood.',
  h1: 'Leicester council tax 2026/27',
  intro: 'A unitary city surrounded by two-tier Leicestershire: one council charge inside the boundary, three or four outside it.',
  resume: (h) => {
    const c = h.c('leicester'); const ch = h.E.change(c)!; const a = h.E.bill({ council: 'leicester', band: 0 });
    const dear = Math.max(...COUNTY.map((id) => h.c(id).bandD));
    return `Leicester City Council charges ${h.m2(c.bandD)} at Band D for ${h.P.taxYear}, a rise of ${h.pc(ch.rate, 1)} on the ${h.m2(c.bandDPrev!)} of 2025/26, for a home with two adults. That is more than any of the seven Leicestershire districts that surround the city, where the dearest Band D, parish average included, is ${h.m2(dear)}. In Band A, the lowest band, a Leicester household of two adults pays ${h.m2(a.annual)} a year and a single adult ${h.m2(h.E.bill({ council: 'leicester', band: 0, household: 'one' }).annual)}. The Band D bill includes ${h.m2(c.parts.police)} for the Police and Crime Commissioner for Leicestershire and ${h.m2(c.parts.fire)} for the Combined Fire Authority, both the same in the city, the county and Rutland. Leicester has no parish councils, so the city figure applies to every street. The figures are those of the government's ${h.P.taxYear} table of council tax levels.`;
  },
  faqs: (h) => {
    const c = h.c('leicester'); const o = h.c('oadby-and-wigston');
    return [
      { q: 'Why does Oadby pay less council tax than Leicester when it is next door?', a: `Oadby and Wigston is a district inside Leicestershire, so its bill combines the county council, the district council and the same police and fire shares. Together they come to ${h.m2(o.bandD)} at Band D, ${h.m(c.bandD - o.bandD)} less than Leicester's ${h.m2(c.bandD)}. A city council funds every local service itself, from social care to bin collection, from one charge.` },
      { q: 'Who runs fire and rescue for Leicester council tax payers?', a: `The Combined Fire Authority for Leicester, Leicestershire and Rutland, which runs Leicestershire Fire and Rescue Service and sets a precept of ${h.m2(c.parts.fire)} at Band D for ${h.P.taxYear}. It is paid in the city, in all seven county districts and in Rutland, and appears as its own line on the bill. The city council collects it but has no say in the amount.` },
      { q: 'Does Leicester double the bill on a second home?', a: `The council's page on empty properties and second homes says owners pay an extra ${h.pc(h.P.premiums.england.secondHomeMax)} of the usual charge on a furnished home where nobody lives as their sole or main residence. Exceptions apply, such as a home on the market. Check the council's current notice before you rely on the rate for this year.` },
    ];
  },
  body: (h) => {
    const c = h.c('leicester'); const p = c.parts; const county = h.c('blaby').parts.county;
    const rows = [c, ...COUNTY.map((id) => h.c(id)), h.c('rutland')].sort((x, y) => y.bandD - x.bandD)
      .map((x) => [x.id === 'leicester' ? '<strong>Leicester</strong>' : h.ca(x.id), h.m2(h.E.bandCharge(x, 0)), h.m2(x.bandD), x.parts.county ? h.m2(x.parts.county) : 'none', h.m2(x.parts.parish)]);
    const dist = COUNTY.map((id) => h.c(id));
    const avg = h.E.average(dist);
    return `
<h2>Every band in the city</h2>
${h.bandTable('leicester')}
<p>Because Leicester is unparished, these figures are exact for every address in the city: there is no average hidden in them, unlike in the county.</p>

<h2>One tier inside, two or three outside</h2>
<p>Leicester City Council is a unitary authority, responsible for every council service in the city. Across the boundary, a household pays Leicestershire County Council ${h.m2(county)} at Band D, then a district council and, in most villages, a parish. The seven districts average ${h.m2(avg)} at Band D, ${h.m(c.bandD - avg)} below the city. A Band B home in Leicester pays ${h.m2(h.E.bandCharge(c, 1))}; the same band in ${h.ca('charnwood', 'Charnwood')} costs ${h.m2(h.E.bandCharge(h.c('charnwood'), 1))}.</p>
${h.table(['Council', 'Band A', 'Band D', 'County share', 'Parish average'], rows, `Leicester, the Leicestershire districts and Rutland, ${h.P.taxYear}, two adults, main home.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Rutland, a small unitary county, is the exception, with a Band D above the city's. The ${h.a('region-east-midlands', 'East Midlands page')} has the full regional ranking, from Nottingham to Lincolnshire.</p>

<h2>Where the city's charge goes</h2>
<p>Leicester City Council keeps ${h.m2(p.council)} of the Band D bill, including ${h.m2(p.asc!)} for adult social care. The police precept, ${h.m2(p.police)}, and the combined fire authority's ${h.m2(p.fire)} rose this year by exactly the cash sums allowed without a referendum, ${h.m(h.P.referendum.england.policeCash)} and ${h.m(h.P.referendum.england.fireCash)} at Band D, as the council's notes on the bill show. Neither is decided by the city.</p>

<h2>Moving between the city and the county</h2>
<p>A move across the boundary changes the council that bills you, even if the band stays the same. The old council charges up to the day before you leave and the new one from the day you arrive, as the ${h.a('council-tax-moving-house', 'moving house guide')} explains. If you will live alone at the new address, apply for the ${h.a('council-tax-single-person-discount', 'single person discount')} straight away; the ${h.src('gov_who_pays', 'GOV.UK rules on who pays')} decide who counts.</p>

<h2>Ten or twelve payments</h2>
<p>A Band A bill of ${h.m2(h.E.bill({ council: 'leicester', band: 0 }).annual)} is normally collected in ten monthly instalments from April, the first ${h.m2(h.E.instalmentPlan(h.E.bill({ council: 'leicester', band: 0 }).annual, 10).first)} and the rest ${h.m2(h.E.instalmentPlan(h.E.bill({ council: 'leicester', band: 0 }).annual, 10).regular)}. Asking for twelve brings each payment down to about ${h.m(h.E.bill({ council: 'leicester', band: 0 }).annual / 12)} without changing the yearly total. Direct Debit is the simplest way to keep to the dates the council sets.</p>

<h2>Empty and second homes</h2>
<p>The council's website lists premiums of ${h.pc(h.P.premiums.england.emptyTiers[0].max)}, ${h.pc(h.P.premiums.england.emptyTiers[1].max)} and ${h.pc(h.P.premiums.england.emptyTiers[2].max)} for homes empty and unfurnished for one, five and ten years. A home empty for less than a year pays the ordinary charge for its band, with no discount. Owners who sell, let or move back in should tell the council the date, since the premium stops from that day. The national framework is on the ${h.src('gov_second_empty', 'GOV.UK page for second and empty homes')}.</p>
`;
  },
});
