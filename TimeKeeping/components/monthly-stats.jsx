/**
 * Component hiển thị thống kê hàng tháng cho một nhân viên
 * Bao gồm các thông tin như số ngày làm việc, tổng số giờ, tăng ca, ngày đi muộn...
 */
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"

/**
 * Component hiển thị thống kê hàng tháng
 * @param {Object} props - Props của component
 * @param {number} props.employeeId - ID của nhân viên
 */
export function MonthlyStats({ employeeId }) {
  const [currentMonthStats, setCurrentMonthStats] = useState(null)
  const [previousMonthStats, setPreviousMonthStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMonthlyStats = async () => {
      try {
        // Get current date
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth() + 1

        // Calculate previous month
        let prevYear = currentYear
        let prevMonth = currentMonth - 1
        if (prevMonth === 0) {
          prevMonth = 12
          prevYear -= 1
        }

        // Fetch current month stats
        const currentResponse = await fetch(
          `http://localhost:3001/api/employees/${employeeId}/monthly-statistics?year=${currentYear}&month=${currentMonth}`
        )
        const currentData = await currentResponse.json()

        // Fetch previous month stats
        const prevResponse = await fetch(
          `http://localhost:3001/api/employees/${employeeId}/monthly-statistics?year=${prevYear}&month=${prevMonth}`
        )
        const prevData = await prevResponse.json()

        console.log(currentData.data.statistics)
        console.log(prevData.data.statistics)
        if (currentData.status === 200 && prevData.status === 200) {
          setCurrentMonthStats(currentData.data.statistics)
          setPreviousMonthStats(prevData.data.statistics)
        }
      } catch (error) {
        console.error("Error fetching monthly statistics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMonthlyStats()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  const formatTime = (timeObj) => {
    console.log(timeObj)
    if (!timeObj || timeObj.hours === null || timeObj.minutes === null) return "-"
    return `${timeObj.hours.toString().padStart(2, "0")}:${timeObj.minutes.toString().padStart(2, "0")}`
  }

  return (
    <Tabs defaultValue="current">
      <div className="flex items-center justify-between">
        <CardTitle>Thống Kê Hàng Tháng</CardTitle>
        <TabsList>
          <TabsTrigger value="current">Tháng Hiện Tại</TabsTrigger>
          <TabsTrigger value="previous">Tháng Trước</TabsTrigger>
        </TabsList>
      </div>

      {/* Nội dung thống kê tháng hiện tại */}
      <TabsContent value="current">
        {currentMonthStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <StatCard title="Ngày Làm Việc" value={`${currentMonthStats.workingDays} ngày`} />
            <StatCard title="Tổng Số Giờ" value={`${currentMonthStats.totalWorkingHours} giờ`} />
            <StatCard title="Tăng Ca" value={`${currentMonthStats.overtimeHours} giờ`} />
            <StatCard title="Ngày Đi Muộn" value={`${currentMonthStats.lateDays} ngày`} />
            <StatCard title="Ngày Vắng Mặt" value={`${currentMonthStats.absentDays} ngày`} />
            <StatCard title="Giờ Vào TB" value={formatTime(currentMonthStats.averageCheckinTime)} />
            <StatCard title="Giờ Ra TB" value={formatTime(currentMonthStats.averageCheckoutTime)} />
            <StatCard
              title="Tỷ Lệ Chuyên Cần"
              value={`${Math.round(currentMonthStats.attendanceRate * 100)}%`}
            />
          </div>
        )}
      </TabsContent>

      {/* Nội dung thống kê tháng trước */}
      <TabsContent value="previous">
        {previousMonthStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <StatCard title="Ngày Làm Việc" value={`${previousMonthStats.workingDays} ngày`} />
            <StatCard title="Tổng Số Giờ" value={`${previousMonthStats.totalWorkingHours} giờ`} />
            <StatCard title="Tăng Ca" value={`${previousMonthStats.overtimeHours} giờ`} />
            <StatCard title="Ngày Đi Muộn" value={`${previousMonthStats.lateDays} ngày`} />
            <StatCard title="Ngày Vắng Mặt" value={`${previousMonthStats.absentDays} ngày`} />
            <StatCard title="Giờ Vào TB" value={formatTime(previousMonthStats.averageCheckinTime)} />
            <StatCard title="Giờ Ra TB" value={formatTime(previousMonthStats.averageCheckoutTime)} />
            <StatCard
              title="Tỷ Lệ Chuyên Cần"
              value={`${Math.round(previousMonthStats.attendanceRate * 100)}%`}
            />
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

/**
 * Component hiển thị một thẻ thống kê
 * @param {Object} props - Props của component
 * @param {string} props.title - Tiêu đề thống kê
 * @param {string|number} props.value - Giá trị thống kê
 */
function StatCard({ title, value }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
