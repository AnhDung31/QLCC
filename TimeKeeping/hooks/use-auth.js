/**
 * Hook quản lý xác thực và vai trò người dùng
 */
"use client"

import { useState, useEffect } from "react"
import { getUserData } from "@/lib/api"
import api from "@/lib/api"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const user = getUserData()
      console.log("user", user)
      if (!user) {
        setUser(null)
        setIsLoading(false)
        return
      }
      setUser(user)
      setIsLoading(false)
    }

    fetchUser()
  }, [])

  const isSuperAdmin = () => {
    return user?.role === 'superadmin'
  }

  return {
    user,
    isLoading,
    isSuperAdmin
  }
} 