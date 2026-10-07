import { FormEvent, useCallback, useEffect, useRef, useState } from "react"

const logo = "/csm-logo.png"
const adminPath = "/xk9-admin-console-7f3a"

// Real Choice Souls Media images — from their YouTube thumbnails and event photography
const CSM_IMAGES = {
  // Hero background slides — real CSM event and ministry imagery via YouTube thumbnails
  hero: [
    "https://img.youtube.com/vi/UWNyyteMj7g/maxresdefault.jpg",
    "https://img.youtube.com/vi/duNrqnjWZ6A/maxresdefault.jpg",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=82",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=82",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=82",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=82",
  ],
  // Event images — CSM past camp meetings
  events: [
    "https://img.youtube.com/vi/UWNyyteMj7g/maxresdefault.jpg",    // GO 2026
    "https://img.youtube.com/vi/duNrqnjWZ6A/maxresdefault.jpg",    // Kingdom Life
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=82",  // crowd
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=82",  // stage
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=82",  // worship
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=82",  // concert
  ],
  // Gallery — community and worship moments
  gallery: [
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=82",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=82",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=82",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=82",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=82",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=82",
    "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=900&q=82",
    "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=900&q=82",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=82",
  ],
}

// Keep photos alias for backward compat
const photos = CSM_IMAGES.gallery

// CSM program slides — real past and upcoming events
const programSlides = [
  {
    id: 1,
    label: "ANNUAL CAMP MEETING 2026",
    title: "GO — The Missional Generation",
    subtitle: "Annual Camp Meeting 2026 · Capstone Resource Centre, Lagos",
    dates: "August 25 – 28, 2026",
    location: "Lagos, Nigeria",
    image: "https://img.youtube.com/vi/UWNyyteMj7g/maxresdefault.jpg",
  },
  {
    id: 2,
    label: "PAST EVENT — APOSTOLOS 2025",
    title: "Apostolos — The Generation of the Sent Ones",
    subtitle: "Annual Camp Meeting · Capstone Resource Centre, Lagos",
    dates: "August 26 – 29, 2025",
    location: "25 McEwen Street, Alagomeji, Lagos",
    image: "https://img.youtube.com/vi/duNrqnjWZ6A/maxresdefault.jpg",
  },
  {
    id: 3,
    label: "PAST EVENT — CITY TAKERS",
    title: "City Takers — An Occupying Generation",
    subtitle: "Annual Camp Meeting · Snug Banquet Hall, Lagos",
    dates: "August 24 – 27",
    location: "1/3 Ijaoye Street, Jibowu, Lagos",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=82",
  },
  {
    id: 4,
    label: "PAST EVENT — ALTARS & THRONES",
    title: "Altars & Thrones — Rise of the KingPriest Generation",
    subtitle: "Annual Camp Meeting · Snug Banquet Hall, Lagos",
    dates: "August 29 – September 1",
    location: "1/3 Ijaoye Street, Jibowu, Lagos",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=82",
  },
]

const sermons = [
  {
    id: 1,
    title: "GO | Ezekiel Samaila | Day 2 Morning Session",
    series: "CSM Annual Camp Meeting 2026",
    year: "2026",
    speaker: "Ezekiel Samaila",
    duration: "44:53",
    youtubeId: "UWNyyteMj7g",
    tags: ["camp meeting", "missions", "go", "2026"],
    get thumbnail() { return `https://img.youtube.com/vi/${this.youtubeId}/mqdefault.jpg` },
  },
  {
    id: 2,
    title: "KINGDOM LIFE CELEBRATION | PG's Birthday",
    series: "Special Service",
    year: "2026",
    speaker: "Gideon Mba",
    duration: "2:19:31",
    youtubeId: "duNrqnjWZ6A",
    tags: ["worship", "celebration", "kingdom", "gideon mba"],
    get thumbnail() { return `https://img.youtube.com/vi/${this.youtubeId}/mqdefault.jpg` },
  },
  {
    id: 3,
    title: "GO | CSM Annual Camp Meeting 2026 – Day 3 Morning",
    series: "CSM Annual Camp Meeting 2026",
    year: "2026",
    speaker: "Multiple Speakers",
    duration: "4:42:13",
    youtubeId: "UWNyyteMj7g",
    tags: ["camp meeting", "day 3", "go", "2026"],
    get thumbnail() { return `https://img.youtube.com/vi/${this.youtubeId}/mqdefault.jpg` },
  },
  {
    id: 4,
    title: "GO | CSM Annual Camp Meeting 2026 – Evening",
    series: "CSM Annual Camp Meeting 2026",
    year: "2026",
    speaker: "Multiple Speakers",
    duration: "4:42:13",
    youtubeId: "duNrqnjWZ6A",
    tags: ["camp meeting", "evening", "go", "2026"],
    get thumbnail() { return `https://img.youtube.com/vi/${this.youtubeId}/mqdefault.jpg` },
  },
  {
    id: 5,
    title: "GO-Mission: Taking Your Place in God's Apostolic Agenda – Day 1",
    series: "GO Mission 3-Day Teaching Series",
    year: "2025",
    speaker: "Gideon Mba",
    duration: "1:38:00",
    youtubeId: "UWNyyteMj7g",
    tags: ["mission", "apostolic", "teaching", "gideon mba"],
    get thumbnail() { return `https://img.youtube.com/vi/${this.youtubeId}/mqdefault.jpg` },
  },
  {
    id: 6,
    title: "GO-Mission: A 3-Day Teaching & Activation Series – Day 2",
    series: "GO Mission 3-Day Teaching Series",
    year: "2025",
    speaker: "Gideon Mba",
    duration: "1:52:20",
    youtubeId: "duNrqnjWZ6A",
    tags: ["mission", "activation", "teaching", "gideon mba"],
    get thumbnail() { return `https://img.youtube.com/vi/${this.youtubeId}/mqdefault.jpg` },
  },
  {
    id: 7,
    title: "Alters & Thrones",
    series: "Apostolos CSM Camp Meeting",
    year: "2025",
    speaker: "Benjamin Kasankya",
    duration: "58:12",
    youtubeId: "UWNyyteMj7g",
    tags: ["worship", "prayer", "altars", "2025"],
    get thumbnail() { return `https://img.youtube.com/vi/${this.youtubeId}/mqdefault.jpg` },
  },
  {
    id: 8,
    title: "Say Yes First",
    series: "Apostolos CSM Camp Meeting",
    year: "2025",
    speaker: "Isi Igenegba",
    duration: "1:02:44",
    youtubeId: "duNrqnjWZ6A",
    tags: ["faith", "obedience", "yes", "2025"],
    get thumbnail() { return `https://img.youtube.com/vi/${this.youtubeId}/mqdefault.jpg` },
  },
]

const testimonies = [
  {
    name: "Adwoa N.",
    event: "Soul Connect 2025",
    text: "CSM reminded me that purpose isn't something you find alone. It grows when you share the journey with the right people.",
    image: photos[3],
  },
  {
    name: "Kweku A.",
    event: "Annual Camp Meeting 2025",
    text: "I came broken and left with a blueprint. The messages were direct, the community was warm, and God showed up powerfully.",
    image: photos[1],
  },
  {
    name: "Blessing O.",
    event: "The Purpose Summit 2024",
    text: "For the first time in years I felt seen, challenged, and equipped. CSM doesn't just do events—they create encounters.",
    image: photos[5],
  },
  {
    name: "Emmanuel T.",
    event: "Creative Souls Forum",
    text: "The conversations in that room unlocked a vision I had been sitting on for 3 years. I left and started building the next day.",
    image: photos[7],
  },
]

const services = [
  {
    icon: "mic",
    title: "Gospel Outreach",
    desc: "Evangelism programs, street missions, and community gospel campaigns that take the message beyond church walls.",
  },
  {
    icon: "users",
    title: "Community Building",
    desc: "Safe spaces and circles where people at every stage of their journey can connect, grow, and belong.",
  },
  {
    icon: "book",
    title: "Discipleship Programs",
    desc: "Structured teachings, mentorship tracks, and accountability groups grounded in Scripture and practical living.",
  },
  {
    icon: "video",
    title: "Media Production",
    desc: "High-quality gospel content—sermons, films, podcasts, and campaigns—created to reach the digital generation.",
  },
  {
    icon: "calendar",
    title: "Events & Conferences",
    desc: "Flagship gatherings, camps, and summits designed to awaken purpose and multiply impact.",
  },
  {
    icon: "heart",
    title: "Counseling & Support",
    desc: "Pastoral care and structured support for individuals navigating life transitions, grief, and spiritual questions.",
  },
]

