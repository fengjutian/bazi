// src/lib/solarTerms.ts
// 精确的节气计算模块

// 节气枚举
export type SolarTerm = 
  | '立春' | '雨水' | '惊蛰' | '春分' | '清明' | '谷雨'
  | '立夏' | '小满' | '芒种' | '夏至' | '小暑' | '大暑'
  | '立秋' | '处暑' | '白露' | '秋分' | '寒露' | '霜降'
  | '立冬' | '小雪' | '大雪' | '冬至' | '小寒' | '大寒'

// 节气对应的角度（黄经）
const SOLAR_TERM_ANGLES: Record<SolarTerm, number> = {
  '立春': 315, '雨水': 330, '惊蛰': 345, '春分': 0,
  '清明': 15, '谷雨': 30, '立夏': 45, '小满': 60,
  '芒种': 75, '夏至': 90, '小暑': 105, '大暑': 120,
  '立秋': 135, '处暑': 150, '白露': 165, '秋分': 180,
  '寒露': 195, '霜降': 210, '立冬': 225, '小雪': 240,
  '大雪': 255, '冬至': 270, '小寒': 285, '大寒': 300
}

// 计算儒略日
function toJulianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1
    month += 12
  }
  const A = Math.floor(year / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (year + 4716))
    + Math.floor(30.6001 * (month + 1))
    + day + B - 1524.5
}

// 计算太阳黄经（简化算法）
function calculateSolarLongitude(jd: number): number {
  // 简化计算，实际应该使用更精确的天文算法
  const T = (jd - 2451545.0) / 36525.0
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * Math.PI / 180)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M * Math.PI / 180)
    + 0.000289 * Math.sin(3 * M * Math.PI / 180)
  
  let longitude = L0 + C
  // 归一化到0-360度
  while (longitude < 0) longitude += 360
  while (longitude >= 360) longitude -= 360
  
  return longitude
}

// 计算指定年份的节气时间
function calculateSolarTermTime(year: number, term: SolarTerm): Date {
  const targetAngle = SOLAR_TERM_ANGLES[term]
  
  // 从立春开始估算
  const startDate = new Date(year, 1, 4) // 2月4日作为起始点
  
  // 二分法查找精确时间
  let low = toJulianDay(year, 1, 1)
  let high = toJulianDay(year, 12, 31)
  
  for (let i = 0; i < 20; i++) { // 迭代20次，精度足够
    const mid = (low + high) / 2
    const longitude = calculateSolarLongitude(mid)
    
    if (Math.abs(longitude - targetAngle) < 0.1) {
      // 转换为Date对象
      const jd = mid + 0.5
      const Z = Math.floor(jd + 0.5)
      const F = jd + 0.5 - Z
      let A = Z
      
      if (Z >= 2299161) {
        const alpha = Math.floor((Z - 1867216.25) / 36524.25)
        A = Z + 1 + alpha - Math.floor(alpha / 4)
      }
      
      const B = A + 1524
      const C = Math.floor((B - 122.1) / 365.25)
      const D = Math.floor(365.25 * C)
      const E = Math.floor((B - D) / 30.6001)
      
      const day = B - D - Math.floor(30.6001 * E) + F
      const month = E < 14 ? E - 1 : E - 13
      const year = month > 2 ? C - 4716 : C - 4715
      
      return new Date(year, month - 1, Math.floor(day), 
        Math.floor((day - Math.floor(day)) * 24))
    }
    
    if (longitude < targetAngle) {
      low = mid
    } else {
      high = mid
    }
  }
  
  // 如果迭代失败，返回估算值
  return startDate
}

// 判断日期是否在节气之后
export function isAfterSolarTerm(date: Date, term: SolarTerm): boolean {
  const termDate = calculateSolarTermTime(date.getFullYear(), term)
  return date >= termDate
}

// 获取当前节气
export function getCurrentSolarTerm(date: Date): SolarTerm {
  const year = date.getFullYear()
  const terms: SolarTerm[] = [
    '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
    '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
    '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
    '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
  ]
  
  for (let i = terms.length - 1; i >= 0; i--) {
    const termDate = calculateSolarTermTime(year, terms[i])
    if (date >= termDate) {
      return terms[i]
    }
  }
  
  // 如果当前日期在立春之前，返回上一年的大寒
  return '大寒'
}

// 获取下一个节气
export function getNextSolarTerm(date: Date): { term: SolarTerm, date: Date } {
  const year = date.getFullYear()
  const terms: SolarTerm[] = [
    '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
    '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
    '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
    '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
  ]
  
  for (let i = 0; i < terms.length; i++) {
    const termDate = calculateSolarTermTime(year, terms[i])
    if (date < termDate) {
      return { term: terms[i], date: termDate }
    }
  }
  
  // 如果当前日期在一年最后，返回下一年的立春
  const nextYearTermDate = calculateSolarTermTime(year + 1, '立春')
  return { term: '立春', date: nextYearTermDate }
}

// 计算两个日期之间的天数差
export function daysBetween(date1: Date, date2: Date): number {
  const timeDiff = date2.getTime() - date1.getTime()
  return Math.floor(timeDiff / (1000 * 3600 * 24))
}