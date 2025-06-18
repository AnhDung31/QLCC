/**
 * Component bảng chấm công nhân viên
 * Hiển thị thông tin chấm công của tất cả nhân viên và cho phép xem chi tiết
 */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEmployees } from "@/hooks/use-employees"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MonthlyAttendanceDetail } from "@/components/monthly-attendance-detail"
import { ExportExcelButton } from "@/components/export-excel-button"

// Thêm import cho DatePicker
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

/**
 * Component bảng chấm công nhân viên
 * Hiển thị thông tin chấm công của tất cả nhân viên
 */
export function EmployeeAttendanceTable() {
  // Lấy dữ liệu nhân viên
  const { employees } = useEmployees()

  // State quản lý bộ lọc và hiển thị
  const [searchTerm, setSearchTerm] = useState("") // Từ khóa tìm kiếm
  const [departmentFilter, setDepartmentFilter] = useState("all") // Bộ lọc phòng ban
  const [selectedEmployee, setSelectedEmployee] = useState(null) // Nhân viên được chọn
  const [showDetailDialog, setShowDetailDialog] = useState(false) // Hiển thị dialog chi tiết
  const [date, setDate] = useState(new Date()) // Ngày được chọn

  // Lấy danh sách phòng ban duy nhất từ dữ liệu nhân viên
  const departments = [...new Set(employees.map((emp) => emp.department).filter(Boolean))]

  // Lọc nhân viên theo tìm kiếm và phòng ban
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) || employee.id.toString().includes(searchTerm)
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  /**
   * Hiển thị badge tương ứng với trạng thái chấm công
   * @param {string} status - Trạng thái chấm công
   * @returns {JSX.Element|null} Badge component hoặc null
   */
  const getStatusBadge = (status) => {
    if (!status) return null

    switch (status) {
      case "ontime":
        return <Badge className="bg-green-500">Đúng Giờ</Badge>
      case "late":
        return <Badge className="bg-yellow-500">Đi Muộn</Badge>
      case "early":
        return <Badge className="bg-blue-500">Đi Sớm</Badge>
      case "absent":
        return <Badge className="bg-red-500">Vắng Mặt</Badge>
      default:
        return <Badge>Không Xác Định</Badge>
    }
  }

  /**
   * Hiển thị badge tương ứng với ca làm việc
   * @param {string} shift - Loại ca làm việc
   * @returns {JSX.Element|null} Badge component hoặc null
   */
  const getShiftBadge = (shift) => {
    if (!shift) return null

    switch (shift) {
      case "morning":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Ca Sáng
          </Badge>
        )
      case "afternoon":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
            Ca Chiều
          </Badge>
        )
      case "fullday":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            Cả Ngày
          </Badge>
        )
      default:
        return null
    }
  }

  /**
   * Mở dialog xem chi tiết chấm công của nhân viên
   * @param {number} employeeId - ID của nhân viên
   */
  const viewEmployeeDetail = (employeeId) => {
    setSelectedEmployee(employeeId)
    setShowDetailDialog(true)
  }

  // Lấy thông tin nhân viên được chọn
  const selectedEmployeeData = employees.find((emp) => emp.id === selectedEmployee)

  /**
   * Chuẩn bị dữ liệu để xuất Excel
   * @returns {Array} Dữ liệu đã được chuẩn bị để xuất Excel
   */
  const prepareExcelData = () => {
    return filteredEmployees.map((employee) => {
      // Chuyển đổi các badge thành text để xuất ra Excel
      const getShiftText = (shift) => {
        if (!shift) return ""
        switch (shift) {
          case "morning":
            return "Ca Sáng"
          case "afternoon":
            return "Ca Chiều"
          case "fullday":
            return "Cả Ngày"
          default:
            return ""
        }
      }

      const getStatusText = (status) => {
        if (!status) return ""
        switch (status) {
          case "ontime":
            return "Đúng Giờ"
          case "late":
            return "Đi Muộn"
          case "early":
            return "Đi Sớm"
          case "absent":
            return "Vắng Mặt"
          default:
            return ""
        }
      }

      return {
        ID: employee.id,
        "Họ Tên": employee.name || "Chưa có tên",
        "Ca Làm": getShiftText(employee.shift),
        "Giờ Check-in": employee.checkIn || "-",
        "Giờ Check-out": employee.checkOut || "-",
        "Trạng Thái": getStatusText(employee.attendanceStatus),
        "Sớm/Muộn": employee.timeDifference || "-",
        "OT (giờ)": employee.overtimeHours || "0",
        "Thời Gian Xác Thực": employee.lastFaceTime || "-",
        // Thêm thuộc tính ẩn để kiểm tra trạng thái
        _status: employee.attendanceStatus,
      }
    })
  }

  // Format ngày hiện tại
  const formattedDate = format(date, "dd-MM-yyyy", { locale: vi })

  return (
    <div className="space-y-4">
      {/* Phần bộ lọc */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Ô tìm kiếm */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nhân viên theo tên hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        {/* Bộ lọc phòng ban */}
        <div className="w-full md:w-48">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tất Cả Phòng Ban" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất Cả Phòng Ban</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Bộ chọn ngày */}
        <div className="w-full md:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-full justify-start text-left font-normal md:w-[240px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP", { locale: vi })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                locale={vi}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Bảng danh sách nhân viên */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Danh Sách Nhân Viên</CardTitle>
          {/* Cập nhật ExportExcelButton để thêm điều kiện tô màu */}
          <ExportExcelButton
            data={prepareExcelData()}
            filename={`Danh-Sach-Nhan-Vien-${formattedDate}`}
            sheetName="Nhân Viên"
            highlightCondition={(row) => row._status === "late"}
            highlightColor="FFCDD2" // Màu đỏ nhạt
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Họ Tên</TableHead>
                  <TableHead>Ca Làm</TableHead>
                  <TableHead>Giờ Check-in</TableHead>
                  <TableHead>Giờ Check-out</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>Sớm/Muộn</TableHead>
                  <TableHead>OT</TableHead>
                  <TableHead>Khuôn Mặt</TableHead>
                  <TableHead>Thời Gian Xác Thực</TableHead>
                  <TableHead>Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.id}</TableCell>
                    <TableCell className="font-medium">{employee.name || "Chưa có tên"}</TableCell>
                    <TableCell>{getShiftBadge(employee.shift)}</TableCell>
                    <TableCell>{employee.checkIn || "-"}</TableCell>
                    <TableCell>{employee.checkOut || "-"}</TableCell>
                    <TableCell>{getStatusBadge(employee.attendanceStatus)}</TableCell>
                    <TableCell>{employee.timeDifference || "-"}</TableCell>
                    <TableCell>{employee.overtimeHours || "0"} giờ</TableCell>
                    <TableCell>
                      {employee.lastFaceImage ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.lastFaceImage || "/placeholder.svg"} alt="Khuôn mặt xác thực" />
                          <AvatarFallback>KM</AvatarFallback>
                        </Avatar>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{employee.lastFaceTime || "-"}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => viewEmployeeDetail(employee.id)}>
                        Chi Tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog xem chi tiết chấm công */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              Chi Tiết Chấm Công - {selectedEmployeeData?.name || "Nhân viên"} (ID: {selectedEmployeeData?.id})
            </DialogTitle>
          </DialogHeader>
          {selectedEmployee && <MonthlyAttendanceDetail employeeId={selectedEmployee} initialDate={date} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
