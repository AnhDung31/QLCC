/**
 * Trang quản lý bộ phận và vị trí
 * Cho phép thêm, xem và quản lý các bộ phận và vị trí trong hệ thống
 */
import { DepartmentManagement } from "@/components/department-management"

/**
 * Component trang quản lý bộ phận và vị trí
 */
export default function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quản Lý Bộ Phận & Vị Trí</h1>
      <p className="text-muted-foreground">Quản lý các bộ phận và vị trí trong hệ thống</p>
      <DepartmentManagement />
    </div>
  )
}
