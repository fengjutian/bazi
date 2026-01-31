"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function BaziForm() {
  const router = useRouter()

  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [hour, setHour] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // 验证年份
    if (!year) {
      newErrors.year = '请输入出生年份'
    } else if (Number(year) < 1900 || Number(year) > new Date().getFullYear()) {
      newErrors.year = '请输入1900年至今的有效年份'
    }

    // 验证月份
    if (!month) {
      newErrors.month = '请输入出生月份'
    } else if (Number(month) < 1 || Number(month) > 12) {
      newErrors.month = '请输入1-12之间的月份'
    }

    // 验证日期
    if (!day) {
      newErrors.day = '请输入出生日期'
    } else if (Number(day) < 1 || Number(day) > 31) {
      newErrors.day = '请输入1-31之间的日期'
    }

    // 验证小时
    if (hour === '') {
      newErrors.hour = '请输入出生时辰'
    } else if (Number(hour) < 0 || Number(hour) > 23) {
      newErrors.hour = '请输入0-23之间的小时'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submit = async () => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    // 模拟加载延迟，提升用户体验
    await new Promise(resolve => setTimeout(resolve, 800))
    
    router.push(
      `/result?year=${year}&month=${month}&day=${day}&hour=${hour}`
    )
  }

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  return (
    <div className="space-y-6">
      {/* 出生年份 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📅 出生年份
        </label>
        <input
          className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
            errors.year 
              ? 'border-red-300 bg-red-50 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500 hover:border-gray-400'
          }`}
          placeholder="请输入出生年份（如：1995）"
          value={year}
          onChange={e => {
            setYear(e.target.value)
            clearError('year')
          }}
          maxLength={4}
        />
        {errors.year && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.year}
          </p>
        )}
      </div>

      {/* 出生月份 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📆 出生月份
        </label>
        <input
          className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
            errors.month 
              ? 'border-red-300 bg-red-50 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500 hover:border-gray-400'
          }`}
          placeholder="请输入出生月份（1-12）"
          value={month}
          onChange={e => {
            setMonth(e.target.value)
            clearError('month')
          }}
          maxLength={2}
        />
        {errors.month && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.month}
          </p>
        )}
      </div>

      {/* 出生日期 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🗓️ 出生日期
        </label>
        <input
          className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
            errors.day 
              ? 'border-red-300 bg-red-50 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500 hover:border-gray-400'
          }`}
          placeholder="请输入出生日期（1-31）"
          value={day}
          onChange={e => {
            setDay(e.target.value)
            clearError('day')
          }}
          maxLength={2}
        />
        {errors.day && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.day}
          </p>
        )}
      </div>

      {/* 出生时辰 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ⏰ 出生时辰
        </label>
        <input
          className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
            errors.hour 
              ? 'border-red-300 bg-red-50 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500 hover:border-gray-400'
          }`}
          placeholder="请输入出生时辰（0-23）"
          value={hour}
          onChange={e => {
            setHour(e.target.value)
            clearError('hour')
          }}
          maxLength={2}
        />
        {errors.hour && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.hour}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          💡 提示：0-23点对应子时到亥时，建议使用24小时制
        </p>
      </div>

      {/* 提交按钮 */}
      <button
        onClick={submit}
        disabled={isSubmitting}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
          isSubmitting
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>正在排八字...</span>
          </>
        ) : (
          <>
            <span>🔮</span>
            <span>开始排八字</span>
          </>
        )}
      </button>

      {/* 快速示例 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 font-medium mb-2">
          💡 快速示例：
        </p>
        <button
          onClick={() => {
            setYear('1990')
            setMonth('5')
            setDay('15')
            setHour('14')
            setErrors({})
          }}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          点击填充示例数据：1990年5月15日14时
        </button>
      </div>
    </div>
  )
}