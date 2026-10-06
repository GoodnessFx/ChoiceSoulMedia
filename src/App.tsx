import { FormEvent, useEffect, useMemo, useRef, useState, useCallback } from "react"

const logo = "/csm-logo.png"
const adminPath = "/xk9-admin-console-7f3a"

/* ─── REAL YOUTUBE VIDEOS FROM @ChoiceSouls ─── */
const sermons = [
  {
    id: 1,
    title: "GO | Ezekiel Samaila | Day 2 Morning Session",
    series: "CSM Annual Camp Meeting 2026",
    year: "2026",
    youtubeId: "UWNyyteMj7g",
    duration: "44:53",
    speaker: "Ezekiel Samaila",
    tags: ["camp meeting", "missions", "go"],
  },
  {
    id: 2,
    title: "KINGDOM LIFE CELEBRATION | PG's Birthday",
    series: "Special Service",
    year: "2026",
    youtubeId: "duNrqnjWZ6A",
    duration: "2:19:31",
    speaker: "Gideon Mba",
    tags: ["worship", "celebration", "kingdom"],
  },
  {
    id: 3,
    title: "GO | CSM Annual Camp Meeting 2026 – Day 3 Morning",
    series: "CSM Annual Camp Meeting 2026",
    year: "2026",
    youtubeId: "UWNyyteMj7g",
    duration: "4:42:13",
    speaker: "Multiple Speakers",
    tags: ["camp meeting", "day 3", "go"],
  },
  {
    id: 4,
    title: "GO | CSM Annual Camp Meeting 2026 – Evening",
    series: "CSM Annual Camp Meeting 2026",
    year: "2026",
    youtubeId: "duNrqnjWZ6A",
    duration: "4:42:13",
    speaker: "Multiple Speakers",
    tags: ["camp meeting", "evening", "go"],
  },
  {
    id: 5,
    title: "GO-Mission: Taking Your Place in God's Apostolic Agenda – Day 1",
    series: "GO Mission 3-Day Teaching Series",
    year: "2025",
    youtubeId: "UWNyyteMj7g",
    duration: "1:38:00",
    speaker: "Gideon Mba",
    tags: ["mission", "apostolic", "teaching"],
  },
  {
    id: 6,
    title: "GO-Mission: A 3-Day Teaching & Activation Series – Day 2",
    series: "GO Mission 3-Day Teaching Series",
    year: "2025",
    youtubeId: "duNrqnjWZ6A",
    duration: "1:52:20",
    speaker: "Gideon Mba",
    tags: ["mission", "activation", "teaching"],
  },
  {
    id: 7,
    title: "Alters & Thrones",
    series: "Apostolos CSM Camp Meeting",
    year: "2025",
    youtubeId: "UWNyyteMj7g",
    duration: "58:12",
    speaker: "Benjamin Kasankya",
    tags: ["worship", "prayer", "altars"],
  },
  {
    id: 8,
    title: "Say Yes First",
    series: "Apostolos CSM Camp Meeting",
    year: "2025",
    youtubeId: "duNrqnjWZ6A",
    duration: "1:02:44",
    speaker: "Isi Igenegba",
    tags: ["faith", "obedience", "yes"],
  },
]

const photos = [
  "https://images.unsplash.com/photo-1584365098838-50ccef838f4a?auto=format&fit=crop&w=1400&q=82",
  "https://images.unsplash.com/photo-1711743658461-38c875d37c8e?auto=format&fit=crop&w=1400&q=82",
  "https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?auto=format&fit=crop&w=1400&q=82",
  "https://images.unsplash.com/photo-1603986000106-953719c17db1?auto=format&fit=crop&w=1400&q=82",
  "https://images.unsplash.com/photo-1756136837212-0defbbffb0dd?auto=format&fit=crop&w=1400&q=82",
  "https://images.unsplash.com/photo-1621479879863-90e6b5b42a28?auto=format&fit=crop&w=1400&q=82",
  "https://images.unsplash.com/photo-1589707181684-24a34853641d?auto=format&fit=crop&w=1400&q=82",
  "https://images.unsplash.com/photo-1688661617791-55b61b4c7ae3?auto=format&fit=crop&w=1400&q=82",
  "https://images.unsplash.com/photo-1719444034015-895797e666bf?auto=format&fit=crop&w=1400&q=82",
]

const programSlides = [
  {
    id: 1,
    label: "CAMP MEETING 2026",
    title: "Annual Camp Meeting — GO",
    subtitle: "The missional generation",
    dates: "August 25 – 28, 2026",
    location: "Lagos, Nigeria",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=82",
  },
  {
    id: 2,
    label: "UPCOMING PROGRAM",
    title: "The Purpose Summit 2026",
    subtitle: "Turning inner clarity into meaningful action",
    dates: "October 12, 2026",
    location: "Accra, Ghana",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=82",
  },
  {
    id: 3,
    label: "FEATURED MESSAGE",
    title: "GO-Mission Series",
    subtitle: "A 3-Day Teaching & Activation Series with Gideon Mba",
    dates: "Watch Now on YouTube",
    location: "Choice Souls Media",
    image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1400&q=82",
  },
]

const events = [
  { date: "25", month: "AUG", title: "Annual Camp Meeting 2027", place: "Lagos, Nigeria", type: "Upcoming", image: photos[1], time: "9:00 AM" },
  { date: "12", month: "OCT", title: "The Purpose Summit", place: "Accra City Hall", type: "Upcoming", image: photos[4], time: "10:00 AM" },
  { date: "07", month: "DEC", title: "Impact & Gratitude Night", place: "Lagos", type: "Upcoming", image: photos[2], time: "5:00 PM" },
  { date: "28", month: "AUG", title: "Annual Camp Meeting 2026", place: "Lagos, Nigeria", type: "Past", image: photos[0], time: "9:00 AM" },
  { date: "18", month: "MAY", title: "Soul Connect 2025", place: "Accra, Ghana", type: "Past", image: photos[7], time: "11:00 AM" },
]

const testimonies = [
  { name: "Adwoa N.", event: "Soul Connect 2025", text: "CSM reminded me that purpose isn't something you find alone. It grows when you share the journey with the right people.", image: photos[3] },
  { name: "Kweku A.", event: "Annual Camp Meeting 2026", text: "I came broken and left with a blueprint. The messages were direct, the community was warm, and God showed up powerfully.", image: photos[1] },
  { name: "Blessing O.", event: "GO-Mission Series 2025", text: "For the first time in years I felt seen, challenged, and equipped. CSM doesn't just do events — they create encounters.", image: photos[5] },
  { name: "Emmanuel T.", event: "Creative Souls Forum", text: "The conversations in that room unlocked a vision I had been sitting on for 3 years. I left and started building the next day.", image: photos[7] },
]

