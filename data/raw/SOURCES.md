# Raw official files (read 2026-10-19)

| File | Publisher | URL |
|---|---|---|
| Table_10_2026-27.ods | MHCLG, Council tax levels set by local authorities in England 2026 to 2027 (Table 10, Band D by component) | https://assets.publishing.service.gov.uk/media/6a02eeeccd2e0e8b5b20b449/Table_10_2026-27.ods |
| Tables_1-9_2026-27.ods | MHCLG, same release, Tables 1 to 9 (Table 9: area council tax by band, two adults) | https://assets.publishing.service.gov.uk/media/69de1fa63e81003ae0422508/Tables_1-9_2026-27.ods |
| Tables_1-9_2025-26.ods | MHCLG, 2025 to 2026 edition (previous year's Band D) | https://assets.publishing.service.gov.uk/media/69e88e1c9ca985145673b7f4/Tables_1-9_2025-26.ods |
| wales-2026-27.xlsx | Welsh Government, Council tax levels April 2026 to March 2027 | https://www.gov.wales/sites/default/files/statistics-and-research/2026-03/council-tax-levels-april-2026-march-2027-153478.xlsx |
| scot-2026-27.xlsx | Scottish Government, CTAS 2026, Council Tax by Band 2026-27 | https://www.gov.scot/publications/council-tax-datasets/ |
| scot-2025-26.xlsx | Scottish Government, Council Tax by Band 2025-26 | https://www.gov.scot/publications/council-tax-datasets/ |

Regenerate `src/data/councils-2026.json` with `python3 scripts/data/build-councils.py`. The script checks that Table 9's Band D equals the sum of Table 10's parts for every English council and that it finds 296, 22 and 32 councils.
gov.wales answers 403 to a plain curl: download with a browser user agent.
