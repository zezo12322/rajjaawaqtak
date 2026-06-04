import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Section from "./ui/Section"
import Reveal from "./ui/Reveal"
import Icon from "./ui/Icon"
import { supabase, type Advice } from "../lib/supabase"
import { useToast } from "./ui/Toast"

export default function AdviceWall() {
  const [advices, setAdvices] = useState<Advice[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const toast = useToast()

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from("rw_advices")
      .select("id,name,advice,created_at")
      .order("created_at", { ascending: false })
      .limit(60)
    if (!error && data) setAdvices(data as Advice[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

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
          {loading ? (
            <div className="text-center text-[var(--muted)] py-16">جارٍ التحميل...</div>
          ) : advices.length === 0 ? (
            <div className="text-center text-[var(--muted)] py-16">
              لسه مفيش نصايح — كن أول واحد يشارك!
            </div>
          ) : (
            <div className="columns-1 md:columns-2 gap-4 [column-fill:_balance]">
              <AnimatePresence>
                {advices.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.4) }}
                    className="card p-6 mb-4 break-inside-avoid border-r-[3px] border-r-[var(--gold)]"
                  >
                    <p className="leading-[2] text-[var(--brown)]">“{a.advice}”</p>
                    <p className="text-sm font-bold text-[var(--gold-dark)] mt-4">— {a.name}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
