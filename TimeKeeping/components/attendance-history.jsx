/**
 * Component hiển thị lịch sử chấm công của một nhân viên
 * Hiển thị dữ liệu theo tháng với các thông tin như giờ vào, giờ ra, số giờ làm việc, tăng ca...
 */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

/**
 * Component hiển thị lịch sử chấm công
 * @param {Object} props - Props của component
 * @param {string} props.employeeId - ID của nhân viên
 * @param {string} props.shift - Ca làm việc
 */
export function AttendanceHistory({ employeeId, shift }) {
  // State để lưu tháng và năm hiện tại đang xem
  const [currentDate, setCurrentDate] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  })
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch dữ liệu chấm công
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `http://localhost:3001/api/checkins/history?employeeId=${employeeId}&shift=${shift}&month=${currentDate.month.toString().padStart(2, "0")}&year=${currentDate.year}`
        )
        const result = await response.json()
        if (result.success) {
          setAttendanceData(result.data)
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAttendanceData()
  }, [employeeId, shift, currentDate.month, currentDate.year])

  /**
   * Format thời gian từ ISO string
   * @param {string} isoString - Thời gian dạng ISO string
   * @returns {string} Thời gian đã format
   */
  const formatTime = (isoString) => {
    if (!isoString) return "-"
    const date = new Date(isoString)
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
  }

  /**
   * Format thời gian đi muộn
   * @param {Object} timeLate - Object chứa giờ và phút đi muộn
   * @returns {string} Thời gian đi muộn đã format
   */
  const formatLateTime = (timeLate) => {
    if (!timeLate || (timeLate.hours === 0 && timeLate.minutes === 0)) return "-"
    return `${timeLate.hours}h ${timeLate.minutes}m`
  }

  /**
   * Format số giờ làm việc
   * @param {number|Object} totalHours - Số giờ làm việc
   * @returns {string} Số giờ đã format
   */
  const formatTotalHours = (totalHours) => {
    if (!totalHours || totalHours === 0) return "-"
    if (typeof totalHours === "object") {
      if (totalHours.hours === null || totalHours.minutes === null) return "-"
      return `${totalHours.hours}h ${totalHours.minutes}m`
    }
    return `${totalHours} giờ`
  }

  /**
   * Hiển thị badge tương ứng với trạng thái chấm công
   * @param {string} status - Trạng thái chấm công
   * @returns {JSX.Element} Badge component
   */
  const getStatusBadge = (status) => {
    switch (status) {
      case "Có mặt":
        return <Badge className="bg-green-500">Có Mặt</Badge>
      case "Đi muộn":
        return <Badge className="bg-yellow-500">Đi Muộn</Badge>
      case "Vắng mặt":
        return <Badge className="bg-red-500">Vắng Mặt</Badge>
      case "Cuối Tuần":
        return <Badge variant="outline">Cuối Tuần</Badge>
      case "Sắp tới":
        return <Badge variant="outline">Sắp Tới</Badge>
      default:
        return <Badge>Không Xác Định</Badge>
    }
  }

  // Xử lý chuyển đến tháng trước
  const handlePreviousMonth = () => {
    setCurrentDate(prev => {
      const newMonth = prev.month === 1 ? 12 : prev.month - 1
      const newYear = prev.month === 1 ? prev.year - 1 : prev.year
      return { month: newMonth, year: newYear }
    })
  }

  // Xử lý chuyển đến tháng sau
  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newMonth = prev.month === 12 ? 1 : prev.month + 1
      const newYear = prev.month === 12 ? prev.year + 1 : prev.year
      return { month: newMonth, year: newYear }
    })
  }

  // Danh sách tên các tháng
  const monthNames = [
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

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Lịch Sử Chấm Công</CardTitle>
          {/* Điều hướng giữa các tháng */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {monthNames[currentDate.month - 1]} {currentDate.year}
            </span>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Giờ Vào</TableHead>
                <TableHead>Giờ Ra</TableHead>
                <TableHead>Số Giờ</TableHead>
                <TableHead>Tăng Ca</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Đi Muộn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(record.date).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>{formatTime(record.checkIn)}</TableCell>
                  <TableCell>{formatTime(record.checkOut)}</TableCell>
                  <TableCell>{formatTotalHours(record.totalHours)}</TableCell>
                  <TableCell>{record.overtime === 0 ? "-" : `${record.overtime} giờ`}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>{formatLateTime(record.timeLate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
