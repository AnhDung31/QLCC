/**
 * Trang thêm nhân viên mới
 * Cho phép tạo nhân viên mới với thông tin cơ bản
 */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"
import { useEmployees, SHIFTS } from "@/hooks/use-employees"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function NewEmployeePage() {
  const router = useRouter()
  const {  departments, positions, addDepartment, addPosition, addEmployee } = useEmployees()

  // State cho form
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    joinDate: "",
    shift: "fullday",
  })

  // State cho ảnh đại diện
  const [profileImage, setProfileImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // State cho thông báo
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // State cho phòng ban và vị trí mới
  const [newDepartment, setNewDepartment] = useState("")
  const [newPosition, setNewPosition] = useState("")
  const [showNewDepartmentInput, setShowNewDepartmentInput] = useState(false)
  const [showNewPositionInput, setShowNewPositionInput] = useState(false)

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Xử lý thay đổi select
  const handleSelectChange = (name, value) => {
    if (name === "department" && value === "add_new") {
      setShowNewDepartmentInput(true)
      return
    }

    if (name === "position" && value === "add_new") {
      setShowNewPositionInput(true)
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Xử lý thêm phòng ban mới
  const handleAddDepartment = () => {
    if (newDepartment.trim()) {
      addDepartment(newDepartment.trim())
      setFormData((prev) => ({ ...prev, department: newDepartment.trim() }))
      setNewDepartment("")
      setShowNewDepartmentInput(false)
    }
  }

  // Xử lý thêm vị trí mới
  const handleAddPosition = () => {
    if (newPosition.trim()) {
      addPosition(newPosition.trim())
      setFormData((prev) => ({ ...prev, position: newPosition.trim() }))
      setNewPosition("")
      setShowNewPositionInput(false)
    }
  }

  // Xử lý tải lên ảnh đại diện mới
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result; // chuỗi base64
        console.log('base64String :>> ', base64String);
        setProfileImage(base64String); // set vào form
        setIsUploading(false);
      };

      reader.readAsDataURL(file); // chuyển file thành base64
    }
  };
  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    console.log(formData);
    
    try {
      // Chuẩn bị dữ liệu nhân viên mới
      const newEmployee = {
        employeeId: formData.employeeId || `NV${Date.now()}`,
        fullName: formData.name,
        deviceId: formData.deviceId,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        joinDate: formData.joinDate,
        status: "active",
        shift: formData.shift,
        imageAvatar: profileImage || "/placeholder.svg?height=200&width=200",
        faceImage: profileImage || "/placeholder.svg?height=200&width=200",
        faceRegistrationTime: new Date().toISOString(),
        salary: {
          baseSalary: 0,
          hourlyRate: 0,
          overtimeRate: 0,
          bonus: 0
        }
      }

      // Gọi API thêm nhân viên mới
      await addEmployee(newEmployee)

      // Chuyển hướng đến trang quản lý nhân viên
      router.push("/dashboard/management")
    } catch (err) {
      console.error("Error creating employee:", err)
      setError("Có lỗi xảy ra khi tạo nhân viên mới")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/management">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Thêm Nhân Viên Mới</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">Thông Tin Cơ Bản</TabsTrigger>
            <TabsTrigger value="image">Ảnh Đại Diện</TabsTrigger>
          </TabsList>

          {/* Tab thông tin cơ bản */}
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Cá Nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Trường họ tên */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và Tên</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>

                  {/* Trường email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      placeholder="Nhập địa chỉ email"
                    />
                  </div>

                  {/* Trường số điện thoại */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số Điện Thoại</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  {/* Trường ngày vào làm */}
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Ngày Vào Làm</Label>
                    <Input
                      id="joinDate"
                      name="joinDate"
                      value={formData.joinDate || ""}
                      onChange={handleInputChange}
                      placeholder="DD/MM/YYYY"
                    />
                  </div>

                  {/* Trường ca làm việc */}
                  <div className="space-y-2">
                    <Label htmlFor="shift">Ca Làm Việc</Label>
                    <Select
                      value={formData.shift || "fullday"}
                      onValueChange={(value) => handleSelectChange("shift", value)}
                    >
                      <SelectTrigger id="shift">
                        <SelectValue placeholder="Chọn ca làm việc" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ca sáng">
                          {SHIFTS.morning.name} ({SHIFTS.morning.startTime} - {SHIFTS.morning.endTime})
                        </SelectItem>
                        <SelectItem value="Ca chiều">
                          {SHIFTS.afternoon.name} ({SHIFTS.afternoon.startTime} - {SHIFTS.afternoon.endTime})
                        </SelectItem>
                        <SelectItem value="Cả ngày">  
                          {SHIFTS.fullday.name} ({SHIFTS.fullday.startTime} - {SHIFTS.fullday.endTime})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {/* Trường phòng ban */}
                  <div className="space-y-2">
                    <Label>Phòng Ban</Label>
                    {showNewDepartmentInput ? (
                      <div className="flex gap-2">
                        <Input
                          value={newDepartment}
                          onChange={(e) => setNewDepartment(e.target.value)}
                          placeholder="Nhập tên phòng ban mới"
                        />
                        <Button type="button" onClick={handleAddDepartment}>
                          Thêm
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowNewDepartmentInput(false)}>
                          Hủy
                        </Button>
                      </div>
                    ) : (
                      <Select
                        value={formData.department || ""}
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
                          <SelectItem value="add_new">+ Thêm phòng ban mới</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Trường vị trí */}
                  <div className="space-y-2">
                    <Label>Vị Trí</Label>
                    {showNewPositionInput ? (
                      <div className="flex gap-2">
                        <Input
                          value={newPosition}
                          onChange={(e) => setNewPosition(e.target.value)}
                          placeholder="Nhập tên vị trí mới"
                        />
                        <Button type="button" onClick={handleAddPosition}>
                          Thêm
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowNewPositionInput(false)}>
                          Hủy
                        </Button>
                      </div>
                    ) : (
                      <Select
                        value={formData.position || ""}
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
                          <SelectItem value="add_new">+ Thêm vị trí mới</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab ảnh đại diện */}
          <TabsContent value="image">
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
          </TabsContent>
        </Tabs>

        {/* Thông báo lỗi */}
        {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        {/* Nút lưu thay đổi */}
        <div className="mt-6 flex justify-end">
          <Button type="submit" className="w-full md:w-auto" disabled={isLoading || isUploading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Đang tạo..." : "Tạo Nhân Viên"}
          </Button>
        </div>
      </form>
    </div>
  )
}
