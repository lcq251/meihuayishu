import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
base=json.loads((root/'data/case-models.v1.json').read_text())['models']
terms={
'觀梅占':[('康節先生','人物','subject',['乾'],['先生/长者']),('二雀','动物','object',['巽'],['鸟']),('爭枝','动作','action',['震','巽'],['争动','木']),('墜地','状态','action',['坤','艮'],['下坠','落地']),('梅','植物','object',['巽'],['花木']),('申時','时间','time',['坤'],['申金时'])],
'牡丹占':[('先生','人物','subject',['乾'],['长者']),('客','人物','subject',['兑'],['来客']),('牡丹','植物','object',['巽','离'],['花盛','文彩']),('花盛','状态','evidence',['离'],['盛明']),('馬','动物','object',['乾'],['马']),('踐毀','动作','action',['兑'],['毁折']),('午時','时间','time',['离'],['午火','明'])],
'鄰夜扣門借物占':[('鄰夜','时间','environment',['坎'],['夜']),('扣門','动作','action',['震'],['敲击']),('一聲','声音','evidence',['乾'],['一数']),('五聲','声音','evidence',['巽'],['五数']),('借物','动作','action',['兑'],['口言']),('斧','物品','object',['乾','巽'],['金短木长']),('鋤','物品','object',['坤','巽'],['候选器物'])],
'今日動靜如何':[('今日','时间','time',[],['当日']),('動','动作','action',['震'],['动']),('靜','状态','environment',['艮'],['静']),('口腹','身体','evidence',['兑','坤'],['饮食']),('黍雞','物品','object',['坤'],['黍稷']),('酒','物品','object',['坎'],['水'])],
'西林寺牌額占':[('西林寺','名称','environment',['兑','艮'],['寺额']),('西','文字','evidence',['艮'],['七画']),('林','文字','evidence',['坤'],['八画']),('兩勾','文字','evidence',['兑'],['十画分支']),('陰人','人物','evidence',['坤'],['阴象'])],
'老人有憂色占':[('老人','人物','subject',['乾'],['老人']),('巽方','方位','environment',['巽'],['东南']),('憂色','状态','evidence',['坎'],['忧']),('途行','动作','environment',['震'],['行走']),('魚骨','物品','object',['坎'],['鱼骨'])],
'少年有喜色占':[('少年','人物','subject',['艮'],['少男']),('離方','方位','environment',['离'],['南']),('喜色','状态','evidence',['兑','离'],['喜悦','明']),('聘幣','物品','object',['乾','坤'],['婚聘']),('十七日','时间','time',[],['应期记录'])],
'牛哀鳴占':[('牛','动物','subject',['坤'],['牛']),('坎方','方位','environment',['坎'],['北']),('哀鳴','声音','evidence',['坎'],['悲声']),('屠殺','动作','action',['兑','离'],['毁折','烹饪'])],
'雞悲鳴占':[('雞','动物','subject',['巽'],['鸡']),('乾方','方位','environment',['乾'],['西北']),('悲鳴','声音','evidence',['坎'],['悲声']),('烹雞','动作','action',['离','兑'],['烹饪','毁折']),('十日','时间','time',[],['应期记录'])],
'枯枝墜地占':[('枯枝','植物','subject',['离','震','巽'],['槁木','枯槁']),('無風','状态','environment',['艮'],['静止']),('墜地','动作','action',['坤','艮'],['落地']),('兌方','方位','environment',['兑'],['西']),('伐樹','动作','action',['乾','兑'],['斧伐','毁折']),('元夫','人物','evidence',['乾'],['爻辞人名'])]
}
bytitle={c['title']:c for c in base}; out=[]
for title,entries in terms.items():
 c=bytitle[title]; r=c['calculated']; out.append({'id':c['id'],'title':title,'source':c['source'],'resultReference':{'original':r['upper']+r['lower'],'movingLine':r['movingLine'],'changed':r['changedUpper']+r['changedLower'],'mutual':r['mutualUpper']+r['mutualLower'],'body':r['body'],'use':r['use']},'attributes':[{'term':t,'category':cat,'role':role,'candidateTrigrams':tris,'candidateAttributes':attrs,'sourceLine':c['source']['startLine'],'evidenceStatus':'source-explicit'} for t,cat,role,tris,attrs in entries],'finalResult':{'status':'excluded','reason':'仅建立词项与维度属性，不输出最终解卦'}})
(root/'data/case-attributes.v1.json').write_text(json.dumps({'version':'case-attribute-v1','purpose':'逐词逐名属性对应模型，不生成最终结果','cases':out},ensure_ascii=False,indent=2)+'\n')
print(f'Built attributes for {len(out)} cases and {sum(len(c["attributes"]) for c in out)} terms')
