import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'second-home-council-tax',
  group: 'premiums',
  order: 10,
  mini: { kind: 'mini:second-home', props: { council: 'gwynedd', band: 3, premium: 150 } },
  related: ['empty-property-council-tax', 'council-tax-annexes', 'council-tax-cornwall', 'scotland-council-tax'],
  sources: ['gov_second_empty', 'mhclg_premiums', 'leg_lgfa_premium', 'wales_premiums', 'scot_circular_2026', 'gwynedd_premium', 'cornwall_second'],
  slug: 'second-home-council-tax',
  nav: 'Second homes',
  card: 'Double the bill in much of England, up to four times in Wales, and Scotland\'s new default.',
  title: 'Second Home Council Tax 2026/27: Premiums in Three Nations',
  description: 'Second home council tax for 2026/27: the premium of up to 100 % in England and 300 % in Wales, Scotland\'s 100 % default, the exceptions, and the bill in pounds.',
  h1: 'Council tax on a second home',
  intro: 'A furnished home that is nobody\'s main residence now pays a premium in most of Britain. The size of it depends on the nation and the council.',
  resume: (h) => {
    const PE = h.P.premiums; const g = h.E.bill({ council: 'gwynedd', band: 3, occupancy: 'second', premium: h.P.localPremiums.gwynedd.second }), gm = h.E.bill({ council: 'gwynedd', band: 3 });
    return `A second home, for council tax, is a furnished dwelling that is nobody's sole or main residence: a holiday cottage, a city flat used for work, a parent's house kept furnished after they move. Since ${h.date(PE.england.secondHomeFrom)}, councils in England may charge a premium of up to ${h.pc(PE.england.secondHomeMax)} on top of the normal bill, so the owner pays up to twice the band charge. In Wales the premium can reach ${h.pc(PE.wales.max)}, four times the bill, since ${h.date(PE.wales.from)}; Gwynedd charges ${h.pc(h.P.localPremiums.gwynedd.second)}, which takes a Band D home from ${h.m2(gm.annual)} to ${h.m2(g.annual)} for ${h.P.taxYear}. In Scotland a premium of ${h.pc(PE.scotland.default)} applies by default from ${h.date(PE.scotland.from)}, and each council can set another rate. Exceptions cover job-related homes, annexes, and for up to ${PE.england.exceptionMonths} months homes being sold, let or settled after a death. The council decides, and the owner must tell it.`;
  },
  faqs: (h) => [
    { q: 'Can I avoid the second home premium by letting the property as a holiday let?', a: 'Only if it moves to business rates. In England a self-catering property must be available to let for at least 140 days a year and actually let for at least 70 days to be rated as a business instead of a home. Occasional lets to friends do not count, and the Valuation Office asks for evidence such as booking records.' },
    { q: 'Do I pay the second home premium on a flat I use for work during the week?', a: 'Usually yes, if your main home is elsewhere and the flat is furnished. The exception is accommodation provided by your employer that you must live in for the job, such as a caretaker\'s flat or a minister\'s house. A flat you rent or own for convenience is a second home for council tax.' },
    { q: 'Is my late mother\'s furnished house a second home for council tax?', a: 'Not at first. While it is empty and the estate waits for probate it is exempt, and for up to six months after probate too if it stays in her name. After that it can be charged as a second home, but in England the premium is excepted for twelve months after probate or letters of administration are granted.' },
  ],
  body: (h) => {
    const PE = h.P.premiums;
    const cases: Array<[string, number, number]> = [['cornwall', 3, h.P.localPremiums.cornwall.second], ['westmorland-and-furness', 3, PE.england.secondHomeMax], ['gwynedd', 3, h.P.localPremiums.gwynedd.second], ['pembrokeshire', 3, PE.wales.max], ['highland', 3, PE.scotland.default]];
    const rows = cases.filter(([id]) => { try { h.c(id); return true; } catch { return false; } }).map(([id, b, p]) => { const n = h.E.bill({ council: id, band: b }), s = h.E.bill({ council: id, band: b, occupancy: 'second', premium: p }); return [h.ca(id), h.m2(n.annual), h.pc(s.premiumRate), h.m2(s.annual)]; });
    const cw = h.E.bill({ council: 'cornwall', band: 4, occupancy: 'second', premium: h.P.localPremiums.cornwall.second });
    return `
<h2>What counts as a second home</h2>
<p>A dwelling is a second home for council tax when it is furnished and nobody lives there as their sole or main residence (${h.src('gov_second_empty', 'GOV.UK, second homes and empty properties')}). Owning another house does not make it a second home if somebody lives in it as their own home: a house let to a tenant is the tenant's main residence. A home that is empty and substantially unfurnished is not a second home either; it falls under the ${h.a('empty-property-council-tax', 'empty homes rules')}.</p>
<p>Your main residence is a question of fact. Councils look at where you spend most of your time, where you are registered to vote and with a GP, where your children go to school, and which address is on your bank and tax records.</p>

<h2>England: up to double</h2>
<p>Section 11C of the 1992 Act, added by the Levelling-up and Regeneration Act 2023, lets a billing authority charge a premium of up to ${h.pc(PE.england.secondHomeMax)} on homes that are furnished and nobody's main residence, from ${h.date(PE.england.secondHomeFrom)} (${h.src('leg_lgfa_premium', 'Local Government Finance Act 1992')}). The council had to decide at least a year before the first year it charged it. Many councils in tourist areas now charge the full ${h.pc(PE.england.secondHomeMax)}, among them ${h.ca('cornwall', 'Cornwall')} (${h.src('cornwall_second', 'Cornwall Council')}), where a Band E second home pays ${h.m2(cw.annual)} this year.</p>
<p>The government set out classes of homes the premium does not apply to (${h.src('mhclg_premiums', 'MHCLG guidance on premiums')}):</p>
<ul>
<li>homes that are actively marketed for sale or for let, for up to ${PE.england.exceptionMonths} months;</li>
<li>homes where probate or letters of administration were recently granted, for up to ${PE.england.exceptionMonths} months after the grant;</li>
<li>job-related homes, including those of service personnel and of people who must live in accommodation provided for their work;</li>
<li>annexes that form part of, or are treated as part of, the main home;</li>
<li>pitches occupied by a caravan and moorings occupied by a boat;</li>
<li>seasonal homes where year-round living is prohibited by planning rules, or where a planning condition rules out use as a main home.</li>
</ul>

<h2>Wales: up to four times</h2>
<p>Welsh councils may charge a premium of up to ${h.pc(PE.wales.max)} on second homes and long-term empty homes since ${h.date(PE.wales.from)}; the power to charge one first came in ${h.date(PE.wales.firstFrom).slice(-4)} (${h.src('wales_premiums', 'Welsh Government guidance on premiums')}). Rates vary widely and are set each year. Gwynedd charges ${h.pc(h.P.localPremiums.gwynedd.second)} for ${h.P.taxYear}, unchanged on last year (${h.src('gwynedd_premium', 'Cyngor Gwynedd')}). Welsh exceptions resemble the English ones and include homes for sale or let for up to a year, job-related homes and homes with a planning condition that prevents year-round use.</p>

<h2>Scotland: a new default from April 2026</h2>
<p>Scottish councils could already charge up to double on second homes. From ${h.date(PE.scotland.from)} a premium of ${h.pc(PE.scotland.default)} applies by default, and each council can decide to charge more, less or none (${h.src('scot_circular_2026', 'Finance Circular 6/2026')}). A second home in Scotland is a furnished home lived in for at least ${PE.scotland.minOccupationDays} days in a twelve month period, but not as anyone's main residence. The premium applies to council tax only: Scottish Water's charges stay at the normal rate. Self-catering properties that meet the letting thresholds pay non-domestic rates instead.</p>

<h2>The bill in pounds</h2>
${h.table(['Council', 'Band D as a main home', 'Premium', 'As a second home'], rows, `${h.P.taxYear}. Cornwall and Gwynedd at their published rates, the other English and Welsh councils at the legal maximum, Highland at the Scottish default; check your own council's rate.`, ['l', 'r', 'r', 'r'])}
<p>The calculator above takes any council, band and premium, so you can enter the rate your council has set. The ${h.a('home', 'full calculator')} applies the legal maximum in England by default.</p>

<h2>No discount for one adult</h2>
<p>The single person discount does not apply to a second home, since nobody lives there as their main home. Councils in England can still choose to offer a discount on second homes, but few do, and the premium has replaced it in many areas. Neither does the Disabled Band Reduction, which requires a disabled resident.</p>

<h2>Situations that cause confusion</h2>
<p><strong>A couple with two homes.</strong> Each person has one main residence, and a married couple normally share theirs. If one partner genuinely lives in the other home, for example to care for a parent or for work, that home can be their main residence; the council will want evidence that their life is centred there.</p>
<p><strong>A home between tenants.</strong> A let property that is furnished and waiting for the next tenant is a second home in law, but in England the premium is excepted while it is actively marketed for let, for up to ${h.P.premiums.england.exceptionMonths} months. After that it can be charged.</p>
<p><strong>A house you are renovating to move into.</strong> If it is furnished, it is a second home; if it is empty and unfurnished, it is an empty home. Major works that make it uninhabitable can bring an exception from the premium for up to a year in England, and in serious cases removal from the list during the works.</p>
<p><strong>A parent in a care home.</strong> A home left empty when the owner moves permanently into a care home is exempt, even if furniture is left in it, as long as nobody lives there. It does not become a second home just because it is furnished.</p>
<p><strong>A caravan or boat.</strong> Pitches occupied by a caravan and moorings occupied by a boat are excepted from the English premium, so a static caravan used at weekends pays the normal band charge only, where it has a band at all.</p>

<h2>Why councils charge it</h2>
<p>Councils in areas with many second homes argue that a premium raises money for local services and encourages owners to sell or let to local households. The money goes to the bodies on the bill in the usual shares, so part of a Cornish premium goes to the police and to the parish as well as to the council itself, which also runs the fire service there.</p>

<h2>Telling the council</h2>
<p>Owners must tell the council when a home becomes a second home, and when its use changes: a tenant moves in, the home is put on the market, or it becomes your main residence. Councils check second home declarations against electoral registers, holiday letting listings and utility use. Claiming a home is your main residence when it is not can lead to the premium being backdated with a penalty.</p>
${h.box('Before you buy a holiday home', '<p>Check the premium the council charges this year and whether it has announced a change for next year; councils must decide at least a year in advance in England. In Wales, ask whether the home has a planning condition limiting it to holiday use, which can take it out of the premium.</p>', 'tip')}
`;
  },
});
