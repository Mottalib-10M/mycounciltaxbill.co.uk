import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-single-person-discount',
  group: 'discounts',
  order: 10,
  mini: { kind: 'mini:spd', props: { council: 'manchester', band: 1 } },
  related: ['home', 'council-tax-disregards', 'council-tax-students', 'council-tax-moving-house'],
  sources: ['gov_who_pays', 'leg_lgfa_discounts', 'leg_lgfa_disregards', 'wales_reform', 'highland_charges'],
  slug: 'council-tax-single-person-discount',
  nav: 'Single person discount',
  card: 'The 25 % in pounds for your council and band, and who still counts as living alone.',
  title: 'Council Tax Single Person Discount 2026/27: 25 % in Pounds',
  description: 'Single person discount on council tax for 2026/27: what 25 % is worth in your council and band, who counts as living alone, backdating, and the 50 % case.',
  h1: 'Council tax single person discount 2026/27',
  intro: 'A quarter off the bill when you are the only adult who counts, in England, Wales and Scotland alike.',
  resume: (h) => {
    const man = h.E.bill({ council: 'manchester', band: 1 }), one = h.E.bill({ council: 'manchester', band: 1, household: 'one' });
    const glas = h.E.bill({ council: 'glasgow-city', band: 2 }), glas1 = h.E.bill({ council: 'glasgow-city', band: 2, household: 'one' });
    return `The single person discount takes ${h.pc(h.P.discounts.singlePerson)} off your council tax when you are the only adult in the home who counts for council tax, under section 11 of the Local Government Finance Act 1992. It is worth more where the bill is higher, so the same discount is a different sum in every council: in a Band B flat in Manchester it cuts ${h.P.taxYear} from ${h.m2(man.annual)} to ${h.m2(one.annual)}, a saving of ${h.m(man.annual - one.annual)}, while in Glasgow a Band C home saves ${h.m(glas.annual - glas1.annual)} because the 25 % also comes off Scottish Water's charges. You can live with other people and still get it, as long as they are disregarded: full-time students, apprentices, under-18s and live-in carers among them. If nobody counts the reduction is ${h.pc(h.P.discounts.allDisregarded)}. The discount is never automatic: you claim it from your council, and you must tell them when another adult who counts moves in.`;
  },
  faqs: (h) => {
    const leeds = h.E.bill({ council: 'leeds', band: 0 }), leeds1 = h.E.bill({ council: 'leeds', band: 0, household: 'one' });
    return [
      { q: 'My adult son lives with me but he is at university. Do I still get 25 % off?', a: `Yes, if he is a full-time student: a course of at least a year and 21 hours a week. He is disregarded, so you are the only adult who counts. The same applies to a child of 18 or 19 still at school or college. In Leeds, Band A, that keeps the bill at ${h.m2(leeds1.annual)} instead of ${h.m2(leeds.annual)}.` },
      { q: 'Can my council backdate the single person discount?', a: 'Councils usually backdate it to the date you started living alone if you can show when that was, for instance the date a partner moved out or a death certificate. There is no national time limit written for backdating, so each council sets its own practice; claim as soon as you can and send evidence such as a tenancy end date or a utility account.' },
      { q: 'What happens if I keep the discount after someone moves in?', a: 'You must tell the council within 21 days in England. If you do not, the council can recover the discount for the whole period and add a £70 penalty. Councils check claims against electoral registers and credit reference data, and most run a review of single person discounts every year or two.' },
      { q: 'Does a lodger stop the single person discount?', a: 'Yes, an adult lodger who lives there as their main home counts like anyone else, unless they fall into a disregarded group such as a full-time student. Taking in one working lodger turns a 25 % discount into a full bill, which is worth putting in the rent you charge.' },
      { q: 'Is the single person discount the same in Wales and Scotland?', a: `The rate is the same 25 % in all three nations. The Welsh Government confirmed in 2025 that it will keep it in its council tax reform. In Scotland it also applies to the water and waste water charges collected with council tax, which councils in England and Wales do not collect.` },
    ];
  },
  body: (h) => {
    const P = h.P;
    const rows = ['westminster', 'manchester', 'cardiff', 'city-of-edinburgh', 'rutland', 'merthyr-tydfil'].map((id) => {
      const c = h.c(id); const b = c.nation === 'wales' ? 3 : 3;
      const two = h.E.bill({ council: id, band: b }), one = h.E.bill({ council: id, band: b, household: 'one' });
      return [h.ca(id), h.m2(two.annual), h.m2(one.annual), h.m(two.annual - one.annual)];
    });
    const lone = h.E.bill({ council: 'sheffield', band: 1, household: 'one' }), none = h.E.bill({ council: 'sheffield', band: 1, household: 'none' }), full = h.E.bill({ council: 'sheffield', band: 1 });
    const dis = h.E.bill({ council: 'leicester', band: 2, household: 'one', disabled: true }), disFull = h.E.bill({ council: 'leicester', band: 2 });
    return `
<h2>What the 25 % is worth across Britain</h2>
<p>Because the discount is a share of the bill, it follows the Band D figure of each council. In Band D, the gap between the cheapest and the dearest council areas is more than two to one, so the same discount moves from a few hundred pounds in central London to well over six hundred in the most expensive parts of England:</p>
${h.table(['Council', 'Band D, two adults', 'Living alone', 'Saving'], rows, `Band D, ${P.taxYear}, main home. Scottish figures include water and waste water.`, ['l', 'r', 'r', 'r'])}
<p>The saving is lower in Westminster and Wandsworth because their own council tax is low, not because the discount is smaller. In Scotland part of the saving comes from water: the ${h.pc(P.discounts.singlePerson)} also applies to the ${h.m2(P.scottishWater.water[3])} water charge and the ${h.m2(P.scottishWater.sewerage[3])} waste water charge on a Band D bill.</p>

<h2>Who counts as an adult for council tax</h2>
<p>The law does not ask how many people live with you; it asks how many adults count. Everyone aged 18 or over who has the home as their main residence counts, unless they belong to one of the groups listed in Schedule 1 of the 1992 Act. Those people are "disregarded", which is the word your council will use. The main groups are:</p>
<ul>
<li>full-time students, student nurses and foreign language assistants registered with the British Council;</li>
<li>apprentices and young people under 25 on funded training;</li>
<li>18 and 19 year olds in full-time education at school or college, and young people just after leaving it;</li>
<li>people who are severely mentally impaired, with a doctor's certificate and a qualifying benefit;</li>
<li>live-in carers who look after someone who is not their partner or a child under 18, for at least 35 hours a week;</li>
<li>people in prison, in a care home or living in hospital, members of religious communities and some diplomats.</li>
</ul>
<p>A household of three can therefore pay the same as a person living alone. A mother living with a son at university and a daughter on an apprenticeship is the only adult who counts: she gets the ${h.pc(P.discounts.singlePerson)}. The page on ${h.a('council-tax-disregards', 'people who are disregarded')} goes through each group and the evidence councils ask for.</p>

<h2>When nobody counts: 50 % or nothing</h2>
<p>If every adult in the home is disregarded, the discount doubles to ${h.pc(P.discounts.allDisregarded)}. That is the case, for example, of a live-in carer whose employer lives elsewhere, or of a home where the only resident is in long-term hospital care. In a Band B home in Sheffield the bill goes from ${h.m2(full.annual)} for two adults to ${h.m2(lone.annual)} for one, and ${h.m2(none.annual)} when nobody counts.</p>
<p>There is one important exception. When everyone is a full-time student, or everyone is severely mentally impaired, the home is not discounted but exempt: nothing is due at all. The ${h.a('council-tax-students', 'student page')} explains how a student house loses that exemption as soon as one resident finishes a course or starts working.</p>

<h2>Combining the discount with other reductions</h2>
<p>The single person discount is applied after the band. If your home also qualifies for the Disabled Band Reduction, the council first charges you at the band below, then takes 25 % off that lower charge. In Leicester a Band C home adapted for a disabled resident who lives alone pays ${h.m2(dis.annual)} instead of ${h.m2(disFull.annual)}: the two reductions together are worth ${h.m(disFull.annual - dis.annual)} a year. Council Tax Reduction for people on a low income comes after both, and is worked out on what is left.</p>
<p>It cannot be combined with a second home or an empty home: a home that is nobody's main residence has no adult who counts, and the rules on ${h.a('second-home-council-tax', 'second homes')} and ${h.a('empty-property-council-tax', 'empty homes')} apply instead.</p>

<h2>How to claim, and what to send</h2>
<p>Every council has an online form, usually under "discounts and exemptions". You give your council tax account number, the date you started living alone, and the names and dates of birth of anyone who lives with you and is disregarded. Some councils also ask for a reason, such as a partner leaving or a death. Expect a revised bill with a credit for the past months if the claim is backdated.</p>
<p>When you move into a new home on your own, say so when you register for council tax: the bill will then start with the discount. If you are ${h.a('council-tax-moving-house', 'moving house')}, remember that the discount is tied to the address and has to be claimed again at the new one.</p>

<h2>Common situations, one by one</h2>
<p><strong>A partner has died.</strong> The discount applies from the day after the death. When the person who died lived alone, the empty home is instead exempt until probate is granted and for up to six months after, a different rule from the discount.</p>
<p><strong>A partner has moved out after a separation.</strong> The discount starts from the date they stopped living there as their main home, even if their name is still on the deeds or the tenancy. Being a joint owner does not make someone count if they live elsewhere.</p>
<p><strong>A grown-up child has come home.</strong> An adult child aged 20 or over who is working or looking for work counts, and the discount ends from the date they moved back in, unless they fall into a disregarded group.</p>
<p><strong>You work away during the week.</strong> If your home is still your main residence, you count there, and so does a partner who stays at home.</p>

<h2>Reviews and checks</h2>
<p>About a third of homes in England receive the single person discount, which makes it the most claimed reduction and the one councils review most. Expect a letter asking you to confirm that you still live alone, and answer it: councils that get no reply often remove the discount. If your situation changes, for instance a partner moves in or a child leaves college and starts work, tell the council within 21 days. In England the law allows a £70 penalty on top of the discount recovered.</p>
${h.box('Before you claim', `<p>Check who lives with you against the list of disregarded people, not against how many beds are taken. A partner who works away during the week but has your home as their main residence still counts.</p>`, 'tip')}

<h2>The single person discount in Wales and Scotland</h2>
<p>The rule is identical in Wales, where the Welsh Government reviewed all 53 categories of discounts and exemptions as part of its reform and decided to keep the ${h.pc(P.discounts.singlePerson)} single adult discount (${h.src('wales_reform', 'Welsh Government, reforming Council Tax')}). In Scotland the discount is the same and, as the Highland Council's table for ${P.taxYear} shows, it reduces the water and waste water charges by the same quarter (${h.src('highland_charges', 'Highland Council charges 2026 to 2027')}). The calculator above includes that for every Scottish council.</p>
`;
  },
});
