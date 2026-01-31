// src/lib/compatibility.ts
// 男女八字相配分析系统

import { HeavenlyStem, EarthlyBranch, BaziResult, STEM_ELEMENT } from './bazi'
import { TenGod, calcAllTenGods } from './tenGod'
import { calculateCompleteElements, judgeDayMasterStrength, FiveElementsResult } from './fiveElements'
import { calcDaYun, DaYunDetail, calcLiuNianFull, LiuNianDetail } from './daYun'

// 相配分析结果
export interface CompatibilityResult {
  overallScore: number // 总体相配分数（0-100）
  compatibilityLevel: '极佳' | '良好' | '一般' | '较差' | '不宜'
  analysis: {
    fiveElements: FiveElementsAnalysis
    tenGods: TenGodsAnalysis
    dayMaster: DayMasterAnalysis
    pillars: PillarsAnalysis
    daYun: DaYunAnalysis // 新增大运分析
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

// 大运相配分析
interface DaYunAnalysis {
  score: number
  startAgeSync: number // 起运时间同步度
  pillarCompatibility: number // 大运柱相配度
  keyPeriods: KeyPeriod[] // 关键时期分析
  advice: string[]
}

// 关键时期分析
interface KeyPeriod {
  ageRange: string // 年龄范围
  description: string // 时期描述
  compatibility: 'high' | 'medium' | 'low' // 相配度
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
  
  // 5. 大运相配分析
  const daYunAnalysis = analyzeDaYunCompatibility(maleBazi, femaleBazi)
  
  // 6. 计算总体分数
  const overallScore = calculateOverallScore(
    fiveElementsAnalysis.score,
    tenGodsAnalysis.score,
    dayMasterAnalysis.score,
    pillarsAnalysis.score,
    daYunAnalysis.score
  )
  
  // 7. 生成总体分析建议
  const overallAnalysis = generateOverallAnalysis(
    fiveElementsAnalysis,
    tenGodsAnalysis,
    dayMasterAnalysis,
    pillarsAnalysis,
    daYunAnalysis
  )
  
  // 8. 生成相配建议
  const recommendations = generateRecommendations(overallScore, overallAnalysis)
  
  return {
    overallScore,
    compatibilityLevel: getCompatibilityLevel(overallScore),
    analysis: {
      fiveElements: fiveElementsAnalysis,
      tenGods: tenGodsAnalysis,
      dayMaster: dayMasterAnalysis,
      pillars: pillarsAnalysis,
      daYun: daYunAnalysis,
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
  
  // 分析五行生克关系（精细化权重计算）
  Object.keys(maleElements.weights).forEach(element => {
    const maleWeight = maleElements.weights[element]
    const femaleWeight = femaleElements.weights[element]
    
    // 相同五行：根据力量强弱调整分数
    if (maleWeight > 0 && femaleWeight > 0) {
      const strengthBonus = Math.min(maleWeight, femaleWeight) * 0.5
      score += Math.round(10 + strengthBonus)
    }
    
    // 检查相生关系（根据力量强弱调整）
    const generateElement = ELEMENT_COMPATIBILITY.generate[element]
    if (generateElement && femaleElements.weights[generateElement] > 0) {
      const generateStrength = Math.min(maleWeight, femaleElements.weights[generateElement])
      const generateBonus = generateStrength * 0.3
      generateChains.push(`${element} → ${generateElement}`)
      score += Math.round(20 + generateBonus) // 相生关系加分
    }
    
    // 检查相克关系（根据力量强弱调整）
    const overcomeElement = ELEMENT_COMPATIBILITY.overcome[element]
    if (overcomeElement && femaleElements.weights[overcomeElement] > 0) {
      const overcomeStrength = Math.min(maleWeight, femaleElements.weights[overcomeElement])
      const overcomePenalty = overcomeStrength * 0.2
      overcomeChains.push(`${element} → ${overcomeElement}`)
      score -= Math.round(15 + overcomePenalty) // 相克关系减分
    }
  })
  
  // 计算五行平衡度（精细化）
  const balance = (maleElements.balance + femaleElements.balance) / 2
  const balanceBonus = balance * 25 // 平衡度加分（提高权重）
  score += Math.round(balanceBonus)
  
  // 检查五行互补性（新增）
  const complementarity = analyzeElementComplementarity(maleElements, femaleElements)
  score += complementarity * 0.5
  
  // 生成建议（精细化）
  const advice: string[] = []
  if (generateChains.length > 0) {
    advice.push(`五行相生关系良好：${generateChains.slice(0, 3).join('，')}`)
  }
  if (overcomeChains.length > 0) {
    advice.push(`需要注意五行相克：${overcomeChains.slice(0, 3).join('，')}`)
  }
  
  // 根据平衡度给出具体建议
  if (balance > 0.8) {
    advice.push('双方五行平衡度极佳')
  } else if (balance > 0.6) {
    advice.push('双方五行平衡度较好')
  } else if (balance < 0.4) {
    advice.push('五行平衡度需要关注')
  }
  
  // 根据互补性给出建议
  if (complementarity > 15) {
    advice.push('五行互补性良好')
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    generateChains,
    overcomeChains,
    balance,
    advice
  }
}

// 分析五行互补性（新增）
function analyzeElementComplementarity(
  maleElements: FiveElementsResult,
  femaleElements: FiveElementsResult
): number {
  let complementarity = 0
  
  // 检查双方五行力量的互补性
  Object.keys(maleElements.weights).forEach(element => {
    const maleStrength = maleElements.strengths[element]
    const femaleStrength = femaleElements.strengths[element]
    
    // 强弱互补：一方强一方弱为佳
    if ((maleStrength === 'strong' && femaleStrength === 'weak') ||
        (maleStrength === 'weak' && femaleStrength === 'strong')) {
      complementarity += 10
    }
    
    // 中等互补：双方中等为次佳
    if (maleStrength === 'medium' && femaleStrength === 'medium') {
      complementarity += 5
    }
    
    // 过度偏重：双方都强或都弱需要关注
    if ((maleStrength === 'strong' && femaleStrength === 'strong') ||
        (maleStrength === 'weak' && femaleStrength === 'weak')) {
      complementarity -= 8
    }
  })
  
  return complementarity
}

// 十神相配分析
function analyzeTenGodsCompatibility(
  maleBazi: BaziResult,
  femaleBazi: BaziResult
): TenGodsAnalysis {
  // 计算双方的实际十神
  const maleTenGods = calcAllTenGods(
    maleBazi.dayMaster,
    Object.values(maleBazi.pillars)
  )
  
  const femaleTenGods = calcAllTenGods(
    femaleBazi.dayMaster,
    Object.values(femaleBazi.pillars)
  )
  
  let score = 50 // 基础分数
  const complementaryPairs: string[] = []
  const conflictingPairs: string[] = []
  
  // 分析十神组合关系
  maleTenGods.forEach(maleTg => {
    femaleTenGods.forEach(femaleTg => {
      const maleRelation = maleTg.relation
      const femaleRelation = femaleTg.relation
      
      // 检查最佳互补组合
      TENGOD_COMPATIBILITY.bestPairs.forEach(pair => {
        if ((maleRelation === pair[0] && femaleRelation === pair[1]) ||
            (maleRelation === pair[1] && femaleRelation === pair[0])) {
          complementaryPairs.push(`${maleRelation}与${femaleRelation}相配`)
          score += 15
        }
      })
      
      // 检查良好组合
      TENGOD_COMPATIBILITY.goodPairs.forEach(pair => {
        if ((maleRelation === pair[0] && femaleRelation === pair[1]) ||
            (maleRelation === pair[1] && femaleRelation === pair[0])) {
          complementaryPairs.push(`${maleRelation}与${femaleRelation}相配`)
          score += 10
        }
      })
      
      // 检查需要谨慎的组合
      TENGOD_COMPATIBILITY.cautionPairs.forEach(pair => {
        if ((maleRelation === pair[0] && femaleRelation === pair[1]) ||
            (maleRelation === pair[1] && femaleRelation === pair[0])) {
          conflictingPairs.push(`${maleRelation}与${femaleRelation}相冲`)
          score -= 12
        }
      })
      
      // 检查相同十神的组合（中性偏负）
      if (maleRelation === femaleRelation) {
        // 某些相同十神组合需要谨慎
        if (['七杀', '伤官', '劫财'].includes(maleRelation)) {
          conflictingPairs.push(`${maleRelation}与${femaleRelation}相冲`)
          score -= 8
        } else {
          // 其他相同十神组合中性
          score += 5
        }
      }
    })
  })
  
  // 生成建议
  const advice: string[] = []
  if (complementaryPairs.length > 0) {
    advice.push(`十神互补：${complementaryPairs.slice(0, 3).join('，')}`)
  }
  if (conflictingPairs.length > 0) {
    advice.push(`十神冲突：${conflictingPairs.slice(0, 3).join('，')}`)
  }
  
  // 根据十神分布给出总体建议
  const maleTenGodCounts = countTenGods(maleTenGods)
  const femaleTenGodCounts = countTenGods(femaleTenGods)
  
  // 检查十神平衡性
  if (isTenGodBalanced(maleTenGodCounts) && isTenGodBalanced(femaleTenGodCounts)) {
    advice.push('双方十神分布较为平衡')
    score += 5
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    complementaryPairs: Array.from(new Set(complementaryPairs)),
    conflictingPairs: Array.from(new Set(conflictingPairs)),
    advice
  }
}

// 统计十神数量
function countTenGods(tenGods: TenGod[]): Record<string, number> {
  const counts: Record<string, number> = {}
  tenGods.forEach(tg => {
    counts[tg.relation] = (counts[tg.relation] || 0) + 1
  })
  return counts
}

// 判断十神是否平衡（没有过度偏重某类十神）
function isTenGodBalanced(counts: Record<string, number>): boolean {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0)
  if (total === 0) return true
  
  // 检查是否有十神数量超过总数的一半
  const maxCount = Math.max(...Object.values(counts))
  return maxCount / total <= 0.5
}

// 大运相配分析
function analyzeDaYunCompatibility(
  maleBazi: BaziResult,
  femaleBazi: BaziResult
): DaYunAnalysis {
  let score = 50
  const keyPeriods: KeyPeriod[] = []
  const advice: string[] = []
  
  // 计算双方的大运
  const maleDaYun = calcDaYun(maleBazi.dayMaster, new Date(maleBazi.birthDate), true)
  const femaleDaYun = calcDaYun(femaleBazi.dayMaster, new Date(femaleBazi.birthDate), false)
  
  // 1. 分析起运时间同步度
  const maleStartAge = maleDaYun[0]?.startAge || 0
  const femaleStartAge = femaleDaYun[0]?.startAge || 0
  const startAgeDiff = Math.abs(maleStartAge - femaleStartAge)
  const startAgeSync = Math.max(0, 100 - startAgeDiff * 10)
  
  if (startAgeDiff <= 2) {
    advice.push('起运时间相近，运势周期较为同步')
    score += 15
  } else if (startAgeDiff <= 5) {
    advice.push('起运时间有一定差异，但仍在可接受范围')
    score += 5
  } else {
    advice.push('起运时间差异较大，运势周期协调性需要关注')
    score -= 10
  }
  
  // 2. 分析大运柱相配度
  let pillarCompatibility = 0
  const commonPeriods = Math.min(maleDaYun.length, femaleDaYun.length)
  
  for (let i = 0; i < commonPeriods; i++) {
    const malePillar = maleDaYun[i].pillar
    const femalePillar = femaleDaYun[i].pillar
    
    // 简化分析：检查天干地支的五行关系
    const maleStemElement = STEM_ELEMENT[malePillar[0] as HeavenlyStem]
    const femaleStemElement = STEM_ELEMENT[femalePillar[0] as HeavenlyStem]
    
    // 检查相生关系
    const generateElement = ELEMENT_COMPATIBILITY.generate[maleStemElement]
    if (generateElement === femaleStemElement) {
      pillarCompatibility += 25
    }
    
    // 检查相克关系（减分）
    const overcomeElement = ELEMENT_COMPATIBILITY.overcome[maleStemElement]
    if (overcomeElement === femaleStemElement) {
      pillarCompatibility -= 15
    }
    
    // 检查相同关系（中性）
    if (maleStemElement === femaleStemElement) {
      pillarCompatibility += 5
    }
  }
  
  pillarCompatibility = Math.max(0, Math.min(100, pillarCompatibility / commonPeriods))
  score += Math.round(pillarCompatibility / 4)
  
  // 3. 分析关键时期
  // 重点关注20-40岁的关键人生阶段
  const keyAges = [20, 25, 30, 35, 40]
  keyAges.forEach(age => {
    const malePeriod = maleDaYun.find(dy => Math.abs(dy.startAge - age) <= 5)
    const femalePeriod = femaleDaYun.find(dy => Math.abs(dy.startAge - age) <= 5)
    
    if (malePeriod && femalePeriod) {
      const compatibility = analyzePeriodCompatibility(malePeriod, femalePeriod)
      keyPeriods.push({
        ageRange: `${age - 2}-${age + 2}岁`,
        description: `双方${age}岁左右大运分析`,
        compatibility
      })
    }
  })
  
  // 根据关键时期分析给出建议
  const highPeriods = keyPeriods.filter(p => p.compatibility === 'high').length
  if (highPeriods >= 3) {
    advice.push('关键人生阶段运势协调性良好')
    score += 10
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    startAgeSync,
    pillarCompatibility,
    keyPeriods,
    advice
  }
}

// 分析特定时期的大运相配度
function analyzePeriodCompatibility(malePeriod: DaYunDetail, femalePeriod: DaYunDetail): 'high' | 'medium' | 'low' {
  const maleStemElement = STEM_ELEMENT[malePeriod.pillar[0] as HeavenlyStem]
  const femaleStemElement = STEM_ELEMENT[femalePeriod.pillar[0] as HeavenlyStem]
  
  // 检查相生关系
  const generateElement = ELEMENT_COMPATIBILITY.generate[maleStemElement]
  if (generateElement === femaleStemElement) {
    return 'high'
  }
  
  // 检查相克关系
  const overcomeElement = ELEMENT_COMPATIBILITY.overcome[maleStemElement]
  if (overcomeElement === femaleStemElement) {
    return 'low'
  }
  
  return 'medium'
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
  const maleStrength = judgeDayMasterStrength(maleBazi.dayMaster, Object.values(maleBazi.pillars))
  const femaleStrength = judgeDayMasterStrength(femaleBazi.dayMaster, Object.values(femaleBazi.pillars))
  
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
  
  // 1. 天干相配分析
  // 天干相同：加分
  if (stem1 === stem2) score += 10
  
  // 天干相生：加分（木生火、火生土、土生金、金生水、水生木）
  const stemGenerations: Record<string, string> = {
    '甲': '丙', '乙': '丁', // 木生火
    '丙': '戊', '丁': '己', // 火生土
    '戊': '庚', '己': '辛', // 土生金
    '庚': '壬', '辛': '癸', // 金生水
    '壬': '甲', '癸': '乙'  // 水生木
  }
  
  if (stemGenerations[stem1] === stem2 || stemGenerations[stem2] === stem1) {
    score += 8
  }
  
  // 天干相合：加分（甲己合、乙庚合、丙辛合、丁壬合、戊癸合）
  const stemCombinations = [
    ['甲', '己'], ['乙', '庚'], ['丙', '辛'], ['丁', '壬'], ['戊', '癸']
  ]
  
  stemCombinations.forEach(([s1, s2]) => {
    if ((stem1 === s1 && stem2 === s2) || (stem1 === s2 && stem2 === s1)) {
      score += 12
    }
  })
  
  // 2. 地支相配分析
  // 地支六合：加分
  const branchCombinations = [
    ['子', '丑'], ['寅', '亥'], ['卯', '戌'], ['辰', '酉'], ['巳', '申'], ['午', '未']
  ]
  
  branchCombinations.forEach(([b1, b2]) => {
    if ((branch1 === b1 && branch2 === b2) || (branch1 === b2 && branch2 === b1)) {
      score += 15
    }
  })
  
  // 地支三合：加分（申子辰、寅午戌、巳酉丑、亥卯未）
  const branchTriplets = [
    ['申', '子', '辰'], ['寅', '午', '戌'], ['巳', '酉', '丑'], ['亥', '卯', '未']
  ]
  
  branchTriplets.forEach(triplet => {
    if (triplet.includes(branch1) && triplet.includes(branch2) && branch1 !== branch2) {
      score += 12
    }
  })
  
  // 地支相生：加分
  const branchGenerations: Record<string, string[]> = {
    '寅': ['午', '巳'], '卯': ['午', '巳'], // 木生火
    '午': ['辰', '戌', '丑', '未'], '巳': ['辰', '戌', '丑', '未'], // 火生土
    '辰': ['申', '酉'], '戌': ['申', '酉'], '丑': ['申', '酉'], '未': ['申', '酉'], // 土生金
    '申': ['子', '亥'], '酉': ['子', '亥'], // 金生水
    '子': ['寅', '卯'], '亥': ['寅', '卯']  // 水生木
  }
  
  if (branchGenerations[branch1]?.includes(branch2) || branchGenerations[branch2]?.includes(branch1)) {
    score += 6
  }
  
  // 3. 基础匹配度：即使没有特殊关系，只要五行属性不冲突就加分
  const STEM_ELEMENT = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
  }
  
  const BRANCH_ELEMENT = {
    '寅': '木', '卯': '木', '午': '火', '巳': '火', '辰': '土', '戌': '土', '丑': '土', '未': '土',
    '申': '金', '酉': '金', '子': '水', '亥': '水'
  }
  
  const stemElement1 = STEM_ELEMENT[stem1 as keyof typeof STEM_ELEMENT]
  const stemElement2 = STEM_ELEMENT[stem2 as keyof typeof STEM_ELEMENT]
  const branchElement1 = BRANCH_ELEMENT[branch1 as keyof typeof BRANCH_ELEMENT]
  const branchElement2 = BRANCH_ELEMENT[branch2 as keyof typeof BRANCH_ELEMENT]
  
  // 天干五行不冲突：加分
  if (stemElement1 && stemElement2 && stemElement1 !== stemElement2) {
    score += 3
  }
  
  // 地支五行不冲突：加分
  if (branchElement1 && branchElement2 && branchElement1 !== branchElement2) {
    score += 3
  }
  
  return Math.min(score, 25) // 单柱最高分25分
}

// 计算总体分数
function calculateOverallScore(
  fiveElementsScore: number,
  tenGodsScore: number,
  dayMasterScore: number,
  pillarsScore: number,
  daYunScore: number
): number {
  // 加权平均：日柱最重要，五行次之，十神、大运和年柱再次
  const weights = {
    fiveElements: 0.20,
    tenGods: 0.15,
    dayMaster: 0.25,
    pillars: 0.20,
    daYun: 0.20
  }
  
  const weightedScore = 
    fiveElementsScore * weights.fiveElements +
    tenGodsScore * weights.tenGods +
    dayMasterScore * weights.dayMaster +
    pillarsScore * weights.pillars +
    daYunScore * weights.daYun
  
  return Math.round(weightedScore)
}

// 生成总体分析
function generateOverallAnalysis(
  fiveElements: FiveElementsAnalysis,
  tenGods: TenGodsAnalysis,
  dayMaster: DayMasterAnalysis,
  pillars: PillarsAnalysis,
  daYun: DaYunAnalysis
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
  if (daYun.score >= 70) {
    analysis.push('大运走势协调')
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