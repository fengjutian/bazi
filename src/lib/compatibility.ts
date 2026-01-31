// src/lib/compatibility.ts
// 男女八字相配分析系统

import { HeavenlyStem, EarthlyBranch, BaziResult } from './bazi'
import { TenGod } from './tenGod'
import { calculateCompleteElements, judgeDayMasterStrength, FiveElementsResult } from './fiveElements'

// 相配分析结果
export interface CompatibilityResult {
  overallScore: number // 总体相配分数（0-100）
  compatibilityLevel: '极佳' | '良好' | '一般' | '较差' | '不宜'
  analysis: {
    fiveElements: FiveElementsAnalysis
    tenGods: TenGodsAnalysis
    dayMaster: DayMasterAnalysis
    pillars: PillarsAnalysis
    overall: string[] // 总体分析建议
  }
  recommendations: string[] // 相配建议
}

// 五行相配分析
interface FiveElementsAnalysis {
  score: number
  generateChains: string[] // 相生链条
  overcomeChains: string[] // 相克链条
  balance: number // 五行平衡度
  advice: string[]
}

// 十神相配分析
interface TenGodsAnalysis {
  score: number
  complementaryPairs: string[] // 互补十神对
  conflictingPairs: string[] // 冲突十神对
  advice: string[]
}

// 日主相配分析
interface DayMasterAnalysis {
  score: number
  maleStrength: 'strong' | 'medium' | 'weak'
  femaleStrength: 'strong' | 'medium' | 'weak'
  combination: string // 日主组合描述
  advice: string[]
}

// 四柱相配分析
interface PillarsAnalysis {
  score: number
  yearPillarMatch: number // 年柱相配度
  monthPillarMatch: number // 月柱相配度
  dayPillarMatch: number // 日柱相配度（最重要）
  hourPillarMatch: number // 时柱相配度
  advice: string[]
}

// 五行生克关系（用于相配分析）
const ELEMENT_COMPATIBILITY = {
  // 相生关系（最佳）
  generate: {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  } as Record<string, string>,
  
  // 相克关系（需要谨慎）
  overcome: {
    '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
  } as Record<string, string>,
  
  // 相同关系（中性）
  same: {
    '木': '木', '火': '火', '土': '土', '金': '金', '水': '水'
  } as Record<string, string>
}

// 十神相配关系
const TENGOD_COMPATIBILITY = {
  // 最佳互补组合
  bestPairs: [
    ['正官', '正财'], // 官财相配
    ['正印', '食神'], // 印食相生
    ['比肩', '劫财']  // 比劫相助
  ],
  
  // 良好组合
  goodPairs: [
    ['七杀', '正印'], // 杀印相生
    ['伤官', '正财'], // 伤官生财
    ['偏财', '正官']  // 偏财配官
  ],
  
  // 需要谨慎的组合
  cautionPairs: [
    ['七杀', '七杀'], // 双杀相冲
    ['伤官', '伤官'], // 双伤相克
    ['劫财', '劫财']  // 双劫相争
  ]
}

// 日主相配关系
const DAYMASTER_COMPATIBILITY = {
  // 最佳日主组合（阴阳相配）
  bestCombinations: [
    ['甲', '己'], // 阳木 + 阴土
    ['乙', '庚'], // 阴木 + 阳金
    ['丙', '辛'], // 阳火 + 阴金
    ['丁', '壬'], // 阴火 + 阳水
    ['戊', '癸']  // 阳土 + 阴水
  ],
  
  // 良好组合
  goodCombinations: [
    ['甲', '癸'], ['乙', '壬'], ['丙', '乙'], ['丁', '甲'], ['戊', '丁'],
    ['己', '丙'], ['庚', '己'], ['辛', '戊'], ['壬', '辛'], ['癸', '庚']
  ]
}

