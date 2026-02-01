// src/lib/bazi.ts
import { isAfterSolarTerm, getCurrentSolarTerm, getNextSolarTerm, daysBetween } from './solarTerms'

// 严格类型定义
export type HeavenlyStem = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸'
export type EarthlyBranch = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥'

export const HEAVENLY_STEMS: HeavenlyStem[] = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
export const EARTHLY_BRANCHES: EarthlyBranch[] = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

// 五行映射
export const STEM_ELEMENT: Record<HeavenlyStem, string> = {
  甲:'木',乙:'木',
  丙:'火',丁:'火',
  戊:'土',己:'土',
  庚:'金',辛:'金',
  壬:'水',癸:'水'
}

// 地支五行映射
export const BRANCH_ELEMENT: Record<EarthlyBranch, string> = {
  子:'水',丑:'土',寅:'木',卯:'木',
  辰:'土',巳:'火',午:'火',未:'土',
  申:'金',酉:'金',戌:'土',亥:'水'
}

// 参数验证函数
function validateInput(year: number, month: number, day: number, hour: number): void {
  if (year < 1900 || year > 2100) {
    throw new Error('年份必须在1900-2100之间')
  }
  if (month < 1 || month > 12) {
    throw new Error('月份必须在1-12之间')
  }
  if (day < 1 || day > 31) {
    throw new Error('日期必须在1-31之间')
  }
  if (hour < 0 || hour > 23) {
    throw new Error('时辰必须在0-23之间')
  }
  
  // 检查日期有效性
  const date = new Date(year, month - 1, day)
  if (date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new Error('无效的日期')
  }
}

// ================================
// 1️⃣ 公历 → 儒略日（精确计算）
// ================================
function toJulianDay(y: number, m: number, d: number): number {
  // 参数验证
  if (isNaN(y) || isNaN(m) || isNaN(d)) {
    console.error('无效的日期参数:', { y, m, d })
    return 0
  }
  
  let year = y
  let month = m
  
  if (month <= 2) {
    year -= 1
    month += 12
  }
  
  const A = Math.floor(year / 100)
  const B = 2 - A + Math.floor(A / 4)
  
  // 分步计算，避免数值溢出
  const part1 = Math.floor(365.25 * (year + 4716))
  const part2 = Math.floor(30.6001 * (month + 1))
  const result = part1 + part2 + d + B - 1524.5
  
  // 检查计算结果
  if (isNaN(result)) {
    console.error('儒略日计算错误:', { y, m, d, year, month, A, B, part1, part2, result })
    return 2451545 // 返回一个默认的儒略日（2000年1月1日）
  }
  
  return result
}

// ================================
// 2️⃣ 日柱（六十甲子）
// ================================
function calcDayPillar(y: number, m: number, d: number): string {
  const jd = toJulianDay(y, m, d)
  
  // 调试信息：检查计算中间值
  if (isNaN(jd)) {
    console.error('儒略日计算错误:', { y, m, d, jd })
    return '甲子' // 返回默认值
  }
  
  // 使用整数计算，避免小数索引问题
  const index = Math.floor((jd + 49) % 60)
  
  // 确保索引在有效范围内
  const stemIndex = ((index % 10) + 10) % 10
  const branchIndex = ((index % 12) + 12) % 12
  
  const stem = HEAVENLY_STEMS[stemIndex]
  const branch = EARTHLY_BRANCHES[branchIndex]
  
  // 检查结果是否有效
  if (!stem || !branch) {
    console.error('日柱计算错误:', { y, m, d, jd, index, stemIndex, branchIndex })
    return '甲子' // 返回默认值
  }
  
  return stem + branch
}

// ================================
// 3️⃣ 年柱（精确立春分界）
// ================================
function calcYearPillar(y: number, m: number, d: number): string {
  const birthDate = new Date(y, m - 1, d)
  
  // 精确判断是否在立春之后
  const isAfterSpring = isAfterSolarTerm(birthDate, '立春')
  const year = isAfterSpring ? y : y - 1
  
  const index = (year - 4) % 60
  const stemIndex = (index % 10 + 10) % 10
  const branchIndex = (index % 12 + 12) % 12
  
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex]
}

// ================================
// 4️⃣ 月柱（精确节气定月）
// ================================
function calcMonthPillar(yearStem: HeavenlyStem, birthDate: Date): string {
  const currentTerm = getCurrentSolarTerm(birthDate)
  
  // 根据节气确定月份地支
  const termToMonth: Record<string, number> = {
    '立春': 0, '惊蛰': 1, '清明': 2, '立夏': 3,
    '芒种': 4, '小暑': 5, '立秋': 6, '白露': 7,
    '寒露': 8, '立冬': 9, '大雪': 10, '小寒': 11
  }
  
  const monthBranchIndex = termToMonth[currentTerm] ?? 0
  
  // 五虎遁：甲己之年丙作首，乙庚之岁戊为头
  // 丙辛之年寻庚起，丁壬壬位顺行流
  // 若问戊癸何处起，甲寅之上好追求
  const yearStemIndex = HEAVENLY_STEMS.indexOf(yearStem)
  let startStemIndex = 0
  
  switch (yearStemIndex % 5) {
    case 0: // 甲己
      startStemIndex = 2 // 丙
      break
    case 1: // 乙庚
      startStemIndex = 4 // 戊
      break
    case 2: // 丙辛
      startStemIndex = 6 // 庚
      break
    case 3: // 丁壬
      startStemIndex = 8 // 壬
      break
    case 4: // 戊癸
      startStemIndex = 0 // 甲
      break
  }
  
  const stemIndex = (startStemIndex + monthBranchIndex) % 10
  
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[monthBranchIndex]
}

