export type KnowledgeItem = {id:string; title:string; category:string; content:string; source:string; tags:string[]}
export const knowledge: KnowledgeItem[] = [
 {id:'rule-trigram-number',title:'周易卦數',category:'规则',content:'乾一、兌二、離三、震四、巽五、坎六、艮七、坤八。',source:'book/meihua_yishu.txt:9',tags:['八卦','数字','取卦']},
 {id:'rule-five-elements',title:'五行生克与八卦五行',category:'规则',content:'乾、兌属金；坤、艮属土；震、巽属木；坎属水；離属火。金生水，水生木，木生火，火生土，土生金；金克木，木克土，土克水，水克火，火克金。',source:'book/meihua_yishu.txt:12-18',tags:['五行','生克']},
 {id:'rule-mutual',title:'互卦起例',category:'规则',content:'互卦去掉初爻和第六爻，以中间四爻分作两卦；乾坤无互时取其变卦。',source:'book/meihua_yishu.txt:55-58',tags:['互卦','变卦']},
 {id:'case-guan-mei',title:'观梅占',category:'案例',content:'辰年十二月十七日申时，年月日总数三十四取兑，加入申时得四十三取离，初爻动，得泽火革，变咸。',source:'book/meihua_yishu.txt:154-157',tags:['年月日時占','泽火革','案例']},
 {id:'case-mudan',title:'牡丹占',category:'案例',content:'巳年三月十六日卯时，总数二十五取乾，加入卯时得二十九取巽，五爻动，得天风姤，变鼎。',source:'book/meihua_yishu.txt:159-162',tags:['年月日時占','天风姤','案例']},
 {id:'method-date-time',title:'年月日時起例',category:'占法',content:'年月日为上卦，年月日加时总数为下卦，再以年月日時总数取动爻。',source:'book/meihua_yishu.txt:60-61',tags:['年月日時占','动爻']},
]
export function searchKnowledge(query:string) { const q=query.trim().toLowerCase(); return q ? knowledge.filter(x=>[x.title,x.category,x.content,x.tags.join(' ')].join(' ').toLowerCase().includes(q)) : knowledge }
