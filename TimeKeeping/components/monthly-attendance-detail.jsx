/**
 * Component hiển thị chi tiết chấm công hàng tháng của một nhân viên
 * Bao gồm thông tin chi tiết từng ngày và thống kê tổng hợp
 */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEmployees } from "@/hooks/use-employees"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExportExcelButton } from "@/components/export-excel-button"

/**
 * Component hiển thị chi tiết chấm công hàng tháng
 * @param {Object} props - Props của component
 * @param {number} props.employeeId - ID của nhân viên
 * @param {Date} props.initialDate - Ngày ban đầu để hiển thị
 */
export function MonthlyAttendanceDetail({ employeeId, initialDate }) {
  // Lấy thông tin nhân viên
  const { getEmployeeById } = useEmployees()

  // State quản lý tháng và năm hiển thị
  const [month, setMonth] = useState(initialDate ? initialDate.getMonth() + 1 : new Date().getMonth() + 1)
  const [year, setYear] = useState(initialDate ? initialDate.getFullYear() : new Date().getFullYear())

  // Lấy thông tin nhân viên
  const employee = getEmployeeById(employeeId)

  /**
   * Tạo dữ liệu mẫu cho lịch sử chấm công
   * @returns {Array} Mảng dữ liệu chấm công
   */
  const generateAttendanceHistory = () => {
    if (!employee) return []

    const daysInMonth = new Date(year, month, 0).getDate()
    const currentDate = new Date()

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      const date = new Date(year, month - 1, day)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const isPast = date <= currentDate

      // Xử lý ngày cuối tuần
      if (isWeekend) {
        return {
          date: `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`,
          checkIn: "-",
          checkOut: "-",
          status: "weekend",
          timeDifference: "-",
          overtimeHours: "0",
          faceImage: null,
          faceTime: "-",
          shift: "-",
        }
      }

      // Xử lý ngày trong tương lai
      if (!isPast) {
        return {
          date: `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`,
          checkIn: "-",
          checkOut: "-",
          status: "upcoming",
          timeDifference: "-",
          overtimeHours: "0",
          faceImage: null,
          faceTime: "-",
          shift: employee?.shift || "fullday",
        }
      }

      // Tạo dữ liệu ngẫu nhiên cho ngày trong quá khứ
      const statuses = ["ontime", "late", "early", "absent"]
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

      // Xử lý trường hợp vắng mặt
      if (randomStatus === "absent") {
        return {
          date: `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`,
          checkIn: "-",
          checkOut: "-",
          status: "absent",
          timeDifference: "-",
          overtimeHours: "0",
          faceImage: null,
          faceTime: "-",
          shift: employee?.shift || "fullday",
        }
      }

      // Tạo giờ check-in ngẫu nhiên dựa trên trạng thái
      let checkInHour
      let timeDifference = ""

      if (randomStatus === "early") {
        checkInHour = 7 + Math.floor(Math.random() * 1)
        timeDifference = `Sớm ${8 - checkInHour} giờ ${Math.floor(Math.random() * 60)} phút`
      } else if (randomStatus === "late") {
        checkInHour = 8 + Math.floor(Math.random() * 2)
        timeDifference = `Muộn ${checkInHour - 8} giờ ${Math.floor(Math.random() * 60)} phút`
      } else {
        checkInHour = 8
        timeDifference = "Đúng giờ"
      }

      const checkInMinute = Math.floor(Math.random() * 60)
      const checkIn = `${checkInHour.toString().padStart(2, "0")}:${checkInMinute.toString().padStart(2, "0")}`

      // Tạo giờ check-out ngẫu nhiên
      const workHours = 8 + Math.floor(Math.random() * 3)
      const checkOutHour = checkInHour + workHours
      const checkOutMinute = Math.floor(Math.random() * 60)
      const checkOut = `${checkOutHour.toString().padStart(2, "0")}:${checkOutMinute.toString().padStart(2, "0")}`

      // Tính giờ tăng ca
      const overtimeHours = Math.max(0, workHours - 8).toFixed(1)

      // Thời gian xác thực khuôn mặt
      const faceTime = `${checkIn}`

      return {
        date: `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`,
        checkIn,
        checkOut,
        status: randomStatus,
        timeDifference,
        overtimeHours,
        faceImage: "/placeholder.svg?height=80&width=80",
        faceTime,
        shift: employee?.shift || "fullday",
      }
    })
  }

  // Lấy dữ liệu chấm công
  const attendanceHistory = generateAttendanceHistory()

  // Tính tổng kết
  const summary = {
    totalDays: attendanceHistory.filter((day) => day.status !== "weekend" && day.status !== "upcoming").length,
    ontimeDays: attendanceHistory.filter((day) => day.status === "ontime").length,
    lateDays: attendanceHistory.filter((day) => day.status === "late").length,
    earlyDays: attendanceHistory.filter((day) => day.status === "early").length,
    absentDays: attendanceHistory.filter((day) => day.status === "absent").length,
    totalWorkHours: attendanceHistory
      .reduce((sum, day) => {
        if (day.checkIn !== "-" && day.checkOut !== "-") {
          const checkInTime = day.checkIn.split(":")
          const checkOutTime = day.checkOut.split(":")
          const checkInHour = Number.parseInt(checkInTime[0])
          const checkOutHour = Number.parseInt(checkOutTime[0])
          const checkInMinute = Number.parseInt(checkInTime[1])
          const checkOutMinute = Number.parseInt(checkOutTime[1])

          const hours = checkOutHour - checkInHour
          const minutes = checkOutMinute - checkInMinute

          return sum + hours + minutes / 60
        }
        return sum
      }, 0)
      .toFixed(1),
    totalOTHours: attendanceHistory
      .reduce((sum, day) => {
        if (day.overtimeHours !== "0" && day.overtimeHours !== "-") {
          return sum + Number.parseFloat(day.overtimeHours)
        }
        return sum
      }, 0)
      .toFixed(1),
  }

  /**
   * Hiển thị badge tương ứng với trạng thái chấm công
   * @param {string} status - Trạng thái chấm công
   * @returns {JSX.Element} Badge component
   */
  const getStatusBadge = (status) => {
    switch (status) {
      case "ontime":
        return <Badge className="bg-green-500">Đúng Giờ</Badge>
      case "late":
        return <Badge className="bg-yellow-500">Đi Muộn</Badge>
      case "early":
        return <Badge className="bg-blue-500">Đi Sớm</Badge>
      case "absent":
        return <Badge className="bg-red-500">Vắng Mặt</Badge>
      case "weekend":
        return <Badge variant="outline">Cuối Tuần</Badge>
      case "upcoming":
        return <Badge variant="outline">Sắp Tới</Badge>
      default:
        return <Badge>Không Xác Định</Badge>
    }
  }

  /**
   * Hiển thị badge tương ứng với ca làm việc
   * @param {string} shift - Loại ca làm việc
   * @returns {JSX.Element|string} Badge component hoặc chuỗi "-"
   */
  const getShiftBadge = (shift) => {
    if (!shift || shift === "-") return "-"

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
        return "-"
    }
  }

  /**
   * Chuẩn bị dữ liệu để xuất Excel
   * @returns {Array} Dữ liệu đã được chuẩn bị để xuất Excel
   */
  const prepareExcelData = () => {
    return attendanceHistory.map((record) => {
      // Chuyển đổi các badge thành text để xuất ra Excel
      const getShiftText = (shift) => {
        if (!shift || shift === "-") return "-"
        switch (shift) {
          case "morning":
            return "Ca Sáng"
          case "afternoon":
            return "Ca Chiều"
          case "fullday":
            return "Cả Ngày"
          default:
            return "-"
        }
      }

      const getStatusText = (status) => {
        switch (status) {
          case "ontime":
            return "Đúng Giờ"
          case "late":
            return "Đi Muộn"
          case "early":
            return "Đi Sớm"
          case "absent":
            return "Vắng Mặt"
          case "weekend":
            return "Cuối Tuần"
          case "upcoming":
            return "Sắp Tới"
          default:
            return "Không Xác Định"
        }
      }

      return {
        Ngày: record.date,
        "Ca Làm": getShiftText(record.shift),
        "Giờ Check-in": record.checkIn,
        "Giờ Check-out": record.checkOut,
        "Trạng Thái": getStatusText(record.status),
        "Sớm/Muộn": record.timeDifference,
        "OT (giờ)": record.overtimeHours,
        "Thời Gian Xác Thực": record.faceTime,
        // Thêm thuộc tính ẩn để kiểm tra trạng thái
        _status: record.status,
      }
    })
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
    <div className="space-y-4">
      {/* Phần điều khiển tháng/năm và nút xuất Excel */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {/* Bộ chọn tháng */}
          <Select value={month.toString()} onValueChange={(value) => setMonth(Number(value))}>
            <SelectTrigger className="w-36">
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
          {/* Bộ chọn năm */}
          <Select value={year.toString()} onValueChange={(value) => setYear(Number(value))}>
            <SelectTrigger className="w-32">
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
        {/* Nút xuất Excel */}
        <ExportExcelButton
          data={prepareExcelData()}
          filename={`Cham-Cong-${employee?.name || "Nhan-Vien"}-${month}-${year}`}
          sheetName="Chi Tiết Chấm Công"
          buttonText="Xuất Excel"
          highlightCondition={(row) => row._status === "late"}
          highlightColor="FFCDD2" // Màu đỏ nhạt
        />
      </div>

      {/* Tabs chi tiết và tổng kết */}
      <Tabs defaultValue="detail">
        <TabsList>
          <TabsTrigger value="detail">Chi Tiết Chấm Công</TabsTrigger>
          <TabsTrigger value="summary">Tổng Kết</TabsTrigger>
        </TabsList>

        {/* Tab chi tiết chấm công */}
        <TabsContent value="detail">
          <Card>
            <CardHeader>
              <CardTitle>
                Chi Tiết Chấm Công - {months[month - 1]} {year}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Ca Làm</TableHead>
                      <TableHead>Giờ Check-in</TableHead>
                      <TableHead>Giờ Check-out</TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead>Sớm/Muộn</TableHead>
                      <TableHead>OT</TableHead>
                      <TableHead>Khuôn Mặt</TableHead>
                      <TableHead>Thời Gian Xác Thực</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Hiển thị dữ liệu chấm công */}
                    {attendanceHistory.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{getShiftBadge(record.shift)}</TableCell>
                        <TableCell>{record.checkIn}</TableCell>
                        <TableCell>{record.checkOut}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>{record.timeDifference}</TableCell>
                        <TableCell>{record.overtimeHours} giờ</TableCell>
                        <TableCell>
                          {record.faceImage ? (
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={record.faceImage || "/placeholder.svg"} alt="Khuôn mặt xác thực" />
                              <AvatarFallback>KM</AvatarFallback>
                            </Avatar>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{record.faceTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab tổng kết */}
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>
                Tổng Kết Chấm Công - {months[month - 1]} {year}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard title="Số Ngày Đi Đúng Giờ" value={summary.ontimeDays} />
                <SummaryCard title="Số Ngày Đi Muộn" value={summary.lateDays} />
                <SummaryCard title="Số Ngày Đi Sớm" value={summary.earlyDays} />
                <SummaryCard title="Số Ngày Vắng Mặt" value={summary.absentDays} />
                <SummaryCard title="Tổng Số Giờ Làm" value={`${summary.totalWorkHours} giờ`} />
                <SummaryCard title="Tổng Số Giờ OT" value={`${summary.totalOTHours} giờ`} />
                <SummaryCard
                  title="Tỷ Lệ Đi Làm"
                  value={`${Math.round(
                    ((summary.ontimeDays + summary.lateDays + summary.earlyDays) / summary.totalDays) * 100,
                  )}%`}
                />
                <SummaryCard
                  title="Tỷ Lệ Đúng Giờ"
                  value={`${Math.round(
                    (summary.ontimeDays / (summary.ontimeDays + summary.lateDays + summary.earlyDays)) * 100,
                  )}%`}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * Component hiển thị một thẻ thống kê
 * @param {Object} props - Props của component
 * @param {string} props.title - Tiêu đề thống kê
 * @param {string|number} props.value - Giá trị thống kê
 */
function SummaryCard({ title, value }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
