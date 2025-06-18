/**
 * Trang quản lý nhân viên
 * Hiển thị bảng quản lý thông tin cơ bản của nhân viên
 */
import { EmployeeManagementTable } from "@/components/employee-management-table"

/**
 * Component trang quản lý nhân viên
 * Hiển thị bảng quản lý nhân viên
 */
export default function ManagementPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quản Lý Nhân Viên</h1>
      <p className="text-muted-foreground">Quản lý thông tin cơ bản của nhân viên</p>
      <EmployeeManagementTable />
    </div>
  )
}
