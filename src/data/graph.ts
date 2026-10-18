export type GraphNode = {id:string; label:string; kind:'卦象'|'五行'|'规则'|'案例'}
export type GraphEdge = {from:string; to:string; label:string}
export const graphNodes:GraphNode[] = [
 {id:'gua-dui',label:'兑',kind:'卦象'},{id:'gua-li',label:'离',kind:'卦象'},{id:'gua-qian',label:'乾',kind:'卦象'},{id:'gua-xun',label:'巽',kind:'卦象'},
 {id:'el-metal',label:'金',kind:'五行'},{id:'el-fire',label:'火',kind:'五行'},{id:'el-wood',label:'木',kind:'五行'},
 {id:'rule-date',label:'年月日時占',kind:'规则'},{id:'rule-mutual',label:'互卦',kind:'规则'},{id:'case-mei',label:'观梅占',kind:'案例'},{id:'case-dan',label:'牡丹占',kind:'案例'}
]
export const graphEdges:GraphEdge[] = [
 {from:'gua-dui',to:'el-metal',label:'属'},{from:'gua-li',to:'el-fire',label:'属'},{from:'gua-xun',to:'el-wood',label:'属'},
 {from:'rule-date',to:'case-mei',label:'使用'},{from:'rule-date',to:'case-dan',label:'使用'},
 {from:'case-mei',to:'gua-dui',label:'上卦'},{from:'case-mei',to:'gua-li',label:'下卦'},{from:'case-dan',to:'gua-qian',label:'上卦'},{from:'case-dan',to:'gua-xun',label:'下卦'},
 {from:'rule-mutual',to:'case-mei',label:'解释'}
]
