"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEmployees } from "@/hooks/use-employees"
import { useSalaryCoefficients } from "@/hooks/use-salary-coefficients"
import { Edit, Plus, Save, Trash2, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

export function SalaryCoefficients() {
  const { departments, positions } = useEmployees()
  const { salaryCoefficients, addSalaryCoefficient, updateSalaryCoefficient, deleteSalaryCoefficient } =
    useSalaryCoefficients()

  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({
    baseSalary: 0,
    hourlyRate: 0,
    overtimeRate: 0,
  })

  const [newCoefficient, setNewCoefficient] = useState({
    department: "",
    position: "",
    baseSalary: 0,
    hourlyRate: 0,
    overtimeRate: 0,
  })

  const [showAddDialog, setShowAddDialog] = useState(false)

  const startEdit = (id) => {
    const coefficient = salaryCoefficients.find((coef) => `${coef.department}-${coef.position}` === id)
    if (coefficient) {
      setEditData({
        baseSalary: coefficient.baseSalary,
        hourlyRate: coefficient.hourlyRate,
        overtimeRate: coefficient.overtimeRate,
      })
      setEditingId(id)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = (id) => {
    const [department, position] = id.split("-")
    updateSalaryCoefficient(department, position, editData)
    setEditingId(null)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: Number(value) }))
  }

  const handleNewCoefficientChange = (e) => {
    const { name, value } = e.target
    setNewCoefficient((prev) => ({
      ...prev,
      [name]: name === "department" || name === "position" ? value : Number(value),
    }))
  }

  const handleSelectChange = (name, value) => {
    setNewCoefficient((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCoefficient = () => {
    if (newCoefficient.department && newCoefficient.position) {
      addSalaryCoefficient(newCoefficient.department, newCoefficient.position, {
        baseSalary: newCoefficient.baseSalary,
        hourlyRate: newCoefficient.hourlyRate,
        overtimeRate: newCoefficient.overtimeRate,
      })

      setNewCoefficient({
        department: "",
        position: "",
        baseSalary: 0,
        hourlyRate: 0,
        overtimeRate: 0,
      })

      setShowAddDialog(false)
    }
  }

  const handleDeleteCoefficient = (id) => {
    const [department, position] = id.split("-")
    deleteSalaryCoefficient(department, position)
  }

  // Format số tiền thành định dạng VNĐ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Hệ Số Lương Theo Phòng Ban & Vị Trí</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Hệ Số Lương
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Phòng Ban</TableHead>
                  <TableHead>Vị Trí</TableHead>
                  <TableHead>Lương Cơ Bản</TableHead>
                  <TableHead>Lương Theo Giờ</TableHead>
                  <TableHead>Lương Tăng Ca</TableHead>
                  <TableHead>Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaryCoefficients.map((coefficient) => {
                  const id = `${coefficient.department}-${coefficient.position}`

                  return (
                    <TableRow key={id}>
                      <TableCell>{coefficient.department}</TableCell>
                      <TableCell>{coefficient.position}</TableCell>

                      {editingId === id ? (
                        <>
                          <TableCell>
                            <Input
                              type="number"
                              name="baseSalary"
                              value={editData.baseSalary}
                              onChange={handleEditChange}
                              className="w-32"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              name="hourlyRate"
                              value={editData.hourlyRate}
                              onChange={handleEditChange}
                              className="w-32"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              name="overtimeRate"
                              value={editData.overtimeRate}
                              onChange={handleEditChange}
                              className="w-32"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => saveEdit(id)}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{formatCurrency(coefficient.baseSalary)}</TableCell>
                          <TableCell>{formatCurrency(coefficient.hourlyRate)} / giờ</TableCell>
                          <TableCell>{formatCurrency(coefficient.overtimeRate)} / giờ</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => startEdit(id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Bạn có chắc chắn muốn xóa hệ số lương cho {coefficient.position} tại phòng ban{" "}
                                      {coefficient.department}? Hành động này không thể hoàn tác.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteCoefficient(id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Xóa
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm Hệ Số Lương Mới</DialogTitle>
            <DialogDescription>Thiết lập hệ số lương cho phòng ban và vị trí</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Phòng Ban
              </Label>
              <div className="col-span-3">
                <Select
                  value={newCoefficient.department}
                  onValueChange={(value) => handleSelectChange("department", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Vị Trí
              </Label>
              <div className="col-span-3">
                <Select
                  value={newCoefficient.position}
                  onValueChange={(value) => handleSelectChange("position", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vị trí" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="baseSalary" className="text-right">
                Lương Cơ Bản
              </Label>
              <Input
                id="baseSalary"
                name="baseSalary"
                type="number"
                value={newCoefficient.baseSalary}
                onChange={handleNewCoefficientChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hourlyRate" className="text-right">
                Lương Theo Giờ
              </Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                value={newCoefficient.hourlyRate}
                onChange={handleNewCoefficientChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="overtimeRate" className="text-right">
                Lương Tăng Ca
              </Label>
              <Input
                id="overtimeRate"
                name="overtimeRate"
                type="number"
                value={newCoefficient.overtimeRate}
                onChange={handleNewCoefficientChange}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={handleAddCoefficient}>
              Thêm Hệ Số Lương
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
