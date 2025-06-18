"use client"

/**
 * Hook useToast để quản lý thông báo toast
 */
import { useEffect, useState } from "react"

// Tạo một store đơn giản để quản lý toasts
const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toasts = new Map()

const observers = new Set()

function emitChange() {
  observers.forEach((observer) => observer(toasts))
}

/**
 * Hook useToast
 * @returns {Object} - Các hàm và state để quản lý toast
 */
export function useToast() {
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState([])

  const toast = (props) => {
    const id = genId()
    const newToast = {
      id,
      ...props,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss(id)
      },
    }

    toasts.set(id, newToast)
    emitChange()

    return id
  }

  const update = (id, props) => {
    if (!toasts.has(id)) return
    const newToast = { ...toasts.get(id), ...props }
    toasts.set(id, newToast)
    emitChange()
  }

  const dismiss = (id) => {
    if (!toasts.has(id)) return
    const toast = toasts.get(id)
    if (toast.open === false) return

    toasts.set(id, { ...toast, open: false })
    emitChange()

    setTimeout(() => {
      toasts.delete(id)
      emitChange()
    }, TOAST_REMOVE_DELAY)
  }

  const dismissAll = () => {
    toasts.forEach((_, id) => dismiss(id))
  }

  useEffect(() => {
    setMounted(true)

    // Đăng ký observer
    const observer = (newToasts) => {
      const newItems = Array.from(newToasts.values())
      setItems(newItems.slice(-TOAST_LIMIT).reverse())
    }

    observers.add(observer)
    return () => observers.delete(observer)
  }, [])

  return {
    toast,
    update,
    dismiss,
    dismissAll,
    toasts: mounted ? items : [],
  }
}

/**
 * Component ToastContainer
 * @returns {JSX.Element} - Component hiển thị toasts
 */
export function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-md border p-4 shadow-md ${
            toast.variant === "destructive"
              ? "border-red-600 bg-red-50 text-red-900"
              : "border-gray-200 bg-white text-gray-900"
          }`}
        >
          {toast.title && <div className="font-medium">{toast.title}</div>}
          {toast.description && <div className="mt-1">{toast.description}</div>}
        </div>
      ))}
    </div>
  )
}
