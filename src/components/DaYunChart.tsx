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
    pillar: dy.pillar
  }))

  // 流年十神趋势数据
  const liuNianData = liuNianList.map(ln => ({
    age: ln.age,
    year: ln.year,
    relation: ln.tenGod.relation,
    // 为每个十神分配一个数值，用于在图表上显示
    value: Object.keys({ 比肩: 1, 劫财: 2, 食神: 3, 伤官: 4, 偏财: 5, 正财: 6, 七杀: 7, 正官: 8, 偏印: 9, 正印: 10 }).indexOf(ln.tenGod.relation) + 1
  }))

  return (
    <div className="space-y-8">
      <div className="w-full h-64">
        <h2 className="text-lg font-semibold mb-2">大运概览</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={daYunData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name, props) => {
                if (name === 'startAge') return [`${value}岁`, '起始年龄']
                if (name === 'pillar') return [value, '大运柱']
                return [value, name]
              }}
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            <Bar dataKey="startAge" fill="#8884d8" name="起始年龄" />
            <Bar dataKey="pillar" fill="#82ca9d" name="大运柱" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full h-64">
        <h2 className="text-lg font-semibold mb-2">流年十神趋势</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={liuNianData}>
            <XAxis dataKey="age" label={{ value: '年龄', position: 'insideBottomRight', offset: -10 }} />
            <YAxis 
              domain={[0, 11]} 
              tickFormatter={(value) => {
                const tenGods = ['', '比肩', '劫财', '食神', '伤官', '偏财', '正财', '七杀', '正官', '偏印', '正印']
                return tenGods[value] || ''
              }}
              label={{ value: '十神', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name, props) => {
                if (name === 'value') return [props.payload.relation, '十神']
                if (name === 'year') return [value, '年份']
                return [value, name]
              }}
              labelFormatter={(label) => `年龄：${label}岁`}
            />
            <Legend />
            <Line type="monotone" dataKey="value" name="十神变化" stroke="#82ca9d" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
