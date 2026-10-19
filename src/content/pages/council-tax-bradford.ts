import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-bradford',
  group: 'councils',
  order: 80,
  tool: { kind: 'ct', props: { council: 'bradford', band: 0 } },
  related: ['region-yorkshire', 'council-tax-increase-2026', 'empty-property-council-tax', 'council-tax-disabled-band-reduction'],
  sources: ['mhclg_levels', 'mhclg_release', 'gov_ctr', 'mhclg_premiums'],
  slug: 'bradford-council-tax',
  nav: 'Bradford',
  card: 'Bradford bands for 2026/27, the council\'s finances behind the bill, the parish precepts and the premiums on empty homes.',
  title: 'Bradford Council Tax 2026/27: Band A to H and Finances',
  description: 'Bradford council tax 2026/27 for each band, the 4.99 % rise in the council\'s share, its exceptional financial support, parish precepts and empty home premiums.',
  h1: 'Bradford council tax 2026/27',
  intro: 'A district council still relying on government permission to borrow for day-to-day costs, a rise at the usual limit this year, and charges that vary with the parish.',
  resume: (h) => {
    const c = h.c('bradford'); const ch = h.E.change(c)!; const a = h.E.bill({ council: 'bradford', band: 0 });
    return `Bradford's average Band D council tax for ${h.P.taxYear} is ${h.m2(c.bandD)}, compared with ${h.m2(c.bandDPrev!)} in 2025/26, so the whole bill rose by ${h.pc(ch.rate, 1)}. The district council's own part went up by ${h.pc(h.P.referendum.england.total)}, the standard ceiling, made of a ${h.pc(h.P.referendum.england.core)} general rise and ${h.pc(h.P.referendum.england.asc)} for adult social care; the police and fire precepts for West Yorkshire and the parish charges moved separately. The usual Bradford bill is lower than Band D: Band A, the lowest band, costs ${h.m2(a.annual)} a year for two adults and ${h.m2(h.E.bill({ council: 'bradford', band: 0, household: 'one' }).annual)} for one. The council balanced its ${h.P.taxYear} budget with exceptional financial support from the government, agreed in principle, which lets it use borrowing or capital receipts to cover running costs for a limited time. That support is not extra money and does not change what any household pays this year.`;
  },
  faqs: (h) => {
    const c = h.c('bradford');
    return [
      { q: 'What is exceptional financial support and why does Bradford need it?', a: 'It is permission from the government for a council under financial pressure to treat some day-to-day spending as capital, paid for by borrowing or by selling assets. GOV.UK lists Bradford among the councils whose support for 2026-27 has been agreed in principle. The council\'s own budget papers say it expects to need it less over time and to leave formal intervention.' },
      { q: 'Which Bradford parishes add to the bill?', a: `Bradford's ${h.P.taxYear} booklet lists the town and parish precepts band by band, among them Addingham, Baildon, Bingley, Burley, Clayton, Cullingworth and Denholme, and Crossroads, a new parish this year. Each sets its own charge. Averaged over the district they add ${h.m2(c.parts.parish)} at Band D; urban wards without a parish pay none.` },
      { q: 'Does Bradford charge a premium on homes empty for ten years?', a: `Yes. The council's booklet for ${h.P.taxYear} confirms premiums of ${h.pc(h.P.premiums.england.emptyTiers[0].max)} after one year empty and unfurnished, ${h.pc(h.P.premiums.england.emptyTiers[1].max)} after five years and ${h.pc(h.P.premiums.england.emptyTiers[2].max)} after ten, the national maximum. A furnished home with no resident has also attracted a premium since April 2025; ask the council for its current rate.` },
    ];
  },
  body: (h) => {
    const c = h.c('bradford'); const p = c.parts;
    const ids = ['bradford', 'leeds', 'calderdale', 'kirklees', 'wakefield'];
    const rows = ids.map((id) => { const x = h.c(id); return [id === 'bradford' ? '<strong>Bradford</strong>' : h.ca(id), h.m2(h.E.bandCharge(x, 0)), h.m2(x.bandD), h.m2(x.parts.parish), `${x.parishes}`]; });
    const ten = h.E.bill({ council: 'bradford', band: 0, occupancy: 'empty', emptyYears: 10 });
    return `
<h2>Bradford charges for every band</h2>
${h.bandTable('bradford')}
<p>The amounts include the district's average parish precept. Your bill replaces it with the precept of your own parish, or with nothing if you live in a ward that has no parish council.</p>

<h2>The budget behind the bill</h2>
<p>Bradford has been under severe financial pressure in recent years, and for ${h.P.taxYear} the council again relies on exceptional financial support, a government arrangement that lets a council fund running costs from borrowing or asset sales. Its ${h.P.taxYear} explanatory booklet shows that support as one of the four sources of the budget, next to government grant, business rates and council tax. The council's own share of Band D is ${h.m2(p.council)}, including ${h.m2(p.asc!)} for adult social care, and it rose this year by no more than the limit that applies to every council without a referendum. The ${h.a('council-tax-increase-2026', 'page on this year\'s increases')} explains how that limit works.</p>

<h2>West Yorkshire's shared precepts</h2>
<p>The police precept, ${h.m2(p.police)} at Band D, is set by the Mayor of West Yorkshire, who holds the police and crime commissioner's powers. West Yorkshire Fire and Rescue Authority takes ${h.m2(p.fire)}. Both are identical in the five West Yorkshire districts, so the table below isolates what each district and its parishes charge:</p>
${h.table(['District', 'Band A', 'Band D', 'Parish average', 'Parishes'], rows, `${h.P.taxYear}, two adults, main home.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Bradford sits in the middle of the group, cheaper than Calderdale and Kirklees but dearer than Leeds and Wakefield. Because the police and fire lines are fixed across the county, a household moving from Bradford to Leeds in the same band saves only what the two district councils and their parishes charge differently. A wider ranking of the region is on the ${h.a('region-yorkshire', 'Yorkshire and the Humber page')}.</p>

<h2>Empty homes in the district</h2>
<p>The council uses the premiums to bring empty homes back into use. A Band A house left empty and unfurnished for ten years or more costs ${h.m2(ten.annual)} a year, four times the normal charge. There are exceptions, for example for an annexe used with the main home or a home vacated by someone in armed forces accommodation; the ${h.src('mhclg_premiums', 'government guidance')} and the ${h.a('empty-property-council-tax', 'empty property page')} explain them.</p>

<h2>Help with the bill</h2>
<p>Bradford's Council Tax Reduction scheme for working-age residents on low incomes is set locally and applied after every discount in the calculator. The ${h.src('gov_ctr', 'GOV.UK page on Council Tax Reduction')} explains how to apply. A home with features needed by a disabled resident can be charged one band lower, which the ${h.a('council-tax-disabled-band-reduction', 'disabled band reduction guide')} covers in detail.</p>
`;
  },
});
