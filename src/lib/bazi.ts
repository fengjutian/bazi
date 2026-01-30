// src/lib/bazi.ts

// 十天干
export const HEAVENLY_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
// 十二地支
export const EARTHLY_BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

// 五行映射
export const STEM_ELEMENT: Record<string, string> = {
  甲:'木',乙:'木',
  丙:'火',丁:'火',
  戊:'土',己:'土',
  庚:'金',辛:'金',
  壬:'水',癸:'水'
}

// ================================
// 1️⃣ 公历 → 儒略日
// ================================
function toJulianDay(y: number, m: number, d: number): number {
  if (m <= 2) {
    y -= 1
    m += 12
  }
  const A = Math.floor(y / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (y + 4716))
    + Math.floor(30.6001 * (m + 1))
    + d + B - 1524
}

// ================================
// 2️⃣ 日柱（六十甲子）
// ================================
function calcDayPillar(y: number, m: number, d: number): string {
  const jd = toJulianDay(y, m, d)
  const index = (jd + 49) % 60
  const stem = HEAVENLY_STEMS[index % 10]
  const branch = EARTHLY_BRANCHES[index % 12]
  return stem + branch
}

// ================================
// 3️⃣ 年柱（以立春为界）
// 简化处理：默认 2 月 4 日为立春
// ================================
function calcYearPillar(y: number, m: number, d: number): string {
  const year = (m < 2 || (m === 2 && d < 4)) ? y - 1 : y
  const index = (year - 4) % 60
  return HEAVENLY_STEMS[index % 10] + EARTHLY_BRANCHES[index % 12]
}

// ================================
// 4️⃣ 月柱（节气定月，寅月起）
// ================================
function calcMonthPillar(yearStem: string, m: number): string {
  // 寅月为正月
  const monthBranchIndex = (m + 10) % 12
  const stemIndex =
    (HEAVENLY_STEMS.indexOf(yearStem) * 2 + monthBranchIndex) % 10

  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[monthBranchIndex]
}

// ================================
// 5️⃣ 时柱（由日干推）
// ================================
function calcHourPillar(dayStem: string, hour: number): string {
  const hourBranchIndex = Math.floor((hour + 1) / 2) % 12
  const stemIndex =
    (HEAVENLY_STEMS.indexOf(dayStem) * 2 + hourBranchIndex) % 10

  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[hourBranchIndex]
}

// ================================
// 6️⃣ 对外主函数
// ================================
export function calcBazi(
  year: number,
  month: number,
  day: number,
  hour: number
) {
  const yearPillar = calcYearPillar(year, month, day)
  const dayPillar = calcDayPillar(year, month, day)

  const yearStem = yearPillar[0]
  const dayStem = dayPillar[0]

  const monthPillar = calcMonthPillar(yearStem, month)
  const hourPillar = calcHourPillar(dayStem, hour)

  const pillars = [
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar
  ]

  const fiveElements = { 木:0, 火:0, 土:0, 金:0, 水:0 }

  pillars.forEach(p => {
    const stem = p[0]
    fiveElements[STEM_ELEMENT[stem]]++
  })

  return {
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar
    },
    dayMaster: dayStem,
    fiveElements
  }
}
