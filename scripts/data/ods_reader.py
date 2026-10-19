"""Lecteur ODS minimal (stdlib) : feuilles -> listes de lignes de chaînes."""
import zipfile, xml.etree.ElementTree as ET
T='urn:oasis:names:tc:opendocument:xmlns:table:1.0'; X='urn:oasis:names:tc:opendocument:xmlns:text:1.0'
O='urn:oasis:names:tc:opendocument:xmlns:office:1.0'
def _cell(c):
    v=c.get('{%s}value'%O)
    if v is not None: return v
    return '\n'.join(''.join(p.itertext()) for p in c.findall('{%s}p'%X))
def read(path, sheets=None, maxcol=200):
    root=ET.fromstring(zipfile.ZipFile(path).read('content.xml')); out={}
    for t in root.iter('{%s}table'%T):
        name=t.get('{%s}name'%T)
        if sheets and name not in sheets: continue
        rows=[]
        for r in t.iter('{%s}table-row'%T):
            rr=int(r.get('{%s}number-rows-repeated'%T,'1')); vals=[]
            for c in r:
                if c.tag not in ('{%s}table-cell'%T,'{%s}covered-table-cell'%T): continue
                n=int(c.get('{%s}number-columns-repeated'%T,'1')); v=_cell(c)
                vals.extend([v]*min(n,maxcol))
                if len(vals)>maxcol: break
            while vals and vals[-1]=='': vals.pop()
            if not vals and rr>50: break
            for _ in range(min(rr,5000)): rows.append(vals)
        while rows and not rows[-1]: rows.pop()
        out[name]=rows
    return out