// 主要分析函数
export function analyzeCompatibility(
  maleBazi: BaziResult,
  femaleBazi: BaziResult
): CompatibilityResult {
  // 1. 五行相配分析
  const fiveElementsAnalysis = analyzeFiveElementsCompatibility(maleBazi, femaleBazi)
  
  // 2. 十神相配分析
  const tenGodsAnalysis = analyzeTenGodsCompatibility(maleBazi, femaleBazi)
  
  // 3. 日主相配分析
  const dayMasterAnalysis = analyzeDayMasterCompatibility(maleBazi, femaleBazi)
  
  // 4. 四柱相配分析
  const pillarsAnalysis = analyzePillarsCompatibility(maleBazi, femaleBazi)
  
  // 5. 计算总体分数
  const overallScore = calculateOverallScore(
    fiveElementsAnalysis.score,
    tenGodsAnalysis.score,
    dayMasterAnalysis.score,
    pillarsAnalysis.score
  )
  
  // 6. 生成总体分析建议
  const overallAnalysis = generateOverallAnalysis(
    fiveElementsAnalysis,
    tenGodsAnalysis,
    dayMasterAnalysis,
    pillarsAnalysis
  )
  
  // 7. 生成相配建议
  const recommendations = generateRecommendations(overallScore, overallAnalysis)
  
  return {
    overallScore,
    compatibilityLevel: getCompatibilityLevel(overallScore),
    analysis: {
      fiveElements: fiveElementsAnalysis,
      tenGods: tenGodsAnalysis,
      dayMaster: dayMasterAnalysis,
      pillars: pillarsAnalysis,
      overall: overallAnalysis
    },
    recommendations
  }
}

// 五行相配分析
function analyzeFiveElementsCompatibility(
  maleBazi: BaziResult,
  femaleBazi: BaziResult
): FiveElementsAnalysis {
  const maleElements = calculateCompleteElements(
    Object.values(maleBazi.pillars),
    maleBazi.dayMaster
  )
  
  const femaleElements = calculateCompleteElements(
    Object.values(femaleBazi.pillars),
    femaleBazi.dayMaster
  )
  
  let score = 0
  const generateChains: string[] = []
  const overcomeChains: string[] = []
  
  // 分析五行生克关系
  Object.keys(maleElements.weights).forEach(element => {
    const maleWeight = maleElements.weights[element]
    const femaleWeight = femaleElements.weights[element]
    
    if (maleWeight > 0 && femaleWeight > 0) {
      // 相同五行：中性
      score += 10
    }
    
    // 检查相生关系
    const generateElement = ELEMENT_COMPATIBILITY.generate[element]
    if (generateElement && femaleElements.weights[generateElement] > 0) {
      generateChains.push(`${element} → ${generateElement}`)
      score += 20 // 相生关系加分
    }
    
    // 检查相克关系
    const overcomeElement = ELEMENT_COMPATIBILITY.overcome[element]
    if (overcomeElement && femaleElements.weights[overcomeElement] > 0) {
      overcomeChains.push(`${element} → ${overcomeElement}`)
      score -= 15 // 相克关系减分
    }
  })
  
  // 计算五行平衡度
  const balance = (maleElements.balance + femaleElements.balance) / 2
  score += Math.round(balance * 20) // 平衡度加分
  
  // 生成建议
  const advice: string[] = []
  if (generateChains.length > 0) {
    advice.push(`五行相生关系良好：${generateChains.join('，')}`)
  }
  if (overcomeChains.length > 0) {
    advice.push(`需要注意五行相克：${overcomeChains.join('，')}`)
  }
  if (balance > 0.7) {
    advice.push('双方五行平衡度较好')
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    generateChains,
    overcomeChains,
    balance,
    advice
  }
}

