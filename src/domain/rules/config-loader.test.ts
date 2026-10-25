import {describe,expect,it} from 'vitest'
import {loadConfiguredPlugins,validateConfigRules} from './config-loader'
describe('configured rules',()=>{it('loads versioned rule plugins',()=>{const plugins=loadConfiguredPlugins();expect(plugins.some(p=>p.id==='classic-body-use')).toBe(true);expect(plugins.some(p=>p.id==='intent-wealth')).toBe(true)});it('rejects incomplete config',()=>{expect(()=>validateConfigRules([] as never)).toThrow()})})
