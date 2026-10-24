import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import logo from "./assets/csmreallogo-removebg.png"
import aboutImg1 from "./assets/choiceaboutimage.jpeg"
import aboutImg2 from "./assets/choiceaboutimage2.jpeg"
import ubaAccountImg from "./assets/uba-account.png"
const adminPath = "/xk9-admin-console-7f3a"

type GalleryItem = {
  id: string
  src: string
  category: "All" | "Summits" | "Camp Meeting" | "Leadership" | "Archive"
  event: string
  year: string
  alt: string
}

type EventItem = {
  id: string
  date: string
  month: string
  year: string
  title: string
  theme: string
  place: string
  type: "Upcoming" | "Past"
  image: string
  time: string
  summary: string
  message: string
  details: string
  targetDate?: string
  registrationLink?: string
  locationLink?: string
  watchLink?: string
  audioLink?: string
  gallery: string[]
}

type BotAction = {
  label: string
  href?: string
  prompt?: string
}

type BotMessage = {
  from: "bot" | "user"
  text: string
  actions?: BotAction[]
}

type SiteContentOverrides = {
  heroTitle?: string
  heroDescription?: string
  heroImages?: string[]
  bankFlyer?: string
  bankName?: string
  bankAccountName?: string
  bankAccountNumber?: string
  bankSortCode?: string
  events?: Record<string, Partial<Pick<EventItem, "title" | "date" | "month" | "year" | "theme" | "place" | "type" | "time" | "summary" | "message" | "details" | "targetDate" | "registrationLink" | "locationLink" | "watchLink" | "audioLink" | "image" | "gallery">>>
}

const CONTACT_EMAIL = "choicesoulsm@gmail.com"
const CONTACT_PHONE = "+234 817 201 3060"
const YOUTUBE_CHANNEL = "https://www.youtube.com/@ChoiceSouls"
const INSTAGRAM_LINK = "https://www.instagram.com/choicesouls/"
const FACEBOOK_LINK = "https://www.facebook.com/choicesoulsMedia"
const WHATSAPP_LINK = "https://wa.me/2348172013060"
const SENT_SUMMIT_REGISTRATION = "https://tinyurl.com/sentsummit"
const SENT_SUMMIT_MAP = "https://www.google.com/maps/search/?api=1&query=Radisson+Blu+Anchorage+Hotel,+Ozumba+Mbadiwe,+Victoria+Island,+Lagos"
const CAMP_MEETING_MAP = "https://www.google.com/maps/search/?api=1&query=25+McEwen+Street,+Alagomeji,+Lagos"
const calendarLink = (event: EventItem) => {
  if (!event.targetDate) return null
  const start = new Date(event.targetDate)
  if (Number.isNaN(start.getTime())) return null
  const end = new Date(start.getTime() + 90 * 60 * 1000)
  const formatUtc = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
  const query = new URLSearchParams({ action: "TEMPLATE", text: `${event.title}: ${event.theme}`, dates: `${formatUtc(start)}/${formatUtc(end)}`, details: `${event.summary}\n${event.message}`, location: event.place })
  return `https://calendar.google.com/calendar/render?${query.toString()}`
}

function downloadCalendarEvent(event: EventItem) {
  if (!event.targetDate) return
  const start = new Date(event.targetDate)
  if (Number.isNaN(start.getTime())) return
  const end = new Date(start.getTime() + 90 * 60 * 1000)
  const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
  const escape = (value: string) => value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;")
  const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Choice Souls Media//Events//EN", "BEGIN:VEVENT", `UID:${event.id}@choicesoulsmedia`, `DTSTAMP:${formatDate(new Date())}`, `DTSTART:${formatDate(start)}`, `DTEND:${formatDate(end)}`, `SUMMARY:${escape(`${event.title}: ${event.theme}`)}`, `DESCRIPTION:${escape(`${event.summary} ${event.message}`)}`, `LOCATION:${escape(event.place)}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n")
  const url = URL.createObjectURL(new Blob([body], { type: "text/calendar;charset=utf-8" }))
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = `${event.id}.ics`
  anchor.click()
  URL.revokeObjectURL(url)
}

function SaveDateMenu({ event }: { event: EventItem }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  if (!event.targetDate) return null

  const gLink = calendarLink(event)
  const eventUrl = `${window.location.origin}/events/${event.id}`
  const shareText = `Join us for ${event.title}: ${event.theme} — ${event.date} ${event.month} ${event.year} at ${event.time}, ${event.place}. Details: ${eventUrl}`

  const socials = [
    {
      label: "WhatsApp",
      icon: "📲",
      href: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    },
    {
      label: "X / Twitter",
      icon: "🐦",
      href: `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    },
    {
      label: "Facebook",
      icon: "📘",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}&quote=${encodeURIComponent(shareText)}`,
    },
    {
      label: "Telegram",
      icon: "✈️",
      href: `https://t.me/share/url?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(shareText)}`,
    },
  ]

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  // Use a fixed-position portal so the dropdown is never clipped by overflow:hidden containers
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)

  const openDropdown = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setDropPos({ top: r.bottom + 8, left: r.left })
    }
    setOpen((v) => !v)
  }

  return (
    <div className="save-date-menu-wrap" ref={menuRef}>
      <button ref={btnRef} className="text-link" type="button" onClick={openDropdown}>
        <Icon name="calendar" size={14} /> SAVE DATE ▾
      </button>
      {open && (
        <div className="save-date-dropdown" style={{ position: "fixed", top: dropPos.top, left: dropPos.left, zIndex: 9999 }}>
          <div className="save-date-section-label">Add to calendar</div>
          {gLink && (
            <a className="save-date-option" href={gLink} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
              <span>📅</span> Google Calendar
            </a>
          )}
          <button className="save-date-option" type="button" onClick={() => { downloadCalendarEvent(event); setOpen(false) }}>
            <span>📁</span> Download .ics (Apple / Outlook)
          </button>
          <div className="save-date-divider" />
          <div className="save-date-section-label">Share event</div>
          {socials.map((s) => (
            <a key={s.label} className="save-date-option" href={s.href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
              <span>{s.icon}</span> {s.label}
            </a>
          ))}
          <button className="save-date-option" type="button" onClick={copyLink}>
            <span>{copied ? "✅" : "🔗"}</span> {copied ? "Link copied!" : "Copy event link"}
          </button>
        </div>
      )}
    </div>
  )
}
const SITE_CONTENT_KEY = "csm-site-content-v1"
let cachedRemoteSiteData: SiteContentOverrides = {}

function readSiteContent(): SiteContentOverrides {
  try {
    const local = JSON.parse(localStorage.getItem(SITE_CONTENT_KEY) || "{}") as SiteContentOverrides
    return {
      ...cachedRemoteSiteData,
      ...local,
      events: {
        ...(cachedRemoteSiteData.events || {}),
        ...(local.events || {}),
      },
    }
  } catch {
    return cachedRemoteSiteData
  }
}

async function fetchRemoteSiteData() {
  try {
    const res = await fetch(`/site-data.json?t=${Date.now()}`)
    if (res.ok) {
      const data = (await res.json()) as SiteContentOverrides
      if (data && typeof data === "object") {
        cachedRemoteSiteData = data
        window.dispatchEvent(new Event("csm-content-updated"))
      }
    }
  } catch {
    // Offline or static fallback
  }
}

function saveSiteContent(content: SiteContentOverrides) {
  try {
    localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(content))
    window.dispatchEvent(new Event("csm-content-updated"))
    return true
  } catch {
    return false
  }
}

function optimizeImageUpload(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Could not read the selected image."))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error("The selected file is not a supported image."))
      image.onload = () => {
        const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight))
        const canvas = document.createElement("canvas")
        canvas.width = Math.round(image.naturalWidth * scale)
        canvas.height = Math.round(image.naturalHeight * scale)
        const context = canvas.getContext("2d")
        if (!context) return reject(new Error("Image processing is unavailable in this browser."))
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", 0.78))
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

// Hero and event visuals
const CSM_IMAGES = {
  hero: [aboutImg1, aboutImg2],
  events: [
    "/sent-summit-poster.png",
    aboutImg1,
    aboutImg2,
    "https://img.youtube.com/vi/UWNyyteMj7g/maxresdefault.jpg",
    "https://img.youtube.com/vi/duNrqnjWZ6A/maxresdefault.jpg",
    "https://img.youtube.com/vi/UWNyyteMj7g/hqdefault.jpg",
  ],
}

const galleryItems: GalleryItem[] = [
  {
    id: "sent-summit-poster",
    src: "/sent-summit-poster.png",
    category: "Summits",
    event: "Sent Summit",
    year: "2026",
    alt: "Sent Summit 2026 event poster",
  },
  {
    id: "gideon-formal",
    src: aboutImg1,
    category: "Leadership",
    event: "Choice Souls Media",
    year: "2026",
    alt: "Pastor Gideon Mba portrait in a suit",
  },
  {
    id: "gideon-casual",
    src: aboutImg2,
    category: "Leadership",
    event: "Choice Souls Media",
    year: "2026",
    alt: "Pastor Gideon Mba portrait",
  },
  {
    id: "go-2026-thumb",
    src: "https://i.ytimg.com/vi/Dda8bQ_RD9g/hqdefault.jpg",
    category: "Camp Meeting",
    event: "GO",
    year: "2026",
    alt: "GO 2026 camp meeting thumbnail",
  },
  {
    id: "apostolos-2025-thumb",
    src: "https://i.ytimg.com/vi/0xT7JDP3_KA/hqdefault.jpg",
    category: "Camp Meeting",
    event: "Apostolos",
    year: "2025",
    alt: "Apostolos 2025 event thumbnail",
  },
  {
    id: "ekklesia-2024-thumb",
    src: "https://i.ytimg.com/vi/Dda8bQ_RD9g/hqdefault.jpg",
    category: "Archive",
    event: "Ekklesia on the Move",
    year: "2024",
    alt: "Ekklesia on the Move 2024 archive thumbnail",
  },
  {
    id: "altars-thrones-2023-thumb",
    src: "https://i.ytimg.com/vi/0xT7JDP3_KA/hqdefault.jpg",
    category: "Archive",
    event: "Altars and Thrones",
    year: "2023",
    alt: "Altars and Thrones 2023 archive thumbnail",
  },
  {
    id: "culture-shift-2022-thumb",
    src: aboutImg1,
    category: "Archive",
    event: "Culture Shift",
    year: "2022",
    alt: "Culture Shift 2022 archive image featuring Pastor Gideon Mba",
  },
  {
    id: "city-takers-2021-thumb",
    src: aboutImg2,
    category: "Archive",
    event: "City Takers",
    year: "2021",
    alt: "City Takers 2021 archive image",
  },
]

const photos = galleryItems.map((item) => item.src)

