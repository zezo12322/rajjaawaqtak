import { useEffect, useState } from "react"
import Reveal from "./ui/Reveal"
import { useCountUp } from "../hooks/useCountUp"
import { supabase } from "../lib/supabase"

function StatCard({ num, label, suffix = "" }: { num: number; label: string; suffix?: string }) {
  const { value, ref } = useCountUp(num)
  return (
    <div className="card p-6 text-center hover:shadow-[var(--shadow-md)] transition">
      <span ref={ref} className="font-display text-4xl md:text-5xl font-black text-[var(--gold)]">
        {value.toLocaleString("ar-EG")}
        {suffix}
      </span>
      <p className="text-[var(--muted)] mt-2 text-sm font-semibold">{label}</p>
    </div>
  )
}

export default function Stats() {
  const [adviceCount, setAdviceCount] = useState(0)

  useEffect(() => {
    supabase
      .from("rw_advices")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => {
        if (typeof count === "number") setAdviceCount(count)
      })
  }, [])

  return (
    <section className="py-8">
      <div className="container-rw">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCard num={300} label="شاب نستهدفهم" suffix="+" />
            <StatCard num={adviceCount} label="نصيحة شاركها الناس" />
            <StatCard num={15} label="يوم تكسبها بساعة يومياً" />
            <StatCard num={7} label="أيام تحدي يغيّر عادتك" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
