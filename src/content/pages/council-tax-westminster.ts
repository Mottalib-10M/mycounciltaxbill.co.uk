import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-westminster',
  group: 'councils',
  order: 140,
  tool: { kind: 'ct', props: { council: 'westminster', band: 6 } },
  related: ['region-london', 'council-tax-wandsworth', 'empty-property-council-tax', 'challenge-council-tax-band'],
  sources: ['mhclg_levels', 'gov_second_empty', 'mhclg_premiums', 'voa_challenge'],
  slug: 'westminster-council-tax',
  nav: 'Westminster',
  card: 'Westminster bands for 2026/27, the Queen\'s Park and Montpelier Square charges, and premiums on second and empty homes.',
  title: 'Westminster Council Tax 2026/27: Bands and Queen\'s Park',
  description: 'Westminster council tax 2026/27 for Bands A to H, the extra precepts in Queen\'s Park and Montpelier Square, and the premiums on second homes and empty flats.',
  h1: 'Westminster council tax 2026/27',
  intro: 'One of the two lowest Band D charges in England, applied to a borough where large and valuable homes are common.',
  resume: (h) => {
    const c = h.c('westminster'); const ch = h.E.change(c)!; const p = c.parts;
    const g = h.E.bill({ council: 'westminster', band: 6 });
    const eng = h.P.averages.england.bandD;
    const r = h.E.rankIn(c, h.E.inNation('england'));
    return `Westminster City Council sets a Band D council tax of ${h.m2(c.bandD)} for ${h.P.taxYear}, up ${h.pc(ch.rate, 1)} on ${h.m2(c.bandDPrev!)}, which places it ${r.of - r.rank + 1 === 2 ? 'second lowest' : `${r.of - r.rank + 1} from the bottom`} of the ${r.of} English billing authorities. Of that sum ${h.m2(p.council)} is the city council's own charge and ${h.m2(p.county)} the Greater London Authority precept. What makes Westminster unusual is the spread of bands: the city has many homes in Bands F, G and H, where the ratios to Band D are thirteen, fifteen and eighteen ninths. A Band G home with two adults pays ${h.m2(g.annual)}, still ${g.annual < eng ? 'less' : 'more'} than an average Band D home in England at ${h.m2(eng)}, and Band H pays ${h.m2(h.E.bandCharge(c, 7))}. Homes in Queen's Park and Montpelier Square pay an extra local precept on top of these figures, and an adult living alone pays ${h.pc(h.P.discounts.singlePerson)} less in every band.`;
  },
  faqs: (h) => {
    const c = h.c('westminster');
    return [
      { q: 'How much extra do Queen\'s Park residents pay?', a: `Queen's Park is the only parish in London, and its council sets a precept collected by Westminster. For ${h.P.taxYear} the city council's own table shows a Queen's Park precept of £52.31 at Band D, for a Band D total of £1,100.16. Other bands pay the same precept scaled by their ratio, so a Band A flat adds £34.87.` },
      { q: 'What is the Montpelier Square charge on a Westminster bill?', a: `Homes in the Montpelier Square area pay a separate precept that the council lists as the MP precept. In ${h.P.taxYear} it is £550.85 at Band D, which takes the Band D total to £1,598.70, more than the Westminster figure of ${h.m2(c.bandD)} used everywhere else. The council's tax base papers count only around a hundred Band D equivalent homes there.` },
      { q: 'Does Westminster charge a premium on empty flats?', a: 'Yes. A flat left empty and unfurnished for more than 12 months pays a 100 % premium, rising to 200 % after five years and 300 % after ten, according to Westminster City Council. Furnished homes that nobody lives in as a main residence have paid a 100 % second home premium since 1 April 2025. Exceptions under the national rules can apply.' },
    ];
  },
  body: (h) => {
    const c = h.c('westminster');
    const peers = ['kensington-and-chelsea', 'camden', 'city-of-london', 'hammersmith-and-fulham', 'wandsworth', 'lambeth'];
    const rows = [c, ...peers.map((id) => h.c(id))].sort((x, y) => x.bandD - y.bandD).map((x) => [x.id === 'westminster' ? '<strong>Westminster</strong>' : h.ca(x.id), h.m2(x.bandD), h.m2(h.E.bandCharge(x, 5)), h.m2(h.E.bandCharge(x, 7)), h.pc(h.E.change(x)!.rate, 1)]);
    const sec = h.E.bill({ council: 'westminster', band: 7, occupancy: 'second' });
    const empty10 = h.E.bill({ council: 'westminster', band: 5, occupancy: 'empty', emptyYears: 10 });
    return `
<h2>Westminster band charges</h2>
${h.bandTable('westminster')}
<p>These are the charges for the unparished city. The figure for each band is Band D multiplied by the fraction set in the ${h.a('council-tax-bands', 'band rules')}, so the gap between bands widens as you go up: Band H pays three times Band A. A couple in a Band H mansion flat therefore pays ${h.m(h.E.bandCharge(c, 7) - h.E.bandCharge(c, 0))} more than a couple in a Band A studio on the same street.</p>

<h2>Queen's Park and Montpelier Square</h2>
<p>Two parts of the city carry a charge that the rest of Westminster does not. Queen's Park is London's only parish, and its council raises a precept that Westminster collects with the city charge. Montpelier Square has a separate precept of its own. The council's ${h.P.taxYear} tables give a Band D total of £1,100.16 in Queen's Park and £1,598.70 in Montpelier Square. The government figure of ${h.m2(c.bandD)} includes these precepts only as an average of ${h.m2(c.parts.parish)} spread across the whole city, so residents of both areas should read the line on their own bill.</p>

<h2>Westminster beside other central London authorities</h2>
<p>Central London has the lowest Band D charges in England, but not all of it. The table ranks Westminster and its neighbours from the cheapest Band D and adds Bands F and H, the bands where much of central London housing sits.</p>
${h.table(['Authority', 'Band D', 'Band F', 'Band H', 'Change on 2025/26'], rows, `${h.P.taxYear}, two adults, main home, from the ${h.src('mhclg_levels', 'MHCLG tables')}. Mayor's precept included.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The ${h.a('region-london', 'London page')} covers every borough. Because a high band costs so much more than a low one, a band that is wrong by one step costs real money here; the ${h.src('voa_challenge', 'GOV.UK challenge service')} and the ${h.a('challenge-council-tax-band', 'challenge guide')} explain when a review can be asked for.</p>

<h2>Second homes and empty flats</h2>
<p>Westminster applies the maximum premiums allowed in England. A furnished flat that is no one's main home pays double the band charge: in Band H that is ${h.m2(sec.annual)} a year instead of ${h.m2(h.E.bandCharge(c, 7))}. A home empty and unfurnished for more than 12 months pays 100 % extra, 200 % after five years and 300 % after ten, so a Band F flat empty for a decade costs ${h.m2(empty10.annual)}. The ${h.src('mhclg_premiums', 'government guidance on premiums')} lists the exceptions, such as homes on the market for up to a year or annexes used as part of the main home, and the ${h.src('gov_second_empty', 'GOV.UK summary')} explains how to tell the council. The ${h.a('empty-property-council-tax', 'empty property page')} goes through the tiers in detail.</p>
<p>A person living alone in Westminster gets ${h.pc(h.P.discounts.singlePerson)} off whatever the band, which in Band G is ${h.m2(h.E.bill({ council: 'westminster', band: 6, household: 'one' }).annual)} for the year.</p>
`;
  },
});
