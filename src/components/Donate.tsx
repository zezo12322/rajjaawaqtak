import Section from "./ui/Section"
import Reveal from "./ui/Reveal"
import Icon from "./ui/Icon"
import { CONTACT } from "../data/content"
import { useToast } from "./ui/Toast"

export default function Donate() {
  const toast = useToast()

  function copy(num: string) {
    navigator.clipboard
      .writeText(num)
      .then(() => toast("تم نسخ الرقم: " + num + " ✓"))
      .catch(() => toast("الرقم: " + num))
  }

  return (
    <Section id="donate" center>
      <Reveal>
        <div className="max-w-3xl mx-auto card p-8 md:p-12 text-center relative overflow-hidden">
          <div
            className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-60 pointer-events-none"
            style={{ background: "radial-gradient(circle,#f6ead2,transparent 70%)" }}
          />
          <span className="icon-badge w-16 h-16 mx-auto mb-5 relative">
            <Icon name="heart" size={30} />
          </span>
          <h2 className="section-title !mt-0 mb-3">ادعم المبادرة</h2>
          <p className="text-[var(--text)] max-w-lg mx-auto leading-relaxed mb-8">
            كل جنيه بيساعدنا نوصل الرسالة لمدرسة ومركز شباب جديد، ونجهّز ورش توعية لشباب أكتر.
            تبرّعك بيرجّع لناس كتير وقتهم وحياتهم.
          </p>

          <p className="text-sm font-bold text-[var(--muted)] mb-3">تبرّع عبر فودافون كاش</p>
          <button
            onClick={() => copy(CONTACT.donatePhone)}
            className="inline-flex items-center gap-3 btn btn-gold !text-2xl md:!text-3xl !px-8 !py-4"
            style={{ fontFamily: "Tajawal, sans-serif", letterSpacing: "0.04em" }}
          >
            <Icon name="copy" size={22} strokeWidth={2} />
            {CONTACT.donatePhone}
          </button>
          <p className="text-xs text-[var(--muted)] mt-4">اضغط على الرقم لنسخه</p>
        </div>
      </Reveal>
    </Section>
  )
}
