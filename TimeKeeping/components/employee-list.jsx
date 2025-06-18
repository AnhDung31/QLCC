/**
 * Component hiển thị danh sách nhân viên
 * Bao gồm bộ lọc và thẻ thông tin nhân viên
 */
"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEmployees } from "@/hooks/use-employees"
import { Clock, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmployeeList() {
  const { employees } = useEmployees()
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [shiftFilter, setShiftFilter] = useState("all")

  // Lấy danh sách phòng ban duy nhất từ dữ liệu nhân viên
  const departments = [...new Set(employees.map((emp) => emp.department).filter(Boolean))]

  // Lọc nhân viên theo tìm kiếm, phòng ban, trạng thái và ca làm việc
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) || employee.id.toString().includes(searchTerm)
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter
    const matchesShift = shiftFilter === "all" || employee.shift === shiftFilter

    return matchesSearch && matchesDepartment && matchesStatus && matchesShift
  })

  /**
   * Hiển thị badge tương ứng với trạng thái chấm công
   * @param {string} status - Trạng thái chấm công
   * @returns {JSX.Element} Badge component
   */
  const getStatusBadge = (status) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500">Có Mặt</Badge>
      case "late":
        return <Badge className="bg-yellow-500">Đi Muộn</Badge>
      case "absent":
        return <Badge className="bg-red-500">Vắng Mặt</Badge>
      case "new":
        return <Badge className="bg-blue-500">Mới</Badge>
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Ô tìm kiếm */}
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Tìm kiếm
          </Label>
          <Input
            id="search"
            placeholder="Tìm kiếm nhân viên theo tên hoặc ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Bộ lọc phòng ban */}
        <div className="w-full md:w-48">
          <Label htmlFor="department-filter" className="sr-only">
            Phòng Ban
          </Label>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger id="department-filter">
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
        {/* Bộ lọc trạng thái */}
        <div className="w-full md:w-48">
          <Label htmlFor="status-filter" className="sr-only">
            Trạng Thái
          </Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Trạng Thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất Cả Trạng Thái</SelectItem>
              <SelectItem value="present">Có Mặt</SelectItem>
              <SelectItem value="late">Đi Muộn</SelectItem>
              <SelectItem value="absent">Vắng Mặt</SelectItem>
              <SelectItem value="new">Mới</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Bộ lọc ca làm */}
        <div className="w-full md:w-48">
          <Label htmlFor="shift-filter" className="sr-only">
            Ca Làm
          </Label>
          <Select value={shiftFilter} onValueChange={setShiftFilter}>
            <SelectTrigger id="shift-filter">
              <SelectValue placeholder="Ca Làm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất Cả Ca Làm</SelectItem>
              <SelectItem value="morning">Ca Sáng</SelectItem>
              <SelectItem value="afternoon">Ca Chiều</SelectItem>
              <SelectItem value="fullday">Cả Ngày</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={employee.image || "/placeholder.svg?height=64&width=64"}
                  alt={employee.name || "Nhân viên mới"}
                />
                <AvatarFallback>{employee.name ? employee.name.substring(0, 2).toUpperCase() : "NV"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{employee.name || "Nhân viên mới"}</div>
                <div className="text-sm text-muted-foreground">{employee.position || "Chưa có vị trí"}</div>
                <div className="text-sm text-muted-foreground">{employee.department || "Chưa có phòng ban"}</div>
                <div className="flex items-center justify-between mt-2">
                  {getStatusBadge(employee.status || "new")}
                  <div className="text-sm">
                    ID: <span className="font-medium">{employee.id}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  {getShiftBadge(employee.shift)}
                  {employee.lastCheckTime && employee.lastCheckTime !== "-" && (
                    <div className="text-sm flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span className="font-medium">{employee.lastCheckTime}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex justify-between">
                  <Link href={`/dashboard/employees/${employee.id}`}>
                    <Button variant="ghost" size="sm">
                      Chi tiết
                    </Button>
                  </Link>
                  <Link href={`/dashboard/employees/${employee.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-3 w-3 mr-1" />
                      Cập nhật
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
