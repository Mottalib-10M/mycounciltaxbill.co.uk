import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'region-south-east',
  group: 'regions',
  order: 80,
  tool: { kind: 'ct', props: { council: 'reading', band: 3 } },
  related: ['council-tax-brighton-and-hove', 'council-tax-annexes', 'council-tax-bands', 'challenge-council-tax-band'],
  sources: ['mhclg_levels', 'mhclg_release', 'gov_bands'],
  slug: 'south-east-council-tax',
  nav: 'South East',
  card: 'All 64 councils from Kent to Oxfordshire, with Windsor and Maidenhead at the bottom.',
  title: 'South East Council Tax 2026/27: All 64 Councils by Band',
  description: 'South East council tax 2026/27 for 64 councils: Kent, Hampshire, Surrey, Sussex, Oxfordshire and Berkshire, with Bands A, D and H and the change on last year.',
  h1: 'South East council tax 2026/27',
  intro: 'England\'s largest region by number of councils, and the one where the upper bands matter most.',
  resume: (h) => {
    const L = h.E.inRegion('South East'); const s = [...L].sort((a, b) => a.bandD - b.bandD); const lo = s[0], hi = s[s.length - 1];
    const wm = h.P.referendum.exceptions2627.find((e) => e.name === 'Windsor and Maidenhead')!;
    return `The South East has ${L.length} billing authorities for ${h.P.taxYear}, more than any other English region: ${L.filter((c) => c.cls === 'Shire district').length} districts in six two-tier counties and ${L.filter((c) => c.cls !== 'Shire district').length} unitary councils. Band D for two adults runs from ${h.m2(lo.bandD)} in ${lo.name} to ${h.m2(hi.bandD)} in ${hi.name}, with a simple average of ${h.m2(h.E.average(L))}. ${lo.name} remains the cheapest council outside London even though the government allowed it a rise of up to ${h.pc(wm.limit, 1)} on its own share this year. The East Sussex districts sit at the top, because East Sussex County Council's share is among the highest of any county. Homes in the region are spread more evenly across the bands than in the North, and many are in Bands E to H: for them, the bill is well above the Band D figure.`;
  },
  faqs: (h) => [
    { q: 'Why is Windsor and Maidenhead council tax so low?', a: `The council has long kept its own charge low. For ${h.P.taxYear} its Band D is ${h.m2(h.c('windsor-and-maidenhead').bandD)}, including police, fire and parishes, even after a rise of ${h.pc(h.E.change(h.c('windsor-and-maidenhead'))!.rate, 1)} allowed above the normal limit to help with its finances. It is unitary, so there is no county share on top.` },
    { q: 'Which county council takes the most from South East bills?', a: `Among the six two-tier counties, Oxfordshire County Council has the highest Band D share for ${h.P.taxYear}, at ${h.m2(h.c('oxford').parts.county)}, followed by East Sussex at ${h.m2(h.c('lewes').parts.county)}. Hampshire's share is the lowest, at ${h.m2(h.c('winchester').parts.county)}. The district, parish, police and fire shares come on top.` },
    { q: 'Will Surrey council tax change when the county is reorganised?', a: 'The government has approved replacing Surrey County Council and its eleven districts with unitary councils, with new councils planned from 2027. Their council tax levels are still to come and will be set by the new councils. Bills for 2026/27 are still made of a county share and a district share, as the table shows.' },
  ],
  body: (h) => {
    const L = h.E.inRegion('South East');
    const cty = ['Kent', 'Hampshire', 'Surrey', 'West Sussex', 'East Sussex', 'Oxfordshire'].map((n) => { const d = L.filter((c) => c.county === n); return [n, String(d.length), h.m2(d[0].parts.county), h.m2(h.E.average(d))]; });
    const g = h.c('guildford');
    return `
<h2>All ${L.length} councils</h2>
${h.councilTable(L, `Two adults, main home, ${h.P.taxYear}. County, police, fire and average parish precepts included.`)}

<h2>The six counties</h2>
${h.table(['County', 'Districts', 'County share at Band D', 'Average Band D'], cty, `${h.P.taxYear}.`, ['l', 'r', 'r', 'r'])}
<p>Inside a county, the county share is identical, so the differences between districts come from their own charges and their parishes. Districts typically keep only a few hundred pounds of a Band D bill: in ${h.ca('guildford', 'Guildford')}, ${h.m2(g.parts.council)} out of ${h.m2(g.bandD)}.</p>

<h2>Upper bands</h2>
<p>A large share of South East homes were worth more than ${h.P.bands.england.ranges[4].split(' to ')[1]} in 1991, the top of Band E, so Bands F, G and H are common in Surrey, Buckinghamshire and Berkshire. In those bands the bill is thirteen, fifteen or eighteen ninths of Band D. A Band G home in ${h.ca('elmbridge', 'Elmbridge')} pays ${h.m2(h.E.bandCharge(h.c('elmbridge'), 6))} for ${h.P.taxYear}; the same band in ${h.ca('windsor-and-maidenhead', 'Windsor and Maidenhead')} ${h.m2(h.E.bandCharge(h.c('windsor-and-maidenhead'), 6))}. If you think a home is in too high a band, the ${h.a('challenge-council-tax-band', 'challenge guide')} explains the evidence needed.</p>

<h2>Kent and Hampshire: the two largest counties</h2>
<p>Kent has ${L.filter((c) => c.county === 'Kent').length} districts and Hampshire ${L.filter((c) => c.county === 'Hampshire').length}, the two largest numbers in the region. Their county shares are the two lowest of the six counties, so bills in many of their districts sit in the lower half of the table. Medway, inside Kent, and Portsmouth and Southampton, inside Hampshire, are unitary cities with their own single charge but the same police and fire precepts as the county around them. A Band C home in ${h.ca('medway', 'Medway')} pays ${h.m2(h.E.bandCharge(h.c('medway'), 2))}, against ${h.m2(h.E.bandCharge(h.c('maidstone'), 2))} in ${h.ca('maidstone', 'Maidstone')}, a few miles away.</p>

<h2>Sussex</h2>
<p>East Sussex districts head the regional table: ${h.ca('lewes', 'Lewes')} at ${h.m2(h.c('lewes').bandD)} and ${h.ca('wealden', 'Wealden')} at ${h.m2(h.c('wealden').bandD)}. Both have substantial parish precepts as well as the county's high share. West Sussex districts are cheaper by ${h.m(h.E.average(L.filter((c) => c.county === 'East Sussex')) - h.E.average(L.filter((c) => c.county === 'West Sussex')))} at Band D on average, and Brighton and Hove, a unitary city between the two counties, charges ${h.m2(h.c('brighton-and-hove').bandD)}.</p>

<h2>Unitary councils</h2>
<p>The ${L.filter((c) => c.cls !== 'Shire district').length} unitary councils include the Berkshire six, which replaced Berkshire County Council in 1998, the cities of ${h.ca('brighton-and-hove', 'Brighton and Hove')}, ${h.ca('portsmouth', 'Portsmouth')} and ${h.ca('southampton', 'Southampton')}, ${h.ca('medway', 'Medway')}, ${h.ca('milton-keynes', 'Milton Keynes')}, the ${h.ca('isle-of-wight', 'Isle of Wight')} and ${h.ca('buckinghamshire', 'Buckinghamshire')}, unitary since 2020.</p>

<h2>Using the calculator</h2>
<p>The calculator above opens on Reading, Band D. Choose your council, band and household, and read the yearly bill, the monthly instalments and the split between county, district, police and fire. For homes with a self-contained annex, common in the region, see the ${h.a('council-tax-annexes', 'annex guide')}.</p>
`;
  },
});
