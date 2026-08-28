import { Link } from "react-router-dom"
import Section from "./ui/Section"
import Reveal from "./ui/Reveal"
import Icon from "./ui/Icon"

const CARDS = [
  { to: "/about", icon: "target", title: "عن المبادرة", text: "اعرف رسالتنا وهدفنا وإزاي بنشتغل." },
  { to: "/awareness", icon: "zap", title: "اعرف واتحدى نفسك", text: "حقائق، اختبار، وتحدي 7 أيام يغيّر عادتك." },
  { to: "/games", icon: "gamepad", title: "العب واتعلّم", text: "٤ ألعاب تفاعلية تحسّسك بالفكرة في دقايق." },
  { to: "/advices", icon: "message", title: "نصايح المجتمع", text: "اقرأ تجارب الناس وشارك نصيحتك." },
  { to: "/volunteer", icon: "handshake", title: "اتطوّع معانا", text: "انضم للفريق وساعد في نشر الرسالة." },
]

export default function PathCards() {
  return (
    <Section
      icon="sparkles"
      eyebrow="من فين تبدأ؟"
      title="رحلتك مع رجّع وقتك"
      sub="اختار اللي يناسبك وابدأ خطوتك الأولى دلوقتي."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {CARDS.map((c, i) => (
          <Reveal key={c.to} delay={i * 0.07}>
            <Link
              to={c.to}
              className="card p-6 h-full flex flex-col group hover:shadow-[var(--shadow-md)] hover:-translate-y-1 transition duration-300"
            >
              <span className="icon-badge mb-5 group-hover:bg-[var(--gold)] group-hover:text-white transition" style={{ width: 54, height: 54 }}>
                <Icon name={c.icon} size={24} />
              </span>
              <h3 className="font-extrabold text-[var(--ink)] mb-2.5">{c.title}</h3>
              <p className="text-[var(--muted)] text-[0.92rem] flex-1">{c.text}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[var(--gold-dark)] font-bold text-sm group-hover:gap-2.5 transition-all">
                ابدأ
                <Icon name="arrowLeft" size={16} strokeWidth={2.4} />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
