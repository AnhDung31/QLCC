/**
 * Component Label tùy chỉnh dựa trên Radix UI
 * Cung cấp label cho form controls với styling nhất quán
 */
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Định nghĩa các biến thể của label
 */
const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70")

/**
 * Component Label
 * @param {Object} props - Props của component
 * @param {string} props.className - Class CSS bổ sung
 */
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
