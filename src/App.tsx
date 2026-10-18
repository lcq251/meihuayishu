import { useState } from 'react'
import { deriveDateTime, type DivinationResult } from './domain/divination'
import { searchKnowledge } from './data/knowledge'
import KnowledgeGraph from './components/KnowledgeGraph'
import { explainResult } from './domain/explanation'
import './styles.css'
const fields = ['year','month','day','hour'] as const
export default function App() {
 const [values,setValues]=useState({year:'5',month:'12',day:'17',hour:'9'}); const [result,setResult]=useState<DivinationResult|null>(null); const [error,setError]=useState(''); const [query,setQuery]=useState('')
 const submit=(e:React.FormEvent)=>{e.preventDefault();try{const nums=fields.map(k=>Number(values[k]));if(nums.some(n=>!Number.isInteger(n)||n<1))throw new Error('请输入正整数');setResult(deriveDateTime(...nums as [number,number,number,number]));setError('')}catch(e){setError(e instanceof Error?e.message:'输入无效');setResult(null)}}
 return <main><h1>梅花易數 · 可复核推导</h1><p className="intro">classic-v1：年月日時占。每个结论都保留计算式和原文出处。</p><form onSubmit={submit}>{fields.map((key,i)=><label key={key}>{['年数','月','日','时数'][i]}<input type="number" min="1" value={values[key]} onChange={e=>setValues({...values,[key]:e.target.value})}/></label>)}<button>开始推导</button>{error&&<span className="error">{error}</span>}</form>
 {result&&<section><h2>{result.original} · 动爻：第 {result.movingLine} 爻</h2><div className="hexagram">{Array.from({length:6},(_,i)=><span key={i} className={i===result.movingLine-1?'moving':''}>{i%2?'━━━━ ━━━━':'━━━━━━━━'} {i===result.movingLine-1?'●':''}</span>)}</div><div className="cards"><div>上卦：{result.upper}</div><div>下卦：{result.lower}</div><div>变卦：{result.changed}</div><div>互卦：{result.mutual}</div><div>体卦：{result.body}</div><div>用卦：{result.use}</div><div>五行关系：{result.relation}</div></div><h3>推导步骤</h3><ol>{result.steps.map(s=><li key={s.index}><details><summary><b>{s.title}</b>：{s.result}</summary><p>{s.formula}</p><small>原文依据：{s.sourceRefs.join('；')}</small></details></li>)}</ol></section>}
 <section className="explanation">{result&&<><h2>传统解释（模板）</h2><p>{explainResult(result).summary}</p><details><summary>查看计算依据</summary><ul>{explainResult(result).evidence.map(x=><li key={x}>{x}</li>)}</ul></details><p className="notice">{explainResult(result).uncertainty.join(' ')}</p></>}</section> <section className="knowledge"><h2>原文知识库</h2><input aria-label="搜索知识库" placeholder="搜索卦象、五行、占法或案例" value={query} onChange={e=>setQuery(e.target.value)}/><div className="knowledge-list">{searchKnowledge(query).map(item=><article key={item.id}><h3>{item.title} <small>{item.category}</small></h3><p>{item.content}</p><small>来源：{item.source}</small><div>{item.tags.map(tag=><span className="tag" key={tag}>{tag}</span>)}</div></article>)}</div><h2>知识图谱</h2><KnowledgeGraph/></section></main>
}
