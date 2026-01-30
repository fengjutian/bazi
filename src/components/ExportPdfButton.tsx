"use client"

import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface Props {
  targetId: string
}

export default function ExportPdfButton({ targetId }: Props) {
  const handleExport = async () => {
    const element = document.getElementById(targetId)
    if (!element) return

    const pdf = new jsPDF({ unit: "pt", format: "a4" })
    const pageHeight = pdf.internal.pageSize.getHeight()

    // 每页单独截图，保证分页
    const children = Array.from(element.children) as HTMLElement[]
    let offsetY = 0

    for (let i = 0; i < children.length; i++) {
      const child = children[i]

      const canvas = await html2canvas(child, { scale: 2 })
      const imgData = canvas.toDataURL("image/png")
      const imgHeight = (canvas.height * pdf.internal.pageSize.getWidth()) / canvas.width

      if (offsetY + imgHeight > pageHeight) {
        pdf.addPage()
        offsetY = 0
      }

      pdf.addImage(imgData, "PNG", 0, offsetY, pdf.internal.pageSize.getWidth(), imgHeight)
      offsetY += imgHeight
    }

    pdf.save("bazi_full_report.pdf")
  }

  return (
    <button
      onClick={handleExport}
      className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
    >
      下载完整 PDF 命盘报告
    </button>
  )
}
