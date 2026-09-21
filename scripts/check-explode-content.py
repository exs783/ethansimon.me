#!/usr/bin/env python3
"""List part numbers in a GLB; with a content json, verify every listed part exists.
usage: check-explode-content.py model.glb [content.json]"""
import json, re, struct, sys, collections

def glb_json(p):
    with open(p, 'rb') as f:
        f.read(12); n, _ = struct.unpack('<II', f.read(8)); return json.loads(f.read(n))

PART = re.compile(r'^([A-Z]+-\d{3}-[A-Z]-[^/]*?)(?:-\d+)?$')
def parts(j):
    c = collections.Counter()
    for n in j['nodes']:
        nm = (n.get('name') or '').split('/')[-1].split('^')[0]
        m = PART.match(nm)
        if m and not m.group(1).split('-')[2] == 'A': c[m.group(1)] += 1
    return c

if __name__ == '__main__':
    have = parts(glb_json(sys.argv[1]))
    by = collections.Counter(k.split('-')[0] for k in have)
    print(dict(by), 'unique parts', len(have))
    if len(sys.argv) > 2:
        want = [p for s in json.load(open(sys.argv[2])) for p in s['parts']]
        miss = [p for p in want if p not in have]
        print('missing:', miss); sys.exit(1 if miss else 0)
