/**
 * Component Popover dựa trên Radix UI
 * Được sử dụng để hiển thị nội dung popup khi người dùng tương tác với một phần tử
 */
"use client"
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

// Root component của Popover
const Popover = PopoverPrimitive.Root

// Component kích hoạt Popover
const PopoverTrigger = PopoverPrimitive.Trigger

/**
 * Component nội dung của Popover
 * @param {Object} props - Props của component
 * @param {string} props.className - Class CSS bổ sung
 * @param {string} props.align - Căn chỉnh của popover (left, center, right)
 * @param {number} props.sideOffset - Khoảng cách từ trigger đến popover
 */
const PopoverContent = React.forwardRef(function PopoverContent(
  { className, align = "center", sideOffset = 4, ...props },
  ref,
) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
})
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