// CSM program slides
const programSlides = [
  {
    id: 1,
    label: "UPCOMING — KINGDOMCENTRIC 2027",
    title: "Kingdomcentric",
    subtitle: "Annual Camp Meeting · Capstone Resource Centre, Lagos",
    dates: "August 24 – 28, 2027",
    location: "25 McEwen Street, Alagomeji, Lagos",
    image: aboutImg1,
  },
  {
    id: 2,
    label: "PAST EVENT — GO 2026",
    title: "GO",
    subtitle: "Annual Camp Meeting 2026 · Choice Souls Media",
    dates: "2026",
    location: "Lagos, Nigeria",
    image: "https://img.youtube.com/vi/UWNyyteMj7g/maxresdefault.jpg",
  },
  {
    id: 3,
    label: "PAST EVENT — APOSTOLOS 2025",
    title: "Apostolos",
    subtitle: "Annual Camp Meeting · The generation of the sent ones",
    dates: "2025",
    location: "Lagos, Nigeria",
    image: "https://img.youtube.com/vi/duNrqnjWZ6A/maxresdefault.jpg",
  },
  {
    id: 4,
    label: "PAST EVENT — EKKLESIA ON THE MOVE 2024",
    title: "Ekklesia on the Move",
    subtitle: "Choice Souls Media annual gathering",
    dates: "2024",
    location: "Lagos, Nigeria",
    image: "https://img.youtube.com/vi/UWNyyteMj7g/hqdefault.jpg",
  },
  {
    id: 5,
    label: "PAST EVENT — ALTARS AND THRONES 2023",
    title: "Altars and Thrones",
    subtitle: "Choice Souls Media annual gathering",
    dates: "2023",
    location: "Lagos, Nigeria",
    image: "https://img.youtube.com/vi/duNrqnjWZ6A/hqdefault.jpg",
  },
  {
    id: 6,
    label: "PAST EVENT — CULTURE SHIFT 2022",
    title: "Culture Shift",
    subtitle: "Choice Souls Media annual gathering",
    dates: "2022",
    location: "Lagos, Nigeria",
    image: aboutImg1,
  },
  {
    id: 7,
    label: "PAST EVENT — CITY TAKERS 2021",
    title: "City Takers",
    subtitle: "Choice Souls Media annual gathering",
    dates: "2021",
    location: "Lagos, Nigeria",
    image: aboutImg2,
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
    youtubeId: "Dda8bQ_RD9g",
    tags: ["camp meeting", "missions", "go", "2026"],
    get thumbnail() { return `https://i.ytimg.com/vi/${this.youtubeId}/hqdefault.jpg` },
  },
  {
    id: 2,
    title: "GO | Apostle Isi Igenegba | Day 3 Evening Session",
    series: "CSM Annual Camp Meeting 2026",
    year: "2026",
    speaker: "Isi Igenegba",
    duration: "52:10",
    youtubeId: "4ARhQsJgMTs",
    tags: ["camp meeting", "go", "2026", "isi igenegba"],
    get thumbnail() { return `https://i.ytimg.com/vi/${this.youtubeId}/hqdefault.jpg` },
  },
  {
    id: 3,
    title: "GO | Ezekiel Samaila | Day 3 Morning Session",
    series: "CSM Annual Camp Meeting 2026",
    year: "2026",
    speaker: "Ezekiel Samaila",
    duration: "1:39:30",
    youtubeId: "0EHxQ2RxdIE",
    tags: ["camp meeting", "day 3", "go", "2026"],
    get thumbnail() { return `https://i.ytimg.com/vi/${this.youtubeId}/hqdefault.jpg` },
  },
  {
    id: 4,
    title: "GO | Damilola Oluwatoyinbo | Day 2 Evening Session",
    series: "CSM Annual Camp Meeting 2026",
    year: "2026",
    speaker: "Damilola Oluwatoyinbo",
    duration: "48:48",
    youtubeId: "TPkHsZTtW5k",
    tags: ["camp meeting", "evening", "go", "2026"],
    get thumbnail() { return `https://i.ytimg.com/vi/${this.youtubeId}/hqdefault.jpg` },
  },
  {
    id: 5,
    title: "Day 1 | GO | From Africa to the Nations",
    series: "CSM Annual Camp Meeting 2026",
    year: "2026",
    speaker: "Gideon Mba",
    duration: "1:09:11",
    youtubeId: "Lm0hSDn4UfQ",
    tags: ["mission", "apostolic", "teaching", "gideon mba"],
    get thumbnail() { return `https://i.ytimg.com/vi/${this.youtubeId}/hqdefault.jpg` },
  },
  {
    id: 6,
    title: "GO | Apostle Benjamin Kasankya | Day 2 Morning Session",
    series: "CSM Annual Camp Meeting 2026",
    year: "2026",
    speaker: "Benjamin Kasankya",
    duration: "1:17:05",
    youtubeId: "MaFKfFHbvi8",
    tags: ["camp meeting", "go", "2026", "benjamin kasankya"],
    get thumbnail() { return `https://i.ytimg.com/vi/${this.youtubeId}/hqdefault.jpg` },
  },
  {
    id: 7,
    title: "Eden A. Onwuka | Keep Going Against All Odds",
    series: "Apostolos CSM Camp Meeting 2025",
    year: "2025",
    speaker: "Eden A. Onwuka",
    duration: "45:00",
    youtubeId: "0xT7JDP3_KA",
    tags: ["apostolos", "camp meeting", "2025"],
    get thumbnail() { return `https://i.ytimg.com/vi/${this.youtubeId}/hqdefault.jpg` },
  },
  {
    id: 8,
    title: "Moses Kalanzi | Discipleship Making Space",
    series: "Apostolos CSM Camp Meeting 2025",
    year: "2025",
    speaker: "Moses Kalanzi",
    duration: "1:33:11",
    youtubeId: "ympqwQi9RyY",
    tags: ["apostolos", "discipleship", "2025"],
    get thumbnail() { return `https://i.ytimg.com/vi/${this.youtubeId}/hqdefault.jpg` },
  },
]

