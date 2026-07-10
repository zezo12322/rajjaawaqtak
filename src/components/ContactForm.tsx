import { useState } from "react"
import { motion } from "framer-motion"
import Section from "./ui/Section"
import Reveal from "./ui/Reveal"
import Icon from "./ui/Icon"

type Status = "idle" | "loading" | "success" | "error"
type Fields = { name: string; email: string; phone: string; message: string; company: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMPTY: Fields = { name: "", email: "", phone: "", message: "", company: "" }

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {}
  if (f.name.trim().length < 2) e.name = "اكتب اسمك"
  if (!EMAIL_RE.test(f.email.trim())) e.email = "بريد إلكتروني غير صحيح"
  if (f.phone.trim() && (f.phone.trim().length < 6 || f.phone.trim().length > 25)) e.phone = "رقم غير صحيح"
  if (f.message.trim().length < 3) e.message = "اكتب رسالتك"
  return e
}

export default function ContactForm() {
  const [form, setForm] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  function set<K extends keyof Fields>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  // امنع الإرسال لو الحقول المطلوبة فاضية
  const requiredFilled =
    form.name.trim() && form.email.trim() && form.message.trim()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const v = validate(form)
    setErrors(v)
    if (Object.keys(v).length > 0) return

    setStatus("loading")
    setErrorMsg("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors)
        throw new Error(data.error || "تعذّر الإرسال")
      }
      setStatus("success")
      setForm(EMPTY)
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "حصل خطأ، حاول تاني")
    }
  }

  return (
    <Section
      id="message"
      icon="send"
      eyebrow="راسلنا"
      title="ابعتلنا رسالة"
      sub="عندك سؤال أو طلب أو اقتراح؟ اكتبلنا وهنرد عليك في أقرب وقت."
    >
      <div className="max-w-xl mx-auto">
        <Reveal>
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-10 text-center"
            >
              <span className="icon-badge w-16 h-16 mx-auto mb-5 bg-[#f0f9f1] text-[var(--ok)] border-[#bfe5c4]">
                <Icon name="check" size={30} strokeWidth={2.4} />
              </span>
              <h3 className="text-2xl font-black text-[var(--ink)] mb-3">وصلتنا رسالتك!</h3>
              <p className="text-[var(--muted)] mb-6">شكراً لتواصلك معانا — هنرد عليك في أقرب وقت إن شاء الله.</p>
              <button onClick={() => setStatus("idle")} className="btn btn-ghost">ابعت رسالة تانية</button>
            </motion.div>
          ) : (
            <form onSubmit={submit} noValidate className="card p-7 md:p-9 flex flex-col gap-5">
              {/* Honeypot — مخفي عن المستخدم، فخ للبوتس */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                className="absolute -left-[9999px] opacity-0 h-0 w-0"
                aria-hidden="true"
              />

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="الاسم *" error={errors.name}>
                  <input className="field" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="اسمك" />
                </Field>
                <Field label="رقم التواصل" error={errors.phone}>
                  <input className="field" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="01xxxxxxxxx" inputMode="tel" />
                </Field>
              </div>

              <Field label="البريد الإلكتروني *" error={errors.email}>
                <input className="field" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" inputMode="email" />
              </Field>

              <Field label="الرسالة *" error={errors.message}>
                <textarea className="field min-h-[120px] resize-y" value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="اكتب رسالتك هنا..." maxLength={2000} />
              </Field>

              {status === "error" && (
                <p className="text-sm font-bold text-[var(--danger)] bg-[#fdeaea] border border-[#f6caca] rounded-xl px-4 py-3 text-center">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading" || !requiredFilled}
                className="btn btn-gold w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "جارٍ الإرسال..." : "إرسال الرسالة"}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-[var(--brown)] mb-2">{label}</label>
      {children}
      {error && <p className="text-xs font-semibold text-[var(--danger)] mt-1.5">{error}</p>}
    </div>
  )
}
