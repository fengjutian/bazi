"use client"

import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface Props {
  /** 需要生成 PDF 的 DOM 容器 id */
  targetId: string
  /** PDF 文件名 */
  fileName?: string
}

export default function ExportPdfButton({ targetId, fileName = "bazi_report.pdf" }: Props) {
  const handleExport = async () => {
    const container = document.getElementById(targetId)
    if (!container) {
      console.warn(`没有找到 id 为 ${targetId} 的元素`)
      return
    }

    const pdf = new jsPDF({ unit: "pt", format: "a4" })
    const pageHeight = pdf.internal.pageSize.getHeight()
    const pageWidth = pdf.internal.pageSize.getWidth()

    const children = Array.from(container.children) as HTMLElement[]
    let offsetY = 0

    for (let i = 0; i < children.length; i++) {
      const child = children[i]

      // 将每个子元素截图
      const canvas = await html2canvas(child, { scale: 2 })
      const imgData = canvas.toDataURL("image/png")
      const imgHeight = (canvas.height * pageWidth) / canvas.width

      // 自动分页
      if (offsetY + imgHeight > pageHeight) {
        pdf.addPage()
        offsetY = 0
      }

      pdf.addImage(imgData, "PNG", 0, offsetY, pageWidth, imgHeight)
      offsetY += imgHeight
    }

    pdf.save(fileName)
  }

  return (
    <button
      onClick={handleExport}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      下载 PDF 命盘报告
    </button>
  )
}
