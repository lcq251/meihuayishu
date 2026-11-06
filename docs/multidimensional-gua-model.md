# 六维排盘多维模型

## 核心原则

以排盘结果为根节点，不从词项重新推导卦。六个核心节点分别挂载结构、文本、类象、时空、关系和证据维度：

```text
本卦 / 动爻 / 变卦 / 互卦 / 体卦 / 用卦
  ├── 卦象结构
  ├── 卦辞与象辞
  ├── 爻辞与爻位
  ├── 八卦类象
  ├── 五行与旺衰
  ├── 人物、身体、动物、物品
  ├── 方位、季节、时辰
  ├── 动作、状态、过程
  ├── 主题属性
  ├── 与其他卦的关系
  └── 原文与案例证据
```

## 六个核心节点

| 节点 | 主要维度 |
|---|---|
| 本卦 | 当前整体格局、卦辞、象辞、上下卦、六爻 |
| 动爻 | 动爻位置、阴阳变化、爻辞、当位、中正、应比 |
| 变卦 | 后续结构、终局卦辞、变化后的体用关系 |
| 互卦 | 中间过程、潜在结构、体互、用互 |
| 体卦 | 主体、自己、承受生克的一方、旺衰 |
| 用卦 | 事情、对象、外部作用、对体的生克 |

## 卦象维度

```ts
type GuaDimension = {
  name: string
  symbol: string
  number?: number
  upper?: string
  lower?: string
  inner?: string
  outer?: string
  lines?: LineDimension[]
  judgment?: TextEvidence
  image?: TextEvidence
  nature?: string[]
  state?: string[]
  process?: string[]
  outcome?: string[]
}
```

## 动爻与爻辞维度

```ts
type LineDimension = {
  position: number
  value?: 6 | 7 | 8 | 9
  yinYang: 'yin' | 'yang'
  changing: boolean
  lineName: string
  lineText?: TextEvidence
  positionAttributes: string[]
  relationAttributes: string[]
  candidateMeanings: string[]
}
```

可记录的爻位属性：

```text
初爻：开始、基层、近事
二爻：内卦中位、承接、柔顺
三爻：内外交界、过渡、易有过失
四爻：外卦初位、接近变化
五爻：外卦中位、主位、中正
上爻：终点、极限、退位
```

这些是候选属性，必须保留规则来源和适用版本。

## 八卦类象维度

```ts
type TrigramAttributes = {
  element: string
  yinYang: string
  direction: string[]
  season: string[]
  family: string[]
  people: string[]
  body: string[]
  animals: string[]
  plants: string[]
  objects: string[]
  colors: string[]
  sounds: string[]
  shapes: string[]
  actions: string[]
  states: string[]
  numbers: number[]
  sourceRefs: string[]
}
```

## 五行与关系维度

```ts
type RelationDimension = {
  from: string
  to: string
  relation: '生' | '克' | '比和' | '泄' | '受生' | '受克'
  strength?: '弱' | '中' | '强'
  seasonFactor?: string
  sourceRefs: string[]
}
```

关系应分别记录：

```text
用 → 体：当前外部作用
互 → 体：中间过程作用
变 → 体：后续或终局作用
体 → 用：主体对事情的作用
体与体同类：体党与体势
用与用同类：用党与外部势力
```

## 象与义维度

```ts
type ImageMeaningDimension = {
  term: string
  category: '人物' | '身体' | '动物' | '植物' | '物品' | '动作' | '状态' | '方位' | '时间' | '声音' | '颜色'
  source: '卦象' | '卦辞' | '爻辞' | '案例' | '上下文'
  candidateMeaning: string
  relatedGua?: string[]
  confidence: '明确' | '候选' | '待确认'
  sourceRefs: string[]
}
```

“象”负责提出候选对象，“义”负责说明传统语义，二者都不能单独生成最终事件。

## 六维统一对象

```ts
type MultiDimensionalChart = {
  chartId: string
  original: GuaDimension
  movingLines: LineDimension[]
  changed?: GuaDimension
  mutual?: GuaDimension
  body?: GuaDimension
  use?: GuaDimension
  relations: RelationDimension[]
  images: ImageMeaningDimension[]
  context: {
    intent?: string
    time?: string
    season?: string
    direction?: string
    motion?: string
    externalSigns?: string[]
    missing: string[]
  }
  evidence: TextEvidence[]
  finalInterpretation: 'excluded' | 'pending-context' | 'available'
}
```

## 推理使用顺序

```text
读取本卦与变互卦
  → 读取动爻与爻辞
  → 读取体用
  → 计算五行关系
  → 加入旺衰与时序
  → 匹配卦象类象
  → 匹配卦辞、爻辞与主题语义
  → 检查上下文缺失
  → 记录支持、反对和冲突证据
  → 条件满足后才生成解释
```

## 证据要求

```ts
type TextEvidence = {
  text: string
  sourceType: '卦辞' | '象辞' | '爻辞' | '规则' | '案例' | '上下文'
  sourceRefs: string[]
  status: 'source-explicit' | 'derived' | 'candidate' | 'unresolved'
}
```

所有属性都必须能区分：原文明确内容、计算得到内容、案例归纳内容和待确认候选内容。
