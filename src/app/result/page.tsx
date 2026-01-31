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
        {/* 五行分布雷达图解读 */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-3">五行分布雷达图解读</h2>
          <div className="space-y-2">
            <div><strong>五行强弱判断：</strong>靠近外圈的元素表示能量旺盛，靠近中心的元素表示能量不足。</div>
            <div><strong>五行平衡分析：</strong>元素分布均匀表示命运平稳；元素强弱不均表示命运有明显倾向性。</div>
            <div><strong>相生关系：</strong>木生火→火生土→土生金→金生水→水生木，相生链条完整表示能量流通顺畅。</div>
            <div><strong>相克关系：</strong>木克土→土克水→水克火→火克金→金克木，相克关系需要平衡。</div>
            <div><strong>命运指导：</strong>强木者创造力强，强火者热情活力，强土者踏实稳重，强金者果断坚毅，强水者智慧灵活。</div>
          </div>
        </section>

        {/* 十神分布图解读 */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-3">十神分布图解读</h2>
          <div className="space-y-2">
            <div><strong>十神含义：</strong>十神是八字命理中的重要概念，代表日主与其他天干地支的关系，包括比肩、劫财、食神、伤官、偏财、正财、七杀、正官、偏印、正印。</div>
            <div><strong>分布分析：</strong>图表显示各十神的出现频次，频次高的十神对命运影响较大。</div>
            <div><strong>比肩/劫财：</strong>代表兄弟姐妹、朋友、竞争对手，过多则可能竞争压力大，过少则可能缺乏助力。</div>
            <div><strong>食神/伤官：</strong>代表才华、子女、表达方式，过多则可能恃才傲物，过少则可能缺乏创造力。</div>
            <div><strong>偏财/正财：</strong>代表财富、配偶，过多则可能物质欲望强，过少则可能财运较弱。</div>
            <div><strong>七杀/正官：</strong>代表事业、权力、压力，过多则可能压力过大，过少则可能缺乏权威。</div>
            <div><strong>偏印/正印：</strong>代表智慧、长辈、贵人，过多则可能思虑过重，过少则可能缺乏庇护。</div>
            <div><strong>命运指导：</strong>根据十神分布，可了解个人的优势领域和需要注意的方面，针对性地调整行为和发展方向。</div>
          </div>
        </section>

        <DaYunChart daYunList={daYunList} liuNianList={liuNianList} />

        {/* 大运与流年图表解读 */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-3">大运与流年图表解读</h2>
          <div className="space-y-3">
            <div>
              <strong>大运概览图表：</strong>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>显示人生中每十年一变的大运周期</li>
                <li>横轴为大运序号，纵轴为大运起始年龄</li>
                <li>每个柱子代表一个大运周期，高度表示开始年龄</li>
                <li>通过图表可直观了解何时进入新的大运，提前做好准备</li>
                <li>大运交接期（一般为前后一年）运势可能有波动，需特别注意</li>
              </ul>
            </div>
            <div>
              <strong>流年十神趋势图表：</strong>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>显示从起始年龄到100岁的十神变化趋势</li>
                <li>横轴为年龄，纵轴为十神类型</li>
                <li>线条走势反映十神类型的变化，帮助预测不同年龄段的运势特点</li>
                <li>十神类型的转变往往意味着生活重心和挑战的变化</li>
                <li>结合大运和流年的十神变化，可更准确地把握人生机遇与挑战</li>
              </ul>
            </div>
          </div>
        </section>

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
            const yearFortune = generateFortune(result.dayMaster, ln.tenGods)
            return (
              <div key={idx} className="p-4 border rounded break-inside-avoid">
                <div><strong>年龄 {ln.age} 岁 / 公历 {ln.year} 年</strong></div>
                <div>流年柱：{ln.pillar}</div>
                <div>十神：{ln.tenGods.map(tg => tg.relation).join('、')}</div>
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
