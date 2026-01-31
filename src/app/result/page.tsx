"use client"

import { use } from 'react'
import { calcBazi } from "@/lib/bazi"
import { explainBazi } from "@/lib/explain"
import { calcAllTenGods, TEN_GOD_EXPLANATIONS } from "@/lib/tenGod"
import { calcDaYun, calcLiuNianFull } from "@/lib/daYun"
import { generateFortune } from "@/lib/fortune"
import { judgeDayMasterStrength } from "@/lib/fiveElements"
import BaziChart from "@/components/BaziChart"
import DaYunChart from "@/components/DaYunChart"
import ExportPdfButton from "@/components/ExportPdfButton"

interface ResultPageProps {
  searchParams: Promise<{
    year?: string
    month?: string
    day?: string
    hour?: string
  }>
}

export default function ResultPage({ searchParams }: ResultPageProps) {
  const { year, month, day, hour } = use(searchParams)

  // 1️⃣ 参数解析
  const birthYear = Number(year) || 1990
  const birthMonth = Number(month) || 1
  const birthDay = Number(day) || 1
  const birthHour = Number(hour) || 12

  // 2️⃣ 八字计算
  const result = calcBazi(birthYear, birthMonth, birthDay, birthHour)
  const tenGods = calcAllTenGods(result.dayMaster, [
    result.pillars.year,
    result.pillars.month,
    result.pillars.day,
    result.pillars.hour
  ])

  // 3️⃣ 大运计算
  const birthDate = new Date(birthYear, birthMonth - 1, birthDay, birthHour)
  const daYunList = calcDaYun(result.dayMaster, birthDate, true)

  // 4️⃣ 流年计算（只显示关键年份）
  const liuNianList = calcLiuNianFull(result.dayMaster, birthYear, daYunList[0].startAge, true)
  const keyLiuNianList = liuNianList.filter(ln => [20, 25, 30, 35, 40, 45, 50, 60, 70, 80].includes(ln.age))

  // 5️⃣ 综合运势
  const fortune = generateFortune(result.dayMaster, [
    result.pillars.year,
    result.pillars.month,
    result.pillars.day,
    result.pillars.hour
  ])

  // 6️⃣ 日主强弱分析
  const dayMasterStrength = judgeDayMasterStrength(result.dayMaster, Object.values(result.pillars))

  // 7️⃣ 关键指标计算
  const fiveElementsBalance = Object.values(result.fiveElements).reduce((sum, val) => sum + val, 0) / 5
  const hasStrongElement = Object.values(result.fiveElements).some(val => val > 0.8)
  const hasWeakElement = Object.values(result.fiveElements).some(val => val < 0.2)

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* 页面头部 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          八字算命专业报告
        </h1>
        <p className="text-gray-600 mt-2">
          出生时间：{birthYear}年{birthMonth}月{birthDay}日{birthHour}时
        </p>
        <div className="flex justify-center mt-4">
          <ExportPdfButton targetId="bazi-report" fileName="八字专业报告.pdf" />
        </div>
      </div>

      <div id="bazi-report" className="space-y-8">
        {/* 1. 核心摘要卡片 */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
            <span className="mr-2">📋</span>
            命理核心摘要
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 八字信息 */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">四柱八字</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">年柱：</span>
                  <span className="font-medium">{result.pillars.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">月柱：</span>
                  <span className="font-medium">{result.pillars.month}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">日柱：</span>
                  <span className="font-medium">{result.pillars.day}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">时柱：</span>
                  <span className="font-medium">{result.pillars.hour}</span>
                </div>
              </div>
            </div>

            {/* 日主分析 */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">日主分析</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">日主：</span>
                  <span className="font-medium text-lg">{result.dayMaster}</span>
                  <span className="text-sm text-gray-500 ml-2">{explainBazi(result.dayMaster)}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600">强弱：</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    dayMasterStrength === 'strong' ? 'bg-green-100 text-green-800' :
                    dayMasterStrength === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {dayMasterStrength === 'strong' ? '强' : dayMasterStrength === 'medium' ? '中' : '弱'}
                  </span>
                </div>
              </div>
            </div>

            {/* 五行平衡 */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">五行平衡</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">平衡度：</span>
                  <span className={`font-medium ${
                    fiveElementsBalance > 0.7 ? 'text-green-600' :
                    fiveElementsBalance > 0.5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {fiveElementsBalance > 0.7 ? '良好' : fiveElementsBalance > 0.5 ? '一般' : '需要关注'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {hasStrongElement && '有强势元素'}
                  {hasStrongElement && hasWeakElement && '，'}
                  {hasWeakElement && '有弱势元素'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 关键运势分析 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 综合运势 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🌟</span>
              综合运势
            </h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg">
                <div className="font-medium text-blue-800">💰 财运</div>
                <div className="text-sm text-gray-700 mt-1">{fortune.wealth}</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg">
                <div className="font-medium text-green-800">💼 事业</div>
                <div className="text-sm text-gray-700 mt-1">{fortune.career}</div>
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-3 rounded-lg">
                <div className="font-medium text-pink-800">💑 婚姻</div>
                <div className="text-sm text-gray-700 mt-1">{fortune.marriage}</div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 rounded-lg">
                <div className="font-medium text-red-800">❤️ 健康</div>
                <div className="text-sm text-gray-700 mt-1">{fortune.health}</div>
              </div>
            </div>
          </div>

          {/* 十神重点分析 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🎭</span>
              十神重点分析
            </h2>
            <div className="space-y-3">
              {tenGods.slice(0, 3).map((tg, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium text-gray-800">{tg.stem} → {tg.relation}</div>
                  <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {TEN_GOD_EXPLANATIONS[tg.relation].substring(0, 80)}...
                  </div>
                </div>
              ))}
              {tenGods.length > 3 && (
                <div className="text-center text-sm text-gray-500">
                  还有 {tenGods.length - 3} 个十神关系
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. 可视化图表 */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📊</span>
            命理可视化分析
          </h2>
          <div className="space-y-8">
            <BaziChart result={result} tenGods={tenGods} />
            <DaYunChart daYunList={daYunList} liuNianList={liuNianList} />
          </div>
        </section>

        {/* 4. 关键年份运势 */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">⏳</span>
            关键年份运势
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyLiuNianList.map((ln, idx) => {
              const tempPillars = [
                ln.pillar,
                result.pillars.month,
                result.pillars.day,
                result.pillars.hour
              ]
              const yearFortune = generateFortune(result.dayMaster, tempPillars)
              
              return (
                <div key={idx} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4">
                  <div className="text-center mb-3">
                    <div className="font-bold text-lg text-blue-600">{ln.age}岁</div>
                    <div className="text-sm text-gray-500">{ln.year}年</div>
                    <div className="text-xs text-gray-400 mt-1">{ln.pillar}</div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-16">财运：</span>
                      <span className="text-gray-700 truncate">{yearFortune.wealth.substring(0, 15)}...</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-16">事业：</span>
                      <span className="text-gray-700 truncate">{yearFortune.career.substring(0, 15)}...</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-16">健康：</span>
                      <span className="text-gray-700 truncate">{yearFortune.health.substring(0, 15)}...</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 5. 详细分析（可折叠） */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📖</span>
            详细命理分析
          </h2>
          
          <div className="space-y-6">
            {/* 五行详细分析 */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">五行力量分布</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(result.fiveElements).map(([element, value]) => (
                  <div key={element} className="text-center">
                    <div className="font-medium text-gray-800">{element}</div>
                    <div className="text-2xl font-bold text-blue-600">{value.toFixed(1)}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${value * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 完整十神分析 */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">完整十神关系</h3>
              <div className="space-y-3">
                {tenGods.map((tg, i) => (
                  <div key={i} className="border-l-4 border-blue-500 pl-3 py-1">
                    <div className="font-medium">{tg.stem} → {tg.relation}</div>
                    <div className="text-sm text-gray-600 mt-1">{TEN_GOD_EXPLANATIONS[tg.relation]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}