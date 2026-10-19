import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'council-tax-disabled-band-reduction',
  group: 'discounts',
  order: 40,
  mini: { kind: 'mini:disabled', props: { council: 'stockport', band: 3 } },
  related: ['council-tax-disregards', 'council-tax-single-person-discount', 'council-tax-bands', 'council-tax-annexes'],
  sources: ['gov_disabled', 'leg_disabled', 'highland_charges'],
  slug: 'council-tax-disabled-band-reduction',
  nav: 'Disabled Band Reduction',
  card: 'One band lower for a home adapted for a disabled resident, with the Band A case and Scotland.',
  title: 'Council Tax Disabled Band Reduction 2026/27: One Band Lower',
  description: 'Disabled Band Reduction for council tax 2026/27: the room, bathroom or wheelchair space that qualifies, Band A rule, Scottish water charges and what it saves.',
  h1: 'Disabled Band Reduction: one band lower on the bill',
  intro: 'Not a benefit and not means tested: a reduction for homes that are larger because a disabled person lives there.',
  resume: (h) => {
    const s = h.c('stockport'), full = h.E.bill({ council: 'stockport', band: 3 }), red = h.E.bill({ council: 'stockport', band: 3, disabled: true });
    return `The Disabled Band Reduction charges council tax at the band below your own when a disabled adult or child lives in the home and it has a feature they need: an extra bathroom, kitchen or other room used mainly by them, or extra space for using a wheelchair indoors. It is set out in the Council Tax (Reductions for Disabilities) Regulations 1992 and applies in England, Wales and Scotland. Income and savings do not matter, and the disabled person does not have to be the one who pays. In ${s.name}, a Band D home that qualifies is charged as Band C, ${h.m2(red.annual)} instead of ${h.m2(full.annual)} for ${h.P.taxYear}, a saving of ${h.m(full.annual - red.annual)}. Homes already in Band A cannot go lower, so they get a reduction of one sixth of the Band A charge instead, about 17 %. You must apply to your council, which may visit the home.`;
  },
  faqs: (h) => [
    { q: 'Does my child\'s disability qualify the home for a lower council tax band?', a: 'Yes. The resident who is disabled can be a child or an adult, as long as the home is their main residence. A room used for therapy or equipment, a downstairs bathroom fitted for them, or space to use a wheelchair indoors can all qualify the home, whoever pays the bill.' },
    { q: 'Do I need to receive PIP or another benefit for the Disabled Band Reduction?', a: 'No. The reduction is not linked to benefits or income. The council looks at whether the person is substantially and permanently disabled and whether the feature of the home is essential, or of major importance, to their wellbeing because of the disability. A benefit award can help as evidence, but it is not required.' },
    { q: 'Can the Disabled Band Reduction be backdated?', a: 'Councils can backdate it to the date the home first qualified, often for several years, if you show when the adaptation was made and when the disabled person moved in. Practice varies, so send evidence such as an occupational therapist\'s report, builder\'s invoices or a grant letter with your claim.' },
    { q: 'Is a stairlift enough for the Disabled Band Reduction?', a: 'Usually not on its own. The rules ask for an extra room, a second bathroom or kitchen, or enough extra space to use a wheelchair inside the home. A stairlift or grab rails do not add space. A wheelchair used only outdoors does not count either; it must be needed inside.' },
  ],
  body: (h) => {
    const ids = ['stockport', 'east-riding-of-yorkshire', 'newport', 'fife', 'hertsmere'];
    const rows = ids.map((id) => { const c = h.c(id); const b = 3; const f = h.E.bill({ council: id, band: b }), r = h.E.bill({ council: id, band: b, disabled: true }); return [h.ca(id), h.m2(f.annual), h.m2(r.annual), h.m(f.annual - r.annual)]; });
    const a1 = h.E.bill({ council: 'sunderland', band: 0 }), a2 = h.E.bill({ council: 'sunderland', band: 0, disabled: true }), a3 = h.E.bill({ council: 'sunderland', band: 0, disabled: true, household: 'one' });
    const hl = h.E.bill({ council: 'highland', band: 0 }), hld = h.E.bill({ council: 'highland', band: 0, disabled: true });
    return `
<h2>The three features that qualify a home</h2>
<p>The home must be the main residence of at least one person who is substantially and permanently disabled, and it must have at least one of these (${h.src('gov_disabled', 'GOV.UK, discounts for disabled people')}):</p>
<ul>
<li><strong>An extra room</strong>, other than a bathroom, kitchen or toilet, used mainly by the disabled person and needed because of the disability: a ground floor bedroom, a treatment room, a room for dialysis equipment;</li>
<li><strong>a second bathroom or kitchen</strong> that they need, such as a wet room downstairs;</li>
<li><strong>extra space for using a wheelchair indoors</strong>, for example widened corridors and doors, or a turning area.</li>
</ul>
<p>The test is need, not convenience. The regulations ask whether the feature is essential, or of major importance, to the disabled person's wellbeing because of the nature and extent of the disability (${h.src('leg_disabled', 'Council Tax (Reductions for Disabilities) Regulations 1992')}). A spare room used as an office does not qualify; the same room used for a hoist and a care bed does.</p>

<h2>What it saves</h2>
<p>The reduction is the gap between your band and the one below it. That gap is worth more in higher bands, because the bands widen at the top of the scale. Band D homes in five councils, for ${h.P.taxYear}:</p>
${h.table(['Council', 'Band D', 'Charged as Band C', 'Saving'], rows, 'Two adults, main home. Scottish figures include water and waste water.', ['l', 'r', 'r', 'r'])}
<p>The calculator above gives the figure for any council and band, before any other discount.</p>

<h2>Band A homes</h2>
<p>There is no band below A, so a Band A home that qualifies pays five sixths of the Band A charge, which is five ninths of Band D in England and Wales. In ${h.ca('sunderland', h.c('sunderland').name)} that brings the ${h.P.taxYear} bill from ${h.m2(a1.annual)} to ${h.m2(a2.annual)}. Most Band A homes are small, so this case is common among people who have adapted a terraced house or a ground floor flat.</p>

<h2>Combining it with other discounts</h2>
<p>The band reduction is applied first, then any discount on the reduced figure. A disabled person living alone in that Sunderland Band A home gets the ${h.a('council-tax-single-person-discount', 'single person discount')} on top: ${h.m2(a3.annual)} a year. If the disabled person is also severely mentally impaired, or lives with a carer, they may be ${h.a('council-tax-disregards', 'disregarded')}, which can raise the discount to 50 % or make the home exempt. Council Tax Reduction for a low income comes last, on what remains.</p>

<h2>Scotland</h2>
<p>The same rules apply in Scotland, and the reduction also lowers the water and waste water charges collected with council tax. The Highland Council's table for ${h.P.taxYear} shows it: a Band A home that qualifies pays ${h.m2(hld.annual)} in total instead of ${h.m2(hl.annual)} (${h.src('highland_charges', 'Highland Council charges 2026 to 2027')}). In Scotland the Band A case is 200/360 of Band D instead of 240/360.</p>

<h2>Applying</h2>
<p>Each council has a form, often called "disabled band reduction" or "disabled relief". It asks who the disabled person is, the nature of the disability, which feature of the home they need and why, and since when. Useful evidence includes:</p>
<ul>
<li>a letter from a GP, consultant or occupational therapist describing the need;</li>
<li>a Disabled Facilities Grant approval, if the adaptation was funded that way;</li>
<li>plans, photos or invoices showing the adaptation and its date.</li>
</ul>
<p>Many councils send an officer to look at the room or the space. The reduction is reviewed from time to time and ends when the disabled person no longer lives there, which you must tell the council about.</p>
${h.box('If you are refused', '<p>You can appeal. Write to the council first, explaining why you think it is wrong; if it does not change its decision within two months, or rejects your appeal, you can take the case to the Valuation Tribunal in England or Wales.</p>', 'tip')}

<h2>Common questions councils ask</h2>
<p><strong>Who uses the room?</strong> It must be used mainly by the disabled person. A room shared by the family as a living room does not qualify, even if the disabled person spends most of the day in it, unless they need it because of their disability.</p>
<p><strong>Is the wheelchair needed indoors?</strong> Using one outside only is not enough. The question is whether the person needs a wheelchair to move around inside the home, and whether there is extra space to do so.</p>
<p><strong>Is the feature already part of the house?</strong> It does not need to be a new adaptation. A house bought because it already has a ground floor bathroom can qualify from the day the disabled person moves in, if they need that bathroom.</p>
<p><strong>Does the home have to be larger?</strong> GOV.UK describes the scheme as for people who live in a larger home than they would need if nobody there were disabled. The band itself is not changed on the valuation list: it stays the same, and the council bills you at the band below.</p>

<h2>Four households, four answers</h2>
<p><strong>A couple in a Band C bungalow, one of them using a wheelchair at home.</strong> The doorways were widened and the bathroom enlarged to turn a wheelchair. That is extra space for wheelchair use: the home is charged as Band B.</p>
<p><strong>A family whose teenage son has autism and uses the box room as a calm room.</strong> The room is used mainly by him and needed because of his condition. This can qualify as an extra room used mainly by a disabled resident. The council will decide on the evidence, so a letter from a specialist explaining why he needs the room, and what happens without it, matters more than the room itself.</p>
<p><strong>A retired man with arthritis who had a stairlift and grab rails fitted.</strong> No extra room, bathroom or wheelchair space: no reduction. He may still qualify for other help, and should check Council Tax Reduction if his income is low.</p>
<p><strong>A woman whose mother lives in a self-contained annex fitted for her care.</strong> The annex may be exempt in its own right, as explained on the ${h.a('council-tax-annexes', 'annex page')}, and the main house may qualify for the band reduction if it also has a feature the mother needs there.</p>

<h2>What it is not</h2>
<p>The Disabled Band Reduction is separate from the band on the valuation list, which stays the same and is decided by the Valuation Office. It is separate from the discounts for people who are disregarded, and from Council Tax Reduction, which depends on income. Many households are entitled to two or three of these at once, and the order in which they apply is fixed: band reduction, then discount, then means-tested support.</p>
`;
  },
});
