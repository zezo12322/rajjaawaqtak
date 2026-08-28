import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Section from "./ui/Section"
import Reveal from "./ui/Reveal"
import Icon from "./ui/Icon"
import DodgeGame from "./games/DodgeGame"
import MythGame from "./games/MythGame"
import MemoryGame from "./games/MemoryGame"
import DayGame from "./games/DayGame"

const GAMES = [
  {
    key: "dodge",
    icon: "bellOff",
    title: "سيبها ترنّ",
    tagline: "قاوم الإشعار",
    text: "٤٥ ثانية بين إشعارات بتنطّ قدّامك وفرص حقيقية بتعدّي. اضغط على اللي يستاهل وسيب اللي مايستاهلش.",
    Cmp: DodgeGame,
  },
  {
    key: "myth",
    icon: "brain",
    title: "حقيقة ولا خرافة",
    tagline: "اختبر معلوماتك",
    text: "عشر جُمل عن الشاشات والنوم والتركيز. تعرف تفرّق بين اللي علمي واللي كلام الناس؟",
    Cmp: MythGame,
  },
  {
    key: "memory",
    icon: "sparkles",
    title: "شغّل دماغك",
    tagline: "لعبة ذاكرة",
    text: "طابق حاجات تستاهل وقتك بأقل عدد محاولات — تمرين صغير لذاكرة اتعوّدت على التمرير.",
    Cmp: MemoryGame,
  },
  {
    key: "day",
    icon: "compass",
    title: "يوم في حياتك",
    tagline: "اختياراتك تحدّد",
    text: "ستّ لحظات في يوم عادي. كل قرار بيأثّر على وقتك وتركيزك وراحتك — شوف يومك بينتهي إزاي.",
    Cmp: DayGame,
  },
] as const

export default function Games() {
  const [active, setActive] = useState<(typeof GAMES)[number]["key"]>("dodge")
  const game = GAMES.find((g) => g.key === active)!
  const Active = game.Cmp

  return (
    <Section
      id="games"
      icon="gamepad"
      eyebrow="العب واتعلّم"
      title="أربع ألعاب تحسّسك بالفكرة"
      sub="مش محاضرة — تجربة. كل لعبة بتخلّيك تعيش جزء من رسالة المبادرة بنفسك في دقيقتين."
    >
      {/* اختيار اللعبة */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {GAMES.map((g, i) => {
          const on = g.key === active
          return (
            <Reveal key={g.key} delay={i * 0.06}>
              <button
                onClick={() => setActive(g.key)}
                aria-pressed={on}
                className={`w-full h-full text-right p-5 rounded-[22px] border transition duration-300 ${
                  on
                    ? "border-[var(--gold)] bg-[var(--gold-soft)] shadow-[var(--shadow-md)]"
                    : "card hover:border-[var(--gold)] hover:-translate-y-1"
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 border transition ${
                    on
                      ? "bg-[var(--gold)] text-white border-transparent"
                      : "bg-[var(--gold-soft)] text-[var(--gold-dark)] border-[rgba(194,121,10,0.16)]"
                  }`}
                >
                  <Icon name={g.icon} size={22} />
                </span>
                <span className="block text-[0.72rem] font-bold text-[var(--gold-dark)] mb-1">
                  {g.tagline}
                </span>
                <span className="block font-extrabold text-[var(--ink)] mb-2">{g.title}</span>
                <span className="block text-[0.86rem] text-[var(--muted)] leading-[1.8]">
                  {g.text}
                </span>
              </button>
            </Reveal>
          )
        })}
      </div>

      {/* اللعبة الشغّالة */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          <Active />
        </motion.div>
      </AnimatePresence>
    </Section>
  )
}
