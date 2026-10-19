# Adding or editing a page

One page = one file `src/content/pages/<id>.ts`, exported with `definePage` (types in `src/lib/guide-types.ts`). The file name is the id. The page is built at `/en/<slug>/`, listed in the menu, the footer, the sitemap and `llms.txt` automatically.

## Page types

- **Guide** (groups `bands`, `discounts`, `premiums`, `paying`, `nations`): `mini` tool (a spec of `src/lib/mini-specs.ts`), citable block + body of 1,200 words or more.
- **Council or region page** (groups `councils`, `regions`): `tool: { kind: 'ct', props: { council: '<id>', band: <0-8> } }`, the full calculator on the first screen, 480 to 700 words of text (tables are not counted).

## Rules checked by `npx vitest run tests/pages.test.ts`

- `title` 50 to 60 characters, key term first, never starting with the country or a tool word (UK, England, Calculator, How...). `description` 150 to 160 characters.
- `resume`: one paragraph of 120 words or more that answers the page's question with figures.
- `faqs`: 3 to 8 questions, answers of 40 to 90 words, each question used once on the whole site.
- No em dash anywhere. British English. No personal advice.
- Internal links only through `h.a('<page id>', text)` or `h.ca('<council id>')`; unknown ids fail the test.
- Every figure comes from the engine (`h.E.bill`, `h.E.bandCharge`, `h.c(id).bandD`, `h.P...`): never type an amount, a rate or a date that exists in `src/data/params-2026.json` or `src/data/councils-2026.json`.
- At least two `sources` keys of the parameter file; cite them in the text with `h.src(key, text)`.
- A page shares no paragraph with another page: write each one for its own question.

## Data

Council figures: `python3 scripts/data/build-councils.py` regenerates `src/data/councils-2026.json` from the official spreadsheets in `data/raw/` (see `data/raw/SOURCES.md`). National rules: `src/data/params-2026.json`, each entry with its official source. Next year: download the new tables, update the file names in the script and the parameters, run `npm test`.
