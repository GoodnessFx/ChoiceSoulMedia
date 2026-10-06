import { FormEvent, useEffect, useMemo, useRef, useState } from "react"

const logo = "/csm-logo.png"
const adminPath = "/xk9-admin-console-7f3a"

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

// Camp meeting flier carousel slides
const programSlides = [
  {
    id: 1,
    label: "CAMP MEETING FLIER",
    title: "Annual Camp Meeting",
    subtitle: "GO — the missional generation",
    dates: "August 25th – August 28th",
    location: "Lagos, Nigeria",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=82",
    bg: "#8B1A1A",
  },
  {
    id: 2,
    label: "UPCOMING PROGRAM",
    title: "The Purpose Summit",
    subtitle: "Turning inner clarity into meaningful action",
    dates: "October 12, 2026",
    location: "Accra, Ghana",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=82",
    bg: "#1a2b5e",
  },
  {
    id: 3,
    label: "COMMUNITY EVENT",
    title: "Creative Souls Forum",
    subtitle: "Where creativity meets purpose",
    dates: "December 7, 2026",
    location: "National Theatre, Accra",
    image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1400&q=82",
    bg: "#2d4a1e",
  },
]

const sermons = [
  {
    id: 1,
    title: "Alters & Thrones",
    series: "Apostolos CSM Camp meeting",
    year: "2025",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: photos[1],
  },
  {
    id: 2,
    title: "Say Yes First",
    series: "Apostolos CSM Camp meeting",
    year: "2025",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: photos[4],
  },
  {
    id: 3,
    title: "The Sent Ones",
    series: "Purpose Series 2025",
    year: "2025",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: photos[2],
  },
  {
    id: 4,
    title: "Identity & Assignment",
    series: "Who You Are Series",
    year: "2024",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: photos[7],
  },
  {
    id: 5,
    title: "Positioned for Impact",
    series: "Leadership Summit",
    year: "2024",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: photos[0],
  },
  {
    id: 6,
    title: "Grace For The Race",
    series: "Camp Meeting 2024",
    year: "2024",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: photos[6],
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
    date: "24",
    month: "AUG",
    title: "The Purpose Summit",
    place: "Accra City Hall",
    type: "Upcoming",
    image: photos[1],
    time: "10:00 AM",
  },
  {
    date: "12",
    month: "OCT",
    title: "Creative Souls Forum",
    place: "National Theatre, Accra",
    type: "Upcoming",
    image: photos[4],
    time: "9:30 AM",
  },
  {
    date: "07",
    month: "DEC",
    title: "Impact & Gratitude Night",
    place: "The Fitzgerald, Cantonments",
    type: "Upcoming",
    image: photos[2],
    time: "5:00 PM",
  },
  {
    date: "18",
    month: "MAY",
    title: "Soul Connect 2025",
    place: "Labadi Beach Hotel",
    type: "Past",
    image: photos[0],
    time: "11:00 AM",
  },
  {
    date: "03",
    month: "FEB",
    title: "Lead From Within",
    place: "Kempinski Gold Coast",
    type: "Past",
    image: photos[7],
    time: "10:00 AM",
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
    }, 1800)
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
      <img src={logo} alt="CSM" />
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
            <img src={logo} alt="" />
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
      <div className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="mobile-head">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={logo} alt="CSM" />
            <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--navy-dark)" }}>CHOICE SOULS MEDIA</span>
          </div>
          <button aria-label="Close menu" onClick={() => setOpen(false)}>
            <Icon name="close" />
          </button>
        </div>
        <div>
          {nav.map(([label, href], i) => (
            <Link
              key={href}
              href={href}
              className={path === href ? "active" : ""}
            >
              <span onClick={() => setOpen(false)}>
                {String(i + 1).padStart(2, "0")} — {label}
              </span>
            </Link>
          ))}
        </div>
        <Link href="/partner" className="button">
          <span onClick={() => setOpen(false)}>PARTNER WITH US</span>
        </Link>
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

