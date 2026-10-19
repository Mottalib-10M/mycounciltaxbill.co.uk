import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-disregards',
  group: 'discounts',
  order: 30,
  mini: { kind: 'mini:disregards', props: { council: 'plymouth', band: 1, adults: 3, disregarded: 2 } },
  related: ['council-tax-single-person-discount', 'council-tax-students', 'council-tax-disabled-band-reduction', 'council-tax-annexes'],
  sources: ['leg_lgfa_disregards', 'leg_lgfa_discounts', 'gov_who_pays', 'gov_disabled'],
  slug: 'council-tax-disregards',
  nav: 'People who are disregarded',
  card: 'Carers, apprentices, school leavers and others who do not count, and what that does to the bill.',
  title: 'Council Tax Disregards 2026/27: Who Does Not Count as Adult',
  description: 'Council tax disregards 2026/27: carers, apprentices, school leavers, severe mental impairment, hospital and care home stays, and the 25 % or 50 % they give.',
  h1: 'Who is disregarded for council tax',
  intro: 'The bill assumes two adults. Every adult on this list is invisible to it.',
  resume: (h) => {
    const two = h.E.bill({ council: 'plymouth', band: 1 }), one = h.E.bill({ council: 'plymouth', band: 1, household: 'one' }), none = h.E.bill({ council: 'plymouth', band: 1, household: 'none' });
    return `Being "disregarded" for council tax means you are not counted when the council works out how many adults live in a home. The groups are listed in Schedule 1 of the Local Government Finance Act 1992 and the orders made under it: full-time students and student nurses, apprentices and young trainees, 18 and 19 year olds still in education, people who are severely mentally impaired, many live-in carers, people in hospital, care homes or prison, and a few others. The bill is based on two adults who count. If only one adult counts, it falls by ${h.pc(h.P.discounts.singlePerson)}; if nobody counts, by ${h.pc(h.P.discounts.allDisregarded)}. In a Band B home in Plymouth that is ${h.m2(two.annual)}, ${h.m2(one.annual)} or ${h.m2(none.annual)} for ${h.P.taxYear}. Being disregarded does not depend on income, and the council has to be told: it does not know who lives with you.`;
  },
  faqs: (h) => [
    { q: 'Does a live-in carer count for council tax?', a: 'Not if they meet the conditions. A carer who lives with the person they look after, provides at least 35 hours of care a week, and is not that person\'s partner or the parent of a child under 18 is disregarded, provided the person cared for receives a qualifying disability benefit at the higher rates. Carers employed by a charity or a council on low pay are disregarded too.' },
    { q: 'Does someone with dementia count for council tax?', a: 'A person with dementia can be disregarded as severely mentally impaired, if a doctor certifies a severe impairment of intelligence and social functioning that appears permanent, and the person receives a qualifying benefit such as Attendance Allowance or the daily living part of PIP. A spouse living with them then gets a 25 % discount.' },
    { q: 'Is my 19 year old at college disregarded for council tax?', a: 'Yes, if child benefit is still paid for them, or if they are under 20 and on a course up to A level or equivalent of more than three months and at least 12 hours a week. Once they leave education and start work, they count as an adult from that date, and you need to tell the council.' },
    { q: 'What happens to council tax when someone goes into a care home?', a: 'A resident who has moved permanently into a care home or hospital is disregarded at the home they left. If they lived there alone, that home becomes empty and is exempt for as long as it stays unoccupied. If a partner stays behind, the partner gets the 25 % single person discount.' },
  ],
  body: (h) => {
    const P = h.P;
    const ex = [['derby', 1], ['wakefield', 0], ['swindon', 2], ['carmarthenshire', 3], ['dundee-city', 1]] as Array<[string, number]>;
    const rows = ex.map(([id, b]) => { const c = h.c(id); return [h.ca(id), `Band ${h.E.letters(c.nation)[b]}`, h.m2(h.E.bill({ council: id, band: b }).annual), h.m2(h.E.bill({ council: id, band: b, household: 'one' }).annual), h.m2(h.E.bill({ council: id, band: b, household: 'none' }).annual)]; });
    return `
<h2>The full list</h2>
<p>Schedule 1 of the 1992 Act sets out who is disregarded (${h.src('leg_lgfa_disregards', 'Local Government Finance Act 1992, Schedule 1')}). In plain terms:</p>
<ol>
<li><strong>Young people.</strong> Anyone aged 18 for whom child benefit is still paid; 18 and 19 year olds in full-time education up to A level; school and college leavers under 20 between leaving after 30 April and 1 November.</li>
<li><strong>Students.</strong> Full-time students at university or college, student nurses, foreign language assistants registered with the British Council. The ${h.a('council-tax-students', 'student page')} has the course tests.</li>
<li><strong>Apprentices and trainees.</strong> Apprentices working towards a recognised qualification on a low wage, and people under 25 on government funded training.</li>
<li><strong>Severe mental impairment.</strong> With a doctor's certificate and a qualifying benefit.</li>
<li><strong>Carers.</strong> Live-in carers providing at least 35 hours a week to someone who is not their partner or their child under 18 and who receives a higher rate disability benefit; and care workers placed by a charity or public body on low pay, living where they work.</li>
<li><strong>People away in care.</strong> Long-term patients in hospital, and residents of care homes and independent hospitals, at the home they have left.</li>
<li><strong>People in detention.</strong> In prison or held under mental health or immigration law, other than for unpaid fines or council tax.</li>
<li><strong>Some residents of hostels and night shelters</strong>, and members of religious communities with no income of their own.</li>
<li><strong>Diplomats, members of visiting forces and some international organisations</strong>, and the non-British spouses or dependants of students who may not work.</li>
</ol>
<p>Under-18s are not on the list because they are not adults for council tax at all: a parent living alone with three children of 10, 14 and 17 is the only adult and gets the discount.</p>

<h2>Counting the adults</h2>
<p>The council takes everyone aged 18 or over who has the home as their main residence, removes the disregarded, and looks at what is left (${h.src('leg_lgfa_discounts', 'section 11 of the 1992 Act')}):</p>
<ul>
<li>two or more adults who count: full bill;</li>
<li>one adult who counts: ${h.pc(P.discounts.singlePerson)} off;</li>
<li>nobody who counts: ${h.pc(P.discounts.allDisregarded)} off, unless everyone is a student or severely mentally impaired, in which case the home is exempt.</li>
</ul>
<p>Three, four or six adults who count pay the same as two. The discount is about who is left once the list has been applied, not about how many people share the home. Household bills in five councils for ${h.P.taxYear}:</p>
${h.table(['Council', 'Band', 'Two or more count', 'One counts', 'Nobody counts'], rows, 'Main home. Scottish figures include water and waste water.', ['l', 'l', 'r', 'r', 'r'])}

<h2>Severe mental impairment</h2>
<p>This is the disregard most often missed. It covers people with a severe impairment of intelligence and social functioning that appears to be permanent, whatever the cause: dementia, a learning disability, a brain injury, a severe stroke, Parkinson's disease in its later stages. Two conditions apply. A registered medical practitioner, usually the GP, signs a certificate, and the person must be entitled to one of a list of benefits, among them Attendance Allowance, the daily living part of Personal Independence Payment, the higher or middle rate care part of Disability Living Allowance, or some elements of Universal Credit or Employment and Support Allowance (${h.src('gov_disabled', 'GOV.UK, discounts for disabled people')}).</p>
<p>The effect is large. A couple where one partner has dementia pays 25 % less. A person with a severe impairment who lives alone, or only with other people who are impaired or students, pays nothing. The disregard can also be backdated to the date the conditions were first met, which in the case of a slow illness can mean several years: councils usually ask the GP for the date the impairment became severe.</p>

<h2>Carers</h2>
<p>Two groups of carers are disregarded. A resident carer who looks after someone at home for at least 35 hours a week, if the person cared for receives a qualifying benefit at the higher rates and is not the carer's partner or child under 18. And a care worker employed or placed by a charity or a local authority, working at least 24 hours a week for low pay and living in the home of the person cared for, or in accommodation provided for the job. A daughter who moves in to look after her widowed father, who receives the higher rate of Attendance Allowance, is disregarded: her father pays 25 % less.</p>
<p>A partner who cares for their partner is never disregarded as a carer, however many hours they give. The household may still qualify through the impairment disregard or the ${h.a('council-tax-disabled-band-reduction', 'Disabled Band Reduction')}.</p>

<h2>People who are away</h2>
<p>A person who has moved permanently into a care home or hospital is disregarded at their old address. If they lived alone, their home becomes empty and, as long as it stays unoccupied, it is exempt; if a partner or relative stays on, the remaining resident gets the discount. A person in prison is disregarded too, unless they are there for not paying council tax or a fine. Someone who is simply away for work, for months at a time, still counts at the home that remains their main residence.</p>
<p>Short stays elsewhere do not change anything either. A resident who spends a few weeks in hospital and comes home, or a grown-up child away on a summer job, keeps counting as before. The disregard is meant for people whose life has moved somewhere else for the long term, such as a permanent place in a care home, or for the groups the law names.</p>

<h2>Telling the council</h2>
<p>The council has no way of knowing that a resident is disregarded. You claim the discount, giving the person's name, date of birth, the group they fall into and the date it started, with evidence: a student certificate, a carer's details and the cared-for person's benefit letter, a GP's certificate, an apprenticeship agreement. When the situation ends, tell the council within 21 days: a student who graduates, an apprentice who finishes the scheme, a teenager who turns 18 and stops receiving child benefit for any reason.</p>
${h.box('Checking a household', '<p>Write down every adult who lives at the address, then strike off those on the list above. If one name is left, claim the 25 %. If none is left, claim the 50 % or, if everyone struck off is a student or severely impaired, the exemption.</p>', 'tip')}

<h2>Wales and Scotland</h2>
<p>The list is essentially the same in all three nations, because it comes from the same 1992 Act. Small differences exist in the detail of the carer and apprentice categories, set by each nation's own orders. In Scotland the discount also applies to the water and waste water charges collected with council tax, so a disregarded resident is worth a little more there.</p>
`;
  },
});
