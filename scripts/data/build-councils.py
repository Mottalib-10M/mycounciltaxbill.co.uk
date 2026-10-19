#!/usr/bin/env python3
"""Builds src/data/councils-2026.json from the official files kept in data/raw/ (RECETTE §4).

Replayable: download the same files again (URLs in data/raw/SOURCES.md), run
    python3 -I scripts/data/build-councils.py
and the JSON is rewritten. Standard library only (ODS and XLSX are read as zipped XML).

England  : MHCLG, Council Tax levels set by local authorities in England 2026 to 2027
           (published 25 March 2026). Table 9 gives the area council tax by band for a home with
           two adults, parish precepts averaged in; Table 10 (Data_Billing) gives the parts of the
           Band D figure (billing authority with its parishes, county or GLA, police, fire,
           combined authority). The 2025-26 Table 9 gives last year's Band D.
Wales    : Welsh Government, Council tax levels: April 2026 to March 2027 (Table 1 and Table 2).
Scotland : Scottish Government, Council Tax by band 2026-27 and 2025-26 (water and sewerage
           excluded; Scottish Water charges are in params-2026.json).
"""
import json, os, re, sys, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import ods_reader, xlsx_reader  # noqa: E402

RAW = os.path.join(ROOT, 'data', 'raw')
OUT = os.path.join(ROOT, 'src', 'data', 'councils-2026.json')

REGIONS = {'NE': 'North East', 'NW': 'North West', 'YH': 'Yorkshire and the Humber', 'EM': 'East Midlands',
           'WM': 'West Midlands', 'E': 'East of England', 'L': 'London', 'SE': 'South East', 'SW': 'South West'}
CLASSES = {'ILB': 'Inner London borough', 'OLB': 'Outer London borough', 'MD': 'Metropolitan district',
           'UA': 'Unitary authority', 'SD': 'Shire district'}


def slug(name):
    s = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode()
    s = s.replace('&', 'and').lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def num(x):
    try:
        return round(float(x), 2)
    except (TypeError, ValueError):
        return None


def england():
    t9 = ods_reader.read(os.path.join(RAW, 'Tables_1-9_2026-27.ods'), ['Table_9'])['Table_9']
    t9p = ods_reader.read(os.path.join(RAW, 'Tables_1-9_2025-26.ods'), ['Table_9'])['Table_9']
    t10 = ods_reader.read(os.path.join(RAW, 'Table_10_2026-27.ods'), ['Data_Billing'])['Data_Billing']
    prev = {r[1]: num(r[9]) for r in t9p[3:] if len(r) > 9}
    parts = {r[1]: r for r in t10 if len(r) > 37 and re.match(r'^E\d{8}$', r[1] or '')}
    out = []
    for r in t9[3:]:
        if len(r) < 14 or not re.match(r'^E\d{8}$', r[1] or ''):
            continue
        p = parts[r[1]]
        bands = [num(v) for v in r[6:14]]
        d = num(p[37])
        assert abs(d - bands[3]) < 0.02, (r[2], d, bands[3])
        own_with_parish, own_no_parish = num(p[25]), num(p[27])
        out.append({
            'id': slug(r[2]), 'name': r[2].strip(), 'nation': 'england', 'ons': r[1],
            'region': REGIONS[r[3]], 'cls': CLASSES[r[4]], 'county': None if r[5] in ('[z]', '') or r[4] != 'SD' else r[5],
            'bandD': d, 'bandDPrev': prev.get(r[1]), 'bands': bands,
            'parts': {
                'council': own_no_parish, 'parish': round(own_with_parish - own_no_parish, 2),
                'county': num(p[33]) or 0, 'police': num(p[34]) or 0, 'fire': num(p[35]) or 0, 'combined': num(p[36]) or 0,
                'asc': num(p[29]),
            },
            'parishes': int(float(p[38])) if num(p[38]) is not None else None,
        })
    return out


def wales():
    w = xlsx_reader.read(os.path.join(RAW, 'wales-2026-27.xlsx'), ['Table1', 'Table2'])
    t2 = {r[0].strip(): r for r in w['Table2'][2:] if len(r) > 9 and r[0]}
    out = []
    for r in w['Table1'][2:]:
        if not r or not r[0] or r[0].strip().lower().startswith('wales') or num(r[1]) is None:
            continue
        name = r[0].strip(); d = num(r[1]); c = t2[name]
        out.append({
            'id': slug(name), 'name': name, 'nation': 'wales', 'ons': None,
            'region': f"{c[9].strip()} Police area", 'cls': 'Principal council', 'county': None,
            'bandD': d, 'bandDPrev': num(c[1]), 'bands': None,
            'parts': {'council': num(r[2]), 'parish': num(r[3]), 'county': 0, 'police': num(r[4]), 'fire': 0, 'combined': 0, 'asc': None},
            'parishes': None,
        })
    return out


def scotland():
    def table(f):
        s = xlsx_reader.read(os.path.join(RAW, f)); rows = s[list(s)[0]]
        return {r[0].strip(): [num(v) for v in r[1:9]] for r in rows[7:] if r and r[0] and num(r[1] if len(r) > 1 else None) is not None}
    cur, prev = table('scot-2026-27.xlsx'), table('scot-2025-26.xlsx')
    out = []
    for name, bands in cur.items():
        nice = name.replace(' & ', ' and ')
        out.append({
            'id': slug(nice), 'name': nice, 'nation': 'scotland', 'ons': None, 'region': 'Scotland', 'cls': 'Council', 'county': None,
            'bandD': bands[3], 'bandDPrev': prev[name][3], 'bands': None,
            'parts': {'council': bands[3], 'parish': 0, 'county': 0, 'police': 0, 'fire': 0, 'combined': 0, 'asc': None},
            'parishes': None,
        })
    return out


def main():
    rows = england() + wales() + scotland()
    ids = [r['id'] for r in rows]
    dup = {i for i in ids if ids.count(i) > 1}
    for r in rows:  # Same name in two nations is not expected; if it happens the nation goes in the slug.
        if r['id'] in dup:
            r['id'] = f"{r['id']}-{r['nation']}"
    counts = {n: sum(1 for r in rows if r['nation'] == n) for n in ('england', 'wales', 'scotland')}
    assert counts == {'england': 296, 'wales': 22, 'scotland': 32}, counts
    doc = {'_about': 'Generated by scripts/data/build-councils.py from data/raw/. Do not edit by hand.',
           'counts': counts, 'councils': rows}
    with open(OUT, 'w') as f:
        json.dump(doc, f, ensure_ascii=False, indent=0)
        f.write('\n')
    print(f'{OUT}: {counts}')


if __name__ == '__main__':
    main()
