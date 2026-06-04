import type { ReactNode } from "react"
import Reveal from "./Reveal"
import Icon from "./Icon"

type Props = {
  id?: string
  icon?: string
  eyebrow?: string
  title?: string
  sub?: string
  center?: boolean
  children: ReactNode
  className?: string
}

export default function Section({
  id,
  icon,
  eyebrow,
  title,
  sub,
  center = true,
  children,
  className = "",
}: Props) {
  return (
    <section id={id} className={`py-16 md:py-24 scroll-mt-24 ${className}`}>
      <div className="container-rw">
        {(eyebrow || title || sub) && (
          <Reveal>
            <div className={center ? "text-center flex flex-col items-center mb-14" : "mb-14"}>
              {eyebrow && (
                <span className="section-eyebrow">
                  {icon && <Icon name={icon} size={15} strokeWidth={2.2} />}
                  {eyebrow}
                </span>
              )}
              {title && <h2 className="section-title">{title}</h2>}
              {sub && <p className="section-sub">{sub}</p>}
            </div>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}
