/**
 * Component bảng check-in gần đây
 * Hiển thị thông tin check-in gần đây của nhân viên
 */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEmployees } from "@/hooks/use-employees"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import socket from "@/lib/socket"
import api from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export function RealtimeCheckinTable() {
  const {departments, employees } = useEmployees()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [recentCheckins, setRecentCheckins] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Lấy danh sách phòng ban duy nhất từ dữ liệu nhân viên

  // Fetch dữ liệu check-in khi component mount
  useEffect(() => {
    const formatTime = (time) => {
      const hours = time.getHours().toString().padStart(2, '0')
      const minutes = time.getMinutes().toString().padStart(2, '0')
      const formattedTime = `${hours}:${minutes}`
      return formattedTime
    }

    const fetchTodayCheckins = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/checkins/today')

        if (response.data.success && Array.isArray(response.data.data)) {
          const formattedCheckins = response.data.data.map(checkin => {
            if (!checkin || typeof checkin !== 'object') return null

            const checkinTime = new Date(checkin.checkIn)
            if (isNaN(checkinTime.getTime())) {
              console.error('Invalid date:', checkin.checkIn)
              return null
            }

            return {
              id: String(checkin.employeeId || ''),
              name: String(checkin.fullName || "Nhân viên mới"),
              department: String(checkin.department || "Chưa có bộ phân"),
              position: String(checkin.position || "Chưa có vị trí"),
              faceImage: String(checkin.faceImage || "/placeholder.svg"),
              checkinTime: checkinTime,
              formattedTime: formatTime(checkinTime),
            }
          }).filter(Boolean)

          setRecentCheckins(formattedCheckins)
        }
      } catch (error) {
        console.error('Error fetching today checkins:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodayCheckins()
  }, [])

  // Xử lý sự kiện check-in realtime
  useEffect(() => {
    const handleCheckin = (data) => {
      if (!data || typeof data !== 'object') return

      try {
        // // Kiểm tra quyền thiết bị nếu là admin thường
        console.log(user)
        if (user?.role === 'admin' && !user?.devices?.includes(data.deviceId)) {
          console.warn(`Thiết bị ${data.deviceId} không thuộc quyền quản lý của admin này`)
          return
        }

        const checkinTime = data.checkinTime ? new Date(data.checkinTime) : 
                          data.timestamp ? new Date(data.timestamp) : 
                          new Date()

        if (isNaN(checkinTime.getTime())) {
          console.error('Invalid date:', data.checkinTime || data.timestamp)
          return
        }

        const vnTimestamp = data.timestamp ? new Date(data.timestamp).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : "";

        const newCheckin = {
          id: String(data.employeeId || ''),
          name: String(data.fullName || "Nhân viên mới"),
          department: String(data.department || "Chưa có bộ phân"),
          position: String(data.position || "Chưa có vị trí"),
          faceImage: String(data.faceImage || "/placeholder.svg"),
          checkinTime: checkinTime,
          formattedTime: checkinTime.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
          })
        }

        setRecentCheckins((prev) => [newCheckin, ...prev.slice(0, 19)])
      } catch (error) {
        console.error('Error processing checkin data:', error)
      }
    }

    socket.on("checkin", handleCheckin)

    return () => {
      socket.off("checkin", handleCheckin)
    }
  }, [])

  // Lọc check-in theo tìm kiếm và phòng ban
  const filteredCheckins = recentCheckins.filter((checkin) => {
    if (!checkin || typeof checkin !== 'object') return false

    const searchTermLower = String(searchTerm).toLowerCase()
    const nameLower = String(checkin.name || '').toLowerCase()
    const idStr = String(checkin.id || '')
    
    const matchesSearch = nameLower.includes(searchTermLower) || 
                         idStr.includes(searchTermLower)
    const matchesDepartment = departmentFilter === "all" || 
                             String(checkin.department) === String(departmentFilter)
    
    return matchesSearch && matchesDepartment
  })

  // Format thời gian tương đối
  const getRelativeTime = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "Không xác định"
    }
    
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} giây trước`
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    return `${diffInHours} giờ trước`
  }

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
                <SelectItem key={String(dept._id )} value={String(dept.name)}>
                  {String(dept.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bảng check-in gần đây */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Check-in Gần Đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nhân Viên</TableHead>
                  <TableHead>Bộ Phận</TableHead>
                  <TableHead>Vị Trí</TableHead>
                  <TableHead>Khuôn Mặt</TableHead>
                  <TableHead>Giờ Check-in</TableHead>
                  <TableHead>Thời Gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : !filteredCheckins || filteredCheckins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Không có dữ liệu check-in nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCheckins.map((checkin, index) => {
                    if (!checkin || typeof checkin !== 'object') return null
                    
                    return (
                      <TableRow key={`${String(checkin.id)}-${index}`}>
                        <TableCell>{String(checkin.id || '')}</TableCell>
                        <TableCell className="font-medium">{String(checkin.name || '')}</TableCell>
                        <TableCell>{String(checkin.department || '')}</TableCell>
                        <TableCell>{String(checkin.position || '')}</TableCell>
                        <TableCell>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={String(checkin.faceImage || '/placeholder.svg')} alt="Khuôn mặt check-in" />
                            <AvatarFallback>KM</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>{String(checkin.formattedTime || '')}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            {getRelativeTime(checkin.checkinTime)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
