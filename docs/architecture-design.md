# 模块化、插件化与配置化详细设计

## 目标

将“确定性卦象计算”和“带语境的解卦解释”分离，使起卦方法、主题规则、象意和历法都可以独立替换、启用或停用。

## 分层架构

```text
UI 层
  ├── 推导页
  ├── 原文页
  └── 知识图谱页
应用编排层
  ├── 意图识别
  ├── 上下文收集
  └── 推理流程协调
领域层
  ├── CalendarAdapter
  ├── DivinationCalculator
  ├── RuleEngine
  ├── ConflictResolver
  └── ExplanationBuilder
插件层
  ├── 起卦方法插件
  ├── 主题规则插件
  ├── 象意插件
  └── 应期插件
配置与数据层
  ├── rules/*.json
  ├── intents/*.json
  ├── calendars/*.json
  ├── cases/*.json
  └── source-index.json
```

## 核心接口

```ts
type DivinationContext = {
  intent?: string
  method: string
  originalHexagram: unknown
  movingLine: number
  changedHexagram: unknown
  mutualHexagram: unknown
  body: unknown
  use: unknown
  relation: string
  calendar?: CalendarContext
  direction?: string
  motion?: string
  subject?: string
}

type RulePlugin = {
  id: string
  version: string
  enabled: boolean
  intents: string[]
  priority: number
  evaluate(context: DivinationContext): RuleFinding[]
}

type RuleFinding = {
  ruleId: string
  label: string
  polarity: 'positive' | 'negative' | 'neutral'
  score?: number
  confidence: number
  evidence: string[]
  sourceRefs: string[]
  conflicts?: string[]
}
```

## 插件生命周期

```text
加载配置
  → 校验插件元数据
  → 根据意图筛选插件
  → 执行确定性计算
  → 执行规则插件
  → 检测冲突
  → 合并发现结果
  → 生成解释与来源
```

插件不得直接修改其他插件的结果，只能返回 `RuleFinding` 或声明覆盖策略。

## 配置示例

```json
{
  "id": "use-overcomes-body",
  "version": "classic-v1",
  "type": "judgement",
  "enabled": true,
  "intents": ["general", "wealth", "career"],
  "priority": 60,
  "when": [{"field":"relation","equals":"用克体"}],
  "then": {
    "label": "外部压力较强",
    "polarity": "negative",
    "confidence": 0.8
  },
  "sourceRefs": ["books/meihua_yishu.txt:776-778"]
}
```

## 规则优先级

```text
主题专门规则
  > 规则版本覆盖
  > 通用体用规则
  > 象意候选
```

无法消解冲突时，系统必须并列展示，不得合并成伪精确分数。
