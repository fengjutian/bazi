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

// 十神数值映射
const TEN_GOD_VALUES: Record<string, number> = {
  '比肩': 1, '劫财': 2, '食神': 3, '伤官': 4,
  '偏财': 5, '正财': 6, '七杀': 7, '正官': 8,
  '偏印': 9, '正印': 10
}

export default function DaYunChart({ daYunList, liuNianList }: Props) {
  // 大运柱状图数据
  const daYunData = daYunList.map((dy, idx) => ({
    name: `大运${idx + 1}`,
    startAge: dy.startAge,
    pillar: dy.pillar
  }))

  // 流年十神趋势数据 - 现在显示主要十神（天干十神）
  const liuNianData = liuNianList.map(ln => {
    // 取天干的十神作为主要显示
    const mainTenGod = ln.tenGods[0] // 第一个是天干十神
    return {
      age: ln.age,
      year: ln.year,
      pillar: ln.pillar,
      relation: mainTenGod.relation,
      value: TEN_GOD_VALUES[mainTenGod.relation] || 0,
      // 添加完整十神信息用于Tooltip显示
      allTenGods: ln.tenGods.map(tg => tg.relation).join('、')
    }
  })

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
            <XAxis 
              dataKey="age" 
              label={{ value: '年龄', position: 'insideBottomRight', offset: -10 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 11]} 
              tickFormatter={(value) => {
                const tenGods = ['', '比肩', '劫财', '食神', '伤官', '偏财', '正财', '七杀', '正官', '偏印', '正印']
                return tenGods[value] || ''
              }}
              label={{ value: '十神', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 11 }}
            />
            <Tooltip 
              formatter={(value, name, props) => {
                if (name === 'value') {
                  const tenGodName = props.payload?.relation || ''
                  return [tenGodName, '十神']
                }
                if (name === 'year') return [props.payload?.year || value, '年份']
                if (name === 'pillar') return [props.payload?.pillar || value, '流年柱']
                if (name === 'allTenGods') return [props.payload?.allTenGods || value, '完整十神']
                return [value, name]
              }}
              labelFormatter={(label) => `年龄：${label}岁`}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              cursor={{ pointer: 'pointer' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              name="十神变化" 
              stroke="#82ca9d" 
              strokeWidth={2} 
              dot={{ fill: '#82ca9d', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 6, stroke: '#82ca9d', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}