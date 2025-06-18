"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createAdmin } from "@/lib/api"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"

export function CreateAdminModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [adminData, setAdminData] = useState({
    username: "",
    password: "",
    email: "",
    imageAvatar: null,
  })
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Kích thước ảnh không được vượt quá 5MB")
        return
      }
      setAdminData(prev => ({ ...prev, imageAvatar: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setAdminData(prev => ({ ...prev, imageAvatar: null }))
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await createAdmin({
        ...adminData,
        role: "admin"
      })
      toast.success("Tạo admin thành công")
      onSuccess?.()
      onClose()
    } catch (error) {
      toast.error("Không thể tạo admin")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo tài khoản Admin mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              value={adminData.username}
              onChange={(e) => setAdminData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              value={adminData.password}
              onChange={(e) => setAdminData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Nhập mật khẩu"
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={adminData.email}
              onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Nhập email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Ảnh đại diện</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 border-2 border-dashed rounded-lg overflow-hidden">
                {previewImage ? (
                  <>
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Chọn ảnh
                </Button>
                <p className="text-sm text-gray-500 mt-1">
                  Kích thước tối đa: 5MB
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo admin"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 