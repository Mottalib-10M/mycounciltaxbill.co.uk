import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';
import { displayDate } from '../../lib/format';

const d = (iso: string) => displayDate(iso, 'en-GB');
// Estimate only (signalled in the page): the 2026/27 Band D raised by the usual English limit. Replace with the MHCLG table of March 2027.
const est = (h: Helpers, x: number) => x * (1 + h.P.next.englandPrinciples.total);

export default definePage({
  id: 'council-tax-2027-28',
  group: 'bands',
  order: 55,
  mini: { kind: 'mini:rise-2027', props: { council: 'leeds', band: 2 } },
  related: ['council-tax-increase-2026', 'council-tax-monthly-payments', 'wales-council-tax-revaluation', 'scotland-council-tax'],
  sources: ['csp_2629', 'lgfs_2629', 'principles_draft_2627', 'wales_prov_2627', 'scot_budget_2627', 'hvcts', 'mhclg_levels'],
  slug: 'council-tax-2027-28',
  nav: 'Council tax 2027/28',
  card: 'What is already fixed for April 2027, the limits for England, the dates, and an estimate of your next bill.',
  title: 'Council Tax 2027/28: Rise Limits, Key Dates and Your Bill',
  description: 'Council tax 2027/28: the 2.99 % and 2 % limits already set for England, six councils left free, the dates to April 2027 and an estimate of your next bill.',
  h1: 'Council tax 2027/28: what is already decided',
  intro: 'Council tax 2027/28 starts on 1 April 2027. The amounts are not set yet, but the rules for England are, and so is the calendar.',
  resume: (h) => {
    const N = h.P.next, R = N.englandPrinciples, A = h.P.averages.england;
    return `Council tax for ${N.taxYear} covers ${N.taxYearLong}. No council has set its charge yet: councils in England, Wales and Scotland decide their Band D figures in February and March 2027, and the official tables follow at the end of March. What is already known is the frame. England's multi-year finance settlement, made final on ${d(N.englandFinal)}, sets the referendum principles for 2026-27 to 2028-29: a rise of 3 % or more in a council's core charge, plus up to ${h.pc(R.asc)} for adult social care, needs a local vote, so ${h.pc(R.total, 2)} is the usual ceiling again. Shire districts may add the greater of 3 % or £${R.districtCash}, fire authorities £${R.fireCash}. Six councils in London and Berkshire will have no limit at all. If every part of the average English bill rose by ${h.pc(R.total, 2)}, Band D would go from ${h.m2(A.bandD)} to about ${h.m2(est(h, A.bandD))}; that is an estimate, not a forecast. Wales and Scotland set no referendum limit.`;
  },
  faqs: (h) => [
    { q: 'When will I know my council tax for 2027/28?', a: `Your council sets its ${h.P.next.taxYear} charge at a budget meeting in February or early March 2027, and the bill reaches you in March, before the year starts on 1 April. Some councils publish the agreed Band D on their website a few days after the meeting, so you can check it before the bill arrives.` },
    { q: 'Is the 4.99 % limit confirmed for April 2027?', a: `The government wrote the limits for all three years of its settlement into the final settlement of February 2026. Parliament still approves a principles report each winter, after the provisional settlement in December. A change is possible, but the published plan is the same ${h.pc(h.P.next.englandPrinciples.total, 2)} as in ${h.P.taxYear}.` },
    { q: 'Which councils have no council tax limit in 2027/28?', a: 'Westminster, Wandsworth, Kensington and Chelsea, Hammersmith and Fulham, the City of London and Windsor and Maidenhead. The government said in February 2026 that it does not intend to set referendum principles for these six in 2027-28 and 2028-29. Each council still sets its own rise at its budget meeting, and residents can only judge it at the next local election.' },
    { q: 'Does the mansion tax start in April 2027?', a: `No. The High Value Council Tax Surcharge on homes in England worth ${h.m(h.P.next.hvcts.threshold)} or more starts in ${h.P.next.hvcts.start}, with first bills in ${h.P.next.hvcts.firstBills}. It is paid by the owner on top of the normal council tax. Nothing changes for ${h.P.next.taxYear} itself.` },
  ],
  body: (h) => {
    const N = h.P.next, R = N.englandPrinciples, now = h.P.referendum.england, A = h.P.averages.england;
    const limits = [
      ['Core charge, upper tier councils', h.pc(now.core, 2), h.pc(R.core, 2)],
      ['Adult social care precept', h.pc(now.asc), h.pc(R.asc)],
      ['Shire districts', `${h.pc(now.core, 2)} or £${now.districtCash}`, `${h.pc(R.core, 2)} or £${R.districtCash}`],
      ['Fire and rescue authorities', `£${now.fireCash}`, `£${R.fireCash}`],
      ['Police, Greater London Authority', `£${now.policeCash}`, `£${R.glaPoliceCash}`],
      ['Police and crime commissioners outside London', `£${now.policeCash}`, 'December 2026'],
      ['Town and parish councils', 'No limit', 'No limit'],
      ['Councils allowed more', `${h.P.referendum.exceptions2627.length} councils`, 'Early 2027'],
    ];
    const six = N.noPrinciples2728.map((id) => h.c(id)).sort((a, b) => a.bandD - b.bandD);
    const sixRows = six.map((c) => [h.ca(c.id, c.name), h.m2(c.bandDPrev!), h.m2(c.bandD), h.pc(h.E.change(c)!.rate, 1)]);
    const bandRows = h.P.bands.england.letters.map((l, i) => { const x = A.bandD * h.P.bands.england.num[i] / 9; return [`Band ${l}`, h.m2(x), h.m2(est(h, x)), h.m(est(h, x) - x)]; });
    const leeds = h.E.bill({ council: 'leeds', band: 2 }).annual;
    const wm = h.c('windsor-and-maidenhead');
    const wmLimit = h.P.referendum.exceptions2627.find((e) => e.name === 'Windsor and Maidenhead')!.limit;
    return `
<h2>The council tax 2027/28 limits for England</h2>
<p>England's ${h.src('lgfs_2629', 'final local government finance settlement')} covers three years, ${h.P.taxYear} to 2028/29, instead of the usual single year, so councils already know the frame for the next two Aprils. With it the government published the referendum principles it intends to use for each of those years (${h.src('csp_2629', 'Core Spending Power explanatory note, paragraph 8')}). The table puts them side by side with this year's:</p>
${h.table(['Authority', h.P.taxYear, N.taxYear], limits, 'Highest rise without a local referendum. 2027/28 limits from the February 2026 settlement; a date means not yet set.', ['l', 'r', 'r'])}
<p>Two lines are still open. The cash limit for police and crime commissioners outside London is set each year with the provisional settlement; for ${h.P.taxYear} it was £${now.policeCash}. And the list of councils in financial difficulty that may go higher is decided case by case: ${h.P.referendum.exceptions2627.length} were allowed more for ${h.P.taxYear}, up to ${h.pc(h.P.referendum.exceptions2627[0].limit)}, and no list for ${N.taxYear} has been published.</p>

<h2>Six councils left without a limit</h2>
<p>The same note says the government does not intend to set any referendum principle in ${N.taxYear} and 2028/29 for six councils, five of them London boroughs or the City with bills far below the average (${h.src('csp_2629', 'paragraph 9')}). They can raise their charge by more than ${h.pc(R.total, 2)} without asking voters, and the government has written its own assumption of their council tax income into its funding tables:</p>
${h.table(['Council', 'Band D 2025/26', `Band D ${h.P.taxYear}`, 'Change'], sixRows, `Total Band D including the Greater London Authority or police, fire and parish precepts. The English average is ${h.m2(A.bandD)}.`, ['l', 'r', 'r', 'r'])}
<p>${h.ca('wandsworth', 'Wandsworth')} and ${h.ca('westminster', 'Westminster')} have the two lowest Band D charges in the country. Windsor and Maidenhead is the odd one out: its bill of ${h.m2(wm.bandD)} is close to the English average, and it was already allowed up to ${h.pc(wmLimit, 1)} on its own share for ${h.P.taxYear} after asking for help with its finances. For households in these six areas, the ${N.taxYear} rise is the least predictable in England.</p>

<h2>What a ${h.pc(R.total, 2)} rise would mean for each band</h2>
<p>Last April the average English Band D rose by ${h.pc(A.change, 2)}, just under the limit, so a rise close to ${h.pc(R.total, 2)} is the likely case for many homes. The table below is an estimate, not a published figure: it applies ${h.pc(R.total, 2)} to the whole average English bill for ${h.P.taxYear} (${h.src('mhclg_levels', 'MHCLG table of March 2026')}). Police, fire and parish shares follow other limits, so the real average will differ. It will be replaced by the official table at the end of March 2027.</p>
${h.table(['Band', `${h.P.taxYear} average`, `${N.taxYear} estimate`, 'Extra a year'], bandRows, `Estimate: English average Band D of ${h.P.taxYear} raised by ${h.pc(R.total, 2)}, scaled by the legal band fractions. Not an official figure.`, ['l', 'r', 'r', 'r'])}
<p>The calculator at the top does the same for one council and one band, and lets you test another rise. For a Band C home in ${h.ca('leeds', 'Leeds')}, ${h.pc(R.total, 2)} on a bill of ${h.m2(leeds)} would add about ${h.m(leeds * R.total)} a year, or ${h.m2(leeds * R.total / 10)} on each of ten instalments. The ${h.a('council-tax-increase-2026', `page on the ${h.P.taxYear} rise`)} shows how far real rises spread around the limit last April.</p>

<p>Three things will pull the real figure away from this estimate. A council may choose less than the limit, as several did last year. A council in financial difficulty may be allowed more. And in two-tier areas the bill adds a county, a district, police, fire and parish shares, each with its own rule, so the total moves by a blend of them rather than by one percentage.</p>

<h2>The calendar to April 2027</h2>
<ol>
<li><strong>December 2026.</strong> The provisional settlement for England, with the draft principles report for ${N.taxYear}. The one for ${h.P.taxYear} came on ${d(N.englandProvisionalPrev)} (${h.src('principles_draft_2627', 'draft principles report')}).</li>
<li><strong>Late 2026.</strong> The Welsh provisional settlement, which last year came on ${d(N.walesProvisionalPrev)} (${h.src('wales_prov_2627', 'Welsh Government statement')}).</li>
<li><strong>Winter 2026 to 2027.</strong> The Scottish Budget, which sets council funding; the last one was presented on ${d(N.scotBudgetPrev)} (${h.src('scot_budget_2627', 'Finance Secretary\'s statement')}).</li>
<li><strong>February 2027.</strong> The final settlement in England and the vote in the House of Commons on the principles report.</li>
<li><strong>February and March 2027.</strong> Budget meetings: each council, police body and fire authority sets its precept, and the billing council adds them up into a Band D charge.</li>
<li><strong>March 2027.</strong> Bills sent, then the official tables: ${h.P.nextRelease.england}.</li>
<li><strong>1 April 2027.</strong> The ${N.taxYear} year starts. Ask for twelve instalments instead of ten by ${h.P.instalments.requestBy} to spread the new amount further (${h.a('council-tax-monthly-payments', 'how instalments work')}).</li>
</ol>

<h2>Wales in 2027/28</h2>
<p>Wales has no referendum limit. Each of the 22 councils sets its own rise, and Welsh ministers have the power to cap one they judge excessive. When it announced last year's provisional settlement, the Welsh Government wrote that it is not appropriate for it to set an arbitrary level of council tax increase, and it kept its funding for the Council Tax Reduction Scheme. No settlement for ${N.taxYear} had been published on ${d(N.retrieved_at)}. ${N.taxYear} is also the last year on the 2003 values: the revaluation and new bands take effect in April 2028, as the ${h.a('wales-council-tax-revaluation', 'Welsh revaluation page')} explains, so councils will set ${N.taxYear} charges on the nine current bands.</p>

<h2>Scotland in 2027/28</h2>
<p>Scottish councils also set their own rise, with no referendum. The Scottish Government's last budget left rates to councils and asked them to make reasonable decisions, while announcing two new bands for homes worth over ${h.m(N.scotNewBands.over)} on an up to date valuation, to be in place ${N.scotNewBands.from} (${h.src('scot_budget_2627', 'Scottish Budget statement, January 2026')}). For ${N.taxYear} the existing eight bands remain. Scottish Water's charges for ${N.taxYear} are set separately and are not known yet; for ${h.P.scottishWater.year} they rose by ${h.pc(h.P.scottishWater.increase, 2)}. The ${h.a('scotland-council-tax', 'Scottish guide')} explains how the two parts of the bill add up.</p>

<h2>Coming after 2027/28</h2>
<p>A new charge for the most expensive homes in England is due the year after. From ${N.hvcts.start}, owners of homes worth ${h.m(N.hvcts.threshold)} or more on ${N.hvcts.valuationYear} values pay a High Value Council Tax Surcharge on top of their council tax, in four bands (${h.src('hvcts', 'HM Treasury factsheet')}):</p>
${h.table(['Value of the home', 'Surcharge a year'], N.hvcts.bands.map(([b, v]) => [b, h.m(v as number)]), `From ${N.hvcts.start}, paid by the owner, rising with CPI from ${N.hvcts.indexFrom}.`, ['l', 'r'])}
<p>It does not touch the ordinary bands, which stay on 1991 values in England. Fewer than one home in a hundred is expected to pay it. Nothing in the surcharge changes a ${N.taxYear} bill.</p>

<h2>What to do before April 2027</h2>
<p>A rise cannot be refused, but the base it applies to can be wrong. Before the new bill arrives, check that your band matches similar homes in your street with the ${h.a('check-council-tax-band', 'band search')}, and that every discount you are owed is on this year's bill, such as the ${h.a('council-tax-single-person-discount', 'single person discount')}: a percentage rise on a bill that is too high makes the error grow each year. If the ${N.taxYear} amount will be hard to pay, ask the council about Council Tax Reduction early: councils fix their reduction schemes for the new year before it starts. This page will be updated with each council's real ${N.taxYear} figures once the official tables are published.</p>
`;
  },
});
