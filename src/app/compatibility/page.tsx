// src/app/compatibility/page.tsx
"use client"

import { useEffect, useState } from 'react'
import { calcBazi } from "@/lib/bazi"
import { analyzeCompatibility, CompatibilityResult } from "@/lib/compatibility"
import { useSearchParams } from 'next/navigation'

export default function CompatibilityPage() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<CompatibilityResult | null>(null)
  
  useEffect(() => {
    // 解析男方八字参数
    const maleYear = Number(searchParams.get('maleYear')) || 1990
    const maleMonth = Number(searchParams.get('maleMonth')) || 1
    const maleDay = Number(searchParams.get('maleDay')) || 1
    const maleHour = Number(searchParams.get('maleHour')) || 12
    
    // 解析女方八字参数
    const femaleYear = Number(searchParams.get('femaleYear')) || 1990
    const femaleMonth = Number(searchParams.get('femaleMonth')) || 1
    const femaleDay = Number(searchParams.get('femaleDay')) || 1
    const femaleHour = Number(searchParams.get('femaleHour')) || 12
    
    // 计算双方八字
    const maleBazi = calcBazi(maleYear, maleMonth, maleDay, maleHour)
    const femaleBazi = calcBazi(femaleYear, femaleMonth, femaleDay, femaleHour)
    
    // 分析八字相配度
    const compatibilityResult = analyzeCompatibility(maleBazi, femaleBazi)
    setResult(compatibilityResult)
  }, [searchParams])
  
  if (!result) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在生成八字相配分析报告...</p>
        </div>
      </div>
    )
  }

  // 从URL参数中获取出生时间信息
  const maleYear = Number(searchParams.get('maleYear')) || 1990
  const maleMonth = Number(searchParams.get('maleMonth')) || 1
  const maleDay = Number(searchParams.get('maleDay')) || 1
  const maleHour = Number(searchParams.get('maleHour')) || 12
  
  const femaleYear = Number(searchParams.get('femaleYear')) || 1990
  const femaleMonth = Number(searchParams.get('femaleMonth')) || 1
  const femaleDay = Number(searchParams.get('femaleDay')) || 1
  const femaleHour = Number(searchParams.get('femaleHour')) || 12

  // 计算双方八字（用于显示基本信息）
  const maleBazi = calcBazi(maleYear, maleMonth, maleDay, maleHour)
  const femaleBazi = calcBazi(femaleYear, femaleMonth, femaleDay, femaleHour)

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">男女八字相配分析</h1>
      
      {/* 基本信息 */}
      <section className="grid grid-cols-2 gap-6">
        {/* 男方信息 */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-3">👨 男方八字</h2>
          <div className="space-y-2">
            <div><strong>出生时间：</strong>{maleYear}年{maleMonth}月{maleDay}日{maleHour}时</div>
            <div><strong>年柱：</strong>{maleBazi.pillars.year}</div>
            <div><strong>月柱：</strong>{maleBazi.pillars.month}</div>
            <div><strong>日柱：</strong>{maleBazi.pillars.day}（日主：{maleBazi.dayMaster}）</div>
            <div><strong>时柱：</strong>{maleBazi.pillars.hour}</div>
          </div>
        </div>
        
        {/* 女方信息 */}
        <div className="bg-pink-50 p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-3">👩 女方八字</h2>
          <div className="space-y-2">
            <div><strong>出生时间：</strong>{femaleYear}年{femaleMonth}月{femaleDay}日{femaleHour}时</div>
            <div><strong>年柱：</strong>{femaleBazi.pillars.year}</div>
            <div><strong>月柱：</strong>{femaleBazi.pillars.month}</div>
            <div><strong>日柱：</strong>{femaleBazi.pillars.day}（日主：{femaleBazi.dayMaster}）</div>
            <div><strong>时柱：</strong>{femaleBazi.pillars.hour}</div>
          </div>
        </div>
      </section>
      
      {/* 总体相配结果 */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-200">
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {result.overallScore}分
          </div>
          <div className={`text-2xl font-semibold mb-4 ${
            result.compatibilityLevel === '极佳' ? 'text-green-600' :
            result.compatibilityLevel === '良好' ? 'text-blue-600' :
            result.compatibilityLevel === '一般' ? 'text-yellow-600' :
            result.compatibilityLevel === '较差' ? 'text-orange-600' : 'text-red-600'
          }`}>
            {result.compatibilityLevel}相配
          </div>
          <div className="text-lg text-gray-700">
            基于五行、十神、日主、四柱等多维度分析
          </div>
        </div>
      </section>
      
      {/* 详细分析 */}
      <section className="space-y-4">
        <h2 className="font-semibold text-xl">详细分析</h2>
        
        {/* 五行分析 */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">🌱 五行相配分析（{result.analysis.fiveElements.score}分）</h3>
          <div className="space-y-2 text-sm">
            {result.analysis.fiveElements.generateChains.length > 0 && (
              <div><strong>相生关系：</strong>{result.analysis.fiveElements.generateChains.join('，')}</div>
            )}
            {result.analysis.fiveElements.overcomeChains.length > 0 && (
              <div><strong>相克关系：</strong>{result.analysis.fiveElements.overcomeChains.join('，')}</div>
            )}
            <div><strong>五行平衡度：</strong>{Math.round(result.analysis.fiveElements.balance * 100)}%</div>
            {result.analysis.fiveElements.advice.map((advice, i) => (
              <div key={i} className="text-blue-600">💡 {advice}</div>
            ))}
          </div>
        </div>
        
        {/* 十神分析 */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">🎭 十神互补分析（{result.analysis.tenGods.score}分）</h3>
          <div className="space-y-2 text-sm">
            {result.analysis.tenGods.complementaryPairs.length > 0 && (
              <div><strong>互补十神：</strong>{result.analysis.tenGods.complementaryPairs.join('，')}</div>
            )}
            {result.analysis.tenGods.conflictingPairs.length > 0 && (
              <div><strong>冲突十神：</strong>{result.analysis.tenGods.conflictingPairs.join('，')}</div>
            )}
            {result.analysis.tenGods.advice.map((advice, i) => (
              <div key={i} className="text-blue-600">💡 {advice}</div>
            ))}
          </div>
        </div>
        
        {/* 日主分析 */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">🌟 日主相配分析（{result.analysis.dayMaster.score}分）</h3>
          <div className="space-y-2 text-sm">
            <div><strong>日主组合：</strong>{result.analysis.dayMaster.combination}</div>
            <div><strong>男方日主强弱：</strong>{result.analysis.dayMaster.maleStrength}</div>
            <div><strong>女方日主强弱：</strong>{result.analysis.dayMaster.femaleStrength}</div>
            {result.analysis.dayMaster.advice.map((advice, i) => (
              <div key={i} className="text-blue-600">💡 {advice}</div>
            ))}
          </div>
        </div>
        
        {/* 四柱分析 */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">🏛️ 四柱相配分析（{result.analysis.pillars.score}分）</h3>
          <div className="space-y-2 text-sm">
            <div><strong>年柱相配度：</strong>{result.analysis.pillars.yearPillarMatch}分（家庭背景）</div>
            <div><strong>月柱相配度：</strong>{result.analysis.pillars.monthPillarMatch}分（性格特点）</div>
            <div><strong>日柱相配度：</strong>{result.analysis.pillars.dayPillarMatch}分（婚姻基础）</div>
            <div><strong>时柱相配度：</strong>{result.analysis.pillars.hourPillarMatch}分（晚年生活）</div>
            {result.analysis.pillars.advice.map((advice, i) => (
              <div key={i} className="text-blue-600">💡 {advice}</div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 相配建议 */}
      <section className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h2 className="font-semibold text-xl mb-4">💡 相配建议</h2>
        <div className="space-y-3">
          {result.recommendations.map((recommendation, i) => (
            <div key={i} className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              <span>{recommendation}</span>
            </div>
          ))}
        </div>
      </section>
      
      {/* 重新分析链接 */}
      <section className="text-center">
        <a 
          href="/" 
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          重新输入八字信息
        </a>
      </section>
    </div>
  )
}