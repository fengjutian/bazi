// src/app/page.tsx

import BaziForm from '@/components/BaziForm'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          八字算命
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          输入出生信息，生成你的八字命盘（理性分析版）
        </p>

        <BaziForm />

        <div className="mt-6 text-xs text-gray-400 text-center">
          本工具仅用于命理结构分析，不构成任何人生决策建议
        </div>
      </div>
    </main>
  )
}
