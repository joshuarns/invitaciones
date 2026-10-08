import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EVENTS, TEMPLATES } from '../data/templates.js'
import { themeVars } from '../components/Invitation.jsx'

const FEATURES = [
  ['✅', 'Confirmación por WhatsApp', 'Tus invitados confirman con un toque y te llega el mensaje listo.'],
  ['📍', 'Mapa de ubicación', 'Mapa integrado y botón “Cómo llegar”.'],
  ['⏳', 'Cuenta regresiva', 'Días, horas y minutos para el gran día.'],
  ['📅', 'Agregar al calendario', 'Google Calendar, Apple y Outlook.'],
  ['🎵', 'Música de fondo', 'Pon la canción que quieras al abrir la invitación.'],
  ['🔗', 'Un solo link', 'Compártelo por WhatsApp, Instagram o donde quieras.'],
]

export default function Gallery() {
  const [filter, setFilter] = useState('all')
  const list = filter === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.event === filter)

  return (
    <div className="site">
      <header className="site-hero">
        <span className="site-badge">💌 Invitaciones interactivas</span>
        <h1>Crea tu invitación digital en minutos</h1>
        <p>Elige una plantilla, escribe tus datos y comparte un link con confirmación de asistencia, mapa y cuenta regresiva. Sin descargar nada.</p>
        <a className="site-cta" href="#plantillas">Elegir plantilla</a>
      </header>

      <section className="site-features">
        {FEATURES.map(([icon, title, text]) => (
          <div key={title} className="site-feature">
            <span>{icon}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </section>

      <section id="plantillas" className="site-templates">
        <h2>Plantillas</h2>
        <div className="site-chips">
          <button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>Todas</button>
          {EVENTS.map((e) => (
            <button key={e.id} className={filter === e.id ? 'on' : ''} onClick={() => setFilter(e.id)}>
              {e.icon} {e.label}
            </button>
          ))}
        </div>
        <div className="site-grid">
          {list.map((t) => (
            <Link key={t.id} to={`/editar/${t.id}`} className="tpl-card">
              <div className="tpl-cover inv" style={themeVars(t.theme)}>
                <div className="inv-ornament">{t.theme.ornament}</div>
                <p className="inv-eyebrow">{t.defaults.eyebrow}</p>
                <p className="inv-names">{t.defaults.names}</p>
              </div>
              <div className="tpl-meta">
                <strong>{t.name}</strong>
                <span>{EVENTS.find((e) => e.id === t.event)?.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="site-footer">Hecho con 💌 · Invitaciones Interactivas</footer>
    </div>
  )
}
