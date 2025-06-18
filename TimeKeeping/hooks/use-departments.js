/**
 * Hook quản lý dữ liệu bộ phận và vị trí
 * Cung cấp các hàm để thêm, sửa, xóa và lấy thông tin bộ phận và vị trí
 */
"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import api from "@/lib/api"

/**
 * Hook quản lý dữ liệu bộ phận và vị trí
 * @returns {Object} Các hàm và dữ liệu liên quan đến bộ phận và vị trí
 */
export function useDepartments() {
  // State lưu trữ danh sách bộ phận và vị trí
  const [departments, setDepartments] = useState([])
  const [positions, setPositions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch departments data
  const fetchDepartments = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/departments')
      setDepartments(response.data.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching departments:", err)
      setError(err.message)
      toast.error("Không thể tải danh sách bộ phận")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch positions data
  const fetchPositions = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/positions')
      setPositions(response.data.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching positions:", err)
      setError(err.message)
      toast.error("Không thể tải danh sách vị trí")
    } finally {
      setIsLoading(false)
    }
  }

  // Load data on mount
  useEffect(() => {
    fetchDepartments()
    fetchPositions()
  }, [])

  /**
   * Lấy danh sách tất cả các bộ phận
   * @returns {Array} Danh sách các bộ phận
   */
  const getAllDepartments = () => {
    return departments
  }

  /**
   * Lấy danh sách tất cả các vị trí
   * @returns {Array} Danh sách các vị trí
   */
  const getAllPositions = () => {
    return positions
  }

  /**
   * Lấy danh sách vị trí theo bộ phận
   * @param {string} departmentId - ID của bộ phận
   * @returns {Array} Danh sách vị trí thuộc bộ phận
   */
  const getPositionsByDepartment = async (departmentId) => {
    try {
      const response = await api.get(`/positions/department/${departmentId}`)
      return response.data
    } catch (err) {
      console.error("Error fetching positions by department:", err)
      toast.error("Không thể tải danh sách vị trí của bộ phận")
      return []
    }
  }

  /**
   * Thêm bộ phận mới
   * @param {string} name - Tên bộ phận mới
   */
  const addDepartment = async (name) => {
    try {
      setIsLoading(true)
      await api.post('/departments', { name })
      await fetchDepartments()
      toast.success("Thêm bộ phận thành công")
    } catch (err) {
      console.error("Error adding department:", err)
      toast.error("Không thể thêm bộ phận mới")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Thêm vị trí mới
   * @param {string} name - Tên vị trí mới
   * @param {string} departmentId - ID của bộ phận
   */
  const addPosition = async (name, departmentId) => {
    try {
      setIsLoading(true)
      await api.post('/positions', { name, department: departmentId })
      await Promise.all([fetchDepartments(), fetchPositions()])
      toast.success("Thêm vị trí thành công")
    } catch (err) {
      console.error("Error adding position:", err)
      toast.error("Không thể thêm vị trí mới")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Cập nhật tên bộ phận
   * @param {string} departmentId - ID của bộ phận
   * @param {string} name - Tên mới của bộ phận
   */
  const updateDepartment = async (departmentId, name) => {
    try {
      setIsLoading(true)
      await api.put(`/departments/${departmentId}`, { name })
      await fetchDepartments()
      toast.success("Cập nhật bộ phận thành công")
    } catch (err) {
      console.error("Error updating department:", err)
      toast.error("Không thể cập nhật bộ phận")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Cập nhật tên vị trí
   * @param {string} positionId - ID của vị trí
   * @param {string} name - Tên mới của vị trí
   */
  const updatePosition = async (positionId, name) => {
    try {
      setIsLoading(true)
      await api.put(`/positions/${positionId}`, { name })
      await Promise.all([fetchDepartments(), fetchPositions()])
      toast.success("Cập nhật vị trí thành công")
    } catch (err) {
      console.error("Error updating position:", err)
      toast.error("Không thể cập nhật vị trí")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Xóa bộ phận
   * @param {string} departmentId - ID của bộ phận cần xóa
   */
  const deleteDepartment = async (departmentId) => {
    try {
      setIsLoading(true)
      await api.delete(`/departments/${departmentId}`)
      await Promise.all([fetchDepartments(), fetchPositions()])
      toast.success("Xóa bộ phận thành công")
    } catch (err) {
      console.error("Error deleting department:", err)
      toast.error("Không thể xóa bộ phận")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Xóa vị trí
   * @param {string} positionId - ID của vị trí cần xóa
   */
  const deletePosition = async (positionId) => {
    try {
      setIsLoading(true)
      await api.delete(`/positions/${positionId}`)
      await Promise.all([fetchDepartments(), fetchPositions()])
      toast.success("Xóa vị trí thành công")
    } catch (err) {
      console.error("Error deleting position:", err)
      toast.error("Không thể xóa vị trí")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Trả về các hàm và dữ liệu
  return {
    departments,
    positions,
    isLoading,
    error,
    getAllDepartments,
    getAllPositions,
    getPositionsByDepartment,
    addDepartment,
    addPosition,
    updateDepartment,
    updatePosition,
    deleteDepartment,
    deletePosition,
  }
}
