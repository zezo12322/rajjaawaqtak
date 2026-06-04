import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Link } from "react-router-dom"
import Section from "./ui/Section"
import Icon from "./ui/Icon"
import { QUIZ, quizResult } from "../data/content"

export default function Quiz() {
  const [step, setStep] = useState(0)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const total = QUIZ.length
  const progress = done ? 100 : Math.round((step / total) * 100)

  function pick(s: number) {
    const next = score + s
    setScore(next)
    if (step + 1 < total) setStep(step + 1)
    else setDone(true)
  }

  function reset() {
    setStep(0)
    setScore(0)
    setDone(false)
  }

  const result = quizResult(score)

  return (
    <Section
      id="quiz"
      icon="zap"
      eyebrow="اختبر نفسك"
      title="هل أنت مدمن شاشة؟"
      sub="6 أسئلة سريعة وصريحة. جاوب بصدق، والنتيجة تفضل بينك وبين نفسك."
    >
      <div className="max-w-2xl mx-auto">
        <div className="h-2 rounded-full bg-[var(--bg-tint)] overflow-hidden mb-6">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#e0982a,#9c5f06)" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>

        <div className="card p-7 md:p-10 min-h-[330px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 28 }}
                transition={{ duration: 0.28 }}
              >
                <p className="text-sm font-bold text-[var(--gold-dark)] mb-2">
                  سؤال {step + 1} من {total}
                </p>
                <h3 className="text-xl md:text-2xl font-extrabold mb-8 leading-[1.7] text-[var(--ink)]">
                  {QUIZ[step].q}
                </h3>
                <div className="flex flex-col gap-3">
                  {QUIZ[step].options.map((o) => (
                    <button
                      key={o.label}
                      onClick={() => pick(o.score)}
                      className="group flex items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-[#fdfbf7] border border-[var(--border-strong)] hover:border-[var(--gold)] hover:bg-[var(--gold-soft)] transition font-semibold text-[var(--brown)]"
                    >
                      <span>{o.label}</span>
                      <span className="w-6 h-6 rounded-full border-2 border-[var(--border-strong)] group-hover:border-[var(--gold)] grid place-items-center flex-shrink-0 transition">
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--gold)] opacity-0 group-hover:opacity-100 transition" />
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <p className="text-sm font-bold text-[var(--muted)] mb-2">نتيجتك</p>
                <div className="font-display text-3xl md:text-4xl font-black mb-2" style={{ color: result.color }}>
                  {result.level}
                </div>
                <p className="text-[var(--muted)] mb-3">
                  درجتك: <b className="text-[var(--ink)]">{score}</b> من {total * 3}
                </p>
                <p className="text-[var(--text)] leading-relaxed max-w-md mx-auto mb-7">{result.text}</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <a href="#challenge" className="btn btn-gold">
                    <Icon name="flame" size={18} strokeWidth={2.2} />
                    ابدأ تحدي الـ7 أيام
                  </a>
                  <button onClick={reset} className="btn btn-ghost">أعد الاختبار</button>
                </div>
                <Link to="/volunteer" className="block mt-5 text-sm font-bold text-[var(--gold-dark)] hover:underline">
                  عايز تساعد غيرك؟ اتطوّع معانا ←
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  )
}
