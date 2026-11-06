type TreeNode={label:string;value?:string;children?:TreeNode[]}
export default function CaseRelationTree({title,method,upper,lower,body,use,original,changed,mutual,source}:{title:string;method:string;upper:string;lower:string;body:string;use:string;original:string;changed:string;mutual:string;source:string}){
 const nodes:TreeNode={label:title,children:[{label:'占法',value:method},{label:'排盘结构',children:[{label:'外卦 / 上卦',value:upper},{label:'内卦 / 下卦',value:lower},{label:'本卦',value:original},{label:'动爻与变化',children:[{label:'变卦',value:changed},{label:'互卦',value:mutual}]}]},{label:'体用',children:[{label:'体卦',value:body},{label:'用卦',value:use}]},{label:'原文来源',value:source}]}
 const render=(n:TreeNode):React.ReactNode=><li key={n.label+(n.value||'')}>{n.children?.length?<details open><summary>{n.label}{n.value&&<b>{n.value}</b>}</summary><ul>{n.children.map(render)}</ul></details>:<span className="tree-leaf">{n.label}{n.value&&<b>{n.value}</b>}</span>}</li>
 return <div className="case-relation-tree"><h3>案例关系树</h3><ul>{render(nodes)}</ul></div>
}
