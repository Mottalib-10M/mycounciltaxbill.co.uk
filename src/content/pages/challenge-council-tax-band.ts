import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'challenge-council-tax-band',
  group: 'bands',
  order: 40,
  mini: { kind: 'mini:band-lower', props: { council: 'bristol', band: 3, years: 6 } },
  related: ['check-council-tax-band', 'what-council-tax-band-am-i', 'council-tax-bands', 'scotland-council-tax'],
  sources: ['voa_challenge', 'voa_legal_right', 'voa_band_review', 'voa_after', 'voa_blog_increase', 'saa'],
  slug: 'challenge-council-tax-band',
  nav: 'Challenge your band',
  card: 'The two routes, the evidence that counts, the deadlines, and what a lower band is worth.',
  title: 'Challenge Council Tax Band: Evidence, Deadlines and Refund',
  description: 'Challenge a council tax band in England, Wales or Scotland: legal right or band review, the evidence the Valuation Office accepts, deadlines, and the refund.',
  h1: 'Challenging your council tax band',
  intro: 'Worth doing when the evidence is strong, and worth thinking twice about when it is not.',
  resume: (h) => {
    const V = h.P.voa;
    const d = h.E.bandCharge(h.c('bristol'), 3), c = h.E.bandCharge(h.c('bristol'), 2);
    return `You can challenge a council tax band in England and Wales with the Valuation Office, and in Scotland with your local assessor. In England and Wales there are two routes. If you became the taxpayer less than ${V.newResidentMonths} months ago, if the band was changed in the last ${V.newResidentMonths} months, or if the home or the area has physically changed, you have a legal right to make a proposal, decided within about ${V.proposalMonthsDecision} months and open to appeal. Otherwise you can only ask for a band review, which needs evidence such as up to ${V.comparables} similar homes in a lower band, can take up to ${V.reviewMonthsDecision} months and cannot be appealed. A successful challenge in Bristol from Band D to Band C cuts the ${h.P.taxYear} bill from ${h.m2(d)} to ${h.m2(c)}, and the council refunds the overpayment at that address. A challenge can also end with a higher band.`;
  },
  faqs: (h) => [
    { q: 'Can my council tax band go up if I ask for a review?', a: 'Yes. The Valuation Office looks at all the evidence, including sales and the bands of similar homes, and if that points to a higher value the band can rise. When one band changes, it may also review similar homes nearby. An increase applies from the date the council is told, so it is not backdated.' },
    { q: 'Do I have to keep paying council tax while my band is challenged?', a: 'Yes. A challenge does not suspend the bill, and missing instalments can lead to a reminder and then a summons. Keep paying the amount on your notice; if the band is lowered, the council revises the bill and refunds or credits what you overpaid.' },
    { q: 'Are Rightmove or Zoopla price averages good evidence for a band challenge?', a: `No. GOV.UK says the Valuation Office will not treat average house price figures from property websites as strong evidence. What counts is the actual sale price of your home or similar homes close to the valuation date, between ${h.P.voa.salesWindowEngland} in England, and the bands of homes like yours on the same street or estate.` },
    { q: 'How long do I have to appeal after the Valuation Office refuses my proposal?', a: `If you had a legal right to make the proposal, you can appeal to the Valuation Tribunal within ${h.P.voa.appealMonthsEngland} months of the decision in England and ${h.P.voa.appealMonthsWales} months in Wales. The appeal is free, but you pay your own costs. A band review without a legal right cannot be appealed.` },
  ],
  body: (h) => {
    const V = h.P.voa; const E = h.P.bands.england, W = h.P.bands.wales;
    const ex = [['kirklees', 3], ['winchester', 4], ['bristol', 3], ['wirral', 2], ['swansea', 3], ['somerset', 4]].filter(([id]) => { try { h.c(id as string); return true; } catch { return false; } }) as Array<[string, number]>;
    const rows = ex.map(([id, b]) => { const c = h.c(id); const L = h.E.letters(c.nation); const hi = h.E.bill({ council: id, band: b }).annual, lo = h.E.bill({ council: id, band: b - 1 }).annual;
      return [h.ca(id), `${L[b]} to ${L[b - 1]}`, h.m2(hi - lo), h.m(6 * (hi - lo))]; });
    return `
<h2>Which route applies to you</h2>
<p>Everything starts with one question: do you have a legal right to challenge, which GOV.UK calls making a proposal? You have it in four situations (${h.src('voa_legal_right', 'GOV.UK, legal right to make a challenge')}):</p>
<ul>
<li>you have been paying council tax on the home for less than ${V.newResidentMonths} months, counted from the date you became liable, which can be before you moved in;</li>
<li>the Valuation Office changed the band in the last ${V.newResidentMonths} months;</li>
<li>something changed the value: the home was split or merged, part of it is now used for business, or the area changed physically, for example a new main road or supermarket;</li>
<li>the home should be removed from the list (demolished, derelict, or under major works to all or most of it) or added to it.</li>
</ul>
<p>If none of these applies you can still ask for a band review, but you have no right of appeal if it is refused (${h.src('voa_band_review', 'GOV.UK, when you do not have a legal right')}). A loft conversion or new kitchen does not change the band on its own: the Valuation Office only reflects improvements when the home is sold or at a general revaluation.</p>

<h2>What one band lower is worth</h2>
<p>The saving is the gap between two bands, which in England is one ninth to three ninths of the Band D charge depending on where you are on the scale. Over the years since you moved in it adds up, because a lowered band is backdated to the start of your time at the address:</p>
${h.table(['Council', 'Band change', 'Saving a year', 'Over six years'], rows, `${h.P.taxYear} charges, two adults. A refund over past years uses each year's own charges, which were lower.`, ['l', 'l', 'r', 'r'])}
<p>The calculator above does the same for any council and band. It is a ceiling: the real refund uses each past year's bill, and a discount such as the ${h.a('council-tax-single-person-discount', 'single person discount')} reduces it by a quarter.</p>

<h2>Evidence the Valuation Office accepts</h2>
<p>A band is a judgement on what the home would have sold for on ${E.valuationDate} in England (${W.valuationDate} in Wales), so the evidence must speak about that date. GOV.UK names two kinds (${h.src('voa_band_review', 'band review guidance')}):</p>
<ul>
<li><strong>Similar homes in a lower band.</strong> Give the addresses of up to ${V.comparables} homes of the same type, size, age and style, on the same street or estate in a town, or in the same village in the country.</li>
<li><strong>Sale prices close to the valuation date.</strong> Sales count if they took place between ${V.salesWindowEngland} for England or ${V.salesWindowWales} for Wales; the closer to the valuation date, the more weight they carry. Compare the price with the band ranges on the ${h.a('council-tax-bands', 'bands page')}.</li>
</ul>
<p>Today's value of your home is not evidence, and the Valuation Office says it will not treat average prices from property websites as strong evidence either. A good way to build the case is to look up your street on the ${h.a('check-council-tax-band', 'band search service')}: if every identical semi on one side is in Band B and yours is in Band C, you have the start of a case. If the neighbours are all in your band, the case is weak.</p>
${h.box('The risk', `<p>The Valuation Office's own blog lists challenges among the reasons a band can increase: if the sales and the bands of similar homes point to a higher value, the band goes up, and a change after one challenge can lead it to review similar homes nearby (${h.src('voa_blog_increase', 'Valuation Office blog, March 2026')}). An increase is not backdated, but it applies to every later year.</p>`, 'warning')}

<h2>Making the challenge in England and Wales</h2>
<p>The challenge is made online from the Valuation Office's band search service: find the address, open its band, and choose to challenge it (${h.src('voa_challenge', 'GOV.UK, challenge your Council Tax band')}). You give your name, whether you own or rent, the date from which the change should apply, and your evidence. Tenants can challenge too, since they are the taxpayer.</p>
<p>The Valuation Office usually confirms receipt within a few days, and in any case within 28 days. A proposal is decided within about ${V.proposalMonthsDecision} months; a band review can take up to ${V.reviewMonthsDecision} months (${h.src('voa_after', 'GOV.UK, after you make a challenge')}). Keep paying the bill as it stands in the meantime.</p>

<h2>If the answer is no</h2>
<p>After a proposal, you can appeal to the Valuation Tribunal for England within ${V.appealMonthsEngland} months of the decision, or to the Valuation Tribunal for Wales within ${V.appealMonthsWales} months. The appeal is free, though you pay your own costs, and the deadline can sometimes be extended if you explain why you are late. If the tribunal agrees with you, the Valuation Office changes the band and the council revises the bill. After a band review there is no appeal.</p>

<h2>If the answer is yes</h2>
<p>The Valuation Office tells the council, which sends a revised bill and refunds or credits the difference for the period at that address. ${V.backdatingNote} If you have already moved out, the refund is still due: give the council a forwarding address. A lower band also lowers any premium charged on a second or empty home, since the premium is a multiple of the band charge.</p>

<h2>Challenging a band in Scotland</h2>
<p>Scotland has no Valuation Office: each area has an assessor, working for a valuation joint board or a council, listed by the Scottish Assessors Association (${h.src('saa', 'Scottish Assessors Association')}). A new taxpayer can make a proposal within ${V.newResidentMonths} months of becoming liable, and the assessor can also be asked to look again when the home or the area changes. A refused proposal can go on appeal to the First-tier Tribunal for Scotland. Scottish bands rest on 1991 values like England's, but the ${h.a('scotland-council-tax', 'Scottish ratios')} are steeper in the upper bands, so a move from Band E to D saves proportionally more there.</p>

<h2>Paid services</h2>
<p>Firms sell band reports and appeal packs, and some agents take a share of the refund. Nothing in the process needs one: the challenge is free, made online, and the evidence is public. If a firm cold calls you about a band refund, check that it is not asking for a fee for something you can do at no cost. The strongest cases are simple ones: an identical neighbour in a lower band, or a sale near the valuation date below your band's range.</p>
`;
  },
});
