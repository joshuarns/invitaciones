import { useEffect, useState } from 'react'
import { getTemplate } from '../data/templates.js'
import { downloadIcs, eventDate, formatLongDate, formatShortDate, formatTime, googleCalendarUrl } from '../lib/dates.js'

export function themeVars(theme) {
  return {
    '--bg': theme.bg,
    '--surface': theme.surface,
    '--text': theme.text,
    '--muted': theme.muted,
    '--accent': theme.accent,
    '--accent2': theme.accent2,
    '--on-accent': theme.onAccent,
    '--f-display': theme.display,
    '--f-heading': theme.heading,
    '--f-body': theme.body,
    '--pattern': theme.pattern,
  }
}

function Countdown({ target }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, target - now)
  const parts = [
    ['Días', Math.floor(diff / 86400000)],
    ['Horas', Math.floor(diff / 3600000) % 24],
    ['Min', Math.floor(diff / 60000) % 60],
    ['Seg', Math.floor(diff / 1000) % 60],
  ]
  if (diff === 0) return <p className="inv-lead">¡Hoy es el gran día!</p>
  return (
    <div className="inv-countdown">
      {parts.map(([label, value]) => (
        <div key={label}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

function Rsvp({ inv }) {
  const [name, setName] = useState('')
  const [guests, setGuests] = useState(1)
  const [attending, setAttending] = useState(true)
  const phone = (inv.rsvpPhone || '').replace(/\D/g, '')

  function submit(e) {
    e.preventDefault()
    const text = attending
      ? `¡Hola! Soy ${name.trim()} y confirmo mi asistencia a "${inv.eyebrow} · ${inv.names}". Asistiremos ${guests} persona${guests > 1 ? 's' : ''}. 🎉`
      : `¡Hola! Soy ${name.trim()}. Lamentablemente no podré asistir a "${inv.eyebrow} · ${inv.names}". ¡Muchas felicidades!`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  return (
    <form className="inv-rsvp" onSubmit={submit}>
      <input required placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="inv-toggle">
        <button type="button" className={attending ? 'on' : ''} onClick={() => setAttending(true)}>Sí asistiré</button>
        <button type="button" className={!attending ? 'on' : ''} onClick={() => setAttending(false)}>No podré ir</button>
      </div>
      {attending && (
        <label className="inv-guests">
          Número de personas
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n}>{n}</option>)}
          </select>
        </label>
      )}
      <button className="inv-btn" disabled={!phone}>Confirmar por WhatsApp</button>
      {!phone && <small className="inv-muted">Agrega un número de WhatsApp en el editor para activar la confirmación.</small>}
    </form>
  )
}

export default function Invitation({ inv }) {
  const tpl = getTemplate(inv.t)
  const { theme } = tpl
  const date = eventDate(inv)
  const place = inv.mapQuery || [inv.venue, inv.address].filter(Boolean).join(', ')
  const show = inv.show ?? {}

  return (
    <article className="inv" style={themeVars(theme)}>
      <header className="inv-hero">
        <div className="inv-ornament">{theme.ornament}</div>
        <p className="inv-eyebrow">{inv.eyebrow}</p>
        <h1 className="inv-names">{inv.names}</h1>
        {date && <p className="inv-date">{formatShortDate(date)}</p>}
        {inv.photo && <img className="inv-photo" src={inv.photo} alt="" />}
      </header>

      {inv.message && (
        <section className="inv-section">
          <p className="inv-lead">{inv.message}</p>
        </section>
      )}

      {show.countdown && date && (
        <section className="inv-section">
          <h2>Faltan</h2>
          <Countdown target={date.getTime()} />
        </section>
      )}

      <section className="inv-section inv-card">
        <h2>Cuándo y dónde</h2>
        {date && (
          <p className="inv-detail">
            <span>📅</span> {formatLongDate(date)}<br />
            <span>🕒</span> {formatTime(date)}
          </p>
        )}
        {inv.venue && <p className="inv-venue">{inv.venue}</p>}
        {inv.address && <p className="inv-muted">{inv.address}</p>}
        {show.map && place && (
          <>
            <iframe
              className="inv-map"
              title="Mapa"
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(place)}&z=15&output=embed`}
            />
            <a className="inv-btn" target="_blank" rel="noopener" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`}>
              📍 Cómo llegar
            </a>
          </>
        )}
      </section>

      {inv.dressCode && (
        <section className="inv-section">
          <h2>Código de vestimenta</h2>
          <p className="inv-lead">{inv.dressCode}</p>
        </section>
      )}

      {inv.gifts && (
        <section className="inv-section">
          <h2>Regalos</h2>
          <p className="inv-lead">{inv.gifts}</p>
        </section>
      )}

      {show.rsvp && (
        <section className="inv-section inv-card">
          <h2>Confirma tu asistencia</h2>
          {inv.rsvpDeadline && <p className="inv-muted">Antes del {formatLongDate(new Date(inv.rsvpDeadline + 'T12:00'))}</p>}
          <Rsvp inv={inv} />
        </section>
      )}

      {show.calendar && date && (
        <section className="inv-section">
          <h2>Guarda la fecha</h2>
          <div className="inv-row">
            <a className="inv-btn ghost" target="_blank" rel="noopener" href={googleCalendarUrl(inv)}>Google Calendar</a>
            <button type="button" className="inv-btn ghost" onClick={() => downloadIcs(inv)}>Apple / Outlook</button>
          </div>
        </section>
      )}

      <footer className="inv-footer">
        <div className="inv-ornament small">{theme.ornament}</div>
        <p>¡Te esperamos!</p>
      </footer>
    </article>
  )
}
