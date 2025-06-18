/**
 * Trang hiển thị thông tin nhân viên đi muộn
 * Hiển thị danh sách nhân viên đi muộn và thông tin chi tiết
 */
import { LateEmployeesTable } from "@/components/late-employees-table"

export default function LatePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nhân Viên Đi Muộn</h1>
      <p className="text-muted-foreground">Thông tin nhân viên đi muộn trong ngày</p>
      <LateEmployeesTable />
    </div>
  )
}
