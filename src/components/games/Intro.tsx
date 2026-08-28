import Icon from "../ui/Icon"

/** شاشة بداية موحّدة لكل الألعاب */
export default function Intro({
  onStart,
  best,
  title,
  text,
  icon,
  bestLabel = "أعلى نتيجة ليك",
}: {
  onStart: () => void
  best: number | null
  title: string
  text: string
  icon: string
  bestLabel?: string
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8 md:p-12 text-center">
        <span className="icon-badge w-16 h-16 mx-auto mb-5">
          <Icon name={icon} size={30} />
        </span>
        <h3 className="font-display text-2xl font-black text-[var(--ink)] mb-3">{title}</h3>
        <p className="text-[var(--muted)] max-w-md mx-auto mb-7">{text}</p>
        {best !== null && (
          <p className="text-sm font-bold text-[var(--gold-dark)] mb-5">
            {bestLabel}: {best}
          </p>
        )}
        <button onClick={onStart} className="btn btn-gold">
          <Icon name="play" size={17} />
          يلا نبدأ
        </button>
      </div>
    </div>
  )
}
