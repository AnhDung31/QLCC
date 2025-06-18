/**
 * Component Card tùy chỉnh
 * Cung cấp card container với styling nhất quán
 */
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Component Card container
 * @param {Object} props - Props của component
 * @param {string} props.className - Class CSS bổ sung
 */
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
))
Card.displayName = "Card"

/**
 * Component header của Card
 * @param {Object} props - Props của component
 * @param {string} props.className - Class CSS bổ sung
 */
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

/**
 * Component title của Card
 * @param {Object} props - Props của component
 * @param {string} props.className - Class CSS bổ sung
 */
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

/**
 * Component description của Card
 * @param {Object} props - Props của component
 * @param {string} props.className - Class CSS bổ sung
 */
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

/**
 * Component nội dung của Card
 * @param {Object} props - Props của component
 * @param {string} props.className - Class CSS bổ sung
 */
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

/**
 * Component footer của Card
 * @param {Object} props - Props của component
 * @param {string} props.className - Class CSS bổ sung
 */
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
