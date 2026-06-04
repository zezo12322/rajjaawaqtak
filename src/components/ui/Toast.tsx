import { createContext, useCallback, useContext, useState } from "react"
import type { ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"

type ToastCtx = (msg: string) => void
const Ctx = createContext<ToastCtx>(() => {})

export function useToast() {
  return useContext(Ctx)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null)

  const show = useCallback((m: string) => {
    setMsg(m)
    window.clearTimeout((show as any)._t)
    ;(show as any)._t = window.setTimeout(() => setMsg(null), 2800)
  }, [])

  return (
    <Ctx.Provider value={show}>
      {children}
      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: 60, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 60, x: "-50%" }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed bottom-6 left-1/2 z-[10000] rounded-2xl px-6 py-3 font-extrabold text-[#1a1206] shadow-xl"
            style={{ background: "linear-gradient(135deg,#fcd34d,#d97706)" }}
          >
            {msg}
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  )
}
