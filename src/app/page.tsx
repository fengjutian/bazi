// src/app/page.tsx
"use client"

import BaziForm from '@/components/BaziForm'
import CompatibilityForm from '@/components/CompatibilityForm'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          八字算命与相配分析
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          输入出生信息，生成八字命盘或分析男女八字相配度（理性分析版）
        </p>

        {/* 功能选择标签 */}
        <div className="flex border-b mb-6">
          <button 
            className="flex-1 py-2 text-center font-medium border-b-2 border-black text-black"
          >
            个人八字分析
          </button>
          <button 
            className="flex-1 py-2 text-center font-medium text-gray-500 hover:text-black"
            onClick={() => {
              document.getElementById('compatibility-section')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            男女八字相配
          </button>
        </div>

        {/* 个人八字分析 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">个人八字分析</h2>
          <BaziForm />
        </div>

        {/* 男女八字相配分析 */}
        <div id="compatibility-section" className="border-t pt-8">
          <h2 className="text-lg font-semibold mb-4">男女八字相配分析</h2>
          <CompatibilityForm />
        </div>

        <div className="mt-6 text-xs text-gray-400 text-center">
          本工具仅用于命理结构分析，不构成任何人生决策建议
        </div>
      </div>
    </main>
  )
}