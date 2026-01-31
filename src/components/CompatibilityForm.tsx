// src/components/CompatibilityForm.tsx
"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CompatibilityForm() {
  const router = useRouter()

  // 男方信息
  const [maleYear, setMaleYear] = useState('')
  const [maleMonth, setMaleMonth] = useState('')
  const [maleDay, setMaleDay] = useState('')
  const [maleHour, setMaleHour] = useState('')

  // 女方信息
  const [femaleYear, setFemaleYear] = useState('')
  const [femaleMonth, setFemaleMonth] = useState('')
  const [femaleDay, setFemaleDay] = useState('')
  const [femaleHour, setFemaleHour] = useState('')

  const submit = () => {
    // 验证所有字段是否填写
    if (!maleYear || !maleMonth || !maleDay || maleHour === '' ||
        !femaleYear || !femaleMonth || !femaleDay || femaleHour === '') {
      alert('请填写完整的男女双方出生信息')
      return
    }

    // 验证年份范围
    const maleYearNum = Number(maleYear)
    const femaleYearNum = Number(femaleYear)
    if (maleYearNum < 1900 || maleYearNum > 2100 || femaleYearNum < 1900 || femaleYearNum > 2100) {
      alert('请输入1900-2100之间的年份')
      return
    }

    // 验证月份范围
    const maleMonthNum = Number(maleMonth)
    const femaleMonthNum = Number(femaleMonth)
    if (maleMonthNum < 1 || maleMonthNum > 12 || femaleMonthNum < 1 || femaleMonthNum > 12) {
      alert('请输入1-12之间的月份')
      return
    }

    // 验证日期范围
    const maleDayNum = Number(maleDay)
    const femaleDayNum = Number(femaleDay)
    if (maleDayNum < 1 || maleDayNum > 31 || femaleDayNum < 1 || femaleDayNum > 31) {
      alert('请输入1-31之间的日期')
      return
    }

    // 验证小时范围
    const maleHourNum = Number(maleHour)
    const femaleHourNum = Number(femaleHour)
    if (maleHourNum < 0 || maleHourNum > 23 || femaleHourNum < 0 || femaleHourNum > 23) {
      alert('请输入0-23之间的小时')
      return
    }

    // 跳转到相配分析页面
    router.push(
      `/compatibility?maleYear=${maleYear}&maleMonth=${maleMonth}&maleDay=${maleDay}&maleHour=${maleHour}&femaleYear=${femaleYear}&femaleMonth=${femaleMonth}&femaleDay=${femaleDay}&femaleHour=${femaleHour}`
    )
  }

  return (
    <div className="space-y-6">
      {/* 男方信息 */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-3">👨 男方信息</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="出生年（如 1990）"
            value={maleYear}
            onChange={e => setMaleYear(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="出生月（1-12）"
            value={maleMonth}
            onChange={e => setMaleMonth(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="出生日（1-31）"
            value={maleDay}
            onChange={e => setMaleDay(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="出生时（0-23）"
            value={maleHour}
            onChange={e => setMaleHour(e.target.value)}
          />
        </div>
      </div>

      {/* 女方信息 */}
      <div className="bg-pink-50 p-4 rounded-lg">
        <h3 className="font-semibold text-pink-800 mb-3">👩 女方信息</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="出生年（如 1992）"
            value={femaleYear}
            onChange={e => setFemaleYear(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="出生月（1-12）"
            value={femaleMonth}
            onChange={e => setFemaleMonth(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="出生日（1-31）"
            value={femaleDay}
            onChange={e => setFemaleDay(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="出生时（0-23）"
            value={femaleHour}
            onChange={e => setFemaleHour(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={submit}
        className="w-full bg-gradient-to-r from-blue-600 to-pink-600 text-white py-3 rounded-lg hover:opacity-90 font-medium"
      >
        🔮 分析男女八字相配度
      </button>

      <div className="text-xs text-gray-500">
        <p>💡 相配分析基于：</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>五行相生相克关系</li>
          <li>十神互补性分析</li>
          <li>日主强弱搭配</li>
          <li>四柱相配程度</li>
        </ul>
      </div>
    </div>
  )
}