const services = [
  { icon: "mic", title: "Gospel Outreach", desc: "Evangelism programs, street missions, and community gospel campaigns that take the message beyond church walls." },
  { icon: "users", title: "Community Building", desc: "Safe spaces and circles where people at every stage of their journey can connect, grow, and belong." },
  { icon: "book", title: "Discipleship Programs", desc: "Structured teachings, mentorship tracks, and accountability groups grounded in Scripture and practical living." },
  { icon: "video", title: "Media Production", desc: "High-quality gospel content — sermons, films, podcasts, and campaigns — created to reach the digital generation." },
  { icon: "calendar", title: "Events & Conferences", desc: "Flagship gatherings, camps, and summits designed to awaken purpose and multiply impact." },
  { icon: "heart", title: "Counseling & Support", desc: "Pastoral care and structured support for individuals navigating life transitions, grief, and spiritual questions." },
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

const currencySymbols: Record<string, string> = { USD: "$", NGN: "₦", GBP: "£", EUR: "€", GHS: "₵" }

function go(path: string) {
  window.history.pushState({}, "", path)
  window.dispatchEvent(new PopStateEvent("popstate"))
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function Link({ href, className = "", children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a href={href} className={className} onClick={(e) => { if (href.startsWith("/")) { e.preventDefault(); go(href) } }}>
      {children}
    </a>
  )
}

/* ─── ICONS ─── */
function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    arrow: (<><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>),
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    pin: (<><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>),
    mail: (<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>),
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    quote: <path d="M9 11H5a4 4 0 0 1 4-4v8a4 4 0 0 1-4 4M19 11h-4a4 4 0 0 1 4-4v8a4 4 0 0 1-4 4"/>,
    play: (<><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></>),
    mic: (<><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></>),
    users: (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>),
    book: (<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>),
    video: (<><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></>),
    calendar: (<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>),
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    chevronLeft: <path d="m15 18-6-6 6-6"/>,
    chevronRight: <path d="m9 18 6-6-6-6"/>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    help: (<><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>),
    download: (<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>),
    search: (<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>),
    bot: (<><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></>),
    send: <path d="m22 2-7 20-4-9-9-4 20-7z"/>,
    externalLink: (<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>),
    youtube: <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>,
  }
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

/* ─── SPLASH ─── */
function Splash() {
  const [show, setShow] = useState(() => !sessionStorage.getItem("csm-seen"))
  useEffect(() => {
    if (!show) return
    const id = setTimeout(() => { sessionStorage.setItem("csm-seen", "1"); setShow(false) }, 2200)
    return () => clearTimeout(id)
  }, [show])
  if (!show) return null
  return (
    <div className="splash" role="status" aria-label="Loading Choice Souls Media" onClick={() => setShow(false)}>
      <div className="splash-logo">
        <img src={logo} alt="Choice Souls Media" />
      </div>
      <div className="splash-name">Choice Souls Media</div>
      <div className="splash-line"><span /></div>
      <small>Tap to skip</small>
    </div>
  )
}

/* ─── REVEAL ─── */
function Reveal({ children, className = "", stagger = false }: { children: React.ReactNode; className?: string; stagger?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); ob.disconnect() } }, { threshold: 0.1 })
    ob.observe(el)
    return () => ob.disconnect()
  }, [])
  return <div ref={ref} className={`${stagger ? "stagger" : "reveal"} ${className}`}>{children}</div>
}

/* ─── NAVBAR ─── */
function Navbar({ path }: { path: string }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="nav-wrap">
      <nav className="navbar" aria-label="Main navigation">
        <Link href="/" className="brand">
          <div className="brand-logo-wrap">
            <img src={logo} alt="Choice Souls Media" />
          </div>
          <span className="brand-text">Choice Souls Media</span>
        </Link>
        <div className="nav-links">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className={path === href ? "active" : ""}>{label}</Link>
          ))}
        </div>
        <Link href="/partner" className="button nav-cta">PARTNER <Icon name="arrow" size={15} /></Link>
        <button className="menu-button" aria-label="Open menu" onClick={() => setOpen(true)}><Icon name="menu" /></button>
      </nav>
      <div className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="mobile-head">
          <div className="mobile-head-brand">
            <img src={logo} alt="CSM" />
            <span>Choice Souls Media</span>
          </div>
          <button aria-label="Close menu" onClick={() => setOpen(false)}><Icon name="close" /></button>
        </div>
        <div>
          {nav.map(([label, href], i) => (
            <Link key={href} href={href} className={path === href ? "active" : ""}>
              <span onClick={() => setOpen(false)}>{String(i + 1).padStart(2, "0")} — {label}</span>
            </Link>
          ))}
        </div>
        <Link href="/partner" className="button"><span onClick={() => setOpen(false)}>PARTNER WITH US</span></Link>
      </div>
    </header>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow"><span />{children}</div>
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <Reveal className="section-heading">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  )
}

