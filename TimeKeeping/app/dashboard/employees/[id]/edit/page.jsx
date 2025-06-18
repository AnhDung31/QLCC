/**
 * Trang chỉnh sửa thông tin nhân viên
 * Cho phép cập nhật thông tin cá nhân và lương của nhân viên
 */
"use client"
import { use } from 'react';
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEmployees } from "@/hooks/use-employees"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const initialFormState = {
  employeeId: "",
  fullName: "",
  email: "",
  phone: "",
  department: "",
  position: "",
  shift: "",
  status: "active"
}

export default function EditEmployeePage({ params }) {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const { positions, departments, getEmployeeById, updateEmployee } = useEmployees()
  const [formData, setFormData] = useState(initialFormState)
  const [isLoading, setIsLoading] = useState(false)
  const [employee, setEmployee] = useState(null)
  const { id: employeeId } = use(params); 
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getEmployeeById(employeeId)
        console.log("Data: ", data)
        setEmployee(data)
        setFormData({
          employeeId: data?.employeeId || "",
          fullName: data?.fullName || "",
          deviceId: data?.deviceId || "",
          email: data?.email || "",
          phone: data?.phone || "",
          department: data?.department?._id || "",
          position: data?.position?._id || "",
          shift: data?.shift || "",
          status: data?.status || "active",
          imageAvatar: data?.imageAvatar || "/placeholder.svg?height=128&width=128"
        })
        setProfileImage(data?.imageAvatar || "/placeholder.svg?height=128&width=128")
      } catch (error) {
        console.error("Error fetching employee:", error)
        toast.error("Không thể tải thông tin nhân viên")
        router.push("/dashboard/employees")
      }
    }

    if (employeeId) {
      fetchEmployee()
    }
  }, [])
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result; // chuỗi base64
        console.log('base64String :>> ', base64String);
        setProfileImage(base64String); // set vào form
        setFormData(prev => ({
          ...prev,
          imageAvatar: base64String
        }))
        setIsUploading(false);
      };

      reader.readAsDataURL(file); // chuyển file thành base64
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateEmployee(employeeId, formData)
      toast.success("Cập nhật thông tin nhân viên thành công")
      router.push("/dashboard/management")
    } catch (error) {
      console.error("Error updating employee:", error)
      toast.error("Không thể cập nhật thông tin nhân viên")
    } finally {
      setIsLoading(false)
    }
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Đang tải thông tin nhân viên...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Chỉnh Sửa Thông Tin Nhân Viên</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Mã Nhân Viên</Label>
              <Input
                id="employeeId"
                name="employeeId"
                value={formData?.employeeId}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và Tên</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData?.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData?.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số Điện Thoại</Label>
              <Input
                id="phone"
                name="phone"
                value={formData?.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Phòng Ban</Label>
              <Select
                value={formData?.department}
                onValueChange={(value) => handleSelectChange("department", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Vị Trí</Label>
              <Select
                value={formData?.position}
                onValueChange={(value) => handleSelectChange("position", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vị trí" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                      <SelectItem key={pos._id} value={pos._id}>
                        {pos.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shift">Ca Làm</Label>
              <Select
                value={formData?.shift}
                onValueChange={(value) => handleSelectChange("shift", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ca làm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ca sáng">Ca Sáng</SelectItem>
                  <SelectItem value="Ca chiều">Ca Chiều</SelectItem>
                  <SelectItem value="Cả ngày">Cả Ngày</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng Thái</Label>
              <Select
                value={formData?.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang làm việc</SelectItem>
                  <SelectItem value="inactive">Nghỉ việc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Ảnh Đại Diện</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                {/* Hiển thị ảnh hiện tại */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium mb-2">Ảnh Đại Diện</h3>
                  <Avatar className="h-32 w-32 mx-auto">
                    <AvatarImage src={profileImage || "/placeholder.svg?height=128&width=128"} alt="Ảnh đại diện" />
                    <AvatarFallback>NV</AvatarFallback>
                  </Avatar>
                </div>

                {/* Form tải lên ảnh mới */}
                <div className="w-full max-w-md">
                  <Label htmlFor="profile-picture" className="block mb-2">
                    Tải lên ảnh
                  </Label>
                  <Label htmlFor="profile-picture" className="cursor-pointer">
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                      <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Nhấp để chọn ảnh hoặc kéo thả vào đây</p>
                      {isUploading && <p className="text-sm text-blue-500 mt-2">Đang tải lên...</p>}
                    </div>
                    <Input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </Label>
                </div>
              </div>
            </CardContent>
        </Card>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.replace("/dashboard/management")}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
