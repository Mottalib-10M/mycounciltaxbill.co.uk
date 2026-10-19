import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'wales-council-tax-revaluation',
  group: 'nations',
  order: 20,
  mini: { kind: 'mini:wales-band', props: { council: 'gwynedd', band: 4 } },
  related: ['region-wales', 'council-tax-cardiff', 'council-tax-bands', 'check-council-tax-band'],
  sources: ['wales_act', 'wales_reform', 'wales_statement', 'gov_bands', 'wales_levels', 'voa_check'],
  slug: 'wales-council-tax-revaluation',
  nav: 'Wales revaluation',
  card: 'What the 2024 Act fixes for the 2028 revaluation, what is still open, and today\'s nine bands.',
  title: 'Council Tax Revaluation Wales 2028: What Is Known So Far',
  description: 'Council tax revaluation in Wales from April 2028: what the 2024 Act fixes, the five-year cycle, Band I, and the new bands and values still to be published.',
  h1: 'Council tax revaluation in Wales: the 2028 timetable',
  intro: 'The law now sets the year of the next Welsh revaluation. The new bands, values and ratios are still to come.',
  resume: (h) => {
    const P = h.P; const W = P.bands.wales; const g = h.E.bill({ council: 'gwynedd', band: 4 });
    return `Welsh homes are still banded on what they would have been worth on ${W.valuationDate}, in nine bands from A to I, the last revaluation having taken effect in April 2005. The Local Government Finance (Wales) Act 2024 changes that. Section 20 sets new council tax valuation lists on 1 April in each revaluation year, and makes 2028 the first revaluation year followed by one every five years. Section 17 lets the Welsh Ministers change the bands, their number and their proportions of Band D by an order that the Senedd must approve. What the Act does not say is the new valuation date, how many bands there will be, where their limits will sit or what each will pay: the Welsh Government has said it will consult on those points, and every figure for 2028 is to come. For now a Band E home in Gwynedd with two adults pays ${h.m2(g.annual)} for ${P.taxYear}, at ${W.num[4]}/${W.den} of the Band D charge, and Band I, for homes above ${h.m(W.upper[7]!)} in 2003, pays ${W.num[8]}/${W.den}.`;
  },
  faqs: (h) => {
    const P = h.P; const W = P.bands.wales;
    const mon = h.c('monmouthshire');
    return [
      { q: 'When will council tax revaluation happen in Wales?', a: 'The Local Government Finance (Wales) Act 2024 makes 2028 the first revaluation year, with new valuation lists taking effect on 1 April of that year, and then a revaluation every five years. The Welsh Ministers can change the years by an order approved by the Senedd, so the date is fixed in law but not beyond change.' },
      { q: 'Will my council tax band go up after the Welsh revaluation?', a: 'Nobody can tell yet, because the new bands and the new valuation date have not been published. A home whose value has risen faster than the Welsh average since 2003 is more likely to move up, and one that has risen more slowly is more likely to move down. The total raised is a separate decision, made each year by councils and police.' },
      { q: 'Is Band I only used in Wales?', a: `Yes. England and Scotland have eight bands, A to H. Wales added Band I when it revalued on 2003 values, for homes worth more than ${h.m(W.upper[7]!)} on that date. Band I pays ${W.num[8]}/${W.den} of Band D; in Monmouthshire that means ${h.m2(h.E.bandCharge(mon, 8))} for ${P.taxYear}, against ${h.m2(h.E.bandCharge(mon, 7))} in Band H.` },
      { q: 'Do I need to do anything before the Welsh revaluation?', a: 'No action is required: the Valuation Office Agency will value every home for the new list. You can check that today\'s band is right on the official search, since a wrong band can be challenged now under the current rules. How and when owners will be told their new band is still to come.' },
    ];
  },
  body: (h) => {
    const P = h.P; const W = P.bands.wales; const avg = P.averages.wales.bandD;
    const rows = W.letters.map((l, i) => [`Band ${l}`, W.ranges[i], `${W.num[i]}/${W.den}`, h.m2(avg * W.num[i] / W.den)]);
    const shifts: Array<[string, number, number]> = [['gwynedd', 4, 1], ['swansea', 2, -1], ['monmouthshire', 6, 1], ['conwy', 3, 1], ['rhondda-cynon-taf', 1, -1]];
    const srows = shifts.map(([id, b, d]) => { const c = h.c(id); const a = h.E.bandCharge(c, b), z = h.E.bandCharge(c, b + d);
      return [h.ca(id), `${W.letters[b]} to ${W.letters[b + d]}`, h.m2(a), h.m2(z), `${z >= a ? '+' : '−'}${h.m(Math.abs(z - a))}`]; });
    return `
<h2>The nine bands that apply until the new list</h2>
<p>The Welsh bands still in force were set on values at ${W.valuationDate}, as the ${h.src('gov_bands', 'Valuation Office Agency guidance on band values')} confirms. The last column applies each proportion to the Welsh average Band D of ${h.m2(avg)} for ${P.taxYear}, a figure that includes police and community council precepts.</p>
${h.table(['Band', `Value on ${W.valuationDate}`, 'Share of Band D', 'At the Welsh average'], rows, `${P.taxYear}, two adults, main home.`, ['l', 'l', 'l', 'r'])}
<p>Wales is the only part of Britain that has ever revalued for council tax. England and Scotland still use values from 1991, while Wales moved to 2003 values from April 2005 and added Band I at the top. More than twenty years on, the Welsh Government describes those values as out of date, and the gap between what a home was worth in 2003 and what it is worth now differs widely from one area and one type of property to another.</p>

<h2>What the 2024 Act fixes</h2>
<p>The ${h.src('wales_act', 'Local Government Finance (Wales) Act 2024')} is mostly about business rates, but Part 2 deals with council tax and contains four sections that shape the revaluation:</p>
<ul>
<li><strong>Section 20, the timetable.</strong> It amends the 1992 Act so that new valuation lists for Wales are compiled on 1 April in each revaluation year. The revaluation years are 2028 and every fifth year afterwards. The Welsh Ministers may change a year or the interval by order, but only with a vote of approval in the Senedd.</li>
<li><strong>Section 17, the bands.</strong> It lets the Welsh Ministers substitute new valuation bands, including a different number of bands, change the proportion each band pays, and even change the reference band used in place of D. Any such order also needs a draft approved by the Senedd.</li>
<li><strong>Sections 18 and 19, discounts and reduced amounts.</strong> They give the Welsh Ministers wider powers to set discounts and reductions, which the government can use alongside the revaluation.</li>
</ul>
<p>In short, the Act sets the rhythm and the tools. The content, meaning the actual bands, values and ratios, is left to secondary legislation that has not yet been made.</p>

<h2>How the timetable was chosen</h2>
<p>In a ${h.src('wales_statement', 'written statement of 15 May 2024')}, the Welsh Government reported that its second consultation on fairer council tax had drawn 1,676 responses and that the most supported option, chosen by 35 % of respondents, was a slower timetable with changes starting in 2028. It announced that it would follow that option and add five-yearly revaluations to the bill then before the Senedd, which became section 20 of the Act. The same statement mentioned that a transition fund had been considered, without committing to one.</p>
<p>The government's page on ${h.src('wales_reform', 'how it is reforming council tax')}, updated in February 2025, adds that it will consult in the next Senedd term on the valuation date, the band structure and how bands and charges can be made fairer. That consultation and its results are to come.</p>

<h2>What is known, and what is not</h2>
${h.box('Fixed by law today', `<p>Revaluation year 2028, then every five years. New lists take effect on 1 April. Power to change bands, their number and their ratios by order approved by the Senedd. The ${h.pc(P.discounts.singlePerson)} single adult discount is being kept.</p>`, 'info')}
${h.box('Still to come', `<p>The new valuation date. The number of bands and the value limits of each. The proportion of Band D each band pays. Any transitional relief for homes that move up. Band D charges for 2028/29 and later, which councils will only set in the spring before each year.</p>`, 'warning')}
<p>Two points are worth keeping in mind when you read forecasts. First, a revaluation redistributes the bill between homes; it does not by itself decide how much is raised, because each council and each police and crime commissioner still sets its own Band D charge every year. Second, the number of bands and their ratios can change the outcome as much as the values do: a scale with more bands at the top and a lower ratio at the bottom would shift the burden even for homes whose relative value has not moved.</p>

<h2>Why a five-year cycle matters more than a single revaluation</h2>
<p>The main complaint about council tax across Britain is not one revaluation but the lack of them. Between 1993 and 2005 Welsh bands did not move, and since 2005 they have not moved again, so every year the bands drift further from what homes are worth. A fixed cycle written into the 1992 Act changes the incentive: once revaluation is automatic, the effects of each one should be smaller, because values have only five years to diverge instead of twenty or more. It also means a home bought in 2028 could be revalued in 2033, so the band a buyer sees on the search service will no longer be a permanent feature of the property.</p>
<p>The cycle can still be altered. The Act lets the Welsh Ministers substitute a different year or a different interval, with the approval of the Senedd, so the dates after 2028 depend on future decisions as well as on the law as it stands.</p>

<h2>What one band up or down means at today's rates</h2>
<p>Until the new structure is known, the only honest illustration is a move within today's nine bands, priced at ${P.taxYear} rates. The calculator above does that for any Welsh council; the table shows five examples. These are not forecasts of 2028 bills, which are to come.</p>
${h.table(['Council', 'Band move', 'Today', 'After the move', 'Difference a year'], srows, `Council tax only, two adults, main home, ${P.taxYear} rates. Illustration, not a forecast.`, ['l', 'l', 'r', 'r', 'r'])}
<p>The gaps grow towards the top of the scale because each band is a larger fraction of Band D: moving from G to H adds three ninths, while moving from A to B adds one ninth. That arithmetic will remain true under any new scale that keeps proportional bands, but the fractions themselves may change.</p>

<h2>Band I and the top of the market</h2>
<p>Band I covers homes worth more than ${h.m(W.upper[7]!)} in 2003 and pays ${W.num[8]}/${W.den} of Band D, more than twice Band D. It was created in 2005 to make the top of the scale more progressive, and the 2024 Act now allows the Welsh Ministers to add further bands or to change the ratios again. Whether Band I survives in its current form, or is split, is not decided.</p>

<h2>Discounts, premiums and appeals in the reform</h2>
<p>The revaluation is one part of a wider programme. The Welsh Government is reviewing 53 categories of discounts, disregards, exemptions and premiums, and has already decided to keep the single adult discount. Councils in Wales keep their power to charge premiums of up to ${h.pc(P.premiums.wales.max)} on second homes and long-term empty homes, and the government has said it wants more time before changing that policy. The written statement also announced a simpler appeals process and clearer steps for households in arrears, both set as aims for the end of that Senedd term.</p>

<h2>Checking your band before the change</h2>
<p>A revaluation does not stop you checking the current band. If it looks wrong compared with similar homes nearby, the ${h.src('voa_check', 'official band search')} shows the neighbours' bands, and the page on ${h.a('check-council-tax-band', 'checking a band')} explains how to compare them. The Band D figure of every Welsh council for ${P.taxYear}, from the ${h.src('wales_levels', 'Welsh Government table of council tax levels')}, is ranked on the ${h.a('region-wales', 'Wales council by council page')}, and ${h.ca('cardiff')} has its own page with every band.</p>
`;
  },
});
