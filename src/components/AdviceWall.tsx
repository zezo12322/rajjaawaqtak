import { useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Section from "./ui/Section"
import Reveal from "./ui/Reveal"
import Icon from "./ui/Icon"
import { supabase, type Advice } from "../lib/supabase"
import { ADVICE_TAGS, SEED_ADVICES, seedDate, type AdviceTag } from "../data/seedAdvices"
import { useToast } from "./ui/Toast"

/** عنصر موحّد على الحائط — سواء جاي من قاعدة البيانات أو من نصايح المبادرة */
type WallItem = {
  id: string
  name: string
  city?: string
  advice: string
  tag?: AdviceTag
  created_at: string
  likes: number
}

const PAGE = 12
const LIKES_KEY = "rw_advice_likes"

const SEED_ITEMS: WallItem[] = SEED_ADVICES.map((s) => ({
  id: s.id,
  name: s.name,
  city: s.city,
  advice: s.advice,
  tag: s.tag,
  created_at: seedDate(s.days),
  likes: s.likes,
}))

function readLikes(): string[] {
  try {
    const raw = localStorage.getItem(LIKES_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

/** صياغة العدد بالعربي: نصيحة / نصيحتين / نصايح */
function countLabel(n: number) {
  if (n === 1) return "نصيحة واحدة"
  if (n === 2) return "نصيحتين"
  if (n >= 3 && n <= 10) return `${n} نصايح`
  return `${n} نصيحة`
}

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days <= 0) return "النهاردة"
  if (days === 1) return "إمبارح"
  if (days < 7) return `من ${days} أيام`
  if (days < 30) return `من ${Math.floor(days / 7)} أسابيع`
  return `من ${Math.floor(days / 30)} شهور`
}

export default function AdviceWall() {
  const [rows, setRows] = useState<WallItem[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const [filter, setFilter] = useState<AdviceTag | "الكل">("الكل")
  const [shown, setShown] = useState(PAGE)
  const [liked, setLiked] = useState<string[]>(readLikes)
  const toast = useToast()

  /* بنجيب مشاركات الزوّار من Supabase — نصايح المبادرة ظاهرة من غير انتظار */
  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("rw_advices")
      .select("id,name,advice,created_at")
      .order("created_at", { ascending: false })
      .limit(120)
    if (!error && data) {
      setRows(
        (data as Advice[]).map((a) => ({
          id: a.id,
          name: a.name,
          advice: a.advice,
          created_at: a.created_at,
          likes: 0,
        })),
      )
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  /* مشاركات الزوّار فوق، وبعدها نصايح المبادرة — الكل مرتّب بالأحدث */
  const all = useMemo(
    () =>
      [...rows, ...SEED_ITEMS].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [rows],
  )

  const filtered = useMemo(
    () => (filter === "الكل" ? all : all.filter((a) => a.tag === filter)),
    [all, filter],
  )

  const visible = filtered.slice(0, shown)

  function pickFilter(t: AdviceTag | "الكل") {
    setFilter(t)
    setShown(PAGE)
  }

  function toggleLike(id: string) {
    setLiked((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      try {
        localStorage.setItem(LIKES_KEY, JSON.stringify(next))
      } catch {
        /* التخزين مقفول في المتصفح — نكمّل عادي */
      }
      return next
    })
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const n = name.trim()
    const t = text.trim()
    if (!n || t.length < 3) {
      toast("اكتب نصيحتك واسمك الأول ⚠")
      return
    }
    setSending(true)
    const { error } = await supabase.from("rw_advices").insert({ name: n, advice: t })
    setSending(false)
    if (error) {
      toast("حصل خطأ، حاول تاني ⚠")
      return
    }
    setText("")
    setName("")
    setFilter("الكل")
    setShown(PAGE)
    toast("تم نشر نصيحتك، شكراً ليك! ✓")
    load()
  }

  return (
    <Section
      id="advices"
      icon="message"
      eyebrow="صوت المجتمع"
      title="نصايح من ناس زيّك"
      sub="شارك حاجة ساعدتك تقلّل استخدام الموبايل — ممكن تكون سبب في تغيير حياة حد تاني."
    >
      <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
        <Reveal>
          <form onSubmit={submit} className="card p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 mb-4">
              <span className="icon-badge w-9 h-9">
                <Icon name="send" size={17} />
              </span>
              <h3 className="font-extrabold text-lg text-[var(--ink)]">شارك نصيحتك</h3>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="اكتب نصيحتك هنا..."
              maxLength={600}
              className="field min-h-[120px] resize-y mb-3"
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسمك"
              maxLength={60}
              className="field mb-4"
            />
            <button type="submit" disabled={sending} className="btn btn-gold w-full disabled:opacity-60">
              {sending ? "جارٍ النشر..." : "انشر النصيحة"}
            </button>
            <p className="text-xs text-[var(--muted)] mt-3 text-center">
              نصيحتك بتظهر للجميع — اكتب حاجة مفيدة ومحترمة 🙏
            </p>
          </form>
        </Reveal>

        <div>
          {/* فلاتر التصنيف */}
          <div className="flex flex-wrap gap-2 mb-5">
            {(["الكل", ...ADVICE_TAGS] as const).map((t) => {
              const on = filter === t
              return (
                <button
                  key={t}
                  onClick={() => pickFilter(t)}
                  aria-pressed={on}
                  className={`text-[0.82rem] font-bold px-3.5 py-1.5 rounded-full border transition ${
                    on
                      ? "bg-[var(--gold)] text-white border-transparent shadow-[var(--shadow-sm)]"
                      : "bg-white text-[var(--brown)] border-[var(--border-strong)] hover:border-[var(--gold)] hover:text-[var(--gold-dark)]"
                  }`}
                >
                  {t}
                </button>
              )
            })}
          </div>

          <p className="text-sm text-[var(--muted)] mb-4">
            <b className="text-[var(--gold-dark)]">{countLabel(filtered.length)}</b>
            {filter !== "الكل" && <> في «{filter}»</>}
          </p>

          {loading && rows.length === 0 && filtered.length === 0 ? (
            <div className="text-center text-[var(--muted)] py-16">جارٍ التحميل...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-[var(--muted)] py-16">
              مفيش نصايح في التصنيف ده لسه — كن أول واحد يشارك!
            </div>
          ) : (
            <>
              <div className="columns-1 md:columns-2 gap-4 [column-fill:_balance]">
                <AnimatePresence mode="popLayout">
                  {visible.map((a, i) => {
                    const isLiked = liked.includes(a.id)
                    return (
                      <motion.div
                        key={a.id}
                        layout
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ delay: Math.min((i % PAGE) * 0.03, 0.35) }}
                        className="card p-6 mb-4 break-inside-avoid border-r-[3px] border-r-[var(--gold)]"
                      >
                        {a.tag && (
                          <span className="inline-block text-[0.7rem] font-bold text-[var(--gold-dark)] bg-[var(--gold-soft)] px-2.5 py-1 rounded-full mb-3">
                            {a.tag}
                          </span>
                        )}
                        <p className="leading-[2] text-[var(--brown)]">“{a.advice}”</p>

                        <div className="flex items-end justify-between gap-3 mt-4 pt-3 border-t border-[var(--border)]">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[var(--gold-dark)] truncate">
                              — {a.name}
                            </p>
                            <p className="text-[0.72rem] text-[var(--muted)]">
                              {a.city ? `${a.city} · ` : ""}
                              {timeAgo(a.created_at)}
                            </p>
                          </div>
                          <button
                            onClick={() => toggleLike(a.id)}
                            aria-pressed={isLiked}
                            aria-label="نصيحة مفيدة"
                            className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full border transition flex-shrink-0 ${
                              isLiked
                                ? "bg-[var(--gold-soft)] border-[var(--gold)] text-[var(--gold-dark)]"
                                : "bg-white border-[var(--border-strong)] text-[var(--muted)] hover:border-[var(--gold)]"
                            }`}
                          >
                            <Icon name="heart" size={14} strokeWidth={2.3} />
                            {a.likes + (isLiked ? 1 : 0)}
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              {shown < filtered.length && (
                <div className="text-center mt-4">
                  <button onClick={() => setShown((s) => s + PAGE)} className="btn btn-ghost">
                    <Icon name="chevronDown" size={18} strokeWidth={2.2} />
                    اعرض نصايح أكتر ({filtered.length - shown})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Section>
  )
}
