import { HEAVENLY_STEMS, EARTHLY_BRANCHES, STEM_ELEMENT } from './bazi'
import { calcTenGod, TenGod } from './tenGod'

export type DaYunDetail = {
  startAge: number
  pillar: string
  tenGod: TenGod
  fiveElements: Record<string, number>
}

export type LiuNianDetail = {
  age: number
  year: number
  pillar: string
  tenGod: TenGod
  fiveElements: Record<string, number>
}

// 流年计算，返回每年的十神 + 五行
export function calcLiuNianFull(
  dayStem: string,
  startYear: number,
  startAge: number,
  male = true
): LiuNianDetail[] {
  const direction = male ? 1 : -1
  const liuNianList: LiuNianDetail[] = []

  for (let i = 0; i < 100; i++) {
    const year = startYear + direction * i
    // 正确的流年天干地支计算：与年柱计算逻辑一致
    const index = (year - 4) % 60
    const stemIndex = index % 10
    const branchIndex = index % 12
    const pillar = HEAVENLY_STEMS[(stemIndex + 10) % 10] + EARTHLY_BRANCHES[(branchIndex + 12) % 12]
    const tenGod = { stem: pillar[0], relation: calcTenGod(dayStem, pillar[0]) }

    // 五行统计
    const fiveElements: Record<string, number> = { 木:0, 火:0, 土:0, 金:0, 水:0 }
    fiveElements[STEM_ELEMENT[pillar[0]]] = 1

    liuNianList.push({ age: startAge + i, year, pillar, tenGod, fiveElements })
  }

  return liuNianList
}

// 大运计算，返回每步大运的十神 + 五行
export function calcDaYun(
  dayStem: string,
  startYear: number,
  male = true
): DaYunDetail[] {
  const direction = male ? 1 : -1
  const daYunList: DaYunDetail[] = []

  // 传统八字中，通常从6岁开始起运，每10年一步
  const baseStartAge = 6

  for (let i = 0; i < 6; i++) {
    const startAge = baseStartAge + i * 10
    const offset = direction * i
    
    // 大运天干：从日主开始，顺逆推
    const stemIndex = (HEAVENLY_STEMS.indexOf(dayStem) + offset) % 10
    
    // 大运地支：根据出生年份地支顺逆推
    const birthYearBranchIndex = (startYear - 4) % 12
    const branchIndex = (birthYearBranchIndex + direction * i * 2) % 12
    
    const pillar = HEAVENLY_STEMS[(stemIndex + 10) % 10] + EARTHLY_BRANCHES[(branchIndex + 12) % 12]
    const tenGod = { stem: pillar[0], relation: calcTenGod(dayStem, pillar[0]) }

    // 五行统计
    const fiveElements: Record<string, number> = { 木:0, 火:0, 土:0, 金:0, 水:0 }
    fiveElements[STEM_ELEMENT[pillar[0]]] = 1

    daYunList.push({ startAge, pillar, tenGod, fiveElements })
  }

  return daYunList
}

// 简化的流年计算函数（保持向后兼容）
export function calcLiuNian(
  dayStem: string,
  startYear: number,
  startAge: number,
  male = true
): LiuNianDetail[] {
  return calcLiuNianFull(dayStem, startYear, startAge, male)
}
