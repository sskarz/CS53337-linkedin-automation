import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Shadcn/UI merge utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
