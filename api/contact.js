// Vercel Serverless Function — POST /api/contact
// بيستقبل بيانات فورم التواصل، بيعمل validation + حماية من السبام،
// وبيوصّل البيانات إلى Google Apps Script Web App (اللي بيحفظها في Google Sheet).
//
// كل القيم السرية بتتقري من Environment Variables على السيرفر فقط:
//   GOOGLE_SCRIPT_URL     — رابط الـ Web App بتاع Apps Script
//   CONTACT_SHARED_TOKEN  — توكن سري متشارك بين الـ Function والـ Apps Script

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(data) {
  const errors = {}
  const name = (data.name || "").trim()
  const email = (data.email || "").trim()
  const phone = (data.phone || "").trim()
  const message = (data.message || "").trim()

  if (name.length < 2 || name.length > 80) errors.name = "الاسم مطلوب (حرفين على الأقل)"
  if (!EMAIL_RE.test(email)) errors.email = "بريد إلكتروني غير صحيح"
  if (phone && (phone.length < 6 || phone.length > 25)) errors.phone = "رقم تواصل غير صحيح"
  if (message.length < 3 || message.length > 2000) errors.message = "الرسالة مطلوبة"

  return { errors, clean: { name, email, phone, message } }
}

// نقطة التوصيل — بتبعت لـ Google Apps Script مع التوكن السري.
async function deliver(data) {
  const url = process.env.GOOGLE_SCRIPT_URL
  const token = process.env.CONTACT_SHARED_TOKEN

  // لو الإعداد لسه ماتعملش — سجّل الرسالة فقط (الفورم يفضل شغّال للتجربة)
  if (!url) {
    console.log("[contact] رسالة جديدة (التوصيل غير مُفعّل):", data)
    return { delivered: false }
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, ...data }),
  })

  const text = await res.text().catch(() => "")
  if (!res.ok) {
    throw new Error(`Apps Script HTTP ${res.status}: ${text}`)
  }

  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    /* بعض ردود Apps Script مش JSON — نعتبرها نجاح طالما 200 */
  }
  if (json && json.ok === false) {
    throw new Error(json.error || "Apps Script رفض الطلب")
  }

  return { delivered: true }
}

export default async function handler(req, res) {
  // 405 لو الميثود مش POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ ok: false, error: "Method not allowed" })
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {}

    // honeypot: لو الحقل "company" متملّي يبقى بوت — success وهمي بدون حفظ
    if (body.company) {
      return res.status(200).json({ ok: true })
    }

    // 400 عند نقص/خطأ البيانات
    const { errors, clean } = validate(body)
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ ok: false, errors })
    }

    // الحفظ — أي فشل هنا بيرجّع 500
    await deliver(clean)

    // 200 عند النجاح
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error("[contact] خطأ:", err)
    return res.status(500).json({ ok: false, error: "حصل خطأ أثناء الإرسال، حاول تاني" })
  }
}
