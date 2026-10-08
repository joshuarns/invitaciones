import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Invitation from '../components/Invitation.jsx'
import { TEMPLATES, blankInvitation, getTemplate } from '../data/templates.js'
import { clearDraft, loadDraft, saveDraft, shareUrl } from '../lib/share.js'

function Field({ label, hint, ...props }) {
  const Tag = props.rows ? 'textarea' : 'input'
  return (
    <label className="ed-field">
      <span>{label}</span>
      <Tag {...props} />
      {hint && <small>{hint}</small>}
    </label>
  )
}

const TOGGLES = [
  ['countdown', 'Cuenta regresiva'],
  ['map', 'Mapa'],
  ['rsvp', 'Confirmación'],
  ['calendar', 'Agregar al calendario'],
]

export default function Editor() {
  const { templateId } = useParams()
  const tpl = getTemplate(templateId)
  const [inv, setInv] = useState(() => loadDraft(tpl.id) ?? blankInvitation(tpl.id))
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState('editar')

  useEffect(() => {
    setInv(loadDraft(tpl.id) ?? blankInvitation(tpl.id))
  }, [tpl.id])

  useEffect(() => saveDraft(inv), [inv])

  const url = useMemo(() => shareUrl(inv), [inv])
  const set = (key) => (e) => setInv((p) => ({ ...p, [key]: e.target.value }))
  const toggle = (key) => setInv((p) => ({ ...p, show: { ...p.show, [key]: !p.show?.[key] } }))

  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  function reset() {
    if (!confirm('¿Restablecer los textos de la plantilla? Se perderán tus cambios.')) return
    clearDraft(tpl.id)
    setInv(blankInvitation(tpl.id))
  }

  const sameEvent = TEMPLATES.filter((t) => t.event === tpl.event)
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${inv.eyebrow} · ${inv.names}\n${url}`)}`

  return (
    <div className="ed" data-tab={tab}>
      <header className="ed-bar">
        <Link to="/" className="ed-back">← Plantillas</Link>
        <strong>{tpl.name}</strong>
        <div className="ed-tabs">
          <button className={tab === 'editar' ? 'on' : ''} onClick={() => setTab('editar')}>Editar</button>
          <button className={tab === 'vista' ? 'on' : ''} onClick={() => setTab('vista')}>Vista previa</button>
        </div>
      </header>

      <div className="ed-body">
        <form className="ed-form" onSubmit={(e) => e.preventDefault()}>
          {sameEvent.length > 1 && (
            <div className="ed-group">
              <h3>Diseño</h3>
              <div className="ed-swatches">
                {sameEvent.map((t) => (
                  <Link
                    key={t.id}
                    to={`/editar/${t.id}`}
                    className={t.id === tpl.id ? 'on' : ''}
                    style={{ background: t.theme.bg, color: t.theme.accent }}
                  >
                    {t.theme.ornament} {t.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="ed-group">
            <h3>Portada</h3>
            <Field label="Encabezado" value={inv.eyebrow} onChange={set('eyebrow')} />
            <Field label="Nombre(s)" value={inv.names} onChange={set('names')} />
            <Field label="Mensaje" rows={4} value={inv.message} onChange={set('message')} />
            <Field label="Foto (URL, opcional)" placeholder="https://…" value={inv.photo} onChange={set('photo')} />
          </div>

          <div className="ed-group">
            <h3>Fecha y lugar</h3>
            <div className="ed-row">
              <Field label="Fecha" type="date" value={inv.date} onChange={set('date')} />
              <Field label="Hora" type="time" value={inv.time} onChange={set('time')} />
            </div>
            <Field label="Lugar" value={inv.venue} onChange={set('venue')} />
            <Field label="Dirección" value={inv.address} onChange={set('address')} />
            <Field
              label="Búsqueda en el mapa (opcional)"
              hint="Si el mapa no encuentra la dirección, pega aquí el nombre exacto de Google Maps o coordenadas."
              placeholder="19.4326, -99.1332"
              value={inv.mapQuery}
              onChange={set('mapQuery')}
            />
          </div>

          <div className="ed-group">
            <h3>Detalles</h3>
            <Field label="Código de vestimenta" value={inv.dressCode} onChange={set('dressCode')} />
            <Field label="Regalos" value={inv.gifts} onChange={set('gifts')} />
            <Field
              label="Música (URL de un .mp3, opcional)"
              hint="Suena cuando el invitado abre la invitación."
              placeholder="https://…/cancion.mp3"
              value={inv.music}
              onChange={set('music')}
            />
          </div>

          <div className="ed-group">
            <h3>Confirmación</h3>
            <Field
              label="WhatsApp para confirmar"
              hint="Con lada de país, ej. 52 55 1234 5678"
              type="tel"
              value={inv.rsvpPhone}
              onChange={set('rsvpPhone')}
            />
            <Field label="Confirmar antes del" type="date" value={inv.rsvpDeadline} onChange={set('rsvpDeadline')} />
          </div>

          <div className="ed-group">
            <h3>Secciones</h3>
            <div className="ed-checks">
              {TOGGLES.map(([key, label]) => (
                <label key={key}>
                  <input type="checkbox" checked={!!inv.show?.[key]} onChange={() => toggle(key)} /> {label}
                </label>
              ))}
            </div>
          </div>

          <button type="button" className="ed-reset" onClick={reset}>Restablecer plantilla</button>
        </form>

        <aside className="ed-preview">
          <div className="phone">
            <div className="phone-screen">
              <Invitation inv={inv} />
            </div>
          </div>
          <div className="ed-share">
            <a className="ed-primary" href={url} target="_blank" rel="noopener">Abrir invitación</a>
            <button type="button" onClick={copy}>{copied ? '¡Link copiado!' : 'Copiar link'}</button>
            <a href={whatsapp} target="_blank" rel="noopener">Enviar por WhatsApp</a>
          </div>
        </aside>
      </div>
    </div>
  )
}
