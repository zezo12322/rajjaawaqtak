import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Icon from "../ui/Icon"
import Intro from "./Intro"
import { useBest } from "./useBest"
import { MEMORY_CARDS, MEMORY_PAIRS } from "../../data/games"

type Tile = { uid: number; key: string; label: string; icon: string }
type Phase = "idle" | "playing" | "over"

function buildDeck(): Tile[] {
  const picked = [...MEMORY_CARDS].sort(() => Math.random() - 0.5).slice(0, MEMORY_PAIRS)
  const deck = [...picked, ...picked].map((c, i) => ({ ...c, uid: i }))
  return deck.sort(() => Math.random() - 0.5)
}

export default function MemoryGame() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [deck, setDeck] = useState<Tile[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [locked, setLocked] = useState(false)
  const { best, submit } = useBest("rw_game_memory_best", "min")

  const startedRef = useRef(0)
  const timeoutRef = useRef<number | null>(null)

  const done = phase === "playing" && matched.length === MEMORY_PAIRS

  /* المؤقّت */
  useEffect(() => {
    if (phase !== "playing") return
    const t = window.setInterval(
      () => setSeconds(Math.floor((Date.now() - startedRef.current) / 1000)),
      500,
    )
    return () => window.clearInterval(t)
  }, [phase])

  /* انتهاء الجولة */
  useEffect(() => {
    if (!done) return
    const total = Math.floor((Date.now() - startedRef.current) / 1000)
    setSeconds(total)
    setPhase("over")
    submit(moves)
  }, [done, moves, submit])

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    },
    [],
  )

  const start = useCallback(() => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    setDeck(buildDeck())
    setFlipped([])
    setMatched([])
    setMoves(0)
    setSeconds(0)
    setLocked(false)
    startedRef.current = Date.now()
    setPhase("playing")
  }, [])

  function flip(tile: Tile) {
    if (locked || phase !== "playing") return
    if (flipped.includes(tile.uid) || matched.includes(tile.key)) return

    const next = [...flipped, tile.uid]
    setFlipped(next)
    if (next.length < 2) return

    setMoves((m) => m + 1)
    const [a, b] = next.map((uid) => deck.find((t) => t.uid === uid)!)
    if (a.key === b.key) {
      setMatched((prev) => [...prev, a.key])
      setFlipped([])
    } else {
      setLocked(true)
      timeoutRef.current = window.setTimeout(() => {
        setFlipped([])
        setLocked(false)
      }, 750)
    }
  }

  const grade = useMemo(() => {
    const perfect = MEMORY_PAIRS
    if (moves <= perfect + 2) return "ذاكرة حديد 🧠"
    if (moves <= perfect + 6) return "تركيز ممتاز 👏"
    if (moves <= perfect + 12) return "كويس — والتمرين بيحسّن 🌱"
    return "خلّصتها! والمرة الجاية هتبقى أسرع"
  }, [moves])

  if (phase === "idle")
    return (
      <Intro
        onStart={start}
        best={best}
        bestLabel="أقل عدد محاولات ليك"
        icon="brain"
        title="شغّل دماغك"
        text="ستّ أزواج من حاجات تستاهل وقتك. طابق كل زوج بأقل عدد محاولات — تمرين صغير لذاكرة اتعوّدت على التمرير السريع."
      />
    )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid grid-cols-4 gap-2 mb-4">
        <Stat label="محاولات" value={String(moves)} />
        <Stat label="الوقت" value={`${seconds}ث`} />
        <Stat label="طابقت" value={`${matched.length}/${MEMORY_PAIRS}`} />
        <Stat label="أقل محاولات" value={best === null ? "—" : String(best)} />
      </div>

      <div className="card p-4 md:p-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 md:gap-3">
          {deck.map((tile) => {
            const isOpen = flipped.includes(tile.uid) || matched.includes(tile.key)
            const isMatched = matched.includes(tile.key)
            return (
              <button
                key={tile.uid}
                onClick={() => flip(tile)}
                aria-label={isOpen ? tile.label : "كارت مقلوب"}
                className="relative aspect-[3/4] rounded-2xl"
                style={{ perspective: 800 }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotateY: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* ظهر الكارت */}
                  <span
                    className="absolute inset-0 rounded-2xl grid place-items-center border border-[var(--border-strong)] shadow-[var(--shadow-sm)]"
                    style={{
                      backfaceVisibility: "hidden",
                      background: "linear-gradient(150deg,#fffdf9,#f3ece0)",
                    }}
                  >
                    <Icon name="sparkles" size={24} className="text-[var(--gold)] opacity-45" />
                  </span>
                  {/* وش الكارت */}
                  <span
                    className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-1.5 px-1 text-center border ${
                      isMatched
                        ? "bg-[#f0f9f1] border-[#bfe5c4] text-[#15803d]"
                        : "border-transparent text-white"
                    }`}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      background: isMatched
                        ? undefined
                        : "linear-gradient(150deg,#e0982a,#9c5f06)",
                    }}
                  >
                    <Icon name={tile.icon} size={23} strokeWidth={2} />
                    <span className="text-[0.7rem] md:text-xs font-extrabold leading-tight">
                      {tile.label}
                    </span>
                  </span>
                </motion.div>
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {phase === "over" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-7 mt-4 text-center"
          >
            <span className="icon-badge w-14 h-14 mx-auto mb-4">
              <Icon name="trophy" size={26} />
            </span>
            <h3 className="font-display text-2xl font-black text-[var(--ink)] mb-2">{grade}</h3>
            <p className="text-[var(--text)] mb-1">
              خلّصت في <b className="text-[var(--gold-dark)]">{moves}</b> محاولة و
              <b className="text-[var(--gold-dark)]"> {seconds}</b> ثانية.
            </p>
            <p className="text-[var(--muted)] text-[0.93rem] max-w-md mx-auto mb-6">
              الذاكرة عضلة — بتضعف مع التمرير السريع وبتقوى لما تدّيها حاجة تركّز فيها.
            </p>
            <button onClick={start} className="btn btn-gold">
              <Icon name="refresh" size={17} strokeWidth={2.2} />
              جولة جديدة
            </button>
          </motion.div>
        )}
      </AnimatePresence>
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
