'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useEmployees } from '@/hooks/use-employees'
import { getAdminUsers, getAllDevices, assignDevicesToAdmin, getAdminById } from '@/lib/api'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

const AssignPermissions = () => {
  const [devices, setDevices] = useState([])
  const [adminUsers, setAdminUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAdminId, setSelectedAdminId] = useState(null)
  const [permissions, setPermissions] = useState({
    devices: {},
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [devicesData, adminUsersData] = await Promise.all([
          getAllDevices(),
          getAdminUsers()
        ])
        setDevices(devicesData)
        setAdminUsers(adminUsersData)
      } catch (err) {
        toast.error('Không thể tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAdminChange = async (value) => {
    setSelectedAdminId(value)
    // Reset permissions when selecting a different admin
    setPermissions({
      devices: {},
    })

    if (value) {
      try {
        // Fetch admin details to get assigned devices
        const adminData = await getAdminById(value)
        if (adminData && adminData.devices) {
          // Create a new permissions object with pre-selected devices
          const newPermissions = {
            devices: {}
          }
          console.log("device Id = ",adminData.devices)
          // Set all devices to false first
          devices.forEach(device => {
            newPermissions.devices[device.deviceId] = false
          })
          
          // Set assigned devices to true
          adminData.devices.forEach(deviceId => {
            newPermissions.devices[deviceId] = true
          })
          
          setPermissions(newPermissions)
        }
      } catch (err) {
        console.error('Error fetching admin details:', err)
        toast.error('Không thể tải thông tin thiết bị đã gán')
      }
    }
  }

  const togglePermission = (type, id) => {
    setPermissions((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: !prev[type][id],
      },
    }))
  }

  const handleSavePermissions = async () => {
    if (!selectedAdminId) {
      toast.warning('Vui lòng chọn admin')
      return
    }

    try {
      // Get selected device IDs
      const selectedDeviceIds = Object.entries(permissions.devices)
        .filter(([_, isSelected]) => isSelected)
        .map(([deviceId]) => deviceId)

      if (selectedDeviceIds.length === 0) {
        toast.warning('Vui lòng chọn ít nhất một thiết bị')
        return
      }

      // Call API to assign devices
      await assignDevicesToAdmin(selectedAdminId, selectedDeviceIds)
      toast.success('Phân quyền thành công')
    } catch (err) {
      console.error('Error assigning devices:', err)
      toast.error(err.message || 'Lỗi khi phân quyền')
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-6">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Đang tải...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-6">
      <CardContent className="space-y-4 py-6">
        <div>
          <Label>Chọn Admin</Label>
          <Select value={selectedAdminId || ''} onValueChange={handleAdminChange}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="-- Chọn admin --" />
            </SelectTrigger>
            <SelectContent>
              {adminUsers.map((admin) => (
                <SelectItem key={admin._id} value={admin._id}>
                  {admin.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="text-lg">Phân quyền thiết bị</Label>
            <div className="mt-2 space-y-2">
              {devices.map((device) => (
                <div key={device.deviceId} className="flex items-center gap-2">
                  <Checkbox
                    checked={permissions.devices[device.deviceId] || false}
                    onCheckedChange={() => togglePermission('devices', device.deviceId)}
                  />
                  <span>{device.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-right pt-4">
          <Button onClick={handleSavePermissions}>Lưu phân quyền</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AssignPermissions
