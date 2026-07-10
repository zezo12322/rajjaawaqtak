// Vercel Serverless Function — POST /api/volunteer
// بيحفظ بيانات المتطوّع في الاتنين مع بعض:
//   1) Supabase (جدول rw_volunteers)
//   2) Google Apps Script → تبويب "Volunteers" في الـ Google Sheet
//
// Environment Variables (على Vercel):
//   GOOGLE_SCRIPT_URL     — رابط الـ Web App بتاع Apps Script (نفس بتاع التواصل)
//   CONTACT_SHARED_TOKEN  — التوكن السري (نفس بتاع التواصل)
//   SUPABASE_URL          — (اختياري) رابط Supabase، وإلا بيستخدم الافتراضي العام
//   SUPABASE_ANON_KEY     — (اختياري) المفتاح العام، وإلا بيستخدم الافتراضي العام

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// مفاتيح Supabase العامة (publishable) — آمنة، محميّة بـ RLS
const SUPABASE_URL = process.env.SUPABASE_URL || "https://geunbmopkuhkqqacnjjz.supabase.co"
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_r8-IFAgibtCvReSCjUn7Dg_oYSZWF3K"

function validate(data) {
  const errors = {}
  const name = (data.name || "").trim()
  const email = (data.email || "").trim()
  const phone = (data.phone || "").trim()
  const city = (data.city || "").trim()
  const interest = (data.interest || "").trim()
  const message = (data.message || "").trim()

  if (name.length < 2 || name.length > 80) errors.name = "الاسم مطلوب (حرفين على الأقل)"
  if (!EMAIL_RE.test(email)) errors.email = "بريد إلكتروني غير صحيح"
  if (phone.length < 6 || phone.length > 25) errors.phone = "رقم تواصل غير صحيح"
  if (message && message.length > 1000) errors.message = "الرسالة طويلة جداً"

  return { errors, clean: { name, email, phone, city, interest, message } }
}

// (1) الحفظ في Supabase عبر REST
async function saveToSupabase({ name, email, phone, city, interest, message }) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rw_volunteers`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name,
      email: email || null,
      phone,
      city: city || null,
      interest: interest || null,
      message: message || null,
    }),
  })
  if (!res.ok) {
    throw new Error(`Supabase ${res.status}: ${await res.text().catch(() => "")}`)
  }
}

// (2) الحفظ في Google Sheet عبر Apps Script (تبويب Volunteers)
async function saveToSheet(data) {
  const url = process.env.GOOGLE_SCRIPT_URL
  const token = process.env.CONTACT_SHARED_TOKEN
  if (!url) return // الشيت غير مُفعّل — نتجاهله

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, type: "volunteer", ...data }),
  })
  const text = await res.text().catch(() => "")
  if (!res.ok) throw new Error(`Apps Script HTTP ${res.status}: ${text}`)
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    /* رد مش JSON — نعتبره نجاح طالما 200 */
  }
  if (json && json.ok === false) throw new Error(json.error || "Apps Script رفض الطلب")
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ ok: false, error: "Method not allowed" })
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {}

    // honeypot
    if (body.company) return res.status(200).json({ ok: true })

    const { errors, clean } = validate(body)
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ ok: false, errors })
    }

    // بنحفظ في الاتنين — لو واحد فشل، التاني لسه شغّال
    const results = await Promise.allSettled([saveToSupabase(clean), saveToSheet(clean)])
    const failed = results.filter((r) => r.status === "rejected")
    failed.forEach((r) => console.error("[volunteer] فشل أحد المصادر:", r.reason))

    // فشل الاتنين = 500
    if (failed.length === results.length) {
      throw new Error("فشل الحفظ في كل المصادر")
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error("[volunteer] خطأ:", err)
    return res.status(500).json({ ok: false, error: "حصل خطأ أثناء الإرسال، حاول تاني" })
  }
}
