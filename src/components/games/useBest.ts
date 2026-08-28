import { useCallback, useState } from "react"

function read(key: string): number | null {
  try {
    const raw = localStorage.getItem(key)
    const n = raw === null ? NaN : Number(raw)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

/**
 * أعلى نتيجة محفوظة على جهاز الزائر.
 * mode = "max" يعني الأعلى أحسن، و"min" يعني الأقل أحسن (زي الوقت أو عدد المحاولات).
 */
export function useBest(key: string, mode: "max" | "min" = "max") {
  const [best, setBest] = useState<number | null>(() => read(key))

  const submit = useCallback(
    (value: number) => {
      setBest((prev) => {
        const better = prev === null || (mode === "max" ? value > prev : value < prev)
        if (!better) return prev
        try {
          localStorage.setItem(key, String(value))
        } catch {
          /* التخزين مقفول في المتصفح — نكمّل عادي */
        }
        return value
      })
    },
    [key, mode],
  )

  return { best, submit }
}
