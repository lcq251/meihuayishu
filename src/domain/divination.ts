export type TrigramName = '乾'|'兌'|'離'|'震'|'巽'|'坎'|'艮'|'坤'
export type Element = '金'|'木'|'水'|'火'|'土'
export type Step = { index:number; title:string; formula:string; result:string; sourceRefs:string[] }
export type DivinationResult = { method:string; upper:TrigramName; lower:TrigramName; original:string; movingLine:number; changed:string; mutual:string; body:TrigramName; use:TrigramName; relation:string; total:number; steps:Step[] }

const trigrams: {name:TrigramName; number:number; element:Element; binary:string}[] = [
  {name:'乾',number:1,element:'金',binary:'111'},{name:'兌',number:2,element:'金',binary:'110'},
  {name:'離',number:3,element:'火',binary:'101'},{name:'震',number:4,element:'木',binary:'100'},
  {name:'巽',number:5,element:'木',binary:'011'},{name:'坎',number:6,element:'水',binary:'010'},
  {name:'艮',number:7,element:'土',binary:'001'},{name:'坤',number:8,element:'土',binary:'000'},
]
const byNumber = (n:number) => trigrams[(n - 1) % 8]
const byName = (n:TrigramName) => trigrams.find(t=>t.name===n)!
const knownHexagrams: Record<string,string> = {
  '兌離':'澤火革','乾巽':'天風姤','乾乾':'重乾','離巽':'火風鼎','兌艮':'澤山咸',
}
const hexagram = (upper:TrigramName, lower:TrigramName) => knownHexagrams[upper+lower] ?? `${upper}${lower}`
const relation = (body:TrigramName, use:TrigramName) => {
  const b=byName(body).element, u=byName(use).element
  if (b===u) return '比和'
  if ({金:'水',水:'木',木:'火',火:'土',土:'金'}[b]===u) return '体生用'
  if ({金:'木',木:'土',土:'水',水:'火',火:'金'}[b]===u) return '体克用'
  if ({金:'土',土:'火',火:'木',木:'水',水:'金'}[b]===u) return '用生体'
  return '用克体'
}

export function trigramForNumber(value:number): TrigramName {
  if (!Number.isInteger(value) || value < 1) throw new Error('数值必须是正整数')
  return byNumber(value).name
}

function toggle(binary:string, index:number) {
  const chars = binary.split('')
  chars[index] = chars[index] === '1' ? '0' : '1'
  return chars.join('')
}
function trigramFromBinary(binary:string): TrigramName { return trigrams.find(t=>t.binary===binary)!.name }

export function deriveDateTime(yearNumber:number, month:number, day:number, hourNumber:number): DivinationResult {
  for (const value of [yearNumber,month,day,hourNumber]) if (!Number.isInteger(value) || value < 1) throw new Error('年月日时必须为正整数')
  const dateTotal = yearNumber + month + day; const total = dateTotal + hourNumber
  const upper = byNumber(dateTotal).name; const lower = byNumber(total).name; const movingLine = ((total - 1) % 6) + 1
  const upperBits = byName(upper).binary, lowerBits = byName(lower).binary
  const changedBits = movingLine <= 3 ? `${upperBits}${toggle(lowerBits, movingLine-1)}` : `${toggle(upperBits, movingLine-4)}${lowerBits}`
  const changed = hexagram(trigramFromBinary(changedBits.slice(0,3)), trigramFromBinary(changedBits.slice(3)))
  const body = movingLine <= 3 ? upper : lower, use = movingLine <= 3 ? lower : upper
  const mutualUpper = trigramFromBinary(`${upperBits[1]}${upperBits[2]}${lowerBits[0]}`)
  const mutualLower = trigramFromBinary(`${lowerBits[1]}${lowerBits[2]}${upperBits[2]}`)
  const steps:Step[] = [
    {index:1,title:'计算年月日总数',formula:`${yearNumber} + ${month} + ${day}`,result:String(dateTotal),sourceRefs:['book/meihua_yishu.txt:60-61']},
    {index:2,title:'取上卦',formula:`${dateTotal} ÷ 8`,result:`余数 ${byNumber(dateTotal).number} → ${upper}`,sourceRefs:['book/meihua_yishu.txt:48-50','book/meihua_yishu.txt:60-61']},
    {index:3,title:'计算年月日時总数',formula:`${dateTotal} + ${hourNumber}`,result:String(total),sourceRefs:['book/meihua_yishu.txt:60-61']},
    {index:4,title:'取下卦',formula:`${total} ÷ 8`,result:`余数 ${byNumber(total).number} → ${lower}`,sourceRefs:['book/meihua_yishu.txt:48-50','book/meihua_yishu.txt:60-61']},
    {index:5,title:'取动爻',formula:`${total} ÷ 6`,result:`第 ${movingLine} 爻`,sourceRefs:['book/meihua_yishu.txt:52-53']},
    {index:6,title:'生成变卦与互卦',formula:`第 ${movingLine} 爻阴阳互变；取中间四爻`,result:`${changed}；互卦 ${mutualUpper}${mutualLower}`,sourceRefs:['book/meihua_yishu.txt:53-58']},
    {index:7,title:'判定体用',formula:`动爻在${movingLine <= 3 ? '下卦' : '上卦'}`,result:`体 ${body}，用 ${use}；${relation(body,use)}`,sourceRefs:['book/meihua_yishu.txt:154-157']},
  ]
  return {method:'年月日時占',upper,lower,original:hexagram(upper,lower),movingLine,changed,mutual:`${mutualUpper}${mutualLower}`,body,use,relation:relation(body,use),total,steps}
}