// 十神相配分析
function analyzeTenGodsCompatibility(
  maleBazi: BaziResult,
  femaleBazi: BaziResult
): TenGodsAnalysis {
  // 这里需要先计算十神，暂时使用简化分析
  let score = 50 // 基础分数
  const complementaryPairs: string[] = []
  const conflictingPairs: string[] = []
  
  // 简化分析：基于日主关系
  const maleDayMaster = maleBazi.dayMaster
  const femaleDayMaster = femaleBazi.dayMaster
  
  // 检查最佳组合
  TENGOD_COMPATIBILITY.bestPairs.forEach(pair => {
    // 这里需要实际的十神计算，暂时使用日主关系模拟
    complementaryPairs.push(`${pair[0]}与${pair[1]}相配`)
    score += 10
  })
  
  // 生成建议
  const advice: string[] = []
  if (complementaryPairs.length > 0) {
    advice.push(`十神互补：${complementaryPairs.join('，')}`)
  }
  if (conflictingPairs.length > 0) {
    advice.push(`十神冲突：${conflictingPairs.join('，')}`)
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    complementaryPairs,
    conflictingPairs,
    advice
  }
}

// 日主相配分析
function analyzeDayMasterCompatibility(
  maleBazi: BaziResult,
  femaleBazi: BaziResult
): DayMasterAnalysis {
  const maleDayMaster = maleBazi.dayMaster
  const femaleDayMaster = femaleBazi.dayMaster
  
  let score = 50
  let combination = ''
  
  // 检查最佳组合
  DAYMASTER_COMPATIBILITY.bestCombinations.forEach(([male, female]) => {
    if (maleDayMaster === male && femaleDayMaster === female) {
      combination = `${male}${female}相配（最佳组合）`
      score += 30
    }
  })
  
  // 检查良好组合
  if (!combination) {
    DAYMASTER_COMPATIBILITY.goodCombinations.forEach(([male, female]) => {
      if (maleDayMaster === male && femaleDayMaster === female) {
        combination = `${male}${female}相配（良好组合）`
        score += 15
      }
    })
  }
  
  // 默认组合
  if (!combination) {
    combination = `${maleDayMaster}${femaleDayMaster}组合`
  }
  
  // 判断日主强弱
  const maleElements = calculateCompleteElements(
    Object.values(maleBazi.pillars),
    maleBazi.dayMaster
  )
  const femaleElements = calculateCompleteElements(
    Object.values(femaleBazi.pillars),
    femaleBazi.dayMaster
  )
  
  const maleStrength = judgeDayMasterStrength(maleBazi.dayMaster, maleElements)
  const femaleStrength = judgeDayMasterStrength(femaleBazi.dayMaster, femaleElements)
  
  // 强弱搭配分析
  if (maleStrength === 'strong' && femaleStrength === 'weak') {
    score += 10
    combination += '，男强女弱'
  } else if (maleStrength === 'weak' && femaleStrength === 'strong') {
    score += 5
    combination += '，女强男弱'
  } else if (maleStrength === femaleStrength) {
    score += 8
    combination += '，强弱相当'
  }
  
  const advice: string[] = [combination]
  
  return {
    score: Math.max(0, Math.min(100, score)),
    maleStrength,
    femaleStrength,
    combination,
    advice
  }
}

// 四柱相配分析
function analyzePillarsCompatibility(
  maleBazi: BaziResult,
  femaleBazi: BaziResult
): PillarsAnalysis {
  let totalScore = 0
  const advice: string[] = []
  
  // 年柱相配度（家庭背景）
  const yearMatch = analyzePillarMatch(maleBazi.pillars.year, femaleBazi.pillars.year)
  totalScore += yearMatch
  if (yearMatch > 15) advice.push('年柱相配，家庭背景相似')
  
  // 月柱相配度（性格特点）
  const monthMatch = analyzePillarMatch(maleBazi.pillars.month, femaleBazi.pillars.month)
  totalScore += monthMatch
  if (monthMatch > 15) advice.push('月柱相配，性格特点互补')
  
  // 日柱相配度（婚姻基础）
  const dayMatch = analyzePillarMatch(maleBazi.pillars.day, femaleBazi.pillars.day) * 2 // 日柱权重加倍
  totalScore += dayMatch
  if (dayMatch > 30) advice.push('日柱相配，婚姻基础牢固')
  
  // 时柱相配度（晚年生活）
  const hourMatch = analyzePillarMatch(maleBazi.pillars.hour, femaleBazi.pillars.hour)
  totalScore += hourMatch
  if (hourMatch > 15) advice.push('时柱相配，晚年生活和谐')
  
  return {
    score: Math.max(0, Math.min(100, totalScore)),
    yearPillarMatch: yearMatch,
    monthPillarMatch: monthMatch,
    dayPillarMatch: dayMatch / 2, // 还原实际值
    hourPillarMatch: hourMatch,
    advice
  }
}

