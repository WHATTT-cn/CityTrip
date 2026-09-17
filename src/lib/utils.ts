import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 为 public 下的静态资源拼接部署基路径（GitHub Pages 子路径 /CityTrip/）。
 * 传入以 "/" 开头的绝对路径（如 "/images/x.jpg"），返回带 BASE_URL 前缀的可用路径。
 */
export function asset(path: string) {
  const base = import.meta.env.BASE_URL // 例如 "/CityTrip/"
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`
}
