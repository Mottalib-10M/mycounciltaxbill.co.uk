import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-monthly-payments',
  group: 'paying',
  order: 10,
  mini: { kind: 'mini:instalments' },
  related: ['council-tax-moving-house', 'home', 'council-tax-single-person-discount', 'council-tax-increase-2026'],
  sources: ['leg_instalments', 'gov_paying', 'gov_ctr', 'mhclg_levels', 'wales_levels', 'leg_scot_warrant'],
  slug: 'council-tax-monthly-payments',
  nav: 'Monthly payments',
  card: '10 or 12 instalments to the penny, the rounding rule, and what happens after a missed payment.',
  title: 'Council Tax Monthly Payments 2026/27: 10 or 12 Instalments',
  description: 'Council tax monthly payments for 2026/27: 10 or 12 instalments split to the penny, why the first one differs, how to switch, and what a missed payment costs.',
  h1: 'Council tax monthly payments: 10 or 12 instalments',
  intro: 'The yearly bill is split by a fixed formula in the 1992 regulations. Here is how it works, with real bills.',
  resume: (h) => {
    const P = h.P; const y = h.E.bill({ council: 'york', band: 3 });
    const ten = h.E.instalmentPlan(y.annual, P.instalments.default), twelve = h.E.instalmentPlan(y.annual, P.instalments.onRequest);
    return `Council tax is normally collected in ${P.instalments.default} monthly instalments, from April to January, and in England and Wales you have a legal right to ask for ${P.instalments.onRequest} instead, running from April to March. The split follows Schedule 1 of the Council Tax (Administration and Enforcement) Regulations 1992: every instalment after the first is the yearly total divided by the number of payments and rounded to the nearest pound, and the first one absorbs the pennies left over. A Band D home in York with two adults owes ${h.m2(y.annual)} for ${P.taxYear}. Over ${P.instalments.default} months that is ${h.m2(ten.first)} first, then ${h.m2(ten.regular)} nine times; over ${P.instalments.onRequest} months it becomes ${h.m2(twelve.first)}, then ${h.m2(twelve.regular)} eleven times. Asking by ${P.instalments.requestBy} gets you the full ${P.instalments.onRequest}; a later request spreads what is left over the remaining months. If you miss a payment the council sends a reminder giving you 7 days, and failing that you can lose the right to pay by instalments.`;
  },
  faqs: (h) => {
    const P = h.P; const nr = h.E.bill({ council: 'norwich', band: 1 });
    const a = h.E.instalmentPlan(nr.annual, P.instalments.default), b = h.E.instalmentPlan(nr.annual, P.instalments.onRequest);
    return [
      { q: 'Can I change my council tax from 10 to 12 monthly payments halfway through the year?', a: `Yes, in England and Wales you can ask at any point, but the council can only spread the balance over the whole months that remain after it issues a new notice. A request made in summer therefore gives you fewer, larger payments than a request made before ${P.instalments.requestBy}. Most councils accept the request online or by phone.` },
      { q: 'Why is my first council tax instalment a different amount from the rest?', a: `Because the regulations round every later instalment to the nearest pound and push the difference into the first. A Band B home in Norwich owing ${h.m2(nr.annual)} pays ${h.m2(a.first)} in the first month and ${h.m2(a.regular)} after that on ${P.instalments.default} instalments. The first can be slightly higher or slightly lower than the others.` },
      { q: 'Do I pay council tax in February and March?', a: `Not on the standard plan: the ${P.instalments.default} instalments end in January, leaving February and March free. On ${P.instalments.onRequest} instalments you pay in every month of the year, each payment being smaller. For the same Norwich Band B home, the regular payment falls from ${h.m2(a.regular)} to ${h.m2(b.regular)}.` },
      { q: 'What happens if I miss one council tax payment?', a: 'The council sends a reminder notice and you have 7 days to bring the account up to date. If you pay within that time the instalments carry on. If you do not, you lose the right to pay by instalments and the rest of the year falls due at once. You get no more than two reminders in a financial year.' },
      { q: 'Does paying over 12 months cost more than paying over 10?', a: 'No. The yearly total is the same whatever the number of instalments: councils do not add interest or a fee for the longer plan. Only the size and the timing of each payment change. Paying the whole year in one sum in April is also allowed and costs the same.' },
    ];
  },
  body: (h) => {
    const P = h.P; const D = P.instalments.default, T = P.instalments.onRequest;
    const picks: Array<[string, number]> = [['plymouth', 0], ['sunderland', 1], ['derby', 2], ['milton-keynes', 4], ['newport', 5], ['exeter', 6]];
    const rows = picks.map(([id, b]) => {
      const x = h.E.bill({ council: id, band: b }); const p10 = h.E.instalmentPlan(x.annual, D), p12 = h.E.instalmentPlan(x.annual, T);
      return [h.ca(id), `Band ${x.band}`, h.m2(x.annual), h.m2(p10.first), h.m2(p10.regular), h.m2(p12.first), h.m2(p12.regular)];
    });
    const st = h.E.bill({ council: 'stockport', band: 2 }); const st10 = h.E.instalmentPlan(st.annual, D);
    const rd = h.E.bill({ council: 'reading', band: 3, household: 'one' }); const late = 9; const rdLate = h.E.instalmentPlan(rd.annual, late);
    const rd12 = h.E.instalmentPlan(rd.annual, T);
    return `
<h2>Ten or twelve payments for six real bills</h2>
<p>The table applies the rule of the regulations to bills for ${P.taxYear}, each for two adults in a main home. The yearly total does not move; only the monthly amount and the number of months change. Pick your own figure in the calculator above to get the same split for your bill.</p>
${h.table(['Council', 'Band', 'Year', `${D}: first`, `${D}: others`, `${T}: first`, `${T}: others`], rows, `${P.taxYear}, two adults, main home. Computed from the official Band D figures.`, ['l', 'l', 'r', 'r', 'r', 'r', 'r'])}
<p>On the longer plan each regular payment is about a sixth smaller. For a household on a tight monthly budget the gain is the cash flow, not the price: the money still reaches the council by the end of March, two months later than on the standard plan.</p>

<h2>The rounding rule, step by step</h2>
<p>Paragraph 2 of ${h.src('leg_instalments', 'Schedule 1 to the 1992 regulations')} sets the arithmetic. If the total divides into whole pounds, every instalment is equal. If it does not, the council takes the total divided by the number of instalments, rounds it to the nearest pound, and uses that figure for every payment but the first. The first payment is the total minus all the others. Take a Band C home in Stockport billed ${h.m2(st.annual)}: divided by ${D} it gives a figure with pence, which is rounded to ${h.m2(st10.regular)}; nine of those leave ${h.m2(st10.first)} for April.</p>
<p>Because the regular payment can be rounded up or down, the first instalment is sometimes the highest of the year and sometimes the lowest. It never differs from the others by more than a few pounds once multiplied out. The same paragraph lets a council merge very small instalments: where one would be under £5, it can add the second to the first and collect one fewer payment.</p>

<h2>Your right to ${T} instalments in England and Wales</h2>
<p>Since April 2013 the regulations give anyone liable in England or Wales the right to request ${T} monthly instalments instead of ${D}. The council must then issue a fresh demand notice. If that notice goes out before the year starts or by ${P.instalments.requestBy}, you get the full ${T}. If it goes out later, the number of instalments equals the whole months left in the year after the notice, so a demand issued in late June gives nine payments from July to March.</p>
<p>That can make a late switch less helpful than it looks. A person living alone in a Band D flat in Reading owes ${h.m2(rd.annual)} this year. Spread over ${T} months from April, the regular payment would be ${h.m2(rd12.regular)}; spread over ${late} months from July, it is ${h.m2(rdLate.regular)}. Councils also have to send the notice at least 14 days before the first instalment it demands, which is why a request made at the end of a month often only takes effect the month after next.</p>
<p>The ${h.src('gov_paying', 'GOV.UK page on paying your bill')} describes the ${T} month spread as one of the ways a council can help if you struggle to pay. In law it is not a favour: in England and Wales you only have to ask. Scotland has its own administration regulations, so check the instalment options on your council's own pages, and the bill there also carries Scottish Water's charges, which are collected in the same instalments.</p>

<h2>When the bill arrives late in the year</h2>
<p>The default of ${D} instalments only applies to a demand notice issued before the year starts or during April. A notice issued on or after 1 May gets one instalment fewer than the whole months left, so a first bill sent in August after a move is collected in six payments, from September to February. A notice issued between 1 January and 31 March is payable in a single instalment. This is why people who ${h.a('council-tax-moving-house', 'move house')} in the autumn often see payments well above the figure they paid at their old address.</p>
<p>The same thing happens when a bill is revised upwards during the year, for example because a discount ends or a band rises after a review. The council recalculates the balance and spreads it over the instalments that remain. A revision downwards works the other way: the remaining payments shrink, or a credit is refunded if the account is in surplus.</p>

<h2>Dates, Direct Debit and other ways to pay</h2>
<p>The regulations require the instalments to fall in consecutive months and on the same day of each month; the council chooses the day and prints the schedule on the demand notice. Direct Debit is the usual method, and many councils let you pick from a short list of collection dates. You can also pay online by card, by bank transfer, by phone or at a Post Office or PayPoint counter with the barcode on the bill, depending on the council. Paying the whole year in one sum is always allowed, and the total is the same as on any plan.</p>
${h.box('Before you change plan', `<p>Check the date of the first instalment on the new notice. Moving from ${D} to ${T} lowers each payment, but the first payment of the new schedule can come sooner than you expect if the council reissues the notice mid-month.</p>`, 'tip')}

<h2>Weekly, fortnightly or other council schemes</h2>
<p>Monthly instalments are only the default. Part II of the same schedule lets a council make its own instalment scheme, as long as it has between 10 and 52 payments, the first falls due at least 14 days after the demand notice and the last falls before the end of March. That is the legal basis for the weekly or fortnightly plans some councils offer to people paid weekly. Spread over 52 weeks, the York Band D bill quoted above would come to roughly ${h.m2(h.E.bill({ council: 'york', band: 3 }).annual / 52)} a week. Whether such a plan is available depends entirely on the council: it is a scheme the council chooses to run, not a right like the ${T} month request.</p>

<h2>Very small bills</h2>
<p>A large Council Tax Reduction or a combination of discounts can leave only a small sum to pay. The regulations deal with that case too. If each instalment would be under £5, a total below £10 can be demanded in one payment, and a larger total can be split into monthly instalments of at least £5 each, so the number of payments shrinks instead of the council collecting a few pence a month. The same logic explains why a bill revised in the last weeks of the year arrives as a single amount.</p>

<h2>Why the standard plan stops in January</h2>
<p>Councils set their budgets and send the next year's demand notices in March, so the ${D} instalment default leaves a gap in February and March before the new year's April payment. For the council it means the whole year's tax is in by the end of January; for households it means two months without a council tax payment, which some use to absorb other annual costs. The ${T} month plan removes the gap and lowers every payment, at the price of paying the last two instalments of one year just before the first instalment of the next. Neither plan is cheaper: the choice is only about how the same total is spread.</p>

<h2>What happens after a missed payment</h2>
<p>The enforcement steps in England and Wales come from the same 1992 regulations, and they move quickly:</p>
<ol>
<li><strong>Reminder notice.</strong> If an instalment is not paid on its date, the council sends a reminder. You have 7 days to pay what is overdue.</li>
<li><strong>Loss of instalments.</strong> If you do not pay within those 7 days, the right to pay by instalments ends and the whole balance for the year becomes due.</li>
<li><strong>Second reminder and final notice.</strong> A second missed payment in the same year brings a second reminder; a third brings a final notice for the whole balance. You receive at most two reminders in a financial year.</li>
<li><strong>Liability order.</strong> If the balance is still unpaid, the council can apply to the magistrates' court for a liability order. The council's costs are added to the debt.</li>
<li><strong>Recovery.</strong> With a liability order the council can ask your employer to take deductions from your wages, ask for deductions from certain benefits, or instruct enforcement agents, whose fees are added too.</li>
</ol>
<p>In Scotland unpaid council tax is recovered through a summary warrant rather than a liability order, with a surcharge of 10 % of the sum due added by law (${h.src('leg_scot_warrant', 'Schedule 8 to the 1992 Act')}), so the steps and the costs differ. Wherever you live, contacting the council before the reminder stage usually keeps the instalments in place: councils can agree a new schedule, and you may qualify for ${h.src('gov_ctr', 'Council Tax Reduction')} if your income is low. A reduction is applied to the yearly bill, and the instalments are then recalculated on the lower figure.</p>

<h2>Where the yearly figure comes from</h2>
<p>The instalments are only as right as the total they divide. The total is the Band D figure your council set for ${P.taxYear}, scaled to your band, less any discount and plus any premium. In England those Band D figures come from the ${h.src('mhclg_levels', 'government table of council tax levels')}; in Wales from the ${h.src('wales_levels', 'Welsh Government table for 2026 to 2027')}. If you live alone the ${h.a('council-tax-single-person-discount', 'single person discount')} comes off before the split, and the ${h.a('home', 'full calculator')} gives the total for any council, band and household.</p>
`;
  },
});