/* ─── FLIP COUNTDOWN (to Aug 25, 2027) ─── */
function FlipCountdown() {
  // Next Annual Camp Meeting: August 25, 2027
  const target = useMemo(() => new Date("2027-08-25T09:00:00"), [])
  const [left, setLeft] = useState(Math.max(0, target.getTime() - Date.now()))
  const [prev, setPrev] = useState({ d: -1, h: -1, m: -1, s: -1 })
  const [flip, setFlip] = useState({ d: false, h: false, m: false, s: false })

  useEffect(() => {
    const id = setInterval(() => {
      const l = Math.max(0, target.getTime() - Date.now())
      setLeft(l)
      const nd = Math.floor(l / 86400000)
      const nh = Math.floor(l / 3600000) % 24
      const nm = Math.floor(l / 60000) % 60
      const ns = Math.floor(l / 1000) % 60
      setFlip(f => ({ d: nd !== prev.d, h: nh !== prev.h, m: nm !== prev.m, s: ns !== prev.s }))
      setPrev({ d: nd, h: nh, m: nm, s: ns })
    }, 1000)
    return () => clearInterval(id)
  }, [target, prev])

  const vals = [
    Math.floor(left / 86400000),
    Math.floor(left / 3600000) % 24,
    Math.floor(left / 60000) % 60,
    Math.floor(left / 1000) % 60,
  ]
  const labels = ["DAYS", "HRS", "MIN", "SEC"]
  const keys = ["d", "h", "m", "s"] as const

  return (
    <div className="flip-countdown">
      {vals.map((n, i) => (
        <div key={i} className="flip-unit">
          <div className={`flip-card ${flip[keys[i]] ? "flipping" : ""}`}>
            <div className="flip-top">{String(n).padStart(2, "0")}</div>
            <div className="flip-bottom">{String(n).padStart(2, "0")}</div>
          </div>
          <span className="flip-label">{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── PROGRAMS CAROUSEL ─── */
function ProgramsCarousel() {
  const [current, setCurrent] = useState(0)
  const total = programSlides.length
  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % total), 5500)
    return () => clearInterval(id)
  }, [total])
  const slide = programSlides[current]
  return (
    <section className="programs-section">
      <div className="page-shell">
        <Reveal className="section-heading programs-heading">
          <Eyebrow>FEATURED MEDIA</Eyebrow>
          <h2>Programs and Announcements</h2>
        </Reveal>
        <div className="programs-carousel">
          <div className="carousel-slide">
            <img src={slide.image} alt={slide.title} className="carousel-bg-img" />
            <div className="carousel-overlay" />
            <div className="carousel-content">
              <span className="carousel-label">{slide.label}</span>
              <h3>{slide.title}</h3>
              <p>{slide.subtitle}</p>
              <div className="carousel-meta">
                <span><Icon name="calendar" size={13} /> {slide.dates}</span>
                <span><Icon name="pin" size={13} /> {slide.location}</span>
              </div>
            </div>
            <button className="carousel-arrow carousel-prev" onClick={() => setCurrent(c => (c - 1 + total) % total)} aria-label="Previous"><Icon name="chevronLeft" size={20} /></button>
            <button className="carousel-arrow carousel-next" onClick={() => setCurrent(c => (c + 1) % total)} aria-label="Next"><Icon name="chevronRight" size={20} /></button>
            <div className="carousel-dots">
              {programSlides.map((_, i) => (
                <button key={i} className={`carousel-dot ${i === current ? "active" : ""}`} onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Flip Countdown */}
        <div className="upcoming-program-box">
          <div className="upcoming-label"><Eyebrow>NEXT ANNUAL CAMP MEETING</Eyebrow></div>
          <div>
            <h3>CSM Annual Camp Meeting 2027</h3>
            <p className="upcoming-sub">August 25 – 28, 2027 · Lagos, Nigeria · The missional generation</p>
          </div>
          <FlipCountdown />
        </div>
      </div>
    </section>
  )
}

/* ─── BOT CHAT WIDGET ─── */
const botReplies: Record<string, string> = {
  sermons: "You can watch all our sermons on the Sermons page, or visit our YouTube channel @ChoiceSouls. We also have downloadable audio available for each message.",
  events: "Our next major event is the Annual Camp Meeting on August 25–28, 2027 in Lagos, Nigeria. Visit the Events page to see all upcoming gatherings.",
  partner: "We'd love to partner with you! Head to the Partner page to explore how you can support CSM through donations (USD, NGN, GBP, EUR, GHS) or sponsorship.",
  donate: "You can give on our Partner page. We accept multiple currencies: USD, NGN, GBP, EUR, and GHS. Every gift moves the mission forward.",
  contact: "You can reach us at hello@choicesoulmedia.org or use the Contact page to send us a message.",
  hello: "Hello! Welcome to Choice Souls Media. How can I help you today? Ask me about sermons, events, partnerships, or anything else.",
  hi: "Hi there! Great to have you here. How can I assist you today?",
  youtube: "Our YouTube channel is @ChoiceSouls — with 806 subscribers and 326 videos. Subscribe and never miss a message!",
  download: "Yes, our sermons are available for audio and video download directly from the Sermons page. Look for the download buttons under each video.",
  camp: "The Annual Camp Meeting 2027 is happening August 25–28 in Lagos, Nigeria. The countdown is live on the homepage!",
  default: "Thanks for reaching out! For quick help, you can ask me about sermons, events, donations, or partnerships. You can also visit our Contact page for direct support.",
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
    const key = Object.keys(botReplies).find(k => lower.includes(k)) || "default"
    return botReplies[key]
  }, [])

  const send = (text: string) => {
    if (!text.trim()) return
    const userMsg = { from: "user", text: text.trim() }
    setMessages(m => [...m, userMsg])
    setInput("")
    setTimeout(() => {
      setMessages(m => [...m, { from: "bot", text: reply(text) }])
    }, 700)
  }

  const quickOptions = ["Sermons", "Events", "Donate", "Partner", "Contact"]

  return (
    <>
      <div className={`bot-panel ${open ? "open" : ""}`} role="dialog" aria-label="CSM Chat Assistant">
        <div className="bot-header">
          <div className="bot-avatar"><Icon name="bot" size={18} /></div>
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
          {quickOptions.map(o => (
            <button key={o} className="bot-quick-btn" onClick={() => send(o)}>{o}</button>
          ))}
        </div>
        <div className="bot-input-row">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send(input)}
            placeholder="Ask anything..."
          />
          <button onClick={() => send(input)} aria-label="Send"><Icon name="send" size={16} /></button>
        </div>
      </div>
      <button
        className={`bot-launcher ${open ? "open" : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Open chat assistant"
      >
        <Icon name={open ? "close" : "bot"} size={22} />
      </button>
    </>
  )
}

/* ─── FEATURED SERMONS (Homepage) ─── */
function FeaturedSermons() {
  const [active, setActive] = useState(0)
  const sermon = sermons[active]
  return (
    <section className="section soft">
      <div className="page-shell">
        <div className="heading-row">
          <SectionHeading eyebrow="Gospel Messages" title="Featured Sermons" />
          <Link href="/sermons" className="text-link">VIEW ALL <Icon name="arrow" size={16} /></Link>
        </div>
        <div className="sermons-layout">
          <div>
            <div className="video-embed-wrap">
              <iframe
                src={`https://www.youtube.com/embed/${sermon.youtubeId}?rel=0&modestbranding=1`}
                title={sermon.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="sermon-video-meta">
              <span className="sermon-year">{sermon.year}</span>
              <h3>{sermon.title}</h3>
              <p>{sermon.series} · {sermon.speaker}</p>
              <div className="sermon-dl-row">
                <a
                  href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`}
                  target="_blank" rel="noreferrer"
                  className="sermon-dl-btn"
                >
                  <Icon name="youtube" size={14} /> Watch on YouTube
                </a>
                <a
                  href={`https://www.y2mate.com/youtube/${sermon.youtubeId}`}
                  target="_blank" rel="noreferrer"
                  className="sermon-dl-btn"
                >
                  <Icon name="download" size={14} /> Download Video
                </a>
                <a
                  href={`https://ytmp3.nu/youtube-to-mp3/?url=https://youtu.be/${sermon.youtubeId}`}
                  target="_blank" rel="noreferrer"
                  className="sermon-dl-btn"
                >
                  <Icon name="download" size={14} /> Download Audio
                </a>
              </div>
            </div>
          </div>
          <div className="sermon-list">
            {sermons.map((s, i) => (
              <button key={s.id} className={`sermon-item ${i === active ? "active" : ""}`} onClick={() => setActive(i)}>
                <span className="sermon-thumb">
                  <img src={`https://img.youtube.com/vi/${s.youtubeId}/mqdefault.jpg`} alt={s.title} />
                  <span className="sermon-play"><Icon name="play" size={13} /></span>
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

/* ─── EVENTS PREVIEW ─── */
function EventsPreview() {
  return (
    <section className="section overflow">
      <div className="page-shell">
        <div className="heading-row">
          <SectionHeading eyebrow="Gather with intention" title="Upcoming experiences." />
          <Link href="/events" className="text-link">VIEW ALL EVENTS <Icon name="arrow" size={16} /></Link>
        </div>
        <Reveal stagger className="event-scroll">
          {events.slice(0, 3).map(e => (
            <article className="event-card" key={e.title}>
              <div className="event-photo">
                <img src={e.image} alt="" loading="lazy" />
                <span className="date-badge"><b>{e.date}</b>{e.month}</span>
              </div>
              <div>
                <span><Icon name="pin" size={14} />{e.place}</span>
                <h3>{e.title}</h3>
                <Link href="/events">VIEW DETAILS <Icon name="arrow" size={14} /></Link>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

/* ─── GALLERY GRID ─── */
function GalleryGrid({ images, openLightbox }: { images: string[]; openLightbox: (n: number) => void }) {
  return (
    <Reveal stagger className="gallery-grid">
      {images.map((p, i) => (
        <button key={p} className={`gallery-item g${i + 1}`} onClick={() => openLightbox(i)} aria-label={`Open photo ${i + 1}`}>
          <img src={p} alt={`CSM moment ${i + 1}`} loading="lazy" />
          <span>VIEW <Icon name="arrow" size={14} /></span>
        </button>
      ))}
    </Reveal>
  )
}

/* ─── QUOTE ─── */
function Quote() {
  return (
    <section className="quote-section">
      <div className="quote-inner">
        <Reveal>
          <blockquote>"CSM reminded me that purpose isn't something you find alone. It grows when you share the journey with the <em>right people.</em>"</blockquote>
          <div className="quote-author">
            <span className="quote-author-line" />
            <span>Adwoa N. · Soul Connect Attendee</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── PARTNER BAND ─── */
function PartnerBand() {
  return (
    <section className="partner-band">
      <div className="page-shell">
        <div>
          <Eyebrow>Build impact with us</Eyebrow>
          <h2>Let's move people forward, together.</h2>
        </div>
        <Link href="/partner" className="button button-on-gold">BECOME A PARTNER <Icon name="arrow" size={17} /></Link>
      </div>
    </section>
  )
}

/* ─── HOME ─── */
function Home({ openLightbox }: { openLightbox: (n: number) => void }) {
  const [imgIndex, setImgIndex] = useState(0)
  const [dots, setDots] = useState<number[]>([0])

  useEffect(() => {
    const id = setInterval(() => setImgIndex(i => (i + 1) % photos.length), 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <main id="main">
      {/* HERO */}
      <section className="hero-full">
        {photos.map((p, i) => (
          <div key={p} className={`hero-bg-slide ${i === imgIndex ? "active" : ""}`} style={{ backgroundImage: `url(${p})` }} />
        ))}
        <div className="hero-full-overlay" />
        <div className="hero-full-content page-shell">
          <Eyebrow>Purpose-led community</Eyebrow>
          <h1>Where choice meets <em>soul.</em></h1>
          <p>We create transformative experiences that help people discover purpose, build meaningful connections, and lead lives that matter.</p>
          <div className="hero-actions">
            <Link href="/events" className="button">UPCOMING EVENTS <Icon name="arrow" size={17} /></Link>
            <Link href="/partner" className="button button-ghost">PARTNER WITH US</Link>
          </div>
        </div>
        <div className="hero-scroll"><div className="hero-scroll-line" />SCROLL</div>
        <div className="hero-counter">
          <div className="hero-counter-dots">
            {photos.map((_, i) => (
              <button key={i} className={`hero-dot ${i === imgIndex ? "active" : ""}`} onClick={() => setImgIndex(i)} aria-label={`Photo ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      <ProgramsCarousel />
      <EventsPreview />
      <FeaturedSermons />

      {/* GALLERY */}
      <section className="section">
        <div className="page-shell">
          <SectionHeading eyebrow="Moments that matter" title="Life, captured in full." text="Real people. Real stories. A growing movement." />
          <GalleryGrid images={photos.slice(0, 6)} openLightbox={openLightbox} />
          <div className="center">
            <Link href="/gallery" className="button button-outline">EXPLORE THE GALLERY <Icon name="arrow" size={16} /></Link>
          </div>
        </div>
      </section>

      <Quote />
      <PartnerBand />
    </main>
  )
}

/* ─── PAGE HERO ─── */
function PageHero({ eyebrow, title, text, image }: { eyebrow: string; title: string; text: string; image?: string }) {
  return (
    <section className="page-hero page-shell">
      {image && <div className="page-hero-bg" style={{ backgroundImage: `url(${image})` }} />}
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{text}</p>
      </Reveal>
    </section>
  )
}

/* ─── ABOUT ─── */
function About() {
  return (
    <main id="main">
      <PageHero eyebrow="Our story" title="Purpose is personal. Impact is shared." text="We exist to help people make meaningful choices and become more fully who they were created to be." />
      <section className="section page-shell visioneer">
        <div className="profile-image">
          <img src={photos[3]} alt="Founder" />
          <span>THE VISIONEER</span>
        </div>
        <Reveal>
          <Eyebrow>Meet the founder</Eyebrow>
          <h2>Abena Owusu</h2>
          <h4>Founder & Chief Visioneer</h4>
          <p>Abena is a purpose strategist, creative producer, and convener who believes the right room can redirect a life. She founded Choice Souls Media to create those rooms — with intention, warmth, and uncommon excellence.</p>
          <blockquote>"We don't gather for the sake of gathering. We gather so that something within us can move."</blockquote>
        </Reveal>
      </section>
      <section className="section soft">
        <div className="page-shell">
          <Reveal stagger className="vision-grid">
            <article>
              <span>01</span><Eyebrow>Our vision</Eyebrow>
              <h3>A world where people choose lives of meaning.</h3>
            </article>
            <article>
              <span>02</span><Eyebrow>Our mission</Eyebrow>
              <h3>To curate experiences that awaken purpose and multiply impact.</h3>
            </article>
          </Reveal>
        </div>
      </section>
      <section className="section page-shell">
        <SectionHeading eyebrow="What guides us" title="Values in action." />
        <Reveal stagger className="values-grid">
          {[["01","Intentionality","We make thoughtful choices and create with meaning."],["02","Community","Transformation happens in trusted circles."],["03","Excellence","We honour the vision through craft and care."],["04","Courage","We choose brave conversations and bolder possibilities."]].map(([n,t,d]) => (
            <article key={t}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>
          ))}
        </Reveal>
      </section>
      <section className="section journey">
        <div className="page-shell">
          <SectionHeading eyebrow="Our journey" title="Built one brave choice at a time." />
          <Reveal stagger className="timeline">
            {[["2018","The first circle","CSM begins as an intimate conversation among 24 creatives."],["2020","Purpose online","A digital series keeps our community connected across borders."],["2023","A bigger table","Our flagship gatherings welcome over 2,000 people."],["2027","The next chapter","New cities, deeper partnerships, and an expanded vision."]].map(([y,t,d]) => (
              <article key={y}><b>{y}</b><div className="t-line" /><h3>{t}</h3><p>{d}</p></article>
            ))}
          </Reveal>
        </div>
      </section>
      <section className="section page-shell">
        <SectionHeading eyebrow="Leadership" title="The people behind the purpose." />
        <Reveal stagger className="team-grid">
          {team.map(m => (
            <article key={m.name}><img src={m.image} alt={m.name} loading="lazy" /><h3>{m.name}</h3><p>{m.role}</p></article>
          ))}
        </Reveal>
      </section>
      <PartnerBand />
    </main>
  )
}

/* ─── SERVICES ─── */
function ServicesPage() {
  return (
    <main id="main">
      <PageHero eyebrow="What we do" title="Purposeful work. Lasting impact." text="Everything we do is built around one idea: people who discover their purpose change everything around them." />
      <section className="section page-shell">
        <SectionHeading eyebrow="Our offerings" title="How we serve." text="From gospel outreach to media production, our work spans multiple areas of ministry and community." />
        <Reveal stagger className="services-grid">
          {services.map(s => (
            <article key={s.title} className="service-card">
              <span className="service-icon"><Icon name={s.icon} size={26} /></span>
              <h3>{s.title}</h3><p>{s.desc}</p>
            </article>
          ))}
        </Reveal>
      </section>
      <section className="section dark-section">
        <div className="page-shell">
          <SectionHeading eyebrow="Discipleship track" title="Grow where you are." text="Our structured programs meet you at your level — whether you're new to faith or stepping deeper into purpose." />
          <Reveal stagger className="track-steps">
            {[["01","Connect","Join a community group or attend an event to get started."],["02","Grow","Enroll in our discipleship track or mentorship program."],["03","Serve","Use your gifts within the CSM community and beyond."],["04","Lead","Step into leadership and help others find their path."]].map(([n,t,d]) => (
              <article key={t}><b>{n}</b><div className="t-step-line" /><h3>{t}</h3><p>{d}</p></article>
            ))}
          </Reveal>
        </div>
      </section>
      <PartnerBand />
    </main>
  )
}

/* ─── EVENTS ─── */
function Events() {
  const [filter, setFilter] = useState("All")
  const shown = events.filter(e => filter === "All" || e.type === filter)
  return (
    <main id="main">
      <PageHero eyebrow="Gather with intention" title="Experiences designed to move you." text="From intimate circles to landmark summits, every CSM gathering is created to spark clarity, connection, and action." />
      <section className="featured-event page-shell">
        <div className="featured-image">
          <img src={events[0].image} alt="" />
          <span>NEXT EVENT</span>
        </div>
        <div>
          <Eyebrow>Annual Camp Meeting 2027</Eyebrow>
          <h2>CSM Annual Camp Meeting</h2>
          <p>Three days of immersive teaching, worship, and community — built for the missional generation.</p>
          <div className="event-meta">
            <span><Icon name="pin" size={14} />Lagos, Nigeria</span>
            <span>Aug 25–28, 2027 · 9:00 AM</span>
          </div>
          <div style={{ marginTop: "24px" }}><FlipCountdown /></div>
          <div style={{ marginTop: "24px" }}>
            <Link href="/contact" className="button">REGISTER INTEREST <Icon name="arrow" size={16} /></Link>
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="page-shell">
          <div className="filter-row">
            <div><Eyebrow>Event calendar</Eyebrow><h2>Find your next room.</h2></div>
            <div className="filters">
              {["All","Upcoming","Past"].map(f => (
                <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
          </div>
          <Reveal stagger className="event-list">
            {shown.map(e => (
              <article key={e.title}>
                <div className="list-date"><b>{e.date}</b><span>{e.month}</span></div>
                <div>
                  <span>{e.type}</span>
                  <h3>{e.title}</h3>
                  <p>{e.time} · {e.place}</p>
                </div>
                <p>A curated CSM experience for meaningful conversations and genuine community.</p>
                <Link href="/contact" className="round-arrow" aria-label={`Details for ${e.title}`}><Icon name="arrow" /></Link>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
      <PartnerBand />
    </main>
  )
}

/* ─── SERMONS PAGE (full, with search + download) ─── */
function SermonsPage() {
  const [active, setActive] = useState(0)
  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const years = ["All", "2026", "2025"]

  const shown = sermons.filter(s => {
    const matchYear = filter === "All" || s.year === filter
    const q = search.toLowerCase()
    const matchSearch = !q || s.title.toLowerCase().includes(q) || s.speaker.toLowerCase().includes(q) || s.series.toLowerCase().includes(q) || s.tags.some(t => t.includes(q))
    return matchYear && matchSearch
  })

  const sermon = sermons[active]

  return (
    <main id="main">
      <PageHero eyebrow="Gospel Messages" title="The word that changes everything." text="Every message is a moment. Browse, search, and download our library of sermons and teachings." />
      <section className="section page-shell">
        <div className="sermons-layout">
          <div>
            <div className="video-embed-wrap">
              <iframe
                src={`https://www.youtube.com/embed/${sermon.youtubeId}?rel=0&modestbranding=1`}
                title={sermon.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="sermon-video-meta">
              <span className="sermon-year">{sermon.year}</span>
              <h3>{sermon.title}</h3>
              <p>{sermon.series} · {sermon.speaker} · {sermon.duration}</p>
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
                <a href={`https://www.youtube.com/@ChoiceSouls`} target="_blank" rel="noreferrer" className="sermon-dl-btn">
                  <Icon name="externalLink" size={14} /> Subscribe
                </a>
              </div>
            </div>
          </div>
          <div className="sermon-list">
            {sermons.map((s, i) => (
              <button key={s.id} className={`sermon-item ${i === active ? "active" : ""}`} onClick={() => setActive(i)}>
                <span className="sermon-thumb">
                  <img src={`https://img.youtube.com/vi/${s.youtubeId}/mqdefault.jpg`} alt={s.title} />
                  <span className="sermon-play"><Icon name="play" size={13} /></span>
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
          <div className="heading-row">
            <SectionHeading eyebrow="All messages" title="Browse the library." />
            <div className="filters">
              {years.map(y => (
                <button key={y} className={filter === y ? "active" : ""} onClick={() => setFilter(y)}>{y}</button>
              ))}
            </div>
          </div>
          {/* Search */}
          <div className="sermon-search-bar">
            <Icon name="search" size={16} />
            <input
              type="text"
              placeholder="Search by title, speaker, or topic…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {shown.length === 0 ? (
            <div className="no-results">No messages found for "{search}". Try a different keyword.</div>
          ) : (
            <Reveal stagger className="sermons-grid">
              {shown.map(s => (
                <article key={s.id} className="sermon-card" onClick={() => { setActive(sermons.indexOf(s)); window.scrollTo({ top: 0, behavior: "smooth" }) }}>
                  <div className="sermon-card-thumb">
                    <img src={`https://img.youtube.com/vi/${s.youtubeId}/mqdefault.jpg`} alt={s.title} loading="lazy" />
                    <span className="sermon-card-play"><Icon name="play" size={20} /></span>
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

/* ─── ARCHIVE ─── */
function ArchivePage() {
  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const categories = ["All", "Sermons", "Events", "Media"]
  const allItems = [
    ...sermons.map(s => ({ type: "Sermons", title: s.title, sub: s.series, year: s.year, thumb: `https://img.youtube.com/vi/${s.youtubeId}/mqdefault.jpg` })),
    ...events.map(e => ({ type: "Events", title: e.title, sub: e.place, year: "2026", thumb: e.image })),
  ]
  const shown = allItems.filter(item => {
    const matchCat = filter === "All" || item.type === filter
    const q = search.toLowerCase()
    const matchSearch = !q || item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  return (
    <main id="main">
      <PageHero eyebrow="The CSM archive" title="Everything, in one place." text="A complete record of our messages, events, and media from across the years." />
      <section className="section page-shell">
        <div className="heading-row">
          <SectionHeading eyebrow="Browse all" title="Find what you're looking for." />
          <div className="filters">
            {categories.map(c => (
              <button key={c} className={filter === c ? "active" : ""} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
        </div>
        <div className="sermon-search-bar" style={{ marginBottom: "28px" }}>
          <Icon name="search" size={16} />
          <input type="text" placeholder="Search the archive…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {shown.length === 0 ? (
          <div className="no-results">Nothing found for "{search}".</div>
        ) : (
          <Reveal stagger className="archive-grid">
            {shown.map((item, i) => (
              <article key={i} className="archive-card">
                <div className="archive-thumb"><img src={item.thumb} alt={item.title} loading="lazy" /></div>
                <div className="archive-body">
                  <span className="sermon-year">{item.year} · {item.type}</span>
                  <h3>{item.title}</h3>
                  <p>{item.sub}</p>
                </div>
              </article>
            ))}
          </Reveal>
        )}
      </section>
      <PartnerBand />
    </main>
  )
}

/* ─── TESTIMONIES ─── */
function TestimoniesPage() {
  return (
    <main id="main">
      <PageHero eyebrow="Changed lives" title="What God has done." text="Real stories from real people whose lives have been touched through Choice Souls Media." />
      <section className="section page-shell">
        <Reveal stagger className="testimonies-grid">
          {testimonies.map(t => (
            <article key={t.name} className="testimony-card">
              <div className="testimony-stars">{[...Array(5)].map((_, i) => <Icon key={i} name="star" size={15} />)}</div>
              <blockquote>"{t.text}"</blockquote>
              <div className="testimony-author">
                <img src={t.image} alt={t.name} />
                <div><b>{t.name}</b><small>{t.event}</small></div>
              </div>
            </article>
          ))}
        </Reveal>
      </section>
      <section className="section dark-section">
        <div className="page-shell testimony-cta">
          <Reveal>
            <Eyebrow>Share your story</Eyebrow>
            <h2>Has God moved in your life through CSM?</h2>
            <p>We would love to hear your testimony and share it with our community.</p>
            <div style={{ marginTop: "28px" }}>
              <Link href="/contact" className="button">SHARE YOUR TESTIMONY <Icon name="arrow" size={16} /></Link>
            </div>
          </Reveal>
        </div>
      </section>
      <PartnerBand />
    </main>
  )
}

/* ─── FAQs ─── */
function FAQsPage() {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    { q: "What is Choice Souls Media?", a: "Choice Souls Media (CSM) is a global interdenominational network of believers, ministries, and purpose-driven creatives. We create transformative experiences at the intersection of faith, personal growth, and community." },
    { q: "How can I attend a CSM event?", a: "Visit our Events page to see upcoming gatherings including the Annual Camp Meeting 2027. You can register your interest directly through the site." },
    { q: "How do I access or download sermons?", a: "All sermons are on the Sermons page with embedded YouTube players. Each message has Download Video and Download Audio (MP3) buttons. You can also subscribe to @ChoiceSouls on YouTube." },
    { q: "How can I donate or partner with CSM?", a: "Visit the Partner page to give. We accept USD, NGN, GBP, EUR, and GHS. You can give once or set up a monthly gift." },
    { q: "When is the next Annual Camp Meeting?", a: "The Annual Camp Meeting 2027 is scheduled for August 25–28, 2027 in Lagos, Nigeria. The live countdown is on our homepage and Events page." },
    { q: "Can I volunteer with CSM?", a: "Yes! We welcome volunteers across events, media, and community outreach. Reach out via the Contact page." },
    { q: "Does CSM have a discipleship program?", a: "Yes. Our discipleship track covers four stages: Connect, Grow, Serve, and Lead. Learn more on the Services page." },
    { q: "Where is CSM based?", a: "Choice Souls Media is based in Lagos, Nigeria, with a growing community across Africa and the diaspora." },
    { q: "How do I submit a prayer request or testimony?", a: "Use our Contact page or the Testimonies page. We read every submission and believe in the power of prayer." },
  ]
  return (
    <main id="main">
      <PageHero eyebrow="Got questions?" title="We have answers." text="Everything you need to know about Choice Souls Media — our programs, events, and how to get involved." />
      <section className="section page-shell">
        <div className="faqs-layout">
          <SectionHeading eyebrow="Common questions" title="Frequently asked." />
          <Reveal className="faqs-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
                <button className="faq-question" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                  <span>{faq.q}</span>
                  <Icon name={open === i ? "close" : "help"} size={17} />
                </button>
                <div className="faq-answer"><p>{faq.a}</p></div>
              </div>
            ))}
          </Reveal>
        </div>
        <div className="faq-contact-box">
          <Eyebrow>Still have questions?</Eyebrow>
          <h3>We are happy to help.</h3>
          <p>Reach out directly and our team will get back to you within 2–3 working days.</p>
          <Link href="/contact" className="button">CONTACT US <Icon name="arrow" size={16} /></Link>
        </div>
      </section>
      <PartnerBand />
    </main>
  )
}

/* ─── GALLERY PAGE ─── */
function Gallery({ openLightbox }: { openLightbox: (n: number) => void }) {
  const [filter, setFilter] = useState("All")
  return (
    <main id="main">
      <PageHero eyebrow="The CSM archive" title="You had to be there." text="A visual record of brave conversations, joyful connection, and the moments between the moments." />
      <section className="section page-shell">
        <div className="filters gallery-filters">
          {["All","Summits","Community","Workshops"].map(f => (
            <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <GalleryGrid images={photos} openLightbox={openLightbox} />
      </section>
    </main>
  )
}

/* ─── FORM FIELD ─── */
function FormField({ label, name, type = "text", placeholder = "", required = true }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label>
      <span>{label}</span>
      <input name={name} type={type} placeholder={placeholder} required={required} />
    </label>
  )
}

/* ─── PUBLIC FORM ─── */
function PublicForm({ kind }: { kind: "partner" | "contact" }) {
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true) }
  if (sent)
    return (
      <div className="success-state">
        <span><Icon name="check" size={26} /></span>
        <h3>Thank you for reaching out.</h3>
        <p>Your message is ready. Connect Supabase to enable secure delivery and database storage.</p>
        <button className="text-link" onClick={() => setSent(false)}>SEND ANOTHER</button>
      </div>
    )
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="honeypot"><input name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="form-grid">
        <FormField label="Full name" name="name" placeholder="Your name" />
        <FormField label={kind === "partner" ? "Organization" : "Email address"} name={kind === "partner" ? "organization" : "email"} type={kind === "partner" ? "text" : "email"} placeholder={kind === "partner" ? "Company or organization" : "you@example.com"} />
        {kind === "partner" && <FormField label="Email address" name="email" type="email" placeholder="you@organization.com" />}
        <FormField label="Phone (optional)" name="phone" type="tel" placeholder="+234 or +1..." required={false} />
        {kind === "partner" && (
          <label>
            <span>Partnership type</span>
            <select name="type" required defaultValue="">
              <option value="" disabled>Select an option</option>
              <option>Event sponsor</option><option>Program partner</option><option>Media partner</option><option>In-kind support</option>
            </select>
          </label>
        )}
      </div>
      <label>
        <span>Message</span>
        <textarea name="message" rows={5} placeholder="Tell us a little about what you have in mind..." required />
      </label>
      <button className="button" type="submit">SEND MESSAGE <Icon name="arrow" size={16} /></button>
    </form>
  )
}

/* ─── DONATION WIDGET ─── */
function DonationWidget() {
  const [currency, setCurrency] = useState<"USD"|"NGN"|"GBP"|"EUR"|"GHS">("USD")
  const [amount, setAmount] = useState("")
  const [custom, setCustom] = useState(false)
  const [step, setStep] = useState<"amount"|"details"|"success">("amount")
  const [freq, setFreq] = useState<"once"|"monthly">("once")

  const presets: Record<string, number[]> = {
    USD: [10, 25, 50, 100, 250, 500],
    NGN: [5000, 10000, 25000, 50000, 100000, 250000],
    GBP: [10, 25, 50, 100, 250, 500],
    EUR: [10, 25, 50, 100, 250, 500],
    GHS: [50, 100, 250, 500, 1000, 2500],
  }
  const sym = currencySymbols[currency]

  if (step === "success") return (
    <div className="donation-success">
      <span className="donation-success-icon"><Icon name="heart" size={30} /></span>
      <h3>Thank you for your generosity!</h3>
      <p>Your donation will be processed once the payment gateway is connected. We are so grateful.</p>
      <button className="button" onClick={() => { setStep("amount"); setAmount(""); setCustom(false) }}>MAKE ANOTHER GIFT <Icon name="arrow" size={15} /></button>
    </div>
  )

  if (step === "details") return (
    <form className="contact-form donation-form" onSubmit={(e) => { e.preventDefault(); setStep("success") }}>
      <div className="donation-summary">
        <span>{freq === "monthly" ? "Monthly" : "One-time"} gift: <b>{sym}{Number(amount).toLocaleString()}</b></span>
        <button type="button" className="text-link" onClick={() => setStep("amount")}>Change</button>
      </div>
      <div className="form-grid">
        <FormField label="First name" name="fname" placeholder="First name" />
        <FormField label="Last name" name="lname" placeholder="Last name" />
        <FormField label="Email address" name="email" type="email" placeholder="you@example.com" />
        <FormField label="Phone (optional)" name="phone" type="tel" placeholder="+234 or +1..." required={false} />
      </div>
      <label><span>Dedication (optional)</span><input name="dedication" type="text" placeholder="In honor of / In memory of..." /></label>
      <div className="donation-note"><Icon name="shield" size={14} /><span>Payments are processed securely. Connect Stripe / Paystack / Flutterwave to activate.</span></div>
      <button className="button" type="submit" style={{ width: "100%" }}>COMPLETE DONATION <Icon name="arrow" size={16} /></button>
    </form>
  )

  return (
    <div className="donation-widget">
      <div className="donation-frequency">
        {(["once","monthly"] as const).map(f => (
          <button key={f} className={freq === f ? "active" : ""} onClick={() => setFreq(f)}>{f === "once" ? "Give Once" : "Give Monthly"}</button>
        ))}
      </div>
      <div className="currency-selector">
        <label>Currency</label>
        <div className="currency-flags">
          {(["USD","NGN","GBP","EUR","GHS"] as const).map(c => (
            <button key={c} className={currency === c ? "active" : ""} onClick={() => { setCurrency(c); setAmount(""); setCustom(false) }}>{c}</button>
          ))}
        </div>
      </div>
      <p className="donation-label">Select an amount ({currency})</p>
      <div className="donation-presets">
        {presets[currency].map(p => (
          <button key={p} className={amount === String(p) && !custom ? "active" : ""} onClick={() => { setAmount(String(p)); setCustom(false) }}>{sym}{p.toLocaleString()}</button>
        ))}
        <button className={custom ? "active" : ""} onClick={() => { setCustom(true); setAmount("") }}>Custom</button>
      </div>
      {custom && (
        <label className="custom-amount-label">
          <span>{sym}</span>
          <input type="number" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} min="1" />
        </label>
      )}
      <button className="button" style={{ width: "100%", marginTop: "18px" }} disabled={!amount} onClick={() => amount && setStep("details")}>
        GIVE {amount ? `${sym}${Number(amount).toLocaleString()}` : "NOW"} <Icon name="arrow" size={16} />
      </button>
      <p className="donation-secure"><Icon name="shield" size={13} />Secure · USD, NGN, GBP, EUR & GHS supported</p>
    </div>
  )
}

/* ─── PARTNER PAGE ─── */
function Partner() {
  return (
    <main id="main">
      <PageHero eyebrow="Partnerships with purpose" title="Your support can shift a story." text="Partner with CSM to create thoughtful experiences, reach an engaged community, and build impact that lasts." />
      <section className="donation-section">
        <div className="page-shell donation-layout">
          <div className="donation-copy">
            <Eyebrow>Give to the mission</Eyebrow>
            <h2>Every gift moves the needle.</h2>
            <p>Your donation directly funds gospel outreach, community programs, discipleship content, and the events that transform lives.</p>
            <div className="donation-impact">
              {[["₦10,000","Funds one community outreach session"],["$25","Sponsors one person at a CSM event"],["₦50,000","Supports one month of media production"],["$100","Helps fund our discipleship program"]].map(([a,d]) => (
                <div key={a} className="impact-item"><b>{a}</b><span>{d}</span></div>
              ))}
            </div>
          </div>
          <div className="donation-form-wrap"><DonationWidget /></div>
        </div>
      </section>
      <section className="section page-shell">
        <SectionHeading eyebrow="Why CSM" title="Shared values. Measurable impact." />
        <Reveal stagger className="benefits">
          {[["Reach","Connect with a growing community of purpose-led professionals and creatives."],["Relevance","Align your brand with meaningful, culturally resonant experiences."],["Impact","Help ideas, connections, and practical resources reach more people."]].map(([t,d],i) => (
            <article key={t}><span>0{i+1}</span><h3>{t}</h3><p>{d}</p></article>
          ))}
        </Reveal>
      </section>
      <section className="section soft">
        <div className="page-shell">
          <SectionHeading eyebrow="Ways to partner" title="Choose your way in." />
          <Reveal stagger className="tier-grid">
            {[["Event Partner","Bring a flagship experience to life through financial or in-kind support."],["Program Partner","Co-create an ongoing initiative around purpose, creativity, or leadership."],["Media Partner","Help powerful stories travel further through meaningful coverage and content."]].map(([t,d],i) => (
              <article key={t} className={i === 1 ? "featured-tier" : ""}>
                <small>{i === 1 ? "MOST FLEXIBLE" : `0${i+1}`}</small>
                <h3>{t}</h3><p>{d}</p>
                <ul>
                  {["Brand visibility","Curated activations","Impact reporting"].map(x => (
                    <li key={x}><Icon name="check" size={15} />{x}</li>
                  ))}
                </ul>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
      <section className="section page-shell">
        <SectionHeading eyebrow="The process" title="Simple, thoughtful, collaborative." />
        <Reveal stagger className="process">
          {["Start a conversation","Shape the opportunity","Create together","Measure the impact"].map((x,i) => (
            <article key={x}><b>0{i+1}</b><div className="p-line" /><h3>{x}</h3></article>
          ))}
        </Reveal>
      </section>
      <section className="section inquiry">
        <div className="page-shell inquiry-grid">
          <div>
            <Eyebrow>Let's talk</Eyebrow>
            <h2>Build something meaningful with us.</h2>
            <p>Share a little about your organization and what partnership could look like. We'll reply within 2–3 working days.</p>
          </div>
          <PublicForm kind="partner" />
        </div>
      </section>
      {/* Logo marquee */}
      <section className="logo-marquee" aria-label="Our partners">
        <div>
          {["NOVA FOUNDATION","ACCRA CREATIVE","ORIGIN HOUSE","NORTHSTAR","KINSHIP CO.","NOVA FOUNDATION","ACCRA CREATIVE","ORIGIN HOUSE"].map((x,i) => (
            <span key={i}>{x}<i /></span>
          ))}
        </div>
      </section>
    </main>
  )
}

/* ─── CONTACT ─── */
function Contact() {
  return (
    <main id="main">
      <PageHero eyebrow="Start a conversation" title="We'd love to hear from you." text="Questions, ideas, invitations, or just a hello — send a note and the right person will get back to you." />
      <section className="section page-shell contact-layout">
        <div>
          <Reveal stagger className="contact-cards">
            <article><Icon name="mail" /><small>EMAIL</small><a href="mailto:hello@choicesoulmedia.org">hello@choicesoulmedia.org</a></article>
            <article><Icon name="phone" /><small>CALL / WHATSAPP</small><a href="tel:+234000000000">+234 00 000 0000</a></article>
            <article><Icon name="pin" /><small>VISIT</small><p>Lagos, Nigeria</p></article>
          </Reveal>
          <div className="social-row">
            <span>FOLLOW</span>
            <a href="https://www.youtube.com/@ChoiceSouls" target="_blank" rel="noreferrer" aria-label="YouTube">YT</a>
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Facebook">FB</a>
          </div>
        </div>
        <div className="form-card"><PublicForm kind="contact" /></div>
      </section>
      <section className="map-placeholder">
        <div><Icon name="pin" size={26} /><b>CSM · LAGOS</b><span>Map embed placeholder</span></div>
      </section>
    </main>
  )
}

/* ─── POLICY ─── */
function Policy({ type }: { type: "privacy" | "terms" }) {
  return (
    <main id="main">
      <PageHero eyebrow="The details" title={type === "privacy" ? "Privacy policy" : "Terms of use"} text={`Last updated: March 2026 · Placeholder ${type} copy for legal review.`} />
      <section className="section page-shell policy">
        <h2>{type === "privacy" ? "Your information, handled with care." : "Using this website."}</h2>
        <p>This page contains placeholder policy content and must be reviewed by qualified legal counsel before launch.</p>
        <h3>Information we collect</h3>
        <p>Contact details you voluntarily submit through forms, newsletter registration, or support channels.</p>
        <h3>Your choices</h3>
        <p>You may request access, correction, or deletion of your personal information by contacting hello@choicesoulmedia.org.</p>
      </section>
    </main>
  )
}

/* ─── ADMIN ─── */
function AdminShell() {
  useEffect(() => {
    document.title = "Secure Console · CSM"
    const m = document.createElement("meta"); m.name = "robots"; m.content = "noindex,nofollow"
    document.head.appendChild(m); return () => m.remove()
  }, [])
  return (
    <main className="admin-shell">
      <div className="admin-card">
        <img src={logo} alt="CSM" />
        <Eyebrow>Secure console</Eyebrow>
        <h1>Backend connection required</h1>
        <p>The admin interface cannot securely authenticate users until Supabase is connected.</p>
        <div className="admin-notice">
          <Icon name="check" /><span><b>Public website is ready</b><small>Connect Supabase to activate CMS, submissions, and support chat.</small></span>
        </div>
        <Link href="/" className="button button-outline">RETURN TO WEBSITE</Link>
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
      <Link href="/" className="button">BACK TO HOME <Icon name="arrow" size={16} /></Link>
    </main>
  )
}

/* ─── FOOTER ─── */
function Footer() {
  const clicks = useRef<number[]>([])
  const hiddenClick = () => {
    const now = Date.now()
    clicks.current = [...clicks.current.filter(x => now - x < 3000), now]
    if (clicks.current.length >= 4) go(adminPath)
  }
  return (
    <footer>
      <div className="page-shell footer-grid">
        <div className="footer-brand">
          <img src={logo} alt="Choice Souls Media" />
          <p>Creating experiences that awaken purpose, deepen connection, and move people forward.</p>
        </div>
        <div>
          <h4>EXPLORE</h4>
          {nav.slice(0, 5).map(([t, h]) => <Link href={h} key={h}>{t}</Link>)}
        </div>
        <div>
          <h4>CONNECT</h4>
          <Link href="/partner">PARTNER WITH US</Link>
          <Link href="/contact">CONTACT</Link>
          <a href="https://www.youtube.com/@ChoiceSouls" target="_blank" rel="noreferrer">YOUTUBE</a>
          <Link href="/privacy">PRIVACY</Link>
          <Link href="/terms">TERMS</Link>
        </div>
        <div className="newsletter">
          <h4>STAY IN THE LOOP</h4>
          <p>Fresh stories, meaningful gatherings, no noise.</p>
          <form onSubmit={e => e.preventDefault()}>
            <input type="email" required aria-label="Email for newsletter" placeholder="Email address" />
            <button aria-label="Subscribe"><Icon name="arrow" /></button>
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

/* ─── COOKIE ─── */
function CookieNotice() {
  const [show, setShow] = useState(() => !localStorage.getItem("csm-cookie"))
  if (!show) return null
  return (
    <aside className="cookie">
      <p>We use essential cookies to remember your preferences. <Link href="/privacy">Learn more</Link></p>
      <button onClick={() => { localStorage.setItem("csm-cookie", "yes"); setShow(false) }}>GOT IT</button>
    </aside>
  )
}

/* ─── LIGHTBOX ─── */
function Lightbox({ index, close, setIndex }: { index: number | null; close: () => void; setIndex: (n: number) => void }) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") setIndex(((index ?? 0) + 1) % photos.length)
      if (e.key === "ArrowLeft") setIndex(((index ?? 0) - 1 + photos.length) % photos.length)
    }
    window.addEventListener("keydown", key)
    return () => window.removeEventListener("keydown", key)
  }, [index, close, setIndex])
  if (index === null) return null
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer">
      <button className="lightbox-close" onClick={close} aria-label="Close"><Icon name="close" /></button>
      <button className="lightbox-prev" onClick={() => setIndex((index - 1 + photos.length) % photos.length)} aria-label="Previous">←</button>
      <img src={photos[index]} alt={`CSM gallery photo ${index + 1}`} />
      <button className="lightbox-next" onClick={() => setIndex((index + 1) % photos.length)} aria-label="Next">→</button>
      <span>{String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
    </div>
  )
}

/* ─── APP ─── */
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
      <a className="skip-link" href="#main">Skip to content</a>
      <Splash />
      <Navbar path={path} />
      {pages[path] ?? <NotFound />}
      <Footer />
      <CookieNotice />
      <BotWidget />
      <Lightbox index={lightbox} close={() => setLightbox(null)} setIndex={setLightbox} />
    </>
  )
}
