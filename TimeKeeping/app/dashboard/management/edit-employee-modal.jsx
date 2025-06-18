/**
 * Component modal chỉnh sửa thông tin nhân viên
 * Cho phép chỉnh sửa thông tin cơ bản của nhân viên ngay trong trang quản lý
 */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEmployees, SHIFTS } from "@/hooks/use-employees"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Upload } from "lucide-react"

export function EditEmployeeModal({ isOpen, onClose, employeeId }) {
  const { getEmployeeById, updateEmployee, departments, positions } = useEmployees()

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
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  // State cho phòng ban và vị trí mới
  const [newDepartment, setNewDepartment] = useState("")
  const [newPosition, setNewPosition] = useState("")
  const [showNewDepartmentInput, setShowNewDepartmentInput] = useState(false)
  const [showNewPositionInput, setShowNewPositionInput] = useState(false)

  // Lấy thông tin nhân viên khi component được tải hoặc employeeId thay đổi
  useEffect(() => {
    console.log("Set data continue: ", employeeId, isOpen)
    if (employeeId && isOpen) {
      const employee = getEmployeeById(employeeId)
      if (employee) {
        setFormData({
          name: employee.name || "",
          position: employee.position || "",
          department: employee.department || "",
          email: employee.email || "",
          phone: employee.phone || "",
          joinDate: employee.joinDate || "",
          shift: employee.shift || "fullday",
        })
        setProfileImage(null) // Reset ảnh đại diện mới
        setError(null) // Reset lỗi
        setSuccess(false) // Reset thông báo thành công
      }
    }
  }, [])

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
      // Thêm phòng ban mới vào danh sách
      const updatedDepartments = [...departments, newDepartment.trim()]
      // Cập nhật form data
      setFormData((prev) => ({ ...prev, department: newDepartment.trim() }))
      setNewDepartment("")
      setShowNewDepartmentInput(false)
    }
  }

  // Xử lý thêm vị trí mới
  const handleAddPosition = () => {
    if (newPosition.trim()) {
      // Thêm vị trí mới vào danh sách
      const updatedPositions = [...positions, newPosition.trim()]
      // Cập nhật form data
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
  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Chuẩn bị dữ liệu cập nhật
      const updatedData = { ...formData }

      // Nếu có ảnh mới, cập nhật ảnh
      if (profileImage) {
        updatedData.image = profileImage
      }

      // Cập nhật thông tin nhân viên
      updateEmployee(employeeId, updatedData)

      // Hiển thị thông báo thành công
      setSuccess(true)

      // Đóng modal sau 1.5 giây
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      console.error("Error updating employee:", err)
      setError("Có lỗi xảy ra khi cập nhật thông tin nhân viên")
    } finally {
      setIsLoading(false)
    }
  }

  // Lấy thông tin nhân viên hiện tại
  const employee = employeeId ? getEmployeeById(employeeId) : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Thông Tin Nhân Viên</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cơ bản của nhân viên. Các thay đổi sẽ được lưu ngay lập tức.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Thông Tin Cơ Bản</TabsTrigger>
            <TabsTrigger value="image">Ảnh Đại Diện</TabsTrigger>
          </TabsList>

          {/* Tab thông tin cơ bản */}
          <TabsContent value="info" className="space-y-4 py-4">
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
                    <SelectItem value="morning">
                      {SHIFTS.morning.name} ({SHIFTS.morning.startTime} - {SHIFTS.morning.endTime})
                    </SelectItem>
                    <SelectItem value="afternoon">
                      {SHIFTS.afternoon.name} ({SHIFTS.afternoon.startTime} - {SHIFTS.afternoon.endTime})
                    </SelectItem>
                    <SelectItem value="fullday">
                      {SHIFTS.fullday.name} ({SHIFTS.fullday.startTime} - {SHIFTS.fullday.endTime})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Trường phòng ban */}
              <div className="space-y-2">
                <Label htmlFor="department">Phòng Ban</Label>
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
                <Label htmlFor="position">Vị Trí</Label>
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
          </TabsContent>

          {/* Tab ảnh đại diện */}
          <TabsContent value="image" className="space-y-4 py-4">
            <div className="flex flex-col items-center space-y-4">
              {/* Hiển thị ảnh hiện tại */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium mb-2">Ảnh Hiện Tại</h3>
                <Avatar className="h-32 w-32 mx-auto">
                  <AvatarImage
                    src={profileImage || employee?.image || "/placeholder.svg?height=128&width=128"}
                    alt={employee?.name || "Nhân viên"}
                  />
                  <AvatarFallback>{employee?.name ? employee.name.substring(0, 2).toUpperCase() : "NV"}</AvatarFallback>
                </Avatar>
              </div>

              {/* Form tải lên ảnh mới */}
              <div className="w-full max-w-md">
                <Label htmlFor="profile-picture" className="block mb-2">
                  Tải lên ảnh mới
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
          </TabsContent>
        </Tabs>

        {/* Thông báo lỗi hoặc thành công */}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            Cập nhật thông tin nhân viên thành công!
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lưu Thay Đổi
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