// ================================
// 5️⃣ 时柱（由日干推，五鼠遁）
// ================================
function calcHourPillar(dayStem: HeavenlyStem, hour: number): string {
  const hourBranchIndex = Math.floor((hour + 1) / 2) % 12
  
  // 五鼠遁：甲己还加甲，乙庚丙作初
  // 丙辛从戊起，丁壬庚子居
  // 戊癸起壬子，循环自主如
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayStem)
  let startStemIndex = 0
  
  switch (dayStemIndex % 5) {
    case 0: // 甲己
      startStemIndex = 0 // 甲
      break
    case 1: // 乙庚
      startStemIndex = 2 // 丙
      break
    case 2: // 丙辛
      startStemIndex = 4 // 戊
      break
    case 3: // 丁壬
      startStemIndex = 6 // 庚
      break
    case 4: // 戊癸
      startStemIndex = 8 // 壬
      break
  }
  
  const stemIndex = (startStemIndex + hourBranchIndex) % 10
  
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[hourBranchIndex]
}

// ================================
// 6️⃣ 完整的五行计算（包含地支）
// ================================
function calculateCompleteElements(pillars: string[]): Record<string, number> {
  const fiveElements: Record<string, number> = { 木:0, 火:0, 土:0, 金:0, 水:0 }
  
  pillars.forEach(pillar => {
    const stem = pillar[0] as HeavenlyStem
    const branch = pillar[1] as EarthlyBranch
    
    // 天干五行
    fiveElements[STEM_ELEMENT[stem]]++
    
    // 地支五行
    fiveElements[BRANCH_ELEMENT[branch]]++
  })
  
  return fiveElements
}

// 地域五行分析函数
function getRegionFiveElements(address: string): Record<string, number> {
  // 简单的地域五行分析（可根据实际情况扩展）
  const regionElements: Record<string, number> = { 木:0.2, 火:0.2, 土:0.2, 金:0.2, 水:0.2 }
  
  if (address.includes('东') || address.includes('上海') || address.includes('江苏') || address.includes('浙江')) {
    regionElements.木 += 0.1
    regionElements.金 -= 0.1
  } else if (address.includes('南') || address.includes('广东') || address.includes('广西') || address.includes('海南')) {
    regionElements.火 += 0.1
    regionElements.水 -= 0.1
  } else if (address.includes('西') || address.includes('陕西') || address.includes('甘肃') || address.includes('青海')) {
    regionElements.金 += 0.1
    regionElements.木 -= 0.1
  } else if (address.includes('北') || address.includes('北京') || address.includes('天津') || address.includes('河北')) {
    regionElements.水 += 0.1
    regionElements.火 -= 0.1
  } else if (address.includes('中') || address.includes('河南') || address.includes('湖北') || address.includes('湖南')) {
    regionElements.土 += 0.1
    regionElements.水 -= 0.1
  }
  
  // 归一化处理
  const sum = Object.values(regionElements).reduce((a, b) => a + b, 0)
  Object.keys(regionElements).forEach(element => {
    regionElements[element] = regionElements[element] / sum
  })
  
  return regionElements
}

// ================================
// 7️⃣ 对外主函数（带验证）
// ================================
export function calcBazi(
  year: number,
  month: number,
  day: number,
  hour: number,
  isCesarean: boolean = false,
  address?: string
) {
  // 参数验证
  validateInput(year, month, day, hour)
  
  const birthDate = new Date(year, month - 1, day, hour)
  
  // 计算四柱
  const yearPillar = calcYearPillar(year, month, day)
  const dayPillar = calcDayPillar(year, month, day)

  const yearStem = yearPillar[0] as HeavenlyStem
  const dayStem = dayPillar[0] as HeavenlyStem

  const monthPillar = calcMonthPillar(yearStem, birthDate)
  const hourPillar = calcHourPillar(dayStem, hour)

  const pillars = [
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar
  ]

  // 完整的五行计算
  let fiveElements = calculateCompleteElements(pillars)
  
  // 剖腹产和地域处理只在需要时进行
  if (isCesarean || address) {
    // 先计算原始五行总和
    const originalSum = Object.values(fiveElements).reduce((a, b) => a + b, 0)
    
    // 剖腹产处理：调整日主力量
    if (isCesarean) {
      const dayMasterElement = STEM_ELEMENT[dayStem]
      if (dayMasterElement && fiveElements[dayMasterElement]) {
        // 只调整相对比例，不改变绝对数值
        const adjustment = fiveElements[dayMasterElement] * 0.05
        fiveElements[dayMasterElement] = Math.max(0, fiveElements[dayMasterElement] - adjustment)
        // 其他五行相应增加
        const otherElements = Object.keys(fiveElements).filter(e => e !== dayMasterElement)
        otherElements.forEach(element => {
          fiveElements[element] += adjustment / otherElements.length
        })
      }
    }
    
    // 地域五行处理
    if (address) {
      const regionElements = getRegionFiveElements(address)
      // 调整五行分布（80%个人五行 + 20%地域五行）
      Object.keys(fiveElements).forEach(element => {
        fiveElements[element] = fiveElements[element] * 0.8 + regionElements[element] * originalSum * 0.2
      })
    }
  }

  return {
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar
    },
    dayMaster: dayStem,
    fiveElements,
    birthDate: birthDate.toISOString().split('T')[0]
  }
}

// 导出类型定义
export interface BaziResult {
  pillars: {
    year: string
    month: string
    day: string
    hour: string
  }
  dayMaster: HeavenlyStem
  fiveElements: Record<string, number>
  birthDate: string
}
