import { calcBazi } from '@/lib/bazi'
import { explainBazi } from '@/lib/explain'

export default function ResultPage({ searchParams }: any) {
  const { year, month, day, hour } = searchParams

  const result = calcBazi(
    Number(year),
    Number(month),
    Number(day),
    Number(hour)
  )

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-xl font-bold">你的八字</h1>

      <div>年柱：{result.year}</div>
      <div>月柱：{result.month}</div>
      <div>日柱：{result.day}</div>
      <div>时柱：{result.hour}</div>

      <div className="mt-4">
        日主：{result.dayMaster}
      </div>

      <div>
        性格解读：{explainBazi(result.dayMaster)}
      </div>

      <pre>{JSON.stringify(result.fiveElements, null, 2)}</pre>
    </div>
  )
}
