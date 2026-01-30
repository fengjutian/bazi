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

    // 将 DOM 转成 canvas
    const canvas = await html2canvas(element, { scale: 2 })
    const imgData = canvas.toDataURL("image/png")

    // 创建 PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
    pdf.save("bazi_report.pdf")
  }

  return (
    <button
      onClick={handleExport}
      className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
    >
      下载 PDF 报告
    </button>
  )
}
