"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { createDevice } from "@/lib/api"
import { Loader2 } from "lucide-react"

export function CreateDeviceModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [deviceData, setDeviceData] = useState({
    deviceId: "",
    name: "",
    type: "",
    location: "",
    status: "active",
    description: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await createDevice(deviceData)
      toast.success("Thêm thiết bị thành công")
      onSuccess?.()
      onClose()
    } catch (error) {
      toast.error("Không thể thêm thiết bị")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm thiết bị mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deviceId">Mã thiết bị</Label>
            <Input
              id="deviceId"
              value={deviceData.deviceId}
              onChange={e => setDeviceData(prev => ({ ...prev, deviceId: e.target.value }))}
              placeholder="Nhập mã thiết bị"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Tên thiết bị</Label>
            <Input
              id="name"
              value={deviceData.name}
              onChange={(e) => setDeviceData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nhập tên thiết bị"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Loại thiết bị</Label>
            <Select
              value={deviceData.type}
              onValueChange={(value) => setDeviceData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại thiết bị" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="camera">Camera</SelectItem>
                <SelectItem value="fingerprint">Vân tay</SelectItem>
                <SelectItem value="card">Thẻ từ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Vị trí</Label>
            <Input
              id="location"
              value={deviceData.location}
              onChange={(e) => setDeviceData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Nhập vị trí lắp đặt"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={deviceData.status}
              onValueChange={(value) => setDeviceData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Input
              id="description"
              value={deviceData.description}
              onChange={(e) => setDeviceData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Nhập mô tả thiết bị"
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
                  Đang thêm...
                </>
              ) : (
                "Thêm thiết bị"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 