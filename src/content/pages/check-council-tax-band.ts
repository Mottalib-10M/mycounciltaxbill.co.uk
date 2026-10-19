import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'check-council-tax-band',
  group: 'bands',
  order: 30,
  mini: { kind: 'mini:band-lower', props: { council: 'kirklees', band: 2, years: 4 } },
  related: ['challenge-council-tax-band', 'what-council-tax-band-am-i', 'council-tax-bands', 'council-tax-moving-house'],
  sources: ['voa_check', 'saa', 'voa_band_review', 'voa_blog_increase', 'gov_bands'],
  slug: 'check-council-tax-band',
  nav: 'Check your band',
  card: 'Look up any address, read the result, and compare it with the street before you act.',
  title: 'Check Council Tax Band by Postcode: Read It, Compare It',
  description: 'Check the council tax band of any home by postcode in England, Wales or Scotland, read the result, compare it with neighbours and price the band for 2026/27.',
  h1: 'Checking a council tax band, and what to do with the result',
  intro: 'The search is free and public. The useful part is what you compare the result with.',
  resume: (h) => {
    const k = h.c('kirklees');
    return `You can check the council tax band of any home in England or Wales on the Valuation Office's free search service on GOV.UK, by postcode or address, and of any home in Scotland on the Scottish Assessors Association website. The result gives the band and the council that bills it. Checking your own band takes a minute; the real value of the search is that it shows every other home on the street, so you can see whether yours sits in the same band as identical neighbours. A home one band too high costs the gap between two band charges every year: in ${k.name}, moving from Band C to Band B would save ${h.m(h.E.bandCharge(k, 2) - h.E.bandCharge(k, 1))} in ${h.P.taxYear} for two adults. Searching is not a challenge and carries no risk; asking for a review is a separate step, which can also end with a higher band.`;
  },
  faqs: (h) => [
    { q: 'Can I see my neighbours\' council tax bands?', a: 'Yes. Valuation lists are public, so a postcode search shows every home at that postcode with its band. That is the main way to spot a band that looks out of line. The search does not show values, owners or bills, only addresses, bands and the council that charges them.' },
    { q: 'Why does my house show a different band from next door?', a: 'Homes that look alike can differ in size, a garage, a larger plot or an extension made before the banding. Sometimes the difference is simply an error from the original valuation in the early 1990s. If the homes really are the same, the Valuation Office can be asked to review the band, with evidence.' },
    { q: 'Does checking my council tax band trigger a review?', a: 'No. Looking a band up is anonymous and has no effect on the list. A review only starts when you or someone else formally asks for one, or when the Valuation Office reassesses a home after a sale following improvements, a physical change or a successful challenge nearby.' },
  ],
  body: (h) => {
    const ex = ['kirklees', 'east-riding-of-yorkshire', 'north-somerset', 'conwy'].map((id) => { const c = h.c(id); return [h.ca(id), h.m2(h.E.bandCharge(c, 1)), h.m2(h.E.bandCharge(c, 2)), h.m2(h.E.bandCharge(c, 3)), h.m(h.E.bandCharge(c, 2) - h.E.bandCharge(c, 1))]; });
    return `
<h2>Where to search</h2>
<ul>
<li><strong>England and Wales:</strong> the "Check your Council Tax band" service on GOV.UK, run by the Valuation Office (${h.src('voa_check', 'GOV.UK, check your Council Tax band')}). Search by postcode or by address.</li>
<li><strong>Scotland:</strong> the Scottish Assessors Association portal, which covers all 32 councils and also shows the assessor responsible for each area (${h.src('saa', 'Scottish Assessors Association')}).</li>
<li><strong>Your own bill:</strong> the annual bill sent in March, and every revised bill, states the band. So does the council's online account for your address.</li>
</ul>
<p>The service is free. Sites that charge for a "band check" use the same public list, sometimes with a few extra lines of commentary.</p>

<h2>Reading the result</h2>
<p>The search returns each home at the postcode with its band and the billing council. Some entries carry extra information, such as a flag noting that improvements were reported, which the Valuation Office uses to review the band when the home is next sold (${h.src('voa_blog_increase', 'Valuation Office blog')}). Look for three things:</p>
<ol>
<li><strong>The exact address.</strong> Flats in a converted house can be listed as "Flat A", "Ground floor flat" or "Basement", and a typo in your own search can make you read a neighbour's band.</li>
<li><strong>The band letter.</strong> A to H in England and Scotland, A to I in Wales.</li>
<li><strong>The council.</strong> Near a boundary, a home can be billed by a council you did not expect; the bill follows the council in the list, whatever the postal town on the address says.</li>
</ol>

<h2>Comparing with the street</h2>
<p>A band on its own tells you little. Compared with homes of the same type, size and age nearby, it tells you whether something is off. GOV.UK says similar homes should be on the same street or estate in a town, or in the same village or area in the country (${h.src('voa_band_review', 'GOV.UK, band review')}). A method that works:</p>
<ul>
<li>search your postcode and the one on the other side of the street;</li>
<li>pick the homes that match yours: same style, same number of floors, built at the same time, no large extension before 1993;</li>
<li>count how many are in each band, and note any that are clearly larger or smaller than yours.</li>
</ul>
<p>If nine identical terraced houses are in Band B and yours alone is in Band C, the case for a review is strong. If half the row is in B and half in C, the valuers may have seen differences you cannot, and a review could just as well bring the B homes up.</p>

<h2>What a one-band difference costs</h2>
<p>The gap between two bands depends on the council's Band D charge. The calculator above prices it for any council, with the total over the years you have lived there. Some councils, for ${h.P.taxYear}:</p>
${h.table(['Council', 'Band B', 'Band C', 'Band D', 'Gap B to C'], ex, 'Two adults, main home.', ['l', 'r', 'r', 'r', 'r'])}

<h2>When the result surprises you</h2>
<p><strong>Your home is not listed.</strong> A new home may not be banded yet; the council will bill you once it is, from the date you became liable. A home that has been split or merged may appear under an old address.</p>
<p><strong>Your band is higher than the neighbours'.</strong> Check whether your home was extended or altered before it was banded, or whether it is larger than it looks from the street. If not, gather the addresses of up to five matching homes in a lower band and read the ${h.a('challenge-council-tax-band', 'challenge guide')}.</p>
<p><strong>Your band is lower than the neighbours'.</strong> That is good news, but keep it in mind before asking for a review of anything nearby. When one band on a street changes, the Valuation Office may look at similar homes too.</p>
<p><strong>You have just moved in.</strong> If you became the taxpayer less than ${h.P.voa.newResidentMonths} months ago, you have a legal right to challenge the band, with a right of appeal. That window closes for good, so check the band in your first weeks at the address.</p>
${h.box('Before you buy', '<p>Search the band of the home you are offering on and of the homes around it. A home recently improved can be rebanded after the sale, which applies to you as the new owner.</p>', 'warning')}

<h2>Homes that are listed in unusual ways</h2>
<p><strong>Annexes and granny flats.</strong> A self-contained annex usually has its own entry and its own band, separate from the main house. It may be exempt or discounted, as the ${h.a('council-tax-annexes', 'annex page')} explains, but it still appears in the list.</p>
<p><strong>Houses in multiple occupation.</strong> A shared house let by the room is normally one entry with one band, and the landlord pays the bill. Bedsits that are fully self-contained can have one entry each.</p>
<p><strong>Mixed homes and businesses.</strong> A flat above a shop is banded for council tax while the shop pays business rates. A home where one room is used only for a business can have that part removed from the band, which is one of the cases giving a legal right to challenge.</p>
<p><strong>Mobile homes and boats.</strong> A caravan on a residential pitch or a houseboat at a permanent mooring used as a main home has its own band, and can be searched like any other address once it has one.</p>

<h2>Keeping a record</h2>
<p>If you plan to ask for a review, save the search results for your street with the date you made them. Bands can change after your request, and the list you saw is your evidence of what the neighbours paid when you wrote. Note the type, age and size of each matching home as well, with a photo from the street if you can: the Valuation Office asks why each home is comparable, not just where it is.</p>

<h2>From the band to the bill</h2>
<p>Once you know the band, the ${h.a('home', 'calculator')} gives the ${h.P.taxYear} bill for your council, with who lives there and any premium. The bands themselves, their value ranges and the share of Band D each pays are explained on the ${h.a('council-tax-bands', 'bands page')}. If you want to test the band against a value, the ${h.a('what-council-tax-band-am-i', 'band estimator')} turns a 1991 or 2003 price into a band.</p>

<h2>Checking a band in Scotland</h2>
<p>The Scottish portal works in the same way: search by postcode, read the band, compare with the street. Scotland's bands use 1991 values with lower brackets than England, and the bill includes Scottish Water charges, so a one-band gap there is worth a little more than the council tax alone suggests. A new taxpayer can make a proposal to the assessor within ${h.P.voa.newResidentMonths} months of becoming liable. The ${h.a('scotland-council-tax', 'Scotland page')} has the ratios and water charges.</p>
`;
  },
});
