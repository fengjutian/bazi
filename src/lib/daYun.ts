import { HEAVENLY_STEMS, EARTHLY_BRANCHES, STEM_ELEMENT, HeavenlyStem, EarthlyBranch } from './bazi'
import { calcTenGod, TenGod } from './tenGod'
import { getNextSolarTerm, daysBetween } from './solarTerms'

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
  tenGods: TenGod[]  // 改为数组，包含天干和地支藏干的十神
  fiveElements: Record<string, number>
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

// 计算流年柱的完整十神（包含地支藏干）
function calcLiuNianTenGods(dayStem: string, yearPillar: string): TenGod[] {
  const tenGods: TenGod[] = []
  
  // 1. 流年天干的十神
  tenGods.push({
    stem: yearPillar[0],
    relation: calcTenGod(dayStem, yearPillar[0])
  })
  
  // 2. 流年地支藏干的十神
  const branch = yearPillar[1]
  const hiddenStems = HIDDEN_STEMS[branch] || []
  hiddenStems.forEach(stem => {
    tenGods.push({
      stem: stem,
      relation: calcTenGod(dayStem, stem)
    })
  })
  
  return tenGods
}

// 流年计算，返回每年的完整十神（包含地支藏干）
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
    
    // 计算完整的十神（包含地支藏干）
    const tenGods = calcLiuNianTenGods(dayStem, pillar)

    // 五行统计
    const fiveElements: Record<string, number> = { 木:0, 火:0, 土:0, 金:0, 水:0 }
    const stem = pillar[0] as HeavenlyStem
    fiveElements[STEM_ELEMENT[stem]] = 1

    liuNianList.push({ 
      age: startAge + i, 
      year, 
      pillar, 
      tenGods,  // 改为数组
      fiveElements 
    })
  }

  return liuNianList
}

// 计算精确的起运时间
export function calculateStartAge(birthDate: Date, dayMaster: HeavenlyStem, male: boolean): number {
  // 阳男阴女顺排，阴男阳女逆排
  const dayMasterIndex = HEAVENLY_STEMS.indexOf(dayMaster)
  const isYang = dayMasterIndex % 2 === 0 // 阳干：甲丙戊庚壬
  const direction = (male && isYang) || (!male && !isYang) ? 1 : -1
  
  // 计算出生时间到下一个节气的时间差
  const nextTerm = getNextSolarTerm(birthDate)
  const daysToNextTerm = daysBetween(birthDate, nextTerm.date)
  
  // 3天为1岁，1天为4个月，1个时辰为10天
  const hours = birthDate.getHours()
  const minutes = birthDate.getMinutes()
  const totalHours = hours + minutes / 60
  
  // 计算起运时间（岁）
  const startAgeYears = daysToNextTerm / 3
  const startAgeMonths = (daysToNextTerm % 3) * 4
  const startAgeDays = (totalHours / 24) * 10
  
  // 转换为岁数（保留2位小数）
  const startAge = startAgeYears + (startAgeMonths / 12) + (startAgeDays / 365)
  
  return Math.round(startAge * 100) / 100
}

// 计算大运天干地支
export function calcDaYunPillar(birthMonthPillar: string, direction: number, index: number): string {
  const monthStem = birthMonthPillar[0] as HeavenlyStem
  const monthBranch = birthMonthPillar[1] as EarthlyBranch
  
  const monthStemIndex = HEAVENLY_STEMS.indexOf(monthStem)
  const monthBranchIndex = EARTHLY_BRANCHES.indexOf(monthBranch)
  
  // 根据方向计算大运天干地支
  const stemIndex = (monthStemIndex + direction * index + 10) % 10
  const branchIndex = (monthBranchIndex + direction * index + 12) % 12
  
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex]
}

// 计算大运
export function calcDaYun(dayMaster: HeavenlyStem, birthDate: Date, male = true): DaYunDetail[] {
  const daYunList: DaYunDetail[] = []
  
  // 计算精确起运时间
  const startAge = calculateStartAge(birthDate, dayMaster, male)
  
  // 确定大运方向
  const dayMasterIndex = HEAVENLY_STEMS.indexOf(dayMaster)
  const isYang = dayMasterIndex % 2 === 0
  const direction = (male && isYang) || (!male && !isYang) ? 1 : -1
  
  // 需要月柱来计算大运，这里简化处理
  // 实际应该从八字结果中获取月柱
  const birthYear = birthDate.getFullYear()
  const birthMonth = birthDate.getMonth() + 1
  const birthDay = birthDate.getDate()
  
  // 临时计算月柱（简化）
  const yearIndex = (birthYear - 4) % 60
  const yearStemIndex = (yearIndex % 10 + 10) % 10
  const yearStem = HEAVENLY_STEMS[yearStemIndex]
  
  // 使用简化方法计算月柱
  const monthBranchIndex = (birthMonth + 10) % 12
  const monthStemIndex = (yearStemIndex * 2 + monthBranchIndex) % 10
  const birthMonthPillar = HEAVENLY_STEMS[monthStemIndex] + EARTHLY_BRANCHES[monthBranchIndex]
  
  for (let i = 0; i < 10; i++) {
    const startAgeForThisDaYun = Math.round(startAge + i * 10 * 100) / 100
    
    // 计算大运天干地支
    const pillar = calcDaYunPillar(birthMonthPillar, direction, i)
    
    // 十神计算
    const tenGod: TenGod = {
      stem: pillar[0],
      relation: calcTenGod(dayMaster, pillar[0])
    }
    
    // 五行统计（包含地支）
    const fiveElements: Record<string, number> = { 木:0, 火:0, 土:0, 金:0, 水:0 }
    fiveElements[STEM_ELEMENT[tenGod.stem as HeavenlyStem]]++
    
    // 地支五行
    const branchElement = {
      '子':'水', '丑':'土', '寅':'木', '卯':'木',
      '辰':'土', '巳':'火', '午':'火', '未':'土',
      '申':'金', '酉':'金', '戌':'土', '亥':'水'
    }[pillar[1]] || '木'
    fiveElements[branchElement]++
    
    daYunList.push({
      startAge: startAgeForThisDaYun,
      pillar,
      tenGod,
      fiveElements
    })
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