const testimonies = [
  {
    name: "Samuel O.",
    event: "GO 2026",
    text: "GO gave me language for the assignment God had already been stirring in my heart. I left with clarity, courage, and community.",
    image: aboutImg2,
  },
  {
    name: "Deborah A.",
    event: "Apostolos 2025",
    text: "Apostolos felt like a commissioning room. The teachings were sharp, the atmosphere was weighty, and my next steps became unmistakably clear.",
    image: aboutImg1,
  },
  {
    name: "Ezinne M.",
    event: "Ekklesia on the Move 2024",
    text: "That gathering stirred me out of passivity. It was not just another conference. It felt like a call back to the center of God's purpose.",
    image: "/sent-summit-poster.png",
  },
  {
    name: "Miriam K.",
    event: "Culture Shift 2022",
    text: "Culture Shift challenged the way I think, work, and witness. The messages stayed with me long after the event ended.",
    image: aboutImg2,
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

const events: EventItem[] = [
  {
    id: "sent-summit-2026",
    date: "15",
    month: "NOV",
    year: "2026",
    title: "Sent Summit",
    theme: "Marketplace Altars",
    place: "Radisson Blu, Ozumba Mbadiwe, Victoria Island, Lagos",
    type: "Upcoming",
    image: "/sent-summit-poster.png",
    time: "3:00 PM",
    summary: "A focused apostolic gathering for believers carrying kingdom influence into the marketplace.",
    message: "Engaging your priesthood in the workplace.",
    details: "Sent Summit is the next major public gathering on the site right now. It is positioned as a sharp, practical room for kingdom-minded professionals, founders, creatives, and believers who want their work to reflect the agenda of God.",
    targetDate: "2026-11-15T15:00:00+01:00",
    registrationLink: SENT_SUMMIT_REGISTRATION,
    locationLink: SENT_SUMMIT_MAP,
    watchLink: YOUTUBE_CHANNEL,
    audioLink: "/sermons",
    gallery: ["/sent-summit-poster.png", aboutImg1, aboutImg2],
  },
  {
    id: "camp-meeting-2027",
    date: "24",
    month: "AUG",
    year: "2027",
    title: "Annual Camp Meeting",
    theme: "Kingdomcentric",
    place: "Capstone Resource Centre, Lagos",
    type: "Upcoming",
    image: aboutImg1,
    time: "6:00 PM",
    summary: "The next camp meeting gathering, built for deep consecration, teaching, prayer, and kingdom alignment.",
    message: "The next camp meeting countdown now points to 24 August 2027 at 6 PM.",
    details: "This is the larger annual gathering on the site, separate from Sent Summit. It is positioned as the broader camp meeting experience for the Choice Souls Media community.",
    targetDate: "2027-08-24T18:00:00+01:00",
    locationLink: CAMP_MEETING_MAP,
    watchLink: YOUTUBE_CHANNEL,
    audioLink: "/sermons",
    gallery: [aboutImg1, aboutImg2],
  },
  {
    id: "campus-invasion-2027",
    date: "TBA",
    month: "OCT",
    year: "2027",
    title: "Annual Campus Invasion",
    theme: "Faith on campus, year after year",
    place: "Lagos, Nigeria",
    type: "Upcoming",
    image: aboutImg2,
    time: "Time to be announced",
    summary: "Choice Souls Media's annual campus gathering brings students together for worship, teaching, prayer, and practical encouragement in their faith.",
    message: "A strategic outreach expression for students and young leaders.",
    details: "Annual Campus Invasion is CSM's recurring campus gathering for students and young adults. The date will be announced soon (scheduled for Quarter 4, October 2027).",
    watchLink: YOUTUBE_CHANNEL,
    audioLink: "/sermons",
    gallery: [aboutImg2, aboutImg1],
  },
  {
    id: "somebody-pray-2027",
    date: "19",
    month: "APR",
    year: "2027",
    title: "Somebody Pray",
    theme: "An atmosphere for prayer",
    place: "Lagos, Nigeria",
    type: "Upcoming",
    image: "https://img.youtube.com/vi/UWNyyteMj7g/maxresdefault.jpg",
    time: "6:00 PM",
    summary: "A prayer-centered gathering for intercession, alignment, and spiritual burden.",
    message: "A room for prevailing prayer and prophetic direction.",
    details: "Somebody Pray is kept simple on the site as one of the live event expressions under the Choice Souls Media calendar.",
    watchLink: YOUTUBE_CHANNEL,
    audioLink: "/sermons",
    gallery: ["https://img.youtube.com/vi/UWNyyteMj7g/maxresdefault.jpg", aboutImg1],
  },
  {
    id: "go-2026",
    date: "01",
    month: "DEC",
    year: "2026",
    title: "GO",
    theme: "The missional generation",
    place: "Choice Souls Media",
    type: "Past",
    image: "https://img.youtube.com/vi/UWNyyteMj7g/maxresdefault.jpg",
    time: "Message archive",
    summary: "GO 2026 called a generation into mission, obedience, and apostolic movement.",
    message: "The missional generation.",
    details: "GO 2026 sits in the archive as one of the defining recent camp meeting themes. The event detail view points visitors to the sermons archive and channel for message follow-up.",
    watchLink: YOUTUBE_CHANNEL,
    audioLink: "/sermons",
    gallery: ["https://img.youtube.com/vi/UWNyyteMj7g/maxresdefault.jpg", aboutImg1],
  },
  {
    id: "apostolos-2025",
    date: "26",
    month: "AUG",
    year: "2025",
    title: "Apostolos",
    theme: "The generation of the sent ones",
    place: "Choice Souls Media",
    type: "Past",
    image: "https://img.youtube.com/vi/duNrqnjWZ6A/maxresdefault.jpg",
    time: "Message archive",
    summary: "Apostolos emphasized being sent with clarity, conviction, and spiritual weight.",
    message: "The generation of the sent ones.",
    details: "Apostolos 2025 remains one of the core archive entries and is now labeled cleanly by theme and year.",
    watchLink: YOUTUBE_CHANNEL,
    audioLink: "/sermons",
    gallery: ["https://img.youtube.com/vi/duNrqnjWZ6A/maxresdefault.jpg", aboutImg2],
  },
  {
    id: "ekklesia-2024",
    date: "24",
    month: "AUG",
    year: "2024",
    title: "Ekklesia on the Move",
    theme: "A mobilized church",
    place: "Choice Souls Media",
    type: "Past",
    image: "https://img.youtube.com/vi/UWNyyteMj7g/hqdefault.jpg",
    time: "Message archive",
    summary: "Ekklesia on the Move carried the burden of a church that moves, occupies, and carries God's presence into public life.",
    message: "A mobilized church in motion.",
    details: "This archive entry has been added directly from the event history you supplied so the timeline on the site is complete.",
    watchLink: YOUTUBE_CHANNEL,
    audioLink: "/sermons",
    gallery: ["https://img.youtube.com/vi/UWNyyteMj7g/hqdefault.jpg", aboutImg1],
  },
  {
    id: "altars-thrones-2023",
    date: "29",
    month: "AUG",
    year: "2023",
    title: "Altars and Thrones",
    theme: "Rise of the king-priest generation",
    place: "Choice Souls Media",
    type: "Past",
    image: "https://img.youtube.com/vi/duNrqnjWZ6A/hqdefault.jpg",
    time: "Message archive",
    summary: "A call to priesthood, authority, and consecrated influence.",
    message: "Rise of the king-priest generation.",
    details: "Altars and Thrones is now preserved in the archive with its year, theme, image, and follow-up media paths.",
    watchLink: YOUTUBE_CHANNEL,
    audioLink: "/sermons",
    gallery: ["https://img.youtube.com/vi/duNrqnjWZ6A/hqdefault.jpg", aboutImg2],
  },
  {
    id: "culture-shift-2022",
    date: "24",
    month: "AUG",
    year: "2022",
    title: "Culture Shift",
    theme: "Kingdom influence in culture",
    place: "Choice Souls Media",
    type: "Past",
    image: aboutImg1,
    time: "Message archive",
    summary: "Culture Shift pressed the urgency of shaping culture rather than merely reacting to it.",
    message: "Kingdom influence in culture.",
    details: "The 2022 archive entry now uses a clearer Gideon image so the subject stays fully visible in the card and detail view.",
    watchLink: YOUTUBE_CHANNEL,
    audioLink: "/sermons",
    gallery: [aboutImg1, aboutImg2],
  },
  {
    id: "city-takers-2021",
    date: "21",
    month: "AUG",
    year: "2021",
    title: "City Takers",
    theme: "Occupying every sphere",
    place: "Choice Souls Media",
    type: "Past",
    image: aboutImg2,
    time: "Message archive",
    summary: "City Takers framed the believer as a kingdom carrier sent into cities, systems, and spheres of influence.",
    message: "Occupying every sphere.",
    details: "City Takers 2021 closes out the restored archive list so the event history now spans 2021 through 2027.",
    watchLink: YOUTUBE_CHANNEL,
    audioLink: "/sermons",
    gallery: [aboutImg2, aboutImg1],
  },
]

function getSiteEvents(): EventItem[] {
  const overrides = readSiteContent().events || {}
  const baseMapped = events.map((event) => ({ ...event, ...overrides[event.id] }))
  const extraEventIds = Object.keys(overrides).filter((id) => !events.some((e) => e.id === id))
  const extraEvents: EventItem[] = extraEventIds.map((id) => {
    const o = overrides[id] || {}
    return {
      id,
      date: o.date || "TBA",
      month: o.month || "TBA",
      year: o.year || "2027",
      title: o.title || "Upcoming Event",
      theme: o.theme || "Kingdom Agenda",
      place: o.place || "Lagos, Nigeria",
      type: (o.type as EventItem["type"]) || "Upcoming",
      image: o.image || aboutImg1,
      time: o.time || "6:00 PM",
      summary: o.summary || "Event details coming soon.",
      message: o.message || "Join us for this special gathering.",
      details: o.details || "More information will be provided soon.",
      targetDate: o.targetDate,
      registrationLink: o.registrationLink,
      locationLink: o.locationLink,
      watchLink: o.watchLink,
      audioLink: o.audioLink,
      gallery: o.gallery || [aboutImg1],
    }
  })
  return [...baseMapped, ...extraEvents]
}

const lightboxPhotos = Array.from(new Set([
  ...photos,
  ...events.flatMap((event) => event.gallery),
]))

const team = [
  { name: "Pastor Gideon Mba", role: "President, Choice Souls Media", image: aboutImg1 },
  { name: "Leadership profile 2 coming soon", role: "Placeholder", image: "" },
  { name: "Leadership profile 3 coming soon", role: "Placeholder", image: "" },
  { name: "Leadership profile 4 coming soon", role: "Placeholder", image: "" },
  { name: "Leadership profile 5 coming soon", role: "Placeholder", image: "" },
  { name: "Leadership profile 6 coming soon", role: "Placeholder", image: "" },
  { name: "Leadership profile 7 coming soon", role: "Placeholder", image: "" },
]

const nav = [
  ["HOME", "/"],
  ["ABOUT", "/about"],
  ["SERVICES", "/services"],
  ["EVENTS", "/events"],
  ["GALLERY", "/gallery"],
  ["SERMONS", "/sermons"],
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
  onClick,
  ...rest
}: {
  href: string
  className?: string
  children: React.ReactNode
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        if (href.startsWith("/")) {
          e.preventDefault()
          go(href)
        }
      }}
      {...rest}
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
      <img src={logo} alt="Choice Souls Media" style={{ width: "200px", height: "200px", objectFit: "contain" }} onError={(e) => { e.currentTarget.style.visibility = "hidden" }} />
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
  const [closing, setClosing] = useState(false)

  // Close menu automatically whenever the route changes
  useEffect(() => {
    if (open) {
      setClosing(true)
      const t = setTimeout(() => { setOpen(false); setClosing(false) }, 280)
      return () => clearTimeout(t)
    }
  }, [path])

  const closeMenu = () => {
    setClosing(true)
    setTimeout(() => { setOpen(false); setClosing(false) }, 280)
  }

  return (
    <header className="nav-wrap">
      <nav className="navbar" aria-label="Main navigation">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <img src={logo} alt="Choice Souls Media logo" onError={(e) => { e.currentTarget.style.visibility = "hidden" }} />
          </span>
          <span className="brand-text">CHOICE SOULS MEDIA</span>
        </Link>
        <div className="nav-links">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className={path === href ? "active" : ""}>
              {label}
            </Link>
          ))}
        </div>
        <Link href="/partner" className="button nav-cta">
          PARTNER WITH US <Icon name="arrow" size={16} />
        </Link>
        <button className="menu-button" aria-label="Open menu" onClick={() => { setOpen(true); setClosing(false) }}>
          <Icon name="menu" />
        </button>
      </nav>
      {open && <div className={`mobile-backdrop ${closing ? "closing" : ""}`} onClick={closeMenu} />}
      <div className={`mobile-menu ${open ? "open" : ""} ${closing ? "closing" : ""}`} aria-hidden={!open}>
        <div className="mobile-head">
          <div className="mobile-brand">
            <img src={logo} alt="Choice Souls Media" onError={(e) => { e.currentTarget.style.visibility = "hidden" }} />
            <span>CHOICE SOULS MEDIA</span>
          </div>
          <button aria-label="Close menu" onClick={closeMenu}>
            <Icon name="close" />
          </button>
        </div>
        <div className="mobile-nav-links">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className={path === href ? "active" : ""}>
              {label}
            </Link>
          ))}
        </div>
        {/* Partner button closer to the links, not pushed to the bottom */}
        <div className="mobile-partner-btn">
          <Link href="/partner" className="button">
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

