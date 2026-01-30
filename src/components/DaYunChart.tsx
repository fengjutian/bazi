"use client"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line
} from "recharts"

import { DaYunDetail, LiuNianDetail } from "@/lib/daYun"

interface Props {
  daYunList: DaYunDetail[]
  liuNianList: LiuNianDetail[]
}

export default function DaYunChart({ daYunList, liuNianList }: Props) {
  // 大运柱状图数据
  const daYunData = daYunList.map((dy, idx) => ({
    name: `大运${idx + 1}`,
    startAge: dy.startAge,
    pillars: dy.pillar
  }))

  // 流年折线图（十神关系数量）
  const tenGodCountMap: Record<string, number> = {}
  liuNianList.forEach(ln => {
    tenGodCountMap[ln.tenGod.relation] = (tenGodCountMap[ln.tenGod.relation] || 0) + 1
  })
  const liuNianData = liuNianList.map(ln => ({
    age: ln.age,
    year: ln.year,
    relation: ln.tenGod.relation
  }))

  return (
    <div className="space-y-8">
      <div className="w-full h-64">
        <h2 className="text-lg font-semibold mb-2">大运概览</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={daYunData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => value} />
            <Legend />
            <Bar dataKey="startAge" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full h-64">
        <h2 className="text-lg font-semibold mb-2">流年十神趋势</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={liuNianData}>
            <XAxis dataKey="age" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="age" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
