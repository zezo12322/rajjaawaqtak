import { useState } from "react"
import { motion } from "framer-motion"
import Section from "./ui/Section"
import Reveal from "./ui/Reveal"
import Icon from "./ui/Icon"
import { supabase } from "../lib/supabase"
import { useToast } from "./ui/Toast"

const INTERESTS = ["تنظيم الورش", "تصميم ومحتوى", "سوشيال ميديا", "تطوّع ميداني", "أي حاجة تنفع"]

export default function Volunteer() {
  const toast = useToast()
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    interest: INTERESTS[0],
    message: "",
  })

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || form.phone.trim().length < 6) {
      toast("اكتب اسمك ورقم تواصل صحيح ⚠")
      return
    }
    setSending(true)
    const { error } = await supabase.from("rw_volunteers").insert({
      name: form.name.trim(),
      phone: form.phone.trim(),
      city: form.city.trim() || null,
      interest: form.interest,
      message: form.message.trim() || null,
    })
    setSending(false)
    if (error) {
      toast("حصل خطأ، حاول تاني ⚠")
      return
    }
    setSent(true)
    toast("تم تسجيلك، هنتواصل معاك قريب! ✓")
  }

  return (
    <Section
      id="volunteer"
      icon="handshake"
      eyebrow="انضم لينا"
      title="اتطوّع معانا"
      sub="فريق رجّع وقتك بيكبر بناس مؤمنة بالرسالة. سجّل بياناتك وهنتواصل معاك."
    >
      <div className="max-w-xl mx-auto">
        <Reveal>
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-10 text-center"
            >
              <span className="icon-badge w-16 h-16 mx-auto mb-4 bg-[#f0f9f1] text-[var(--ok)] border-[#bfe5c4]">
                <Icon name="check" size={30} strokeWidth={2.4} />
              </span>
              <h3 className="text-2xl font-black text-[var(--ink)] mb-2">أهلاً بيك في الفريق!</h3>
              <p className="text-[var(--muted)] leading-relaxed">
                وصلنا طلبك بنجاح. هنتواصل معاك على الرقم اللي سجّلته قريب جداً إن شاء الله.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="card p-7 md:p-9 flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[var(--brown)] mb-2">الاسم *</label>
                  <input className="field" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="اسمك" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[var(--brown)] mb-2">رقم التواصل *</label>
                  <input className="field" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="01xxxxxxxxx" inputMode="tel" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--brown)] mb-2">المدينة</label>
                <input className="field" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="مدينتك" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--brown)] mb-2">بتحب تساعد في إيه؟</label>
                <select className="field" value={form.interest} onChange={(e) => set("interest", e.target.value)}>
                  {INTERESTS.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--brown)] mb-2">رسالة (اختياري)</label>
                <textarea className="field min-h-[90px] resize-y" value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="عايز تقولنا حاجة؟" maxLength={1000} />
              </div>
              <button type="submit" disabled={sending} className="btn btn-gold w-full disabled:opacity-60">
                {sending ? "جارٍ الإرسال..." : "سجّل كمتطوّع"}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  )
}
