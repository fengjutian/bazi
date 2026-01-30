"use client"

import { calcBazi } from "@/lib/bazi"
import { explainBazi } from "@/lib/explain"
import { calcAllTenGods } from "@/lib/tenGod"
import { calcDaYun, calcLiuNianFull } from "@/lib/daYun"
import BaziChart from "@/components/BaziChart"
import DaYunChart from "@/components/DaYunChart"
import ExportPdfButton from "@/components/ExportPdfButton"

interface ResultPageProps {
  searchParams: {
    year?: string
    month?: string
    day?: string
    hour?: string
  }
}

export default function ResultPage({ searchParams }: ResultPageProps) {
  const { year, month, day, hour } = searchParams

  // ✅ 参数解析与默认值
  const birthYear = Number(year) || 1990
  const birthMonth = Number(month) || 1
  const birthDay = Number(day) || 1
  const birthHour = Number(hour) || 12

  // 1️⃣ 八字计算
  const result = calcBazi(birthYear, birthMonth, birthDay, birthHour)

  // 2️⃣ 十神计算
  const tenGods = calcAllTenGods(result.dayMaster, [
    result.pillars.year,
    result.pillars.month,
    result.pillars.day,
    result.pillars.hour
  ])

  // 3️⃣ 大运计算
  const daYunList = calcDaYun(result.dayMaster, birthYear, true)

  // 4️⃣ 流年详细（每大运前 10 年）
  const liuNianList = calcLiuNianFull(result.dayMaster, birthYear, daYunList[0].startAge, true)

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* 页面标题 */}
      <h1 className="text-2xl font-bold text-center">八字算命完整报告</h1>

      {/* 下载 PDF 按钮 */}
      <div className="flex justify-end mb-4">
        <ExportPdfButton targetId="bazi-report" fileName="八字完整报告.pdf" />
      </div>

      {/* 八字报告内容容器（PDF 截图区域） */}
      <div id="bazi-report" className="space-y-6 bg-white p-6 rounded shadow">

        {/* 基本信息 */}
        <section className="grid grid-cols-2 gap-4">
          <div>年柱：{result.pillars.year}</div>
          <div>月柱：{result.pillars.month}</div>
          <div>日柱：{result.pillars.day}</div>
          <div>时柱：{result.pillars.hour}</div>
        </section>

        {/* 日主解读 */}
        <section>
          <strong>日主：</strong>{result.dayMaster} — {explainBazi(result.dayMaster)}
        </section>

        {/* 十神分析 */}
        <section>
          <h2 className="font-semibold mb-2">十神明细</h2>
          <ul className="list-disc pl-5">
            {tenGods.map((tg, i) => (
              <li key={i}>干 {tg.stem} → {tg.relation}</li>
            ))}
          </ul>
        </section>

        {/* 五行 + 十神可视化 */}
        <section>
          <BaziChart result={result} tenGods={tenGods} />
        </section>

        {/* 大运 + 流年图表 */}
        <section>
          <DaYunChart daYunList={daYunList} liuNianList={liuNianList} />
        </section>

        {/* 流年详细列表 */}
        <section className="space-y-4">
          {liuNianList.map((ln, idx) => (
            <div key={idx} className="p-4 border rounded">
              <div><strong>年龄 {ln.age} 岁 / 公历 {ln.year} 年</strong></div>
              <div>流年柱：{ln.pillar}</div>
              <div>十神：{ln.tenGod.relation}</div>
              <div>五行分布：{Object.entries(ln.fiveElements).map(([k, v]) => `${k}:${v}`).join(' ')}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
