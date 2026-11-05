"""Extract source-grounded case models without changing application rules."""
from pathlib import Path
import json, re, hashlib
ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'books/meihua_yishu.txt'
lines = SOURCE.read_text().splitlines()
# name, upper input, lower input, moving total, method, reasoning, outcome status
specs = [
('觀梅占',34,43,43,'datetime','兌金为体、離火克体；巽为股且受金克；变艮土生体。女子、伤股与明晚是原书取象及语境判断，不由算术唯一推出。','未在本节独立记载后验'),
('牡丹占',25,29,29,'datetime','巽木为体，乾金及重乾互卦克体；乾取马象，午时取离明象。','本节记载次日午时马践花'),
('鄰夜扣門借物占',1,5,16,'sound','金短木长对应金木器具；斧与锄均为候选，再以夜间劈柴用途取斧。','本节记载借斧'),
('今日動靜如何',8,5,13,'tone','坤腹、兑口取饮食象；缺坎取酒不多；坤独立取客少。平仄取值采用原书，不用现代普通话自动替代。','本节笼统记载至晚果然'),
('西林寺牌額占',7,8,15,'strokes','按题额实际笔画取数；一般体用比和却取群阴剥阳之象，属于明确的情境例外；改字是反事实分支。','本节叙述询问证实与改字后无事'),
('老人有憂色占',1,5,10,'object-direction','老人取乾、巽方取巽；巽木体受乾金克，互重乾；行走取总数一半为五日。','本节记载五日后事件'),
('少年有喜色占',7,3,17,'object-direction','少年取艮、离方取离；离体，结合喜色与爻辞取婚聘；互卦震坎含生体与克体，不能照抄为全部生体。','本节记载至期定亲'),
('牛哀鳴占',8,6,21,'object-direction','牛坤、北坎；坤体，震木克体、巽变克体；下互坤为比和，原文互变俱克需标注。','预言二十一日内，叙事记载二十日'),
('雞悲鳴占',5,1,10,'object-direction','鸡巽、乾方；乾体，互离克金，巽木离火取烹饪象；爻辞需结合主题解释。','本节记载十日'),
('枯枝墜地占',3,2,10,'object-direction','槁木离、兑方；兑金体受离火克；睽损取伤残象；元夫是事后叙事对应，非确定算法。','本节记载十日伐树'),
]
trigrams=['乾','兌','離','震','巽','坎','艮','坤']
bits=['111','110','101','100','011','010','001','000']
lookup=dict(zip(bits,trigrams)); byname=dict(zip(trigrams,bits))
def positive_mod(n,d): return (n-1)%d+1
def structural(up,lo,total):
 u,l=trigrams[positive_mod(up,8)-1],trigrams[positive_mod(lo,8)-1]
 ys=list(byname[l]+byname[u]); moving=positive_mod(total,6); changed=ys.copy(); changed[moving-1]='1' if ys[moving-1]=='0' else '0'
 return {'upper':u,'lower':l,'movingLine':moving,'linesBottomUp':[int(v) for v in ys], 'changedUpper':lookup[''.join(changed[3:])],'changedLower':lookup[''.join(changed[:3])], 'mutualUpper':lookup[''.join(ys[2:5])],'mutualLower':lookup[''.join(ys[1:4])], 'body':u if moving<=3 else l,'use':l if moving<=3 else u}
models=[]
for title,up,lo,total,method,reason,outcome in specs:
 start=next(i for i,x in enumerate(lines) if x==f'=== {title} ===')
 end=next((i for i in range(start+1,len(lines)) if lines[i].startswith('===')),len(lines))
 raw='\n'.join(lines[start:end]).strip()
 models.append({'id':f'case-{start+1}','title':title,'method':method,'source':{'file':'books/meihua_yishu.txt','startLine':start+1,'endLine':end},'original':raw,'inputs':{'upperNumber':up,'lowerNumber':lo,'movingTotal':total,'provenance':'原书明确数值，非由结果倒推'},'calculated':structural(up,lo,total),'reasoning':[{'stage':'calculation','kind':'deterministic','formula':f'上卦 mod8({up})；下卦 mod8({lo})；动爻 mod6({total})'},{'stage':'interpretation','kind':'source-conditioned','statement':reason}], 'reportedOutcome':outcome,'outcomeUse':'仅作书中叙事记录，不参与规则执行或作为现实准确率证据'})