function Countdown() {
  const target = useMemo(() => new Date("2026-08-24T10:00:00"), [])
  const [left, setLeft] = useState(target.getTime() - Date.now())
  useEffect(() => {
    const id = setInterval(() => setLeft(target.getTime() - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])
  const values = [
    Math.max(0, Math.floor(left / 86400000)),
    Math.max(0, Math.floor(left / 3600000) % 24),
    Math.max(0, Math.floor(left / 60000) % 60),
    Math.max(0, Math.floor(left / 1000) % 60),
  ]
  return (
    <div className="countdown">
      {values.map((n, i) => (
        <div key={i}>
          <b>{String(n).padStart(2, "0")}</b>
          <small>{["DAYS", "HRS", "MIN", "SEC"][i]}</small>
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
            style={{ background: slide.bg }}
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
          <h3>ANNUAL CAMP MEETING</h3>
          <p className="upcoming-sub">The meeting of the sent ones</p>
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
    const id = setInterval(() => setImgIndex((i) => (i + 1) % photos.length), 5500)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="hero-full">
      {photos.map((p, i) => (
        <div
          key={p}
          className={`hero-bg-slide ${i === imgIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${p})` }}
        />
      ))}
      <div className="hero-full-overlay" />
      <div className="hero-full-content page-shell">
        <Eyebrow>Purpose-led community</Eyebrow>
        <h1>
          Where choice meets <em>soul.</em>
        </h1>
        <p>
          We create transformative experiences that help people discover
          purpose, build meaningful connections, and lead lives that matter.
        </p>
        <div className="hero-actions">
          <Link href="/events" className="button">
            UPCOMING EVENTS <Icon name="arrow" size={18} />
          </Link>
          <Link href="/partner" className="button button-outline-light">
            PARTNER WITH US
          </Link>
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
                src={`https://www.youtube.com/embed/${sermon.youtubeId}?rel=0`}
                title={sermon.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
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
                  <small>{s.series}</small>
                  <span className="sermon-year">{s.year}</span>
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
  const years = ["All", "2025", "2024"]
  const shown = sermons.filter((s) => filter === "All" || s.year === filter)
  const sermon = sermons[active]
  return (
    <main id="main">
      <PageHero
        eyebrow="Gospel Messages"
        title="The word that changes everything."
        text="Every message is a moment. Browse our library of sermons, teachings, and gospel content."
      />
      <section className="section page-shell">
        <div className="sermons-layout featured-sermon-layout">
          <div className="sermon-video">
            <div className="video-embed-wrap">
              <iframe
                src={`https://www.youtube.com/embed/${sermon.youtubeId}?rel=0`}
                title={sermon.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div style={{ marginTop: "16px" }}>
              <h3 style={{ marginBottom: "4px" }}>{sermon.title}</h3>
              <p style={{ fontSize: ".78rem", margin: 0 }}>{sermon.series} · {sermon.year}</p>
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
                  <small>{s.series}</small>
                  <span className="sermon-year">{s.year}</span>
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
          <Reveal stagger className="sermons-grid">
            {shown.map((s, i) => (
              <article key={s.id} className="sermon-card" onClick={() => { setActive(sermons.indexOf(s)); go("/sermons"); }}>
                <div className="sermon-card-thumb">
                  <img src={s.thumbnail} alt={s.title} loading="lazy" />
                  <span className="sermon-card-play">
                    <Icon name="play" size={20} />
                  </span>
                </div>
                <div className="sermon-card-body">
                  <span className="sermon-year">{s.year}</span>
                  <h3>{s.title}</h3>
                  <p>{s.series}</p>
                </div>
              </article>
            ))}
          </Reveal>
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
  return (
    <section className="logo-marquee" aria-label="Our partners">
      <div>
        {[
          "NOVA FOUNDATION",
          "ACCRA CREATIVE",
          "ORIGIN HOUSE",
          "NORTHSTAR",
          "KINSHIP CO.",
          "NOVA FOUNDATION",
          "ACCRA CREATIVE",
          "ORIGIN HOUSE",
        ].map((x, i) => (
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
        text="Questions, ideas, invitations, or just a hello—send a note and the right person from our team will get back to you."
      />
      <section className="section page-shell contact-layout">
        <div>
          <Reveal stagger className="contact-cards">
            <article>
              <Icon name="mail" />
              <small>EMAIL</small>
              <a href="mailto:hello@choicesoulmedia.org">
                hello@choicesoulmedia.org
              </a>
            </article>
            <article>
              <Icon name="phone" />
              <small>CALL / WHATSAPP</small>
              <a href="tel:+234000000000">+234 00 000 0000</a>
            </article>
            <article>
              <Icon name="pin" />
              <small>VISIT</small>
              <p>Lagos, Nigeria</p>
            </article>
          </Reveal>
          <div className="social-row">
            <span>FOLLOW THE JOURNEY</span>
            <a href="#" aria-label="Instagram">
              IG
            </a>
            <a href="#" aria-label="LinkedIn">
              LI
            </a>
            <a href="#" aria-label="YouTube">
              YT
            </a>
          </div>
        </div>
        <div className="form-card">
          <PublicForm kind="contact" />
        </div>
      </section>
      <section className="map-placeholder">
        <div>
          <Icon name="pin" size={28} />
          <b>CSM · LAGOS</b>
          <span>Map embed placeholder</span>
        </div>
      </section>
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
          <img src={logo} alt="CSM" />
          <p>
            Creating experiences that awaken purpose, deepen connection, and
            move people forward.
          </p>
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
      <a
        className="whatsapp"
        href="https://wa.me/234000000000"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        WA
      </a>
      <Lightbox
        index={lightbox}
        close={() => setLightbox(null)}
        setIndex={setLightbox}
      />
    </>
  )
}
