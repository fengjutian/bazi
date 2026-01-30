import { calcBazi } from "@/lib/bazi"
import { explainBazi } from "@/lib/explain"
import { calcAllTenGods } from "@/lib/tenGod"
import { calcDaYun, calcLiuNianFull } from "@/lib/daYun"
import BaziChart from "@/components/BaziChart"
import DaYunChart from "@/components/DaYunChart"
import ExportPdfButton from "@/components/ExportPdfButton"

export default function ResultPage({ searchParams }: any) {
  const { year, month, day, hour } = searchParams

  // 验证并解析参数
  const birthYear = Number(year) || 1990
  const birthMonth = Number(month) || 1
  const birthDay = Number(day) || 1
  const birthHour = Number(hour) || 12

  // 1️⃣ 八字计算
  const result = calcBazi(birthYear, birthMonth, birthDay, birthHour)
  const tenGods = calcAllTenGods(result.dayMaster, [
    result.pillars.year,
    result.pillars.month,
    result.pillars.day,
    result.pillars.hour
  ])
// 大运计算
  const daYunList = calcDaYun(result.dayMaster, birthYear, true)

  // 流年详细（每大运前 10 年）
  const liuNianList = calcLiuNianFull(result.dayMaster, birthYear, daYunList[0].startAge, true)

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">八字算命完整报告</h1>

      <div className="flex justify-end mb-4">
        <ExportPdfButton targetId="bazi-report" />
      </div>

      <div id="bazi-report" className="space-y-6 bg-white p-6 rounded shadow">
        {/* 基本信息 */}
        <div className="grid grid-cols-2 gap-4">
          <div>年柱：{result.pillars.year}</div>
          <div>月柱：{result.pillars.month}</div>
          <div>日柱：{result.pillars.day}</div>
          <div>时柱：{result.pillars.hour}</div>
        </div>

        <div><strong>日主：</strong>{result.dayMaster} — {explainBazi(result.dayMaster)}</div>

        {/* 十神 */}
        <div>
          <h2 className="font-semibold mb-2">十神明细</h2>
          {tenGods.map((tg, i) => <div key={i}>干 {tg.stem} → {tg.relation}</div>)}
        </div>

        {/* 五行 + 十神可视化 */}
        <BaziChart result={result} tenGods={tenGods} />

        {/* 大运图表 */}
        <DaYunChart daYunList={daYunList} liuNianList={liuNianList} />

        {/* 流年详细列表，分页生成 PDF */}
        <div className="space-y-4">
          {liuNianList.map((ln, idx) => (
            <div key={idx} className="p-4 border rounded">
              <div><strong>年龄 {ln.age} 岁 / 公历 {ln.year} 年</strong></div>
              <div>流年柱：{ln.pillar}</div>
              <div>十神：{ln.tenGod.relation}</div>
              <div>五行分布：{Object.entries(ln.fiveElements).map(([k,v]) => `${k}:${v}`).join(' ')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
