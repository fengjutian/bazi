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

// 根据日主推荐最佳配偶日主
function getBestSpouseDayMaster(userDayMaster: string): string[] {
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
  
  return dayMasterMatches[userDayMaster] || ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
}

// 根据五行推荐最佳配偶五行分布
function getBestSpouseFiveElements(userElements: Record<string, number>): Record<string, number> {
  const total = Object.values(userElements).reduce((a, b) => a + b, 0)
  
  // 计算用户五行强弱
  const userStrengths = Object.entries(userElements).reduce((acc, [element, value]) => {
    acc[element] = value / total
    return acc
  }, {} as Record<string, number>)
  
  // 推荐互补的五行分布
  const elementRecommendations: Record<string, string[]> = {
    '木': ['土', '金'], // 木强需土金克制
    '火': ['水', '金'], // 火强需水金克制
    '土': ['木', '水'], // 土强需木水疏泄
    '金': ['火', '木'], // 金强需火木克制
    '水': ['土', '火']  // 水强需土火克制
  }
  
  // 找出用户最强的元素
  const strongestElement = Object.entries(userStrengths).reduce((max, [element, strength]) => {
    return strength > max.strength ? { element, strength } : max
  }, { element: '', strength: 0 })
  
  // 推荐互补的五行
  const recommendedElements: Record<string, number> = {
    '木': 0.2, '火': 0.2, '土': 0.2, '金': 0.2, '水': 0.2
  }
  
  if (strongestElement.element && strongestElement.strength > 0.3) {
    const complementaryElements = elementRecommendations[strongestElement.element]
    complementaryElements?.forEach(element => {
      recommendedElements[element] = 0.3 // 增加互补元素权重
    })
    recommendedElements[strongestElement.element] = 0.1 // 减少过强元素权重
  }
  
  return recommendedElements
}

// 生成推荐的出生年份范围
function getRecommendedBirthYears(userBirthYear: number): number[] {
  const currentYear = new Date().getFullYear()
  const minAge = 20
  const maxAge = 40
  
  const years: number[] = []
  
  // 推荐年龄差在±5岁范围内的年份
  for (let ageDiff = -5; ageDiff <= 5; ageDiff++) {
    const spouseYear = userBirthYear + ageDiff
    const spouseAge = currentYear - spouseYear
    
    if (spouseAge >= minAge && spouseAge <= maxAge && spouseYear >= 1900 && spouseYear <= currentYear) {
      years.push(spouseYear)
    }
  }
  
  return years.length > 0 ? years : [userBirthYear - 3, userBirthYear - 1, userBirthYear + 1, userBirthYear + 3]
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
  userHour: number
): SpouseRecommendation[] {
  try {
    // 计算用户八字
    const userBazi = calcBazi(userYear, userMonth, userDay, userHour)
    
    // 获取推荐参数
    const recommendedDayMasters = getBestSpouseDayMaster(userBazi.dayMaster)
    const recommendedYears = getRecommendedBirthYears(userYear)
    
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