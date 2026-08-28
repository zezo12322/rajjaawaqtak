import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Icon from "../ui/Icon"
import { useBest } from "./useBest"
import { MYTHS, MYTH_ROUND, MYTH_SECONDS, type MythItem } from "../../data/games"
import Intro from "./Intro"

type Phase = "idle" | "playing" | "over"

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MythGame() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [round, setRound] = useState<MythItem[]>([])
  const [step, setStep] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [answer, setAnswer] = useState<null | { picked: boolean; right: boolean }>(null)
  const [left, setLeft] = useState(MYTH_SECONDS)
  const { best, submit } = useBest("rw_game_myth_best")

  const timerRef = useRef<number | null>(null)
  const current = round[step]

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const reveal = useCallback(
    (picked: boolean | null) => {
      stopTimer()
      const item = round[step]
      if (!item) return
      const right = picked !== null && picked === item.fact
      setAnswer({ picked: picked ?? !item.fact, right })
      if (right) {
        setCorrect((c) => c + 1)
        setStreak((s) => {
          const next = s + 1
          setBestStreak((b) => Math.max(b, next))
          return next
        })
      } else {
        setStreak(0)
      }
    },
    [round, step, stopTimer],
  )

  /* مؤقّت السؤال */
  useEffect(() => {
    if (phase !== "playing" || answer) return
    const started = Date.now()
    timerRef.current = window.setInterval(() => {
      const remaining = MYTH_SECONDS - (Date.now() - started) / 1000
      if (remaining <= 0) reveal(null)
      else setLeft(Math.ceil(remaining))
    }, 120)
    return stopTimer
  }, [phase, step, answer, reveal, stopTimer])

  function start() {
    setRound(shuffled(MYTHS).slice(0, MYTH_ROUND))
    setStep(0)
    setCorrect(0)
    setStreak(0)
    setBestStreak(0)
    setAnswer(null)
    setLeft(MYTH_SECONDS)
    setPhase("playing")
  }

  function next() {
    if (step + 1 < round.length) {
      setStep(step + 1)
      setAnswer(null)
      setLeft(MYTH_SECONDS)
    } else {
      setPhase("over")
      submit(correct)
    }
  }

  const verdict = useMemo(() => {
    const pct = round.length ? (correct / round.length) * 100 : 0
    if (pct >= 90)
      return { title: "خبير رقمي 🏆", text: "معلوماتك ممتازة — إنت مؤهّل تشرحها لغيرك في المبادرة." }
    if (pct >= 70)
      return { title: "واعي 👏", text: "فاهم أغلب الحكاية. راجع اللي غلطت فيه وهتبقى مرجع." }
    if (pct >= 40)
      return { title: "في الطريق 🌱", text: "فيه خرافات لسه مصدّقها — وده طبيعي، أغلبنا كده." }
    return { title: "محتاج تعرف أكتر 📚", text: "عدّي على صفحة «اعرف واتحدى» وارجع العب تاني." }
  }, [correct, round.length])

  if (phase === "idle")
    return (
      <Intro
        onStart={start}
        best={best}
        title="حقيقة ولا خرافة"
        text="عشر جُمل عن الشاشات والوقت. حدّد كل واحدة حقيقة ولا خرافة قبل ما الوقت يخلص — وهتعرف السبب في كل مرة."
        icon="brain"
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
            <Icon name="medal" size={30} />
          </span>
          <p className="text-sm font-bold text-[var(--muted)] mb-1">نتيجتك</p>
          <div className="font-display text-5xl font-black text-[var(--gold)] mb-1">
            {correct}/{round.length}
          </div>
          <p className="text-sm text-[var(--muted)] mb-5">
            أطول سلسلة صح: <b className="text-[var(--gold-dark)]">{bestStreak}</b>
            {best !== null && <> · أعلى نتيجة ليك: <b className="text-[var(--gold-dark)]">{best}</b></>}
          </p>
          <h3 className="font-display text-2xl font-black text-[var(--ink)] mb-2">
            {verdict.title}
          </h3>
          <p className="text-[var(--text)] max-w-md mx-auto mb-7">{verdict.text}</p>
          <button onClick={start} className="btn btn-gold">
            <Icon name="refresh" size={17} strokeWidth={2.2} />
            جولة جديدة
          </button>
        </motion.div>
      </div>
    )

  const progress = Math.round((step / round.length) * 100)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <span className="chip">سؤال {step + 1} من {round.length}</span>
        <div className="flex-1 h-2 rounded-full bg-[var(--bg-tint)] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#e0982a,#9c5f06)" }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        {streak >= 2 && (
          <span className="chip !bg-[#fdecc8]">
            <Icon name="flame" size={14} strokeWidth={2.4} />
            {streak}
          </span>
        )}
      </div>

      <div className="card p-7 md:p-10 min-h-[340px] flex flex-col">
        {/* شريط الوقت */}
        <div className="h-1.5 rounded-full bg-[var(--bg-tint)] overflow-hidden mb-7">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: left <= 4 ? "#dc2626" : "linear-gradient(90deg,#e0982a,#9c5f06)",
            }}
            animate={{ width: answer ? "0%" : `${(left / MYTH_SECONDS) * 100}%` }}
            transition={{ ease: "linear", duration: 0.15 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            <h3 className="text-lg md:text-xl font-extrabold leading-[1.9] text-[var(--ink)] mb-7 flex-1">
              «{current?.text}»
            </h3>

            {!answer ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => reveal(true)}
                  className="btn !py-4 bg-[#f0f9f1] border-[#bfe5c4] text-[#15803d] hover:border-[var(--ok)] hover:-translate-y-0.5"
                >
                  <Icon name="check" size={19} strokeWidth={2.6} />
                  حقيقة
                </button>
                <button
                  onClick={() => reveal(false)}
                  className="btn !py-4 bg-[#fdf2f2] border-[#f3cccc] text-[#b91c1c] hover:border-[var(--danger)] hover:-translate-y-0.5"
                >
                  <Icon name="close" size={19} strokeWidth={2.6} />
                  خرافة
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div
                  className={`rounded-2xl p-5 mb-4 border ${
                    answer.right
                      ? "bg-[#f0f9f1] border-[#bfe5c4]"
                      : "bg-[#fdf2f2] border-[#f3cccc]"
                  }`}
                >
                  <p
                    className="font-extrabold mb-2 flex items-center gap-2"
                    style={{ color: answer.right ? "#15803d" : "#b91c1c" }}
                  >
                    <Icon name={answer.right ? "check" : "close"} size={18} strokeWidth={2.6} />
                    {answer.right ? "إجابة صحيحة" : "إجابة غلط"} — الجملة دي{" "}
                    {current.fact ? "حقيقة" : "خرافة"}
                  </p>
                  <p className="text-[var(--text)] text-[0.95rem] leading-[1.9]">{current.why}</p>
                </div>
                <button onClick={next} className="btn btn-gold w-full">
                  {step + 1 < round.length ? "السؤال اللي بعده" : "شوف نتيجتك"}
                  <Icon name="arrowLeft" size={17} strokeWidth={2.2} />
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
