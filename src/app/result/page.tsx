"use client"

import { use } from 'react'
import { calcBazi } from "@/lib/bazi"
import { explainBazi } from "@/lib/explain"
import { calcAllTenGods, TEN_GOD_EXPLANATIONS } from "@/lib/tenGod"
import { calcDaYun, calcLiuNianFull } from "@/lib/daYun"
import { generateFortune } from "@/lib/fortune"
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
  const daYunList = calcDaYun(result.dayMaster, birthYear, true)

  // 4️⃣ 流年计算
  const liuNianList = calcLiuNianFull(result.dayMaster, birthYear, daYunList[0].startAge, true)

  // 5️⃣ 综合运势
  const fortune = generateFortune(result.dayMaster, tenGods)

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">八字算命专业报告</h1>

      <div className="flex justify-end mb-4">
        <ExportPdfButton targetId="bazi-report" fileName="八字专业报告.pdf" />
      </div>

      <div id="bazi-report" className="space-y-6 bg-white p-6 rounded shadow">

        {/* 基本信息 */}
        <section className="grid grid-cols-2 gap-4">
          <div>年柱：{result.pillars.year}</div>
          <div>月柱：{result.pillars.month}</div>
          <div>日柱：{result.pillars.day}</div>
          <div>时柱：{result.pillars.hour}</div>
        </section>

        <section>
          <strong>日主：</strong>{result.dayMaster} — {explainBazi(result.dayMaster)}
        </section>

        {/* 十神分析 */}
        <section>
          <h2 className="font-semibold mb-2">十神明细</h2>
          <div className="space-y-4">
            {tenGods.map((tg, i) => (
              <div key={i} className="p-3 border rounded">
                <div><strong>干 {tg.stem} → {tg.relation}</strong></div>
                <div className="text-sm text-gray-700 mt-1">{TEN_GOD_EXPLANATIONS[tg.relation]}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 可视化图表 */}
        <BaziChart result={result} tenGods={tenGods} />
        <DaYunChart daYunList={daYunList} liuNianList={liuNianList} />

        {/* 综合运势 */}
        <section className="space-y-2">
          <h2 className="font-semibold text-lg">综合运势分析</h2>
          <div><strong>财运：</strong>{fortune.wealth}</div>
          <div><strong>事业：</strong>{fortune.career}</div>
          <div><strong>婚姻：</strong>{fortune.marriage}</div>
          <div><strong>健康：</strong>{fortune.health}</div>
          {fortune.study && <div><strong>学业 / 才能：</strong>{fortune.study}</div>}
          {fortune.social && <div><strong>人际 / 贵人：</strong>{fortune.social}</div>}
        </section>

        {/* 流年详细，每年独立 section 可分页 */}
        <section className="space-y-4">
          {liuNianList.map((ln, idx) => {
            const yearFortune = generateFortune(result.dayMaster, [ln.tenGod])
            return (
              <div key={idx} className="p-4 border rounded break-inside-avoid">
                <div><strong>年龄 {ln.age} 岁 / 公历 {ln.year} 年</strong></div>
                <div>流年柱：{ln.pillar}</div>
                <div>十神：{ln.tenGod.relation}</div>
                <div>五行分布：{Object.entries(ln.fiveElements).map(([k,v])=>`${k}:${v}`).join(' ')}</div>
                <div className="mt-2 space-y-1">
                  <div><strong>财运：</strong>{yearFortune.wealth}</div>
                  <div><strong>事业：</strong>{yearFortune.career}</div>
                  <div><strong>婚姻：</strong>{yearFortune.marriage}</div>
                  <div><strong>健康：</strong>{yearFortune.health}</div>
                  {yearFortune.study && <div><strong>学业 / 才能：</strong>{yearFortune.study}</div>}
                  {yearFortune.social && <div><strong>人际 / 贵人：</strong>{yearFortune.social}</div>}
                </div>
              </div>
            )
          })}
        </section>
      </div>
    </div>
  )
}
