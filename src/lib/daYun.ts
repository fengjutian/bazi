import { HEAVENLY_STEMS, EARTHLY_BRANCHES, STEM_ELEMENT } from './bazi'
import { calcTenGod, TenGod } from './tenGod'

export type DaYun = {
  startAge: number
  period: string
  pillars: string[]
}

export type LiuNian = {
  age: number
  year: number
  pillar: string
  tenGod: TenGod
}

// 简化节气计算，默认起运年龄 = 8 岁
export function calcDaYun(dayStem: string, birthYear: number, male = true): DaYun[] {
  const direction = male ? 1 : -1
  const daYunList: DaYun[] = []

  // 大运每 10 年
  for (let i = 0; i < 8; i++) {
    const age = 8 + i * 10
    const periodPillars: string[] = []
    for (let j = 0; j < 10; j++) {
      const stemIndex = (HEAVENLY_STEMS.indexOf(dayStem) + direction*(i*10 + j)) % 10
      const branchIndex = (birthYear + direction*(i*10 + j) - 4) % 12
      periodPillars.push(HEAVENLY_STEMS[(stemIndex+10)%10] + EARTHLY_BRANCHES[(branchIndex+12)%12])
    }
    daYunList.push({ startAge: age, period: `第${i+1}大运`, pillars: periodPillars })
  }

  return daYunList
}

// 计算流年（某大运每年干支 + 十神）
export function calcLiuNian(dayStem: string, startYear: number, startAge: number, male = true): LiuNian[] {
  const direction = male ? 1 : -1
  const liuNianList: LiuNian[] = []

  for (let i = 0; i < 10; i++) {
    const year = startYear + direction * i
    const stemIndex = (HEAVENLY_STEMS.indexOf(dayStem) + direction*i) % 10
    const branchIndex = (year - 4) % 12
    const pillar = HEAVENLY_STEMS[(stemIndex+10)%10] + EARTHLY_BRANCHES[(branchIndex+12)%12]
    const tenGod = { stem: pillar[0], relation: calcTenGod(dayStem, pillar[0]) }
    liuNianList.push({ age: startAge + i, year, pillar, tenGod })
  }

  return liuNianList
}
