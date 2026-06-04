import Section from "./ui/Section"
import Reveal from "./ui/Reveal"
import Icon from "./ui/Icon"
import { STORIES } from "../data/content"

export default function Stories() {
  return (
    <Section
      id="stories"
      icon="star"
      eyebrow="قصص نجاح"
      title="حصلت معاهم.. تقدر تحصل معاك"
      sub="ناس بدأت خطوة صغيرة، وغيّرت علاقتها بالموبايل فعلاً."
    >
      <div className="grid md:grid-cols-3 gap-5">
        {STORIES.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.08}>
            <div className="card p-8 h-full flex flex-col">
              <span className="icon-badge w-11 h-11 mb-5">
                <Icon name="message" size={20} />
              </span>
              <p className="leading-[2] text-[var(--brown)] flex-1">{s.quote}</p>
              <div className="mt-6 pt-5 border-t border-[var(--border)]">
                <p className="font-extrabold text-[var(--ink)]">{s.name}</p>
                <span className="chip mt-2">{s.tag}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
