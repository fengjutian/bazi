import { TenGod, calcTenGod } from "./tenGod"
import { STEM_ELEMENT, HeavenlyStem } from "./bazi"

export interface Fortune {
  wealth: string
  career: string
  marriage: string
  health: string
  study?: string
  social?: string
}

// 地支五行映射
const BRANCH_ELEMENT: Record<string, string> = {
  '子': '水', '亥': '水',
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '申': '金', '酉': '金',
  '辰': '土', '戌': '土', '丑': '土', '未': '土'
}

// 地支藏干映射
const HIDDEN_STEMS: Record<string, string[]> = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲']
}

// 计算完整的十神数量（包含地支藏干）
function countCompleteTenGods(dayMaster: string, pillars: string[]): Record<string, number> {
  const count: Record<string, number> = {}
  
  // 计算四柱天干的十神
  pillars.forEach(pillar => {
    const stem = pillar[0]
    const relation = calcTenGod(dayMaster, stem)
    count[relation] = (count[relation] || 0) + 1
  })
  
  // 计算地支藏干的十神
  pillars.forEach(pillar => {
    const branch = pillar[1]
    const hiddenStems = HIDDEN_STEMS[branch] || []
    hiddenStems.forEach(stem => {
      const relation = calcTenGod(dayMaster, stem)
      count[relation] = (count[relation] || 0) + 1
    })
  })
  
  return count
}

// 计算完整的五行数量（包含地支和藏干）
function countCompleteElements(dayMaster: string, pillars: string[]): Record<string, number> {
  const count: Record<string, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 }
  const dayMasterStem = dayMaster[0] as HeavenlyStem
  const dayMasterElement = STEM_ELEMENT[dayMasterStem] || "木"
  
  // 日主权重为4
  count[dayMasterElement] += 4
  
  // 计算四柱天干的五行
  pillars.forEach(pillar => {
    const stem = pillar[0] as HeavenlyStem
    const element = STEM_ELEMENT[stem]
    if (element) {
      count[element]++
    }
  })
  
  // 计算地支的五行
  pillars.forEach(pillar => {
    const branch = pillar[1]
    const element = BRANCH_ELEMENT[branch]
    if (element) {
      count[element]++
    }
  })
  
  // 计算地支藏干的五行
  pillars.forEach(pillar => {
    const branch = pillar[1]
    const hiddenStems = HIDDEN_STEMS[branch] || []
    hiddenStems.forEach(stem => {
      const element = STEM_ELEMENT[stem as HeavenlyStem]
      if (element) {
        count[element]++
      }
    })
  })
  
  return count
}

// 计算十神数量（向后兼容）
function countTenGods(tenGods: TenGod[]): Record<string, number> {
  const count: Record<string, number> = {}
  if (!tenGods || !Array.isArray(tenGods)) {
    return count
  }
  
  tenGods.forEach(tg => {
    if (tg && tg.relation) {
      count[tg.relation] = (count[tg.relation] || 0) + 1
    }
  })
  return count
}

// 计算五行数量（向后兼容）
function countElements(tenGods: TenGod[], dayMaster: string): Record<string, number> {
  const count: Record<string, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 }
  const dayMasterStem = dayMaster[0] as HeavenlyStem
  const dayMasterElement = STEM_ELEMENT[dayMasterStem] || "木"
  
  if (!tenGods || !Array.isArray(tenGods)) {
    count[dayMasterElement] += 4
    return count
  }
  
  count[dayMasterElement] += 4
  
  tenGods.forEach(tg => {
    if (tg && tg.stem) {
      const element = STEM_ELEMENT[tg.stem as HeavenlyStem]
      if (element) {
        count[element]++
      }
    }
  })
  
  return count
}

// 判断五行强弱
function getElementStrength(count: Record<string, number>, element: string): 'strong' | 'medium' | 'weak' {
  const total = Object.values(count).reduce((a, b) => a + b, 0)
  if (total === 0) return 'weak'
  
  const ratio = count[element] / total
  
  if (ratio >= 0.3) return 'strong'
  if (ratio >= 0.2) return 'medium'
  return 'weak'
}

