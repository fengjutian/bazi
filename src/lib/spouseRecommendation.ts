// 配偶推荐算法
// 基于八字命理学的配偶匹配原则

import { calcBazi, BaziResult } from './bazi'
import { analyzeCompatibility } from './compatibility'

// 配偶推荐结果接口
export interface SpouseRecommendation {
  score: number // 匹配分数 (0-100)
  compatibilityLevel: '极佳' | '良好' | '一般' | '较差' | '不推荐'
  recommendedSpouse: {
    birthYear: number
    birthMonth: number
    birthDay: number
    birthHour: number
    pillars: string[]
    dayMaster: string
    fiveElements: Record<string, number>
  }
  analysis: {
    fiveElements: string[] // 五行分析
    tenGods: string[] // 十神分析
    dayMaster: string[] // 日主分析
    pillars: string[] // 四柱分析
    overall: string[] // 总体分析
  }
  advantages: string[] // 匹配优势
  considerations: string[] // 注意事项
}

// 根据日主推荐最佳配偶日主（结合五行平衡）
function getBestSpouseDayMaster(userDayMaster: string, userElements: Record<string, number>): string[] {
  // 日主相配原则：阴阳相配、五行互补
  const dayMasterMatches: Record<string, string[]> = {
    '甲': ['己', '庚', '辛'], // 阳木配阴土、阳金、阴金
    '乙': ['庚', '戊', '辛'], // 阴木配阳金、阳土、阴金
    '丙': ['辛', '壬', '癸'], // 阳火配阴金、阳水、阴水
    '丁': ['壬', '庚', '癸'], // 阴火配阳水、阳金、阴水
    '戊': ['癸', '甲', '乙'], // 阳土配阴水、阳木、阴木
    '己': ['甲', '壬', '癸'], // 阴土配阳木、阳水、阴水
    '庚': ['乙', '丙', '丁'], // 阳金配阴木、阳火、阴火
    '辛': ['丙', '戊', '丁'], // 阴金配阳火、阳土、阴火
    '壬': ['丁', '戊', '己'], // 阳水配阴火、阳土、阴土
    '癸': ['戊', '丙', '丁']  // 阴水配阳土、阳火、阴火
  }
  
  // 日主强弱分析
  const dayMasterElement = STEM_ELEMENT[userDayMaster as keyof typeof STEM_ELEMENT]
  const total = Object.values(userElements).reduce((a, b) => a + b, 0)
  const elementStrength = total > 0 ? userElements[dayMasterElement] / total : 0
  
  // 动态调整匹配策略
  if (elementStrength > 0.3) {
    // 日主过强：推荐克制或泄秀的日主
    const elementRecommendations: Record<string, string[]> = {
      '木': ['金', '火'], // 木强需金克火泄
      '火': ['水', '土'], // 火强需水克土泄
      '土': ['木', '金'], // 土强需木疏金泄
      '金': ['火', '水'], // 金强需火克水泄
      '水': ['土', '木']  // 水强需土克木泄
    }
    
    const recommendedElements = elementRecommendations[dayMasterElement] || []
    const recommendedDayMasters = Object.entries(STEM_ELEMENT)
      .filter(([_, element]) => recommendedElements.includes(element))
      .map(([dayMaster]) => dayMaster)
    
    return recommendedDayMasters.length > 0 ? recommendedDayMasters : dayMasterMatches[userDayMaster] || []
  }
  
  return dayMasterMatches[userDayMaster] || ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
}

