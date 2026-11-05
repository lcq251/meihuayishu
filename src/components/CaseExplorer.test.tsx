import {describe,expect,it} from 'vitest'
import rawCases from '../../data/case-models.v1.json'
describe('case model fixtures',()=>{it('has ten source-grounded cases',()=>{expect(rawCases.models).toHaveLength(10);expect(rawCases.models.every(c=>c.source.startLine>0&&c.reasoning.length>0)).toBe(true)})})
