/** llms.txt (RECETTE §21): what the site is, where its figures come from, its main pages. Built from the data. */
import type { APIRoute } from 'astro';
import { PAGES } from '../lib/guides';
import { route } from '../i18n/routes';
import { SITE_URL, LAST_UPDATED } from '../data/site-config';
export const GET: APIRoute = () => {
  const lines = [
    '# My Council Tax Bill',
    '',
    `> Council tax bills for 2026/27 in England, Wales and Scotland, worked out in the browser for each of the 350 councils and every band: single person discount, people disregarded, student exemption, Disabled Band Reduction, second homes and long-term empty homes premiums, Scottish Water charges, 10 or 12 instalments. Band D figures from MHCLG (Tables 9 and 10, 25 March 2026), the Welsh Government and the Scottish Government; rules from legislation.gov.uk, GOV.UK, gov.wales and gov.scot (last read ${LAST_UPDATED}). Published by Radif Partners, an independent publisher; not a council, not the Valuation Office Agency.`,
    '',
    '## Calculators and guides',
    `- [Council tax calculator 2026/27](${SITE_URL}${route('home', 'en')}): the yearly and monthly bill for any council, band and household.`,
    ...PAGES.map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`),
    '',
    '## Method',
    `- [How the bill is worked out](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