# Independently model the altered inscription, keeping original observation separate.
models[4]['branches']=[{'label':'林字加两勾','inputs':{'upperNumber':7,'lowerNumber':10,'movingTotal':17},'calculated':structural(7,10,17)}]
additional=[]
for a,b,label in [(1103,1105,'加姓起卦'),(1106,1112,'田王韩三家屋宅'),(1132,1166,'变卦式八则'),(1349,1353,'观物用易二例')]:
 additional.append({'title':label,'source':{'startLine':a,'endLine':b},'original':'\n'.join(lines[a-1:b]),'status':'部分缺输入或存在矛盾，保留原文待校勘，不补造数值'})
data={'version':'case-model-v1','sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'models':models,'additionalCaseGroups':additional}
(ROOT/'data/case-models.v1.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
md=['# 原书案例与推导模型','', '## 范围与边界','', '完成卷一十个连续命名案例的逐例建模；卷二、卷三附加案例组保留原文与待校勘状态。此为案例研究模型，不代表穷尽全书每个散见举例，也未接入现有前端引擎。','', '## 统一推导模型','', '事实输入 → 占法取数 → 本卦及动爻 → 变卦互卦 → 体用 → 生克与阶段 → 类象候选 → 语境筛选 → 应期假设 → 结论及未决项。','', '- 确定层：正余数、六爻阴阳、变爻、上下互卦、单动爻体用。','- 条件层：占问对象、五行、旺衰、爻辞与外应，缺信息即停止相关判断。','- 解释层：取象、应期、候选筛选，保留原书理由，不编码成唯一事实。','- 结果层：书中后验记载与推理输入隔离，避免以结果反推规则。','', '## 案例模型','']
for c in models:
 r=c['calculated'];md += [f"### {c['title']}",'',f"来源：books/meihua_yishu.txt:{c['source']['startLine']}。",'',c['reasoning'][0]['formula'], '',f"结构复核：上{r['upper']}、下{r['lower']}；第{r['movingLine']}爻；变上{r['changedUpper']}下{r['changedLower']}；互上{r['mutualUpper']}下{r['mutualLower']}；体{r['body']}、用{r['use']}。",'',c['reasoning'][1]['statement'],'',f"书中记载：{c['reportedOutcome']}。",'']
md += ['## 校勘与不可直接推广项','','- 少年占：按标准互卦为上震下坎，坎水克离火，与“互变俱生之”不完全一致。','- 牛占：互卦上坤下震，坤土比和而非克体，与“互变俱克”不完全一致。','- 加数例：王姓总数27余3，原文却写“余三为初爻”；屋宅段又以22、29、31定年，不能直接统一为前文总数。','- 观物泰卦初变升：标准泰初爻变为升；其标准互卦上震下兑，文中颜色根部取象需要人工解释。','- 鼎变恒的标准变化在第四爻，但引用“鼎玉铉”为上爻辞；保留而不静默修正。','- 乾坤互卦例外应由规则版本明确，本批命名案例不涉及此特例。','', '## 复现','','运行 `python3 scripts/extract_case_models.py` 生成资料；运行 `python3 scripts/verify_case_models.py` 验证原文范围、结构转换和案例算术。']
(ROOT/'docs/case-derivation-model.md').write_text('\n'.join(md)+'\n')
print(f'Generated {len(models)} complete case structures and {len(additional)} supplementary groups')
