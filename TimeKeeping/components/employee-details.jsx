/**
 * Component hiển thị thông tin chi tiết của một nhân viên
 * Bao gồm thông tin cá nhân, ảnh đại diện, thông tin liên hệ, ca làm việc...
 */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Calendar, Building, Briefcase, Upload, Clock, Edit } from "lucide-react"
import { useEmployees, SHIFTS } from "@/hooks/use-employees"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/**
 * Component hiển thị thông tin chi tiết nhân viên
 * @param {Object} props - Props của component
 * @param {Object} props.employee - Thông tin nhân viên
 */
export function EmployeeDetails({ employee }) {
  console.log("Employee: ", employee)
  const { updateEmployee } = useEmployees()
  const [profileImage, setProfileImage] = useState(null) // Ảnh đại diện mới
  const [isUploading, setIsUploading] = useState(false) // Trạng thái đang tải lên

  /**
   * Xử lý sự kiện tải lên ảnh đại diện mới
   * @param {Event} e - Sự kiện thay đổi input file
   */
const handleImageUpload = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    setIsUploading(true);

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result; // đây là base64 dạng: data:image/jpeg;base64,...

      setProfileImage(base64String); // Cập nhật ảnh hiển thị

      // Gửi base64 để lưu vào database
      updateEmployee(employee?.employeeId, { imageAvatar: base64String });

      setIsUploading(false);
    };

    reader.readAsDataURL(file); // convert sang base64
  }
};

  /**
   * Lấy tên ca làm việc
   * @param {string} shiftKey - Mã ca làm việc
   * @returns {string} Tên ca làm việc
   */
  const getShiftName = (shiftKey) => {
    if (!shiftKey) return "Chưa có ca làm"

    switch (shiftKey) {
      case "Ca sáng":
        return SHIFTS.morning.name
      case "Ca chiều":
        return SHIFTS.afternoon.name
      case "Cả ngày":
        return SHIFTS.fullday.name
      default:
        return "Chưa có ca làm"
    }
  }

  /**
   * Lấy thời gian ca làm việc
   * @param {string} shiftKey - Mã ca làm việc
   * @returns {string} Thời gian ca làm việc
   */
  const getShiftTime = (shiftKey) => {
    if (!shiftKey) return ""

    switch (shiftKey) {
      case "Ca sáng":
        return `${SHIFTS.morning.startTime} - ${SHIFTS.morning.endTime}`
      case "Ca chiều":
        return `${SHIFTS.afternoon.startTime} - ${SHIFTS.afternoon.endTime}`
      case "Cả ngày":
        return `${SHIFTS.fullday.startTime} - ${SHIFTS.fullday.endTime}`
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Thông Tin Nhân Viên</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phần ảnh đại diện và thông tin cơ bản */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={profileImage || employee?.imageAvatar || "/placeholder.svg?height=128&width=128"}
                alt={employee?.fullName || "Nhân viên mới"}
              />
              <AvatarFallback>{employee?.fullName || "NV"}</AvatarFallback>
            </Avatar>
            {/* Nút chỉnh sửa ảnh đại diện */}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" className="absolute bottom-0 right-0 rounded-full" variant="secondary">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
                  <DialogDescription>Tải lên ảnh đại diện mới cho nhân viên</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Label htmlFor="picture" className="cursor-pointer">
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                      <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Nhấp để chọn ảnh hoặc kéo thả vào đây</p>
                    </div>
                    <Input id="picture" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </Label>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? "Đang tải lên..." : "Lưu thay đổi"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold">{employee?.fullName || "Nhân viên mới"}</h3>
            <p className="text-muted-foreground">{employee?.position?.name || "Chưa có vị trí"}</p>
          </div>
          <Badge>{employee?.department?.name || "Chưa có phòng ban"}</Badge>
        </div>

        {/* Phần thông tin liên hệ và công việc */}
        <div className="space-y-3">
          {employee?.email && (
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{employee?.email}</span>
            </div>
          )}
          {employee?.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{employee?.phone}</span>
            </div>
          )}
          {employee?.joinDate && (
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Ngày vào làm: {employee?.joinDate}</span>
            </div>
          )}
          {employee?.department && (
            <div className="flex items-center space-x-3">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{employee?.department.name}</span>
            </div>
          )}
          {employee?.position && (
            <div className="flex items-center space-x-3">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>{employee?.position.name}</span>
            </div>
          )}
          {employee?.shift && (
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <span>{getShiftName(employee?.shift)}</span>
                <p className="text-xs text-muted-foreground">{getShiftTime(employee?.shift)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Phần thông tin đăng ký khuôn mặt */}
        <div className="space-y-2">
          <h4 className="font-medium">Đăng Ký Khuôn Mặt</h4>
          <div className="flex items-center space-x-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Đã đăng ký vào: {employee?.faceRegistrationTime || "Chưa đăng ký"}</span>
          </div>
          <div className="mt-2 border rounded-md overflow-hidden">
            <img
              src={employee?.faceImage || "/placeholder.svg?height=200&width=200"}
              alt="Khuôn mặt đăng ký"
              className="w-full h-auto"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
