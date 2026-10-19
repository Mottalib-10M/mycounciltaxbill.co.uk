/** Council picker: one native list of the 350 billing authorities, grouped by nation (same box as SelectField). */
import { COUNCILS, NATIONS, NATION_NAME } from '../../lib/engine/counciltax';
interface Props { id: string; label: string; value: string; onChange: (v: string) => void; help?: string; only?: 'england' | 'wales' | 'scotland' }
const sorted = [...COUNCILS].sort((a, b) => a.name.localeCompare(b.name, 'en-GB'));
export default function CouncilSelect({ id, label, value, onChange, help, only }: Props) {
  return (
    <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <div className="relative self-start">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={help ? `${id}-help` : undefined}
          className="w-full appearance-none truncate rounded-lg border border-navy-300 h-12 bg-white pl-3 pr-10 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20">
          {NATIONS.filter((n) => !only || n === only).map((n) => (
            <optgroup key={n} label={NATION_NAME[n]}>
              {sorted.filter((c) => c.nation === n).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </optgroup>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      {help && <p id={`${id}-help`} className="mt-1 text-xs text-navy-500">{help}</p>}
    </div>
  );
}
