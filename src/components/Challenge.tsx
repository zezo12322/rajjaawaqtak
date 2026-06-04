import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Section from "./ui/Section"
import Reveal from "./ui/Reveal"
import Icon from "./ui/Icon"
import { CHALLENGE_DAYS } from "../data/content"
import { useToast } from "./ui/Toast"

const KEY = "rw_challenge_done"

export default function Challenge() {
  const [done, setDone] = useState<number[]>([])
  const toast = useToast()

  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem(KEY) || "[]"))
    } catch {
      setDone([])
    }
  }, [])

  function toggle(day: number) {
    setDone((prev) => {
      const next = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
      localStorage.setItem(KEY, JSON.stringify(next))
      if (!prev.includes(day)) {
        toast(next.length === 7 ? "مبروك! كمّلت التحدي كله 🎉" : "خطوة جديدة في طريقك ✓")
      }
      return next
    })
  }

  const progress = Math.round((done.length / CHALLENGE_DAYS.length) * 100)

  return (
    <Section
      id="challenge"
      icon="flame"
      eyebrow="تحدي الـ7 أيام"
      title="غيّر عادتك في أسبوع"
      sub="خطوة صغيرة كل يوم. علّم على كل تحدي تخلّصه — التقدّم بيتحفظ على جهازك."
    >
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="card p-5 mb-6 flex items-center gap-4">
            <div className="font-display text-3xl font-black text-[var(--gold)]">{progress}%</div>
            <div className="flex-1">
              <div className="h-2.5 rounded-full bg-[var(--bg-tint)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg,#e0982a,#9c5f06)" }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-[var(--muted)] mt-2">
                خلّصت {done.length} من {CHALLENGE_DAYS.length} أيام
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-3">
          {CHALLENGE_DAYS.map((d, i) => {
            const isDone = done.includes(d.day)
            return (
              <Reveal key={d.day} delay={i * 0.04}>
                <button
                  onClick={() => toggle(d.day)}
                  className={`w-full text-right rounded-2xl p-5 border transition flex gap-4 items-start ${
                    isDone
                      ? "bg-[#f0f9f1] border-[#bfe5c4]"
                      : "card hover:border-[var(--gold)] hover:shadow-[var(--shadow-md)]"
                  }`}
                >
                  <span
                    className={`w-10 h-10 rounded-xl grid place-items-center font-black flex-shrink-0 transition ${
                      isDone ? "bg-[var(--ok)] text-white" : "bg-[var(--gold-soft)] text-[var(--gold-dark)]"
                    }`}
                  >
                    {isDone ? <Icon name="check" size={20} strokeWidth={2.6} /> : d.day}
                  </span>
                  <span>
                    <span className="block font-extrabold mb-1 text-[var(--ink)]">
                      اليوم {d.day}: {d.title}
                    </span>
                    <span className="block text-sm text-[var(--muted)] leading-relaxed">{d.text}</span>
                  </span>
                </button>
              </Reveal>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
