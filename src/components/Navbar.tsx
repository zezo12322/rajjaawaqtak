import { useEffect, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import logo from "../assets/logo.jpg"
import Icon from "./ui/Icon"

const LINKS = [
  { to: "/", label: "الرئيسية" },
  { to: "/about", label: "عن المبادرة" },
  { to: "/awareness", label: "اعرف واتحدى" },
  { to: "/games", label: "العب واتعلّم" },
  { to: "/advices", label: "نصايح المجتمع" },
  { to: "/contact", label: "تواصل" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => setOpen(false), [loc.pathname])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[rgba(250,246,239,0.85)] backdrop-blur-xl shadow-[var(--shadow-sm)] py-2" : "py-3.5"
      }`}
    >
      <nav className="container-rw flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-xl bg-white shadow-[var(--shadow-sm)] ring-1 ring-[var(--border-strong)] grid place-items-center overflow-hidden">
            <img src={logo} alt="رجّع وقتك" className="w-full h-full object-cover" />
          </span>
          <span className="font-display font-extrabold text-lg text-[var(--ink)] hidden sm:block">
            رجّع <span className="text-[var(--gold)]">وقتك</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-0.5">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-[0.92rem] font-bold transition ${
                  isActive
                    ? "text-[var(--gold-dark)] bg-[var(--gold-soft)]"
                    : "text-[var(--text)] hover:text-[var(--gold-dark)] hover:bg-[var(--gold-soft)]"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/volunteer" className="btn btn-gold !py-2.5 !px-5 text-sm">
            <Icon name="handshake" size={17} strokeWidth={2.2} />
            اتطوّع معانا
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden w-10 h-10 rounded-xl bg-white ring-1 ring-[var(--border-strong)] shadow-[var(--shadow-sm)] grid place-items-center text-[var(--brown)]"
            aria-label="القائمة"
          >
            <Icon name={open ? "close" : "menu"} size={20} strokeWidth={2.2} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="container-rw py-3 grid grid-cols-2 gap-2">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `px-3 py-3 rounded-xl text-center text-sm font-bold transition ${
                      isActive
                        ? "bg-[var(--gold-soft)] text-[var(--gold-dark)]"
                        : "bg-white ring-1 ring-[var(--border)] text-[var(--text)]"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
