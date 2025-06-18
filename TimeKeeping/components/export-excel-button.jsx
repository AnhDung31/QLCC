/**
 * Component nút xuất dữ liệu ra file Excel
 * Cho phép xuất dữ liệu từ bảng ra file Excel với định dạng tùy chỉnh
 */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import * as XLSX from "xlsx"
import FileSaver from "file-saver"

/**
 * Component nút xuất Excel
 * @param {Object} props - Props của component
 * @param {Array} props.data - Dữ liệu cần xuất ra Excel
 * @param {string} props.filename - Tên file Excel
 * @param {string} props.sheetName - Tên sheet trong file Excel
 * @param {string} props.buttonText - Văn bản hiển thị trên nút
 * @param {string} props.className - Class CSS bổ sung
 * @param {Function} props.highlightCondition - Hàm kiểm tra điều kiện để tô màu hàng
 * @param {string} props.highlightColor - Mã màu HEX để tô màu hàng thỏa điều kiện
 */
export function ExportExcelButton({
  data,
  filename,
  sheetName = "Sheet1",
  buttonText = "Xuất Excel",
  className,
  highlightCondition,
  highlightColor = "FFCDD2", // Màu đỏ nhạt mặc định
}) {
  // State để theo dõi trạng thái đang xuất
  const [isExporting, setIsExporting] = useState(false)

  /**
   * Hàm xuất dữ liệu ra file Excel
   */
  const exportToExcel = async () => {
    // Kiểm tra dữ liệu có tồn tại không
    if (!data || data.length === 0) return

    // Bắt đầu quá trình xuất
    setIsExporting(true)

    try {
      // Tạo một workbook mới
      const wb = XLSX.utils.book_new()

      // Chuyển đổi dữ liệu thành worksheet
      const ws = XLSX.utils.json_to_sheet(data)

      // Áp dụng định dạng có điều kiện nếu được cung cấp
      if (highlightCondition) {
        // Thêm thuộc tính !cols để đặt chiều rộng cột
        const colWidth = [
          { wch: 12 }, // Ngày
          { wch: 10 }, // Ca làm
          { wch: 12 }, // Giờ check-in
          { wch: 12 }, // Giờ check-out
          { wch: 15 }, // Trạng thái
          { wch: 15 }, // Sớm/muộn
          { wch: 10 }, // OT
          { wch: 20 }, // Thời gian xác thực
        ]
        ws["!cols"] = colWidth

        // Tìm các hàng cần tô màu
        const rowsToHighlight = []
        for (let i = 0; i < data.length; i++) {
          if (highlightCondition(data[i])) {
            rowsToHighlight.push(i + 1) // +1 vì hàng đầu tiên là tiêu đề
          }
        }

        // Áp dụng định dạng cho các hàng cần tô màu
        if (!ws["!rows"]) ws["!rows"] = []

        // Tạo đối tượng !fills để định nghĩa các kiểu tô màu
        if (!wb.Sheets) wb.Sheets = {}
        if (!wb.Sheets.Styles) wb.Sheets.Styles = {}
        if (!wb.Sheets.Styles.Fills) wb.Sheets.Styles.Fills = []

        // Thêm kiểu tô màu mới
        const fillId = wb.Sheets.Styles.Fills.length
        wb.Sheets.Styles.Fills.push({
          patternType: "solid",
          fgColor: { rgb: highlightColor },
        })

        // Áp dụng định dạng cho từng ô trong các hàng cần tô màu
        for (const rowIndex of rowsToHighlight) {
          // Lấy phạm vi dữ liệu
          const range = XLSX.utils.decode_range(ws["!ref"] || "A1:A1")

          // Áp dụng định dạng cho mỗi ô trong hàng
          for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })

            // Tạo hoặc cập nhật thông tin định dạng cho ô
            if (!ws[cellAddress]) ws[cellAddress] = { v: "" }
            if (!ws[cellAddress].s) ws[cellAddress].s = {}

            // Áp dụng màu nền
            ws[cellAddress].s.fill = { fgColor: { rgb: highlightColor } }
          }
        }
      }

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, sheetName)

      // Tạo file Excel dưới dạng binary string
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true })

      // Chuyển đổi binary string thành Blob
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" })

      // Tải xuống file
      FileSaver.saveAs(blob, `${filename}.xlsx`)
    } catch (error) {
      console.error("Lỗi khi xuất file Excel:", error)
    } finally {
      // Kết thúc quá trình xuất
      setIsExporting(false)
    }
  }

  return (
    <Button onClick={exportToExcel} disabled={isExporting} className={className}>
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang xuất...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          {buttonText}
        </>
      )}
    </Button>
  )
}
