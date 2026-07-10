import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import logo from "../assets/logo.jpg"
import Icon from "./ui/Icon"
import { FloatingPaths } from "@/components/ui/background-paths"

export default function Hero() {
  return (
    <section className="relative pt-12 md:pt-16 pb-10 overflow-hidden">
      {/* خلفية خطوط متحركة ناعمة */}
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
      {/* زخرفة خلفية ناعمة */}
      <div
        className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-50 pointer-events-none"
        style={{ background: "radial-gradient(circle,#f6ead2,transparent 70%)" }}
      />
      <div className="container-rw relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7"
          >
            <span
              className="block w-32 h-32 md:w-40 md:h-40 rounded-[34px] bg-white shadow-[var(--shadow-lg)] ring-1 ring-[var(--border-strong)] overflow-hidden"
              style={{ animation: "float-y 5s ease-in-out infinite" }}
            >
              <img src={logo} alt="رجّع وقتك" className="w-full h-full object-cover" />
            </span>
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="section-eyebrow mb-7"
          >
            <Icon name="sparkles" size={15} strokeWidth={2.2} />
            مبادرة مجتمعية للتوعية الرقمية
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display font-black leading-[1.15] pb-1 text-[clamp(2.6rem,9vw,5rem)] text-[var(--ink)]"
          >
            رجّع <span className="text-[var(--gold)]">وقتك</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-lg md:text-2xl font-bold text-[var(--brown)]"
          >
            الموبايل مش حياتك.. <span className="text-[var(--gold-dark)]">حياتك بره الشاشة</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 max-w-xl text-[var(--muted)] text-base md:text-lg"
          >
            بنساعد الشباب يرجّعوا السيطرة على وقتهم وحياتهم بعيداً عن إدمان الشاشات —
            بالوعي، والتحدي، والتجربة الحقيقية.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/awareness" className="btn btn-gold">
              <Icon name="zap" size={18} strokeWidth={2.2} />
              ابدأ — اختبر نفسك
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
