import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-students',
  group: 'discounts',
  order: 20,
  mini: { kind: 'mini:students', props: { council: 'exeter', band: 2, others: 0 } },
  related: ['council-tax-disregards', 'council-tax-single-person-discount', 'council-tax-moving-house', 'council-tax-nottingham'],
  sources: ['gov_students', 'leg_exempt', 'leg_lgfa_disregards', 'gov_who_pays'],
  slug: 'council-tax-students',
  nav: 'Students',
  card: 'When a student house is exempt, when it gets a discount, and the certificate you need.',
  title: 'Student Council Tax Exemption 2026/27: Who Pays, Who Doesn\'t',
  description: 'Student council tax exemption 2026/27: which courses count, the all-student house, mixed households with a worker or partner, certificates and the summer gap.',
  h1: 'Students and council tax',
  intro: 'A house of full-time students pays nothing. One worker in the house changes everything.',
  resume: (h) => {
    const ex = h.E.bill({ council: 'exeter', band: 2 }), one = h.E.bill({ council: 'exeter', band: 2, household: 'one' });
    return `A home where every resident is a full-time student is exempt from council tax, under Class N of the Council Tax (Exempt Dwellings) Order 1992 in England, with equivalent rules in Wales and Scotland. A full-time course for this purpose lasts at least one academic or calendar year and needs at least 21 hours of study a week during term; for students under 20 studying up to A level, a course of at least three months and 12 hours a week counts. If one resident is not a student, the home is no longer exempt, but the students are disregarded: with one non-student adult the bill gets the 25 % single person discount. In a Band C house in Exeter that means ${h.m2(one.annual)} for ${h.P.taxYear} instead of nothing, and ${h.m2(ex.annual)} if two or more residents are not students. The exemption is claimed from the council with a certificate from each student's university or college.`;
  },
  faqs: (h) => [
    { q: 'Do part-time students pay council tax?', a: 'Yes, unless they fall into another group that is disregarded. Part-time students count as adults like anyone else. A house of full-time students that takes in one part-time student loses its exemption, and the part-time student becomes liable for the bill, with a 25 % discount if the others are all full-time.' },
    { q: 'Who pays council tax if I live with a student partner?', a: 'If you are not a student, you pay. Your partner is disregarded, so you count as the only adult and get a 25 % discount. A student\'s spouse or dependant who is not a British citizen and is barred from working or claiming benefits by immigration rules is also disregarded, which can make the home exempt.' },
    { q: 'Do I pay council tax over the summer between two years of my course?', a: 'No, if you are still enrolled: you remain a student between academic years of the same course. A student house can stay exempt over the summer as long as the residents are still on their courses. After the last year ends, the exemption stops from the course end date, so a graduate who stays on becomes liable.' },
    { q: 'Are student halls of residence charged council tax?', a: 'No. Halls of residence mainly used by students are exempt, whether they belong to a university or a private provider, under their own class of the exempt dwellings order. You do not need to apply. The question only arises when you move out into a house or a flat.' },
  ],
  body: (h) => {
    const towns = ['nottingham', 'exeter', 'cardiff', 'city-of-edinburgh', 'durham'];
    const rows = towns.map((id) => { const c = h.c(id); const one = h.E.bill({ council: id, band: 2, household: 'one' }), two = h.E.bill({ council: id, band: 2 }); return [h.ca(id), 'nothing', h.m2(one.annual), h.m2(two.annual)]; });
    return `
<h2>Who counts as a full-time student</h2>
<p>For council tax, "student" has a precise meaning (${h.src('gov_students', 'GOV.UK, discounts for full-time students')}):</p>
<ul>
<li>at university or college, on a course of at least one year that needs at least 21 hours of study a week for at least 24 weeks of the year;</li>
<li>under 20, on a course up to A level or equivalent that lasts more than three months and needs at least 12 hours a week during term;</li>
<li>a student nurse on a course leading to registration;</li>
<li>a foreign language assistant registered with the British Council.</li>
</ul>
<p>Postgraduates writing up a doctorate, students on placement years and those on courses with distance learning can all qualify if the course meets those tests. Your university decides what to put on the certificate, so ask its student services if you are unsure.</p>

<h2>Three kinds of student house</h2>
<p><strong>Everyone is a full-time student.</strong> The home is exempt: no bill at all (${h.src('leg_exempt', 'Council Tax (Exempt Dwellings) Order 1992')}). The same applies when everyone is a student or a school or college leaver, or when every resident is a student and the others are their non-British spouses or dependants barred from work.</p>
<p><strong>One resident is not a student.</strong> The students are disregarded, so the non-student is the only adult who counts and receives the ${h.a('council-tax-single-person-discount', 'single person discount')}. The bill is in the non-student's name, not the students'.</p>
<p><strong>Two or more residents are not students.</strong> The full bill is due, and the non-students are jointly liable for it. The students cannot be made to pay as long as they are disregarded, although some leases try to share the cost among all tenants; that is a contract question, not council tax.</p>
<p>In houses in multiple occupation let room by room, the landlord is usually liable for the bill and recovers it through the rent. If all tenants are full-time students the house is still exempt, and the landlord should apply.</p>

<h2>What a mixed house pays</h2>
<p>A Band C home shared by students in five university towns, ${h.P.taxYear}:</p>
${h.table(['Council', 'All students', 'One non-student', 'Two non-students'], rows, 'Scottish figures include water and waste water charges.', ['l', 'r', 'r', 'r'])}
<p>The calculator above gives the result for any council and band. Choose how many residents are not students and it shows who pays and how much.</p>

<h2>The certificate and the claim</h2>
<p>Each student asks their university or college for a council tax exemption certificate, usually downloadable from the student portal once enrolled. It gives the course dates and confirms full-time status. The household sends the certificates to the council with the address and the date the tenancy started. Some councils exchange data with local universities and apply the exemption without a claim, but do not count on it: if a bill arrives, send the certificates at once.</p>
<p>Students who start a course partway through a tenancy, or leave one early, should send a new certificate or the date they left. The exemption runs exactly from the course start date to the course end date. When a house has residents on courses with different dates, the council works out the bill day by day: the house is exempt only on the days when everyone living there is a student.</p>

<h2>The gaps people fall into</h2>
<ul>
<li><strong>Finishing the course.</strong> A student's status ends on the last day of the course, often in June. From then on a graduate who stays in the house counts as an adult, and if all residents have graduated the house pays the full bill until the tenancy ends.</li>
<li><strong>Dropping out or suspending studies.</strong> A student who leaves the course, or suspends it, counts from the date they stopped. Tell the council within 21 days.</li>
<li><strong>A gap before a new course.</strong> A student who finishes a degree in June and starts a master's in September is not a student over the summer, because it is a different course.</li>
<li><strong>Part-time years.</strong> A move to part-time study, for example to repeat modules, ends full-time status.</li>
</ul>
${h.box('School and college leavers', '<p>Young people under 20 who leave school or college after 30 April are disregarded until 1 November of the same year, which covers the summer before university or work.</p>', 'info')}

<h2>Not students, but treated alike</h2>
<p>Some young people are not on a course that qualifies but are still disregarded, which works in the same way for the household's discount, although it does not create the all-student exemption:</p>
<ul>
<li>apprentices on a programme leading to a recognised qualification, on a low wage;</li>
<li>young people under 25 on government funded training;</li>
<li>18 and 19 year olds for whom child benefit is still paid.</li>
</ul>
<p>A house shared by two full-time students and an apprentice is therefore not exempt, but nobody in it counts: the bill gets a 50 % discount. Add one worker and the discount falls to 25 %.</p>

<h2>International students</h2>
<p>The rules do not depend on nationality. A student from abroad on a full-time course is a student for council tax like anyone else. Their spouse or dependant is disregarded too if immigration rules prevent them from working or claiming benefits; a spouse who has the right to work and lives in the home counts as an adult, so the home is no longer exempt.</p>

<h2>If a bill arrives anyway</h2>
<p>Councils send bills to every address they believe is occupied. If your all-student house receives one, do not ignore it: reply with the certificates and the tenancy dates. If the reminders continue, ask the council to confirm the exemption in writing. Unpaid bills, even wrong ones, can go to a summons and a liability order with costs added, which is far harder to undo than a letter.</p>

<h2>Students living at home</h2>
<p>A student living with their parents is disregarded, so they do not add to the parents' bill. If one parent lives alone with a student son or daughter, that parent gets the 25 % discount. Students aged 18 or 19 still at school or college are disregarded in the same way, as are young people for whom child benefit is still paid. The ${h.a('council-tax-disregards', 'page on disregarded people')} covers these cases.</p>

<h2>Wales and Scotland</h2>
<p>The rules are the same in substance. In Scotland an all-student household is generally exempt from the water and waste water charges as well, and a mixed household gets the 25 % reduction on water too; check the council's own page. Welsh councils apply an equivalent exemption for homes occupied only by students, set out in the Welsh exempt dwellings rules.</p>
`;
  },
});
