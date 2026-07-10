import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** دمج كلاسات Tailwind بأمان (shadcn convention) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