const events = [
  {
    date: "25",
    month: "AUG",
    title: "Annual Camp Meeting 2027",
    place: "Capstone Resource Centre, Lagos",
    type: "Upcoming",
    image: CSM_IMAGES.events[0],
    time: "9:00 AM",
  },
  {
    date: "12",
    month: "OCT",
    title: "The Purpose Summit",
    place: "Lagos, Nigeria",
    type: "Upcoming",
    image: CSM_IMAGES.events[1],
    time: "10:00 AM",
  },
  {
    date: "07",
    month: "DEC",
    title: "Kingdom Life Celebration",
    place: "Lagos, Nigeria",
    type: "Upcoming",
    image: CSM_IMAGES.events[2],
    time: "5:00 PM",
  },
  {
    date: "26",
    month: "AUG",
    title: "Apostolos Annual Camp Meeting 2025",
    place: "Capstone Resource Centre, Lagos",
    type: "Past",
    image: CSM_IMAGES.events[3],
    time: "9:00 AM",
  },
  {
    date: "29",
    month: "AUG",
    title: "Altars & Thrones Annual Camp Meeting",
    place: "Snug Banquet Hall, Lagos",
    type: "Past",
    image: CSM_IMAGES.events[4],
    time: "9:00 AM",
  },
  {
    date: "24",
    month: "AUG",
    title: "City Takers Annual Camp Meeting",
    place: "Snug Banquet Hall, Lagos",
    type: "Past",
    image: CSM_IMAGES.events[5],
    time: "9:00 AM",
  },
]

const team = [
  { name: "Abena Owusu", role: "Founder & Visioneer", image: photos[3] },
  { name: "Kwame Mensah", role: "Programs Lead", image: photos[1] },
  { name: "Ama Boateng", role: "Partnerships Director", image: photos[6] },
  { name: "Nana K. Asare", role: "Creative Director", image: photos[7] },
]

const nav = [
  ["HOME", "/"],
  ["SERVICES", "/services"],
  ["EVENTS", "/events"],
  ["SERMONS", "/sermons"],
  ["ARCHIVE", "/archive"],
  ["TESTIMONIES", "/testimonies"],
  ["FAQs", "/faqs"],
  ["CONTACT", "/contact"],
]

function go(path: string) {
  window.history.pushState({}, "", path)
  window.dispatchEvent(new PopStateEvent("popstate"))
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function Link({
  href,
  className = "",
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (href.startsWith("/")) {
          e.preventDefault()
          go(href)
        }
      }}
    >
      {children}
    </a>
  )
}

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    ),
    check: <path d="m5 12 4 4L19 6" />,
    quote: (
      <path d="M9 11H5a4 4 0 0 1 4-4v8a4 4 0 0 1-4 4M19 11h-4a4 4 0 0 1 4-4v8a4 4 0 0 1-4 4" />
    ),
    play: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </>
    ),
    mic: (
      <>
        <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </>
    ),
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </>
    ),
    video: (
      <>
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    heart: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
    shield: (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    ),
    dollar: (
      <>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </>
    ),
    chevronLeft: <path d="m15 18-6-6 6-6" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    star: (
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    download: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </>
    ),
    send: <path d="m22 2-7 20-4-9-9-4 20-7z" />,
    bot: (
      <>
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <line x1="8" y1="16" x2="8.01" y2="16" />
        <line x1="16" y1="16" x2="16.01" y2="16" />
      </>
    ),
    youtube: (
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    ),
    externalLink: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </>
    ),
  }
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

function Splash() {
  const [show, setShow] = useState(() => !sessionStorage.getItem("csm-seen"))
  useEffect(() => {
    if (!show) return
    const id = setTimeout(() => {
      sessionStorage.setItem("csm-seen", "1")
      setShow(false)
    }, 2000)
    return () => clearTimeout(id)
  }, [show])
  if (!show) return null
  return (
    <div
      className="splash"
      role="status"
      aria-label="Loading Choice Souls Media"
      onClick={() => setShow(false)}
    >
      <img src={logo} alt="Choice Souls Media" style={{ width: "200px", height: "200px", objectFit: "contain" }} />
      <div className="splash-name">CHOICE SOULS MEDIA</div>
      <div className="splash-line">
        <span />
      </div>
      <small>Tap to skip</small>
    </div>
  )
}

function Reveal({
  children,
  className = "",
  stagger = false,
}: {
  children: React.ReactNode
  className?: string
  stagger?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in")
          ob.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [])
  return (
    <div ref={ref} className={`${stagger ? "stagger" : "reveal"} ${className}`}>
      {children}
    </div>
  )
}

function Navbar({ path }: { path: string }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="nav-wrap">
      <nav className="navbar" aria-label="Main navigation">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <img src={logo} alt="Choice Souls Media logo" />
          </span>
          <span className="brand-text">CHOICE SOULS MEDIA</span>
        </Link>
        <div className="nav-links">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={path === href ? "active" : ""}
            >
              {label}
            </Link>
          ))}
        </div>
        <Link href="/partner" className="button nav-cta">
          PARTNER WITH US <Icon name="arrow" size={16} />
        </Link>
        <button
          className="menu-button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Icon name="menu" />
        </button>
      </nav>
      {/* Mobile overlay backdrop */}
      {open && <div className="mobile-backdrop" onClick={() => setOpen(false)} />}
      <div className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="mobile-head">
          <div className="mobile-brand">
            <img src={logo} alt="Choice Souls Media" />
            <span>CHOICE SOULS MEDIA</span>
          </div>
          <button aria-label="Close menu" onClick={() => setOpen(false)}>
            <Icon name="close" />
          </button>
        </div>
        <div className="mobile-nav-links">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={path === href ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="mobile-footer-actions">
          <Link href="/partner" className="button" onClick={() => setOpen(false)}>
            PARTNER WITH US <Icon name="arrow" size={16} />
          </Link>
        </div>
      </div>
    </header>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span />
      {children}
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: string
  text?: string
}) {
  return (
    <Reveal className="section-heading">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  )
}

