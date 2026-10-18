import { describe, expect, it } from 'vitest'
import { searchKnowledge } from './knowledge'
describe('knowledge search', () => { it('finds rules and cases by keyword', () => { expect(searchKnowledge('五行').length).toBeGreaterThan(0); expect(searchKnowledge('牡丹占')[0].id).toBe('case-mudan') }) })
