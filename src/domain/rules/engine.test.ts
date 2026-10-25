import {describe,expect,it} from 'vitest'
import {deriveDateTime} from '../divination'
import {builtInPlugins} from './plugins'
import {evaluateRules} from './engine'
describe('plugin rule engine',()=>{it('evaluates intent plugins and reports conflicts',()=>{const r=evaluateRules(deriveDateTime(5,12,17,9),'relationship',builtInPlugins);expect(r.enabledPlugins).toContain('intent-relationship@classic-v1');expect(r.findings.length).toBe(3);expect(r.conflicts.length).toBeGreaterThanOrEqual(0)})})
