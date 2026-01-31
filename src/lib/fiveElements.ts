// src/lib/fiveElements.ts
// 完整的五行计算体系（包含地支藏干）

import { HeavenlyStem, EarthlyBranch, STEM_ELEMENT, BRANCH_ELEMENT } from './bazi'

// 地支藏干映射（主气、中气、余气）
const HIDDEN_STEMS: Record<EarthlyBranch, { main: HeavenlyStem; secondary?: HeavenlyStem; residual?: HeavenlyStem }> = {
  '子': { main: '癸' },
  '丑': { main: '己', secondary: '癸', residual: '辛' },
  '寅': { main: '甲', secondary: '丙', residual: '戊' },
  '卯': { main: '乙' },
  '辰': { main: '戊', secondary: '乙', residual: '癸' },
  '巳': { main: '丙', secondary: '庚', residual: '戊' },
  '午': { main: '丁', secondary: '己' },
  '未': { main: '己', secondary: '丁', residual: '乙' },
  '申': { main: '庚', secondary: '壬', residual: '戊' },
  '酉': { main: '辛' },
  '戌': { main: '戊', secondary: '辛', residual: '丁' },
  '亥': { main: '壬', secondary: '甲' }
}

// 五行生克关系
export const ELEMENT_RELATIONS = {
  // 相生：木→火→土→金→水→木
  generate: {
    '木': '火',
    '火': '土', 
    '土': '金',
    '金': '水',
    '水': '木'
  } as Record<string, string>,
  
  // 相克：木→土→水→火→金→木
  overcome: {
    '木': '土',
    '土': '水',
    '水': '火', 
    '火': '金',
    '金': '木'
  } as Record<string, string>
}

// 五行力量权重
export const ELEMENT_WEIGHTS = {
  // 天干权重
  stem: 1.0,
  
  // 地支主气权重
  branchMain: 0.6,
  
  // 地支中气权重  
  branchSecondary: 0.3,
  
  // 地支余气权重
  branchResidual: 0.1,
  
  // 日主额外权重（代表命主自身）
  dayMasterBonus: 3.0
}

// 完整的五行统计结果
export interface FiveElementsResult {
  counts: Record<string, number> // 原始计数
  weights: Record<string, number> // 加权后的力量
  strengths: Record<string, 'strong' | 'medium' | 'weak'> // 强弱判断
  balance: number // 五行平衡度（0-1，越高越平衡）
  generateChains: string[] // 相生链条
  overcomeChains: string[] // 相克链条
}

// 计算单个地支的五行力量
export function calculateBranchElements(branch: EarthlyBranch): Record<string, number> {
  const elements: Record<string, number> = { 木:0, 火:0, 土:0, 金:0, 水:0 }
  const hidden = HIDDEN_STEMS[branch]
  
  // 地支本身的五行
  elements[BRANCH_ELEMENT[branch]] += ELEMENT_WEIGHTS.branchMain
  
  // 藏干的五行
  if (hidden.main) {
    elements[STEM_ELEMENT[hidden.main]] += ELEMENT_WEIGHTS.branchMain
  }
  if (hidden.secondary) {
    elements[STEM_ELEMENT[hidden.secondary]] += ELEMENT_WEIGHTS.branchSecondary
  }
  if (hidden.residual) {
    elements[STEM_ELEMENT[hidden.residual]] += ELEMENT_WEIGHTS.branchResidual
  }
  
  return elements
}

