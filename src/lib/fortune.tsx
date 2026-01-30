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

// 计算五行数量
function countElements(tenGods: TenGod[], dayMaster: string): Record<string, number> {
  const count: Record<string, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 }
  const dayMasterElement = STEM_ELEMENT[dayMaster[0]] || "木"
  
  count[dayMasterElement] += 4
  
  tenGods.forEach(tg => {
    const element = STEM_ELEMENT[tg.stem]
    if (element) {
      count[element]++
    }
  })
  
  return count
}

// 判断五行强弱
function getElementStrength(count: Record<string, number>, element: string): 'strong' | 'medium' | 'weak' {
  const total = Object.values(count).reduce((a, b) => a + b, 0)
  const ratio = count[element] / total
  
  if (ratio >= 0.3) return 'strong'
  if (ratio >= 0.2) return 'medium'
  return 'weak'
}

// 根据日主 + 十神 + 大运流年生成详细解读
export function generateFortune(dayMaster: string, tenGods: TenGod[]): Fortune {
  const count = countTenGods(tenGods)
  const elements = countElements(tenGods, dayMaster)
  const dayMasterElement = STEM_ELEMENT[dayMaster[0]] || "木"
  const dayMasterStrength = getElementStrength(elements, dayMasterElement)
  
  const zhengCai = count["正财"] || 0
  const pianCai = count["偏财"] || 0
  const zhengGuan = count["正官"] || 0
  const qiSha = count["七杀"] || 0
  const zhengYin = count["正印"] || 0
  const pianYin = count["偏印"] || 0
  const shiShen = count["食神"] || 0
  const shangGuan = count["伤官"] || 0
  const biJian = count["比肩"] || 0
  const jieCai = count["劫财"] || 0
  
  const totalWealth = zhengCai + pianCai
  const totalCareer = zhengGuan + qiSha
  const totalPrint = zhengYin + pianYin
  const totalFood = shiShen + shangGuan
  const totalFriend = biJian + jieCai
  
  let wealth: string
  let career: string
  let marriage: string
  let health: string
  let study: string
  let social: string
  
  if (dayMasterStrength === 'strong') {
    if (totalWealth >= 2) {
      wealth = "身强财旺，财运极佳，正财偏财皆有，宜积极投资，把握商机，但需注意理财规划，避免过度扩张。"
    } else if (totalWealth === 1) {
      wealth = "身强有财，财运平稳，正财收入稳定，偶有偏财机会，宜稳健理财，适当投资。"
    } else {
      wealth = "身强无财，财星不显，需踏实工作，开源节流，避免高风险投资，静待财运时机。"
    }
    
    if (totalCareer >= 2) {
      career = "身强官旺，事业运势强劲，有晋升机会，适合开拓新项目，领导能力得到展现，宜把握时机。"
    } else if (totalCareer === 1) {
      career = "身强有官，事业平稳发展，工作能力得到认可，宜积极进取，把握机会。"
    } else {
      career = "身强无官，事业发展较缓，宜积累经验，提升专业技能，等待时机。"
    }
    
    if (zhengGuan > 0) {
      marriage = "身强有正官，感情运佳，容易遇到合适对象，关系发展顺利，宜主动把握。"
    } else if (qiSha > 0) {
      marriage = "身强有七杀，感情运起伏，容易遇到强势对象，需要耐心经营，宜理性对待。"
    } else {
      marriage = "身强无官杀，感情运平淡，需要主动经营关系，扩大社交圈，耐心等待缘分。"
    }
    
    if (totalPrint >= 2) {
      health = "身强印旺，身体状况良好，精力充沛，抵抗力强，但仍需注意作息规律。"
    } else if (totalPrint === 1) {
      health = "身强有印，身体状况稳定，无大碍，宜注意饮食健康，适当锻炼。"
    } else {
      health = "身强无印，注意身体健康，避免过度劳累，保持良好的作息习惯，定期体检。"
    }
    
    if (totalFood >= 2) {
      study = "身强食伤旺，学习能力强，思维敏捷，创造力丰富，适合深造或从事创新型工作。"
    } else if (totalFood === 1) {
      study = "身强有食伤，学习能力良好，理解能力强，宜专注学习，循序渐进。"
    } else {
      study = "身强无食伤，学习需付出更多努力，宜制定合理计划，持之以恒，注重基础。"
    }
    
    if (totalFriend >= 2) {
      social = "身强比劫旺，人际关系良好，朋友众多，有贵人相助，社交圈广，但需防小人。"
    } else if (totalFriend === 1) {
      social = "身强有比劫，人际关系稳定，有知心朋友，宜主动拓展社交圈。"
    } else {
      social = "身强无比劫，社交需主动，注意与他人沟通，建立良好的人际关系。"
    }
  } else if (dayMasterStrength === 'medium') {
    if (totalWealth >= 2) {
      wealth = "身中财旺，财运较好，正财偏财皆有收获，宜稳健理财，避免冒险投资。"
    } else if (totalWealth === 1) {
      wealth = "身中有财，财运平稳，正财收入稳定，偶有偏财机会，宜稳健理财。"
    } else {
      wealth = "身中无财，财运一般，需踏实工作，开源节流，避免高风险投资。"
    }
    
    if (totalCareer >= 2) {
      career = "身中官旺，事业运势良好，有晋升机会，适合开拓新项目，宜把握时机。"
    } else if (totalCareer === 1) {
      career = "身中有官，事业发展平稳，工作能力得到认可，宜积极进取。"
    } else {
      career = "身中无官，事业发展一般，宜积累经验，提升专业技能。"
    }
    
    if (zhengGuan > 0) {
      marriage = "身中有正官，感情运良好，容易遇到合适对象，关系发展顺利。"
    } else if (qiSha > 0) {
      marriage = "身中有七杀，感情运起伏，需要耐心经营，宜理性对待。"
    } else {
      marriage = "身中无官杀，感情运一般，需要主动经营关系，扩大社交圈。"
    }
    
    if (totalPrint >= 2) {
      health = "身中印旺，身体状况良好，精力充沛，抵抗力强，需注意作息规律。"
    } else if (totalPrint === 1) {
      health = "身中有印，身体状况稳定，无大碍，宜注意饮食健康，适当锻炼。"
    } else {
      health = "身中无印，注意身体健康，避免过度劳累，保持良好的作息习惯。"
    }
    
    if (totalFood >= 2) {
      study = "身中食伤旺，学习能力较强，思维敏捷，创造力丰富，适合深造。"
    } else if (totalFood === 1) {
      study = "身中有食伤，学习能力良好，理解能力强，宜专注学习。"
    } else {
      study = "身中无食伤，学习需付出努力，宜制定合理计划，持之以恒。"
    }
    
    if (totalFriend >= 2) {
      social = "身中比劫旺，人际关系良好，朋友众多，有贵人相助，社交圈广。"
    } else if (totalFriend === 1) {
      social = "身中有比劫，人际关系稳定，有知心朋友，宜主动拓展社交圈。"
    } else {
      social = "身中无比劫，社交需主动，注意与他人沟通，建立良好的人际关系。"
    }
  } else {
    if (totalWealth >= 2) {
      wealth = "身弱财旺，财多身弱，需谨慎理财，避免过度投资，宜以正财为主，稳健经营。"
    } else if (totalWealth === 1) {
      wealth = "身弱有财，财运一般，正财收入有限，需踏实工作，开源节流。"
    } else {
      wealth = "身弱无财，财运较弱，需踏实工作，提升能力，等待财运时机。"
    }
    
    if (totalCareer >= 2) {
      career = "身弱官旺，官多身弱，事业压力大，需提升能力，循序渐进，不宜急于求成。"
    } else if (totalCareer === 1) {
      career = "身弱有官，事业发展较缓，需积累经验，提升专业技能，等待时机。"
    } else {
      career = "身弱无官，事业发展困难，宜积累经验，提升能力，等待时机。"
    }
    
    if (zhengGuan > 0) {
      marriage = "身弱有正官，感情运一般，需要耐心经营，不宜过于主动，宜等待时机。"
    } else if (qiSha > 0) {
      marriage = "身弱有七杀，感情运较差，容易遇到不适合的对象，需要理性对待。"
    } else {
      marriage = "身弱无官杀，感情运较弱，需要提升自己，扩大社交圈，耐心等待缘分。"
    }
    
    if (totalPrint >= 2) {
      health = "身弱印旺，身体状况一般，需注意休息，避免过度劳累，保持良好的作息习惯。"
    } else if (totalPrint === 1) {
      health = "身弱有印，身体状况尚可，需注意饮食健康，适当锻炼，增强体质。"
    } else {
      health = "身弱无印，注意身体健康，避免过度劳累，保持良好的作息习惯，定期体检。"
    }
    
    if (totalFood >= 2) {
      study = "身弱食伤旺，学习能力一般，思维敏捷但精力不足，宜劳逸结合，循序渐进。"
    } else if (totalFood === 1) {
      study = "身弱有食伤，学习能力尚可，理解能力强，宜制定合理计划，持之以恒。"
    } else {
      study = "身弱无食伤，学习需付出更多努力，宜制定合理计划，注重基础，循序渐进。"
    }
    
    if (totalFriend >= 2) {
      social = "身弱比劫旺，人际关系一般，朋友虽多但需防小人，宜谨慎交友。"
    } else if (totalFriend === 1) {
      social = "身弱有比劫，人际关系尚可，有知心朋友，宜主动拓展社交圈。"
    } else {
      social = "身弱无比劫，社交需主动，注意与他人沟通，建立良好的人际关系。"
    }
  }
  
  return { wealth, career, marriage, health, study, social }
}
