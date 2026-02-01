// src/app/page.tsx
"use client"

import BaziForm from '@/components/BaziForm'
import CompatibilityForm from '@/components/CompatibilityForm'
import SpouseRecommendationForm from '@/components/SpouseRecommendationForm'
import { useState } from 'react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'bazi' | 'compatibility' | 'spouse'>('bazi')

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* 头部区域 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-3">
              🧮 八字算命与相配分析
            </h1>
            <p className="text-blue-100 text-lg">
              基于传统命理学的理性分析工具
            </p>
          </div>
        </div>

        {/* 功能导航标签 */}
        <div className="bg-white border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('bazi')}
              className={`flex-1 py-4 text-center font-semibold transition-all duration-300 ${
                activeTab === 'bazi'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-blue-500 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>🔮</span>
                <span>个人八字分析</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('compatibility')}
              className={`flex-1 py-4 text-center font-semibold transition-all duration-300 ${
                activeTab === 'compatibility'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-purple-500 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>💑</span>
                <span>男女八字相配</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('spouse')}
              className={`flex-1 py-4 text-center font-semibold transition-all duration-300 ${
                activeTab === 'spouse'
                  ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                  : 'text-gray-500 hover:text-pink-500 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>💖</span>
                <span>智能配偶推荐</span>
              </div>
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-8">
          {/* 个人八字分析 */}
          <div 
            className={`transition-all duration-500 ${
              activeTab === 'bazi' 
                ? 'block opacity-100 translate-y-0' 
                : 'hidden opacity-0 -translate-y-4'
            }`}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                个人八字命盘分析
              </h2>
              <p className="text-gray-600 leading-relaxed">
                输入您的出生信息，系统将基于传统八字命理学原理，为您生成详细的命盘分析，
                包括五行分布、十神关系、大运走势等，帮助您更好地了解自己的命理特点。
              </p>
            </div>
            <BaziForm />
          </div>

          {/* 男女八字相配分析 */}
          <div 
            className={`transition-all duration-500 ${
              activeTab === 'compatibility' 
                ? 'block opacity-100 translate-y-0' 
                : 'hidden opacity-0 -translate-y-4'
            }`}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                男女八字相配分析
              </h2>
              <p className="text-gray-600 leading-relaxed">
                输入男女双方的出生信息，系统将从五行相生相克、十神互补、日主强弱、
                四柱协调、大运同步等多个维度，科学分析双方的相配程度。
              </p>
            </div>
            <CompatibilityForm />
          </div>

          {/* 智能配偶推荐 */}
          <div 
            className={`transition-all duration-500 ${
              activeTab === 'spouse' 
                ? 'block opacity-100 translate-y-0' 
                : 'hidden opacity-0 -translate-y-4'
            }`}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                智能配偶推荐
              </h2>
              <p className="text-gray-600 leading-relaxed">
                输入您的八字信息，系统将基于传统命理学原理，智能推荐最合适的异性配偶。
                综合考虑五行互补、十神相配、日主强弱等因素，为您提供科学的匹配建议。
              </p>
            </div>
            <SpouseRecommendationForm />
          </div>
        </div>

        {/* 页脚说明 */}
        <div className="bg-gray-50 border-t p-6">
          <div className="text-center text-gray-500 text-sm">
            <p className="mb-2">
              💡 <strong>温馨提示：</strong>本工具基于传统命理学原理开发，仅供娱乐和参考使用
            </p>
            <p>
              分析结果不构成任何人生决策建议，请理性看待，享受命理文化的乐趣
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}