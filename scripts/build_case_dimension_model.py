import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'data/case-models.v1.json').read_text())['models']
profiles={'乾':('金','西北','父/老人',['首','骨','肺'],['马','金玉','圆物']), '兑':('金','西','少女',['口'],['羊','金器','缺口物']), '离':('火','南','中女',['目'],['火','文书','中虚物']), '震':('木','东','长男',['足'],['雷','龙','树木']), '巽':('木','东南','长女',['股'],['风','草木','鸡']), '坎':('水','北','中男',['耳'],['水','豕','血']), '艮':('土','东北','少男',['手'],['山','狗','门阙']), '坤':('土','西南','母/老妇',['腹'],['牛','田土','方物'])}
profiles['兌']=profiles['兑']; profiles['離']=profiles['离']
out=[]
for c in data:
 r=c['calculated']; up,lo,body,use=r['upper'],r['lower'],r['body'],r['use']
 def profile(n):
  n={'兌':'兑','離':'离','巽':'巽','坎':'坎','艮':'艮','坤':'坤','乾':'乾','震':'震'}.get(n,n)
  e,d,f,b,o=profiles[n]; return {'element':e,'direction':d,'family':f,'body':b,'objects':o}
 dims={'method':{'value':c['method'],'status':'source'},'structure':{'upper':up,'lower':lo,'outer':up,'inner':lo,'movingLines':[r['movingLine']],'changed':r['changedUpper']+r['changedLower'],'mutual':r['mutualUpper']+r['mutualLower'],'status':'calculated'},'bodyUse':{'body':body,'use':use,'status':'rule-derived'},'elements':{'body':profile(body)['element'],'use':profile(use)['element'],'relation':'待由主题规则解释','status':'calculated'},'guaImages':{'upper':profile(up),'lower':profile(lo),'body':profile(body),'use':profile(use),'status':'candidate'},'meaning':{'sourceStatements':[x['statement'] for x in c['reasoning'] if x['stage']=='interpretation'],'status':'source-conditioned'},'context':{'available':[],'missing':['intent','season','direction','motion','externalSigns'],'status':'incomplete'},'differences':[],'outcome':{'status':'excluded','reason':'本阶段只建立维度对应，不生成最终结果'}}
 if c['title']=='觀梅占': dims['context']={'available':['观梅、二雀争枝、坠地、申时'],'missing':['用户意图、现场方位、动静状态'],'status':'partial'}; dims['guaImages']['candidateLinks']=['兑→少女','巽→股','艮→止/土']
 if c['title']=='牡丹占': dims['context']={'available':['牡丹盛开、午时后验'],'missing':['用户意图、方位、动静状态'],'status':'partial'}; dims['guaImages']['candidateLinks']=['乾→马','离→明/午']
 if c['title']=='鄰夜扣門借物占': dims['context']={'available':['夜晚、酉时、敲击一声五声、借物'],'missing':['用户意图'],'status':'partial'}; dims['guaImages']['candidateLinks']=['乾→短/金','巽→长/木']
 if c['title']=='今日動靜如何': dims['context']={'available':['六字问语、平仄声调'],'missing':['现代语音标注、用户意图'],'status':'partial'}; dims['guaImages']['candidateLinks']=['兑→口','坤→腹/黍稷']
 if c['title']=='西林寺牌額占': dims['context']={'available':['西林寺牌额、西字七画、林字八画、改字分支'],'missing':['用户意图'],'status':'partial'}; dims['differences'].append('原文使用寺庙纯阳与重阴剥阳的情境解释，不能只用体用比和替代')
 if c['title'] in ('老人有憂色占','少年有喜色占','牛哀鳴占','雞悲鳴占','枯枝墜地占'): dims['context']['available']=['人物/动物/物象','方位','声音或状态','时间']; dims['context']['status']='partial'
 if c['title'] in ('少年有喜色占','牛哀鳴占'): dims['differences'].append('原文互变生克表述与标准结构计算存在待校勘差异')
 out.append({'id':c['id'],'title':c['title'],'source':c['source'],'dimensions':dims})
result={'version':'case-dimension-v1','purpose':'建立卦、象、义、条件与差异的对应模型，不生成最终结果','dimensions':['structure','bodyUse','elements','guaImages','meaning','context','differences'],'cases':out}
(root/'data/case-dimensions.v1.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(f'Built {len(out)} case dimension models')
