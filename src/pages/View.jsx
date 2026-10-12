import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Invitation, { SCENES, themeVars } from '../components/Invitation.jsx'
import { getTemplate } from '../data/templates.js'
import { decodeInvitation } from '../lib/share.js'

export default function View() {
  const [params] = useSearchParams()
  const inv = decodeInvitation(params.get('d') || '')
  const [opened, setOpened] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audio = useRef(null)

  useEffect(() => {
    if (inv) document.title = `${inv.eyebrow} · ${inv.names}`
  }, [inv?.eyebrow, inv?.names])

  if (!inv) {
    return (
      <div className="site site-empty">
        <h1>Invitación no encontrada</h1>
        <p>El link está incompleto o dañado. Pídele a quien te lo envió que lo comparta de nuevo.</p>
        <Link className="site-cta" to="/">Crear una invitación</Link>
      </div>
    )
  }

  const { theme } = getTemplate(inv.t)
  const Scene = SCENES[theme.scene]

  function open() {
    setOpened(true)
    if (audio.current) audio.current.play().then(() => setPlaying(true)).catch(() => {})
  }

  function toggleMusic() {
    const a = audio.current
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {})
    else { a.pause(); setPlaying(false) }
  }

  return (
    <div className="view" style={{ background: theme.bg }}>
      {inv.music && <audio ref={audio} src={inv.music} loop preload="auto" />}

      {!opened && (
        <button className={`envelope inv${Scene ? ` has-scene scene-${theme.scene}` : ''}`} style={themeVars(theme)} onClick={open}>
          {Scene && <Scene />}
          <div className="inv-ornament">{theme.ornament}</div>
          <p className="inv-eyebrow">{inv.eyebrow}</p>
          <p className="inv-names">{inv.names}</p>
          <span className="envelope-cta">Toca para abrir</span>
        </button>
      )}

      <div className={`view-inner ${opened ? 'is-open' : ''}`}>
        <Invitation inv={inv} />
      </div>

      {inv.music && opened && (
        <button className="music-btn" style={{ background: theme.accent, color: theme.onAccent }} onClick={toggleMusic} aria-label="Música">
          {playing ? '❚❚' : '♪'}
        </button>
      )}
    </div>
  )
}
