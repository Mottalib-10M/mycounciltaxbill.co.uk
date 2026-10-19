import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-annexes',
  group: 'discounts',
  order: 50,
  mini: { kind: 'mini:annex', props: { council: 'east-devon', band: 0, use: 0 } },
  related: ['council-tax-disabled-band-reduction', 'council-tax-disregards', 'second-home-council-tax', 'council-tax-bands'],
  sources: ['leg_annex', 'leg_exempt', 'gov_second_empty', 'mhclg_premiums'],
  slug: 'council-tax-annexes',
  nav: 'Annexes and granny flats',
  card: 'When an annex is exempt, when it pays half, and when it pays in full.',
  title: 'Council Tax on Annexes 2026/27: Exempt, Half or Full Charge',
  description: 'Council tax on an annex or granny flat in 2026/27: exemption for a dependent relative, the 50 % reduction for family use in England, letting it out, premiums.',
  h1: 'Council tax on an annex',
  intro: 'A self-contained annex usually has its own band and its own bill. Who lives in it decides what that bill is.',
  resume: (h) => {
    const full = h.E.bill({ council: 'east-devon', band: 0 }).annual;
    return `A self-contained annex, such as a granny flat over the garage or a converted outbuilding with its own kitchen and bathroom, is normally a separate dwelling for council tax, with its own band. What it pays depends on who uses it. An annex that is the home of a dependent relative of the main household, aged 65 or over or severely mentally impaired or substantially and permanently disabled, is exempt under Class W. In England, an annex lived in by any other relative of the person who pays for the main house, or used as part of the main home, gets a ${h.pc(h.P.discounts.annexFamily)} reduction under regulations in force since 1 April 2014. An annex let to someone outside the family pays the full charge. In East Devon a Band A annex costs ${h.m2(full)} for ${h.P.taxYear}, ${h.m2(full * (1 - h.P.discounts.annexFamily))} with the family reduction, and nothing when it is exempt.`;
  },
  faqs: (h) => [
    { q: 'Does my adult son living in our annex pay council tax?', a: `In England the annex gets a ${h.pc(h.P.discounts.annexFamily)} reduction because he is a relative of the person who pays for the main house. If he lives there alone he may also get the 25 % single person discount, and the two reductions combine. If he were 65 or over, or disabled, the annex would be exempt.` },
    { q: 'Is an annex with no kitchen a separate dwelling for council tax?', a: 'Usually not. The Valuation Office looks at whether the annex is self-contained, with its own facilities for living, and how it is used. A bedroom and shower room above the garage, sharing the family kitchen, is normally part of the main house and has no band of its own. Ask the Valuation Office if your annex has been banded separately in error.' },
    { q: 'Do I pay a second home premium on an empty annex?', a: 'No, in England an annex that forms part of a main home, or is used as part of it, is excepted from the second homes and empty homes premiums. It may also be exempt while empty if it cannot be let separately under planning rules, under Class T. Check how your council has classed it.' },
  ],
  body: (h) => {
    const ids = ['east-devon', 'wiltshire', 'cotswold', 'north-norfolk', 'harrogate'];
    const rows = ids.filter((id) => { try { h.c(id); return true; } catch { return false; } }).map((id) => { const c = h.c(id); const f = h.E.bandCharge(c, 0); return [h.ca(id), h.m2(f), h.m2(f * (1 - h.P.discounts.annexFamily)), h.m2(f * (1 - h.P.discounts.annexFamily) * (1 - h.P.discounts.singlePerson))]; });
    return `
<h2>Is the annex a separate dwelling?</h2>
<p>An annex has its own band when it is self-contained: a separate entrance or a lockable door, its own kitchen and bathroom, enough to live independently. A spare room with an en suite, or a garden studio without a kitchen, is part of the main house and is covered by its band. You can see whether an annex is listed separately by searching the address on the ${h.a('check-council-tax-band', 'band search service')}: a banded annex appears as its own entry next to the main house.</p>
<p>Most annexes are in Band A or B, because they are small. The bill is then a fraction of the main house's.</p>

<h2>Four ways an annex is used</h2>
<p><strong>1. A dependent relative lives there: exempt.</strong> Class W of the Council Tax (Exempt Dwellings) Order 1992 exempts an annex that is the main home of a relative of someone living in the main house, if that relative is aged 65 or over, or severely mentally impaired, or substantially and permanently disabled (${h.src('leg_exempt', 'Council Tax (Exempt Dwellings) Order 1992')}). Nothing is due on the annex at all, and there is no time limit.</p>
<p><strong>2. Another relative lives there: half in England.</strong> If the person in the annex is a relative of the person liable for the main house, but not a dependent relative, the annex gets a ${h.pc(h.P.discounts.annexFamily)} reduction under the Council Tax (Reductions for Annexes) (England) Regulations 2013 (${h.src('leg_annex', 'SI 2013/2977')}). Relative is read widely: partners, children and stepchildren, grandchildren, parents, siblings, uncles, aunts, nephews and nieces, and in-laws.</p>
<p><strong>3. The main household uses it: half in England.</strong> An annex used by the people in the main house as part of their own home, as a guest suite or a teenager's den, also gets the ${h.pc(h.P.discounts.annexFamily)} reduction, even when nobody sleeps there.</p>
<p><strong>4. It is let to someone else: full charge.</strong> A tenant who is not a relative pays the full band charge on the annex, less any discount of their own, such as the single person discount.</p>

<h2>Discounts on top</h2>
<p>The ${h.pc(h.P.discounts.annexFamily)} annex reduction is worked out after any other discount, so a relative who lives alone in the annex gets both: first 25 % off, then half of what is left. Band A annexes in five councils with many of them, ${h.P.taxYear}:</p>
${h.table(['Council', 'Band A, full', 'Relative living there', 'Relative living alone'], rows, 'England. Annex as a separate dwelling with its own band.', ['l', 'r', 'r', 'r'])}
<p>The calculator above gives the figure for any council, band and use.</p>

<h2>Empty annexes</h2>
<p>An annex that stands empty can be exempt under Class T if planning conditions prevent it from being let separately from the main house. Otherwise, an empty annex in England that is used as part of the main home gets the 50 % reduction. The premiums on ${h.a('second-home-council-tax', 'second homes')} and ${h.a('empty-property-council-tax', 'empty homes')} do not apply to an annex that forms part of, or is treated as part of, the main dwelling (${h.src('gov_second_empty', 'GOV.UK, second homes and empty properties')}, ${h.src('mhclg_premiums', 'MHCLG guidance on premiums')}).</p>

<h2>Common cases</h2>
<p><strong>Parents move into the annex in their seventies.</strong> If they are 65 or over and relatives of someone in the main house, the annex is exempt. Their move does not change the main house's bill, unless the main house now has only one adult who counts.</p>
<p><strong>A grown-up daughter and her partner live in the annex.</strong> In England the annex pays half because the daughter is a relative. The annex is still one dwelling with one bill, and both of them are liable for it.</p>
<p><strong>The annex becomes a holiday let.</strong> If it is available to let for 140 days or more a year and actually let for 70, it may move to business rates instead of council tax in England. Otherwise it is a second home, but because it is part of the main property the premium does not apply.</p>
<p><strong>The main house is sold and the annex kept.</strong> Once the two are in separate hands, the annex is an ordinary dwelling and the family reductions end.</p>

<h2>Building or converting an annex</h2>
<p>A new annex is banded by the Valuation Office once it is ready to live in, in the same way as any new home: by asking what it would have sold for on the valuation date. The council usually learns about it through building control or planning records, and the Valuation Office may ask you about its layout. Expect a separate band if the annex has its own kitchen and bathroom; expect none if it shares the main house's kitchen.</p>
<p>Many annexes are built with a planning condition that they stay ancillary to the main house and are never sold or let separately. That condition matters twice for council tax. It supports the case that the annex is part of the main home, which brings the English 50 % reduction and keeps the premiums away. And if the annex is empty, it is the basis of the Class T exemption.</p>

<h2>Two bills or one</h2>
<p>When the annex has its own band, the council sends two bills, one for each dwelling, even if they go to the same person. If a relative lives in the annex as their own home, the bill for the annex is in their name, and the reduction or exemption is applied to it. The main house's bill is unaffected, except that a parent who moves into an exempt annex no longer counts as an adult in the main house: if that leaves one adult there, the main house gets the single person discount.</p>
<p>If you believe the annex should never have been banded separately, because it is not self-contained, ask the Valuation Office to review whether it should be a separate entry at all. The ${h.a('challenge-council-tax-band', 'challenge guide')} explains the routes and the evidence to send.</p>

<h2>Claiming</h2>
<p>Councils have a form for annex exemptions and reductions, often on the same page as the ${h.a('council-tax-disregards', 'disregards')}. Give the names and dates of birth of the people in the annex, how they are related to the person who pays for the main house, and the date they moved in. For Class W, add evidence of age or disability. Both the exemption and the reduction can be backdated to the date the conditions were first met.</p>

<h2>Wales and Scotland</h2>
<p>Wales has its own exempt dwellings order with a Class W exemption in similar terms for an annex lived in by a dependent relative. Scotland applies its own list of exemptions, set by Scottish regulations, so ask your council how it treats a family annex. The ${h.pc(h.P.discounts.annexFamily)} reduction described above comes from English regulations; Welsh and Scottish councils apply their own rules and can grant local discounts.</p>
`;
  },
});
