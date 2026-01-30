import { calcBazi } from "@/lib/bazi"
import { explainBazi } from "@/lib/explain"
import { calcAllTenGods } from "@/lib/tenGod"
import { calcDaYun, calcLiuNian } from "@/lib/daYun"
import BaziChart from "@/components/BaziChart"
import DaYunChart from "@/components/DaYunChart"

export default function ResultPage({ searchParams }: any) {
  const { year, month, day, hour } = searchParams

  // 1️⃣ 八字计算
  const result = calcBazi(
    Number(year),
    Number(month),
    Number(day),
    Number(hour)
  )

  // 2️⃣ 十神计算
  const tenGods = calcAllTenGods(result.dayMaster, [
    result.pillars.year,
    result.pillars.month,
    result.pillars.day,
    result.pillars.hour
  ])

  // 3️⃣ 大运计算（男=顺行，女=逆行）
  const daYunList = calcDaYun(result.dayMaster, Number(year), true)

  // 4️⃣ 流年计算（取第一大运示例）
  const liuNianList = calcLiuNian(
    result.dayMaster,
    Number(year),
    daYunList[0].startAge,
    true
  )

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center">八字算命结果</h1>

      {/* 四柱展示 */}
      <div className="grid grid-cols-2 gap-4">
        <div>年柱：{result.pillars.year}</div>
        <div>月柱：{result.pillars.month}</div>
        <div>日柱：{result.pillars.day}</div>
        <div>时柱：{result.pillars.hour}</div>
      </div>

      {/* 日主性格解读 */}
      <div className="mt-4">
        <strong>日主：</strong> {result.dayMaster} — {explainBazi(result.dayMaster)}
      </div>

      {/* 十神明细 */}
      <div className="mt-4">
        <h2 className="font-semibold mb-2">十神明细</h2>
        {tenGods.map((tg, i) => (
          <div key={i}>干 {tg.stem} → {tg.relation}</div>
        ))}
      </div>

      {/* 五行雷达 + 十神条形图 */}
      <BaziChart result={result} tenGods={tenGods} />

      {/* 大运柱状 + 流年折线图 */}
      <DaYunChart daYunList={daYunList} liuNianList={liuNianList} />
    </div>
  )
}
