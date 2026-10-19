import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'region-south-west',
  group: 'regions',
  order: 90,
  tool: { kind: 'ct', props: { council: 'plymouth', band: 1 } },
  related: ['council-tax-bristol', 'council-tax-cornwall', 'council-tax-wiltshire', 'second-home-council-tax'],
  sources: ['mhclg_levels', 'mhclg_release', 'gov_second_empty'],
  slug: 'south-west-council-tax',
  nav: 'South West',
  card: '27 councils from the Isles of Scilly to Gloucestershire, with England\'s highest Band D in Dorset.',
  title: 'South West Council Tax 2026/27: 27 Councils and Every Band',
  description: 'South West council tax 2026/27 for 27 councils, Isles of Scilly to Dorset: Bands A, D and H, the higher rises in BCP and North Somerset, and second homes.',
  h1: 'South West council tax 2026/27',
  intro: 'The highest Band D in England, one of the lowest, and a coast full of second homes.',
  resume: (h) => {
    const L = h.E.inRegion('South West'); const s = [...L].sort((a, b) => a.bandD - b.bandD); const lo = s[0], hi = s[s.length - 1];
    const ns = h.P.referendum.exceptions2627.find((e) => e.name === 'North Somerset')!, bcp = h.P.referendum.exceptions2627.find((e) => e.name.startsWith('Bournemouth'))!;
    return `The South West has ${L.length} billing authorities for ${h.P.taxYear}: ${L.filter((c) => c.cls !== 'Shire district').length} unitary councils and ${L.filter((c) => c.cls === 'Shire district').length} districts in Devon and Gloucestershire. Band D for two adults runs from ${h.m2(lo.bandD)} on the ${lo.name} to ${h.m2(hi.bandD)} in ${hi.name}, the highest of any billing authority in England; the simple average is ${h.m2(h.E.average(L))}. Two councils in the region were allowed to go above the usual limit this year: ${ns.name}, by up to ${h.pc(ns.limit)}, and Bournemouth, Christchurch and Poole, by up to ${h.pc(bcp.limit, 2)}. Large parish and town council precepts weigh on rural bills, and the region's many holiday homes mean the premiums on second homes, now charged by many of its councils, affect far more households here than in most of England. Five police forces cover the region, from Devon and Cornwall to Gloucestershire, each with its own precept.`;
  },
  faqs: (h) => [
    { q: 'Why does Dorset have the highest council tax in England?', a: `Dorset Council is a large rural unitary council with ${h.c('dorset').parishes} parish and town councils, whose precepts average ${h.m2(h.c('dorset').parts.parish)} at Band D. Its own charge, Dorset police and the fire authority come on top, for a total of ${h.m2(h.c('dorset').bandD)} in ${h.P.taxYear}. Most of its homes are not in Band D, so most bills are lower.` },
    { q: 'How much did council tax rise in North Somerset this year?', a: `North Somerset was allowed up to ${h.pc(h.P.referendum.exceptions2627.find((e) => e.name === 'North Somerset')!.limit)} on its own share. Including police, fire and parishes, the total Band D rose by ${h.pc(h.E.change(h.c('north-somerset'))!.rate, 1)} to ${h.m2(h.c('north-somerset').bandD)}, one of the largest rises in England for ${h.P.taxYear}. A Band C home there pays ${h.m2(h.E.bandCharge(h.c('north-somerset'), 2))} this year.` },
    { q: 'Is council tax lower on the Isles of Scilly?', a: `Yes. The Council of the Isles of Scilly charges ${h.m2(h.c('isles-of-scilly').bandD)} at Band D for ${h.P.taxYear}, the lowest in the region and among the lowest in England outside London. It runs its own fire service, so there is no separate fire precept, and it shares Devon and Cornwall Police with the mainland.` },
  ],
  body: (h) => {
    const L = h.E.inRegion('South West');
    const devon = L.filter((c) => c.county === 'Devon'), glos = L.filter((c) => c.county === 'Gloucestershire');
    const bcp = h.c('bournemouth-christchurch-and-poole');
    return `
<h2>All ${L.length} councils</h2>
${h.councilTable(L, `Two adults, main home, ${h.P.taxYear}. County, police, fire and average parish precepts included.`)}

<h2>Devon and Gloucestershire</h2>
<p>Only two counties in the region keep two tiers. Devon's ${devon.length} districts average ${h.m2(h.E.average(devon))} at Band D, with Devon County Council taking ${h.m2(devon[0].parts.county)} of each. Gloucestershire's ${glos.length} districts average ${h.m2(h.E.average(glos))}, with a county share of ${h.m2(glos[0].parts.county)}. Everywhere else a unitary council sends the bill, including ${h.ca('somerset', 'Somerset')}, unitary since 2023, and ${h.ca('cornwall', 'Cornwall')}, ${h.ca('wiltshire', 'Wiltshire')} and ${h.ca('dorset', 'Dorset')}.</p>

<h2>Bournemouth, Christchurch and Poole</h2>
<p>${h.ca('bournemouth-christchurch-and-poole', 'BCP Council')} charges ${h.m2(bcp.bandD)} at Band D, a rise of ${h.pc(h.E.change(bcp)!.rate, 1)}, after the government allowed it a higher limit. It shares Dorset police and Dorset and Wiltshire fire with its neighbour Dorset Council, yet its Band D is lower by ${h.m(h.c('dorset').bandD - bcp.bandD)}, mainly because of the two councils' own charges, with Dorset's larger parish precepts adding to the gap.</p>

<h2>Second homes and holiday lets</h2>
<p>Cornwall, Devon's coastal districts, Dorset and the Isles of Scilly have many second homes. Since April 2025 English councils may charge a second home premium of up to ${h.pc(h.P.premiums.england.secondHomeMax)}, and Cornwall charges the full amount. A Band D second home in Cornwall now pays ${h.m2(h.E.bill({ council: 'cornwall', band: 3, occupancy: 'second', premium: h.P.localPremiums.cornwall.second }).annual)}. Holiday lets that are available for 140 days a year and let for 70 pay business rates instead. The ${h.a('second-home-council-tax', 'second homes guide')} has the exceptions.</p>

<h2>Parishes and towns</h2>
<p>Almost every rural home in the region is in a parish, and town councils in places such as Bridport, St Ives or Cirencester can run markets, public toilets, parks and events, all paid for by their precept. That is why the average parish precept here is higher than in the North or the Midlands. In ${h.ca('dorset', 'Dorset')} the average is ${h.m2(h.c('dorset').parts.parish)} at Band D, in ${h.ca('cornwall', 'Cornwall')} ${h.m2(h.c('cornwall').parts.parish)}, in ${h.ca('north-somerset', 'North Somerset')} ${h.m2(h.c('north-somerset').parts.parish)}. Your own parish can be well above or below the average: your bill names it.</p>

<h2>Gloucestershire and Wiltshire</h2>
<p>The north of the region is cheaper. The six Gloucestershire districts are among the lowest in the region, with ${h.ca('tewkesbury', 'Tewkesbury')} at ${h.m2(h.c('tewkesbury').bandD)}, the second lowest after the Isles of Scilly. ${h.ca('south-gloucestershire', 'South Gloucestershire')} and ${h.ca('swindon', 'Swindon')} are unitary councils on the edge of Bristol and the M4.</p>

<h2>Cities</h2>
<p>${h.ca('bristol', 'Bristol')}, ${h.ca('plymouth', 'Plymouth')}, ${h.ca('swindon', 'Swindon')} and ${h.ca('bath-and-north-east-somerset', 'Bath and North East Somerset')} are unitary. Bristol charges ${h.m2(h.c('bristol').bandD)} at Band D, Plymouth ${h.m2(h.c('plymouth').bandD)}. Plymouth's homes are mostly in Bands A to C; the calculator above opens on Band B there.</p>
`;
  },
});
