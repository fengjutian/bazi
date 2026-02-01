// 配偶推荐结果页面
"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { recommendSpouse, SpouseRecommendation } from '@/lib/spouseRecommendation'
import { calcBazi } from '@/lib/bazi'

function SpouseRecommendationContent() {
  const searchParams = useSearchParams()
  const [recommendations, setRecommendations] = useState<SpouseRecommendation[]>([])
  const [userBazi, setUserBazi] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const year = Number(searchParams.get('year')) || 1990
    const month = Number(searchParams.get('month')) || 1
    const day = Number(searchParams.get('day')) || 1
    const hour = Number(searchParams.get('hour')) || 12
    const gender = searchParams.get('gender') || 'male'

    try {
      // 计算用户八字
      const bazi = calcBazi(year, month, day, hour)
      setUserBazi(bazi)

      // 获取配偶推荐
      const spouseRecommendations = recommendSpouse(year, month, day, hour)
      setRecommendations(spouseRecommendations)
    } catch (error) {
      console.error('配偶推荐计算错误:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在智能分析并推荐最合适的配偶...</p>
        </div>
      </div>
    )
  }

  if (!userBazi || recommendations.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">推荐失败</h1>
          <p className="text-gray-600">无法生成配偶推荐，请检查输入信息是否正确</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-all"
          >
            返回重新输入
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 页面头部 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            💖 智能配偶推荐结果
          </h1>
          <p className="text-gray-600 mt-2">
            您的出生时间：{userBazi.birthYear}年{userBazi.birthMonth}月{userBazi.birthDay}日{userBazi.birthHour}时
          </p>
          <p className="text-gray-500 text-sm mt-1">
            八字：{userBazi.pillars.year} {userBazi.pillars.month} {userBazi.pillars.day} {userBazi.pillars.hour}
          </p>
        </div>

        {/* 推荐结果列表 */}
        <div className="space-y-6">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-pink-200 overflow-hidden">
              {/* 推荐头衔 */}
              <div className={`p-6 ${
                index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                'bg-gradient-to-r from-pink-400 to-purple-500'
              } text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      {index === 0 ? '🏆 最佳推荐' : 
                       index === 1 ? '🥈 次佳推荐' : 
                       `🥉 推荐 ${index + 1}`}
                    </h2>
                    <p className="text-sm opacity-90">匹配分数：{recommendation.score}分</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      recommendation.compatibilityLevel === '极佳' ? 'text-green-300' :
                      recommendation.compatibilityLevel === '良好' ? 'text-blue-300' :
                      recommendation.compatibilityLevel === '一般' ? 'text-yellow-300' :
                      'text-red-300'
                    }`}>
                      {recommendation.compatibilityLevel}
                    </div>
                  </div>
                </div>
              </div>

              {/* 推荐配偶信息 */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 配偶基本信息 */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-pink-700">👤 推荐配偶信息</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2">
                        <div><strong>出生时间：</strong>{recommendation.recommendedSpouse.birthYear}年{recommendation.recommendedSpouse.birthMonth}月{recommendation.recommendedSpouse.birthDay}日{recommendation.recommendedSpouse.birthHour}时</div>
                        <div><strong>八字命盘：</strong>{recommendation.recommendedSpouse.pillars.join(' ')}</div>
                        <div><strong>日主：</strong>{recommendation.recommendedSpouse.dayMaster}</div>
                      </div>
                    </div>
                  </div>

                  {/* 匹配分析 */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-pink-700">📊 匹配分析</h3>
                    <div className="space-y-3">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h4 className="font-medium text-green-700">✅ 匹配优势</h4>
                        <ul className="text-sm text-green-600 mt-1 space-y-1">
                          {recommendation.advantages.map((advantage, i) => (
                            <li key={i}>• {advantage}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <h4 className="font-medium text-yellow-700">💡 注意事项</h4>
                        <ul className="text-sm text-yellow-600 mt-1 space-y-1">
                          {recommendation.considerations.map((consideration, i) => (
                            <li key={i}>• {consideration}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 详细分析 */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-700 text-sm">🌱 五行分析</h4>
                    <ul className="text-xs text-blue-600 mt-1 space-y-1">
                      {recommendation.analysis.fiveElements.slice(0, 2).map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h4 className="font-medium text-purple-700 text-sm">🎭 十神分析</h4>
                    <ul className="text-xs text-purple-600 mt-1 space-y-1">
                      {recommendation.analysis.tenGods.slice(0, 2).map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-pink-50 p-3 rounded-lg">
                    <h4 className="font-medium text-pink-700 text-sm">🌟 日主分析</h4>
                    <ul className="text-xs text-pink-600 mt-1 space-y-1">
                      {recommendation.analysis.dayMaster.slice(0, 2).map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 页脚说明 */}
        <div className="bg-white border border-pink-200 rounded-2xl p-6 text-center">
          <h3 className="font-semibold text-pink-700 mb-2">💡 使用建议</h3>
          <p className="text-gray-600 text-sm">
            本推荐基于传统命理学原理，综合考虑了五行互补、十神相配、日主强弱等多维度因素。<br />
            分析结果仅供娱乐参考，实际感情发展还需双方共同努力和经营。
          </p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-all"
          >
            🔄 重新推荐
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SpouseRecommendationPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在加载推荐结果...</p>
        </div>
      </div>
    }>
      <SpouseRecommendationContent />
    </Suspense>
  )
}