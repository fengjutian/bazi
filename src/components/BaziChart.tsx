"use client"

import { BaziResult } from "@/lib/bazi"
import { TenGod } from "@/lib/tenGod"
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts"

interface Props {
  result: BaziResult
  tenGods: TenGod[]
}

export default function BaziChart({ result, tenGods }: Props) {
  // 五行雷达数据
  const radarData = Object.entries(result.fiveElements).map(([key, value]) => ({
    element: key,
    value
  }))

  // 十神统计
  const countMap: Record<string, number> = {}
  tenGods.forEach(tg => {
    countMap[tg.relation] = (countMap[tg.relation] || 0) + 1
  })

  const barData = Object.entries(countMap).map(([relation, value]) => ({
    relation,
    value
  }))

  return (
    <div className="space-y-8">
      <div className="w-full h-64 min-h-64">
        <h2 className="text-lg font-semibold mb-2">五行分布雷达图</h2>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="element" />
            <Radar dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full h-64">
        <h2 className="text-lg font-semibold mb-2">十神分布图</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <XAxis dataKey="relation" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
