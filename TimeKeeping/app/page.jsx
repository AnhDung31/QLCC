/**
 * Trang chủ của ứng dụng - hiển thị form đăng nhập
 * Đây là trang đầu tiên người dùng thấy khi truy cập vào hệ thống
 */
import { LoginForm } from "@/components/login-form"

/**
 * Component trang chủ hiển thị form đăng nhập
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Hệ Thống Chấm Công Nhân Viên</h1>
          <p className="text-muted-foreground mt-2">Đăng nhập để quản lý chấm công nhân viên</p>
        </div>
        {/* Form đăng nhập */}
        <LoginForm />
      </div>
    </main>
  )
}
