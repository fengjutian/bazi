// 配偶推荐表单组件
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SpouseRecommendationForm() {
  const router = useRouter()
  
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [hour, setHour] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('male')
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
      `/spouse-recommendation?year=${year}&month=${month}&day=${day}&hour=${hour}&gender=${gender}`
    )
  }

  const fillExampleData = () => {
    setYear('1990')
    setMonth('5')
    setDay('15')
    setHour('12')
    setGender('male')
    setErrors({})
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-pink-700 mb-2">💖 智能配偶推荐</h2>
        <p className="text-pink-600">
          输入您的八字信息，系统将基于传统命理学原理，为您推荐最合适的异性配偶
        </p>
      </div>

      <div className="space-y-6">
        {/* 性别选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            💁 您的性别
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                gender === 'male'
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
              }`}
            >
              👨 男性
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                gender === 'female'
                  ? 'bg-pink-100 border-pink-500 text-pink-700'
                  : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
              }`}
            >
              👩 女性
            </button>
          </div>
        </div>

        {/* 出生信息输入 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              出生年份
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="如：1990"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                errors.year ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              出生月份
            </label>
            <input
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="如：5"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                errors.month ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.month && <p className="text-red-500 text-xs mt-1">{errors.month}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              出生日期
            </label>
            <input
              type="number"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="如：15"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                errors.day ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.day && <p className="text-red-500 text-xs mt-1">{errors.day}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              出生时辰
            </label>
            <input
              type="number"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              placeholder="如：12"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                errors.hour ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.hour && <p className="text-red-500 text-xs mt-1">{errors.hour}</p>}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={submit}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                正在分析中...
              </>
            ) : (
              '🔮 开始推荐配偶'
            )}
          </button>
          
          <button
            type="button"
            onClick={fillExampleData}
            className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all"
          >
            📋 使用示例数据
          </button>
        </div>

        {/* 说明信息 */}
        <div className="bg-white border border-pink-200 rounded-lg p-4">
          <h3 className="font-semibold text-pink-700 mb-2">💡 推荐说明</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 基于传统八字命理学原理进行智能匹配</li>
            <li>• 综合考虑五行互补、十神相配、日主强弱等因素</li>
            <li>• 推荐年龄差在±5岁范围内的合适配偶</li>
            <li>• 分析结果仅供娱乐参考，请理性看待</li>
          </ul>
        </div>
      </div>
    </div>
  )
}