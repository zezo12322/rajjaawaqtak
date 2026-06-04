import { useEffect, useState } from "react"
import Section from "./ui/Section"
import Reveal from "./ui/Reveal"
import { PLANNER_SUGGESTIONS } from "../data/content"
import { useToast } from "./ui/Toast"

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6) // 6ص → 11م
const KEY = "rw_planner"

export default function Planner() {
  const [tasks, setTasks] = useState<Record<number, string>>({})
  const toast = useToast()

  useEffect(() => {
    try {
      setTasks(JSON.parse(localStorage.getItem(KEY) || "{}"))
    } catch {
      setTasks({})
    }
  }, [])

  function update(hour: number, val: string) {
    setTasks((prev) => {
      const next = { ...prev, [hour]: val }
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }

  function clearAll() {
    localStorage.removeItem(KEY)
    setTasks({})
    toast("تم مسح الجدول ✓")
  }

  const filled = Object.values(tasks).filter((v) => v && v.trim()).length

  return (
    <Section
      id="planner"
      icon="calendar"
      eyebrow="نظّم يومك"
      title="منظّم اليوم"
      sub="املأ يومك بحاجات تستاهل وقتك. الجدول بيتحفظ على جهازك تلقائياً."
    >
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {PLANNER_SUGGESTIONS.map((s) => (
              <span key={s} className="chip">{s}</span>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="card p-4 md:p-6">
            <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto pl-1">
              {HOURS.map((h) => {
                const label = `${String(h).padStart(2, "0")}:00`
                return (
                  <div
                    key={h}
                    className="flex items-stretch rounded-xl overflow-hidden bg-[#fdfbf7] border border-[var(--border)] focus-within:border-[var(--gold)] transition"
                  >
                    <span className="min-w-[64px] grid place-items-center bg-[var(--gold-soft)] text-[var(--gold-dark)] font-bold text-sm">
                      {label}
                    </span>
                    <input
                      value={tasks[h] || ""}
                      onChange={(e) => update(h, e.target.value)}
                      placeholder="هتعمل إيه في الساعة دي؟"
                      className="flex-1 bg-transparent border-0 outline-none px-4 py-3 text-[0.95rem] text-[var(--ink)] placeholder:text-[#b3a78f]"
                    />
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
              <p className="text-sm text-[var(--muted)]">
                خانات مملوءة: <b className="text-[var(--gold-dark)]">{filled}</b>
              </p>
              <button onClick={clearAll} className="text-sm font-bold text-[var(--muted)] hover:text-[var(--danger)] transition">
                مسح الكل
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
