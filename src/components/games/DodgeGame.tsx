import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Icon from "../ui/Icon"
import { useBest } from "./useBest"
import { DODGE_CONFIG, REAL_BUBBLES, TRAP_BUBBLES } from "../../data/games"
import { useToast } from "../ui/Toast"

/* مواضع ثابتة (عمودين × ٤ صفوف) عشان الفقاعات ما تتراكبش على بعض */
const SLOTS = [
  { x: 27, y: 15 },
  { x: 73, y: 15 },
  { x: 27, y: 38 },
  { x: 73, y: 38 },
  { x: 27, y: 62 },
  { x: 73, y: 62 },
  { x: 27, y: 85 },
  { x: 73, y: 85 },
]

type Live = {
  id: number
  slot: number
  label: string
  icon: string
  kind: "trap" | "real"
  expires: number
}

type Phase = "idle" | "playing" | "over"

const { duration, lives: MAX_LIVES, realPoints, trapPenalty, trapRatioStart, trapRatioEnd } =
  DODGE_CONFIG

export default function DodgeGame() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [bubbles, setBubbles] = useState<Live[]>([])
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [left, setLeft] = useState(duration)
  const [combo, setCombo] = useState(0)
  const [shake, setShake] = useState(0)
  const { best, submit } = useBest("rw_game_dodge_best")
  const toast = useToast()

  const ref = useRef<Live[]>([])
  const scoreRef = useRef(0)
  const livesRef = useRef(MAX_LIVES)
  const idRef = useRef(0)
  const startRef = useRef(0)
  const nextSpawnRef = useRef(0)

  const sync = useCallback(() => setBubbles([...ref.current]), [])

  const finish = useCallback(() => {
    setPhase("over")
    ref.current = []
    setBubbles([])
    submit(Math.max(0, scoreRef.current))
  }, [submit])

  /* نخزّن النقاط والقلوب في refs كمان عشان حلقة اللعبة ما تحتاجش تتبني من أول وجديد */
  const bump = useCallback((delta: number) => {
    setScore((s) => {
      const next = Math.max(0, s + delta)
      scoreRef.current = next
      return next
    })
  }, [])

  const loseLives = useCallback((n: number) => {
    livesRef.current = Math.max(0, livesRef.current - n)
    setLives(livesRef.current)
  }, [])

  function start() {
    ref.current = []
    idRef.current = 0
    scoreRef.current = 0
    livesRef.current = MAX_LIVES
    startRef.current = Date.now()
    nextSpawnRef.current = Date.now() + 400
    setBubbles([])
    setScore(0)
    setCombo(0)
    setLives(MAX_LIVES)
    setLeft(duration)
    setPhase("playing")
  }

  /* حلقة اللعبة: تنظيف المنتهي + توليد فقاعات جديدة + العدّاد */
  useEffect(() => {
    if (phase !== "playing") return

    const tick = window.setInterval(() => {
      const now = Date.now()
      const elapsed = (now - startRef.current) / 1000
      const remaining = Math.max(0, duration - elapsed)
      setLeft(Math.ceil(remaining))

      /* الفقاعات اللي عدّى وقتها */
      const expired = ref.current.filter((b) => now >= b.expires)
      if (expired.length) {
        ref.current = ref.current.filter((b) => now < b.expires)
        const missed = expired.filter((b) => b.kind === "real").length
        if (missed) {
          setCombo(0)
          loseLives(missed)
        }
        sync()
      }

      /* توليد فقاعة جديدة في خانة فاضية */
      if (now >= nextSpawnRef.current && remaining > 0) {
        const used = new Set(ref.current.map((b) => b.slot))
        const free = SLOTS.map((_, i) => i).filter((i) => !used.has(i))
        if (free.length && ref.current.length < 4) {
          const progress = Math.min(1, elapsed / duration)
          const trapRatio = trapRatioStart + (trapRatioEnd - trapRatioStart) * progress
          const isTrap = Math.random() < trapRatio
          const pool = isTrap ? TRAP_BUBBLES : REAL_BUBBLES
          const pick = pool[Math.floor(Math.random() * pool.length)]
          const life = 2600 - 900 * progress /* بتقصر مع الوقت */
          ref.current = [
            ...ref.current,
            {
              id: ++idRef.current,
              slot: free[Math.floor(Math.random() * free.length)],
              label: pick.label,
              icon: pick.icon,
              kind: pick.kind,
              expires: now + life,
            },
          ]
          sync()
        }
        nextSpawnRef.current = now + (900 - 380 * Math.min(1, elapsed / duration))
      }

      /* اللعبة بتخلص لما الوقت ينتهي أو القلوب تخلص */
      if (remaining <= 0 || livesRef.current === 0) finish()
    }, 100)

    return () => window.clearInterval(tick)
  }, [phase, sync, finish, loseLives])

  function pop(b: Live) {
    if (phase !== "playing") return
    ref.current = ref.current.filter((x) => x.id !== b.id)
    sync()
    if (b.kind === "real") {
      setCombo((c) => {
        const next = c + 1
        if (next === 5) toast("٥ فرص ورا بعض! 🔥")
        return next
      })
      bump(realPoints + Math.min(combo, 5))
    } else {
      setCombo(0)
      setShake((n) => n + 1)
      bump(-trapPenalty)
      loseLives(1)
    }
  }

  const isNewBest = phase === "over" && best !== null && score >= best && score > 0

  return (
    <div className="max-w-2xl mx-auto">
      {/* شريط الحالة */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <Stat label="نقاطك" value={String(score)} />
        <Stat label="الوقت" value={`${left}ث`} />
        <Stat
          label="فرص فاتت"
          value={"♥".repeat(lives) + "·".repeat(MAX_LIVES - lives)}
        />
        <Stat label="أعلى نتيجة" value={best === null ? "—" : String(best)} />
      </div>

      <motion.div
        key={shake}
        animate={shake ? { x: [0, -9, 9, -5, 0] } : {}}
        transition={{ duration: 0.32 }}
        className="card relative overflow-hidden h-[430px] md:h-[470px]"
        style={{ background: "linear-gradient(160deg,#fffdf9,#f7f0e4)" }}
      >
        {/* خلفية شبكية خفيفة */}
        <div
          className="absolute inset-0 opacity-[0.5] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(194,121,10,.12) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <AnimatePresence>
          {phase === "playing" &&
            bubbles.map((b) => {
              const slot = SLOTS[b.slot]
              const isReal = b.kind === "real"
              return (
                <motion.button
                  key={b.id}
                  onClick={() => pop(b)}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 420, damping: 24 }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 max-w-[42%] flex items-center gap-2 px-3.5 py-2.5 rounded-2xl font-extrabold text-[0.82rem] md:text-[0.9rem] leading-tight text-right shadow-[var(--shadow-md)] border ${
                    isReal
                      ? "bg-gradient-to-br from-[#e0982a] to-[#9c5f06] text-white border-transparent"
                      : "bg-white text-[#8a3b3b] border-[#f0c9c9]"
                  }`}
                  style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                >
                  <Icon name={b.icon} size={17} strokeWidth={2.2} />
                  <span>{b.label}</span>
                </motion.button>
              )
            })}
        </AnimatePresence>

        {/* شاشة البداية / النهاية */}
        <AnimatePresence>
          {phase !== "playing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 grid place-items-center bg-[rgba(255,253,249,0.94)] backdrop-blur-sm px-6 text-center"
            >
              {phase === "idle" ? (
                <div>
                  <span className="icon-badge w-16 h-16 mx-auto mb-5">
                    <Icon name="bellOff" size={30} />
                  </span>
                  <h3 className="font-display text-2xl font-black text-[var(--ink)] mb-3">
                    سيبها ترنّ
                  </h3>
                  <p className="text-[var(--muted)] max-w-sm mx-auto mb-2 text-[0.95rem]">
                    هتلاقي حاجتين بيظهروا قدّامك:
                  </p>
                  <div className="flex flex-col gap-2 items-center mb-6 text-sm font-bold">
                    <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-white bg-gradient-to-br from-[#e0982a] to-[#9c5f06]">
                      <Icon name="check" size={16} strokeWidth={2.6} />
                      الذهبي = فرصة حقيقية — اضغط عليها
                    </span>
                    <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-[#8a3b3b] border border-[#f0c9c9]">
                      <Icon name="close" size={16} strokeWidth={2.6} />
                      الأبيض = إشعار — سيبه يعدّي لوحده
                    </span>
                  </div>
                  <button onClick={start} className="btn btn-gold">
                    <Icon name="play" size={17} />
                    يلا نبدأ
                  </button>
                </div>
              ) : (
                <div>
                  <span className="icon-badge w-16 h-16 mx-auto mb-4">
                    <Icon name={isNewBest ? "trophy" : "timer"} size={30} />
                  </span>
                  <p className="text-sm font-bold text-[var(--muted)] mb-1">
                    {lives === 0 ? "فاتتك فرص كتير" : "خلص الوقت"}
                  </p>
                  <div className="font-display text-5xl font-black text-[var(--gold)] mb-2">
                    {score}
                  </div>
                  {isNewBest && (
                    <p className="font-extrabold text-[var(--ok)] mb-2">
                      أعلى نتيجة ليك 🎉
                    </p>
                  )}
                  <p className="text-[var(--text)] max-w-sm mx-auto mb-6 text-[0.95rem]">
                    {score >= 120
                      ? "تحكّم ممتاز! الإشعار مش بيحرّكك — إنت اللي بتقرّر."
                      : score >= 60
                        ? "كويس، بس لسه إيدك بتسبقك على الإشعار. جرّب تاني."
                        : "الإشعارات كسبتك المرة دي — ودي بالظبط اللي بتحصل في الحقيقة."}
                  </p>
                  <button onClick={start} className="btn btn-gold">
                    <Icon name="refresh" size={17} strokeWidth={2.2} />
                    العب تاني
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="text-center text-xs text-[var(--muted)] mt-4">
        كل فرصة حقيقية تفوتك = قلب. وكل إشعار تضغط عليه = نقاط تروح. زي الواقع بالظبط.
      </p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card px-2 py-2.5 text-center">
      <div className="font-display font-black text-[var(--ink)] text-base md:text-lg leading-none">
        {value}
      </div>
      <div className="text-[0.68rem] md:text-xs text-[var(--muted)] mt-1.5 font-semibold">
        {label}
      </div>
    </div>
  )
}
