"""Verify extracted evidence and independently check structural case fixtures."""
from pathlib import Path
import json, hashlib
root=Path(__file__).resolve().parents[1]
source=(root/'books/meihua_yishu.txt').read_bytes()
data=json.loads((root/'data/case-models.v1.json').read_text())
assert hashlib.sha256(source).hexdigest()==data['sourceSha256']
lines=source.decode().splitlines()
expected=[('兌','離',1,'兌','艮','乾','巽'),('乾','巽',5,'離','巽','乾','乾'),('乾','巽',4,'巽','巽','乾','乾'),('坤','巽',1,'坤','乾','震','兌'),('艮','坤',3,'艮','艮','坤','坤'),('乾','巽',4,'巽','巽','乾','乾'),('艮','離',5,'巽','離','震','坎'),('坤','坎',3,'坤','巽','坤','震'),('巽','乾',4,'乾','乾','離','兌'),('離','兌',4,'艮','兌','坎','離')]
for c,e in zip(data['models'],expected,strict=True):
 s=c['source']; assert '\n'.join(lines[s['startLine']-1:s['endLine']]).strip()==c['original']
 r=c['calculated']; actual=tuple(r[k] for k in ['upper','lower','movingLine','changedUpper','changedLower','mutualUpper','mutualLower']); assert actual==e,(c['title'],actual,e)
 assert c['reasoning'][1]['kind']=='source-conditioned'
branch=data['models'][4]['branches'][0]['calculated'];assert branch['movingLine']==5 and branch['changedUpper']=='巽' and branch['changedLower']=='兌'
print('PASS: 10 independent case fixtures, source hash/ranges and inscription branch')
