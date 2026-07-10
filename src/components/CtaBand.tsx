import { Link } from "react-router-dom"
import Reveal from "./ui/Reveal"
import Icon from "./ui/Icon"

export default function CtaBand() {
  return (
    <section className="py-10">
      <div className="container-rw">
        <Reveal>
          <div
            className="rounded-[28px] px-7 py-14 md:px-16 md:py-20 text-center text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg,#9c5f06,#4a3526)" }}
          >
            <div
              className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-25 pointer-events-none"
              style={{ background: "radial-gradient(circle,#e0982a,transparent 70%)" }}
            />
            <h2 className="font-display text-3xl md:text-[2.6rem] font-black leading-[1.3] mb-6 relative">
              جاهز ترجّع وقتك؟
            </h2>
            <p className="text-white/85 text-lg max-w-md mx-auto mb-10 leading-[2] relative">
              ابدأ بخطوة صغيرة النهارده — اتحدى نفسك، أو ساعدنا نوصل الرسالة لشباب أكتر.
            </p>
            <div className="flex flex-wrap gap-4 justify-center relative">
              <Link to="/awareness" className="btn btn-light" style={{ color: "var(--brown)" }}>
                <Icon name="zap" size={18} strokeWidth={2.2} />
                اتحدى نفسك
              </Link>
              <Link to="/volunteer" className="btn btn-line">
                <Icon name="handshake" size={18} strokeWidth={2.2} />
                اتطوّع معانا
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
