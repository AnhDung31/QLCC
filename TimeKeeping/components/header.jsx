/**
 * Component Header hiển thị ở trên cùng của dashboard
 * Bao gồm nút menu (trên mobile), thanh tìm kiếm, thông báo và avatar người dùng
 */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Menu, Search, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"

export function Header() {
  // State để kiểm soát hiển thị thanh tìm kiếm
  const [showSearch, setShowSearch] = useState(false)

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-4 md:px-6">
      {/* Menu hamburger hiển thị trên mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Mở menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          {/* Sidebar trong sheet cho mobile */}
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Hiển thị thanh tìm kiếm hoặc nút tìm kiếm tùy thuộc vào trạng thái */}
      {showSearch ? (
        <div className="flex-1 flex items-center ml-2">
          <Input type="search" placeholder="Tìm kiếm nhân viên..." className="max-w-sm" />
          <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Đóng tìm kiếm</span>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)} className="mr-2">
            <Search className="h-5 w-5" />
            <span className="sr-only">Tìm kiếm</span>
          </Button>
        </>
      )}

      {/* Nút thông báo */}
      <Button variant="ghost" size="icon" className="mr-2">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Thông báo</span>
      </Button>

      {/* Avatar người dùng */}
      <Avatar>
        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Quản lý" />
        <AvatarFallback>QL</AvatarFallback>
      </Avatar>
    </header>
  )
}
