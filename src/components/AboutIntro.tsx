import Section from "./ui/Section"
import Reveal from "./ui/Reveal"
import Icon from "./ui/Icon"
import { VALUES } from "../data/content"

const TAGS = ["مراكز الشباب", "المدارس", "أولياء الأمور", "كبار السن", "توعية رقمية", "صحة نفسية", "ورش تفاعلية"]

export default function AboutIntro() {
  return (
    <Section
      id="about"
      icon="target"
      eyebrow="عن المبادرة"
      title="ليه «رجّع وقتك»؟"
      sub="الشاشات بتاخد من وقتنا أكتر مما نتخيّل. إحنا هنا علشان نرجّع التوازن — مش بالحرمان، لكن بالوعي والاختيار."
    >
      <div className="grid lg:grid-cols-2 gap-6 items-stretch mb-6">
        <Reveal>
          <div className="card p-7 md:p-9 h-full">
            <h3 className="text-xl font-extrabold mb-3 text-[var(--ink)]">رسالتنا</h3>
            <p className="text-[var(--text)] leading-[1.9]">
              مبادرة مجتمعية تهدف لتوعية النشء والشباب وأولياء الأمور وكبار السن بمخاطر الإدمان
              الرقمي، من خلال برامج وورش تفاعلية في مراكز الشباب والمدارس. هدفنا إننا نساعد كل فرد
              في البيت — صغير وكبير — يستعيد السيطرة على وقته، ويبني علاقة صحية ومتوازنة مع
              التكنولوجيا.
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {TAGS.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            className="rounded-[22px] p-7 md:p-9 h-full flex flex-col justify-center text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg,#9c5f06,#4a3526)" }}
          >
            <span className="w-14 h-14 rounded-2xl bg-white/15 grid place-items-center mb-4">
              <Icon name="target" size={28} />
            </span>
            <div className="font-display text-5xl font-black">+300</div>
            <p className="mt-2 text-lg font-bold">شاب وفتاة</p>
            <p className="text-white/75 mt-1 leading-relaxed">
              نستهدف توعيتهم بمخاطر الإدمان الرقمي خلال المرحلة الأولى من المبادرة.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {VALUES.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.08}>
            <div className="card p-7 h-full">
              <span className="icon-badge w-12 h-12 mb-5">
                <Icon name={v.icon} size={22} />
              </span>
              <h4 className="font-extrabold text-[var(--ink)] mb-3">{v.title}</h4>
              <p className="text-[var(--muted)] text-[0.95rem]">{v.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