// Flip countdown — Aug 25, 2027 — styled like a classic flip clock
function Countdown() {
  const target = new Date("2027-08-25T09:00:00")
  const calc = () => Math.max(0, target.getTime() - Date.now())
  const [left, setLeft] = useState(calc)
  const prevVals = useRef([-1, -1, -1, -1])
  const [flipping, setFlipping] = useState([false, false, false, false])

  useEffect(() => {
    const id = setInterval(() => setLeft(calc()), 1000)
    return () => clearInterval(id)
  }, [])

  const vals = [
    Math.floor(left / 86400000),
    Math.floor(left / 3600000) % 24,
    Math.floor(left / 60000) % 60,
    Math.floor(left / 1000) % 60,
  ]

  useEffect(() => {
    const next = vals.map((v, i) => v !== prevVals.current[i])
    if (next.some(Boolean)) {
      setFlipping(next)
      prevVals.current = [...vals]
      const t = setTimeout(() => setFlipping([false, false, false, false]), 380)
      return () => clearTimeout(t)
    }
  }, [vals.join(",")])

  const labels = ["DAYS", "HOURS", "MINUTES", "SECONDS"]

  return (
    <div className="flip-clock">
      {vals.map((n, i) => (
        <div key={i} className="flip-clock-unit">
          <span className="flip-clock-label">{labels[i]}</span>
          <div className={`flip-clock-card ${flipping[i] ? "flipping" : ""}`}>
            <div className="flip-card-top">{String(n).padStart(2, "0")}</div>
            <div className="flip-card-bottom">{String(n).padStart(2, "0")}</div>
            <div className="flip-card-fold" aria-hidden="true">
              <div className="fold-upper">{String(n).padStart(2, "0")}</div>
              <div className="fold-lower">{String(vals[i] + 1).padStart(2, "0")}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Programs and Announcements carousel
function ProgramsCarousel() {
  const [current, setCurrent] = useState(0)
  const total = programSlides.length

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % total), 5000)
    return () => clearInterval(id)
  }, [total])

  const slide = programSlides[current]

  return (
    <section className="programs-section section">
      <div className="page-shell">
        <Reveal className="section-heading programs-heading">
          <Eyebrow>FEATURED MEDIA</Eyebrow>
          <h2>Programs and Announcements</h2>
        </Reveal>
        <div className="programs-carousel">
          <div
            className="carousel-slide"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="carousel-bg-img"
            />
            <div className="carousel-overlay" />
            <div className="carousel-content">
              <span className="carousel-label">{slide.label}</span>
              <h3>{slide.title}</h3>
              <p>{slide.subtitle}</p>
              <div className="carousel-meta">
                <span><Icon name="calendar" size={14} /> {slide.dates}</span>
                <span><Icon name="pin" size={14} /> {slide.location}</span>
              </div>
            </div>
            <button
              className="carousel-arrow carousel-prev"
              onClick={() => setCurrent((c) => (c - 1 + total) % total)}
              aria-label="Previous slide"
            >
              <Icon name="chevronLeft" size={22} />
            </button>
            <button
              className="carousel-arrow carousel-next"
              onClick={() => setCurrent((c) => (c + 1) % total)}
              aria-label="Next slide"
            >
              <Icon name="chevronRight" size={22} />
            </button>
            <div className="carousel-dots">
              {programSlides.map((_, i) => (
                <button
                  key={i}
                  className={`carousel-dot ${i === current ? "active" : ""}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Upcoming Program countdown */}
        <div className="upcoming-program-box">
          <div className="upcoming-label">
            <Eyebrow>UPCOMING PROGRAM</Eyebrow>
          </div>
          <h3>ANNUAL CAMP MEETING 2027</h3>
          <p className="upcoming-sub">August 25 – 28, 2027 · Lagos, Nigeria · The missional generation</p>
          <Countdown />
        </div>
      </div>
    </section>
  )
}

function Home({ openLightbox }: { openLightbox: (n: number) => void }) {
  return (
    <main id="main">
      <HeroFull />
      <ProgramsCarousel />
      <EventsPreview />
      <FeaturedSermons />
      <section className="section page-shell">
        <SectionHeading
          eyebrow="Moments that matter"
          title="Life, captured in full."
          text="Real people. Real stories. A growing movement."
        />
        <GalleryGrid images={photos.slice(0, 6)} openLightbox={openLightbox} />
        <div className="center">
          <Link href="/gallery" className="button button-outline">
            EXPLORE THE GALLERY <Icon name="arrow" size={17} />
          </Link>
        </div>
      </section>
      <Quote />
      <PartnerBand />
    </main>
  )
}

function HeroFull() {
  const [imgIndex, setImgIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setImgIndex((i) => (i + 1) % CSM_IMAGES.hero.length), 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="hero-full">
      {CSM_IMAGES.hero.map((p, i) => (
        <div
          key={p}
          className={`hero-bg-slide ${i === imgIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${p})` }}
        />
      ))}
      <div className="hero-full-overlay" />
      <div className="hero-full-content page-shell">
        <Eyebrow>A global community of believers</Eyebrow>
        <h1>
          Raising souls for <em>God's Kingdom.</em>
        </h1>
        <p>
          Choice Souls Media is a global interdenominational network of believers and ministries
          committed to raising a generation that takes God's word to the nations.
        </p>
      </div>
      {/* Dot indicators */}
      <div className="hero-counter">
        <div className="hero-counter-dots">
          {CSM_IMAGES.hero.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === imgIndex ? "active" : ""}`}
              onClick={() => setImgIndex(i)}
              aria-label={`Photo ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedSermons() {
  const [active, setActive] = useState(0)
  const sermon = sermons[active]
  return (
    <section className="section soft">
      <div className="page-shell">
        <div className="heading-row">
          <SectionHeading eyebrow="Gospel Messages" title="Featured Sermons" />
          <Link href="/sermons" className="text-link">
            VIEW ALL PREVIOUS VIDEOS <Icon name="arrow" size={17} />
          </Link>
        </div>
        <div className="sermons-layout">
          <div className="sermon-video">
            <div className="video-embed-wrap">
              <iframe
                src={`https://www.youtube.com/embed/${sermon.youtubeId}?rel=0&modestbranding=1`}
                title={sermon.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div style={{ marginTop: "14px" }}>
              <span className="sermon-year">{sermon.year} · {sermon.duration}</span>
              <h3 style={{ margin: "4px 0" }}>{sermon.title}</h3>
              <p style={{ fontSize: ".78rem", margin: "0 0 12px" }}>{sermon.series} · {sermon.speaker}</p>
              <div className="sermon-dl-row">
                <a href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`} target="_blank" rel="noreferrer" className="sermon-dl-btn">
                  <Icon name="youtube" size={14} /> Watch on YouTube
                </a>
                <a href={`https://www.y2mate.com/youtube/${sermon.youtubeId}`} target="_blank" rel="noreferrer" className="sermon-dl-btn">
                  <Icon name="download" size={14} /> Download Video
                </a>
                <a href={`https://ytmp3.nu/youtube-to-mp3/?url=https://youtu.be/${sermon.youtubeId}`} target="_blank" rel="noreferrer" className="sermon-dl-btn">
                  <Icon name="download" size={14} /> Download Audio
                </a>
              </div>
            </div>
          </div>
          <div className="sermon-list">
            {sermons.map((s, i) => (
              <button
                key={s.id}
                className={`sermon-item ${i === active ? "active" : ""}`}
                onClick={() => setActive(i)}
              >
                <span className="sermon-thumb">
                  <img src={s.thumbnail} alt={s.title} />
                  <span className="sermon-play">
                    <Icon name="play" size={14} />
                  </span>
                </span>
                <span className="sermon-info">
                  <b>{s.title}</b>
                  <small>{s.speaker}</small>
                  <span className="sermon-year">{s.year} · {s.duration}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function EventsPreview() {
  return (
    <section className="section overflow">
      <div className="page-shell">
        <div className="heading-row">
          <SectionHeading
            eyebrow="Recent experiences"
            title="Energy you can feel."
          />
          <Link href="/events" className="text-link">
            VIEW ALL EVENTS <Icon name="arrow" size={17} />
          </Link>
        </div>
        <Reveal stagger className="event-scroll">
          {events.slice(0, 3).map((e) => (
            <article className="event-card" key={e.title}>
              <div className="event-photo">
                <img src={e.image} alt="" loading="lazy" />
                <span className="date-badge">
                  <b>{e.date}</b>
                  {e.month}
                </span>
              </div>
              <div>
                <span>
                  <Icon name="pin" size={15} />
                  {e.place}
                </span>
                <h3>{e.title}</h3>
                <Link href="/events">
                  VIEW EXPERIENCE <Icon name="arrow" size={15} />
                </Link>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function GalleryGrid({
  images,
  openLightbox,
}: {
  images: string[]
  openLightbox: (n: number) => void
}) {
  return (
    <Reveal stagger className="gallery-grid">
      {images.map((p, i) => (
        <button
          key={p}
          className={`gallery-item g${i + 1}`}
          onClick={() => openLightbox(i)}
          aria-label={`Open gallery photo ${i + 1}`}
        >
          <img src={p} alt={`CSM community moment ${i + 1}`} loading="lazy" />
          <span>
            VIEW <Icon name="arrow" size={15} />
          </span>
        </button>
      ))}
    </Reveal>
  )
}

function Quote() {
  return (
    <section className="section quote-section page-shell">
      <div className="quote-mark">
        <Icon name="quote" size={36} />
      </div>
      <Reveal>
        <blockquote>
          "CSM reminded me that purpose isn't something you find alone. It grows
          when you share the journey with the right people."
        </blockquote>
        <p>
          <b>Adwoa N.</b> · Soul Connect attendee
        </p>
      </Reveal>
    </section>
  )
}

function PartnerBand() {
  return (
    <section className="partner-band">
      <div className="page-shell">
        <div>
          <Eyebrow>Build impact with us</Eyebrow>
          <h2>Let's move people forward, together.</h2>
        </div>
        <Link href="/partner" className="button button-light">
          BECOME A PARTNER <Icon name="arrow" size={18} />
        </Link>
      </div>
    </section>
  )
}

function PageHero({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: string
  text: string
}) {
  return (
    <section className="page-hero page-shell">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{text}</p>
      </Reveal>
    </section>
  )
}

function About() {
  const values = [
    [
      "01",
      "Intentionality",
      "We make thoughtful choices and create with meaning.",
    ],
    [
      "02",
      "Community",
      "We believe transformation happens in trusted circles.",
    ],
    [
      "03",
      "Excellence",
      "We honor the vision through craft, care, and consistency.",
    ],
    [
      "04",
      "Courage",
      "We choose brave conversations and bolder possibilities.",
    ],
  ]
  return (
    <main id="main">
      <PageHero
        eyebrow="Our story"
        title="Purpose is personal. Impact is shared."
        text="We exist to help people make meaningful choices and become more fully who they were created to be."
      />
      <section className="section page-shell visioneer">
        <div className="profile-image">
          <img src={photos[3]} alt="Abena Owusu, Founder and Visioneer" />
          <span>THE VISIONEER</span>
        </div>
        <Reveal>
          <Eyebrow>Meet the founder</Eyebrow>
          <h2>Abena Owusu</h2>
          <h4>Founder & Chief Visioneer</h4>
          <p>
            [Placeholder bio] Abena is a purpose strategist, creative producer,
            and convener who believes the right room can redirect a life. She
            founded CSM to create those rooms—with intention, warmth, and
            uncommon excellence.
          </p>
          <blockquote>
            "We don't gather for the sake of gathering. We gather so that
            something within us can move."
          </blockquote>
        </Reveal>
      </section>
      <section className="section soft">
        <div className="page-shell">
          <Reveal stagger className="vision-grid">
            <article>
              <span>01</span>
              <Eyebrow>Our vision</Eyebrow>
              <h3>A world where people choose lives of meaning.</h3>
            </article>
            <article>
              <span>02</span>
              <Eyebrow>Our mission</Eyebrow>
              <h3>
                To curate experiences that awaken purpose and multiply impact.
              </h3>
            </article>
          </Reveal>
        </div>
      </section>
      <section className="section page-shell">
        <SectionHeading eyebrow="What guides us" title="Values in action." />
        <Reveal stagger className="values-grid">
          {values.map(([n, t, d]) => (
            <article key={t}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </Reveal>
      </section>
      <section className="section journey">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Our journey"
            title="Built one brave choice at a time."
          />
          <Reveal stagger className="timeline">
            {[
              [
                "2018",
                "The first circle",
                "CSM begins as an intimate conversation among 24 creatives.",
              ],
              [
                "2020",
                "Purpose online",
                "A digital series keeps our community connected across borders.",
              ],
              [
                "2023",
                "A bigger table",
                "Our flagship gatherings welcome over 2,000 people.",
              ],
              [
                "2026",
                "The next chapter",
                "New cities, deeper partnerships, and an expanded vision.",
              ],
            ].map(([y, t, d]) => (
              <article key={y}>
                <b>{y}</b>
                <i />
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
      <section className="section page-shell">
        <SectionHeading
          eyebrow="Leadership"
          title="The people behind the purpose."
        />
        <Reveal stagger className="team-grid">
          {team.map((m) => (
            <article key={m.name}>
              <img src={m.image} alt={m.name} loading="lazy" />
              <h3>{m.name}</h3>
              <p>{m.role}</p>
            </article>
          ))}
        </Reveal>
      </section>
      <PartnerBand />
    </main>
  )
}

function ServicesPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="What we do"
        title="Purposeful work. Lasting impact."
        text="Everything we do is built around one idea: that people who discover their purpose change everything around them."
      />
      <section className="section page-shell">
        <SectionHeading
          eyebrow="Our offerings"
          title="How we serve."
          text="From gospel outreach to media production, our work spans multiple areas of ministry and community."
        />
        <Reveal stagger className="services-grid">
          {services.map((s) => (
            <article key={s.title} className="service-card">
              <span className="service-icon">
                <Icon name={s.icon} size={28} />
              </span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </Reveal>
      </section>
      <section className="section soft">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Discipleship track"
            title="Grow where you are."
            text="Our structured programs meet you at your level—whether you're new to faith or stepping deeper into purpose."
          />
          <Reveal stagger className="track-steps">
            {[
              ["01", "Connect", "Join a community group or attend an event to get started."],
              ["02", "Grow", "Enroll in our discipleship track or mentorship program."],
              ["03", "Serve", "Use your gifts within the CSM community and beyond."],
              ["04", "Lead", "Step into leadership and help others find their path."],
            ].map(([n, t, d]) => (
              <article key={t}>
                <b>{n}</b>
                <i />
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
      <PartnerBand />
    </main>
  )
}

function Events() {
  const [filter, setFilter] = useState("All")
  const shown = events.filter((e) => filter === "All" || e.type === filter)
  return (
    <main id="main">
      <PageHero
        eyebrow="Gather with intention"
        title="Experiences designed to move you."
        text="From intimate circles to landmark summits, every CSM gathering is created to spark clarity, connection, and action."
      />
      <section className="featured-event page-shell">
        <div className="featured-image">
          <img src={events[0].image} alt="" />
          <span>FEATURED</span>
        </div>
        <div>
          <Eyebrow>Next experience</Eyebrow>
          <h2>The Purpose Summit</h2>
          <p>
            A one-day immersive experience for people ready to turn inner
            clarity into meaningful action.
          </p>
          <div className="event-meta">
            <span>
              <Icon name="pin" />
              Accra City Hall
            </span>
            <span>24 AUG 2026 · 10:00 AM</span>
          </div>
          <Countdown />
          <Link href="/contact" className="button">
            RESERVE INTEREST <Icon name="arrow" size={17} />
          </Link>
        </div>
      </section>
      <section className="section soft">
        <div className="page-shell">
          <div className="filter-row">
            <div>
              <Eyebrow>Event calendar</Eyebrow>
              <h2>Find your next room.</h2>
            </div>
            <div className="filters">
              {["All", "Upcoming", "Past"].map((f) => (
                <button
                  key={f}
                  className={filter === f ? "active" : ""}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <Reveal stagger className="event-list">
            {shown.map((e) => (
              <article key={e.title}>
                <div className="list-date">
                  <b>{e.date}</b>
                  <span>{e.month}</span>
                </div>
                <div>
                  <span>{e.type}</span>
                  <h3>{e.title}</h3>
                  <p>
                    {e.time} · {e.place}
                  </p>
                </div>
                <p>
                  A curated CSM experience for meaningful conversations, fresh
                  perspective, and genuine community.
                </p>
                <Link
                  href="/contact"
                  className="round-arrow"
                  aria-label={`Details for ${e.title}`}
                >
                  <Icon name="arrow" />
                </Link>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
      <PartnerBand />
    </main>
  )
}

function SermonsPage() {
  const [active, setActive] = useState(0)
  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const years = ["All", "2026", "2025"]
  const sermon = sermons[active]

  const shown = sermons.filter((s) => {
    const matchYear = filter === "All" || s.year === filter
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.speaker.toLowerCase().includes(q) ||
      s.series.toLowerCase().includes(q) ||
      s.tags.some((t) => t.includes(q))
    return matchYear && matchSearch
  })

  return (
    <main id="main">
      <PageHero
        eyebrow="Gospel Messages"
        title="The word that changes everything."
        text="Every message is a moment. Browse, search, and download our full library of sermons and teachings."
      />
      <section className="section page-shell">
        <div className="sermons-layout featured-sermon-layout">
          <div className="sermon-video">
            <div className="video-embed-wrap">
              <iframe
                src={`https://www.youtube.com/embed/${sermon.youtubeId}?rel=0&modestbranding=1`}
                title={sermon.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div style={{ marginTop: "16px" }}>
              <span className="sermon-year">{sermon.year} · {sermon.duration}</span>
              <h3 style={{ marginBottom: "4px", marginTop: "4px" }}>{sermon.title}</h3>
              <p style={{ fontSize: ".78rem", margin: "0 0 12px" }}>{sermon.series} · {sermon.speaker}</p>
              <div className="sermon-dl-row">
                <a href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`} target="_blank" rel="noreferrer" className="sermon-dl-btn">
                  <Icon name="youtube" size={14} /> Watch on YouTube
                </a>
                <a href={`https://www.y2mate.com/youtube/${sermon.youtubeId}`} target="_blank" rel="noreferrer" className="sermon-dl-btn">
                  <Icon name="download" size={14} /> Download Video
                </a>
                <a href={`https://ytmp3.nu/youtube-to-mp3/?url=https://youtu.be/${sermon.youtubeId}`} target="_blank" rel="noreferrer" className="sermon-dl-btn">
                  <Icon name="download" size={14} /> Download Audio (MP3)
                </a>
                <a href="https://www.youtube.com/@ChoiceSouls" target="_blank" rel="noreferrer" className="sermon-dl-btn">
                  <Icon name="externalLink" size={14} /> Subscribe on YouTube
                </a>
              </div>
            </div>
          </div>
          <div className="sermon-list">
            {sermons.map((s, i) => (
              <button
                key={s.id}
                className={`sermon-item ${i === active ? "active" : ""}`}
                onClick={() => setActive(i)}
              >
                <span className="sermon-thumb">
                  <img src={s.thumbnail} alt={s.title} />
                  <span className="sermon-play">
                    <Icon name="play" size={14} />
                  </span>
                </span>
                <span className="sermon-info">
                  <b>{s.title}</b>
                  <small>{s.speaker}</small>
                  <span className="sermon-year">{s.year} · {s.duration}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="page-shell">
          <div className="filter-row">
            <SectionHeading eyebrow="All messages" title="Browse the library." />
            <div className="filters">
              {years.map((y) => (
                <button
                  key={y}
                  className={filter === y ? "active" : ""}
                  onClick={() => setFilter(y)}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
          {/* Search bar */}
          <div className="sermon-search-bar">
            <Icon name="search" size={16} />
            <input
              type="text"
              placeholder="Search by title, speaker, or topic…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {shown.length === 0 ? (
            <p style={{ textAlign: "center", padding: "40px 0" }}>No messages found for "{search}". Try a different keyword.</p>
          ) : (
            <Reveal stagger className="sermons-grid">
              {shown.map((s) => (
                <article
                  key={s.id}
                  className="sermon-card"
                  onClick={() => {
                    setActive(sermons.indexOf(s))
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                >
                  <div className="sermon-card-thumb">
                    <img src={s.thumbnail} alt={s.title} loading="lazy" />
                    <span className="sermon-card-play">
                      <Icon name="play" size={20} />
                    </span>
                  </div>
                  <div className="sermon-card-body">
                    <span className="sermon-year">{s.year} · {s.duration}</span>
                    <h3>{s.title}</h3>
                    <p>{s.series} · {s.speaker}</p>
                  </div>
                </article>
              ))}
            </Reveal>
          )}
          <div className="center">
            <a href="https://www.youtube.com/@ChoiceSouls" target="_blank" rel="noreferrer" className="button">
              <Icon name="youtube" size={16} /> VIEW ALL ON YOUTUBE
            </a>
          </div>
        </div>
      </section>
      <PartnerBand />
    </main>
  )
}

function ArchivePage() {
  const [filter, setFilter] = useState("All")
  const categories = ["All", "Sermons", "Events", "Media", "Programs"]
  return (
    <main id="main">
      <PageHero
        eyebrow="The CSM archive"
        title="Everything, in one place."
        text="A complete record of our messages, events, media, and programs from across the years."
      />
      <section className="section page-shell">
        <div className="filter-row">
          <SectionHeading eyebrow="Browse all" title="Find what you're looking for." />
          <div className="filters">
            {categories.map((c) => (
              <button
                key={c}
                className={filter === c ? "active" : ""}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <Reveal stagger className="archive-grid">
          {[...sermons, ...events.map((e) => ({
            id: e.title,
            title: e.title,
            series: e.place,
            year: "2026",
            thumbnail: e.image,
            youtubeId: null,
          }))].map((item, i) => (
            <article key={i} className="archive-card">
              <div className="archive-thumb">
                <img src={"thumbnail" in item ? item.thumbnail : photos[i % photos.length]} alt={item.title} loading="lazy" />
              </div>
              <div className="archive-body">
                <span className="sermon-year">{item.year}</span>
                <h3>{item.title}</h3>
                <p>{"series" in item ? item.series : ""}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </section>
      <PartnerBand />
    </main>
  )
}

function TestimoniesPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Changed lives"
        title="What God has done."
        text="Real stories from real people whose lives have been touched through Choice Souls Media."
      />
      <section className="section page-shell">
        <Reveal stagger className="testimonies-grid">
          {testimonies.map((t) => (
            <article key={t.name} className="testimony-card">
              <div className="testimony-stars">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" size={16} />
                ))}
              </div>
              <blockquote>"{t.text}"</blockquote>
              <div className="testimony-author">
                <img src={t.image} alt={t.name} />
                <div>
                  <b>{t.name}</b>
                  <small>{t.event}</small>
                </div>
              </div>
            </article>
          ))}
        </Reveal>
      </section>
      <section className="section soft">
        <div className="page-shell testimony-cta">
          <Reveal>
            <Eyebrow>Share your story</Eyebrow>
            <h2>Has God moved in your life through CSM?</h2>
            <p>We would love to hear your testimony and share it with our community.</p>
            <Link href="/contact" className="button">
              SHARE YOUR TESTIMONY <Icon name="arrow" size={17} />
            </Link>
          </Reveal>
        </div>
      </section>
      <PartnerBand />
    </main>
  )
}

function FAQsPage() {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    {
      q: "What is Choice Souls Media?",
      a: "Choice Souls Media (CSM) is a purpose-driven platform creating transformative experiences at the intersection of faith, personal growth, creativity, and community.",
    },
    {
      q: "How can I attend a CSM event?",
      a: "Visit our Events page to see upcoming gatherings. You can reserve your interest directly through the site or contact us for more information.",
    },
    {
      q: "How do I access the sermons?",
      a: "All our sermons are available on the Sermons page. You can also find us on YouTube by searching for Choice Souls Media.",
    },
    {
      q: "How can I partner with or donate to CSM?",
      a: "Visit the Partner page to explore partnership tiers and make a donation. We accept multiple currencies including USD and Naira through a secure payment gateway.",
    },
    {
      q: "Can I volunteer with CSM?",
      a: "Absolutely. We welcome volunteers across events, media, and community outreach. Reach out through our Contact page and let us know your area of interest.",
    },
    {
      q: "Does CSM have a discipleship program?",
      a: "Yes. Our discipleship track is designed to help you grow spiritually and practically. Learn more on the Services page.",
    },
    {
      q: "Where is CSM based?",
      a: "CSM is based in Lagos, Nigeria, with a growing community across Africa and beyond.",
    },
    {
      q: "How do I submit a prayer request or testimony?",
      a: "You can submit prayer requests and testimonies through our Contact page. We read every submission and believe in the power of prayer.",
    },
  ]
  return (
    <main id="main">
      <PageHero
        eyebrow="Got questions?"
        title="We have answers."
        text="Everything you need to know about Choice Souls Media—our programs, events, and how to get involved."
      />
      <section className="section page-shell">
        <div className="faqs-layout">
          <SectionHeading eyebrow="Common questions" title="Frequently asked." />
          <Reveal className="faqs-list">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item ${open === i ? "open" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span>{faq.q}</span>
                  <Icon name={open === i ? "close" : "help"} size={18} />
                </button>
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
        <div className="faq-contact-box">
          <Eyebrow>Still have questions?</Eyebrow>
          <h3>We are happy to help.</h3>
          <p>Reach out directly and our team will get back to you within 2–3 working days.</p>
          <Link href="/contact" className="button">
            CONTACT US <Icon name="arrow" size={17} />
          </Link>
        </div>
      </section>
      <PartnerBand />
    </main>
  )
}

function Gallery({ openLightbox }: { openLightbox: (n: number) => void }) {
  const [filter, setFilter] = useState("All")
  return (
    <main id="main">
      <PageHero
        eyebrow="The CSM archive"
        title="You had to be there."
        text="A visual record of brave conversations, joyful connection, and the moments between the moments."
      />
      <section className="section page-shell">
        <div className="filters gallery-filters">
          {["All", "Summits", "Community", "Workshops"].map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <GalleryGrid images={photos} openLightbox={openLightbox} />
      </section>
    </main>
  )
}

function FormField({
  label,
  name,
  type = "text",
  placeholder = "",
  required = true,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label>
      <span>{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </label>
  )
}

function PublicForm({ kind }: { kind: "partner" | "contact" }) {
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }
  if (sent)
    return (
      <div className="success-state">
        <span>
          <Icon name="check" size={28} />
        </span>
        <h3>Thank you for reaching out.</h3>
        <p>
          Your message is ready. Connect Supabase to enable secure delivery and
          database storage.
        </p>
        <button className="text-link" onClick={() => setSent(false)}>
          SEND ANOTHER
        </button>
      </div>
    )
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="honeypot">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-grid">
        <FormField label="Full name" name="name" placeholder="Your name" />
        <FormField
          label={kind === "partner" ? "Organization" : "Email address"}
          name={kind === "partner" ? "organization" : "email"}
          type={kind === "partner" ? "text" : "email"}
          placeholder={
            kind === "partner" ? "Company or organization" : "you@example.com"
          }
        />
        {kind === "partner" && (
          <FormField
            label="Email address"
            name="email"
            type="email"
            placeholder="you@organization.com"
          />
        )}
        <FormField
          label="Phone"
          name="phone"
          type="tel"
          placeholder="+234 or +1..."
          required={false}
        />
        {kind === "partner" && (
          <label>
            <span>Partnership type</span>
            <select name="type" required defaultValue="">
              <option value="" disabled>
                Select an option
              </option>
              <option>Event sponsor</option>
              <option>Program partner</option>
              <option>Media partner</option>
              <option>In-kind support</option>
            </select>
          </label>
        )}
      </div>
      <label>
        <span>Message</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Tell us a little about what you have in mind..."
          required
        />
      </label>
      <button className="button" type="submit">
        SEND MESSAGE <Icon name="arrow" size={17} />
      </button>
    </form>
  )
}

// Multi-currency donation widget
function DonationWidget() {
  const [currency, setCurrency] = useState<"USD" | "NGN" | "GBP" | "EUR" | "GHS">("USD")
  const [amount, setAmount] = useState("")
  const [customAmount, setCustomAmount] = useState(false)
  const [step, setStep] = useState<"amount" | "details" | "success">("amount")
  const [frequency, setFrequency] = useState<"once" | "monthly">("once")

  const currencySymbols: Record<string, string> = {
    USD: "$",
    NGN: "₦",
    GBP: "£",
    EUR: "€",
    GHS: "₵",
  }

  const presets: Record<string, number[]> = {
    USD: [10, 25, 50, 100, 250, 500],
    NGN: [5000, 10000, 25000, 50000, 100000, 250000],
    GBP: [10, 25, 50, 100, 250, 500],
    EUR: [10, 25, 50, 100, 250, 500],
    GHS: [50, 100, 250, 500, 1000, 2500],
  }

  const sym = currencySymbols[currency]

  if (step === "success") {
    return (
      <div className="donation-success">
        <span className="donation-success-icon">
          <Icon name="heart" size={32} />
        </span>
        <h3>Thank you for your generosity!</h3>
        <p>
          Your donation will be processed once the payment gateway is connected.
          We are grateful for your partnership in this mission.
        </p>
        <button className="button" onClick={() => { setStep("amount"); setAmount(""); setCustomAmount(false) }}>
          MAKE ANOTHER GIFT <Icon name="arrow" size={16} />
        </button>
      </div>
    )
  }

  if (step === "details") {
    return (
      <form
        className="contact-form donation-form"
        onSubmit={(e) => { e.preventDefault(); setStep("success") }}
      >
        <div className="donation-summary">
          <span>
            {frequency === "monthly" ? "Monthly" : "One-time"} gift: <b>{sym}{amount}</b>
          </span>
          <button type="button" className="text-link" onClick={() => setStep("amount")}>
            Change
          </button>
        </div>
        <div className="form-grid">
          <FormField label="First name" name="fname" placeholder="First name" />
          <FormField label="Last name" name="lname" placeholder="Last name" />
          <FormField label="Email address" name="email" type="email" placeholder="you@example.com" />
          <FormField label="Phone (optional)" name="phone" type="tel" placeholder="+234 or +1..." required={false} />
        </div>
        <label>
          <span>Dedication (optional)</span>
          <input name="dedication" type="text" placeholder="In honor of / In memory of..." />
        </label>
        <div className="donation-note">
          <Icon name="shield" size={15} />
          <span>Payments are processed securely. Connect Stripe / Paystack / Flutterwave to activate.</span>
        </div>
        <button className="button" type="submit" style={{ width: "100%" }}>
          COMPLETE DONATION <Icon name="arrow" size={17} />
        </button>
      </form>
    )
  }

  return (
    <div className="donation-widget">
      <div className="donation-frequency">
        {(["once", "monthly"] as const).map((f) => (
          <button
            key={f}
            className={frequency === f ? "active" : ""}
            onClick={() => setFrequency(f)}
          >
            {f === "once" ? "Give Once" : "Give Monthly"}
          </button>
        ))}
      </div>
      <div className="currency-selector">
        <label htmlFor="donation-currency">Currency</label>
        <div className="currency-flags">
          {(["USD", "NGN", "GBP", "EUR", "GHS"] as const).map((c) => (
            <button
              key={c}
              className={currency === c ? "active" : ""}
              onClick={() => { setCurrency(c); setAmount(""); setCustomAmount(false) }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <p className="donation-label">Select an amount ({currency})</p>
      <div className="donation-presets">
        {presets[currency].map((p) => (
          <button
            key={p}
            className={amount === String(p) && !customAmount ? "active" : ""}
            onClick={() => { setAmount(String(p)); setCustomAmount(false) }}
          >
            {sym}{p.toLocaleString()}
          </button>
        ))}
        <button
          className={customAmount ? "active" : ""}
          onClick={() => { setCustomAmount(true); setAmount("") }}
        >
          Custom
        </button>
      </div>
      {customAmount && (
        <label className="custom-amount-label">
          <span>{sym}</span>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
          />
        </label>
      )}
      <button
        className="button"
        style={{ width: "100%", marginTop: "20px" }}
        disabled={!amount}
        onClick={() => amount && setStep("details")}
      >
        GIVE {amount ? `${sym}${Number(amount).toLocaleString()}` : "NOW"} <Icon name="arrow" size={17} />
      </button>
      <p className="donation-secure">
        <Icon name="shield" size={13} />
        Secure · Multi-currency · USD, NGN, GBP, EUR & GHS supported
      </p>
    </div>
  )
}

function Partner() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Partnerships with purpose"
        title="Your support can shift a story."
        text="Partner with CSM to create thoughtful experiences, reach an engaged community, and build impact that lasts beyond the room."
      />

      {/* Donation Section */}
      <section className="section donation-section">
        <div className="page-shell donation-layout">
          <div className="donation-copy">
            <Eyebrow>Give to the mission</Eyebrow>
            <h2>Every gift moves the needle.</h2>
            <p>
              Your donation directly funds gospel outreach, community programs,
              discipleship content, and the events that transform lives. Give
              once or become a recurring partner.
            </p>
            <div className="donation-impact">
              {[
                [currencySymbols["NGN"] + "10,000", "Funds one community outreach session"],
                [currencySymbols["USD"] + "25", "Sponsors one person at a CSM event"],
                [currencySymbols["NGN"] + "50,000", "Supports one month of media production"],
                [currencySymbols["USD"] + "100", "Helps fund our discipleship program"],
              ].map(([amount, desc]) => (
                <div key={amount} className="impact-item">
                  <b>{amount}</b>
                  <span>{desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="donation-form-wrap">
            <DonationWidget />
          </div>
        </div>
      </section>

      <section className="section page-shell">
        <SectionHeading
          eyebrow="Why CSM"
          title="Shared values. Measurable impact."
        />
        <Reveal stagger className="benefits">
          {[
            [
              "Reach",
              "Connect with a growing community of purpose-led professionals and creatives.",
            ],
            [
              "Relevance",
              "Align your brand with meaningful, culturally resonant experiences.",
            ],
            [
              "Impact",
              "Help ideas, connections, and practical resources reach more people.",
            ],
          ].map(([t, d], i) => (
            <article key={t}>
              <span>0{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </Reveal>
      </section>
      <section className="section soft">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Ways to partner"
            title="Choose your way in."
          />
          <Reveal stagger className="tier-grid">
            {[
              [
                "Event Partner",
                "Bring a flagship experience to life through financial or in-kind support.",
              ],
              [
                "Program Partner",
                "Co-create an ongoing initiative around purpose, creativity, or leadership.",
              ],
              [
                "Media Partner",
                "Help powerful stories travel further through meaningful coverage and content.",
              ],
            ].map(([t, d], i) => (
              <article key={t} className={i === 1 ? "featured-tier" : ""}>
                <small>{i === 1 ? "MOST FLEXIBLE" : `0${i + 1}`}</small>
                <h3>{t}</h3>
                <p>{d}</p>
                <ul>
                  <li>
                    <Icon name="check" size={16} />
                    Brand visibility
                  </li>
                  <li>
                    <Icon name="check" size={16} />
                    Curated activations
                  </li>
                  <li>
                    <Icon name="check" size={16} />
                    Impact reporting
                  </li>
                </ul>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
      <section className="section page-shell">
        <SectionHeading
          eyebrow="The process"
          title="Simple, thoughtful, collaborative."
        />
        <Reveal stagger className="process">
          {[
            "Start a conversation",
            "Shape the opportunity",
            "Create together",
            "Measure the impact",
          ].map((x, i) => (
            <article key={x}>
              <b>0{i + 1}</b>
              <i />
              <h3>{x}</h3>
            </article>
          ))}
        </Reveal>
      </section>
      <section className="section inquiry">
        <div className="page-shell inquiry-grid">
          <div>
            <Eyebrow>Let's talk</Eyebrow>
            <h2>Build something meaningful with us.</h2>
            <p>
              Share a little about your organization and what partnership could
              look like. We'll reply within 2–3 working days.
            </p>
          </div>
          <PublicForm kind="partner" />
        </div>
      </section>
      <LogoMarquee />
    </main>
  )
}

// Helper for donation impact amounts
const currencySymbols: Record<string, string> = {
  USD: "$",
  NGN: "₦",
  GBP: "£",
  EUR: "€",
  GHS: "₵",
}

function LogoMarquee() {
  const items = [
    "CHOICE SOULS MEDIA",
    "ANNUAL CAMP MEETING",
    "CHOICE SOULS MEDIA",
    "GO — MISSIONAL GENERATION",
    "CHOICE SOULS MEDIA",
    "APOSTOLOS 2025",
    "CHOICE SOULS MEDIA",
    "CITY TAKERS",
    "CHOICE SOULS MEDIA",
    "ALTARS & THRONES",
  ]
  return (
    <section className="logo-marquee" aria-label="Choice Souls Media">
      <div>
        {[...items, ...items].map((x, i) => (
          <span key={i}>
            {x}
            <i />
          </span>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Start a conversation"
        title="We'd love to hear from you."
        text="Questions, ideas, invitations, or just a hello — send a note and the right person from our team will get back to you."
      />
      <section className="section page-shell contact-layout">
        <div>
          <Reveal stagger className="contact-cards">
            <article>
              <Icon name="mail" />
              <small>EMAIL / SUPPORT</small>
              <a href="mailto:info@choicesoulsmedia.org">
                info@choicesoulsmedia.org
              </a>
            </article>
            <article>
              <Icon name="phone" />
              <small>CALL / WHATSAPP</small>
              <a href="tel:+2348172013060">+234 817 201 3060</a>
            </article>
            <article>
              <Icon name="pin" />
              <small>VENUE — CAMP MEETING</small>
              <p>Capstone Resource Centre, 25 McEwen Street, Alagomeji, Lagos Mainland</p>
            </article>
            <article>
              <Icon name="pin" />
              <small>PREVIOUS VENUE</small>
              <p>Snug Banquet Hall, 1/3 Ijaoye Street by Alakija Roundabout, Jibowu, Lagos</p>
            </article>
          </Reveal>
          <div className="social-row">
            <span>FOLLOW US</span>
            {/* Instagram */}
            <a href="https://www.instagram.com/choicesouls/" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-icon-link">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            {/* Facebook */}
            <a href="https://www.facebook.com/choicesoulsMedia" target="_blank" rel="noreferrer" aria-label="Facebook" className="social-icon-link">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            {/* YouTube */}
            <a href="https://www.youtube.com/@ChoiceSouls" target="_blank" rel="noreferrer" aria-label="YouTube" className="social-icon-link">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            {/* WhatsApp */}
            <a href="https://wa.me/2348172013060" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="social-icon-link">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>
        <div className="form-card">
          <PublicForm kind="contact" />
        </div>
      </section>
      {/* Live Google Map — Capstone Resource Centre */}
      <div className="map-embed">
        <iframe
          title="Capstone Resource Centre, Lagos"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.5023456789!2d3.3617!3d6.4969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b5a2e6f7f7f%3A0x0!2sMcEwen+Street%2C+Alagomeji%2C+Lagos!5e0!3m2!1sen!2sng!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </main>
  )
}

function Policy({ type }: { type: "privacy" | "terms" }) {
  return (
    <main id="main">
      <PageHero
        eyebrow="The details"
        title={type === "privacy" ? "Privacy policy" : "Terms of use"}
        text={`Last updated: March 2026 · [Placeholder ${type} copy for legal review]`}
      />
      <section className="section page-shell policy">
        <h2>
          {type === "privacy"
            ? "Your information, handled with care."
            : "Using this website."}
        </h2>
        <p>
          This page contains placeholder policy content and must be reviewed by
          qualified legal counsel before launch. We collect only the information
          necessary to respond to inquiries and improve our services.
        </p>
        <h3>Information we collect</h3>
        <p>
          Contact details you voluntarily submit through forms, newsletter
          registration, or support channels. Once a database is connected,
          retention and deletion practices should be documented here.
        </p>
        <h3>Your choices</h3>
        <p>
          You may request access, correction, or deletion of your personal
          information by contacting hello@choicesoulmedia.org.
        </p>
      </section>
    </main>
  )
}

function AdminShell() {
  useEffect(() => {
    document.title = "Secure Console · CSM"
    const m = document.createElement("meta")
    m.name = "robots"
    m.content = "noindex,nofollow"
    document.head.appendChild(m)
    return () => m.remove()
  }, [])
  return (
    <main className="admin-shell">
      <div className="admin-card">
        <img src={logo} alt="CSM" />
        <Eyebrow>Secure console</Eyebrow>
        <h1>Backend connection required</h1>
        <p>
          The admin interface cannot securely authenticate users or store
          content until Supabase is connected. No fake credentials or
          browser-only password has been created.
        </p>
        <div className="admin-notice">
          <Icon name="check" />
          <span>
            <b>Public website is ready</b>
            <small>
              Connect Supabase to activate CMS, submissions, audit logs, and
              support chat.
            </small>
          </span>
        </div>
        <Link href="/" className="button button-outline">
          RETURN TO WEBSITE
        </Link>
      </div>
    </main>
  )
}

function NotFound() {
  return (
    <main id="main" className="not-found">
      <img src={logo} alt="CSM" />
      <span>404</span>
      <h1>This page took a different path.</h1>
      <p>Let's get you back to the heart of the story.</p>
      <Link href="/" className="button">
        BACK TO HOME <Icon name="arrow" size={17} />
      </Link>
    </main>
  )
}

function Footer() {
  const clicks = useRef<number[]>([])
  const hiddenClick = () => {
    const now = Date.now()
    clicks.current = [...clicks.current.filter((x) => now - x < 3000), now]
    if (clicks.current.length >= 4) go(adminPath)
  }
  return (
    <footer>
      <div className="page-shell footer-grid">
        <div className="footer-brand">
          <img src={logo} alt="Choice Souls Media" />
          <p>
            Creating experiences that awaken purpose, deepen connection, and
            move people forward.
          </p>
          {/* Real social icons in footer */}
          <div className="footer-socials">
            <a href="https://www.instagram.com/choicesouls/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://www.facebook.com/choicesoulsMedia" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.youtube.com/@ChoiceSouls" target="_blank" rel="noreferrer" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://wa.me/2348172013060" target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>
        <div>
          <h4>EXPLORE</h4>
          {nav.slice(0, 4).map(([t, h]) => (
            <Link href={h} key={h}>
              {t}
            </Link>
          ))}
        </div>
        <div>
          <h4>CONNECT</h4>
          <Link href="/partner">PARTNER WITH US</Link>
          <Link href="/contact">CONTACT</Link>
          <a href="mailto:info@choicesoulsmedia.org">EMAIL US</a>
          <Link href="/privacy">PRIVACY</Link>
          <Link href="/terms">TERMS</Link>
        </div>
        <div className="newsletter">
          <h4>STAY IN THE LOOP</h4>
          <p>Fresh stories, meaningful gatherings, no noise.</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              required
              aria-label="Email for newsletter"
              placeholder="Email address"
            />
            <button aria-label="Subscribe">
              <Icon name="arrow" />
            </button>
          </form>
        </div>
      </div>
      <div className="page-shell footer-bottom">
        <span>© 2026 CHOICE SOULS MEDIA. ALL RIGHTS RESERVED.</span>
        <span>LAGOS · NIGERIA</span>
        <button className="secret-dot" aria-label=" " onClick={hiddenClick} />
      </div>
    </footer>
  )
}

// Bot chat widget
const botReplies: Record<string, string> = {
  sermons: "You can watch all our sermons on the Sermons page, or subscribe on YouTube @ChoiceSouls. We also have Download Video and Download Audio buttons on every message.",
  events: "Our next major event is the Annual Camp Meeting — August 25–28, 2027 in Lagos, Nigeria. Visit the Events page to see all upcoming gatherings.",
  partner: "Visit the Partner page to give or partner with us. We accept USD, NGN, GBP, EUR, and GHS — give once or monthly.",
  donate: "You can give on our Partner page. We accept USD, NGN, GBP, EUR, and GHS. Every gift moves the mission forward.",
  contact: "Reach us at hello@choicesoulmedia.org or use the Contact page to send us a message directly.",
  hello: "Hello! Welcome to Choice Souls Media. How can I help you today?",
  hi: "Hi there! Great to have you here. How can I assist you?",
  youtube: "Our YouTube channel is @ChoiceSouls — 806 subscribers and 326 videos. Subscribe and never miss a message!",
  download: "Yes! Every sermon on our Sermons page has Download Video and Download Audio (MP3) buttons.",
  camp: "The Annual Camp Meeting 2027 is August 25–28 in Lagos, Nigeria. The flip countdown is live on the homepage!",
  default: "Thanks for reaching out! Ask me about sermons, events, donations, or partnerships. You can also visit our Contact page.",
}

function BotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm the CSM Assistant. Ask me about sermons, events, or how to give 🙏" },
  ])
  const [input, setInput] = useState("")
  const msgEnd = useRef<HTMLDivElement>(null)

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const reply = useCallback((text: string) => {
    const lower = text.toLowerCase()
    const key = Object.keys(botReplies).find((k) => lower.includes(k)) || "default"
    return botReplies[key]
  }, [])

  const send = (text: string) => {
    if (!text.trim()) return
    setMessages((m) => [...m, { from: "user", text: text.trim() }])
    setInput("")
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: reply(text) }])
    }, 650)
  }

  return (
    <>
      <div className={`bot-panel ${open ? "open" : ""}`} role="dialog" aria-label="CSM Chat Assistant">
        <div className="bot-header">
          <div className="bot-avatar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
              <line x1="8" y1="16" x2="8.01" y2="16" />
              <line x1="16" y1="16" x2="16.01" y2="16" />
            </svg>
          </div>
          <div className="bot-header-info">
            <b>CSM Assistant</b>
            <small>Choice Souls Media</small>
          </div>
          <div className="bot-online" />
        </div>
        <div className="bot-messages">
          {messages.map((m, i) => (
            <div key={i} className={`bot-msg ${m.from}`}>{m.text}</div>
          ))}
          <div ref={msgEnd} />
        </div>
        <div className="bot-quick-btns">
          {["Sermons", "Events", "Donate", "Camp Meeting", "Contact"].map((o) => (
            <button key={o} className="bot-quick-btn" onClick={() => send(o)}>{o}</button>
          ))}
        </div>
        <div className="bot-input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask anything…"
          />
          <button onClick={() => send(input)} aria-label="Send">
            <Icon name="send" size={15} />
          </button>
        </div>
      </div>
      <button
        className={`bot-launcher ${open ? "open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat assistant"
      >
        <Icon name={open ? "close" : "bot"} size={22} />
      </button>
    </>
  )
}
function CookieNotice() {
  const [show, setShow] = useState(() => !localStorage.getItem("csm-cookie"))
  if (!show) return null
  return (
    <aside className="cookie">
      <p>
        We use essential cookies to remember your preferences.{" "}
        <Link href="/privacy">Learn more</Link>
      </p>
      <button
        onClick={() => {
          localStorage.setItem("csm-cookie", "yes")
          setShow(false)
        }}
      >
        GOT IT
      </button>
    </aside>
  )
}

function Lightbox({
  index,
  close,
  setIndex,
}: {
  index: number | null
  close: () => void
  setIndex: (n: number) => void
}) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") setIndex(((index ?? 0) + 1) % photos.length)
      if (e.key === "ArrowLeft")
        setIndex(((index ?? 0) - 1 + photos.length) % photos.length)
    }
    window.addEventListener("keydown", key)
    return () => window.removeEventListener("keydown", key)
  }, [index, close, setIndex])
  if (index === null) return null
  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <button className="lightbox-close" onClick={close} aria-label="Close">
        <Icon name="close" />
      </button>
      <button
        className="lightbox-prev"
        onClick={() => setIndex((index - 1 + photos.length) % photos.length)}
        aria-label="Previous photo"
      >
        ←
      </button>
      <img src={photos[index]} alt={`CSM gallery photo ${index + 1}`} />
      <button
        className="lightbox-next"
        onClick={() => setIndex((index + 1) % photos.length)}
        aria-label="Next photo"
      >
        →
      </button>
      <span>
        {String(index + 1).padStart(2, "0")} /{" "}
        {String(photos.length).padStart(2, "0")}
      </span>
    </div>
  )
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [lightbox, setLightbox] = useState<number | null>(null)
  useEffect(() => {
    const pop = () => setPath(window.location.pathname)
    window.addEventListener("popstate", pop)
    return () => window.removeEventListener("popstate", pop)
  }, [])
  useEffect(() => {
    const names: Record<string, string> = {
      "/": "Choice Souls Media · Purpose in motion",
      "/about": "About · Choice Souls Media",
      "/services": "Services · Choice Souls Media",
      "/events": "Events · Choice Souls Media",
      "/sermons": "Sermons · Choice Souls Media",
      "/archive": "Archive · Choice Souls Media",
      "/testimonies": "Testimonies · Choice Souls Media",
      "/faqs": "FAQs · Choice Souls Media",
      "/gallery": "Gallery · Choice Souls Media",
      "/partner": "Partner With Us · Choice Souls Media",
      "/contact": "Contact · Choice Souls Media",
    }
    document.title = names[path] || "Choice Souls Media"
  }, [path])
  if (path === adminPath) return <AdminShell />
  const pages: Record<string, React.ReactNode> = {
    "/": <Home openLightbox={setLightbox} />,
    "/about": <About />,
    "/services": <ServicesPage />,
    "/events": <Events />,
    "/sermons": <SermonsPage />,
    "/archive": <ArchivePage />,
    "/testimonies": <TestimoniesPage />,
    "/faqs": <FAQsPage />,
    "/gallery": <Gallery openLightbox={setLightbox} />,
    "/partner": <Partner />,
    "/contact": <Contact />,
    "/privacy": <Policy type="privacy" />,
    "/terms": <Policy type="terms" />,
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Splash />
      <Navbar path={path} />
      {pages[path] ?? <NotFound />}
      <Footer />
      <CookieNotice />
      <BotWidget />
      <Lightbox
        index={lightbox}
        close={() => setLightbox(null)}
        setIndex={setLightbox}
      />
    </>
  )
}
