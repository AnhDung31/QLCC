"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Pencil } from "lucide-react"
import  getAdminUserById  from "@/lib/api"
import { UpdateAdminModal } from "@/components/update-admin-modal"
import { toast } from "sonner"

export default function AdminDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)

  const fetchAdmin = async () => {
    try {
      setLoading(true)
      const data = await getAdminUserById(params.id)
      setAdmin(data)
    } catch (error) {
      toast.error("Không thể tải thông tin admin")
      router.push("/dashboard/admins")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmin()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">Đang tải...</div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/admins")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <Button onClick={() => setUpdateModalOpen(true)}>
          <Pencil className="h-4 w-4 mr-2" />
          Cập nhật thông tin
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={admin.imageAvatar || "/placeholder.svg"} alt={admin.username} />
                <AvatarFallback className="text-lg">
                  {admin.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{admin.username}</h3>
                <p className="text-sm text-muted-foreground">{admin.email}</p>
                <Badge className="mt-2" variant={admin.role === "admin" ? "default" : "outline"}>
                  {admin.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin bổ sung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="text-sm text-muted-foreground">ID</div>
              <div className="font-medium">{admin._id}</div>
            </div>
            <div className="grid gap-2">
              <div className="text-sm text-muted-foreground">Ngày tạo</div>
              <div className="font-medium">
                {new Date(admin.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            <div className="grid gap-2">
              <div className="text-sm text-muted-foreground">Cập nhật lần cuối</div>
              <div className="font-medium">
                {new Date(admin.updatedAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <UpdateAdminModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        adminId={admin._id}
        onSuccess={fetchAdmin}
      />
    </div>
  )
} 