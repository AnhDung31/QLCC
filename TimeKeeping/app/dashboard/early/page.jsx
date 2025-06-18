/**
 * Trang hiển thị thông tin nhân viên về sớm
 * Hiển thị danh sách nhân viên về sớm và thông tin chi tiết
 */
import { EarlyEmployeesTable } from "@/components/early-employees-table"

export default function EarlyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nhân Viên Về Sớm</h1>
      <p className="text-muted-foreground">Thông tin nhân viên về sớm trong ngày</p>
      <EarlyEmployeesTable />
    </div>
  )
}
