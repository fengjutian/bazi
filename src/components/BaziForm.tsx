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
    router.push(
      `/result?year=${year}&month=${month}&day=${day}&hour=${hour}`
    )
  }

  return (
    <div className="space-y-4">
      <input placeholder="年" onChange={e=>setYear(e.target.value)} />
      <input placeholder="月" onChange={e=>setMonth(e.target.value)} />
      <input placeholder="日" onChange={e=>setDay(e.target.value)} />
      <input placeholder="时（0-23）" onChange={e=>setHour(e.target.value)} />
      <button onClick={submit}>开始算命</button>
    </div>
  )
}
