/**
 * Component hiển thị thống kê tổng quan trên dashboard
 * Bao gồm các thông tin như tổng nhân viên, số nhân viên có mặt, đi muộn, vắng mặt
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { useEmployees } from "@/hooks/use-employees"

/**
 * Component hiển thị thống kê tổng quan
 */
export function DashboardStats() {
  // Lấy dữ liệu nhân viên
  const { employees } = useEmployees()

  // Tính toán số liệu thống kê
  const totalEmployees = employees.length
  const presentEmployees = employees.filter((emp) => emp.status === "present").length
  const lateEmployees = employees.filter((emp) => emp.status === "late").length
  const absentEmployees = employees.filter((emp) => emp.status === "absent").length

  // Tính tỷ lệ
  const attendanceRate = Math.round(((presentEmployees + lateEmployees) / totalEmployees) * 100)
  const lateRate = Math.round((lateEmployees / (presentEmployees + lateEmployees)) * 100)
  const absentRate = Math.round((absentEmployees / totalEmployees) * 100)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Thẻ tổng nhân viên */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng Nhân Viên</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmployees}</div>
          <p className="text-xs text-muted-foreground">+2 so với tháng trước</p>
        </CardContent>
      </Card>

      {/* Thẻ nhân viên có mặt */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Có Mặt Hôm Nay</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{presentEmployees + lateEmployees}</div>
          <p className="text-xs text-muted-foreground">Tỷ lệ điểm danh {attendanceRate}%</p>
        </CardContent>
      </Card>

      {/* Thẻ nhân viên đi muộn */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đi Muộn</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lateEmployees}</div>
          <p className="text-xs text-muted-foreground">{lateRate}% nhân viên có mặt</p>
        </CardContent>
      </Card>

      {/* Thẻ nhân viên vắng mặt */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vắng Mặt</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{absentEmployees}</div>
          <p className="text-xs text-muted-foreground">Tỷ lệ vắng mặt {absentRate}%</p>
        </CardContent>
      </Card>
    </div>
  )
}
