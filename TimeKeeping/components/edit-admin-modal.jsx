"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { getAdminById } from "@/lib/api"
import { Loader2 } from "lucide-react"

export function EditAdminModal({ isOpen, onClose, adminId }) {
  const [loading, setLoading] = useState(false)
  const [adminData, setAdminData] = useState({
    username: "",
    email: "",
    role: "admin",
  })

  useEffect(() => {
    if (isOpen && adminId) {
      fetchAdminDetails()
    }
  }, [])

  const fetchAdminDetails = async () => {
    try {
      setLoading(true)
      const data = await getAdminById(adminId)
      setAdminData({
        username: data.username || "",
        email: data.email || "",
        role: data.role || "admin",
      })
    } catch (error) {
      toast.error("Không thể tải thông tin admin")
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      // TODO: Implement update admin API call
      await new Promise(resolve => setTimeout(resolve, 1000)) // Temporary delay
      toast.success("Cập nhật thông tin admin thành công")
      onClose()
    } catch (error) {
      toast.error("Không thể cập nhật thông tin admin")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin Admin</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải...</span>
          </div>
        ) : (
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
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