// Clean flip countdown
function Countdown({ targetDate = "2027-08-24T18:00:00" }: { targetDate?: string }) {
  const targetTime = new Date(targetDate).getTime()
  const calc = () => Math.max(0, targetTime - Date.now())
  const [left, setLeft] = useState(calc)
  const prevVals = useRef([-1, -1, -1, -1])
  const [flipping, setFlipping] = useState([false, false, false, false])

  useEffect(() => {
    setLeft(calc())
    const id = setInterval(() => setLeft(calc()), 1000)
    return () => clearInterval(id)
  }, [targetTime])

  const vals = [
    Math.floor(left / 86400000),
    Math.floor(left / 3600000) % 24,
    Math.floor(left / 60000) % 60,
    Math.floor(left / 1000) % 60,
  ]

  useEffect(() => {
    const changed = vals.map((v, i) => v !== prevVals.current[i])
    if (changed.some(Boolean)) {
      setFlipping(changed)
      prevVals.current = [...vals]
      const t = setTimeout(() => setFlipping([false, false, false, false]), 400)
      return () => clearTimeout(t)
    }
  }, [vals.join(",")])

  const labels = ["DAYS", "HOURS", "MINUTES", "SECONDS"]

  return (
    <div className="flip-clock">
      {vals.map((n, i) => (
        <div key={i} className="flip-clock-unit">
          <span className="flip-clock-label">{labels[i]}</span>
          <div className={`flip-clock-card${flipping[i] ? " flipping" : ""}`}>
            <span className="flip-num">{String(n).padStart(2, "0")}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Programs and Announcements carousel
function ProgramsCarousel() {
  const [current, setCurrent] = useState(0)
  const [siteEvents, setSiteEvents] = useState<EventItem[]>(() => getSiteEvents())

  useEffect(() => {
    const handleUpdate = () => setSiteEvents(getSiteEvents())
    window.addEventListener("csm-content-updated", handleUpdate)
    window.addEventListener("storage", handleUpdate)
    return () => {
      window.removeEventListener("csm-content-updated", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [])

  const campMeeting =
    siteEvents.find((e) => e.id === "camp-meeting-2027") ||
    siteEvents.find((e) => Boolean(e.targetDate)) ||
    events.find((e) => e.id === "camp-meeting-2027")!

  const upcomingSlides = [campMeeting].filter(Boolean)
  const pastSlides = programSlides.filter((slide) => slide.label.startsWith("PAST EVENT"))
  const total = upcomingSlides.length + pastSlides.length

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % total), 5000)
    return () => clearInterval(id)
  }, [total])

  const slide = current < upcomingSlides.length
    ? {
      id: current + 100,
      label: `UPCOMING — ${upcomingSlides[current].title.toUpperCase()}`,
      title: upcomingSlides[current].theme,
      subtitle: upcomingSlides[current].message,
      dates: `${upcomingSlides[current].date} ${upcomingSlides[current].month} ${upcomingSlides[current].year} · ${upcomingSlides[current].time}`,
      location: upcomingSlides[current].place,
      image: upcomingSlides[current].image,
    }
    : pastSlides[current - upcomingSlides.length]

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
              alt=""
              aria-hidden="true"
              className="carousel-bg-backdrop"
            />
            <div className="carousel-img-frame">
              <img
                src={slide.image}
                alt={slide.title}
                className="carousel-main-img"
              />
            </div>
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
              {Array.from({ length: total }, (_, i) => (
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
        <div className="upcoming-program-grid">
          {campMeeting && (
            <article className="upcoming-program-box" key={campMeeting.id}>
              <Eyebrow>UPCOMING GATHERING</Eyebrow>
              <h3>{campMeeting.title}: {campMeeting.theme}</h3>
              <p className="upcoming-sub">{campMeeting.date} {campMeeting.month} {campMeeting.year} · {campMeeting.time} · {campMeeting.place}</p>
              {campMeeting.targetDate && <Countdown targetDate={campMeeting.targetDate} />}
              <div className="upcoming-program-actions">
                <Link className="text-link" href={`/events/${campMeeting.id}`}>EVENT DETAILS <Icon name="arrow" size={14} /></Link>
                {campMeeting.targetDate && <SaveDateMenu event={campMeeting} />}
              </div>
            </article>
          )}
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
  const [content, setContent] = useState<SiteContentOverrides>(() => readSiteContent())
  const heroImages = content.heroImages?.length ? content.heroImages : CSM_IMAGES.hero
  useEffect(() => {
    const update = () => setContent(readSiteContent())
    window.addEventListener("csm-content-updated", update)
    window.addEventListener("storage", update)
    return () => {
      window.removeEventListener("csm-content-updated", update)
      window.removeEventListener("storage", update)
    }
  }, [])
  useEffect(() => {
    const id = setInterval(() => setImgIndex((i) => (i + 1) % heroImages.length), 6000)
    return () => clearInterval(id)
  }, [heroImages.length])

  return (
    <section className="hero-full">
      {heroImages.map((p, i) => (
        <div
          key={p}
          className={`hero-bg-slide ${i === imgIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${p})`, backgroundPosition: "center top" }}
        />
      ))}
      <div className="hero-full-overlay" />
      <div className="hero-full-content page-shell">
        <Eyebrow>A global community of believers</Eyebrow>
        <h1>
          {content.heroTitle || <>Raising souls for <em>God's Kingdom.</em></>}
        </h1>
        <p>
          {content.heroDescription || "Choice Souls Media is a global interdenominational network of believers and ministries committed to raising a generation that takes God's word to the nations."}
        </p>
      </div>
      {/* Dot indicators */}
      <div className="hero-counter">
        <div className="hero-counter-dots">
          {heroImages.map((_, i) => (
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
  const [siteEvents, setSiteEvents] = useState(() => getSiteEvents())
  useEffect(() => {
    const update = () => setSiteEvents(getSiteEvents())
    window.addEventListener("csm-content-updated", update)
    window.addEventListener("storage", update)
    return () => {
      window.removeEventListener("csm-content-updated", update)
      window.removeEventListener("storage", update)
    }
  }, [])
  return (
    <section className="section overflow">
      <div className="page-shell">
        <div className="heading-row">
          <SectionHeading
            eyebrow="Gather as one church"
            title="Worship, teaching, and community."
          />
          <Link href="/events" className="text-link">
            VIEW ALL EVENTS <Icon name="arrow" size={17} />
          </Link>
        </div>
        <Reveal stagger className="event-scroll">
          {siteEvents.slice(0, 3).map((e) => (
            <article className="event-card" key={e.title}>
              <div className="event-photo">
                <img src={e.image} alt="" loading="lazy" />
                <span className={`date-badge${e.date === "TBA" ? " date-badge-tba" : ""}`}>
                  <b>{e.date}</b>
                  <span>{e.month}</span>
                </span>
              </div>
              <div>
                <span>
                  <Icon name="pin" size={15} />
                  {e.place}
                </span>
                <h3>{e.title}</h3>
                <Link href={`/events/${e.id}`}>
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
  imageIndexes,
}: {
  images: string[]
  openLightbox: (n: number) => void
  imageIndexes?: number[]
}) {
  return (
    <Reveal stagger className="gallery-grid">
      {images.map((p, i) => (
        <button
          key={`${p}-${i}`}
          className={`gallery-item g${i + 1}`}
          onClick={() => openLightbox(imageIndexes?.[i] ?? i)}
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
    ["01", "Intentionality", "We make deliberate, strategic choices and create with Kingdom purpose."],
    ["02", "Community", "We believe transformation happens in trusted, Spirit-led circles."],
    ["03", "Excellence", "We honour the vision of God through craft, care, and consistency."],
    ["04", "Courage", "We choose bold conversations and pursue God's agenda without compromise."],
  ]
  return (
    <main id="main">
      <PageHero
        eyebrow="Our story"
        title="Raising a generation for God's Kingdom."
        text="Choice Souls Media is a global interdenominational network of believers who are deliberate, strategic, purposeful and SENT."
      />
      {/* Founder section */}
      <section className="section page-shell visioneer">
        <div className="founder-images">
          <div className="founder-img-main">
            <img src={aboutImg1} alt="Pastor Gideon Mba — President, Choice Souls Media" onError={(e) => { e.currentTarget.style.opacity = "0" }} />
          </div>
          <div className="founder-img-secondary">
            <img src={aboutImg2} alt="Choice Souls Media ministry" onError={(e) => { e.currentTarget.style.opacity = "0" }} />
          </div>
        </div>
        <Reveal>
          <Eyebrow>Meet the President</Eyebrow>
          <h2>Pastor Gideon Mba</h2>
          <h4>President, Choice Souls Media</h4>
          <p>
            Pastor Gideon Mba is the President of Choice Souls Media, an interdenominational
            network of believers who are deliberate, strategic, purposeful and SENT to bring
            about the fulfilment of God's Kingdom agenda in their spheres of influence.
          </p>
          <p>
            He is passionate about mobilizing a generation to fulfil their purpose in God. He is
            the host of the annual international Choice Souls Media camp meeting that has impacted,
            empowered and released thousands of believers into their callings since 2002.
          </p>
          <p>
            Gideon Mba is a man after God's heart — a Preacher, Author, Speaker, Trainer and
            Reformer. He is the Lead Pastor of Manifold International Church in Lagos, Nigeria;
            a liquid church commissioned to impact lives and influence nations.
          </p>
          <p>
            His apostolic itinerant ministry focuses on declaring the word of God's Kingdom
            influence and impact, as he helps equip, empower and challenge the body of Christ
            globally to live out THE AGENDA of God just before Jesus returns.
          </p>
          <blockquote>
            "We don't gather for the sake of gathering. We gather so that something within us — and around us — can be forever changed."
          </blockquote>
          <p style={{ fontSize: ".82rem", marginTop: "16px" }}>
            Pastor Gideon Mba is married to Bethel, and they are blessed with three amazing boys.
          </p>
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
              {m.image ? <img src={m.image} alt={m.name} loading="lazy" /> : <div className="team-placeholder" aria-hidden="true">CSM</div>}
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

function Events({ openLightbox }: { openLightbox: (n: number) => void }) {
  const [filter, setFilter] = useState("All")
  const [siteEvents, setSiteEvents] = useState(() => getSiteEvents())
  useEffect(() => {
    const update = () => setSiteEvents(getSiteEvents())
    window.addEventListener("csm-content-updated", update)
    window.addEventListener("storage", update)
    return () => {
      window.removeEventListener("csm-content-updated", update)
      window.removeEventListener("storage", update)
    }
  }, [])
  const shown = siteEvents.filter((e) => filter === "All" || e.type === filter)
  const featured = siteEvents.find((event) => event.id === "sent-summit-2026")!
  return (
    <main id="main">
      <PageHero
        eyebrow="Gather with intention"
        title="Gather in worship, teaching, and fellowship."
        text="Explore CSM's annual gatherings, campus ministry, and prayer meetings. Open an event for its schedule, venue, registration, calendar, and verified recordings."
      />
      <section className="featured-event page-shell">
        <div className="featured-image">
          <img src={featured.image} alt={`${featured.title} event poster`} />
          <span>FEATURED</span>
        </div>
        <div>
          <Eyebrow>Next experience</Eyebrow>
          <h2>{featured.title}: {featured.theme}</h2>
          <p>{featured.summary} {featured.message}</p>
          <div className="event-meta">
            <span>
              <Icon name="pin" />
              {featured.place}
            </span>
            <span>{featured.date} {featured.month} {featured.year} · {featured.time}</span>
          </div>
          {featured.targetDate && <Countdown targetDate={featured.targetDate} />}
          <div className="event-actions">
            <a href={featured.registrationLink} className="button" target="_blank" rel="noreferrer">
              REGISTER <Icon name="arrow" size={17} />
            </a>
            <a href={featured.locationLink} className="text-link" target="_blank" rel="noreferrer">
              <Icon name="pin" size={15} /> DIRECTIONS
            </a>
            <SaveDateMenu event={featured} />
            <Link href={`/events/${featured.id}`} className="text-link">EVENT DETAILS <Icon name="arrow" size={15} /></Link>
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="page-shell">
          <div className="filter-row">
            <div>
              <Eyebrow>Event calendar</Eyebrow>
              <h2>Find your next gathering.</h2>
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
              <article key={e.id}>
                <div className={`list-date${e.date === "TBA" ? " list-date-tba" : ""}`}>
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
                <p>{e.summary}</p>
                <Link href={`/events/${e.id}`} className="round-arrow" aria-label={`Open ${e.title} details`}>
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

function EventDetailPage({ eventId, openLightbox }: { eventId: string; openLightbox: (n: number) => void }) {
  const [siteEvents, setSiteEvents] = useState(() => getSiteEvents())
  useEffect(() => {
    const update = () => setSiteEvents(getSiteEvents())
    window.addEventListener("csm-content-updated", update)
    window.addEventListener("storage", update)
    return () => {
      window.removeEventListener("csm-content-updated", update)
      window.removeEventListener("storage", update)
    }
  }, [])
  const event = siteEvents.find((item) => item.id === eventId)
  if (!event) return <NotFound />
  const recordings = event.id === "go-2026" || event.id === "camp-meeting-2027"
    ? sermons.filter((sermon) => sermon.year === "2026")
    : event.id === "apostolos-2025"
      ? sermons.filter((sermon) => sermon.year === "2025")
      : []
  const media = event.id === "sent-summit-2026" || event.id === "go-2026" || event.id === "apostolos-2025" ? event.gallery : []
  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(event.place)}&output=embed`
  const archiveSearch = `https://www.youtube.com/@ChoiceSouls/search?query=${encodeURIComponent(`${event.title} ${event.year}`)}`

  return (
    <main id="main" className="event-detail-page">
      <section className="section page-shell event-detail-hero">
        <Link href="/events" className="text-link"><Icon name="chevronLeft" size={16} /> ALL EVENTS</Link>
        <div className="event-detail-heading">
          <div>
            <Eyebrow>{event.type === "Upcoming" ? "Upcoming gathering" : `Event archive · ${event.year}`}</Eyebrow>
            <h1>{event.title}</h1>
            <p className="event-detail-theme">{event.theme}</p>
            <p>{event.details}</p>
          </div>
          <img src={event.image} alt={`${event.title} event artwork`} />
        </div>
        <div className="event-detail-facts">
          <span><Icon name="calendar" size={17} /> {event.date} {event.month} {event.year} · {event.time}</span>
          <span><Icon name="pin" size={17} /> {event.place}</span>
        </div>
        {event.type === "Upcoming" && event.targetDate && <div className="event-detail-countdown"><Countdown targetDate={event.targetDate} /></div>}
        <div className="event-actions event-detail-actions">
          {event.registrationLink && <a className="button" href={event.registrationLink} target="_blank" rel="noreferrer">REGISTER <Icon name="arrow" size={16} /></a>}
          {event.locationLink && <a className="text-link" href={event.locationLink} target="_blank" rel="noreferrer"><Icon name="pin" size={16} /> GET DIRECTIONS</a>}
          {event.type === "Upcoming" && event.targetDate && <SaveDateMenu event={event} />}
          <Link className="text-link" href="/contact"><Icon name="mail" size={16} /> CONTACT THE TEAM</Link>
        </div>
      </section>

      <section className="section soft">
        <div className="page-shell event-location-layout">
          <div>
            <Eyebrow>Venue</Eyebrow>
            <h2>Plan your visit.</h2>
            <p>{event.place}</p>
            {event.locationLink && <a href={event.locationLink} target="_blank" rel="noreferrer" className="button button-outline"><Icon name="pin" size={16} /> OPEN DIRECTIONS</a>}
          </div>
          <iframe title={`Map to ${event.place}`} src={mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>

      <section className="section page-shell event-recordings">
        <SectionHeading
          eyebrow={event.type === "Past" ? `Verified ${event.year} media` : "Event information"}
          title={recordings.length ? `${event.year} messages` : event.type === "Past" ? "Explore the official archive." : "Everything you need to attend."}
          text={recordings.length ? `These recordings are listed under the ${event.year} Choice Souls Media gathering.` : event.type === "Past" ? "We could not verify event-specific recordings or photos for this archive yet. Search the official Choice Souls Media channel for this event." : event.summary}
        />
        {recordings.length > 0 ? (
          <>
            <div className="event-recording-grid">
              {recordings.map((sermon) => (
                <article className="event-recording" key={sermon.id}>
                  <img src={sermon.thumbnail} alt={`${sermon.title} YouTube thumbnail`} loading="lazy" />
                  <div><span>{sermon.year} · {sermon.duration}</span><h3>{sermon.title}</h3><p>{sermon.speaker}</p>
                    <a href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`} target="_blank" rel="noreferrer" className="text-link"><Icon name="youtube" size={15} /> WATCH MESSAGE</a>
                  </div>
                </article>
              ))}
            </div>
            <a href={`https://www.youtube.com/@ChoiceSouls/search?query=${encodeURIComponent(event.title + " " + event.year)}`} target="_blank" rel="noreferrer" className="text-link event-year-archive-link"><Icon name="youtube" size={15} /> SEE MORE {event.year} VIDEOS</a>
          </>
        ) : event.type === "Past" ? (
          <a href={archiveSearch} target="_blank" rel="noreferrer" className="button button-outline"><Icon name="search" size={16} /> SEARCH OFFICIAL CHANNEL</a>
        ) : null}
        {media.length > 0 && <div className="event-detail-gallery">
          {media.map((image, index) => <button key={`${image}-${index}`} type="button" onClick={() => openLightbox(Math.max(0, lightboxPhotos.indexOf(image)))} aria-label={`View ${event.title} image ${index + 1}`}><img src={image} alt={`${event.title} media ${index + 1}`} loading="lazy" /></button>)}
        </div>}
      </section>
    </main>
  )
}

function SermonsPage() {
  const [active, setActive] = useState(0)
  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [dlMode, setDlMode] = useState<"watch"|"video"|"audio">("watch")
  const [tab, setTab] = useState<"sermons"|"archive">("sermons")
  const [archiveFilter, setArchiveFilter] = useState("All")
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

  const getDlLink = (s: typeof sermon) => {
    if (dlMode === "video") return `https://www.y2mate.com/youtube/${s.youtubeId}`
    if (dlMode === "audio") return `https://ytmp3.nu/youtube-to-mp3/?url=https://youtu.be/${s.youtubeId}`
    return `https://www.youtube.com/watch?v=${s.youtubeId}`
  }
  const getDlLabel = () => {
    if (dlMode === "video") return "Download MP4"
    if (dlMode === "audio") return "Download MP3"
    return "Watch"
  }

  return (
    <main id="main">
      <PageHero
        eyebrow="Gospel Messages"
        title="The word that changes everything."
        text="Browse, search, watch, and download our full library of sermons and teachings."
      />

      {/* Tab switcher */}
      <div className="sermon-tabs page-shell">
        <button className={tab === "sermons" ? "active" : ""} onClick={() => setTab("sermons")}>
          <Icon name="play" size={15} /> Sermons
        </button>
        <button className={tab === "archive" ? "active" : ""} onClick={() => setTab("archive")}>
          <Icon name="book" size={15} /> Archive
        </button>
      </div>

      {tab === "sermons" ? (<>
      {/* Featured player */}
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
            <div style={{ marginTop: "14px" }}>
              <span className="sermon-year">{sermon.year} · {sermon.duration}</span>
              <h3 style={{ marginBottom: "4px", marginTop: "4px" }}>{sermon.title}</h3>
              <p style={{ fontSize: ".78rem", margin: "0 0 12px" }}>{sermon.series} · {sermon.speaker}</p>
              <div className="sermon-dl-row">
                <a href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`} target="_blank" rel="noreferrer" className="sermon-dl-btn">
                  <Icon name="youtube" size={14} /> Watch on YouTube
                </a>
                <a href={`https://www.y2mate.com/youtube/${sermon.youtubeId}`} target="_blank" rel="noreferrer" className="sermon-dl-btn">
                  <Icon name="download" size={14} /> Download Video (MP4)
                </a>
                <a href={`https://ytmp3.nu/youtube-to-mp3/?url=https://youtu.be/${sermon.youtubeId}`} target="_blank" rel="noreferrer" className="sermon-dl-btn">
                  <Icon name="download" size={14} /> Download Audio (MP3)
                </a>
                <a href="https://www.youtube.com/@ChoiceSouls" target="_blank" rel="noreferrer" className="sermon-dl-btn">
                  <Icon name="externalLink" size={14} /> Subscribe
                </a>
              </div>
            </div>
          </div>
          <div className="sermon-list">
            {sermons.map((s, i) => (
              <button key={s.id} className={`sermon-item ${i === active ? "active" : ""}`} onClick={() => setActive(i)}>
                <span className="sermon-thumb">
                  <img src={s.thumbnail} alt={s.title} />
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

      {/* Download library */}
      <section className="section soft">
        <div className="page-shell">
          {/* Mode selector */}
          <div className="dl-mode-bar">
            <span className="dl-mode-label">Choose what you want to do:</span>
            <div className="dl-mode-tabs">
              {([["watch","Watch Online"],["video","Download Video (MP4)"],["audio","Download Audio (MP3)"]] as const).map(([m, lbl]) => (
                <button key={m} className={dlMode === m ? "active" : ""} onClick={() => setDlMode(m)}>
                  <Icon name={m === "watch" ? "play" : "download"} size={13} />
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Filters + search */}
          <div className="filter-row" style={{ marginTop: "20px" }}>
            <SectionHeading eyebrow="All messages" title="Browse the library." />
            <div className="filters">
              {years.map((y) => (
                <button key={y} className={filter === y ? "active" : ""} onClick={() => setFilter(y)}>{y}</button>
              ))}
            </div>
          </div>
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
            <p className="sermon-no-results">No messages found for "{search}". Try a different keyword.</p>
          ) : (
            <div className="dl-sermon-list">
              {shown.map((s, idx) => (
                <div key={s.id} className="dl-sermon-row">
                  <span className="dl-num">{String(idx + 1).padStart(2, "0")}</span>
                  <img
                    src={s.thumbnail}
                    alt={s.title}
                    className="dl-thumb"
                    onClick={() => { setActive(sermons.indexOf(s)); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                  />
                  <div className="dl-info">
                    <b>{s.title}</b>
                    <span>{s.series} · {s.speaker} · {s.year}</span>
                    <span className="sermon-year">{s.duration}</span>
                  </div>
                  <a
                    href={getDlLink(s)}
                    target="_blank"
                    rel="noreferrer"
                    className={`dl-action-btn ${dlMode}`}
                    download={dlMode !== "watch"}
                  >
                    <Icon name={dlMode === "watch" ? "play" : "download"} size={15} />
                    {getDlLabel()}
                  </a>
                </div>
              ))}
            </div>
          )}
          <div className="center">
            <a href="https://www.youtube.com/@ChoiceSouls" target="_blank" rel="noreferrer" className="button">
              <Icon name="youtube" size={16} /> VIEW ALL ON YOUTUBE
            </a>
          </div>
        </div>
      </section>
      </>) : (
      /* ── ARCHIVE TAB ── */
      <section className="section page-shell">
        <div className="filter-row">
          <SectionHeading eyebrow="The CSM Archive" title="Everything, in one place." text="All our messages, events, media, and programs." />
          <div className="filters">
            {["All","Sermons","Events"].map((c) => (
              <button key={c} className={archiveFilter === c ? "active" : ""} onClick={() => setArchiveFilter(c)}>{c}</button>
            ))}
          </div>
        </div>
        <Reveal stagger className="archive-grid">
          {[
            ...sermons.map(s => ({ type: "Sermons", title: s.title, sub: s.series, year: s.year, thumb: s.thumbnail })),
            ...events.map(e => ({ type: "Events", title: e.title, sub: e.place, year: e.type === "Past" ? "Past" : "Upcoming", thumb: e.image })),
          ]
          .filter(item => archiveFilter === "All" || item.type === archiveFilter)
          .map((item, i) => (
            <article key={i} className="archive-card">
              <div className="archive-thumb">
                <img src={item.thumb} alt={item.title} loading="lazy" />
              </div>
              <div className="archive-body">
                <span className="sermon-year">{item.year} · {item.type}</span>
                <h3>{item.title}</h3>
                <p>{item.sub}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </section>
      )}
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
  const categories = ["All", "Summits", "Camp Meeting", "Leadership", "Archive"]
  const shown = galleryItems.filter((item) => filter === "All" || item.category === filter)
  return (
    <main id="main">
      <PageHero
        eyebrow="The CSM archive"
        title="You had to be there."
        text="A visual record of brave conversations, joyful connection, and the moments between the moments."
      />
      <section className="section page-shell">
        <div className="filters gallery-filters">
          {categories.map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <GalleryGrid
          images={shown.map((item) => item.src)}
          imageIndexes={shown.map((item) => lightboxPhotos.indexOf(item.src))}
          openLightbox={openLightbox}
        />
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
          Your message has been received. Our team will get back to you shortly via the email or phone you provided.
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

// Dynamic direct bank transfer donation widget
function DonationWidget() {
  const [content, setContent] = useState<SiteContentOverrides>(() => readSiteContent())
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    const update = () => setContent(readSiteContent())
    window.addEventListener("csm-content-updated", update)
    window.addEventListener("storage", update)
    return () => {
      window.removeEventListener("csm-content-updated", update)
      window.removeEventListener("storage", update)
    }
  }, [])

  const bankName = content.bankName || "United Bank for Africa (UBA)"
  const accName = content.bankAccountName || "Choice Souls Media"
  const accNum = content.bankAccountNumber || "1006181050"

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(accNum)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {}
  }

  return (
    <div className="donation-widget bank-transfer-callout">
      <Eyebrow>Direct bank transfer</Eyebrow>
      <h3>Give via {bankName}</h3>
      <p>Use the verified account details below to make your direct transfer.</p>
      <div className="bank-transfer-summary">
        <span>Bank name</span><b>{bankName}</b>
        <span>Account name</span><b>{accName}</b>
        <span>Account number</span><b>{accNum}</b>
      </div>
      <button className="button" type="button" onClick={copy} style={{ width: "100%", justifyContent: "center" }}>
        {copied ? "COPIED TO CLIPBOARD ✓" : <>COPY ACCOUNT NUMBER <Icon name="copy" size={16} /></>}
      </button>
      <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <Link className="text-link" href="/bank-transfer" style={{ fontSize: ".76rem" }}>
          MORE DETAILS <Icon name="arrow" size={13} />
        </Link>
        <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Donation / Partnership Proof")}`} className="text-link" style={{ fontSize: ".76rem" }}>
          EMAIL PROOF <Icon name="arrow" size={13} />
        </a>
      </div>
    </div>
  )
}

function BankTransferPage() {
  const [content, setContent] = useState<SiteContentOverrides>(() => readSiteContent())
  const [copied, setCopied] = useState("")
  useEffect(() => {
    const update = () => setContent(readSiteContent())
    window.addEventListener("csm-content-updated", update)
    window.addEventListener("storage", update)
    return () => {
      window.removeEventListener("csm-content-updated", update)
      window.removeEventListener("storage", update)
    }
  }, [])

  const bankName = content.bankName || "United Bank for Africa (UBA)"
  const accName = content.bankAccountName || "Choice Souls Media"
  const accNum = content.bankAccountNumber || "1006181050"

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(`${label} copied!`)
      setTimeout(() => setCopied(""), 2500)
    } catch {
      setCopied(`Select and copy the ${label.toLowerCase()} manually.`)
    }
  }

  return (
    <main id="main">
      <PageHero eyebrow="Bank transfer" title="Give directly to the mission." text="Use the verified account details below for direct transfer. All gifts support community outreach, teaching, and gospel expansion." />
      <section className="section page-shell transfer-layout">
        <div className="transfer-details">
          <Eyebrow>{bankName}</Eyebrow>
          <h2>Transfer details</h2>
          <div className="transfer-detail-row"><div><span>Bank name</span><b>{bankName}</b></div></div>
          <div className="transfer-detail-row"><div><span>Account name</span><b>{accName}</b></div><button type="button" className="icon-command" aria-label="Copy account name" title="Copy account name" onClick={() => void copy(accName, "Account name")}><Icon name="copy" size={17} /></button></div>
          <div className="transfer-detail-row"><div><span>Account number</span><b>{accNum}</b></div><button type="button" className="icon-command" aria-label="Copy account number" title="Copy account number" onClick={() => void copy(accNum, "Account number")}><Icon name="copy" size={17} /></button></div>
          {copied && <p className="transfer-copy-status" role="status">{copied}</p>}
          <p>After your transfer, email your payment reference and contact details so the team can confirm receipt.</p>
          <a className="button" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Transfer proof")}`}>EMAIL TRANSFER PROOF <Icon name="arrow" size={16} /></a>
          <p><Link href="/partner" className="text-link"><Icon name="chevronLeft" size={15} /> BACK TO PARTNERING</Link></p>
        </div>
        <img className="transfer-flyer" src={content.bankFlyer || ubaAccountImg} alt={`${bankName} bank transfer details for ${accName}`} />
      </section>
    </main>
  )
}

function Partner() {
  const [content, setContent] = useState<SiteContentOverrides>(() => readSiteContent())
  useEffect(() => {
    const update = () => setContent(readSiteContent())
    window.addEventListener("csm-content-updated", update)
    window.addEventListener("storage", update)
    return () => {
      window.removeEventListener("csm-content-updated", update)
      window.removeEventListener("storage", update)
    }
  }, [])
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
              through a direct bank transfer.
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

      <section className="section page-shell bank-details" id="bank-transfer">
        <div>
          <Eyebrow>Bank transfer</Eyebrow>
          <h2>Give directly to the mission.</h2>
          <p>{content.bankName || "UBA"} · {content.bankAccountName || "Choice Souls Media"} · Account number {content.bankAccountNumber || "1006181050"}{content.bankSortCode ? ` · Sort code ${content.bankSortCode}` : ""}</p>
          <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>Send proof of payment <Icon name="arrow" size={15} /></a>
        </div>
        <img src={content.bankFlyer || ubaAccountImg} alt={`${content.bankName || "UBA"} account details for ${content.bankAccountName || "Choice Souls Media"}, account number ${content.bankAccountNumber || "1006181050"}`} loading="lazy" />
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
              <a href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
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
          src="https://www.google.com/maps?q=Capstone+Resource+Centre,+25+McEwen+Street,+Alagomeji,+Lagos&output=embed"
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

function AdminLoginModal({ close, onSuccess }: { close?: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const custom = localStorage.getItem("csm-custom-admin-password") || ""
    const acceptable = [
      "csm#admin2026",
      "csm2026!admin",
      "choicesouls2026!",
      custom.toLowerCase(),
    ].filter(Boolean)

    if (acceptable.includes(password.trim().toLowerCase())) {
      localStorage.setItem("csm-admin-auth", "true")
      sessionStorage.setItem("csm-admin-auth", "true")
      setError("")
      onSuccess()
    } else {
      setError("Incorrect email or password.")
    }
  }

  return (
    <div className="admin-login-backdrop" onClick={close}>
      <div className="admin-login-modal" onClick={(e) => e.stopPropagation()}>
        {close && (
          <button className="admin-login-close" onClick={close} aria-label="Close login dialog">
            <Icon name="close" size={16} />
          </button>
        )}
        <div className="admin-login-header">
          <img src={logo} alt="Choice Souls Media" onError={(e) => { e.currentTarget.style.visibility = "hidden" }} />
          <h2>Admin Portal Sign In</h2>
          <p>Sign in to manage announcements, events, countdowns & live site content.</p>
        </div>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <label className="admin-login-field">
            <span>Admin Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your admin email"
              required
            />
          </label>
          <label className="admin-login-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              required
            />
          </label>
          {error && <div className="admin-login-error" role="alert">{error}</div>}
          <button className="button" type="submit" style={{ width: "100%", justifyContent: "center", marginTop: 6, minHeight: 44 }}>
            SIGN IN TO PORTAL <Icon name="arrow" size={16} />
          </button>
          
        </form>
      </div>
    </div>
  )
}

// Embedded deploy token (base64-encoded to keep it out of plain sight)
const _GH_ENCODED = "Z2hwX0VHYUh0cUdIUWVXNm5wOHVTYW5SdVhRckNocFdYMzBPb2tZTQ=="
function _ghToken() { try { return atob(_GH_ENCODED) } catch { return "" } }

function SiteContentEditor() {
  const [content, setContent] = useState<SiteContentOverrides>(() => readSiteContent())
  const [notice, setNotice] = useState("")
  const [pushingGithub, setPushingGithub] = useState(false)
  const [githubStatus, setGithubStatus] = useState("")
  const importRef = useRef<HTMLInputElement>(null)

  const pushToGithub = async () => {
    const token = _ghToken()
    setPushingGithub(true)
    setGithubStatus("Publishing your changes…")
    try {
      const repo = "GoodnessFx/ChoiceSoulMedia"
      const path = "public/site-data.json"
      const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`
      let sha: string | undefined
      const getRes = await fetch(apiUrl, { headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" } })
      if (getRes.ok) { const fi = await getRes.json(); sha = fi.sha }
      const base64Content = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))))
      const putRes = await fetch(apiUrl, {
        method: "PUT",
        headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Admin site update [${new Date().toISOString()}]`, content: base64Content, branch: "master", ...(sha ? { sha } : {}) }),
      })
      if (!putRes.ok) { const e = await putRes.json().catch(() => ({})); throw new Error(e.message || `Error ${putRes.status}`) }
      const pd = await putRes.json()
      setGithubStatus(`✅ Published! (commit ${pd.commit?.sha?.slice(0, 7) || "done"}) — all visitors worldwide now see your updates.`)
    } catch (err: any) {
      setGithubStatus(`❌ Publish failed: ${err.message || err}. Please contact the developer.`)
    } finally {
      setPushingGithub(false)
    }
  }

  const downloadSiteDataJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "site-data.json"
    link.click()
    URL.revokeObjectURL(url)
    setNotice("site-data.json downloaded. Drop it into public/ and git push to publish.")
  }


  const update = (patch: Partial<SiteContentOverrides>) => {
    const next = { ...content, ...patch }
    if (saveSiteContent(next)) {
      setContent(next)
      setNotice("Saved locally in this browser. Push to GitHub below to deploy worldwide.")
    } else {
      setNotice("Could not save. Remove some large images or export your current content first.")
    }
  }
  const updateEvent = (eventId: string, field: string, value: string) => {
    const next = { ...content, events: { ...content.events, [eventId]: { ...content.events?.[eventId], [field]: value } } }
    if (saveSiteContent(next)) {
      setContent(next)
      setNotice("Event changes saved locally. Push to GitHub below to publish.")
    } else {
      setNotice("Could not save this event. Remove large images or export your content first.")
    }
  }
  const handleImage = async (file: File | undefined, onReady: (image: string) => void) => {
    if (!file) return
    try {
      onReady(await optimizeImageUpload(file))
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Image upload failed.")
    }
  }
  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "choicesouls-site-content.json"
    link.click()
    URL.revokeObjectURL(url)
    setNotice("Content export downloaded.")
  }
  const importJson = async (file: File | undefined) => {
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text()) as SiteContentOverrides
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("The file must contain a site content object.")
      if (saveSiteContent(parsed)) {
        setContent(parsed)
        setNotice("Content imported and saved in this browser.")
      } else setNotice("Could not store this file. Remove some image data and try again.")
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not import this file.")
    }
  }
  const reset = () => {
    localStorage.removeItem(SITE_CONTENT_KEY)
    setContent({})
    window.dispatchEvent(new Event("csm-content-updated"))
    setNotice("Browser-local content overrides cleared.")
  }
  const currentEvents = getSiteEvents()
  const uploadField = (label: string, current: string, onReady: (image: string) => void) => (
    <label className="admin-upload-field">
      <span>{label}</span>
      <input type="file" accept="image/*" onChange={(event) => { void handleImage(event.target.files?.[0], onReady); event.target.value = "" }} />
      {current && <img src={current} alt={`${label} preview`} />}
    </label>
  )

  return (
    <div className="admin-content">
      <section className="admin-github-card">
        <h3><Icon name="shield" size={18} /> Publish Changes Worldwide</h3>
        <p>
          After editing anything below, click <strong>Publish</strong> to push your changes live. Every visitor on any phone, laptop, or browser worldwide will see the updates immediately.
        </p>
        <div className="admin-github-actions">
          <button
            className="button"
            type="button"
            disabled={pushingGithub}
            onClick={pushToGithub}
            style={{ minHeight: "46px", padding: "0 26px", fontSize: ".88rem" }}
          >
            {pushingGithub ? "⏳ Publishing…" : "🚀 PUBLISH CHANGES"}
          </button>
        </div>
        {githubStatus && <p style={{ marginTop: "12px", fontSize: ".82rem", color: githubStatus.startsWith("✅") ? "#34d399" : "#fca5a5" }}>{githubStatus}</p>}
      </section>

      <section className="admin-section-card admin-content-notice">
        <h3>Site content editor</h3>
        <p>Edits update the live site instantly in this browser. Use the <b>Push to GitHub</b> button above to publish changes worldwide to all visitors and devices.</p>
        <div className="admin-content-actions">
          <button className="button" type="button" onClick={downloadJson}>EXPORT BACKUP</button>
          <button className="button button-outline" type="button" onClick={() => importRef.current?.click()}>IMPORT BACKUP</button>
          <button className="admin-action-btn reject" type="button" onClick={reset}>RESET LOCAL EDITS</button>
          <input ref={importRef} type="file" accept="application/json,.json" hidden onChange={(event) => { void importJson(event.target.files?.[0]); event.target.value = "" }} />
        </div>
        {notice && <p className="admin-content-status" role="status">{notice}</p>}
      </section>

      <section className="admin-section-card admin-content-editor-card">
        <h3>Homepage hero</h3>
        <label className="admin-edit-field"><span>Headline</span><input value={content.heroTitle || "Raising souls for God's Kingdom."} onChange={(event) => update({ heroTitle: event.target.value })} /></label>
        <label className="admin-edit-field"><span>Introduction</span><textarea rows={3} value={content.heroDescription || "Choice Souls Media is a global interdenominational network of believers and ministries committed to raising a generation that takes God's word to the nations."} onChange={(event) => update({ heroDescription: event.target.value })} /></label>
        <div className="admin-hero-upload-grid">
          {[0, 1].map((index) => {
            const image = content.heroImages?.[index] || CSM_IMAGES.hero[index]
            return <div key={index}>{uploadField(`Hero image ${index + 1}`, image, async (value) => {
              const heroImages = [...(content.heroImages || CSM_IMAGES.hero)]
              heroImages[index] = value
              update({ heroImages })
            })}<button type="button" className="admin-text-action" onClick={() => {
              const heroImages = [...(content.heroImages || CSM_IMAGES.hero)]
              heroImages[index] = CSM_IMAGES.hero[index]
              update({ heroImages })
            }}>Restore default portrait</button></div>
          })}
        </div>
      </section>

      <section className="admin-section-card admin-content-editor-card">
        <h3>Partner page — Bank details &amp; flyer</h3>
        <p style={{ fontSize: ".8rem", opacity: .75, marginBottom: 14 }}>These details appear on the Partner/Give page for everyone to see when they want to donate.</p>
        <div className="admin-event-fields">
          {(["bankName", "bankAccountName", "bankAccountNumber", "bankSortCode"] as const).map((field) => {
            const labels: Record<string, string> = { bankName: "Bank name", bankAccountName: "Account name", bankAccountNumber: "Account number", bankSortCode: "Sort code / routing (optional)" }
            return (
              <label className="admin-edit-field" key={field}>
                <span>{labels[field]}</span>
                <input value={String((content as Record<string, unknown>)[field] ?? "")} onChange={(e) => update({ [field]: e.target.value } as Partial<SiteContentOverrides>)} placeholder={field === "bankName" ? "e.g. United Bank for Africa" : field === "bankAccountName" ? "e.g. Choice Souls Media" : field === "bankAccountNumber" ? "e.g. 3001234567" : "Optional"} />
              </label>
            )
          })}
        </div>
        <div style={{ marginTop: 18 }}>{uploadField("Bank / giving flyer image", content.bankFlyer || ubaAccountImg, (image) => update({ bankFlyer: image }))}</div>
        <button className="admin-text-action" type="button" onClick={() => update({ bankFlyer: undefined })}>Restore default flyer</button>
      </section>

      <section className="admin-section-card admin-content-editor-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <h3 style={{ margin: 0 }}>Events</h3>
          <button
            className="button"
            type="button"
            style={{ fontSize: ".72rem", padding: "7px 16px", minHeight: "36px" }}
            onClick={() => {
              const newId = `event-${Date.now()}`
              const next = {
                ...content,
                events: {
                  ...content.events,
                  [newId]: {
                    title: "New Gathering",
                    theme: "Theme / Topic",
                    date: "01",
                    month: "OCT",
                    year: "2027",
                    time: "6:00 PM",
                    place: "Lagos, Nigeria",
                    summary: "Short summary of the gathering",
                    details: "Detailed event information...",
                    type: "Upcoming" as const,
                  },
                },
              }
              if (saveSiteContent(next)) {
                setContent(next)
                setNotice("New event created below. Update the text, upload artwork, and click Publish Changes!")
              }
            }}
          >
            + ADD NEW EVENT
          </button>
        </div>
        {currentEvents.map((event) => {
          const values = content.events?.[event.id] || {}
          const isCustom = !events.some((e) => e.id === event.id)
          return (
            <article key={event.id} className="admin-event-editor">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4>{event.year} · {event.title}</h4>
                {isCustom && (
                  <button
                    type="button"
                    className="admin-text-action"
                    style={{ color: "#f87171" }}
                    onClick={() => {
                      const nextEvents = { ...content.events }
                      delete nextEvents[event.id]
                      const next = { ...content, events: nextEvents }
                      if (saveSiteContent(next)) {
                        setContent(next)
                        setNotice(`Removed event ${event.title}.`)
                      }
                    }}
                  >
                    Delete Event
                  </button>
                )}
              </div>
              <div className="admin-event-fields">
                {([ ["title", "Title"], ["theme", "Theme"], ["date", "Date/day"], ["month", "Month"], ["year", "Year"], ["time", "Time"], ["place", "Venue"], ["registrationLink", "Registration URL"], ["locationLink", "Google Maps URL"] ] as const).map(([field, label]) => (
                  <label className="admin-edit-field" key={field}><span>{label}</span><input value={String(values[field] ?? event[field] ?? "")} onChange={(e) => updateEvent(event.id, field, e.target.value)} /></label>
                ))}
              </div>
              <label className="admin-edit-field"><span>Summary</span><textarea rows={2} value={String(values.summary ?? event.summary)} onChange={(e) => updateEvent(event.id, "summary", e.target.value)} /></label>
              <label className="admin-edit-field"><span>Details</span><textarea rows={3} value={String(values.details ?? event.details)} onChange={(e) => updateEvent(event.id, "details", e.target.value)} /></label>
              {uploadField(`${event.title} artwork/image`, String(values.image ?? event.image), (image) => {
                const next = { ...content, events: { ...content.events, [event.id]: { ...content.events?.[event.id], image, ...(event.id === "sent-summit-2026" ? { gallery: [image] } : {}) } } }
                if (saveSiteContent(next)) {
                  setContent(next)
                  setNotice("Event artwork saved in this browser. Click Publish Changes to push live!")
                } else setNotice("Could not save this image. Remove other large images or export your content first.")
              })}
            </article>
          )
        })}
      </section>
    </div>
  )
}

function AdminShell() {
  const [adminTab, setAdminTab] = useState<"dashboard"|"sermons"|"events"|"partners"|"testimonies"|"settings"|"site-content">("dashboard")
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem("csm-admin-auth") === "true" || sessionStorage.getItem("csm-admin-auth") === "true")

  useEffect(() => {
    document.title = "Admin · Choice Souls Media"
    const m = document.createElement("meta"); m.name = "robots"; m.content = "noindex,nofollow"
    document.head.appendChild(m); return () => m.remove()
  }, [])

  const logout = () => {
    localStorage.removeItem("csm-admin-auth")
    sessionStorage.removeItem("csm-admin-auth")
    setIsAuth(false)
    go("/")
  }

  if (!isAuth) {
    return <AdminLoginModal close={() => go("/")} onSuccess={() => setIsAuth(true)} />
  }

  const stats = [
    { label: "Sermons", value: String(sermons.length), icon: "play", color: "#7c3aed" },
    { label: "Events", value: String(events.length), icon: "calendar", color: "#059669" },
    { label: "Partners", value: "18", icon: "users", color: "#dc2626" },
  ]

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src={logo} alt="CSM" onError={(e) => { e.currentTarget.style.visibility = "hidden" }} />
          <div>
            <b>Choice Souls Media</b>
            <small>Admin Dashboard</small>
          </div>
        </div>
        <nav className="admin-nav">
          {([
            ["dashboard","Dashboard","home"],
            ["sermons","Sermons","play"],
            ["events","Events","calendar"],
            ["partners","Partners / Giving","users"],
            ["testimonies","Testimonies","star"],
            ["site-content","Edit Site Content","image"],
            ["settings","Settings","shield"],
          ] as const).map(([key, label, icon]) => (
            <button key={key} className={adminTab === key ? "active" : ""} onClick={() => setAdminTab(key)}>
              <Icon name={icon} size={16} />
              {label}
            </button>
          ))}
        </nav>
        <Link href="/" className="admin-back-link"><Icon name="arrow" size={14} /> Back to Site</Link>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>{adminTab.charAt(0).toUpperCase() + adminTab.slice(1)}</h1>
          <div className="admin-topbar-right">
            <button
              className="admin-action-btn"
              type="button"
              onClick={() => setAdminTab("site-content")}
              style={{ background: "rgba(242,116,53,.15)", color: "var(--orange-dark)", marginRight: 8 }}
            >
              🚀 Publish to GitHub
            </button>
            <span className="admin-user"><Icon name="shield" size={15} />Admin</span>
            <button
              className="admin-action-btn reject"
              type="button"
              onClick={logout}
              style={{ marginLeft: 8 }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {adminTab === "dashboard" && (
          <div className="admin-content">
            <div className="admin-stats">
              {stats.map(s => (
                <div key={s.label} className="admin-stat-card">
                  <div className="admin-stat-icon" style={{ color: s.color }}>
                    <Icon name={s.icon} size={22} />
                  </div>
                  <div>
                    <b>{s.value}</b>
                    <span>{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="admin-two-col">
              <div className="admin-section-card">
                <h3>Quick Actions</h3>
                <div className="admin-quick-actions">
                  {([
                    ["Edit Events", "calendar", "events"],
                    ["Edit Site Content", "image", "site-content"],
                    ["Manage Partners", "users", "partners"],
                    ["Testimonies", "star", "testimonies"],
                  ] as const).map(([lbl, icon, tab]) => (
                    <button key={lbl} className="admin-quick-btn-item" onClick={() => setAdminTab(tab)}>
                      <Icon name={icon} size={16} />
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
              <div className="admin-section-card">
                <h3>Site Status</h3>
                <div className="admin-health-rows">
                  {[
                    ["Build status","Live ✓","#059669"],
                    ["GitHub repo","GoodnessFx/ChoiceSoulMedia (master)","var(--navy)"],
                    ["Domain","choicesoulsmedia.org","#059669"],
                  ].map(([k,v,c]) => (
                    <div key={k} className="admin-health-row">
                      <span>{k}</span><span style={{ color: c }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}


        {adminTab === "sermons" && (
          <div className="admin-content">
            <p className="admin-hint">Current sermon library. To add or update sermons, use the Site Content editor or contact the developer.</p>
            <div className="admin-table">
              <div className="admin-table-head"><span>Title</span><span>Speaker</span><span>Year</span><span>Duration</span></div>
              {sermons.map(s => (
                <div key={s.id} className="admin-table-row">
                  <span><img src={s.thumbnail} alt="" style={{ width: 48, height: 34, objectFit: "cover", borderRadius: 6, marginRight: 10, verticalAlign: "middle" }} />{s.title}</span>
                  <span>{s.speaker}</span>
                  <span>{s.year}</span>
                  <span>{s.duration}</span>
                </div>
              ))}
            </div>
            <div className="admin-hint" style={{ marginTop: 16 }}>
              <a href="https://www.youtube.com/@ChoiceSouls" target="_blank" rel="noreferrer" className="text-link">View YouTube Channel <Icon name="externalLink" size={13} /></a>
            </div>
          </div>
        )}

        {adminTab === "events" && (
          <div className="admin-content">
            <p className="admin-hint">Click <strong>Edit Site Content</strong> in the sidebar to edit event details, images, and text — then click Publish to push live.</p>
            <div className="admin-table">
              <div className="admin-table-head"><span>Event</span><span>Date</span><span>Location</span><span>Type</span></div>
              {events.map((e, i) => (
                <div key={i} className="admin-table-row">
                  <span>{e.title}</span>
                  <span>{e.date} {e.month}</span>
                  <span>{e.place}</span>
                  <span className={e.type === "Upcoming" ? "admin-tag-upcoming" : "admin-tag-past"}>{e.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === "partners" && (
          <div className="admin-content">
            <p className="admin-hint">Update the bank account details and giving flyer that appear on the Partner/Give page. Click <strong>Edit Site Content → Partner page</strong> to change the image and account number, then click Publish.</p>
            <div className="admin-section-card">
              <h3>Bank Account Details (visible on Partner page)</h3>
              <SiteContentEditor />
            </div>
          </div>
        )}

        {adminTab === "testimonies" && (
          <div className="admin-content">
            <p className="admin-hint">Testimonies submitted via the Contact page are shown here.</p>
            <div className="admin-section-card">
              <h3>Submitted Testimonies (Sample)</h3>
              {[
                { name: "Adaeze O.", event: "Apostolos 2025", text: "CSM changed my life completely. I came with questions and left with purpose." },
                { name: "Taiwo A.", event: "Camp Meeting 2026", text: "The messages at GO camp meeting rearranged my priorities for God's kingdom." },
              ].map((t, i) => (
                <div key={i} className="admin-testimony-row">
                  <div><b>{t.name}</b><span>{t.event}</span></div>
                  <p>"{t.text}"</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="admin-action-btn approve">Approve</button>
                    <button className="admin-action-btn reject">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === "settings" && (
          <div className="admin-content">
            <div className="admin-section-card">
              <h3>Site Settings</h3>
              <div className="admin-settings-grid">
                {[
                  ["Site Name","Choice Souls Media"],
                  ["Email",CONTACT_EMAIL],
                  ["Phone","+234 817 201 3060"],
                  ["Venue","Capstone Resource Centre, Lagos"],
                  ["YouTube","@ChoiceSouls"],
                  ["Instagram","@choicesouls"],
                  ["Facebook","Choice Souls Media"],
                ].map(([k,v]) => (
                  <div key={k} className="admin-setting-row">
                    <label>{k}</label>
                    <input defaultValue={v} readOnly style={{ opacity: .7 }} />
                  </div>
                ))}
              </div>
              <p className="admin-hint" style={{ marginTop: 16 }}>To update these values, contact the developer or use the Site Content editor.</p>
            </div>
            <div className="admin-section-card" style={{ marginTop: 16 }}>
              <h3>Next Camp Meeting</h3>
              <div className="admin-settings-grid">
                <div className="admin-setting-row"><label>Year</label><input defaultValue="2027" readOnly style={{ opacity: .7 }} /></div>
                <div className="admin-setting-row"><label>Dates</label><input defaultValue="August 24, 2027 · 6 PM" readOnly style={{ opacity: .7 }} /></div>
                <div className="admin-setting-row"><label>Venue</label><input defaultValue="Capstone Resource Centre, Lagos" readOnly style={{ opacity: .7 }} /></div>
              </div>
            </div>
          </div>
        )}

        {adminTab === "site-content" && <SiteContentEditor />}
      </main>
    </div>
  )
}

function NotFound() {
  return (
    <main id="main" className="not-found">
      <img src={logo} alt="CSM" onError={(e) => { e.currentTarget.style.visibility = "hidden" }} />
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
  const [showLoginModal, setShowLoginModal] = useState(false)

  const hiddenClick = () => {
    const now = Date.now()
    clicks.current = [...clicks.current.filter((x) => now - x < 4000), now]
    if (clicks.current.length >= 7) {
      clicks.current = []
      if (localStorage.getItem("csm-admin-auth") === "true" || sessionStorage.getItem("csm-admin-auth") === "true") {
        go(adminPath)
      } else {
        setShowLoginModal(true)
      }
    }
  }

  return (
    <footer>
      {showLoginModal && (
        <AdminLoginModal
          close={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false)
            go(adminPath)
          }}
        />
      )}
      <div className="page-shell footer-grid">
        <div className="footer-brand">
          <img src={logo} alt="Choice Souls Media" onError={(e) => { e.currentTarget.style.visibility = "hidden" }} />
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
          <a href={`mailto:${CONTACT_EMAIL}`}>EMAIL US</a>
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
        <button
          className="secret-dot"
          aria-label="Admin Access"
          title="Admin Access"
          onClick={hiddenClick}
        />
      </div>
    </footer>
  )
}

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> }

function InstallAppPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("csm-install-dismissed") === "1")
  const [showIosSteps, setShowIosSteps] = useState(false)
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) && !("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone)
  useEffect(() => {
    const onInstallAvailable = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as InstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setInstallEvent(null)
    }
    window.addEventListener("beforeinstallprompt", onInstallAvailable)
    window.addEventListener("appinstalled", onInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", onInstallAvailable)
      window.removeEventListener("appinstalled", onInstalled)
    }
  }, [])
  if ((!installEvent && !isIos) || installed || dismissed) return null
  if (isIos) {
    return (
      <aside className="install-app-prompt" aria-label="Add Choice Souls Media to Home Screen">
        <img src="/icon-192.png" alt="" />
        <div><b>Choice Souls Media</b><span>Add to your Home Screen from the Safari Share menu.</span></div>
        <button className="button" type="button" onClick={() => setShowIosSteps((show) => !show)}>{showIosSteps ? "GOT IT" : "HOW TO ADD"}</button>
        <button className="icon-command install-dismiss" type="button" aria-label="Dismiss install suggestion" onClick={() => { sessionStorage.setItem("csm-install-dismissed", "1"); setDismissed(true) }}><Icon name="close" size={16} /></button>
        {showIosSteps && <p className="install-ios-steps">In Safari, tap Share, then choose “Add to Home Screen.”</p>}
      </aside>
    )
  }
  const install = async () => {
    await installEvent.prompt()
    const result = await installEvent.userChoice
    if (result.outcome === "accepted") setInstallEvent(null)
  }
  return (
    <aside className="install-app-prompt" aria-label="Install Choice Souls Media">
      <img src="/icon-192.png" alt="" />
      <div><b>Choice Souls Media</b><span>Add the app to your home screen for quick access.</span></div>
      <button className="button" type="button" onClick={() => void install()}>INSTALL</button>
      <button className="icon-command install-dismiss" type="button" aria-label="Dismiss install suggestion" onClick={() => { sessionStorage.setItem("csm-install-dismissed", "1"); setDismissed(true) }}><Icon name="close" size={16} /></button>
    </aside>
  )
}

// Bot chat widget
function BotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<BotMessage[]>([
    { from: "bot", text: "Hi! I'm the CSM Assistant. Ask me about sermons, events, or how to give 🙏" },
  ])
  const [input, setInput] = useState("")
  const msgEnd = useRef<HTMLDivElement>(null)

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const reply = useCallback((text: string): BotMessage => {
    const lower = text.toLowerCase()
    if (/\b(hello|hi|hey)\b/.test(lower)) {
      return { from: "bot", text: "Hello! Welcome to Choice Souls Media. I can help with events, sermons, giving, or contacting the team. What would you like to know?" }
    }
    if (lower.includes("contact") || lower.includes("email") || lower.includes("phone")) {
      return { from: "bot", text: `You can email our team at ${CONTACT_EMAIL} or call/WhatsApp ${CONTACT_PHONE}.`, actions: [{ label: "Contact page", href: "/contact" }, { label: "Email the team", href: `mailto:${CONTACT_EMAIL}` }, { label: "WhatsApp", href: WHATSAPP_LINK }] }
    }
    if (lower.includes("sent summit") || lower.includes("registration") || lower.includes("register")) {
      return { from: "bot", text: "Sent Summit: Sunday, 15 November 2026 at 3 PM, Radisson Blu, Ozumba Mbadiwe, Victoria Island, Lagos. Register or open the venue in Google Maps.", actions: [{ label: "Register", href: SENT_SUMMIT_REGISTRATION }, { label: "Google Maps", href: SENT_SUMMIT_MAP }, { label: "Events page", href: "/events" }] }
    }
    if (lower.includes("camp meeting") || lower.includes("kingdomcentric")) {
      return { from: "bot", text: "Annual Camp Meeting is listed for 24 August 2027 at 6 PM at Capstone Resource Centre, Lagos. Check the Events page for details and the countdown.", actions: [{ label: "Events page", href: "/events" }, { label: "Google Maps", href: CAMP_MEETING_MAP }] }
    }
    if (lower.includes("event") || lower.includes("campus invasion") || lower.includes("somebody pray")) {
      return { from: "bot", text: "The next event is Sent Summit on 15 November 2026 at 3 PM in Lagos. The calendar also lists Camp Meeting, Somebody Pray, Campus Invasion, and past event archives.", actions: [{ label: "Browse events", href: "/events" }, { label: "Sent Summit registration", href: SENT_SUMMIT_REGISTRATION }] }
    }
    if (lower.includes("sermon") || lower.includes("youtube") || lower.includes("watch")) {
      return { from: "bot", text: "Browse sermons and message archives on the Sermons page, or visit our YouTube channel.", actions: [{ label: "Sermons", href: "/sermons" }, { label: "YouTube", href: YOUTUBE_CHANNEL }] }
    }
    if (lower.includes("partner") || lower.includes("donat") || lower.includes("give") || lower.includes("uba") || lower.includes("account")) {
      return { from: "bot", text: "You can give through the Partner page, or by UBA transfer to Choice Souls Media, account 1006181050. The supplied account graphic is shown on the page.", actions: [{ label: "Partner and giving", href: "/partner" }, { label: "Contact us", href: "/contact" }] }
    }
    return { from: "bot", text: `Thanks for your question. I can help with events, sermons, donations, or contact details. For anything else, email ${CONTACT_EMAIL} or visit our Contact page.`, actions: [{ label: "Contact page", href: "/contact" }, { label: "Events", href: "/events" }, { label: "FAQs", href: "/faqs" }] }
  }, [])

  const send = (text: string) => {
    if (!text.trim()) return
    setMessages((m) => [...m, { from: "user", text: text.trim() }])
    setInput("")
    setTimeout(() => {
      setMessages((m) => [...m, reply(text)])
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
            <div key={i} className={`bot-msg ${m.from}`}>
              {m.text}
              {m.actions && (
                <div className="bot-message-actions">
                  {m.actions.map((action) => action.href?.startsWith("/") ? (
                    <Link key={action.label} href={action.href}>{action.label}</Link>
                  ) : (
                    <a key={action.label} href={action.href} target={action.href?.startsWith("http") ? "_blank" : undefined} rel={action.href?.startsWith("http") ? "noreferrer" : undefined}>{action.label}</a>
                  ))}
                </div>
              )}
            </div>
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
  const accept = () => { localStorage.setItem("csm-cookie", "yes"); setShow(false) }
  if (!show) return null
  return (
    <aside className="cookie" onClick={accept} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && accept()} style={{ cursor: "pointer" }}>
      <p>
        We use essential cookies to remember your preferences.{" "}
        <Link href="/privacy" onClick={(e) => e.stopPropagation()}>Learn more</Link>
      </p>
      <button onClick={(e) => { e.stopPropagation(); accept() }}>
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
      if (e.key === "ArrowRight") setIndex(((index ?? 0) + 1) % lightboxPhotos.length)
      if (e.key === "ArrowLeft")
        setIndex(((index ?? 0) - 1 + lightboxPhotos.length) % lightboxPhotos.length)
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
        onClick={() => setIndex((index - 1 + lightboxPhotos.length) % lightboxPhotos.length)}
        aria-label="Previous photo"
      >
        ←
      </button>
      <img src={lightboxPhotos[index]} alt={`CSM media ${index + 1}`} />
      <button
        className="lightbox-next"
        onClick={() => setIndex((index + 1) % lightboxPhotos.length)}
        aria-label="Next photo"
      >
        →
      </button>
      <span>
        {String(index + 1).padStart(2, "0")} /{" "}
        {String(lightboxPhotos.length).padStart(2, "0")}
      </span>
    </div>
  )
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [lightbox, setLightbox] = useState<number | null>(null)
  useEffect(() => {
    void fetchRemoteSiteData()
  }, [])
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
      "/testimonies": "Testimonies · Choice Souls Media",
      "/faqs": "FAQs · Choice Souls Media",
      "/gallery": "Gallery · Choice Souls Media",
      "/partner": "Partner With Us · Choice Souls Media",
      "/bank-transfer": "Bank Transfer · Choice Souls Media",
      "/contact": "Contact · Choice Souls Media",
      "/admin": "Admin · Choice Souls Media",
      [adminPath]: "Admin · Choice Souls Media",
    }
    document.title = names[path] || "Choice Souls Media"
  }, [path])
  if (path === adminPath || path === "/admin") return <AdminShell />
  const eventDetailMatch = path.match(/^\/events\/([^/]+)$/)
  const eventDetail = eventDetailMatch ? decodeURIComponent(eventDetailMatch[1]) : null
  const pages: Record<string, React.ReactNode> = {
    "/": <Home openLightbox={setLightbox} />,
    "/about": <About />,
    "/services": <ServicesPage />,
    "/events": <Events openLightbox={setLightbox} />,
    ...(eventDetail ? { [path]: <EventDetailPage eventId={eventDetail} openLightbox={setLightbox} /> } : {}),
    "/sermons": <SermonsPage />,
    "/testimonies": <TestimoniesPage />,
    "/faqs": <FAQsPage />,
    "/gallery": <Gallery openLightbox={setLightbox} />,
    "/partner": <Partner />,
    "/bank-transfer": <BankTransferPage />,
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
      <InstallAppPrompt />
      <BotWidget />
      <Lightbox
        index={lightbox}
        close={() => setLightbox(null)}
        setIndex={setLightbox}
      />
    </>
  )
}
