import Section from "./ui/Section"
import Reveal from "./ui/Reveal"
import Icon from "./ui/Icon"
import { FACTS } from "../data/content"

export default function Facts() {
  return (
    <Section
      id="facts"
      icon="bulb"
      eyebrow="حقائق تهمّك"
      title="إيه اللي بيعمله الموبايل فينا؟"
      sub="أرقام وحقائق بسيطة ممكن تغيّر نظرتك لوقتك."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FACTS.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.06}>
            <div className="card p-8 h-full hover:shadow-[var(--shadow-md)] hover:-translate-y-1 transition duration-300">
              <span className="icon-badge w-14 h-14 mb-6">
                <Icon name={f.icon} size={26} />
              </span>
              <h3 className="text-lg font-extrabold text-[var(--ink)] mb-3">{f.title}</h3>
              <p className="text-[var(--text)] text-[0.96rem]">{f.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
