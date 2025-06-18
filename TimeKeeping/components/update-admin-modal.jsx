"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { updateAdminPassword, removeAdminRole } from "@/lib/api"
import { Loader2, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function UpdateAdminModal({ isOpen, onClose, adminId, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  })

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    if (passwordData.password !== passwordData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp")
      return
    }
    try {
      setLoading(true)
      await updateAdminPassword(adminId, passwordData.password)
      toast.success("Cập nhật mật khẩu thành công")
      onSuccess?.()
      onClose()
    } catch (error) {
      toast.error("Không thể cập nhật mật khẩu")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAdminRole = async () => {
    try {
      setLoading(true)
      await removeAdminRole(adminId)
      toast.success("Đã xóa quyền admin")
      onSuccess?.()
      onClose()
    } catch (error) {
      toast.error("Không thể xóa quyền admin")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin Admin</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu mới</Label>
              <Input
                id="password"
                type="password"
                value={passwordData.password}
                onChange={(e) => setPasswordData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Nhập mật khẩu mới"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Nhập lại mật khẩu mới"
                required
                minLength={6}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật mật khẩu"
                )}
              </Button>
            </div>
          </form>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Xóa quyền Admin</h4>
                <p className="text-sm text-gray-500">
                  Người dùng sẽ không còn quyền admin sau khi xóa
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={loading}>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Xóa quyền
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa quyền Admin</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa quyền admin của người dùng này? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemoveAdminRole}>
                      Xác nhận xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 