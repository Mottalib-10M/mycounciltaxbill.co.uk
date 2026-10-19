import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-moving-house',
  group: 'paying',
  order: 20,
  mini: { kind: 'mini:move', props: { council: 'bristol', band: 2 } },
  related: ['council-tax-monthly-payments', 'empty-property-council-tax', 'council-tax-single-person-discount', 'check-council-tax-band'],
  sources: ['gov_who_pays', 'leg_instalments', 'gov_second_empty', 'leg_exempt', 'voa_check'],
  slug: 'council-tax-moving-house',
  nav: 'Moving house',
  card: 'The bill split by the day between two addresses, who pays on moving day, and the overlap.',
  title: 'Council Tax When Moving House: Daily Charge and Who Pays',
  description: 'Council tax when moving house in 2026/27: the bill split by the day, who is liable on moving day, telling both councils, and paying for two homes at once.',
  h1: 'Council tax when you move house',
  intro: 'Council tax is charged day by day, so a move splits the year between two bills. This is how each one is worked out.',
  resume: (h) => {
    const P = h.P; const old = h.E.bill({ council: 'leeds', band: 2 }), nw = h.E.bill({ council: 'cardiff', band: 3 });
    const dOld = h.E.daysBetween(P.valid_from, '2026-08-31'), dNew = h.E.daysBetween('2026-09-01', P.valid_to);
    return `Council tax is a daily charge: the Local Government Finance Act 1992 sets liability day by day, so when you move each council bills you only for the days you were its resident, at the yearly charge divided by ${P.daysInYear}. The rule for moving day is that the position at the end of the day counts for the whole day, which means you pay for that day at the new address and not at the old one. Take a couple leaving a Band C home in Leeds on 1 September 2026 for a Band D flat in Cardiff. Leeds charges ${dOld} days of a ${h.m2(old.annual)} bill, or ${h.m2(h.E.forDays(old.annual, dOld))}; Cardiff charges the other ${dNew} days of ${h.m2(nw.annual)}, or ${h.m2(h.E.forDays(nw.annual, dNew))}. Each council needs to hear from you: the old one closes the account and issues a final bill or a refund, the new one opens an account and sends a demand with fewer instalments. Discounts such as the single person discount do not follow you and have to be claimed again.`;
  },
  faqs: (h) => {
    const P = h.P; const ex = h.E.bill({ council: 'exeter', band: 1 });
    return [
      { q: 'Do I pay council tax on the day I move out or the day I move in?', a: 'The day you move in. The 1992 Act treats the situation at the end of each day as applying to the whole day, and at the end of moving day you live at the new home. Your old council should stop charging from that day, and the new one should start charging from it.' },
      { q: 'How do I work out council tax for part of a year?', a: `Divide the yearly bill by ${P.daysInYear} and multiply by the number of days you are liable. A Band B home in Exeter costs ${h.m2(ex.annual)} a year for two adults, about ${h.m2(ex.daily)} a day, so 100 days come to ${h.m2(h.E.forDays(ex.annual, 100))}. The calculator above does this for any council.` },
      { q: 'Will I get a council tax refund when I move out?', a: 'Yes, if you have paid more than the days you were liable. That often happens on the 10 instalment plan, which collects the whole year by January: someone moving out in February has already paid for days they will not live there. The council issues a final bill showing the credit and refunds it, usually on request.' },
      { q: 'Who pays council tax on a house that is empty between owners?', a: 'Until a buyer or tenant moves in, the person with the legal interest in the property is liable as its owner, usually the seller until completion and the buyer after it. Whether the empty days cost the full charge, a reduced charge or a premium depends on the property and on the council, as some classes of empty home are exempt.' },
      { q: 'Do I need to tell the council if I move within the same borough?', a: 'Yes. Each address has its own council tax account and band, even inside one council, so the old account closes and a new one opens on the date you move. The council splits the year between the two addresses by the day and reissues the instalments for the new home.' },
    ];
  },
  body: (h) => {
    const P = h.P;
    const moves: Array<[string, number, string, number, string]> = [
      ['manchester', 1, 'stockport', 3, '2026-06-15'],
      ['wandsworth', 4, 'milton-keynes', 4, '2026-11-02'],
      ['glasgow-city', 2, 'city-of-edinburgh', 2, '2027-01-10'],
      ['swansea', 2, 'bristol', 2, '2026-10-01'],
    ];
    const rows = moves.map(([a, ba, b, bb, iso]) => {
      const x = h.E.bill({ council: a, band: ba }), y = h.E.bill({ council: b, band: bb });
      const prev = new Date(Date.parse(iso) - 86400000).toISOString().slice(0, 10);
      const d1 = h.E.daysBetween(P.valid_from, prev), d2 = h.E.daysBetween(iso, P.valid_to);
      const t = h.E.forDays(x.annual, d1) + h.E.forDays(y.annual, d2);
      return [`${h.ca(a)} Band ${x.band} to ${h.ca(b)} Band ${y.band}`, h.date(iso), `${d1} / ${d2}`, h.m2(h.E.forDays(x.annual, d1)), h.m2(h.E.forDays(y.annual, d2)), h.m2(t)];
    });
    const nott = h.E.bill({ council: 'nottingham', band: 0 }); const nottOne = h.E.bill({ council: 'nottingham', band: 0, household: 'one' });
    const dN = h.E.daysBetween('2026-07-20', P.valid_to);
    const pl = h.E.bill({ council: 'plymouth', band: 2 }); const plDays = h.E.daysBetween('2026-05-01', '2026-07-30');
    return `
<h2>Four moves in ${P.taxYear}, split by the day</h2>
<p>Every figure below is the yearly charge for two adults divided by ${P.daysInYear} and multiplied by the days spent at each address. The moving date itself is counted at the new home.</p>
${h.table(['Move', 'Moving day', 'Days old / new', 'Old council', 'New council', 'Year in total'], rows, `${P.taxYear}, two adults, main home both sides. Scottish figures include water and waste water.`, ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>The total for the year can rise or fall sharply depending on where you go. A move from Wandsworth, one of the lowest charging councils in England, to a home of the same band elsewhere usually raises the daily cost, while a move from Glasgow to Edinburgh changes little. Moving between nations also changes the band system: Wales uses nine bands set on 2003 values, England and Scotland eight bands on 1991 values, so the same house would not necessarily carry the same letter.</p>

<h2>Liability is a daily question</h2>
<p>Section 2 of the Local Government Finance Act 1992 says that liability to council tax is determined on a daily basis, and that whatever the situation is at the end of a day is taken to have applied all day. Who is liable, which band applies and which discount is due are all read that way. In practice that gives three simple results:</p>
<ul>
<li>the day you move in is charged at the new home;</li>
<li>the day you move out is not charged at the old home, because at midnight you no longer live there;</li>
<li>a discount that starts or stops on a given day, for example when a partner moves out, changes the bill from that day.</li>
</ul>
<p>The council therefore never charges you twice for the same day as a resident. The only way to pay twice is to be liable for a second property as its owner, which is covered further down.</p>

<h2>Who the council bills at each address</h2>
<p>Section 6 of the 1992 Act sets an order of priority. The first person on the list who fits is liable: a resident who owns the freehold, then a resident leaseholder, then a resident tenant, then a resident with a licence to occupy, then any other resident, and only when nobody lives there, the owner. Couples who live together are jointly responsible, as ${h.src('gov_who_pays', 'GOV.UK explains')}, so either of them can be asked for the whole bill. For houses in multiple occupation and a few other kinds of property the owner is billed instead of the people living there.</p>
<p>For a tenant this order matters at the end of a lease. If you move out before your tenancy ends, the days in between are not charged to you as a resident; but a tenant with a lease of six months or more can still count as the owner of an empty home, and some councils bill the tenant for those days on that basis. Checking the end date of the tenancy against the moving date avoids a surprise final bill.</p>

<h2>Telling both councils, and what each one does</h2>
<p>Most councils have an online form for moving in, moving out and moving within the area. Give each of them the same date, the new address, the name of the landlord or buyer if you know it, and a forwarding address for the final bill.</p>
<p><strong>The old council</strong> closes the account on the day before you move, recalculates the year by the day and sends a final bill. If you paid on the standard plan, you may have paid ahead: a household leaving in late February will have cleared the full year by the January instalment, so the council owes it the surplus. If you paid less than the days due, the balance is payable in the instalments left, or at once if few months remain.</p>
<p><strong>The new council</strong> opens an account and sends a demand notice. The number of instalments depends on when the notice is issued, under ${h.src('leg_instalments', 'Schedule 1 of the 1992 instalment rules')}: a notice issued from May onward gets fewer payments than the usual ${P.instalments.default}, and one issued between January and March is payable in a single sum. The page on ${h.a('council-tax-monthly-payments', 'monthly payments')} works through those rules, including the right to ask for ${P.instalments.onRequest} instalments in England and Wales.</p>
${h.box('Discounts do not move with you', `<p>A single person discount, a student exemption or a Disabled Band Reduction is attached to one account at one address. In Nottingham a Band A home costs ${h.m2(nott.annual)} for two adults and ${h.m2(nottOne.annual)} for one; a person who moves there alone on 20 July and forgets to claim pays the difference for ${dN} days, ${h.m2(h.E.forDays(nott.annual - nottOne.annual, dN))}, until the claim is backdated.</p>`, 'tip')}

<h2>Paying for two homes during the move</h2>
<p>Buyers who complete on a new home before selling the old one, or tenants whose leases overlap, are often liable for two properties for a while. You live in one, so that one is billed with the normal rules. The other is nobody's main home, so it is billed to you as its owner or leaseholder, and the amount depends on its state and on the council:</p>
<ul>
<li>an empty home that is unfurnished is normally charged in full, unless the council grants a local discount; after a year empty a premium can apply, as the page on ${h.a('empty-property-council-tax', 'empty properties')} explains;</li>
<li>a home left furnished but not lived in counts as a second home, and in England councils may charge a premium on it from ${h.date(P.premiums.england.secondHomeFrom)};</li>
<li>a few situations are exempt under the ${h.src('leg_exempt', 'Exempt Dwellings Order 1992')}, such as a home empty because its sole resident has moved into a care home or hospital, or a property repossessed by a lender.</li>
</ul>
<p>Suppose you complete on a Band C house in Plymouth on 1 May 2026 but carry on living in your old flat until 31 July, the day you move in. Plymouth bills the ${plDays} days from 1 May to 30 July to you as the owner of an empty, unfurnished house, at up to the full rate: for that band, ${h.m2(h.E.forDays(pl.annual, plDays))}. The bill for the flat you are living in carries on as normal over the same weeks. The ${h.src('gov_second_empty', 'GOV.UK page on second homes and empty properties')} lists what councils can and cannot charge.</p>

<h2>Moving to or from a Scottish home</h2>
<p>In Scotland the council tax bill also carries Scottish Water's water and waste water charges, and those are split by the day exactly like the tax. A move into a Band C home in Aberdeen on 1 October therefore brings a bill for ${h.E.daysBetween('2026-10-01', P.valid_to)} days of ${h.m2(h.E.bill({ council: 'aberdeen-city', band: 2 }).annual)}, a total that already includes both water charges. Bands in Scotland are set by the local assessor rather than the Valuation Office Agency, and a new owner or tenant has six months from becoming liable to propose a change of band to the assessor.</p>

<h2>Proving the date you moved</h2>
<p>Councils can only split the year correctly if they know the date. When nobody tells them, the account at the old address simply continues, and the bill may be sent to you for months after you left. Evidence that councils commonly accept includes a completion statement from a solicitor or conveyancer, the start and end dates of a tenancy agreement, a letter from a landlord confirming when keys were returned, or the date of a final meter reading. If the council later accepts an earlier date, the account is corrected back to that day and any overpayment is credited.</p>

<h2>Leaving the country, moving into care, or moving in with family</h2>
<p>If you move abroad, the old council issues a final bill up to the day before you left and the property is then billed to whoever is liable next, which may be you as its owner if it stays empty. If you move permanently into a care home or a hospital, your former home can be exempt while it is empty, under class E of the Exempt Dwellings Order. Moving in with relatives changes their bill rather than creating a new one: if you become a second adult who counts, a single person discount there ends on the day you arrive.</p>

<h2>A short checklist for moving day</h2>
<ul>
<li>tell the old council the date and give a forwarding address for the final bill;</li>
<li>register at the new address with the same date, and give the band shown on the official search;</li>
<li>claim any discount or exemption again at the new account;</li>
<li>cancel the Direct Debit to the old council only after its final bill is settled;</li>
<li>keep the completion statement or tenancy dates in case the council asks for proof.</li>
</ul>

<h2>A new band at the new home</h2>
<p>The band is a property of the home, not of the household. Before you commit to a rental or a purchase, look the address up on the ${h.src('voa_check', 'Valuation Office Agency search')} in England and Wales, or with the local assessor in Scotland, and put that band into the calculator. If the band looks wrong for the street, a new resident has a window to challenge it: the page on ${h.a('check-council-tax-band', 'checking your band')} explains how comparable homes are used.</p>

<h2>Moving into or out of a shared house</h2>
<p>When an adult joins or leaves a shared home, the account does not close: the council just changes the discount from the date of the move. If two adults lived there and one leaves, the one who stays can claim ${h.pc(P.discounts.singlePerson)} off from the next day. If you move into a home where only students live and you are not a student, the exemption ends that day and the household receives a bill for the rest of the year, which you may be asked to pay in full or with the ${h.pc(P.discounts.singlePerson)} discount if you are the only adult who counts.</p>
`;
  },
});
