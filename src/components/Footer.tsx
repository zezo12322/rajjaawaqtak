import { Link } from "react-router-dom"
import logo from "../assets/logo.jpg"
import { SOCIAL } from "../data/content"

const FOOTER_LINKS = [
  { to: "/about", label: "عن المبادرة" },
  { to: "/awareness", label: "اعرف واتحدى" },
  { to: "/advices", label: "نصايح المجتمع" },
  { to: "/volunteer", label: "تطوّع معانا" },
  { to: "/donate", label: "ادعم المبادرة" },
  { to: "/contact", label: "تواصل" },
]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[var(--border)] mt-10">
      <div className="container-rw py-12 grid md:grid-cols-3 gap-8 items-start">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-12 h-12 rounded-xl bg-white shadow-[var(--shadow-sm)] ring-1 ring-[var(--border-strong)] overflow-hidden">
              <img src={logo} alt="رجّع وقتك" className="w-full h-full object-cover" />
            </span>
            <span className="font-display text-xl font-black text-[var(--ink)]">
              رجّع <span className="text-[var(--gold)]">وقتك</span>
            </span>
          </div>
          <p className="text-[var(--muted)] text-sm leading-relaxed max-w-xs">
            مبادرة مجتمعية من أجل حياة أفضل بعيداً عن الشاشات — الموبايل مش حياتك.. حياتك بره الشاشة.
          </p>
        </div>

        <div>
          <h4 className="font-extrabold text-[var(--ink)] mb-3">روابط سريعة</h4>
          <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
            {FOOTER_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-[var(--text)] hover:text-[var(--gold-dark)] transition">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold text-[var(--ink)] mb-3">تابعنا</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { href: SOCIAL.whatsapp, label: "واتساب" },
              { href: SOCIAL.instagram, label: "إنستجرام" },
              { href: SOCIAL.telegram, label: "تيليجرام" },
              { href: SOCIAL.tiktok, label: "تيك توك" },
              { href: SOCIAL.facebook, label: "فيسبوك" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold px-3 py-2 rounded-lg bg-[var(--bg-tint)] text-[var(--brown)] hover:bg-[var(--gold-soft)] hover:text-[var(--gold-dark)] transition"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="container-rw py-5 text-center text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} مبادرة رجّع وقتك — كل الحقوق محفوظة
        </div>
      </div>
    </footer>
  )
}
