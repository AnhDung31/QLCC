/**
 * File chứa các hàm tiện ích được sử dụng trong toàn bộ ứng dụng
 */
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Hàm kết hợp các class CSS
 * Sử dụng clsx và tailwind-merge để xử lý các class trùng lặp
 * @param {...any} inputs - Các class cần kết hợp
 * @returns {string} Chuỗi class đã được kết hợp
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Hàm định dạng khoảng thời gian thành chuỗi dễ đọc
 * @param {number} minutes - Số phút cần định dạng (dương là muộn, âm là sớm)
 * @returns {string} Chuỗi đã được định dạng
 */
export function formatTimeDifference(minutes) {
  if (minutes === 0) return "Đúng giờ"

  const hours = Math.floor(Math.abs(minutes) / 60)
  const mins = Math.abs(minutes) % 60

  let result = ""
  if (hours > 0) {
    result += `${hours} giờ `
  }
  if (mins > 0) {
    result += `${mins} phút`
  }

  return minutes > 0 ? `Muộn ${result}` : `Sớm ${result}`
}
