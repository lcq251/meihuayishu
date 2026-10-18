import { describe, expect, it } from 'vitest'
import { deriveDateTime } from './divination'
import { explainResult } from './explanation'
describe('template explanation',()=>{it('keeps evidence and uncertainty visible',()=>{const e=explainResult(deriveDateTime(5,12,17,9));expect(e.summary).toContain('澤火革');expect(e.evidence.length).toBe(7);expect(e.uncertainty.length).toBe(2)})})
