import { calcBazi } from "@/lib/bazi"
import { explainBazi } from "@/lib/explain"
import { calcAllTenGods } from "@/lib/tenGod"
import { calcDaYun, calcLiuNian } from "@/lib/daYun"
import BaziChart from "@/components/BaziChart"
import DaYunChart from "@/components/DaYunChart"
import ExportPdfButton from "@/components/ExportPdfButton"

export default function ResultPage({ searchParams }: any) {
  const { year, month, day, hour } = searchParams

  // 1️⃣ 八字计算
  const result = calcBazi(Number(year), Number(month), Number(day), Number(hour))

  // 2️⃣ 十神计算
  const tenGods = calcAllTenGods(result.dayMaster, [
    result.pillars.year,
    result.pillars.month,
    result.pillars.day,
    result.pillars.hour
  ])

  // 3️⃣ 大运计算
  const daYunList = calcDaYun(result.dayMaster, Number(year), true)
  const liuNianList = calcLiuNian(result.dayMaster, Number(year), daYunList[0].startAge, true)

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center">八字算命结果</h1>

      {/* 下载 PDF 按钮 */}
      <div className="flex justify-end mb-4">
        <ExportPdfButton targetId="bazi-report" />
      </div>

      {/* 结果内容区域 */}
      <div id="bazi-report" className="space-y-6 bg-white p-6 rounded shadow">
        {/* 四柱展示 */}
        <div className="grid grid-cols-2 gap-4">
          <div>年柱：{result.pillars.year}</div>
          <div>月柱：{result.pillars.month}</div>
          <div>日柱：{result.pillars.day}</div>
          <div>时柱：{result.pillars.hour}</div>
        </div>

        {/* 日主解读 */}
        <div>
          <strong>日主：</strong> {result.dayMaster} — {explainBazi(result.dayMaster)}
        </div>

        {/* 十神明细 */}
        <div>
          <h2 className="font-semibold mb-2">十神明细</h2>
          {tenGods.map((tg, i) => (
            <div key={i}>干 {tg.stem} → {tg.relation}</div>
          ))}
        </div>

        {/* 五行 + 十神可视化 */}
        <BaziChart result={result} tenGods={tenGods} />

        {/* 大运 + 流年可视化 */}
        <DaYunChart daYunList={daYunList} liuNianList={liuNianList} />
      </div>
    </div>
  )
}