// 根据五行推荐最佳配偶五行分布（综合平衡）
function getBestSpouseFiveElements(userElements: Record<string, number>): Record<string, number> {
  const total = Object.values(userElements).reduce((a, b) => a + b, 0)
  
  // 计算用户五行强弱
  const userStrengths = Object.entries(userElements).reduce((acc, [element, value]) => {
    acc[element] = total > 0 ? value / total : 0
    return acc
  }, {} as Record<string, number>)
  
  // 五行相生相克关系
  const elementGenerations: Record<string, string[]> = {
    '木': ['火'], // 木生火
    '火': ['土'], // 火生土
    '土': ['金'], // 土生金
    '金': ['水'], // 金生水
    '水': ['木']  // 水生木
  }
  
  const elementOvercomes: Record<string, string[]> = {
    '木': ['土'], // 木克土
    '土': ['水'], // 土克水
    '水': ['火'], // 水克火
    '火': ['金'], // 火克金
    '金': ['木']  // 金克木
  }
  
  // 推荐互补的五行分布
  const recommendedElements: Record<string, number> = {
    '木': 0.2, '火': 0.2, '土': 0.2, '金': 0.2, '水': 0.2
  }
  
  // 找出用户最强和最弱的元素
  const strongestElement = Object.entries(userStrengths).reduce((max, [element, strength]) => {
    return strength > max.strength ? { element, strength } : max
  }, { element: '', strength: 0 })
  
  const weakestElement = Object.entries(userStrengths).reduce((min, [element, strength]) => {
    return strength < min.strength ? { element, strength } : min
  }, { element: '', strength: 1 })
  
  // 动态调整推荐策略
  if (strongestElement.strength > 0.3) {
    // 最强元素过强：推荐克制或泄秀的元素
    const overcomeElements = elementOvercomes[strongestElement.element] || []
    overcomeElements.forEach(element => {
      recommendedElements[element] = Math.min(0.35, recommendedElements[element] + 0.15)
    })
    
    const generateElements = elementGenerations[strongestElement.element] || []
    generateElements.forEach(element => {
      recommendedElements[element] = Math.min(0.3, recommendedElements[element] + 0.1)
    })
    
    recommendedElements[strongestElement.element] = Math.max(0.05, recommendedElements[strongestElement.element] - 0.1)
  }
  
  if (weakestElement.strength < 0.1) {
    // 最弱元素过弱：推荐生扶的元素
    const generateElements = Object.entries(elementGenerations)
      .filter(([_, target]) => target === weakestElement.element)
      .map(([element]) => element)
    
    generateElements.forEach(element => {
      recommendedElements[element] = Math.min(0.35, recommendedElements[element] + 0.15)
    })
    
    recommendedElements[weakestElement.element] = Math.min(0.3, recommendedElements[weakestElement.element] + 0.1)
  }
  
  // 归一化处理
  const sum = Object.values(recommendedElements).reduce((a, b) => a + b, 0)
  Object.keys(recommendedElements).forEach(element => {
    recommendedElements[element] = recommendedElements[element] / sum
  })
  
  return recommendedElements
}

// 生成推荐的出生年份范围（符合传统婚配观念，结合年龄动态调整）
function getRecommendedBirthYears(userBirthYear: number, userGender: 'male' | 'female'): number[] {
  const currentYear = new Date().getFullYear()
  const userAge = currentYear - userBirthYear
  const minAge = 20
  const maxAge = 40
  
  const years: number[] = []
  
  // 根据用户年龄动态调整推荐范围
  let ageRange: { min: number, max: number }
  
  if (userAge < 25) {
    ageRange = { min: -2, max: 3 } // 年轻用户：年龄差较小
  } else if (userAge < 35) {
    ageRange = { min: -3, max: 5 } // 中年用户：年龄差适中
  } else {
    ageRange = { min: -5, max: 8 } // 年长用户：年龄差较大
  }
  
  if (userGender === 'male') {
    // 男性：优先推荐年龄相等或稍小的女性（传统观念：男大女小）
    for (let ageDiff = 0; ageDiff <= ageRange.max; ageDiff++) {
      const spouseYear = userBirthYear + ageDiff
      const spouseAge = currentYear - spouseYear
      
      if (spouseAge >= minAge && spouseAge <= maxAge && spouseYear >= 1900 && spouseYear <= currentYear) {
        years.push(spouseYear)
      }
    }
    
    // 如果没有合适的，放宽到推荐范围
    if (years.length === 0) {
      for (let ageDiff = ageRange.min; ageDiff <= ageRange.max; ageDiff++) {
        const spouseYear = userBirthYear + ageDiff
        const spouseAge = currentYear - spouseYear
        
        if (spouseAge >= minAge && spouseAge <= maxAge && spouseYear >= 1900 && spouseYear <= currentYear) {
          years.push(spouseYear)
        }
      }
    }
  } else {
    // 女性：优先推荐年龄相等或稍大的男性（传统观念：女小男大）
    for (let ageDiff = ageRange.min; ageDiff <= 0; ageDiff++) {
      const spouseYear = userBirthYear + ageDiff
      const spouseAge = currentYear - spouseYear
      
      if (spouseAge >= minAge && spouseAge <= maxAge && spouseYear >= 1900 && spouseYear <= currentYear) {
        years.push(spouseYear)
      }
    }
    
    // 如果没有合适的，放宽到推荐范围
    if (years.length === 0) {
      for (let ageDiff = ageRange.min; ageDiff <= ageRange.max; ageDiff++) {
        const spouseYear = userBirthYear + ageDiff
        const spouseAge = currentYear - spouseYear
        
        if (spouseAge >= minAge && spouseAge <= maxAge && spouseYear >= 1900 && spouseYear <= currentYear) {
          years.push(spouseYear)
        }
      }
    }
  }
  
  // 去重并排序
  const uniqueYears = [...new Set(years)].sort((a, b) => a - b)
  
  return uniqueYears.length > 0 ? uniqueYears : [userBirthYear - 2, userBirthYear, userBirthYear + 2]
}

