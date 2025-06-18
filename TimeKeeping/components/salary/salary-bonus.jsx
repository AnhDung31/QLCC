/**
 * Component quản lý lương thưởng cho nhân viên
 * Hiển thị bảng lương thưởng và cho phép chỉnh sửa tiền thưởng
 */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEmployees } from "@/hooks/use-employees"
import { useSalaryCoefficients } from "@/hooks/use-salary-coefficients"
import { Edit, Save, X, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SalaryBonus() {
  // Lấy dữ liệu nhân viên và hệ số lương
  const { employees } = useEmployees()
  const { getSalaryCoefficient } = useSalaryCoefficients()

  // State để quản lý chỉnh sửa tiền thưởng
  const [editingId, setEditingId] = useState(null) // ID nhân viên đang chỉnh sửa
  const [editBonus, setEditBonus] = useState(0) // Giá trị tiền thưởng đang chỉnh sửa

  // State để quản lý bộ lọc
  const [month, setMonth] = useState(new Date().getMonth() + 1) // Tháng hiện tại
  const [year, setYear] = useState(new Date().getFullYear()) // Năm hiện tại
  const [searchTerm, setSearchTerm] = useState("") // Từ khóa tìm kiếm
  const [departmentFilter, setDepartmentFilter] = useState("all") // Bộ lọc phòng ban

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
   * Tạo dữ liệu mẫu cho số giờ làm việc
   * @param {number} employeeId - ID của nhân viên
   * @returns {Object} Dữ liệu giờ làm việc
   */
  const getWorkHours = (employeeId) => {
    const regularHours = 160 + Math.floor(Math.random() * 20)
    const overtimeHours = Math.floor(Math.random() * 20)
    return { regularHours, overtimeHours }
  }

  /**
   * Bắt đầu chỉnh sửa tiền thưởng cho nhân viên
   * @param {number} employeeId - ID của nhân viên
   */
  const startEdit = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId)
    if (employee && employee.salary) {
      setEditBonus(employee.salary.bonus)
      setEditingId(employeeId)
    }
  }

  /**
   * Hủy chỉnh sửa tiền thưởng
   */
  const cancelEdit = () => {
    setEditingId(null)
  }

  /**
   * Lưu tiền thưởng sau khi chỉnh sửa
   * @param {number} employeeId - ID của nhân viên
   */
  const saveEdit = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId)
    if (employee && employee.salary) {
      employee.salary.bonus = editBonus
    }
    setEditingId(null)
  }

  /**
   * Tính lương cho nhân viên
   * @param {number} employeeId - ID của nhân viên
   * @returns {Object} Thông tin lương
   */
  const calculateSalary = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId)
    if (!employee || !employee.department || !employee.position) {
      return { total: 0, breakdown: {} }
    }

    const { regularHours, overtimeHours } = getWorkHours(employeeId)

    // Lấy hệ số lương từ phòng ban và vị trí
    const salaryCoefficient = getSalaryCoefficient(employee.department, employee.position)

    if (!salaryCoefficient) {
      return { total: 0, breakdown: {} }
    }

    // Tính toán các thành phần lương
    const baseSalary = salaryCoefficient.baseSalary
    const hourlyRate = salaryCoefficient.hourlyRate
    const overtimeRate = salaryCoefficient.overtimeRate

    const regularPay = regularHours * hourlyRate
    const overtimePay = overtimeHours * overtimeRate
    const bonus = employee.salary?.bonus || 0

    const total = baseSalary + regularPay + overtimePay + bonus

    return {
      total,
      breakdown: {
        baseSalary,
        regularPay,
        overtimePay,
        bonus,
        hourlyRate,
        overtimeRate,
      },
    }
  }

  /**
   * Format số tiền thành định dạng VNĐ
   * @param {number} amount - Số tiền cần format
   * @returns {string} Chuỗi đã được format
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  // Danh sách tên các tháng
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ]

  // Danh sách năm (5 năm gần đây)
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

  return (
    <div className="space-y-6">
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
        {/* Bộ lọc tháng */}
        <div className="w-full md:w-36">
          <Select value={month.toString()} onValueChange={(value) => setMonth(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent>
              {months.map((monthName, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>
                  {monthName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Bộ lọc năm */}
        <div className="w-full md:w-32">
          <Select value={year.toString()} onValueChange={(value) => setYear(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bảng lương thưởng */}
      <Card>
        <CardHeader>
          <CardTitle>
            Bảng Lương Thưởng - {months[month - 1]} {year}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nhân Viên</TableHead>
                  <TableHead>Phòng Ban</TableHead>
                  <TableHead>Vị Trí</TableHead>
                  <TableHead>Giờ Làm</TableHead>
                  <TableHead>Giờ Tăng Ca</TableHead>
                  <TableHead>Lương Cơ Bản</TableHead>
                  <TableHead>Lương Theo Giờ</TableHead>
                  <TableHead>Lương Tăng Ca</TableHead>
                  <TableHead>Thưởng</TableHead>
                  <TableHead>Tổng Lương</TableHead>
                  <TableHead>Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => {
                  const { regularHours, overtimeHours } = getWorkHours(employee.id)
                  const { total, breakdown } = calculateSalary(employee.id)

                  return (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.id}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={employee.image || "/placeholder.svg?height=32&width=32"}
                            alt={employee.name || "Nhân viên mới"}
                          />
                          <AvatarFallback>
                            {employee.name ? employee.name.substring(0, 2).toUpperCase() : "NV"}
                          </AvatarFallback>
                        </Avatar>
                        <span>{employee.name || "Nhân viên mới"}</span>
                      </TableCell>
                      <TableCell>{employee.department || "-"}</TableCell>
                      <TableCell>{employee.position || "-"}</TableCell>
                      <TableCell>{regularHours} giờ</TableCell>
                      <TableCell>{overtimeHours} giờ</TableCell>
                      <TableCell>{formatCurrency(breakdown.baseSalary || 0)}</TableCell>
                      <TableCell>{formatCurrency(breakdown.hourlyRate || 0)} / giờ</TableCell>
                      <TableCell>{formatCurrency(breakdown.overtimeRate || 0)} / giờ</TableCell>

                      {/* Ô tiền thưởng - hiển thị input khi đang chỉnh sửa */}
                      {editingId === employee.id ? (
                        <TableCell>
                          <Input
                            type="number"
                            value={editBonus}
                            onChange={(e) => setEditBonus(Number(e.target.value))}
                            className="w-24"
                          />
                        </TableCell>
                      ) : (
                        <TableCell>{formatCurrency(breakdown.bonus || 0)}</TableCell>
                      )}

                      <TableCell className="font-bold">{formatCurrency(total)}</TableCell>

                      {/* Nút thao tác */}
                      <TableCell>
                        {editingId === employee.id ? (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => saveEdit(employee.id)}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => startEdit(employee.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Thống kê lương */}
      <Card>
        <CardHeader>
          <CardTitle>Thống Kê Lương</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tổng quỹ lương */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Tổng Quỹ Lương</div>
              <div className="text-2xl font-bold">
                {formatCurrency(filteredEmployees.reduce((sum, emp) => sum + calculateSalary(emp.id).total, 0))}
              </div>
            </div>
            {/* Lương trung bình */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Lương Trung Bình</div>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  filteredEmployees.length > 0
                    ? filteredEmployees.reduce((sum, emp) => sum + calculateSalary(emp.id).total, 0) /
                        filteredEmployees.length
                    : 0,
                )}
              </div>
            </div>
            {/* Tổng giờ làm việc */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Tổng Giờ Làm Việc</div>
              <div className="text-2xl font-bold">
                {filteredEmployees.reduce((sum, emp) => {
                  const { regularHours, overtimeHours } = getWorkHours(emp.id)
                  return sum + regularHours + overtimeHours
                }, 0)}{" "}
                giờ
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
