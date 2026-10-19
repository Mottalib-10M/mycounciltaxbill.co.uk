import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';
import type { Council, Nation } from '../../lib/engine/counciltax';

const ranked = (h: Helpers, n: Nation) => h.E.inNation(n).filter((c) => c.bandDPrev).map((c) => ({ c, r: h.E.change(c)!.rate, d: c.bandD - c.bandDPrev! })).sort((a, b) => b.r - a.r);
const row = (h: Helpers, x: { c: Council; r: number; d: number }) => [h.ca(x.c.id, x.c.name), h.m2(x.c.bandDPrev!), h.m2(x.c.bandD), h.pc(x.r, 1), h.m(x.d)];

export default definePage({
  id: 'council-tax-increase-2026',
  group: 'bands',
  order: 50,
  mini: { kind: 'mini:increase', props: { council: 'shropshire', band: 2 } },
  related: ['council-tax-bands', 'council-tax-monthly-payments', 'region-west-midlands', 'region-scotland'],
  sources: ['mhclg_release', 'mhclg_levels', 'wales_levels', 'scot_datasets'],
  slug: 'council-tax-increase-2026',
  nav: 'The 2026/27 increase',
  card: 'How much bills rose in April 2026, the limits, the councils allowed more, and your own rise.',
  title: 'Council Tax Increase 2026/27: Rises by Council and Limits',
  description: 'Council tax increase 2026/27: average rises in England, Wales and Scotland, the 4.99 % limit, councils allowed up to 9 %, and the largest and smallest rises.',
  h1: 'How much council tax rose in April 2026',
  intro: 'An average of almost five per cent in England, but anything from under three to over nine depending on where you live.',
  resume: (h) => {
    const A = h.P.averages; const en = ranked(h, 'england'), sc = ranked(h, 'scotland'), wa = ranked(h, 'wales');
    return `Council tax rose by an average of ${h.pc(A.england.change, 2)} in England for ${h.P.taxYear}, taking the average Band D bill to ${h.m2(A.england.bandD)}, an increase of ${h.m2(A.england.bandD - A.england.bandDPrev)} on ${h.m2(A.england.bandDPrev)}. English councils with social care duties could raise their own share by up to ${h.pc(h.P.referendum.england.total, 2)} without holding a local referendum, and seven were allowed more, up to ${h.pc(h.P.referendum.exceptions2627[0].limit)} in ${h.P.referendum.exceptions2627[0].name} and ${h.P.referendum.exceptions2627[1].name}. Across all ${en.length} English billing authorities the total rise ran from ${h.pc(en[en.length - 1].r, 1)} in ${en[en.length - 1].c.name} to ${h.pc(en[0].r, 1)} in ${en[0].c.name}. In Wales the average Band D went up ${h.pc(A.wales.change, 1)} to ${h.m2(A.wales.bandD)}, with rises from ${h.pc(wa[wa.length - 1].r, 1)} to ${h.pc(wa[0].r, 1)}. Scottish councils raised theirs by ${h.pc(sc[sc.length - 1].r, 1)} to ${h.pc(sc[0].r, 1)}, with water charges rising on top. These are Band D figures for a home with two adults; a home in a lower band sees a smaller rise in pounds, by the same percentage.`;
  },
  faqs: (h) => [
    { q: 'Why did my council tax go up more than 4.99 %?', a: 'The 4.99 % limit applies to the council\'s own share. Police and fire authorities set separate increases, capped in pounds rather than per cent, and parish councils have no limit at all. When the police precept rises by the full cash amount, a bill can rise faster in percentage terms than the council\'s own charge.' },
    { q: 'Can a council raise council tax without a referendum?', a: `In England a council must hold a local referendum if it wants to go above the limit set each year by Parliament, unless the government grants it a higher limit. For ${h.P.taxYear}, ${h.P.referendum.exceptions2627.length} councils received such a limit after asking for help with their finances. The councils on that list still had to set their rise themselves, within that higher ceiling.` },
    { q: 'Will council tax go up again in April 2027?', a: 'Almost certainly, but the 2027/28 figures are still to come. Each council sets its Band D charge in February and March, and the limits for England are confirmed in the local government finance settlement in the winter before. This site will be updated with the 2027/28 tables once they are published.' },
  ],
  body: (h) => {
    const R = h.P.referendum.england; const en = ranked(h, 'england'), sc = ranked(h, 'scotland'), wa = ranked(h, 'wales');
    const top = en.slice(0, 8).map((x) => row(h, x)), low = en.slice(-6).reverse().map((x) => row(h, x));
    const scRows = [...sc.slice(0, 4), ...sc.slice(-3)].map((x) => row(h, x));
    const ex = h.P.referendum.exceptions2627.map((e) => [e.name, h.pc(e.limit, 2)]);
    const shrop = h.c('shropshire'), shB = h.E.bandCharge(shrop, 2) - shrop.bandDPrev! * 8 / 9;
    const avgCash = en.reduce((s, x) => s + x.d, 0) / en.length;
    return `
<h2>The limits in England</h2>
<p>Each year Parliament approves the rise above which an English authority must hold a referendum. For ${h.P.taxYear} the limits were (${h.src('mhclg_release', 'MHCLG statistical release')}):</p>
<ul>
<li>${h.pc(R.core, 2)} on the core charge of county councils, unitary authorities, London boroughs and metropolitan districts, plus ${h.pc(R.asc)} for the adult social care precept, ${h.pc(R.total, 2)} in all;</li>
<li>the higher of ${h.pc(R.core, 2)} or £${R.districtCash} a year at Band D for shire districts;</li>
<li>£${R.policeCash} at Band D for police and crime commissioners, and £${R.fireCash} for fire authorities;</li>
<li>no limit for town and parish councils.</li>
</ul>
<p>The police figure is why many bills rose by more than the council's own percentage: an extra £${R.policeCash} on a police precept such as West Midlands' ${h.m2(h.c('birmingham').parts.police)} is a rise of ${h.pc(R.policeCash / (h.c('birmingham').parts.police - R.policeCash), 1)} on that part alone.</p>

<h2>The councils allowed more</h2>
<p>A council in severe financial difficulty can ask the government for a higher limit, usually alongside exceptional financial support. For ${h.P.taxYear} these limits were granted:</p>
${h.table(['Council', 'Limit on its own share'], ex, 'Core charge plus adult social care precept.', ['l', 'r'])}
<p>Their bills show it. In ${h.ca('shropshire', 'Shropshire')} a Band C home pays ${h.m(shB)} more than last year. Worcestershire is a county council, so its higher rise reaches every district below it: Worcester, Wychavon and Wyre Forest are all near the top of the English table.</p>

<h2>The largest rises in England</h2>
${h.table(['Council', 'Band D 2025/26', 'Band D 2026/27', 'Change', 'In pounds'], top, 'Total Band D including county, police, fire and average parish precepts.', ['l', 'r', 'r', 'r', 'r'])}

<h2>The smallest rises in England</h2>
${h.table(['Council', 'Band D 2025/26', 'Band D 2026/27', 'Change', 'In pounds'], low, undefined, ['l', 'r', 'r', 'r', 'r'])}
<p>The average rise in pounds across English councils was ${h.m(avgCash)} at Band D, less for most homes since most are in lower bands. The calculator above gives the rise for any council and band.</p>

<h2>Region by region</h2>
<p>${h.E.ENGLISH_REGIONS.map((r) => { const L = h.E.inRegion(r).filter((c) => c.bandDPrev); const now = h.E.average(L); const prev = L.reduce((s, c) => s + c.bandDPrev!, 0) / L.length; return `${r}: ${h.pc(now / prev - 1, 1)}`; }).join('; ')}. These are simple averages of the councils in each region, not weighted by the number of homes, so they differ slightly from the official regional averages. The regional pages, such as ${h.a('region-west-midlands', 'the West Midlands')} and ${h.a('region-south-west', 'the South West')}, list every council with its rise.</p>

<h2>Who decided each part of the rise</h2>
<p>A bill in a two-tier area of England is the sum of decisions by up to five bodies. The county council sets its share, including the social care precept. The district council sets a much smaller share and collects the whole bill. The police and crime commissioner, or in some areas a mayor, sets the police precept; a fire authority sets its own in most counties. A town or parish council adds a precept with no limit. In unitary and metropolitan areas the first two are a single council. In Greater Manchester the mayor sets the police and fire precepts, and in West Yorkshire and a few other areas the mayor sets the police precept.</p>
<p>That is why two neighbouring councils can show very different rises in the same county: their district shares moved differently, or one has parishes that raised their precepts sharply. The breakdown is printed on the back of your annual bill, or in the leaflet sent with it.</p>

<h2>One bill, five decisions</h2>
<p>${h.ca('wychavon', 'Wychavon')}, a district in Worcestershire, shows how the parts add up. Its Band D bill of ${h.m2(h.c('wychavon').bandD)} is made of ${h.m2(h.c('wychavon').parts.county)} for Worcestershire County Council, ${h.m2(h.c('wychavon').parts.police)} for the West Mercia police and crime commissioner, ${h.m2(h.c('wychavon').parts.fire)} for Hereford and Worcester fire authority, ${h.m2(h.c('wychavon').parts.council)} for the district itself and an average of ${h.m2(h.c('wychavon').parts.parish)} for its ${h.c('wychavon').parishes} parishes. The county's share is three quarters of the bill, so the county's higher limit drives the whole rise of ${h.pc(h.E.change(h.c('wychavon'))!.rate, 1)}, while the district that sends the bill keeps a small part of it.</p>
<p>This is the usual picture in two-tier England: the council whose name is on the bill keeps a small slice of it, often less than the police precept on the same bill. A complaint about the rise is best sent to the county council, which made most of it.</p>

<h2>When the new charge starts</h2>
<p>The ${h.P.taxYear} charges apply from 1 April 2026. Bills are sent in March, and the first instalment of the year is usually due in April. If you pay by Direct Debit the new amount is taken automatically; if you pay by standing order you must change the amount yourself, which is a common reason for arrears in the first months of the year.</p>

<h2>The rise for your band</h2>
<p>Percentages are the same in every band of a council, but pounds are not. At the English average, the ${h.m(h.P.averages.england.bandD - h.P.averages.england.bandDPrev)} rise at Band D becomes ${h.m((h.P.averages.england.bandD - h.P.averages.england.bandDPrev) * 6 / 9)} in Band A and ${h.m((h.P.averages.england.bandD - h.P.averages.england.bandDPrev) * 2)} in Band H. A single adult pays a quarter less of each, and a household that receives Council Tax Reduction may see little or none of the increase, depending on the council's scheme. The calculator above gives the exact figure for one council and band; the ${h.a('home', 'full calculator')} adds who lives in the home.</p>

<h2>Wales</h2>
<p>Welsh councils have no referendum limit: each one sets its own rise, and the Welsh Government can cap an excessive one. For ${h.P.taxYear} the average Band D across Wales, including police and community councils, rose by ${h.pc(h.P.averages.wales.change, 1)} to ${h.m2(h.P.averages.wales.bandD)} (${h.src('wales_levels', 'Welsh Government, council tax levels')}). The highest rise was ${h.pc(wa[0].r, 1)} in ${wa[0].c.name} and the lowest ${h.pc(wa[wa.length - 1].r, 1)} in ${wa[wa.length - 1].c.name}. The ${h.a('region-wales', 'Welsh table')} lists all 22 councils.</p>

<h2>Scotland</h2>
<p>Scottish councils set their own rises each year, with no referendum limit. For ${h.P.taxYear} the rises differ widely between councils (${h.src('scot_datasets', 'Scottish Government, council tax datasets')}):</p>
${h.table(['Council', 'Band D 2025/26', 'Band D 2026/27', 'Change', 'In pounds'], scRows, 'The four largest and three smallest rises. Water and waste water charges excluded; they rose separately.', ['l', 'r', 'r', 'r', 'r'])}
<p>On top of council tax, Scottish Water's charges went up ${h.pc(h.P.scottishWater.increase, 2)} for every band, so a Scottish bill rose by more than the council tax figure alone. All 32 councils are in the ${h.a('region-scotland', 'Scottish table')}.</p>

<h2>Why bills keep rising</h2>
<p>Councils say most of the increase goes to adult and children's social care, which take the largest share of upper tier councils' budgets, and to temporary accommodation for homeless households in many cities. Police and fire precepts follow their own cash limits. A few councils chose to stay well below the limit: ${en.slice(-3).map((x) => x.c.name).join(', ')} had the smallest total rises in England.</p>

<h2>What you can do about a rise</h2>
<p>You cannot refuse an increase, but you can make sure the bill is right for your home. Check that every discount you are entitled to is applied: a ${h.a('council-tax-single-person-discount', 'single person discount')}, a ${h.a('council-tax-disregards', 'disregarded adult')} or a ${h.a('council-tax-disabled-band-reduction', 'Disabled Band Reduction')}. Check your band against identical homes on your street with the ${h.a('check-council-tax-band', 'band search')}. And if the rise is hard to meet, ask for 12 instalments instead of 10, which the ${h.a('council-tax-monthly-payments', 'payments page')} explains, or apply for Council Tax Reduction.</p>
`;
  },
});
