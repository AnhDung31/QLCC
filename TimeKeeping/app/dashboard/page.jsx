/**
 * Trang dashboard chính - redirect đến trang check-in gần đây
 * Vì người dùng không cần trang dashboard riêng, chúng ta sẽ redirect đến realtime
 */
import { redirect } from "next/navigation"

/**
 * Component trang dashboard chính
 * Tự động redirect đến trang check-in gần đây
 */
export default function DashboardPage() {
  // Redirect đến trang check-in gần đây
  redirect("/dashboard/realtime")
}
