export function eventDate(inv) {
  if (!inv.date) return null
  const [y, m, d] = inv.date.split('-').map(Number)
  const [hh, mm] = (inv.time || '00:00').split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm)
}

export function formatLongDate(date) {
  if (!date) return ''
  const s = date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function formatTime(date) {
  if (!date) return ''
  return date.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function formatShortDate(date) {
  if (!date) return ''
  return date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }).replaceAll('/', ' · ')
}

const pad = (n) => String(n).padStart(2, '0')
const stamp = (d) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`

function range(inv) {
  const start = eventDate(inv)
  const end = new Date(start.getTime() + 5 * 60 * 60 * 1000)
  return [start, end]
}

const eventTitle = (inv) => `${inv.eyebrow} · ${inv.names}`.trim()

export function googleCalendarUrl(inv) {
  const [start, end] = range(inv)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle(inv),
    dates: `${stamp(start)}/${stamp(end)}`,
    details: inv.message || '',
    location: [inv.venue, inv.address].filter(Boolean).join(', '),
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

export function downloadIcs(inv) {
  const [start, end] = range(inv)
  const esc = (s = '') => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitaciones//ES', 'BEGIN:VEVENT',
    `UID:${Date.now()}@invitaciones`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(eventTitle(inv))}`,
    `DESCRIPTION:${esc(inv.message)}`,
    `LOCATION:${esc([inv.venue, inv.address].filter(Boolean).join(', '))}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'evento.ics'
  a.click()
  URL.revokeObjectURL(url)
}
