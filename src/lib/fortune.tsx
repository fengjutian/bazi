import { TenGod } from "./tenGod"

export interface Fortune {
  wealth: string
  career: string
  marriage: string
  health: string
  study?: string
  social?: string
}

// 根据日主 + 十神 + 大运流年简单生成解读（可逐步优化）
export function generateFortune(dayMaster: string, tenGods: TenGod[]): Fortune {
  const wealth = tenGods.some(tg => tg.relation.includes("财"))
    ? "财运较旺，投资或偏财机会多，注意守财。"
    : "财星不显，需稳健理财，避免高风险。"

  const career = tenGods.some(tg => tg.relation.includes("官") || tg.relation.includes("杀"))
    ? "事业运势顺利，适合升职或开拓新项目。"
    : "事业较平稳，宜积累经验，避免冒进。"

  const marriage = tenGods.some(tg => tg.relation.includes("正官") || tg.relation.includes("偏官") )
    ? "感情运佳，容易遇到合适对象。"
    : "感情运平淡，需要主动经营关系。"

  const health = tenGods.some(tg => tg.relation.includes("印"))
    ? "身体状况较好，但仍需注意休息和调养。"
    : "注意饮食与作息，避免过劳。"

  const study = tenGods.some(tg => tg.relation.includes("食") || tg.relation.includes("伤"))
    ? "学习和创造能力较强，适合深造或创新工作。"
    : "学习需花心思，循序渐进效果佳。"

  const social = tenGods.some(tg => tg.relation.includes("比") || tg.relation.includes("劫"))
    ? "人际关系良好，有贵人相助。"
    : "社交需主动，注意与同事/朋友沟通。"

  return { wealth, career, marriage, health, study, social }
}
