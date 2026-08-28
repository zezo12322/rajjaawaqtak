import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Link } from "react-router-dom"
import Icon from "../ui/Icon"
import Intro from "./Intro"
import { useBest } from "./useBest"
import { SCENES, dayEnding, type SceneChoice } from "../../data/games"

type Phase = "idle" | "playing" | "over"
type Meters = { time: number; focus: number; calm: number }

const ZERO: Meters = { time: 0, focus: 0, calm: 0 }

/* أقصى مجموع ممكن لكل عدّاد = مجموع أعلى اختيار في كل مشهد */
const MAX: Meters = SCENES.reduce(
  (acc, s) => ({
    time: acc.time + Math.max(...s.choices.map((c) => c.time)),
    focus: acc.focus + Math.max(...s.choices.map((c) => c.focus)),
    calm: acc.calm + Math.max(...s.choices.map((c) => c.calm)),
  }),
  { ...ZERO },
)

export default function DayGame() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [step, setStep] = useState(0)
  const [meters, setMeters] = useState<Meters>(ZERO)
  const [picked, setPicked] = useState<SceneChoice | null>(null)
  const { best, submit } = useBest("rw_game_day_best")

  const scene = SCENES[step]
  const total = meters.time + meters.focus + meters.calm

  function start() {
    setStep(0)
    setMeters(ZERO)
    setPicked(null)
    setPhase("playing")
  }

  function choose(c: SceneChoice) {
    if (picked) return
    setPicked(c)
    setMeters((m) => ({
      time: m.time + c.time,
      focus: m.focus + c.focus,
      calm: m.calm + c.calm,
    }))
  }

  function next() {
    if (step + 1 < SCENES.length) {
      setStep(step + 1)
      setPicked(null)
    } else {
      setPhase("over")
      submit(total)
    }
  }

  const ending = useMemo(() => dayEnding(total), [total])

  if (phase === "idle")
    return (
      <Intro
        onStart={start}
        best={best}
        bestLabel="أحسن يوم عشته هنا"
        icon="compass"
        title="يوم في حياتك"
        text="ستّ لحظات في يوم عادي — من المنبّه لحد ما تنام. كل اختيار بيأثّر على وقتك وتركيزك وراحتك. عيش اليوم وشوف بينتهي إزاي."
      />
    )

  if (phase === "over")
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 md:p-12 text-center"
        >
          <span className="icon-badge w-16 h-16 mx-auto mb-5">
            <Icon name="compass" size={30} />
          </span>
          <p className="text-sm font-bold text-[var(--muted)] mb-2">آخر اليوم</p>
          <h3 className="font-display text-3xl font-black mb-4" style={{ color: ending.color }}>
            {ending.title}
          </h3>
          <p className="text-[var(--text)] max-w-md mx-auto mb-7 leading-[2]">{ending.text}</p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <Meter label="وقتك" value={meters.time} max={MAX.time} icon="clock" />
            <Meter label="تركيزك" value={meters.focus} max={MAX.focus} icon="target" />
            <Meter label="راحتك" value={meters.calm} max={MAX.calm} icon="heart" />
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={start} className="btn btn-gold">
              <Icon name="refresh" size={17} strokeWidth={2.2} />
              عيش اليوم تاني
            </button>
            <Link to="/awareness#challenge" className="btn btn-ghost">
              <Icon name="flame" size={17} strokeWidth={2.2} />
              ابدأ تحدي الـ٧ أيام
            </Link>
          </div>
        </motion.div>
      </div>
    )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Meter label="وقتك" value={meters.time} max={MAX.time} icon="clock" compact />
        <Meter label="تركيزك" value={meters.focus} max={MAX.focus} icon="target" compact />
        <Meter label="راحتك" value={meters.calm} max={MAX.calm} icon="heart" compact />
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)] bg-[#fdfbf7]">
          <span className="icon-badge w-10 h-10">
            <Icon name={scene.icon} size={19} />
          </span>
          <div className="flex-1">
            <div className="font-extrabold text-[var(--ink)] leading-tight">{scene.title}</div>
            <div className="text-xs text-[var(--muted)] font-semibold">{scene.time}</div>
          </div>
          <span className="chip">{step + 1} / {SCENES.length}</span>
        </div>

        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-[1.02rem] leading-[2] text-[var(--brown)] mb-7">{scene.text}</p>

              <div className="flex flex-col gap-3">
                {scene.choices.map((c) => {
                  const isPicked = picked === c
                  const dimmed = picked && !isPicked
                  return (
                    <button
                      key={c.label}
                      onClick={() => choose(c)}
                      disabled={!!picked}
                      className={`text-right px-5 py-4 rounded-2xl border font-semibold transition ${
                        isPicked
                          ? "bg-[var(--gold-soft)] border-[var(--gold)] text-[var(--gold-dark)]"
                          : dimmed
                            ? "bg-white border-[var(--border)] text-[var(--muted)] opacity-55"
                            : "bg-[#fdfbf7] border-[var(--border-strong)] text-[var(--brown)] hover:border-[var(--gold)] hover:bg-[var(--gold-soft)]"
                      }`}
                    >
                      {c.label}
                    </button>
                  )
                })}
              </div>

              <AnimatePresence>
                {picked && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="rounded-2xl bg-[#fdfbf7] border border-[var(--border-strong)] p-5 mt-5">
                      <p className="text-[var(--text)] leading-[1.9] mb-3">{picked.feedback}</p>
                      <div className="flex flex-wrap gap-2">
                        <Delta label="وقت" value={picked.time} />
                        <Delta label="تركيز" value={picked.focus} />
                        <Delta label="راحة" value={picked.calm} />
                      </div>
                    </div>
                    <button onClick={next} className="btn btn-gold w-full mt-4">
                      {step + 1 < SCENES.length ? "كمّل اليوم" : "شوف آخر اليوم"}
                      <Icon name="arrowLeft" size={17} strokeWidth={2.2} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function Delta({ label, value }: { label: string; value: number }) {
  if (value === 0)
    return (
      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[var(--bg-tint)] text-[var(--muted)]">
        {label} · بدون تغيير
      </span>
    )
  const up = value > 0
  return (
    <span
      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
        up ? "bg-[#f0f9f1] text-[#15803d]" : "bg-[#fdf2f2] text-[#b91c1c]"
      }`}
    >
      {label} {up ? "+" : "−"}
      {Math.abs(value)}
    </span>
  )
}

function Meter({
  label,
  value,
  max,
  icon,
  compact = false,
}: {
  label: string
  value: number
  max: number
  icon: string
  compact?: boolean
}) {
  /* بنحوّل القيمة (اللي ممكن تكون سالبة) لنسبة من 0 لـ100 */
  const pct = Math.max(0, Math.min(100, ((value + max) / (max * 2)) * 100))
  return (
    <div className={`card text-center ${compact ? "px-2 py-2.5" : "p-4"}`}>
      <div className="flex items-center justify-center gap-1.5 text-[var(--muted)] mb-2">
        <Icon name={icon} size={14} strokeWidth={2.2} />
        <span className="text-[0.7rem] md:text-xs font-bold">{label}</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--bg-tint)] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background:
              value < 0 ? "#dc2626" : "linear-gradient(90deg,#e0982a,#9c5f06)",
          }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      {!compact && (
        <div className="text-sm font-extrabold text-[var(--ink)] mt-2">
          {value > 0 ? "+" : ""}
          {value}
        </div>
      )}
    </div>
  )
}
