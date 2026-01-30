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
