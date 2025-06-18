/**
 * Trang quản lý phòng ban và vị trí
 * Cho phép thêm phòng ban và vị trí mới
 */
"use client"

import { useState } from "react"
import { EmployeeList } from "@/components/employee-list"
import { Button } from "@/components/ui/button"
import { Building } from "lucide-react"
import { useEmployees } from "@/hooks/use-employees"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function EmployeesPage() {
  const { departments, addDepartment, positions, addPosition } = useEmployees()
  const [newDepartment, setNewDepartment] = useState("")
  const [newPosition, setNewPosition] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [showPositionDialog, setShowPositionDialog] = useState(false)

  /**
   * Xử lý thêm phòng ban mới
   */
  const handleAddDepartment = () => {
    if (newDepartment.trim()) {
      addDepartment(newDepartment.trim())
      setSelectedDepartment(newDepartment.trim())
      setNewDepartment("")
      setShowPositionDialog(true)
    }
  }

  /**
   * Xử lý thêm vị trí mới
   */
  const handleAddPosition = () => {
    if (newPosition.trim()) {
      addPosition(newPosition.trim())
      setNewPosition("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Nhân Viên</h1>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Building className="mr-2 h-4 w-4" />
                Thêm Phòng Ban
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm Phòng Ban Mới</DialogTitle>
                <DialogDescription>
                  Nhập tên phòng ban mới. Sau khi thêm phòng ban, bạn có thể thêm vị trí cho phòng ban này.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tên Phòng Ban
                  </Label>
                  <Input
                    id="name"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddDepartment}>Thêm Phòng Ban</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <EmployeeList />

      <Dialog open={showPositionDialog} onOpenChange={setShowPositionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm Vị Trí Cho Phòng Ban {selectedDepartment}</DialogTitle>
            <DialogDescription>Nhập tên vị trí mới cho phòng ban này.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Tên Vị Trí
              </Label>
              <Input
                id="position"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddPosition}>Thêm Vị Trí</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
