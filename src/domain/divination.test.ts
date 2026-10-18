import { describe, expect, it } from 'vitest'
import { deriveDateTime } from './divination'
describe('classic-v1 datetime derivation', () => {
  it('matches 觀梅占 baseline', () => {
    const r = deriveDateTime(5,12,17,9)
    expect(r.upper).toBe('兌'); expect(r.lower).toBe('離'); expect(r.original).toBe('澤火革'); expect(r.movingLine).toBe(1); expect(r.changed).toBe('澤山咸')
    expect(r.body).toBe('兌'); expect(r.use).toBe('離'); expect(r.relation).toBe('用克体')
  })
  it('matches 牡丹占 baseline', () => {
    const r = deriveDateTime(6,3,16,4)
    expect(r.upper).toBe('乾'); expect(r.lower).toBe('巽'); expect(r.movingLine).toBe(5); expect(r.original).toBe('天風姤'); expect(r.changed).toBe('火風鼎')
  })
})
