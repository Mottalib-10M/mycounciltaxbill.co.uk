import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-birmingham',
  group: 'councils',
  order: 10,
  tool: { kind: 'ct', props: { council: 'birmingham', band: 1 } },
  related: ['region-west-midlands', 'council-tax-single-person-discount', 'council-tax-increase-2026', 'check-council-tax-band'],
  sources: ['mhclg_levels', 'mhclg_release', 'gov_who_pays', 'gov_paying'],
  slug: 'birmingham-council-tax',
  nav: 'Birmingham',
  card: 'Every band of Birmingham for 2026/27, with the single person discount and monthly payments.',
  title: 'Birmingham Council Tax 2026/27: Bands A to H and Your Bill',
  description: 'Birmingham council tax 2026/27 for every band, from Band A to H, with the West Midlands police and fire shares, the 25 % discount and 10 or 12 monthly payments.',
  h1: 'Birmingham council tax 2026/27',
  intro: 'What a home in Birmingham pays this year, band by band, and where each pound goes.',
  resume: (h) => {
    const c = h.c('birmingham'); const ch = h.E.change(c)!; const b = h.E.bill({ council: 'birmingham', band: 1 });
    const pl = h.E.instalmentPlan(b.annual, 10);
    return `Birmingham's Band D council tax for ${h.P.taxYear} is ${h.m2(c.bandD)}, up ${h.pc(ch.rate, 1)} on last year's ${h.m2(c.bandDPrev!)}, for a home with two adults. Most Birmingham homes are in Bands A and B, so the usual bill is lower: ${h.m2(h.E.bandCharge(c, 0))} in Band A and ${h.m2(b.annual)} in Band B, paid as ${h.m2(pl.first)} in April then nine instalments of ${h.m2(pl.regular)} if you keep the default 10 payments. The figure includes ${h.m2(c.parts.police)} for the West Midlands Police and Crime Commissioner and ${h.m2(c.parts.fire)} for West Midlands Fire Service at Band D, both scaled to your band. Someone living alone pays ${h.pc(h.P.discounts.singlePerson)} less, which in Band B means ${h.m2(h.E.bill({ council: 'birmingham', band: 1, household: 'one' }).annual)} a year. These amounts come from the government's table of council tax levels for England, published in March 2026.`;
  },
  faqs: (h) => {
    const c = h.c('birmingham');
    return [
      { q: 'Why did Birmingham council tax rise so much in recent years?', a: `Birmingham City Council issued a section 114 notice in 2023 and the government let it raise council tax above the usual referendum limit in 2024/25 and 2025/26. For ${h.P.taxYear} the total Band D bill rose by ${h.pc(h.E.change(c)!.rate, 1)}, close to the normal ceiling, to ${h.m2(c.bandD)}. The figure includes police and fire, which set their own increases.` },
      { q: 'Do I pay a parish precept in Birmingham?', a: `Only in Sutton Coldfield and New Frankley in Birmingham, the two parishes of the city. Their precept is spread here as an average of ${h.m2(c.parts.parish)} at Band D across the whole city, so a home in Sutton Coldfield pays a little more than shown and a home elsewhere slightly less. Your bill names the parish if you have one.` },
      { q: 'Is Birmingham council tax higher than Solihull or Sandwell?', a: `At Band D, Birmingham charges ${h.m2(c.bandD)}, against ${h.m2(h.c('solihull').bandD)} in Solihull and ${h.m2(h.c('sandwell').bandD)} in Sandwell. The police and fire shares are the same across the West Midlands, so the gap comes entirely from what each city council charges for its own services.` },
    ];
  },
  body: (h) => {
    const c = h.c('birmingham'); const p = c.parts; const W = h.E.inRegion('West Midlands');
    const rank = h.E.rankIn(c, W);
    const near = ['solihull', 'sandwell', 'dudley', 'walsall', 'wolverhampton', 'coventry'];
    const rows = near.map((id) => { const x = h.c(id); return [h.ca(id), h.m2(h.E.bandCharge(x, 1)), h.m2(x.bandD), h.pc(h.E.change(x)!.rate, 1)]; });
    rows.unshift(['<strong>Birmingham</strong>', h.m2(h.E.bandCharge(c, 1)), h.m2(c.bandD), h.pc(h.E.change(c)!.rate, 1)]);
    const own = p.council + p.parish;
    return `
<h2>Every band in Birmingham</h2>
${h.bandTable('birmingham')}
<p>Each band is a fixed fraction of Band D: Band A pays six ninths of it, Band H eighteen ninths, twice Band D. The bands rest on what a home would have sold for in April 1991, not on its value today, which is why a terraced house in Selly Oak bought for a quarter of a million pounds can still sit in Band B.</p>

<h2>Where a Band D bill goes</h2>
<p>Of the ${h.m2(c.bandD)}, the city council keeps ${h.m2(own)} including parish precepts, of which ${h.m2(p.asc)} is the adult social care precept that councils may raise on top of the general limit. The West Midlands Police and Crime Commissioner receives ${h.m2(p.police)} and the West Midlands Fire and Rescue Authority ${h.m2(p.fire)}. The West Midlands Combined Authority, whose mayor covers Birmingham, sets no council tax precept this year.</p>
<p>Within the West Midlands region, Birmingham ranks ${rank.rank} of ${rank.of} by Band D, from the dearest. A comparison with its neighbours, on Band B where most of the city's homes are:</p>
${h.table(['Council', 'Band B', 'Band D', 'Change on 2025/26'], rows, `${h.P.taxYear}, two adults, main home.`, ['l', 'r', 'r', 'r'])}

<h2>Discounts and exemptions that change the Birmingham bill</h2>
<p>The calculator above starts from a home with two adults. If you are the only adult who counts, select it: Birmingham applies the national ${h.pc(h.P.discounts.singlePerson)} ${h.a('council-tax-single-person-discount', 'single person discount')}. Students at the University of Birmingham, Aston or Birmingham City University living only with other full-time students are exempt and pay nothing; the ${h.a('council-tax-students', 'student page')} explains the certificate the council asks for. A home adapted for a disabled resident is charged one band lower.</p>
<p>A furnished second home or a home empty for more than a year can cost twice the normal charge or more, depending on the council's own decision. Check Birmingham's current rate before you rely on the figure: the calculator lets you type it.</p>

<h2>Paying Birmingham council tax</h2>
<p>The city sends bills in March for the year from 1 April. You can pay in 10 monthly instalments from April to January, or ask for 12 to spread the cost to March. Direct Debit dates are set by the council. If you move within the year, the bill is recalculated by the day for each address. Households on a low income can apply to the city for Council Tax Reduction, a local scheme that the calculator does not model; it is worked out after every discount shown here.</p>
`;
  },
});
