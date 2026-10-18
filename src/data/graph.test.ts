import { describe, expect, it } from 'vitest'
import { graphEdges, graphNodes } from './graph'
describe('knowledge graph',()=>{it('contains connected source relationships',()=>{const ids=new Set(graphNodes.map(n=>n.id));expect(graphEdges.every(e=>ids.has(e.from)&&ids.has(e.to))).toBe(true);expect(graphEdges.filter(e=>e.from==='rule-date')).toHaveLength(2)})})
