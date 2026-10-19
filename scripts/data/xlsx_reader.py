"""Lecteur XLSX minimal (stdlib)."""
import zipfile, re, xml.etree.ElementTree as ET
N='{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
R='{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
def _col(ref):
    c=re.match(r'[A-Z]+',ref).group(0); n=0
    for ch in c: n=n*26+ord(ch)-64
    return n-1
def read(path, sheets=None):
    z=zipfile.ZipFile(path); ss=[]
    if 'xl/sharedStrings.xml' in z.namelist():
        for si in ET.fromstring(z.read('xl/sharedStrings.xml')).iter(N+'si'):
            ss.append(''.join(t.text or '' for t in si.iter(N+'t')))
    wb=ET.fromstring(z.read('xl/workbook.xml'))
    rels={r.get('Id'):r.get('Target') for r in ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
    out={}
    for s in wb.iter(N+'sheet'):
        name=s.get('name')
        if sheets and name not in sheets: continue
        tgt=rels[s.get(R+'id')].lstrip('/'); tgt=tgt if tgt.startswith('xl/') else 'xl/'+tgt
        rows=[]
        for r in ET.fromstring(z.read(tgt)).iter(N+'row'):
            vals=[]
            for c in r.iter(N+'c'):
                i=_col(c.get('r')); v=c.find(N+'v'); t=c.get('t')
                if t=='s' and v is not None: val=ss[int(v.text)]
                elif t=='inlineStr': val=''.join(x.text or '' for x in c.iter(N+'t'))
                else: val=v.text if v is not None else ''
                while len(vals)<i: vals.append('')
                vals.append(val)
            rows.append(vals)
        out[name]=rows
    return out
