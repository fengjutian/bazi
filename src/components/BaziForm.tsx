"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function BaziForm() {
  const router = useRouter()

  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [hour, setHour] = useState('')

  const submit = () => {
    if (!year || !month || !day || hour === '') return
    router.push(
      `/result?year=${year}&month=${month}&day=${day}&hour=${hour}`
    )
  }

  return (
    <div className="space-y-4">
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="出生年（如 1995）"
        value={year}
        onChange={e => setYear(e.target.value)}
      />
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="出生月（1-12）"
        value={month}
        onChange={e => setMonth(e.target.value)}
      />
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="出生日（1-31）"
        value={day}
        onChange={e => setDay(e.target.value)}
      />
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="出生时（0-23）"
        value={hour}
        onChange={e => setHour(e.target.value)}
      />

      <button
        onClick={submit}
        className="w-full bg-black text-white py-2 rounded hover:opacity-90"
      >
        开始排八字
      </button>
    </div>
  )
}