// 分析单柱相配度
function analyzePillarMatch(pillar1: string, pillar2: string): number {
  let score = 0
  
  // 天干相配
  const stem1 = pillar1[0]
  const stem2 = pillar2[0]
  
  // 地支相配
  const branch1 = pillar1[1]
  const branch2 = pillar2[1]
  
  // 天干相同或相生加分
  if (stem1 === stem2) score += 10
  
  // 地支三合、六合加分
  const combinations = [
    ['子', '丑'], ['寅', '亥'], ['卯', '戌'], ['辰', '酉'], ['巳', '申'], ['午', '未']
  ]
  
  combinations.forEach(([b1, b2]) => {
    if ((branch1 === b1 && branch2 === b2) || (branch1 === b2 && branch2 === b1)) {
      score += 15
    }
  })
  
  return score
}

// 计算总体分数
function calculateOverallScore(
  fiveElementsScore: number,
  tenGodsScore: number,
  dayMasterScore: number,
  pillarsScore: number
): number {
  // 权重分配：五行30%，十神25%，日主25%，四柱20%
  return Math.round(
    fiveElementsScore * 0.3 +
    tenGodsScore * 0.25 +
    dayMasterScore * 0.25 +
    pillarsScore * 0.2
  )
}

// 生成总体分析
function generateOverallAnalysis(
  fiveElements: FiveElementsAnalysis,
  tenGods: TenGodsAnalysis,
  dayMaster: DayMasterAnalysis,
  pillars: PillarsAnalysis
): string[] {
  const analysis: string[] = []
  
  if (fiveElements.score >= 70) {
    analysis.push('五行相配度良好')
  }
  if (tenGods.score >= 70) {
    analysis.push('十神互补性较好')
  }
  if (dayMaster.score >= 70) {
    analysis.push('日主组合适宜')
  }
  if (pillars.score >= 70) {
    analysis.push('四柱搭配和谐')
  }
  
  return analysis
}

// 生成相配建议
function generateRecommendations(score: number, analysis: string[]): string[] {
  const recommendations: string[] = []
  
  if (score >= 80) {
    recommendations.push('八字相配度极高，是理想的伴侣组合')
    recommendations.push('建议珍惜缘分，共同经营美好未来')
  } else if (score >= 60) {
    recommendations.push('八字相配度良好，有较好的婚姻基础')
    recommendations.push('需要相互理解和包容，共同成长')
  } else if (score >= 40) {
    recommendations.push('八字相配度一般，需要更多努力经营')
    recommendations.push('建议加强沟通，寻找共同兴趣')
  } else {
    recommendations.push('八字相配度较低，需要慎重考虑')
    recommendations.push('建议深入了解，评估是否适合')
  }
  
  return recommendations.concat(analysis)
}

// 获取相配等级
function getCompatibilityLevel(score: number): '极佳' | '良好' | '一般' | '较差' | '不宜' {
  if (score >= 80) return '极佳'
  if (score >= 60) return '良好'
  if (score >= 40) return '一般'
  if (score >= 20) return '较差'
  return '不宜'
}