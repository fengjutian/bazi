import { calcBazi } from "@/lib/bazi"
import { explainBazi } from "@/lib/explain"
import { calcAllTenGods } from "@/lib/tenGod"
import BaziChart from "@/components/BaziChart"

export default function ResultPage({ searchParams }: any) {
  const { year, month, day, hour } = searchParams

  const result = calcBazi(
    Number(year),
    Number(month),
    Number(day),
    Number(hour)
  )

  const tenGods = calcAllTenGods(result.dayMaster, [
    result.pillars.year,
    result.pillars.month,
    result.pillars.day,
    result.pillars.hour
  ])

  return (
    <div className="p-8 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center">八字算命结果</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>年柱：{result.pillars.year}</div>
        <div>月柱：{result.pillars.month}</div>
        <div>日柱：{result.pillars.day}</div>
        <div>时柱：{result.pillars.hour}</div>
      </div>

      <div className="mt-4">
        <strong>日主：</strong> {result.dayMaster} — {explainBazi(result.dayMaster)}
      </div>

      <div className="mt-4">
        <h2 className="font-semibold mb-2">十神明细</h2>
        {tenGods.map((tg, i) => (
          <div key={i}>
            干 {tg.stem} → {tg.relation}
          </div>
        ))}
      </div>

      <BaziChart result={result} tenGods={tenGods} />
    </div>
  )
}
