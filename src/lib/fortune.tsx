import { TenGod } from "./tenGod"
import { STEM_ELEMENT } from "./bazi"

export interface Fortune {
  wealth: string
  career: string
  marriage: string
  health: string
  study?: string
  social?: string
}

// 计算十神数量
function countTenGods(tenGods: TenGod[]): Record<string, number> {
  const count: Record<string, number> = {}
  tenGods.forEach(tg => {
    count[tg.relation] = (count[tg.relation] || 0) + 1
  })
  return count
}

// 根据日主 + 十神 + 大运流年生成详细解读
export function generateFortune(dayMaster: string, tenGods: TenGod[]): Fortune {
  const count = countTenGods(tenGods)
  const dayMasterElement = STEM_ELEMENT[dayMaster[0]] || "木"
  
  // 财运分析
  const hasWealth = tenGods.some(tg => tg.relation.includes("财"))
  const wealthCount = count["正财"] || 0 + count["偏财"] || 0
  let wealth
  if (wealthCount >= 2) {
    wealth = "财运旺盛，投资机会多，正财偏财皆有收获，但需注意理财规划，避免过度消费。"
  } else if (hasWealth) {
    wealth = "财运平稳，正财收入稳定，偶有偏财机会，宜稳健理财，适当投资。"
  } else {
    wealth = "财星不显，需踏实工作，开源节流，避免高风险投资，静待财运时机。"
  }

  // 事业分析
  const hasCareer = tenGods.some(tg => tg.relation.includes("官") || tg.relation.includes("杀"))
  const careerCount = count["正官"] || 0 + count["七杀"] || 0
  let career
  if (careerCount >= 2) {
    career = "事业运势强劲，有晋升机会，适合开拓新项目，领导能力得到展现。"
  } else if (hasCareer) {
    career = "事业平稳发展，工作能力得到认可，宜积极进取，把握机会。"
  } else {
    career = "事业发展较缓，宜积累经验，提升专业技能，等待时机。"
  }

  // 婚姻分析
  const hasMarriage = tenGods.some(tg => tg.relation.includes("正官") || tg.relation.includes("偏官"))
  let marriage
  if (hasMarriage) {
    marriage = "感情运佳，容易遇到合适对象，关系发展顺利，宜主动把握。"
  } else {
    marriage = "感情运平淡，需要主动经营关系，扩大社交圈，耐心等待缘分。"
  }

  // 健康分析
  const hasPrint = tenGods.some(tg => tg.relation.includes("印"))
  const printCount = count["正印"] || 0 + count["偏印"] || 0
  let health
  if (printCount >= 2) {
    health = "身体状况良好，精力充沛，抵抗力强，但仍需注意作息规律。"
  } else if (hasPrint) {
    health = "身体状况稳定，无大碍，宜注意饮食健康，适当锻炼。"
  } else {
    health = "注意身体健康，避免过度劳累，保持良好的作息习惯，定期体检。"
  }

  // 学业分析
  const hasFood = tenGods.some(tg => tg.relation.includes("食") || tg.relation.includes("伤"))
  const foodCount = count["食神"] || 0 + count["伤官"] || 0
  let study
  if (foodCount >= 2) {
    study = "学习能力强，思维敏捷，创造力丰富，适合深造或从事创新型工作。"
  } else if (hasFood) {
    study = "学习能力良好，理解能力强，宜专注学习，循序渐进。"
  } else {
    study = "学习需付出更多努力，宜制定合理计划，持之以恒，注重基础。"
  }

  // 社交分析
  const hasFriend = tenGods.some(tg => tg.relation.includes("比") || tg.relation.includes("劫"))
  const friendCount = count["比肩"] || 0 + count["劫财"] || 0
  let social
  if (friendCount >= 2) {
    social = "人际关系良好，朋友众多，有贵人相助，社交圈广。"
  } else if (hasFriend) {
    social = "人际关系稳定，有知心朋友，宜主动拓展社交圈。"
  } else {
    social = "社交需主动，注意与他人沟通，建立良好的人际关系。"
  }

  return { wealth, career, marriage, health, study, social }
}
