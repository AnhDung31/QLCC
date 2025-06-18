/**
 * Component bảng quản lý nhân viên
 * Hiển thị danh sách nhân viên và các chức năng quản lý như chỉnh sửa, xem chi tiết
 */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEmployees } from "@/hooks/use-employees"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ExportExcelButton } from "@/components/export-excel-button"

// Thêm import cho DatePicker
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

// Thêm import Button, Pencil, Eye và EditEmployeeModal
import { Button } from "@/components/ui/button"
import { Pencil, Eye, UserPlus } from "lucide-react"
import { EditEmployeeModal } from "@/app/dashboard/management/edit-employee-modal"

/**
 * Component bảng quản lý nhân viên
 * Hiển thị danh sách nhân viên và các chức năng quản lý
 */
export function EmployeeManagementTable() {
  const router = useRouter()
  const { employees, departments, isLoading, error, fetchEmployees } = useEmployees()

  // State quản lý dữ liệu và bộ lọc
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [date, setDate] = useState(new Date())

  // State cho modal chỉnh sửa
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)

  // Gọi API khi component mount hoặc khi thay đổi bộ lọc
  useEffect(() => {
    const formattedDate = format(date, "yyyy-MM-dd")
    fetchEmployees(formattedDate)
  }, [date])

  // Lọc nhân viên theo tìm kiếm và phòng ban
  const filteredEmployees = employees.filter((employee) => {
    const searchTermLower = searchTerm.toLowerCase()
    const fullName = employee.fullName?.toLowerCase() || ""
    const employeeId = employee.employeeId?.toLowerCase() || ""
    
    // Lọc theo tên hoặc ID
    const matchesSearch = fullName.includes(searchTermLower) || employeeId.includes(searchTermLower)
    
    // Lọc theo phòng ban
    const matchesDepartment = departmentFilter === "all" || employee.department?._id === departmentFilter
    
    // Lọc theo ngày đăng ký (trước hoặc bằng ngày được chọn)
    const registrationDate = employee.registrationDate ? new Date(employee.registrationDate) : null
    const selectedDate = new Date(date)
    selectedDate.setHours(23, 59, 59, 999) // Đặt thời gian là cuối ngày để bao gồm cả ngày được chọn
    
    const matchesDate = !registrationDate || registrationDate <= selectedDate
    
    return matchesSearch && matchesDepartment && matchesDate
  })

  /**
   * Mở modal chỉnh sửa nhân viên
   * @param {string} employeeId - ID của nhân viên cần chỉnh sửa
   */
  const openEditModal = (employeeId) => {
    setSelectedEmployeeId(employeeId)
    setEditModalOpen(true)
  }

  /**
   * Hiển thị badge cho ca làm việc
   * @param {string} shift - Loại ca làm việc
   * @returns {JSX.Element|null} Badge component hoặc null
   */
  const getShiftBadge = (shift) => {
    if (!shift) return null

    switch (shift) {
      case "Ca sáng":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Ca Sáng
          </Badge>
        )
      case "Ca chiều":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
            Ca Chiều
          </Badge>
        )
      case "Cả ngày":
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
   * Chuẩn bị dữ liệu để xuất Excel
   * @returns {Array} Dữ liệu đã được chuẩn bị để xuất Excel
   */
  const prepareExcelData = () => {
    return filteredEmployees.map((employee) => {
      return {
        "Mã Nhân Viên": employee._id,
        "Họ Tên": employee.name || "-",
        "Phòng Ban": employee.department?.name || "-",
        "Vị Trí": employee.position?.name || "-",
        "Ca Làm": employee.shift || "-",
        "Thời Gian Đăng Ký": employee.faceRegistrationTime || "-",
      }
    })
  }

  if (isLoading) {
    return <div>Đang tải...</div>
  }

  if (error) {
    return <div>Có lỗi xảy ra: {error}</div>
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
                <SelectItem key={dept._id} value={dept._id}>
                  {dept.name}
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
          <div className="flex gap-2">
            {/* Nút thêm nhân viên mới */}
            <Button onClick={() => router.push("/dashboard/employees/new")}>
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm Nhân Viên
            </Button>
            {/* Nút xuất Excel */}
            <ExportExcelButton
              data={prepareExcelData()}
              filename={`Danh-Sach-Nhan-Vien-${formattedDate}`}
              sheetName="Nhân Viên"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Nhân Viên</TableHead>
                  <TableHead>Họ Tên</TableHead>
                  <TableHead>Phòng Ban</TableHead>
                  <TableHead>Vị Trí</TableHead>
                  <TableHead>Ca Làm</TableHead>
                  <TableHead>Ảnh 3x4</TableHead>
                  <TableHead>Khuôn Mặt Đăng Ký</TableHead>
                  <TableHead>Thời Gian Đăng Ký</TableHead>
                  <TableHead>Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell className="font-medium">{employee.fullName || "-"}</TableCell>
                    <TableCell>{employee.department?.name || "-"}</TableCell>
                    <TableCell>{employee.position?.name || "-"}</TableCell>
                    <TableCell>{getShiftBadge(employee.shift)}</TableCell>
                    <TableCell>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={employee.imageAvatar || "/placeholder.svg?height=48&width=48"} alt="Ảnh 3x4" />
                        <AvatarFallback>
                          {employee.name ? employee.name.substring(0, 2).toUpperCase() : "NV"}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      {employee.faceImage ? (
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={employee.faceImage || "/placeholder.svg"} alt="Khuôn mặt đăng ký" />
                          <AvatarFallback>KM</AvatarFallback>
                        </Avatar>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{employee.registrationDate || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {/* Nút sửa thông tin nhân viên */}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => router.push(`/dashboard/employees/${employee.employeeId}/edit`)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Sửa
                        </Button>
                        {/* Nút xem chi tiết nhân viên */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/employees/${employee.employeeId}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Chi tiết
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal chỉnh sửa nhân viên */}
      <EditEmployeeModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        employeeId={selectedEmployeeId}
      />
    </div>
  )
}
