import type { DivinationResult } from '../divination'
export type Intent = 'general'|'relationship'|'wealth'|'house'|'travel'|'weather'
export type Polarity = 'positive'|'negative'|'neutral'
export type RuleContext = { intent:Intent; result:DivinationResult }
export type RuleFinding = {ruleId:string; label:string; polarity:Polarity; confidence:number; evidence:string[]; sourceRefs:string[]; conflicts?:string[]}
export type RulePlugin = {id:string; version:string; enabled:boolean; intents:Intent[]; priority:number; evaluate(context:RuleContext):RuleFinding[]}
