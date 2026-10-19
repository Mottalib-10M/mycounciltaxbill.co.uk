import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'region-north-west',
  group: 'regions',
  order: 20,
  tool: { kind: 'ct', props: { council: 'wigan', band: 1 } },
  related: ['council-tax-manchester', 'council-tax-liverpool', 'council-tax-single-person-discount', 'council-tax-bands'],
  sources: ['mhclg_levels', 'mhclg_release', 'gov_who_pays'],
  slug: 'north-west-council-tax',
  nav: 'North West',
  card: '35 councils, two mayoral precepts and the Lancashire districts, ranked for 2026/27.',
  title: 'North West Council Tax 2026/27: 35 Councils Ranked by Band',
  description: 'North West council tax 2026/27 for 35 councils: Greater Manchester and Liverpool City Region mayoral precepts, Lancashire districts, Cumbria, and every band.',
  h1: 'North West council tax 2026/27',
  intro: 'From Carlisle to Crewe, a bill made of up to six parts depending on where the boundary runs.',
  resume: (h) => {
    const L = h.E.inRegion('North West'); const s = [...L].sort((a, b) => a.bandD - b.bandD); const lo = s[0], hi = s[s.length - 1];
    return `The ${L.length} billing authorities of the North West charged between ${h.m2(lo.bandD)} at Band D in ${lo.name} and ${h.m2(hi.bandD)} in ${hi.name} for ${h.P.taxYear}, for a home with two adults; the simple average is ${h.m2(h.E.average(L))}. The region has two mayoral combined authorities. In the ten Greater Manchester boroughs the bill includes a mayoral precept of ${h.m2(h.c('manchester').parts.combined)} at Band D, which covers the fire service, while the mayor also sets the police precept as police and crime commissioner. In the six councils of the Liverpool City Region the mayor adds ${h.m2(h.c('liverpool').parts.combined)}. Lancashire's twelve districts pay a large county share on top of their own, and Cumbria, Cheshire and the remaining unitary councils have a single council charge. ${h.ca('trafford', 'Trafford')} and ${h.ca('warrington', 'Warrington')} were allowed rises above the normal limit.`;
  },
  faqs: (h) => [
    { q: 'What is the Greater Manchester mayoral precept for 2026/27?', a: `It is ${h.m2(h.c('manchester').parts.combined)} at Band D for ${h.P.taxYear}, collected on every bill in the ten Greater Manchester boroughs and scaled to the band. It funds the fire and rescue service and other mayoral functions. The police precept, also set by the mayor, is ${h.m2(h.c('manchester').parts.police)} at Band D and appears as a separate line.` },
    { q: 'Why does a Lancashire district bill show three councils?', a: `Because three authorities share it. In ${h.c('pendle').name}, for example, Lancashire County Council takes ${h.m2(h.c('pendle').parts.county)} of the Band D bill, the district ${h.m2(h.c('pendle').parts.council)}, and parish and town councils ${h.m2(h.c('pendle').parts.parish)} on average. Police and fire make up the rest, and the district collects it all.` },
    { q: 'Did Trafford and Warrington raise council tax by more than 5 % this year?', a: `They were allowed to. The government gave both a limit of ${h.pc(h.P.referendum.exceptions2627.find((e) => e.name === 'Trafford')!.limit, 1)} on their own share for ${h.P.taxYear} after they asked for help with their finances. With police, fire and, in Trafford, the mayoral precept added, the total Band D rise was ${h.pc(h.E.change(h.c('trafford'))!.rate, 1)} in Trafford and ${h.pc(h.E.change(h.c('warrington'))!.rate, 1)} in Warrington.` },
  ],
  body: (h) => {
    const L = h.E.inRegion('North West'); const GM = L.filter((c) => c.parts.combined === h.c('manchester').parts.combined); const LCR = L.filter((c) => c.parts.combined === h.c('liverpool').parts.combined);
    const lancs = L.filter((c) => c.county === 'Lancashire');
    return `
<h2>All ${L.length} councils</h2>
${h.councilTable(L, `Two adults, main home, ${h.P.taxYear}. Mayoral, police, fire, county and average parish precepts included.`)}

<h2>Greater Manchester and the Liverpool City Region</h2>
<p>The two city regions account for ${GM.length + LCR.length} of the region's councils. In Greater Manchester the average Band D is ${h.m2(h.E.average(GM))}, in the Liverpool City Region ${h.m2(h.E.average(LCR))}. The mayoral precepts are flat sums, the same in every borough of each area, so ${h.ca('wigan', 'Wigan')} and ${h.ca('manchester', 'Manchester')} pay the same mayoral share at Band D while their own council charges differ by ${h.m(h.c('manchester').parts.council - h.c('wigan').parts.council)}. In the Liverpool City Region, Merseyside's fire authority still sets its own precept.</p>

<h2>Lancashire's two-tier bill</h2>
<p>Lancashire has ${lancs.length} districts under one county council, and their average Band D is ${h.m2(h.E.average(lancs))}. The county's share is the largest part of every bill, while district shares are a few hundred pounds. Parish and town council precepts weigh more than in the cities: in ${h.ca('pendle', 'Pendle')} they average ${h.m2(h.c('pendle').parts.parish)} at Band D, which is why it sits near the top of the table. Blackpool and Blackburn with Darwen are unitary councils with a single council charge.</p>

<h2>Cheshire and Cumbria</h2>
<p>Cheshire East, Cheshire West and Chester, Halton and Warrington are unitary councils. In Cumbria the two unitary councils that replaced the county and its districts in 2023, ${h.ca('cumberland', 'Cumberland')} and ${h.ca('westmorland-and-furness', 'Westmorland and Furness')}, now set the whole council charge. Westmorland and Furness covers the Lake District, where many homes are second homes: the rules on ${h.a('second-home-council-tax', 'second homes')} matter there more than anywhere else in the region.</p>

<h2>Neighbours across a boundary</h2>
<p>Because the mayoral precepts stop at the city region boundary, two homes a mile apart can pay very different bills. ${h.ca('warrington', 'Warrington')} sits between Greater Manchester and Merseyside but belongs to neither, so it pays no mayoral precept; its Band D is ${h.m2(h.c('warrington').bandD)}. ${h.ca('st-helens', 'St Helens')}, next door in the Liverpool City Region, charges ${h.m2(h.c('st-helens').bandD)}, and ${h.ca('wigan', 'Wigan')}, on the Greater Manchester side, ${h.m2(h.c('wigan').bandD)}. If you are choosing between towns, compare the band charge of the actual home, not the reputation of the council.</p>

<h2>Working out a North West bill</h2>
<p>The calculator above opens on Wigan, Band B, the lowest Band D in the region. Pick your council and band and choose who lives in the home. Most homes in the region's towns are in Bands A and B, where bills are two thirds and seven ninths of the Band D figure.</p>
`;
  },
});
