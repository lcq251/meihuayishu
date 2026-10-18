import type { DivinationResult } from './divination'
export type Explanation = { summary:string; evidence:string[]; uncertainty:string[] }
export function explainResult(result:DivinationResult):Explanation {
  const relation = result.relation==='用克体' ? '用卦对体卦形成克制，按传统五行关系标记为压力较强。' : result.relation==='用生体' ? '用卦生体卦，按传统五行关系标记为助益。' : result.relation==='体生用' ? '体卦生用卦，按传统五行关系标记为消耗。' : result.relation==='体克用' ? '体卦克用卦，按传统五行关系标记为主动制约。' : '体用五行同类，按传统关系标记为比和。'
  return {summary:`本卦为${result.original}，第${result.movingLine}爻发动，变为${result.changed}；体卦为${result.body}，用卦为${result.use}。${relation}`,evidence:result.steps.map(s=>`${s.title}：${s.result}（${s.sourceRefs.join('、')}）`),uncertainty:['此处是依据 classic-v1 的数理和五行模板生成的传统文本摘要。','具体象意、应期和现实决策仍需结合语境与人工复核；不构成医疗、投资或法律建议。']}
}