// 计算完整的五行力量
export function calculateCompleteElements(
  pillars: string[], 
  dayMaster: HeavenlyStem
): FiveElementsResult {
  const counts: Record<string, number> = { 木:0, 火:0, 土:0, 金:0, 水:0 }
  const weights: Record<string, number> = { 木:0, 火:0, 土:0, 金:0, 水:0 }
  
  // 计算日主额外权重
  const dayMasterElement = STEM_ELEMENT[dayMaster]
  weights[dayMasterElement] += ELEMENT_WEIGHTS.dayMasterBonus
  counts[dayMasterElement] += 1
  
  // 计算四柱的五行
  pillars.forEach(pillar => {
    const stem = pillar[0] as HeavenlyStem
    const branch = pillar[1] as EarthlyBranch
    
    // 天干五行
    const stemElement = STEM_ELEMENT[stem]
    counts[stemElement] += 1
    weights[stemElement] += ELEMENT_WEIGHTS.stem
    
    // 地支五行（包含藏干）
    const branchElements = calculateBranchElements(branch)
    Object.entries(branchElements).forEach(([element, weight]) => {
      counts[element] += 1
      weights[element] += weight
    })
  })
  
  // 计算五行强弱
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
  const strengths: Record<string, 'strong' | 'medium' | 'weak'> = {}
  
  Object.entries(weights).forEach(([element, weight]) => {
    const ratio = weight / totalWeight
    if (ratio >= 0.25) {
      strengths[element] = 'strong'
    } else if (ratio >= 0.15) {
      strengths[element] = 'medium'
    } else {
      strengths[element] = 'weak'
    }
  })
  
  // 计算五行平衡度
  const weightValues = Object.values(weights)
  const maxWeight = Math.max(...weightValues)
  const minWeight = Math.min(...weightValues)
  const balance = minWeight > 0 ? (1 - (maxWeight - minWeight) / maxWeight) : 0
  
  // 分析相生相克关系
  const generateChains = analyzeGenerateChains(weights)
  const overcomeChains = analyzeOvercomeChains(weights)
  
  return {
    counts,
    weights,
    strengths,
    balance,
    generateChains,
    overcomeChains
  }
}

// 分析相生链条
function analyzeGenerateChains(weights: Record<string, number>): string[] {
  const chains: string[] = []
  const elements = Object.keys(weights) as string[]
  
  elements.forEach(element => {
    if (weights[element] > 0) {
      const nextElement = ELEMENT_RELATIONS.generate[element]
      if (nextElement && weights[nextElement] > 0) {
        chains.push(`${element} → ${nextElement}`)
      }
    }
  })
  
  return chains
}

// 分析相克链条
function analyzeOvercomeChains(weights: Record<string, number>): string[] {
  const chains: string[] = []
  const elements = Object.keys(weights) as string[]
  
  elements.forEach(element => {
    if (weights[element] > 0) {
      const nextElement = ELEMENT_RELATIONS.overcome[element]
      if (nextElement && weights[nextElement] > 0) {
        chains.push(`${element} → ${nextElement}`)
      }
    }
  })
  
  return chains
}

// 判断日主强弱
export function judgeDayMasterStrength(
  dayMaster: HeavenlyStem, 
  elements: FiveElementsResult
): 'strong' | 'medium' | 'weak' {
  const dayMasterElement = STEM_ELEMENT[dayMaster]
  return elements.strengths[dayMasterElement] || 'medium'
}

// 获取用神建议
export function getUsefulGodsAdvice(
  dayMaster: HeavenlyStem,
  elements: FiveElementsResult
): string[] {
  const advice: string[] = []
  const dayMasterElement = STEM_ELEMENT[dayMaster]
  const strength = elements.strengths[dayMasterElement]
  
  if (strength === 'weak') {
    // 身弱：需要生扶
    const generateElement = Object.entries(ELEMENT_RELATIONS.generate)
      .find(([_, target]) => target === dayMasterElement)?.[0]
    
    if (generateElement && elements.strengths[generateElement] === 'strong') {
      advice.push(`身弱，宜用${generateElement}生扶`)
    } else {
      advice.push('身弱，宜寻求生扶，增强自身力量')
    }
  } else if (strength === 'strong') {
    // 身强：需要克泄
    const overcomeElement = ELEMENT_RELATIONS.overcome[dayMasterElement]
    const generateElement = ELEMENT_RELATIONS.generate[dayMasterElement]
    
    if (overcomeElement && elements.strengths[overcomeElement] === 'weak') {
      advice.push(`身强，宜用${overcomeElement}克制`)
    } else if (generateElement && elements.strengths[generateElement] === 'weak') {
      advice.push(`身强，宜用${generateElement}泄秀`)
    } else {
      advice.push('身强，宜寻求克制或泄秀，平衡五行')
    }
  }
  
  // 平衡建议
  if (elements.balance < 0.3) {
    advice.push('五行严重失衡，需特别注意调理')
  } else if (elements.balance < 0.6) {
    advice.push('五行略有失衡，建议适当调整')
  } else {
    advice.push('五行相对平衡，运势较为平稳')
  }
  
  return advice
}