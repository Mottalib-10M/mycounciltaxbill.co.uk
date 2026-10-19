/** Writing helpers handed to every page: links, numbers from the engine, tables, sources. */
import { route, ROUTES } from '../i18n/routes';
import { P, type SourceKey } from './engine/params';
import * as E from './engine/counciltax';
import { formatMoney, formatNumber, formatPercent, displayDate } from './format';

const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');
export function table(headers: string[], rows: Array<Array<string | number>>, caption?: string, align: Array<'l' | 'r'> = []) {
  const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
  return `<div class="not-prose my-6 overflow-x-auto"><table class="journal w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-700 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatNumber(c, 0)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

export function helpers(strict = false) {
  const m = (n: number) => formatMoney(Math.round(n), 0);
  const m2 = (n: number) => formatMoney(n, 2);
  const pc = (x: number, d?: number) => { const v = Math.round(x * 10000) / 100; return formatPercent(x, d ?? (Number.isInteger(v) ? 0 : Number.isInteger(+(v * 10).toFixed(6)) ? 1 : 2)); };
  const a = (id: string, text: string) => {
    if (!ROUTES.some((r) => r.id === id)) { if (strict) throw new Error(`Unknown page id in a link: ${id}`); return text; }
    return `<a href="${route(id, 'en')}">${text}</a>`;
  };
  return {
    P,
    E,
    /** A council by id (throws on an unknown id). */
    c: (id: string) => E.councilById(id),
    /** Link to another page of the site by id. */
    a,
    /** Link to a council's page when it has one, else its name. */
    ca: (id: string, text?: string) => { const c = E.councilById(id); return ROUTES.some((r) => r.id === `council-tax-${id}`) ? a(`council-tax-${id}`, text ?? c.name) : (text ?? c.name); },
    /** £2,363 (rounded to the pound). */
    m,
    /** £2,362.90 (pence kept, as councils publish band charges). */
    m2,
    num: (n: number) => formatNumber(n, 0),
    /** 25 %, 4.99 % (decimals only when needed). */
    pc,
    /** “1 April 2026” from an ISO date. */
    date: (iso: string) => displayDate(iso, 'en-GB'),
    table,
    /** Table of every band of a council: charge for two adults and for one adult. */
    bandTable: (id: string, caption?: string) => {
      const c = E.councilById(id); const L = E.letters(c.nation);
      const rows = L.map((l, i) => { const two = E.bill({ council: id, band: i }); const one = E.bill({ council: id, band: i, household: 'one' });
        return [`Band ${l}`, `${P.bands[c.nation].num[i]}/${P.bands[c.nation].den}`, m2(two.annual), m2(one.annual), m2(two.annual / 10)]; });
      return table(['Band', 'Share of D', 'Two adults', 'Living alone', 'Each of 10 payments'], rows, caption ?? `${c.name}, ${P.taxYear}${c.nation === 'scotland' ? ', Scottish Water charges included' : ''}. Computed from the official Band D figure.`, ['l', 'l', 'r', 'r', 'r']);
    },
    /** Table of councils: Band D this year and last, change, and Bands A and the top band. */
    councilTable: (list: E.Council[], caption?: string) => {
      const rows = [...list].sort((x, y) => y.bandD - x.bandD).map((c) => { const ch = E.change(c); const L = E.letters(c.nation);
        return [ROUTES.some((r) => r.id === `council-tax-${c.id}`) ? a(`council-tax-${c.id}`, c.name) : c.name, m2(E.bandCharge(c, 0)), m2(c.bandD), m2(E.bandCharge(c, L.length - 1)), c.bandDPrev ? m2(c.bandDPrev) : 'n/a', ch ? pc(ch.rate, 1) : 'n/a']; });
      return table(['Council', 'Band A', 'Band D', `Band ${list[0] ? E.letters(list[0].nation).slice(-1)[0] : 'H'}`, 'Band D 2025/26', 'Change'], rows, caption, ['l', 'r', 'r', 'r', 'r', 'r']);
    },
    /** Link to an official source of the parameter file. */
    src: (key: SourceKey, text?: string) => { const s = P.sources[key]; return `<a href="${s.url}" target="_blank" rel="nofollow noopener noreferrer">${text ?? s.label.en}</a>`; },
    /** Boxed note in the style of a press sidebar. */
    box: (title: string, html: string, kind: 'info' | 'tip' | 'warning' | 'example' = 'info') => `<div class="callout callout-${kind}"><span class="callout-title">${title}</span>${html}</div>`,
  };
}
export type Helpers = ReturnType<typeof helpers>;
