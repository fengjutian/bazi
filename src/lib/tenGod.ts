import { HEAVENLY_STEMS } from './bazi'

type TenGodName =
  | '比肩' | '劫财'
  | '食神' | '伤官'
  | '偏财' | '正财'
  | '七杀' | '正官'
  | '偏印' | '正印'

export type TenGod = {
  stem: string
  relation: TenGodName
}

// 十神详细说明
export const TEN_GOD_EXPLANATIONS: Record<TenGodName, string> = {
  '比肩': '比肩代表自己的同类，象征朋友、兄弟、同事等。比肩旺盛者，自尊心强，独立自主，善于竞争，但有时会因过于自我而与人争执。',
  '劫财': '劫财代表争夺、竞争，象征竞争对手、合作伙伴等。劫财旺盛者，精力充沛，善于理财，但有时会因冲动而破财，或因竞争心过强而与人冲突。',
  '食神': '食神代表才华、智慧，象征技艺、学问、享受等。食神旺盛者，聪明伶俐，多才多艺，善于表达，但有时会因过于追求享受而缺乏上进心。',
  '伤官': '伤官代表创新、叛逆，象征才艺、个性、反抗等。伤官旺盛者，思维敏捷，创意丰富，喜欢自由，但有时会因过于叛逆而与权威冲突，或因任性而招来麻烦。',
  '偏财': '偏财代表意外之财，象征横财、投资、副业等。偏财旺盛者，财运较好，善于抓住机会，但有时会因贪心而冒险投资，或因挥霍无度而破财。',
  '正财': '正财代表固定之财，象征工资、稳定收入、正业等。正财旺盛者，理财能力强，做事踏实，但有时会因过于保守而错过机会，或因过于看重物质而忽视精神追求。',
  '七杀': '七杀代表压力、挑战，象征权威、竞争、危险等。七杀旺盛者，事业心强，有领导力，但有时会因过于强势而与人冲突，或因压力过大而影响健康。',
  '正官': '正官代表责任、规范，象征职位、功名、法律等。正官旺盛者，遵纪守法，做事认真，但有时会因过于保守而缺乏创新，或因责任感过重而压力过大。',
  '偏印': '偏印代表智慧、灵感，象征创意、直觉、神秘等。偏印旺盛者，思维独特，洞察力强，但有时会因过于自我而与人疏远，或因过于敏感而情绪波动。',
  '正印': '正印代表保护、关怀，象征长辈、贵人、学问等。正印旺盛者，心地善良，重视传统，但有时会因过于保守而缺乏创新，或因依赖心过重而缺乏独立性。'
}

// 五行生克表
const stemElement: Record<string, string> = {
  甲:'木',乙:'木',
  丙:'火',丁:'火',
  戊:'土',己:'土',
  庚:'金',辛:'金',
  壬:'水',癸:'水'
}

// 阴阳表（天干顺序为阳甲、乙…）
const stemYinYang: Record<string, '阳'|'阴'> = {
  甲:'阳',乙:'阴',
  丙:'阳',丁:'阴',
  戊:'阳',己:'阴',
  庚:'阳',辛:'阴',
  壬:'阳',癸:'阴'
}

// 日干 vs 他干
export function calcTenGod(dayStem: string, otherStem: string): TenGodName {
  const dayEl = stemElement[dayStem]
  const otherEl = stemElement[otherStem]

  const dayYang = stemYinYang[dayStem]
  const otherYang = stemYinYang[otherStem]

  if (dayStem === otherStem) return '比肩'
  if (dayEl === otherEl && dayStem !== otherStem) return '劫财'

  // 我生他
  if (
    (dayEl === '木' && otherEl === '火') ||
    (dayEl === '火' && otherEl === '土') ||
    (dayEl === '土' && otherEl === '金') ||
    (dayEl === '金' && otherEl === '水') ||
    (dayEl === '水' && otherEl === '木')
  ) {
    return otherYang === dayYang ? '食神' : '伤官'
  }

  // 他生我
  if (
    (otherEl === '木' && dayEl === '火') ||
    (otherEl === '火' && dayEl === '土') ||
    (otherEl === '土' && dayEl === '金') ||
    (otherEl === '金' && dayEl === '水') ||
    (otherEl === '水' && dayEl === '木')
  ) {
    return otherYang === dayYang ? '正财' : '偏财'
  }

  // 我克他
  if (
    (dayEl === '木' && otherEl === '土') ||
    (dayEl === '火' && otherEl === '金') ||
    (dayEl === '土' && otherEl === '水') ||
    (dayEl === '金' && otherEl === '火') ||
    (dayEl === '水' && otherEl === '火')
  ) {
    return otherYang === dayYang ? '正印' : '偏印'
  }

  // 他克我
  if (
    (otherEl === '木' && dayEl === '土') ||
    (otherEl === '火' && dayEl === '金') ||
    (otherEl === '土' && dayEl === '水') ||
    (otherEl === '金' && dayEl === '火') ||
    (otherEl === '水' && dayEl === '木')
  ) {
    return otherYang === dayYang ? '正官' : '七杀'
  }

  return '比肩'
}

// 一次性计算四柱十神
export function calcAllTenGods(dayStem: string, pillars: string[]) {
  // pillars = [年柱, 月柱, 日柱, 时柱]，每个柱是 "干支"
  const result: TenGod[] = []
  for (let i = 0; i < pillars.length; i++) {
    const stem = pillars[i][0]
    if (i === 2) continue // 跳过日干自己
    const relation = calcTenGod(dayStem, stem)
    result.push({ stem, relation })
  }
  return result
}