// 生成推荐的配偶八字
function generateRecommendedSpouseBazi(
  userBazi: BaziResult,
  recommendedDayMasters: string[],
  recommendedYears: number[]
): BaziResult[] {
  const recommendations: BaziResult[] = []
  
  // 生成多个推荐组合
  for (const year of recommendedYears.slice(0, 3)) {
    for (const dayMaster of recommendedDayMasters.slice(0, 3)) {
      // 根据日主推荐合适的月份和时辰
      const monthHourCombinations = [
        { month: 1, hour: 6 },   // 寅月寅时（木旺）
        { month: 4, hour: 12 },  // 巳月午时（火旺）
        { month: 7, hour: 18 },  // 申月酉时（金旺）
        { month: 10, hour: 0 },  // 亥月子时（水旺）
        { month: 3, hour: 9 },   // 辰月巳时（土旺）
      ]
      
      for (const { month, hour } of monthHourCombinations) {
        // 随机生成日期（1-28日）
        const day = Math.floor(Math.random() * 28) + 1
        
        try {
          const spouseBazi = calcBazi(year, month, day, hour)
          
          // 检查日主是否符合推荐
          if (recommendedDayMasters.includes(spouseBazi.dayMaster)) {
            recommendations.push(spouseBazi)
            
            // 最多生成5个推荐
            if (recommendations.length >= 5) {
              return recommendations
            }
          }
        } catch (error) {
          // 忽略计算错误，继续生成下一个
          continue
        }
      }
    }
  }
  
  return recommendations
}

// 主推荐函数
export function recommendSpouse(
  userYear: number,
  userMonth: number,
  userDay: number,
  userHour: number,
  userGender: 'male' | 'female'
): SpouseRecommendation[] {
  try {
    // 计算用户八字
    const userBazi = calcBazi(userYear, userMonth, userDay, userHour)
    
    // 获取推荐参数
  const recommendedDayMasters = getBestSpouseDayMaster(userBazi.dayMaster, userBazi.fiveElements)
  const recommendedYears = getRecommendedBirthYears(userYear, userGender)
    
    // 生成推荐的配偶八字
    const spouseBaziList = generateRecommendedSpouseBazi(userBazi, recommendedDayMasters, recommendedYears)
    
    // 分析匹配度并排序
    const recommendations = spouseBaziList.map(spouseBazi => {
      const compatibility = analyzeCompatibility(userBazi, spouseBazi)
      
      return {
        score: compatibility.overallScore,
        compatibilityLevel: compatibility.compatibilityLevel,
        recommendedSpouse: {
          birthYear: parseInt(spouseBazi.birthDate.split('-')[0]),
          birthMonth: parseInt(spouseBazi.birthDate.split('-')[1]),
          birthDay: parseInt(spouseBazi.birthDate.split('-')[2]),
          birthHour: 12, // 默认使用中午12点
          pillars: Object.values(spouseBazi.pillars),
          dayMaster: spouseBazi.dayMaster,
          fiveElements: spouseBazi.fiveElements
        },
        analysis: {
          fiveElements: compatibility.analysis.fiveElements.advice,
          tenGods: compatibility.analysis.tenGods.advice,
          dayMaster: compatibility.analysis.dayMaster.advice,
          pillars: compatibility.analysis.pillars.advice,
          overall: compatibility.analysis.overall
        },
        advantages: generateAdvantages(compatibility),
        considerations: generateConsiderations(compatibility)
      }
    })
    
    // 按分数降序排序
    return recommendations.sort((a, b) => b.score - a.score)
    
  } catch (error) {
    console.error('配偶推荐计算错误:', error)
    return []
  }
}

// 生成匹配优势
export function generateAdvantages(compatibility: any): string[] {
  const advantages: string[] = []
  
  if (compatibility.analysis.fiveElements.score >= 70) {
    advantages.push('五行相配良好，气场和谐')
  }
  if (compatibility.analysis.tenGods.score >= 70) {
    advantages.push('十神互补，性格相投')
  }
  if (compatibility.analysis.dayMaster.score >= 70) {
    advantages.push('日主相配，命理基础稳固')
  }
  if (compatibility.analysis.pillars.score >= 70) {
    advantages.push('四柱协调，家庭关系和睦')
  }
  if (compatibility.overallScore >= 80) {
    advantages.push('总体匹配度极高，是理想伴侣')
  }
  
  return advantages.length > 0 ? advantages : ['基础匹配度尚可，需要更多磨合']
}

// 生成注意事项
export function generateConsiderations(compatibility: any): string[] {
  const considerations: string[] = []
  
  if (compatibility.analysis.fiveElements.score < 50) {
    considerations.push('五行略有冲突，需注意情绪调节')
  }
  if (compatibility.analysis.tenGods.score < 50) {
    considerations.push('十神关系需要更多理解与包容')
  }
  if (compatibility.analysis.dayMaster.score < 50) {
    considerations.push('日主强弱差异较大，需相互支持')
  }
  
  return considerations.length > 0 ? considerations : ['匹配度良好，继续保持沟通']
}