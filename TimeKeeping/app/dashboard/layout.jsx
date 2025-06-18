/**
 * Layout cho phần Dashboard của ứng dụng
 * Bao gồm sidebar và header chung cho tất cả các trang trong dashboard
 */
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

/**
 * Component layout cho phần dashboard
 * @param {Object} props - Props của component
 * @param {React.ReactNode} props.children - Các component con sẽ được render trong layout
 */
export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar hiển thị menu điều hướng */}
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header hiển thị ở trên cùng của dashboard */}
        <Header />
        {/* Phần nội dung chính của trang */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
