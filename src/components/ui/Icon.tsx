/* أيقونات خطّية موحّدة (بأسلوب Lucide) — بديل احترافي للإيموجي */

const PATHS: Record<string, string> = {
  clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>',
  smartphone:
    '<rect x="6" y="2" width="12" height="20" rx="2.5"/><line x1="11" y1="18" x2="13" y2="18"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  leaf:
    '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
  heart:
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l7.8-7.6a5.5 5.5 0 0 0 .9-8.8z"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  target:
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
  message:
    '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  flame:
    '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  calendar:
    '<rect x="3" y="4" width="18" height="18" rx="2.5"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  bulb:
    '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.1 14c.18-.98.65-1.74 1.4-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.22 1.52 1.4 2.5"/>',
  arrowLeft: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  arrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  chevronDown: '<polyline points="6 9 12 15 18 9"/>',
  menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  star: '<polygon points="12 2 15 9 22 9.3 16.6 14 18.5 21 12 17.2 5.5 21 7.4 14 2 9.3 9 9 12 2"/>',
  sparkles:
    '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  copy:
    '<rect x="9" y="9" width="13" height="13" rx="2.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  trash:
    '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
  send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  handshake:
    '<path d="M11 17l2 2a1 1 0 0 0 1.4 0l3.6-3.6"/><path d="M14.5 12.5l3 3"/><path d="M3 12l4-4 4 4-2 2a1.4 1.4 0 0 1-2 0z"/><path d="M21 12l-4-4-3 3"/>',
  bell:
    '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  bellOff:
    '<path d="M8.7 3.9A6 6 0 0 1 18 8c0 2.4.4 4.2.9 5.5"/><path d="M6.3 6.3A6 6 0 0 0 6 8c0 7-3 9-3 9h13"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/><line x1="3" y1="3" x2="21" y2="21"/>',
  brain:
    '<path d="M9.5 3A2.5 2.5 0 0 0 7 5.5c-1.4.3-2.5 1.6-2.5 3.1 0 .7.2 1.3.6 1.8-.6.5-1 1.3-1 2.2 0 1.2.7 2.2 1.7 2.7-.1.3-.2.7-.2 1 0 1.6 1.3 2.9 3 2.9.4 0 .7 0 1-.2V3.4A2.4 2.4 0 0 0 9.5 3z"/><path d="M14.5 3A2.5 2.5 0 0 1 17 5.5c1.4.3 2.5 1.6 2.5 3.1 0 .7-.2 1.3-.6 1.8.6.5 1 1.3 1 2.2 0 1.2-.7 2.2-1.7 2.7.1.3.2.7.2 1 0 1.6-1.3 2.9-3 2.9-.4 0-.7 0-1-.2V3.4A2.4 2.4 0 0 1 14.5 3z"/><line x1="12" y1="19" x2="12" y2="22"/>',
  trophy:
    '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4.5A2.5 2.5 0 0 0 7 10.5"/><path d="M17 6h2.5A2.5 2.5 0 0 1 17 10.5"/>',
  medal:
    '<circle cx="12" cy="15" r="5.5"/><path d="M12 12.6l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z"/><path d="M8.2 9.4L6 2h4l1.5 4.6"/><path d="M15.8 9.4L18 2h-4l-1.5 4.6"/>',
  book:
    '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/>',
  dumbbell:
    '<path d="M6.5 6.5v11"/><path d="M17.5 6.5v11"/><path d="M3.5 9.5v5"/><path d="M20.5 9.5v5"/><line x1="6.5" y1="12" x2="17.5" y2="12"/>',
  palette:
    '<path d="M12 3a9 9 0 1 0 0 18c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-1 .8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-4-4-7.3-9-7.3z"/><circle cx="7.5" cy="11" r="1.1"/><circle cx="10" cy="7" r="1.1"/><circle cx="15" cy="7.5" r="1.1"/>',
  sun:
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2 12h2M20 12h2M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5"/>',
  coffee:
    '<path d="M17 8h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M3 8h14v5a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z"/><line x1="5" y1="21" x2="17" y2="21"/>',
  refresh:
    '<path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/><polyline points="21 3 21 8 16 8"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><polyline points="3 21 3 16 8 16"/>',
  timer:
    '<circle cx="12" cy="13" r="8"/><polyline points="12 9 12 13 14.5 14.5"/><line x1="9" y1="2" x2="15" y2="2"/>',
  play: '<polygon points="7 4 20 12 7 20 7 4"/>',
  gamepad:
    '<line x1="7" y1="11" x2="11" y2="11"/><line x1="9" y1="9" x2="9" y2="13"/><line x1="15.5" y1="10.5" x2="15.5" y2="10.5"/><line x1="18" y1="13" x2="18" y2="13"/><path d="M17.3 6H6.7A4.7 4.7 0 0 0 2 10.7v3A4.3 4.3 0 0 0 6.3 18c1.4 0 2.2-.6 2.9-1.4l.7-.8h4.2l.7.8c.7.8 1.5 1.4 2.9 1.4A4.3 4.3 0 0 0 22 13.7v-3A4.7 4.7 0 0 0 17.3 6z"/>',
  shield:
    '<path d="M12 22s8-3.4 8-10V5.5L12 2 4 5.5V12c0 6.6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
  compass:
    '<circle cx="12" cy="12" r="9"/><polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5"/>',
}

type Props = {
  name: keyof typeof PATHS | string
  size?: number
  strokeWidth?: number
  className?: string
}

export default function Icon({ name, size = 24, strokeWidth = 1.9, className }: Props) {
  const d = PATHS[name] || ""
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: d }}
    />
  )
}