// 分析命理格局
function analyzeStructure(count: Record<string, number>): string[] {
  const features: string[] = []
  
  if ((count["正财"] || 0) > 0 && (count["正官"] || 0) > 0) {
    features.push("财官双全")
  }
  if ((count["正财"] || 0) > 0 && (count["食神"] || 0) > 0) {
    features.push("食伤生财")
  }
  if ((count["正官"] || 0) > 0 && (count["正印"] || 0) > 0) {
    features.push("官印相生")
  }
  if ((count["偏财"] || 0) > 0 && (count["七杀"] || 0) > 0) {
    features.push("杀刃相帮")
  }
  if ((count["比肩"] || 0) > 0 && (count["劫财"] || 0) > 0) {
    features.push("比劫林立")
  }
  if ((count["食神"] || 0) > 0 && (count["伤官"] || 0) > 0) {
    features.push("食伤齐透")
  }
  if ((count["正印"] || 0) > 0 && (count["偏印"] || 0) > 0) {
    features.push("印星重重")
  }
  if ((count["七杀"] || 0) > 1) {
    features.push("七杀当令")
  }
  
  return features
}

// 根据日主 + 四柱生成详细解读（新版本）
export function generateFortune(dayMaster: string, pillars: string[]): Fortune {
  if (!dayMaster || !pillars || !Array.isArray(pillars) || pillars.length !== 4) {
    return {
      wealth: "八字信息不完整，无法进行运势分析",
      career: "八字信息不完整，无法进行运势分析",
      marriage: "八字信息不完整，无法进行运势分析",
      health: "八字信息不完整，无法进行运势分析",
      study: "八字信息不完整，无法进行运势分析",
      social: "八字信息不完整，无法进行运势分析"
    }
  }
  
  const count = countCompleteTenGods(dayMaster, pillars)
  const elements = countCompleteElements(dayMaster, pillars)
  const dayMasterStem = dayMaster[0] as HeavenlyStem
  const dayMasterElement = STEM_ELEMENT[dayMasterStem] || "木"
  const dayMasterRatio = elements[dayMasterElement] / Object.values(elements).reduce((a, b) => a + b, 0)
  const features = analyzeStructure(count)
  
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
  
  const getStrengthText = (ratio: number): string => {
    if (ratio >= 0.32) return "身强"
    if (ratio >= 0.22) return "身中"
    return "身弱"
  }
  
  const strength = getStrengthText(dayMasterRatio)
  
  // 根据身强身弱和十神组合生成详细分析
  if (strength === "身强") {
    if (features.includes("财官双全")) {
      wealth = `身强财官双全，财运事业双丰收！正财${zhengCai}颗稳固，偏财${pianCai}颗可观，官星${zhengGuan}颗护身，有地位有财气。建议理财投资双管齐下，但需防小人嫉妒。`
    } else if (totalWealth >= 3) {
      wealth = `身强财旺，财星${totalWealth}颗汇聚，财富来源稳定。正财${zhengCai > 0 ? '为主收入' : ''}，偏财${pianCai > 0 ? '为辅增益' : ''}，整体财运上佳，适合稳健理财。`
    } else if (totalWealth === 1 && pianCai > 0) {
      wealth = `身强有偏财星，财运以偏财为主，收入有惊喜。适合副业、兼职、投资理财，但需注意合理规划。`
    } else if (totalWealth === 1 && zhengCai > 0) {
      wealth = `身强正财${zhengCai}颗守身，财运${zhengCai >= 2 ? '丰厚' : '平稳'}。收入主要来自工资和正当渠道，适合深耕本业。`
    } else if (features.includes("食伤生财")) {
      wealth = `身强食伤生财，才华横溢财源广进。适合艺术、设计、创意产业，或写作、演讲、教育。`
    } else if (totalPrint >= 3) {
      wealth = `身强印星${totalPrint}颗护身，财星不显，宜靠学识和技术吃饭。可考虑教育、咨询、技术服务等领域。`
    } else if (totalFood >= 3) {
      wealth = `身强食伤${totalFood}颗旺盛，才华横溢，财源广进。适合艺术、设计、创意产业，或写作、演讲、教育。`
    } else if (totalFriend >= 3) {
      wealth = `身强比劫${totalFriend}颗助身，财星虽有但需靠合作共赢。建议合伙经营或团队合作。`
    } else {
      wealth = `身强日主当令，财星${totalWealth}颗相伴。需靠自身努力创造财富，建议发挥专长踏实工作。`
    }
    
    if (features.includes("官印相生")) {
      career = `身强官印相生，事业有贵气，仕途顺遂。官星正官坐镇地位稳固，或七杀得用压力与机遇并存。适合管理、公务、事业单位。`
    } else if (totalCareer >= 3) {
      career = `身强官星${totalCareer}颗汇聚，事业有野心有动力。正官有领导力，适合开创性事业，可多线发展。`
    } else if (totalCareer === 1 && zhengGuan > 0) {
      career = `身强正官护身，事业稳步上升。工作态度认真受领导赏识，建议独立决策配合团队。`
    } else if (totalCareer === 1 && qiSha > 0) {
      career = `身强七杀在命，事业有冲劲有斗志。有胆识有魄力，适合竞争激烈的环境和技术型岗位。`
    } else if (totalPrint >= 3) {
      career = `身强印星护身，学术文化领域有优势。适合教育、文化、科研，正印有贵人缘可考虑传统行业。`
    } else if (totalFood >= 3) {
      career = `身强食伤旺盛，才华横溢适合创意产业。适合艺术、设计、媒体，可考虑自营创业。`
    } else if (totalFriend >= 3) {
      career = `身强比劫助身，适合独立创业或合作经营。有魄力有冲劲，执行力强，适合商业。`
    } else {
      career = `身强日主当令，官星${totalCareer}颗相伴。事业需靠自身努力争取，建议提升专业稳步发展。`
    }
    
    if (zhengGuan > 0 && zhengCai > 0) {
      marriage = `身强财官双全，婚缘不错。正官代表稳重可靠的对象，正财代表稳定的感情投入。是典型的贤妻良母型婚姻，建议主动出击把握良缘。`
    } else if (qiSha > 0 && pianCai > 0) {
      marriage = `身强杀刃配偏财，感情热烈且有物质基础。七杀代表强烈的吸引力，偏财代表浪漫的邂逅。感情浓烈但需磨合，需注意控制情绪。`
    } else if (zhengGuan > 0) {
      marriage = `身强正官在命，感情有贵气。正官代表端正稳重的缘分，对象温柔体贴。建议积极把握，谨慎选择。`
    } else if (qiSha > 0) {
      marriage = `身强七杀在命，感情热烈有魅力。七杀代表有冲劲的对象，易遇到有感觉的人。内心渴望爱情但需理性看待感情。`
    } else if (zhengCai > 0 || pianCai > 0) {
      marriage = `身强财星在命，感情有物质基础。正财代表稳重顾家的对象，偏财代表浪漫的邂逅。建议扩大社交圈主动相亲。`
    } else if (shiShen > 0 || shangGuan > 0) {
      marriage = `身强食伤在命，感情活泼有趣。食神代表温柔体贴的相处，伤官代表敢爱敢恨。热情洋溢需适度收敛。`
    } else if (totalPrint >= 2) {
      marriage = `身强印星护身，感情较为内敛含蓄。正印代表传统观念，对象有独立性。渴望稳定的关系，建议通过长辈介绍。`
    } else if (totalFriend >= 2) {
      marriage = `身强比劫在命，感情社交活跃。比肩代表志同道合的伴侣，劫财代表激烈碰撞的火花。需理性看待感情竞争。`
    } else {
      marriage = `身强日主当令，感情随缘不强求。建议保持开放心态，扩大交友圈培养兴趣爱好。`
    }
    
    if (totalPrint >= 2) {
      health = `身强印星护身，身体底子好，但需注意用脑过度。正印代表平稳的健康运势，整体精力充沛。建议注意饮食规律定期体检。`
    } else if (totalPrint === 1) {
      health = `身强有印星守护，身体状况良好。恢复能力强，整体无大碍。建议劳逸结合适当锻炼。`
    } else if (totalFood >= 2) {
      health = `身强食伤旺盛，消化系统需注意饮食需规律。火气较大需注意降火，整体活力充沛。建议保持运动修身养性。`
    } else if (totalCareer >= 2) {
      health = `身强官星汇聚，工作压力大责任重。注意神经系统慢性疲劳，需注意心血管精神压力。建议合理安排工作放松心情。`
    } else if (totalWealth >= 2) {
      health = `身强财星在命，需注意肝胆脾胃。消化系统需关注饮食要规律，避免暴饮暴食。建议控制饮食适当进补。`
    } else if (totalFriend >= 2) {
      health = `身强比劫助身，活力充沛。竞争消耗大需注意筋骨，整体健康。建议加强锻炼劳逸结合。`
    } else {
      health = `身强日主当令，底子不错状况稳定。整体无大碍，建议保持作息规律定期体检。`
    }
    
    if (totalFood >= 2) {
      study = `身强食伤旺盛，学习能力超强记忆力好理解力强。适合文科艺术语言学习，伤官代表创新能力。学习效率高可考虑实践型学习。`
    } else if (totalFood === 1) {
      study = `身强有食神星，学习能力不错有学习天赋。适合理论与实践结合，动手能力强。建议多下功夫深入研究。`
    } else if (totalPrint >= 2) {
      study = `身强印星护身，学习刻苦努力态度认真基础扎实。正印代表正统学习方法，适合学术研究专业深造。`
    } else if (totalPrint === 1) {
      study = `身强有印星辅助，学习态度认真有独特见解。适合系统学习兴趣导向，建议独立思考多向请教。`
    } else if (totalCareer >= 2) {
      study = `身强官星在命，学习有动力有目标。适合应试学习目标导向，建议制定计划系统学习。`
    } else if (totalWealth >= 2) {
      study = `身强财星在命，学习偏向实用型有商业头脑。适合金融经济管理，建议实践积累。`
    } else if (totalFriend >= 2) {
      study = `身强比劫在命，学习理解能力强记忆力不错。适合独立思考团队合作，建议多参与讨论。`
    } else {
      study = `身强日主当令，学习能力稳定。需多下功夫制定计划，建议专注学习循序渐进。`
    }
    
    if (totalFriend >= 2) {
      social = `身强比劫林立，人际关系竞争激烈需防小人。朋友众多有贵人相助，社交圈广。建议谨慎交友防小人。`
    } else if (totalFriend === 1) {
      social = `身强有比劫，人际关系稳定有知心朋友。社交需主动注意沟通，建议主动拓展社交圈。`
    } else {
      social = `身强日主当令，人际关系尚可。社交需主动注意与他人沟通，建立良好的人际关系。`
    }
  } else if (strength === "身中") {
    if (totalWealth >= 2 && totalCareer >= 1) {
      wealth = `身中财官双全，财运事业均衡发展。正财稳定偏财可观，官星护体有地位。理财投资皆可，需注意把握时机。`
    } else if (totalWealth >= 2) {
      wealth = `身中财旺，财星${totalWealth}颗汇聚，财富来源稳定。正财偏财皆有收获，适合稳健理财避免冒险投资。`
    } else if (totalWealth === 1 && pianCai > 0) {
      wealth = `身中有偏财星，财运以偏财为主，有惊喜。正财收入有限，建议副业投资开源节流。`
    } else if (totalWealth === 1 && zhengCai > 0) {
      wealth = `身中正财守身，财运平稳。正财收入稳定是主要来源，适合深耕本业稳步发展。`
    } else if (totalPrint >= 2) {
      wealth = `身中印星护身，财星不显。宜靠学识技术吃饭，适合教育文化科研领域。`
    } else if (totalFood >= 2) {
      wealth = `身中食伤旺盛，才华可变现。适合创意技术服务，创意产业有发展空间。`
    } else if (totalFriend >= 2) {
      wealth = `身中比劫助身，财来财去需靠合作。有合作伙伴财运更佳，建议团队合作。`
    } else {
      wealth = `身中日主当令，财星${totalWealth}颗相伴。需踏实工作积累财富，建议稳步发展。`
    }
    
    if (totalCareer >= 2 && totalPrint >= 1) {
      career = `身中官印相生，事业有贵气。官星护体印星辅助，仕途顺遂。适合公务事业单位管理岗位。`
    } else if (totalCareer >= 2) {
      career = `身中官星汇聚，事业有上升空间。正官有领导力七杀有冲劲，适合多线发展。`
    } else if (totalCareer === 1 && zhengGuan > 0) {
      career = `身中正官护身，事业发展平稳。工作能力受认可，建议积极进取把握机会。`
    } else if (totalCareer === 1 && qiSha > 0) {
      career = `身中七杀在命，事业有挑战有动力。适合竞争性环境，可发挥专业能力。`
    } else if (totalPrint >= 2) {
      career = `身中印星护身，学术文化有优势。适合教育科研传统文化领域。`
    } else if (totalFood >= 2) {
      career = `身中食伤旺盛，创意能力佳。适合艺术设计媒体产业，可考虑技术创业。`
    } else if (totalFriend >= 2) {
      career = `身中比劫助身，适合合作经营。有执行力有冲劲，商业管理能力强。`
    } else {
      career = `身中日主当令，官星${totalCareer}颗相伴。事业需积累经验提升技能，等待时机。`
    }
    
    if (zhengGuan > 0 && zhengCai > 0) {
      marriage = `身中财官双全，婚缘稳定。正官代表稳重对象，正财代表稳定投入。感情生活和谐，建议主动把握。`
    } else if (qiSha > 0 && pianCai > 0) {
      marriage = `身中杀刃配偏财，感情热烈有物质基础。七杀代表吸引力偏财代表邂逅，需耐心经营。`
    } else if (zhengGuan > 0) {
      marriage = `身中正官在命，感情良好。正官代表端正缘分，对象温柔体贴。容易遇到合适对象。`
    } else if (qiSha > 0) {
      marriage = `身中七杀在命，感情起伏需耐心经营。易遇到有感觉的人，建议理性对待。`
    } else if (zhengCai > 0 || pianCai > 0) {
      marriage = `身中财星在命，感情有基础。对象务实稳重，注重实际生活。`
    } else if (shiShen > 0 || shangGuan > 0) {
      marriage = `身中食伤在命，感情活泼有趣。相处愉快主动追求，建议保持热情。`
    } else if (totalPrint >= 2) {
      marriage = `身中印星护身，感情内敛稳重。传统观念强，对象独立。建议主动社交。`
    } else if (totalFriend >= 2) {
      marriage = `身中比劫在命，社交活跃。感情需主动，竞争激烈。建议理性看待。`
    } else {
      marriage = `身中日主当令，感情随缘。需要主动经营扩大社交圈，耐心等待缘分。`
    }
    
    if (totalPrint >= 2) {
      health = `身中印星护身，身体状况良好精力充沛。抵抗力强需注意作息规律，建议保持良好习惯。`
    } else if (totalPrint === 1) {
      health = `身中有印星，身体状况稳定无大碍。注意饮食健康适当锻炼，整体状态不错。`
    } else if (totalFood >= 2) {
      health = `身中食伤旺盛，注意消化系统饮食规律。火气较大需降火，建议保持运动。`
    } else if (totalCareer >= 2) {
      health = `身中官星汇聚，工作压力较大。注意精神压力作息规律，建议放松心情。`
    } else if (totalWealth >= 2) {
      health = `身中财星在命，注意脾胃消化。饮食规律避免暴饮暴食，建议控制饮食。`
    } else if (totalFriend >= 2) {
      health = `身中比劫助身，活力不错。竞争消耗需注意筋骨，建议加强锻炼。`
    } else {
      health = `身中日主当令，身体状况稳定。整体无大碍，建议保持作息规律定期体检。`
    }
    
    if (totalFood >= 2) {
      study = `身中食伤旺盛，学习能力较强思维敏捷。适合深造创新型工作，创意丰富。`
    } else if (totalFood === 1) {
      study = `身中有食神星，学习能力良好理解能力强。适合专注学习循序渐进。`
    } else if (totalPrint >= 2) {
      study = `身中印星护身，学习态度认真基础扎实。适合学术研究专业深造。`
    } else if (totalPrint === 1) {
      study = `身中有印星辅助，学习态度认真。适合系统学习兴趣导向，建议制定计划。`
    } else if (totalCareer >= 2) {
      study = `身中官星在命，学习有目标。适合应试学习目标导向，建议系统学习。`
    } else if (totalWealth >= 2) {
      study = `身中财星在命，学习实用型有商业头脑。适合金融经济管理，建议实践积累。`
    } else if (totalFriend >= 2) {
      study = `身中比劫在命，学习理解能力强。适合独立思考团队合作，建议多参与讨论。`
    } else {
      study = `身中日主当令，学习能力稳定。需付出努力制定计划，建议专注学习。`
    }
    
    if (totalFriend >= 2) {
      social = `身中比劫助身，人际关系良好朋友众多。有贵人相助社交圈广，建议主动拓展。`
    } else if (totalFriend === 1) {
      social = `身中有比劫，人际关系稳定有知心朋友。社交需主动注意沟通，建议主动拓展社交圈。`
    } else {
      social = `身中日主当令，社交需主动注意与他人沟通。建立良好的人际关系，扩大社交圈。`
    }
  } else {
    if (totalWealth >= 2 && totalPrint >= 1) {
      wealth = `身弱财旺，印星护身可化解。财多身弱需谨慎理财，正财为主稳健经营。建议靠专业技能吃饭。`
    } else if (totalWealth >= 2) {
      wealth = `身弱财旺，财多身弱。需谨慎理财避免过度投资，以正财为主开源节流。`
    } else if (totalWealth === 1 && pianCai > 0) {
      wealth = `身弱有偏财星，财运一般。偏财有但难把握，建议踏实工作开源节流。`
    } else if (totalWealth === 1 && zhengCai > 0) {
      wealth = `身弱正财守身，财运有限。正财是主要收入来源，需踏实工作提升能力。`
    } else if (totalPrint >= 2) {
      wealth = `身弱印星护身，财星不显。靠学识技术吃饭，印星可化财。建议教育咨询技术服务。`
    } else if (totalFood >= 2) {
      wealth = `身弱食伤旺盛，才华可变现。但需注意精力不足，适合劳逸结合。创意产业技术服务。`
    } else if (totalFriend >= 2) {
      wealth = `身弱比劫助身，可帮身担财。合作共赢财运更佳，建议团队合作。`
    } else {
      wealth = `身弱日主，财星${totalWealth}颗相伴。财运较弱，需踏实工作提升能力等待时机。`
    }
    
    if (totalCareer >= 2 && totalPrint >= 1) {
      career = `身弱官印相生，事业有贵气。印星化官压力，官星护体有地位。适合公务事业单位。`
    } else if (totalCareer >= 2) {
      career = `身弱官旺，官多身弱。事业压力大，需提升能力循序渐进，不宜急于求成。`
    } else if (totalCareer === 1 && zhengGuan > 0) {
      career = `身弱正官护身，事业发展较缓。工作能力逐步提升，需积累经验等待时机。`
    } else if (totalCareer === 1 && qiSha > 0) {
      career = `身弱七杀在命，事业有压力有挑战。需提升专业能力，适合技术型岗位。`
    } else if (totalPrint >= 2) {
      career = `身弱印星护身，学术文化有优势。适合教育科研传统文化领域，印星可护身。`
    } else if (totalFood >= 2) {
      career = `身弱食伤旺盛，创意能力强。适合艺术设计媒体产业，可考虑技术创业。`
    } else if (totalFriend >= 2) {
      career = `身弱比劫助身，可帮身担责。合作经营适合团队，适合管理协调。`
    } else {
      career = `身弱日主，官星${totalCareer}颗相伴。事业发展困难，需积累经验提升能力等待时机。`
    }
    
    if (zhengGuan > 0 && zhengCai > 0) {
      marriage = `身弱财官双全，但官杀克身。感情需谨慎，正官代表稳重对象但需耐心经营。`
    } else if (qiSha > 0 && pianCai > 0) {
      marriage = `身弱杀刃配偏财，感情热烈但压力大。七杀代表强烈吸引，偏财代表邂逅，需理性对待。`
    } else if (zhengGuan > 0) {
      marriage = `身弱正官在命，感情运一般。正官代表缘分但需耐心经营，不宜过于主动。`
    } else if (qiSha > 0) {
      marriage = `身弱七杀在命，感情运较差。七杀代表压力较大的缘分，需理性看待。`
    } else if (zhengCai > 0 || pianCai > 0) {
      marriage = `身弱财星在命，感情有基础。对象务实稳重，需主动追求扩大社交圈。`
    } else if (shiShen > 0 || shangGuan > 0) {
      marriage = `身弱食伤在命，感情活泼有趣。但需注意精力不足，建议劳逸结合。`
    } else if (totalPrint >= 2) {
      marriage = `身弱印星护身，感情内敛传统。印星护身感情稳定，对象独立。建议主动社交。`
    } else if (totalFriend >= 2) {
      marriage = `身弱比劫在命，社交活跃。感情需主动，竞争激烈需防情敌。`
    } else {
      marriage = `身弱日主，感情运较弱。需提升自己扩大社交圈，耐心等待缘分。`
    }
    
    if (totalPrint >= 2) {
      health = `身弱印星护身，身体状况一般。印星护身但需注意休息，避免过度劳累。`
    } else if (totalPrint === 1) {
      health = `身弱有印星，身体状况尚可。需注意饮食健康适当锻炼，增强体质。`
    } else if (totalFood >= 2) {
      health = `身弱食伤旺盛，注意消化系统。精力不足需劳逸结合，建议修身养性。`
    } else if (totalCareer >= 2) {
      health = `身弱官星汇聚，工作压力大。官杀克身需注意精神压力，建议放松心情。`
    } else if (totalWealth >= 2) {
      health = `身弱财星在命，财多身弱需注意身体。脾胃肝胆需关注，建议进补调理。`
    } else if (totalFriend >= 2) {
      health = `身弱比劫助身，可帮身扛病。活力一般需加强锻炼，建议劳逸结合。`
    } else {
      health = `身弱日主，注意身体健康。避免过度劳累保持作息习惯，定期体检。`
    }
    
    if (totalFood >= 2) {
      study = `身弱食伤旺盛，学习能力一般思维敏捷。精力不足需劳逸结合，适合深造创新型工作。`
    } else if (totalFood === 1) {
      study = `身弱有食神星，学习能力尚可理解能力强。适合制定计划持之以恒。`
    } else if (totalPrint >= 2) {
      study = `身弱印星护身，学习刻苦努力态度认真。基础扎实适合学术研究专业深造。`
    } else if (totalPrint === 1) {
      study = `身弱有印星辅助，学习态度认真有独特见解。适合系统学习兴趣导向。`
    } else if (totalCareer >= 2) {
      study = `身弱官星在命，学习有压力有动力。适合应试学习目标导向，需多下功夫。`
    } else if (totalWealth >= 2) {
      study = `身弱财星在命，学习实用型有商业头脑。适合金融经济管理，建议实践积累。`
    } else if (totalFriend >= 2) {
      study = `身弱比劫在命，学习理解能力强记忆力不错。适合独立思考团队合作。`
    } else {
      study = `身弱日主，学习需付出更多努力。制定合理计划注重基础，循序渐进。`
    }
    
    if (totalFriend >= 2) {
      social = `身弱比劫助身，人际关系一般。朋友虽多需防小人，建议谨慎交友。`
    } else if (totalFriend === 1) {
      social = `身弱有比劫，人际关系尚可有知心朋友。社交需主动注意沟通，建议主动拓展社交圈。`
    } else {
      social = `身弱日主，社交需主动注意与他人沟通。建立良好的人际关系，扩大社交圈。`
    }
  }
  
  return { wealth, career, marriage, health, study, social }
}

// 保持向后兼容的旧版本函数
export function generateFortuneLegacy(dayMaster: string, tenGods: TenGod[]): Fortune {
  // 将旧的 TenGod[] 转换为四柱字符串数组
  const pillars = tenGods.map(tg => tg.stem + "X") // 用占位符表示地支
  return generateFortune(dayMaster, pillars)
}