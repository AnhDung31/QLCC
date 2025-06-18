"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Smartphone, Edit, Trash2, UserPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { createDevice, getAllDevices, deleteDevice, updateDevice, assignDevicesToAdmin, getAdminUsers } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DeviceManagement() {
  const { toast } = useToast()
  const [devices, setDevices] = useState([])
  const [admins, setAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingDevice, setIsAddingDevice] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAssigning, setIsAssigning] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [newDevice, setNewDevice] = useState({
    name: "",
    code: ""
  })
  const [editingDevice, setEditingDevice] = useState(null)
  const [selectedAdmin, setSelectedAdmin] = useState("")
  const [selectedDevices, setSelectedDevices] = useState([])

  // Fetch devices and admins when component mounts
  useEffect(() => {
    fetchDevices()
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const adminsData = await getAdminUsers()
      setAdmins(adminsData)
    } catch (err) {
      console.error("Error fetching admins:", err)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách admin",
        variant: "destructive",
      })
    }
  }

  const fetchDevices = async () => {
    try {
      setIsLoading(true)
      const devicesData = await getAllDevices()
      setDevices(devicesData)
    } catch (err) {
      console.error("Error fetching devices:", err)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách thiết bị",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateDeviceCode = () => {
    const timestamp = Date.now().toString()
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `DEV${timestamp.slice(-6)}${randomNum}`
  }

  const handleOpenAddDialog = () => {
    setNewDevice({
      name: "",
      code: generateDeviceCode()
    })
    setShowAddDialog(true)
  }

  const handleAddDevice = async () => {
    if (newDevice.name.trim()) {
      try {
        setIsAddingDevice(true)
        // Call API to create device
        const deviceData = {
          name: newDevice.name.trim(),
          code: newDevice.code
        }
        
        const createdDevice = await createDevice(deviceData)
        
        // Update devices list
        setDevices(prevDevices => [...prevDevices, createdDevice])
        
        // Reset form and close dialog
        setNewDevice({
          name: "",
          code: ""
        })
        setShowAddDialog(false)

        // Show success message
        toast({
          title: "Thành công",
          description: "Thiết bị đã được thêm thành công",
        })
      } catch (err) {
        console.error("Error adding device:", err)
        // Show error message
        toast({
          title: "Lỗi",
          description: err.message || "Không thể thêm thiết bị",
          variant: "destructive",
        })
      } finally {
        setIsAddingDevice(false)
      }
    } else {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên thiết bị",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDevice = async (device) => {
    try {
      setIsDeleting(true)
      await deleteDevice(device.deviceId)
      
      // Update devices list by removing the deleted device
      setDevices(prevDevices => prevDevices.filter(d => d.deviceId !== device.deviceId))
      
      // Show success message
      toast({
        title: "Thành công",
        description: "Thiết bị đã được xóa thành công",
      })
    } catch (err) {
      console.error("Error deleting device:", err)
      // Show error message
      toast({
        title: "Lỗi",
        description: err.message || "Không thể xóa thiết bị",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleOpenEditDialog = (device) => {
    setEditingDevice({
      deviceId: device.deviceId,
      name: device.name
    })
    setShowEditDialog(true)
  }

  const handleUpdateDevice = async () => {
    if (!editingDevice?.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên thiết bị",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUpdating(true)
      const updatedDevice = await updateDevice(editingDevice.deviceId, {
        name: editingDevice.name.trim()
      })

      // Update devices list
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.deviceId === editingDevice.deviceId ? updatedDevice : device
        )
      )

      // Close dialog and reset state
      setShowEditDialog(false)
      setEditingDevice(null)

      // Show success message
      toast({
        title: "Thành công",
        description: "Tên thiết bị đã được cập nhật",
      })
    } catch (err) {
      console.error("Error updating device:", err)
      toast({
        title: "Lỗi",
        description: err.message || "Không thể cập nhật thiết bị",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleOpenAssignDialog = () => {
    setSelectedAdmin("")
    setSelectedDevices([])
    setShowAssignDialog(true)
  }

  const handleAssignDevices = async () => {
    if (!selectedAdmin) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn admin",
        variant: "destructive",
      })
      return
    }

    if (selectedDevices.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất một thiết bị",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAssigning(true)
      await assignDevicesToAdmin(selectedAdmin, selectedDevices)
      
      // Close dialog and reset state
      setShowAssignDialog(false)
      setSelectedAdmin("")
      setSelectedDevices([])

      // Show success message
      toast({
        title: "Thành công",
        description: "Đã gán thiết bị cho admin thành công",
      })
    } catch (err) {
      console.error("Error assigning devices:", err)
      toast({
        title: "Lỗi",
        description: err.message || "Không thể gán thiết bị cho admin",
        variant: "destructive",
      })
    } finally {
      setIsAssigning(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản Lý Thiết Bị</h1>
        <div className="flex gap-2">
          <Button onClick={handleOpenAssignDialog}>
            <UserPlus className="mr-2 h-4 w-4" />
            Gán Thiết Bị
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenAddDialog}>
                <Smartphone className="mr-2 h-4 w-4" />
                Thêm Thiết Bị
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm Thiết Bị Mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin thiết bị mới để thêm vào hệ thống.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deviceCode" className="text-right">
                    Mã Thiết Bị
                  </Label>
                  <Input
                    id="deviceCode"
                    className="col-span-3"
                    placeholder="Mã thiết bị sẽ được tự động tạo"
                    value={newDevice.code}
                    disabled={true}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deviceName" className="text-right">
                    Tên Thiết Bị
                  </Label>
                  <Input
                    id="deviceName"
                    className="col-span-3"
                    placeholder="Nhập tên thiết bị"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setNewDevice({
                    name: "",
                    code: ""
                  })
                  setShowAddDialog(false)
                }}>
                  Hủy
                </Button>
                <Button onClick={handleAddDevice} disabled={isAddingDevice}>
                  {isAddingDevice ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang thêm...
                    </>
                  ) : (
                    "Thêm Thiết Bị"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Device Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập Nhật Tên Thiết Bị</DialogTitle>
            <DialogDescription>
              Nhập tên mới cho thiết bị.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editDeviceName" className="text-right">
                Tên Thiết Bị
              </Label>
              <Input
                id="editDeviceName"
                className="col-span-3"
                placeholder="Nhập tên thiết bị"
                value={editingDevice?.name || ""}
                onChange={(e) => setEditingDevice(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditingDevice(null)
              setShowEditDialog(false)
            }}>
              Hủy
            </Button>
            <Button onClick={handleUpdateDevice} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang cập nhật...
                </>
              ) : (
                "Cập Nhật"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Devices Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gán Thiết Bị Cho Admin</DialogTitle>
            <DialogDescription>
              Chọn admin và các thiết bị cần gán.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="admin" className="text-right">
                Admin
              </Label>
              <Select
                value={selectedAdmin}
                onValueChange={setSelectedAdmin}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn admin" />
                </SelectTrigger>
                <SelectContent>
                  {admins.map((admin) => (
                    <SelectItem key={admin._id} value={admin._id}>
                      {admin.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Thiết Bị
              </Label>
              <div className="col-span-3 space-y-2">
                {devices.map((device) => (
                  <div key={device.deviceId} className="flex items-center space-x-2">
                    <Checkbox
                      id={`device-${device.deviceId}`}
                      checked={selectedDevices.includes(device.deviceId)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedDevices([...selectedDevices, device.deviceId])
                        } else {
                          setSelectedDevices(selectedDevices.filter(id => id !== device.deviceId))
                        }
                      }}
                    />
                    <label
                      htmlFor={`device-${device.deviceId}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {device.name} ({device.deviceId})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedAdmin("")
              setSelectedDevices([])
              setShowAssignDialog(false)
            }}>
              Hủy
            </Button>
            <Button onClick={handleAssignDevices} disabled={isAssigning}>
              {isAssigning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang gán...
                </>
              ) : (
                "Gán Thiết Bị"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Thiết Bị</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Thiết Bị</TableHead>
                  <TableHead>Tên Thiết Bị</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                      Chưa có thiết bị nào
                    </TableCell>
                  </TableRow>
                ) : (
                  devices.map((device) => (
                    <TableRow key={device.deviceId}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Smartphone className="mr-2 h-4 w-4 text-muted-foreground" />
                          {device.deviceId}
                        </div>
                      </TableCell>
                      <TableCell>{device.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenEditDialog(device)}
                            disabled={isUpdating}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500"
                                disabled={isDeleting}
                              >
                                {isDeleting ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn xóa thiết bị "{device.name}"? Hành động này không thể
                                  hoàn tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteDevice(device)}
                                  className="bg-red-500 hover:bg-red-600"
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? "Đang xóa..." : "Xóa"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 