import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'empty-property-council-tax',
  group: 'premiums',
  order: 20,
  mini: { kind: 'mini:empty', props: { council: 'blackpool', band: 1, years: 6 } },
  related: ['second-home-council-tax', 'council-tax-moving-house', 'council-tax-disregards', 'council-tax-annexes'],
  sources: ['gov_second_empty', 'mhclg_premiums', 'leg_lgfa_premium', 'leg_exempt', 'wales_premiums', 'scot_circular_2026'],
  slug: 'empty-property-council-tax',
  nav: 'Empty homes',
  card: 'Exemptions while a home is empty, then a premium that grows with the years: 1, 5 and 10.',
  title: 'Empty Property Council Tax 2026/27: Exemptions and Premiums',
  description: 'Empty property council tax for 2026/27: exemptions after a death, a move into care or a repossession, then the empty home premium after one, five and ten years.',
  h1: 'Council tax on an empty home',
  intro: 'An empty home is not free of council tax, except in the cases the law lists. After a year, it can cost far more than an occupied one.',
  resume: (h) => {
    const PE = h.P.premiums.england; const T = PE.emptyTiers;
    const b = (y: number) => h.E.bill({ council: 'blackpool', band: 1, occupancy: 'empty', emptyYears: y }).annual;
    return `An empty home still pays council tax in England, Wales and Scotland, unless it falls into an exempt class: the owner has died and probate is awaited, the owner has moved into a care home or hospital, the home has been repossessed, it cannot legally be lived in, and a few others. Once a home has been empty and substantially unfurnished for ${PE.emptyFromYears} year, English councils may add a long-term empty premium of up to ${h.pc(T[0].max)}, rising to ${h.pc(T[1].max)} after ${T[1].years} years and ${h.pc(T[2].max)} after ${T[2].years} years, under rules in force since ${h.date(PE.emptyFromDate)}. In Blackpool a Band B home therefore costs ${h.m2(b(0))} in its first year empty for ${h.P.taxYear}, ${h.m2(b(1))} after a year, ${h.m2(b(5))} after five and ${h.m2(b(10))} after ten, if the council charges the maximum. Wales allows up to ${h.pc(h.P.premiums.wales.max)}; Scotland applies a default of ${h.pc(h.P.premiums.scotland.default)} after a year, which councils can change.`;
  },
  faqs: (h) => [
    { q: 'Do I pay council tax on an empty house after someone dies?', a: 'Not while you wait for probate, if the person who died was the owner or tenant and nobody lives there. The home is exempt until probate or letters of administration are granted, and for up to six more months while it stays unoccupied and in the deceased person\'s name. After that the executors pay, and in England a premium is excepted for twelve months after the grant.' },
    { q: 'Does a short let or a few weeks of occupation reset the empty homes premium?', a: 'In England a home must be occupied for at least six weeks for the clock to restart; a shorter period of occupation is ignored and the home is treated as empty throughout. Councils also look at whether the occupation was genuine, so moving in a relative for a few days does not help.' },
    { q: 'Who pays council tax on an empty rented property between tenants?', a: 'The landlord, as the owner, once the last tenancy has ended. Some councils give a short discount for empty homes, many give none. If the home is furnished it is treated as a second home, and if it is marketed for let the English premium is excepted for up to twelve months.' },
  ],
  body: (h) => {
    const PE = h.P.premiums.england; const T = PE.emptyTiers;
    const ids = ['blackpool', 'kingston-upon-hull', 'stoke-on-trent', 'blaenau-gwent', 'inverclyde'];
    const rows = ids.filter((id) => { try { h.c(id); return true; } catch { return false; } }).map((id) => { const c = h.c(id); const r = (y: number) => h.m2(h.E.bill({ council: id, band: 0, occupancy: 'empty', emptyYears: y }).annual); return [h.ca(id), r(0.5), r(2), r(6), r(11)]; });
    return `
<h2>When an empty home is exempt</h2>
<p>The Council Tax (Exempt Dwellings) Order 1992 lists the classes of empty home on which nothing is due (${h.src('leg_exempt', 'Exempt Dwellings Order 1992')}, ${h.src('gov_second_empty', 'GOV.UK, second homes and empty properties')}). The main ones are:</p>
<ul>
<li><strong>After a death</strong> (Class F): until probate or letters of administration are granted, and then for up to six months while the home stays empty and in the deceased's name;</li>
<li><strong>moved into care or hospital</strong> (Class E): the home of someone now living permanently in a care home or hospital;</li>
<li><strong>moved to give or receive care</strong> (Classes I and J): a home left empty by someone who moved elsewhere to receive care, or to care for someone;</li>
<li><strong>repossessed</strong> (Class L): a home taken back by a mortgage lender;</li>
<li><strong>in prison</strong> (Class C): the home of someone detained, unless it is for unpaid council tax or a fine;</li>
<li><strong>cannot be lived in by law</strong> (Class G): for example under a prohibition order, or because occupation is forbidden by planning rules;</li>
<li><strong>bankruptcy</strong> (Class Q): where a trustee in bankruptcy is liable;</li>
<li><strong>students</strong> (Class K): a home last lived in by a student owner who left to study.</li>
</ul>
<p>Most of these apply while the home is unoccupied, whether or not it is furnished. There is no general exemption for a home that is simply empty while it is sold or let, and none for a home being refurbished: since 2013 English councils decide whether to give any discount at all for those.</p>

<h2>The long-term empty premium in England</h2>
<p>A home that has been unoccupied and substantially unfurnished for ${PE.emptyFromYears} year or more is a long-term empty dwelling. Section 11B of the 1992 Act lets councils add a premium to its bill (${h.src('leg_lgfa_premium', 'section 11B of the 1992 Act')}). Since ${h.date(PE.emptyFromDate)} the ceilings are:</p>
<ul>
<li>after ${T[0].years} year empty: up to ${h.pc(T[0].max)}, double the bill;</li>
<li>after ${T[1].years} years: up to ${h.pc(T[1].max)}, three times the bill;</li>
<li>after ${T[2].years} years: up to ${h.pc(T[2].max)}, four times the bill.</li>
</ul>
<p>The clock runs on the home, not on the owner: a buyer of a home empty for three years inherits the three years. Occupation for less than six weeks does not reset it. The bill in Band A, if each council charges the maximum allowed at each stage:</p>
${h.table(['Council', '6 months empty', '2 years', '6 years', '11 years'], rows, `${h.P.taxYear}. Welsh and Scottish rows use the national default here; check your own council's rate. Scottish figures include water and waste water, which the premium does not increase.`, ['l', 'r', 'r', 'r', 'r'])}

<h2>Exceptions from the English premium</h2>
<p>The government's guidance lists homes that pay the ordinary bill without a premium (${h.src('mhclg_premiums', 'MHCLG guidance on premiums')}):</p>
<ul>
<li>homes being actively marketed for sale or let, for up to ${PE.exceptionMonths} months;</li>
<li>homes after a grant of probate, for up to ${PE.exceptionMonths} months;</li>
<li>homes needing or undergoing major repairs or structural alteration, for up to ${PE.exceptionMonths} months;</li>
<li>annexes forming part of the main home;</li>
<li>homes of service personnel who live in armed forces accommodation for work.</li>
</ul>
<p>The guidance stops the sale and letting exceptions from being used again and again: once the twelve months have run, they do not start afresh until the home has been sold or let.</p>

<h2>Wales</h2>
<p>Welsh councils may charge up to ${h.pc(h.P.premiums.wales.max)} on homes empty for at least ${h.P.premiums.wales.emptyFromYears} year, a power in force since ${h.date(h.P.premiums.wales.from)} (${h.src('wales_premiums', 'Welsh Government guidance')}). Each council sets its own rate, and some step it up with the years. The exceptions resemble those in England.</p>

<h2>Scotland</h2>
<p>From ${h.date(h.P.premiums.scotland.from)} a home empty for ${h.P.premiums.scotland.emptyFromYears} year or more pays a premium of ${h.pc(h.P.premiums.scotland.default)} by default, which each council may raise, lower or remove (${h.src('scot_circular_2026', 'Scottish Government Finance Circular 6/2026')}). The circular sets out cases where the premium should not be charged, such as some homes actively marketed for sale or let, and councils have discretion to help owners bringing a home back into use. The premium applies to council tax only; Scottish Water charges on an empty home follow their own rules.</p>

<h2>Practical steps for owners</h2>
<ul>
<li>Tell the council the date the home became empty, and whether it is furnished. The date decides when exemptions end and the premium starts.</li>
<li>Keep evidence of marketing: agent's contract, listing dates, viewings. The council will ask for it to apply the twelve month exception.</li>
<li>For a home under major works, ask whether it can be removed from the valuation list while it is uninhabitable; the ${h.a('challenge-council-tax-band', 'challenge guide')} covers that route.</li>
<li>For an inherited home, give the date of death and, later, the date probate was granted, to the council.</li>
</ul>
${h.box('Selling a long-term empty home', '<p>The premium is part of the price: a buyer will pay it from the day of completion until they move in. If the home has been empty for five years or more, say so in the sale, and check what the council charges.</p>', 'warning')}

<h2>Three owners, three bills</h2>
<p><strong>An executor selling a parent's house.</strong> The house is exempt from the death until probate, then for up to six months more while it is empty and still in the parent's name. If it is still unsold after that, the ordinary bill is due, and in England the premium cannot be added in the twelve months after the grant.</p>
<p><strong>A landlord whose flat has been empty for two years.</strong> No exemption applies. The flat pays the full charge plus whatever premium the council has set, up to ${h.pc(T[0].max)} in England. If it is put up for let with an agent, the twelve month exception can stop the premium, once.</p>
<p><strong>A family renovating a derelict cottage.</strong> If the cottage needs major structural work to be wind and watertight, it may be removed from the valuation list altogether until the work ends. If it is habitable but under major works, the English premium is excepted for up to twelve months, and some councils grant a discount.</p>

<h2>How councils find empty homes</h2>
<p>Councils run regular reviews of empty homes, using inspections, utility data and tenancy records. Some have an empty homes officer whose role is to help owners bring a home back into use, sometimes with loans or grants for repairs. Telling the council early, and explaining what you plan to do, can lead to a more flexible approach than waiting for the premium to arrive on the bill.</p>

<h2>Furnished or unfurnished</h2>
<p>The distinction matters. An empty and substantially unfurnished home is an empty home, with the premium after a year. An empty but furnished home is a ${h.a('second-home-council-tax', 'second home')}, with the second home premium from the first day in England, Wales and Scotland. Leaving a sofa and a bed does not turn an empty home into a second home in the council's eyes: the question is whether the home is furnished enough to live in.</p>
`;
  },
});
