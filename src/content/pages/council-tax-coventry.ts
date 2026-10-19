import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-coventry',
  group: 'councils',
  order: 120,
  tool: { kind: 'ct', props: { council: 'coventry', band: 1 } },
  related: ['region-west-midlands', 'council-tax-birmingham', 'council-tax-students', 'empty-property-council-tax'],
  sources: ['mhclg_levels', 'gov_students', 'gov_second_empty', 'gov_paying'],
  slug: 'coventry-council-tax',
  nav: 'Coventry',
  card: 'Coventry bands for 2026/27, the three parish areas, student exemptions and how the city compares with Warwickshire.',
  title: 'Coventry Council Tax 2026/27: Every Band and Parish Area',
  description: 'Coventry council tax 2026/27 from Band A to H, the extra charge in Allesley, Finham and Keresley, student exemptions and a comparison with Warwickshire towns.',
  h1: 'Coventry council tax 2026/27',
  intro: 'A metropolitan city with three small parishes, a large student population and Warwickshire on its doorstep.',
  resume: (h) => {
    const c = h.c('coventry'); const ch = h.E.change(c)!; const p = c.parts;
    const b = h.E.bill({ council: 'coventry', band: 1 }); const one = h.E.bill({ council: 'coventry', band: 1, household: 'one' });
    const r = h.E.rankIn(c, h.E.inRegion('West Midlands'));
    return `A Band D home in Coventry pays ${h.m2(c.bandD)} of council tax in ${h.P.taxYear}, against ${h.m2(c.bandDPrev!)} a year earlier, a rise of ${h.m(ch.amount)} or ${h.pc(ch.rate, 1)}. That total is made of three charges: ${h.m2(p.council)} for Coventry City Council itself, ${h.m2(p.police)} for the West Midlands Police and Crime Commissioner and ${h.m2(p.fire)} for West Midlands Fire Service, plus a small parish average. Band B, the setting of the calculator, costs ${h.m2(b.annual)} for two or more adults and ${h.m2(one.annual)} for a person living alone after the ${h.pc(h.P.discounts.singlePerson)} discount. Coventry is ${r.rank} of the ${r.of} West Midlands billing authorities when they are ranked from the dearest Band D, and it sits ${h.m(c.bandD - h.P.averages.england.bandD)} above the average for England. Each band is a fixed fraction of Band D, from six ninths for Band A to eighteen ninths for Band H.`;
  },
  faqs: (h) => {
    const c = h.c('coventry'); const w = h.c('warwick');
    return [
      { q: 'Which parishes in Coventry add to the council tax bill?', a: `Allesley, Finham and Keresley are the city's three parish areas. Coventry City Council's own table adds £40.25 at Band D in Allesley, £13.54 in Finham and £22.08 in Keresley for ${h.P.taxYear}, scaled up or down for the other bands. Everywhere else in the city there is no parish charge, so homes pay a little less than the averaged figure of ${h.m2(c.parts.parish)} shown above.` },
      { q: 'Is council tax cheaper in Coventry or in Warwick district?', a: `At Band D, Coventry charges ${h.m2(c.bandD)} and Warwick district ${h.m2(w.bandD)} for ${h.P.taxYear}. A Warwick bill is split between the district, Warwickshire County Council, the police and often a town or parish council, while a Coventry bill has one main council. The difference for a Band C home is ${h.m(Math.abs(h.E.bandCharge(c, 2) - h.E.bandCharge(w, 2)))} a year.` },
      { q: 'Do students living in Coventry halls need to apply for an exemption?', a: 'No. Coventry City Council says students in halls of residence do not need to do anything, because halls are exempt as a whole. Students renting a house or flat in the city must send proof of their status through the council\'s online form, and the exemption only covers a household where every adult is a full-time student.' },
    ];
  },
  body: (h) => {
    const c = h.c('coventry');
    const near = ['warwick', 'rugby', 'nuneaton-and-bedworth', 'north-warwickshire', 'solihull', 'birmingham'];
    const row = (id: string, label?: string) => { const x = h.c(id); return [label ?? h.ca(id), h.m2(h.E.bandCharge(x, 1)), h.m2(x.bandD), x.parts.county ? h.m2(x.parts.county) : 'none', h.pc(h.E.change(x)!.rate, 1)]; };
    const rows = [row('coventry', '<strong>Coventry</strong>'), ...near.map((id) => row(id))];
    const avg = h.E.average(h.E.inRegion('West Midlands'));
    const b0 = h.E.bill({ council: 'coventry', band: 0 });
    const pl = h.E.instalmentPlan(b0.annual, 10);
    return `
<h2>Coventry bands for one adult or a full household</h2>
${h.bandTable('coventry')}
<p>The table runs from the cheapest band to the dearest for a main home. The column for a person living alone already includes the single person discount, and the last column divides the two adult charge by ten, the number of instalments Coventry uses unless you ask for twelve. In Band A the first instalment is ${h.m2(pl.first)} and the other nine are ${h.m2(pl.regular)} each.</p>

<h2>Allesley, Finham and Keresley</h2>
<p>Coventry is mostly unparished, but ${c.parishes} areas on its outskirts have their own parish councils, which set a precept on top of the city charge. For ${h.P.taxYear} the council publishes an extra £40.25 at Band D in Allesley, £13.54 in Finham and £22.08 in Keresley. The government table spreads those sums across the whole city, which gives the average of ${h.m2(c.parts.parish)} built into the figures here. If your bill names one of the three parishes, your real charge is slightly above the table; if not, slightly below.</p>

<h2>Coventry next to Warwickshire and Solihull</h2>
<p>Warwickshire districts and Solihull border the city, and the structure of their bills is different. A Coventry bill pays one authority for almost every local service. In Warwick, Rugby or Nuneaton and Bedworth, the district collects for itself, for Warwickshire County Council and for the Warwickshire police precept, and most villages add a parish precept. The column for the county share below shows how much of each Band D bill goes to the county.</p>
${h.table(['Council', 'Band B', 'Band D', 'County share at D', 'Change on 2025/26'], rows, `${h.P.taxYear}, two adults, main home, from the ${h.src('mhclg_levels', 'MHCLG tables')}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The average Band D across the West Midlands is ${h.m2(avg)}, so Coventry pays ${h.m(c.bandD - avg)} more than the regional average. The ${h.a('region-west-midlands', 'West Midlands page')} lists every council in the region from the dearest.</p>

<h2>Students renting in Coventry</h2>
<p>Coventry University and other institutions bring a large number of students who rent shared houses across the city. A house where every adult is a full-time student is exempt; the city's test is study of at least 21 hours a week for 24 weeks of the year, in line with the ${h.src('gov_students', 'national rules for students')}. If one adult in the house is not a student, that person receives the bill, reduced by the discount for a household where they are the only adult counted. The ${h.a('council-tax-students', 'student guide')} covers the certificates, the summer gap and halls.</p>

<h2>Empty homes and second homes in Coventry</h2>
<p>Coventry's published table of charges includes columns for the full charge with a premium of 100 %, 200 % and 300 %, the three tiers that English law allows for long-term empty homes. The table does not say which tier applies to which home, so check the council's decision before relying on a figure, then type the rate into the calculator. The ${h.src('gov_second_empty', 'GOV.UK page on second homes and empty properties')} sets out the national rules, and the ${h.a('empty-property-council-tax', 'empty property guide')} explains the exceptions.</p>
<p>Bills arrive in March. ${h.src('gov_paying', 'Payment options')} include Direct Debit on a choice of dates, and a request for twelve instalments spreads the cost to the end of March.</p>
`;
  },
});
