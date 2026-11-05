export function SourceTip({refs}:{refs:string[]}){return <span className="source-tip" tabIndex={0}>ⓘ<span className="tooltip">来源：梅花易數<br/>{refs.join('；')}<br/>悬浮查看原文依据</span></span>}
