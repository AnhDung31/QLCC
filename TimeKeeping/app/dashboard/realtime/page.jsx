/**
 * Trang hiển thị thông tin check-in gần đây của nhân viên
 * Hiển thị thông tin real-time về các nhân viên đã check-in
 */
import { RealtimeCheckinTable } from "@/components/realtime-checkin-table"

export default function RealtimePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Check-in Gần Đây</h1>
      <p className="text-muted-foreground">Thông tin check-in gần đây của nhân viên</p>
      <RealtimeCheckinTable />
    </div>
  )
}
