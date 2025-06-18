/**
 * Hook quản lý hệ số lương
 * Cung cấp các hàm để thêm, sửa, xóa và lấy thông tin hệ số lương
 */
"use client"

import { useState, useEffect } from "react"

// Dữ liệu mẫu cho hệ số lương
const initialSalaryCoefficients = [
  {
    department: "CNTT",
    position: "Lập Trình Viên",
    baseSalary: 10000000,
    hourlyRate: 60000,
    overtimeRate: 90000,
  },
  {
    department: "CNTT",
    position: "Quản Lý Dự Án",
    baseSalary: 15000000,
    hourlyRate: 80000,
    overtimeRate: 120000,
  },
  {
    department: "Thiết Kế",
    position: "Thiết Kế Viên",
    baseSalary: 9000000,
    hourlyRate: 55000,
    overtimeRate: 85000,
  },
  {
    department: "Nhân Sự",
    position: "Quản Lý",
    baseSalary: 15000000,
    hourlyRate: 80000,
    overtimeRate: 120000,
  },
  {
    department: "Tài Chính",
    position: "Kế Toán",
    baseSalary: 12000000,
    hourlyRate: 70000,
    overtimeRate: 100000,
  },
  {
    department: "Marketing",
    position: "Marketing",
    baseSalary: 9500000,
    hourlyRate: 58000,
    overtimeRate: 87000,
  },
]

export function useSalaryCoefficients() {
  const [salaryCoefficients, setSalaryCoefficients] = useState([])

  useEffect(() => {
    setSalaryCoefficients(initialSalaryCoefficients)
  }, [])

  // Hàm thêm hệ số lương mới
  const addSalaryCoefficient = (department, position, data) => {
    // Kiểm tra xem hệ số lương đã tồn tại chưa
    const exists = salaryCoefficients.some((coef) => coef.department === department && coef.position === position)

    if (!exists) {
      setSalaryCoefficients((prev) => [
        ...prev,
        {
          department,
          position,
          baseSalary: data.baseSalary,
          hourlyRate: data.hourlyRate,
          overtimeRate: data.overtimeRate,
        },
      ])
    }
  }

  // Hàm cập nhật hệ số lương
  const updateSalaryCoefficient = (department, position, data) => {
    setSalaryCoefficients((prev) =>
      prev.map((coef) => (coef.department === department && coef.position === position ? { ...coef, ...data } : coef)),
    )
  }

  // Hàm xóa hệ số lương
  const deleteSalaryCoefficient = (department, position) => {
    setSalaryCoefficients((prev) =>
      prev.filter((coef) => !(coef.department === department && coef.position === position)),
    )
  }

  // Hàm lấy hệ số lương theo phòng ban và vị trí
  const getSalaryCoefficient = (department, position) => {
    return salaryCoefficients.find((coef) => coef.department === department && coef.position === position)
  }

  return {
    salaryCoefficients,
    addSalaryCoefficient,
    updateSalaryCoefficient,
    deleteSalaryCoefficient,
    getSalaryCoefficient,
  }
}
