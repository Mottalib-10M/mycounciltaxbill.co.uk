import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-brighton-and-hove',
  group: 'councils',
  order: 150,
  tool: { kind: 'ct', props: { council: 'brighton-and-hove', band: 2 } },
  related: ['region-south-east', 'council-tax-students', 'second-home-council-tax', 'council-tax-disregards'],
  sources: ['mhclg_levels', 'gov_students', 'gov_who_pays', 'gov_second_empty'],
  slug: 'brighton-council-tax',
  nav: 'Brighton and Hove',
  card: 'Brighton and Hove bands for 2026/27, student households, Rottingdean and the garden enclosures, and the second home premium.',
  title: 'Brighton and Hove Council Tax 2026/27: Bands and Students',
  description: 'Brighton and Hove council tax 2026/27 for Bands A to H, what student houses pay, the Rottingdean parish and enclosure charges, and premiums on second homes.',
  h1: 'Brighton and Hove council tax 2026/27',
  intro: 'A unitary city by the sea with a large student population, one parish and several garden squares that set their own charge.',
  resume: (h) => {
    const c = h.c('brighton-and-hove'); const ch = h.E.change(c)!; const p = c.parts;
    const b = h.E.bill({ council: 'brighton-and-hove', band: 2 });
    const r = h.E.rankIn(c, h.E.inRegion('South East'));
    return `For ${h.P.taxYear}, Brighton and Hove City Council charges ${h.m2(c.bandD)} at Band D for a household of two adults, which is ${h.m(ch.amount)} more than the ${h.m2(c.bandDPrev!)} of last year, an increase of ${h.pc(ch.rate, 1)}. Because the city is a unitary authority there is no separate county council: the bill combines the city charge of ${h.m2(p.council)}, which includes ${h.m2(p.asc!)} for adult social care, with ${h.m2(p.police)} for policing and ${h.m2(p.fire)} for fire and rescue. A Band C home, the setting used by the calculator, pays ${h.m2(b.annual)} a year, about ${h.m2(b.perMonth12)} a month over twelve instalments. Among the ${r.of} councils of the South East, Brighton and Hove ranks ${r.rank} from the dearest at Band D. A house shared only by full-time students pays nothing, and one where a single working adult lives with students gets ${h.pc(h.P.discounts.singlePerson)} off.`;
  },
  faqs: (h) => {
    const c = h.c('brighton-and-hove');
    const one = h.E.bill({ council: 'brighton-and-hove', band: 2, household: 'one' });
    return [
      { q: 'Who pays council tax in a Brighton house shared by students and one worker?', a: `The adult who is not a full-time student is liable for the whole bill, but the students are disregarded, so that person is treated as living alone and gets ${h.pc(h.P.discounts.singlePerson)} off. In Band C that brings the charge from ${h.m2(h.E.bandCharge(c, 2))} to ${h.m2(one.annual)}. With two or more non-students, the full charge applies.` },
      { q: 'Why do Hanover Crescent and Royal Crescent have different council tax charges?', a: 'Brighton and Hove City Council treats Hanover Crescent, Marine Square and Royal Crescent as enclosures and publishes a separate set of band charges for each, alongside Rottingdean Parish, which has its own parish precept. Homes there pay slightly more than the rest of the city. The council\'s page of charges for the year gives the exact figure for every band.' },
      { q: 'When did Brighton and Hove start charging double on second homes?', a: 'From 1 April 2025. The council approved the premium on 1 February 2024, giving the year of notice the law requires, and it now adds 100 % to the bill of a furnished home that nobody lives in as a main home, including furnished lets between tenants. The extra is payable from the day the home becomes empty.' },
    ];
  },
  body: (h) => {
    const c = h.c('brighton-and-hove');
    const near = ['adur', 'worthing', 'mid-sussex', 'lewes', 'wealden', 'eastbourne'];
    const rows = [c, ...near.map((id) => h.c(id))].map((x) => [x.id === c.id ? '<strong>Brighton and Hove</strong>' : h.ca(x.id), x.cls, h.m2(h.E.bandCharge(x, 2)), h.m2(x.bandD), h.pc(h.E.change(x)!.rate, 1)]);
    const avg = h.E.average(h.E.inRegion('South East'));
    const lt = h.E.bill({ council: 'brighton-and-hove', band: 1, occupancy: 'empty', emptyYears: 5 });
    return `
<h2>Bands A to H in the city</h2>
${h.bandTable('brighton-and-hove')}
<p>The figures apply across the city except in Rottingdean and the three garden enclosures, where the council adds a small local charge. The council lists the enclosures as Hanover Crescent, Marine Square and Royal Crescent and publishes a separate table of charges for each of them, so a household there should check its own bill rather than this table. The parish average of ${h.m2(c.parts.parish)} in the Band D figure above is Rottingdean's precept spread over the whole city.</p>

<h2>Student houses and mixed households</h2>
<p>Brighton has a large student population, much of it in shared rented houses. The council applies the ${h.src('gov_students', 'national student rules')}: a course of at least one academic year and 21 hours of study a week counts as full time, and for people under 20 on A level courses the threshold is three months and 12 hours. A house where everyone qualifies is exempt during course dates, but tax is due again in any gap between courses. When one adult is not a student, that adult pays with the single person reduction, because ${h.src('gov_who_pays', 'students are disregarded')} when the council counts adults. The city asks for registration numbers or certificates from each student and checks the course dates with the place of study. More detail is in the ${h.a('council-tax-students', 'students guide')} and the ${h.a('council-tax-disregards', 'disregards guide')}.</p>

<h2>Brighton and Hove against the Sussex districts</h2>
<p>To the east and west of the city, bills are split between a district or borough, a county council, the police and fire. The total still ends up close to the city figure, as the table shows on Band C and Band D.</p>
${h.table(['Council', 'Type', 'Band C', 'Band D', 'Change on 2025/26'], rows, `${h.P.taxYear}, two adults, main home, from the ${h.src('mhclg_levels', 'MHCLG council tax tables')}.`, ['l', 'l', 'r', 'r', 'r'])}
<p>The South East average Band D is ${h.m2(avg)}, so the city charge is ${h.m(Math.abs(c.bandD - avg))} ${c.bandD > avg ? 'above' : 'below'} it. The ${h.a('region-south-east', 'South East page')} lists every council in the region.</p>

<h2>Second homes, holiday flats and empty homes</h2>
<p>Since 1 April 2025 a furnished property that is nobody's main home, whether a weekend flat or a furnished let between tenants, pays a 100 % premium from the first day it is empty. Unfurnished homes empty for over a year pay 100 % extra, rising to 200 % after five years and 300 % after ten. A Band B house empty for five years therefore costs ${h.m2(lt.annual)} instead of ${h.m2(h.E.bandCharge(c, 1))}. The ${h.src('gov_second_empty', 'GOV.UK page')} and the ${h.a('second-home-council-tax', 'second home guide')} explain the exceptions, such as homes on the market for sale or let.</p>
`;
  },
});
