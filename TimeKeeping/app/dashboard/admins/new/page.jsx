"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { createAdmin } from "@/lib/api"
import { toast } from "sonner"

export default function NewAdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    imageAvatar: null
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // Get the base64 string by removing the data URL prefix
        const base64String = reader.result.split(',')[1]
        resolve(base64String)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Kích thước ảnh không được vượt quá 5MB")
          return
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          toast.error("Vui lòng chọn file ảnh")
          return
        }

        const base64String = await convertToBase64(file)
        setFormData(prev => ({
          ...prev,
          imageAvatar: base64String
        }))
      } catch (error) {
        toast.error("Không thể xử lý ảnh")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp")
      return
    }

    try {
      setLoading(true)
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...adminData } = formData
      adminData.role = "admin"
      await createAdmin(adminData)
      toast.success("Tạo quản trị viên thành công")
      router.back()
    } catch (error) {
      toast.error(error.message || "Không thể tạo quản trị viên")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold">Thêm Quản Trị Viên Mới</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin quản trị viên</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="imageAvatar">Ảnh đại diện</Label>
                <Input
                  id="imageAvatar"
                  name="imageAvatar"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground">
                  Kích thước tối đa: 5MB. Định dạng: JPG, PNG, GIF
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/admins")}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Đang tạo..." : "Tạo quản trị viên"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 