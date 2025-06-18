/**
 * Hook quản lý dữ liệu nhân viên
 * Cung cấp các hàm để thêm, sửa, xóa và lấy thông tin nhân viên
 */
"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import api from "@/lib/api"

// Định nghĩa các ca làm việc
export const SHIFTS = {
  morning: {
    name: "Ca Sáng",
    startTime: "08:00",
    endTime: "12:00",
  },
  afternoon: {
    name: "Ca Chiều",
    startTime: "13:00",
    endTime: "17:00",
  },
  fullday: {
    name: "Cả Ngày",
    startTime: "08:00",
    endTime: "17:00",
  },
}

/**
 * Hook quản lý dữ liệu nhân viên
 * @returns {Object} Các hàm và dữ liệu liên quan đến nhân viên
 */
export function useEmployees() {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [positions, setPositions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments')
      setDepartments(response.data.data)
    } catch (err) {
      console.error("Error fetching departments:", err)
      toast.error("Không thể tải danh sách phòng ban")
    }
  }

  // Fetch positions
  const fetchPositions = async () => {
    try {
      const response = await api.get('/positions')
      setPositions(response.data.data)
    } catch (err) {
      console.error("Error fetching positions:", err)
      toast.error("Không thể tải danh sách vị trí")
    }
  }

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.get('/employees')
      setEmployees(response.data.data)
    } catch (err) {
      console.error("Error fetching employees:", err)
      setError(err.message)
      toast.error("Không thể tải danh sách nhân viên")
    } finally {
      setIsLoading(false)
    }
  }

  // Get employee by ID
  const getEmployeeById = async (employeeId) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.get(`/employees/${employeeId}`)
      return response.data.data
    } catch (err) {
      console.error("Error fetching employee:", err)
      setError(err.message)
      toast.error("Không thể tải thông tin nhân viên")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Add new employee
  const addEmployee = async (employeeData) => {
    try {
      const response = await api.post('/employees', employeeData)
      toast.success("Thêm nhân viên thành công")
      await fetchEmployees() // Refresh the list
      return response.data.data
    } catch (err) {
      console.error("Error adding employee:", err)
      toast.error("Không thể thêm nhân viên")
      throw err
    }
  }

  // Update employee
  const updateEmployee = async (employeeId, employeeData) => {
    try {
      const response = await api.put(`/employees/${employeeId}`, employeeData)
      toast.success("Cập nhật nhân viên thành công")
      await fetchEmployees() // Refresh the list
      return response.data.data
    } catch (err) {
      console.error("Error updating employee:", err)
      toast.error("Không thể cập nhật nhân viên")
      throw err
    }
  }

  // Delete employee
  const deleteEmployee = async (employeeId) => {
    try {
      await api.delete(`/employees/${employeeId}`)
      toast.success("Xóa nhân viên thành công")
      await fetchEmployees() // Refresh the list
    } catch (err) {
      console.error("Error deleting employee:", err)
      toast.error("Không thể xóa nhân viên")
      throw err
    }
  }

  // Load initial data
  useEffect(() => {
    fetchEmployees()
    fetchDepartments()
    fetchPositions()
  }, [])

  return {
    employees,
    departments,
    positions,
    isLoading,
    error,
    fetchEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  }
}
