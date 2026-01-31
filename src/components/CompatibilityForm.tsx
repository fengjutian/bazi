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

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // 验证男方信息
    if (!maleYear) newErrors.maleYear = '请输入男方出生年份'
    else if (Number(maleYear) < 1900 || Number(maleYear) > new Date().getFullYear()) 
      newErrors.maleYear = '请输入1900年至今的有效年份'

    if (!maleMonth) newErrors.maleMonth = '请输入男方出生月份'
    else if (Number(maleMonth) < 1 || Number(maleMonth) > 12) 
      newErrors.maleMonth = '请输入1-12之间的月份'

    if (!maleDay) newErrors.maleDay = '请输入男方出生日期'
    else if (Number(maleDay) < 1 || Number(maleDay) > 31) 
      newErrors.maleDay = '请输入1-31之间的日期'

    if (maleHour === '') newErrors.maleHour = '请输入男方出生时辰'
    else if (Number(maleHour) < 0 || Number(maleHour) > 23) 
      newErrors.maleHour = '请输入0-23之间的小时'

    // 验证女方信息
    if (!femaleYear) newErrors.femaleYear = '请输入女方出生年份'
    else if (Number(femaleYear) < 1900 || Number(femaleYear) > new Date().getFullYear()) 
      newErrors.femaleYear = '请输入1900年至今的有效年份'

    if (!femaleMonth) newErrors.femaleMonth = '请输入女方出生月份'
    else if (Number(femaleMonth) < 1 || Number(femaleMonth) > 12) 
      newErrors.femaleMonth = '请输入1-12之间的月份'

    if (!femaleDay) newErrors.femaleDay = '请输入女方出生日期'
    else if (Number(femaleDay) < 1 || Number(femaleDay) > 31) 
      newErrors.femaleDay = '请输入1-31之间的日期'

    if (femaleHour === '') newErrors.femaleHour = '请输入女方出生时辰'
    else if (Number(femaleHour) < 0 || Number(femaleHour) > 23) 
      newErrors.femaleHour = '请输入0-23之间的小时'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submit = async () => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    // 模拟加载延迟，提升用户体验
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    router.push(
      `/compatibility?maleYear=${maleYear}&maleMonth=${maleMonth}&maleDay=${maleDay}&maleHour=${maleHour}&femaleYear=${femaleYear}&femaleMonth=${femaleMonth}&femaleDay=${femaleDay}&femaleHour=${femaleHour}`
    )
  }

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const fillExampleData = () => {
    setMaleYear('1990')
    setMaleMonth('5')
    setMaleDay('15')
    setMaleHour('14')
    setFemaleYear('1992')
    setFemaleMonth('8')
    setFemaleDay('20')
    setFemaleHour('10')
    setErrors({})
  }

  return (
    <div className="space-y-8">
      {/* 男方信息 */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">
            👨
          </div>
          <h3 className="text-lg font-bold text-blue-800">男方信息</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">出生年份</label>
            <input
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.maleYear 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                  : 'border-blue-200 focus:ring-blue-500 hover:border-blue-300'
              }`}
              placeholder="如：1990"
              value={maleYear}
              onChange={e => {
                setMaleYear(e.target.value)
                clearError('maleYear')
              }}
              maxLength={4}
            />
            {errors.maleYear && (
              <p className="mt-1 text-xs text-red-600">⚠️ {errors.maleYear}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">出生月份</label>
            <input
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.maleMonth 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                  : 'border-blue-200 focus:ring-blue-500 hover:border-blue-300'
              }`}
              placeholder="1-12"
              value={maleMonth}
              onChange={e => {
                setMaleMonth(e.target.value)
                clearError('maleMonth')
              }}
              maxLength={2}
            />
            {errors.maleMonth && (
              <p className="mt-1 text-xs text-red-600">⚠️ {errors.maleMonth}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">出生日期</label>
            <input
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.maleDay 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                  : 'border-blue-200 focus:ring-blue-500 hover:border-blue-300'
              }`}
              placeholder="1-31"
              value={maleDay}
              onChange={e => {
                setMaleDay(e.target.value)
                clearError('maleDay')
              }}
              maxLength={2}
            />
            {errors.maleDay && (
              <p className="mt-1 text-xs text-red-600">⚠️ {errors.maleDay}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">出生时辰</label>
            <input
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.maleHour 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                  : 'border-blue-200 focus:ring-blue-500 hover:border-blue-300'
              }`}
              placeholder="0-23"
              value={maleHour}
              onChange={e => {
                setMaleHour(e.target.value)
                clearError('maleHour')
              }}
              maxLength={2}
            />
            {errors.maleHour && (
              <p className="mt-1 text-xs text-red-600">⚠️ {errors.maleHour}</p>
            )}
          </div>
        </div>
      </div>

      {/* 女方信息 */}
      <div className="bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center mr-3">
            👩
          </div>
          <h3 className="text-lg font-bold text-pink-800">女方信息</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-2">出生年份</label>
            <input
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.femaleYear 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                  : 'border-pink-200 focus:ring-pink-500 hover:border-pink-300'
              }`}
              placeholder="如：1992"
              value={femaleYear}
              onChange={e => {
                setFemaleYear(e.target.value)
                clearError('femaleYear')
              }}
              maxLength={4}
            />
            {errors.femaleYear && (
              <p className="mt-1 text-xs text-red-600">⚠️ {errors.femaleYear}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-2">出生月份</label>
            <input
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.femaleMonth 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                  : 'border-pink-200 focus:ring-pink-500 hover:border-pink-300'
              }`}
              placeholder="1-12"
              value={femaleMonth}
              onChange={e => {
                setFemaleMonth(e.target.value)
                clearError('femaleMonth')
              }}
              maxLength={2}
            />
            {errors.femaleMonth && (
              <p className="mt-1 text-xs text-red-600">⚠️ {errors.femaleMonth}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-2">出生日期</label>
            <input
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.femaleDay 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                  : 'border-pink-200 focus:ring-pink-500 hover:border-pink-300'
              }`}
              placeholder="1-31"
              value={femaleDay}
              onChange={e => {
                setFemaleDay(e.target.value)
                clearError('femaleDay')
              }}
              maxLength={2}
            />
            {errors.femaleDay && (
              <p className="mt-1 text-xs text-red-600">⚠️ {errors.femaleDay}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-2">出生时辰</label>
            <input
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.femaleHour 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                  : 'border-pink-200 focus:ring-pink-500 hover:border-pink-300'
              }`}
              placeholder="0-23"
              value={femaleHour}
              onChange={e => {
                setFemaleHour(e.target.value)
                clearError('femaleHour')
              }}
              maxLength={2}
            />
            {errors.femaleHour && (
              <p className="mt-1 text-xs text-red-600">⚠️ {errors.femaleHour}</p>
            )}
          </div>
        </div>
      </div>

      {/* 提交按钮 */}
      <button
        onClick={submit}
        disabled={isSubmitting}
        className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center space-x-3 ${
          isSubmitting
            ? 'bg-gradient-to-r from-blue-400 to-pink-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span className="text-lg">正在分析相配度...</span>
          </>
        ) : (
          <>
            <span className="text-xl">💑</span>
            <span className="text-lg">分析男女八字相配度</span>
          </>
        )}
      </button>

      {/* 分析说明 */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5">
        <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
          <span className="mr-2">💡</span>
          相配分析说明
        </h4>
        <ul className="text-sm text-purple-700 space-y-2">
          <li className="flex items-start">
            <span className="mr-2">🌿</span>
            <span><strong>五行相生相克：</strong>分析双方五行力量的互补与协调</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">🎭</span>
            <span><strong>十神互补关系：</strong>评估十神组合的和谐程度</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">⚖️</span>
            <span><strong>日主强弱搭配：</strong>检查日主力量的平衡性</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">📊</span>
            <span><strong>四柱协调分析：</strong>年、月、日、时四柱的相配度</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">⏳</span>
            <span><strong>大运同步性：</strong>关键人生阶段的运势协调</span>
          </li>
        </ul>
      </div>

      {/* 快速示例 */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-green-800 flex items-center">
            <span className="mr-2">🚀</span>
            快速示例
          </h4>
          <button
            onClick={fillExampleData}
            className="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors"
          >
            一键填充
          </button>
        </div>
        <p className="text-sm text-green-700">
          示例数据：男方1990年5月15日14时，女方1992年8月20日10时
        </p>
      </div>
    </div>
  )
}