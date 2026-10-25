import type { DivinationResult } from '../divination'
import type { Intent, RuleFinding, RulePlugin } from './types'
export type RuleEvaluation={findings:RuleFinding[]; conflicts:string[]; enabledPlugins:string[]}
export function evaluateRules(result:DivinationResult,intent:Intent,plugins:RulePlugin[]):RuleEvaluation{const active=plugins.filter(p=>p.enabled&&p.intents.includes(intent)).sort((a,b)=>b.priority-a.priority);const findings=active.flatMap(p=>p.evaluate({intent,result}));const polarities=new Set(findings.map(f=>f.polarity).filter(p=>p!=='neutral'));const conflicts=polarities.size>1?['同时存在有利与不利规则，需要结合互卦、变卦和旺衰复核']:[];return {findings,conflicts,enabledPlugins:active.map(p=>`${p.id}@${p.version}`)}}
