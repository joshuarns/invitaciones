import { useEffect, useRef, useState } from 'react'
import Confetti from './Confetti.jsx'
import { chime, pop, voice } from '../lib/sfx.js'

// Fondo ilustrado de granja para la portada. Capas:
// - cielo: degradado, sol con rayos y nubes esponjosas,
// - colinas: SVG estirado a todo el ancho (solo son colores, no se deforman a la vista),
// - escenario: árbol, granero, cerca y animales en una caja centrada de alto --ground.
//   Todo dentro va en porcentajes de esa caja, así los animales se ven completos
//   en un teléfono, en la vista previa del editor y en las tarjetas de la galería.
//
// Los animales son los emojis 3D de Microsoft Fluent (MIT, ver public/farm/LICENSE.txt).
//
// Con `interactive`, los animales hablan al tocarlos, el granero se abre, el sol gira y
// suben globos que se pueden reventar. Al saludar a todos los animales sale confeti.

const S = (from, to, dur, type, vibrato) => ({ from, to, dur, type, vibrato })

// x: centro (% del ancho), y: suelo bajo las patas (% del alto), w: ancho (% del ancho)
const ANIMALS = [
  { img: 'cow', name: 'Vaca', x: 19, y: 39, w: 25, says: '¡Muuu!', sound: [S(160, 110, 0.9, 'sawtooth')] },
  { img: 'ewe', name: 'Borrego', x: 67, y: 36, w: 21, says: '¡Beee!', sound: [S(420, 380, 0.6, 'sawtooth', 30)] },
  { img: 'pig', name: 'Cerdito', x: 43, y: 28, w: 21, says: '¡Oink!', sound: [S(320, 220, 0.18, 'square'), S(300, 200, 0.18, 'square')] },
  { img: 'goat', name: 'Cabra', x: 14, y: 12, w: 21, says: '¡Meee!', sound: [S(500, 460, 0.5, 'sawtooth', 45)] },
  { img: 'chicken', name: 'Gallina', x: 79, y: 12, w: 17, says: '¡Cocoró!', sound: [S(600, 500, 0.12, 'square'), S(600, 500, 0.12, 'square'), S(700, 900, 0.3, 'square')] },
  { img: 'hatching_chick', name: 'Pollito', x: 54, y: 7, w: 15, says: '¡Pío pío!', sound: [S(1800, 2400, 0.1, 'sine'), S(1800, 2400, 0.1, 'sine')] },
  { img: 'duck', name: 'Pato', x: 93, y: 6, w: 15, says: '¡Cuac!', sound: [S(500, 300, 0.2, 'sawtooth'), S(500, 300, 0.2, 'sawtooth')] },
]

const BALLOONS = [
  { left: 8, color: '#ff3b47', dur: 11, delay: 0 },
  { left: 26, color: '#ffc928', dur: 13, delay: 4 },
  { left: 72, color: '#2f7bf5', dur: 12, delay: 2 },
  { left: 88, color: '#58c93a', dur: 14, delay: 6 },
  { left: 50, color: '#ff7eb6', dur: 15, delay: 9 },
]

// Nubes del cielo: posición en % de la portada
const CLOUDS = [
  { left: -10, top: 3, w: 38 },
  { left: 76, top: 22, w: 30, slow: true },
  { left: -12, top: 36, w: 24, slow: true },
  { left: 82, top: 46, w: 24 },
]

const TUFTS = [[6, 30], [31, 20], [50, 26], [88, 30], [70, 3], [28, 2], [97, 18]]

function playSound(parts) {
  let at = 0
  for (const p of parts) {
    voice({ ...p, delay: at })
    at += p.dur * 0.9
  }
}

function Cloud({ style, className }) {
  return (
    <svg className={className} style={style} viewBox="0 0 200 90" aria-hidden="true">
      <g fill="#dceefe">
        <circle cx="52" cy="56" r="30" /><circle cx="96" cy="44" r="40" /><circle cx="146" cy="54" r="32" />
        <rect x="22" y="56" width="156" height="30" rx="15" />
      </g>
      <g fill="#fff">
        <circle cx="52" cy="52" r="28" /><circle cx="96" cy="40" r="37" /><circle cx="146" cy="50" r="29" />
        <rect x="24" y="52" width="152" height="28" rx="14" />
      </g>
    </svg>
  )
}

function Sun({ face }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <g className="farm-rays" stroke="#ffd43b" strokeWidth="9" strokeLinecap="round">
        {Array.from({ length: 10 }, (_, k) => (
          <line key={k} x1="100" y1="22" x2="100" y2="4" transform={`rotate(${k * 36} 100 100)`} />
        ))}
      </g>
      <circle cx="100" cy="100" r="58" fill="#ffd43b" />
      <circle cx="100" cy="100" r="58" fill="url(#sun-shine)" />
      <defs>
        <radialGradient id="sun-shine" cx=".38" cy=".35" r=".7">
          <stop offset="0" stopColor="#fff6b0" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffc21a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {face && (
        <g fill="none" stroke="#7a4b00" strokeWidth="6" strokeLinecap="round">
          <path d="M76 94 q8 -8 16 0" /><path d="M108 94 q8 -8 16 0" /><path d="M80 116 q20 18 40 0" />
        </g>
      )}
    </svg>
  )
}

function Tree() {
  return (
    <svg viewBox="0 0 120 150" aria-hidden="true">
      <path d="M54 150 L56 92 Q50 80 40 74 L46 70 Q56 76 60 84 Q66 72 78 68 L80 74 Q68 80 66 92 L68 150Z" fill="#8a5a2f" />
      <g fill="#3f9f3c">
        <circle cx="36" cy="60" r="30" /><circle cx="84" cy="58" r="32" /><circle cx="60" cy="34" r="32" /><circle cx="60" cy="80" r="26" />
      </g>
      <g fill="#5cc04f">
        <circle cx="38" cy="54" r="24" /><circle cx="80" cy="52" r="26" /><circle cx="58" cy="30" r="26" />
      </g>
      <g fill="#ff4a3d">
        <circle cx="30" cy="66" r="6" /><circle cx="70" cy="24" r="6" /><circle cx="90" cy="70" r="6" /><circle cx="50" cy="52" r="6" /><circle cx="22" cy="44" r="5" />
      </g>
      <g fill="#fff" opacity=".6">
        <circle cx="28" cy="64" r="2" /><circle cx="68" cy="22" r="2" /><circle cx="88" cy="68" r="2" /><circle cx="48" cy="50" r="2" />
      </g>
    </svg>
  )
}

function Bushes() {
  return (
    <svg viewBox="0 0 160 70" aria-hidden="true">
      <g fill="#2f8a33">
        <circle cx="26" cy="46" r="24" /><circle cx="62" cy="34" r="30" /><circle cx="104" cy="40" r="28" /><circle cx="140" cy="48" r="22" />
        <rect x="10" y="46" width="146" height="24" />
      </g>
      <g fill="#46a944">
        <circle cx="30" cy="42" r="16" /><circle cx="62" cy="28" r="20" /><circle cx="104" cy="34" r="18" />
      </g>
    </svg>
  )
}

function Barn({ open }) {
  return (
    <svg viewBox="0 0 140 120" aria-hidden="true">
      {/* cuerpo */}
      <path d="M8 52 L70 10 L132 52 V120 H8Z" fill="#d93a33" />
      <path d="M8 52 L70 10 L70 120 H8Z" fill="#e8483f" />
      {/* techo con ribete blanco */}
      <path d="M0 56 L70 6 L140 56" fill="none" stroke="#fff" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
      {/* ventana */}
      <rect x="56" y="34" width="28" height="24" fill="#fff" rx="2" />
      <rect x="62" y="39" width="16" height="14" fill="#b52a25" />
      {/* puertas: al abrirlas aparece una sorpresa */}
      <rect x="40" y="70" width="60" height="50" fill="#5a1d1a" />
      <text x="70" y="114" fontSize="32" textAnchor="middle" className={open ? 'farm-surprise up' : 'farm-surprise'}>🎁</text>
      <g className={open ? 'farm-door open' : 'farm-door'}>
        <rect x="40" y="70" width="30" height="50" fill="#c8322c" stroke="#fff" strokeWidth="4" />
        <path d="M40 70 L70 120 M70 70 L40 120" stroke="#fff" strokeWidth="4" />
      </g>
      <g className={open ? 'farm-door right open' : 'farm-door right'}>
        <rect x="70" y="70" width="30" height="50" fill="#c8322c" stroke="#fff" strokeWidth="4" />
        <path d="M70 70 L100 120 M100 70 L70 120" stroke="#fff" strokeWidth="4" />
      </g>
      <rect x="36" y="66" width="68" height="6" fill="#fff" rx="2" />
    </svg>
  )
}

function Fence() {
  const posts = [4, 18, 32, 46, 60, 74, 88, 102, 116, 130, 144, 158, 172, 186, 200]
  return (
    <svg viewBox="0 0 204 40" preserveAspectRatio="none" aria-hidden="true">
      <g fill="#b9773d">
        <rect x="0" y="8" width="204" height="6" rx="2" />
        <rect x="0" y="22" width="204" height="6" rx="2" />
      </g>
      <g fill="#a2622c">
        {posts.map((x) => <rect key={x} x={x - 3} y="2" width="6" height="38" rx="2" />)}
      </g>
    </svg>
  )
}

function Tuft() {
  return (
    <svg viewBox="0 0 24 14" aria-hidden="true">
      <path d="M2 14 Q3 6 0 2 Q6 6 7 14 Q8 4 12 0 Q12 8 13 14 Q15 6 20 3 Q17 9 18 14Z" fill="#3c9e33" />
    </svg>
  )
}

export default function FarmScene({ interactive = false }) {
  const [talking, setTalking] = useState({}) // índice → contador (reinicia la animación)
  const [greeted, setGreeted] = useState(() => new Set())
  const [barnOpen, setBarnOpen] = useState(false)
  const [sunSpin, setSunSpin] = useState(0)
  const [popped, setPopped] = useState(0)
  const [respawn, setRespawn] = useState(() => BALLOONS.map(() => 0))
  const [bursts, setBursts] = useState([])
  const [confetti, setConfetti] = useState(0)
  const timers = useRef(new Set())
  const talkTimers = useRef({})
  const root = useRef(null)

  useEffect(() => () => {
    timers.current.forEach(clearTimeout)
    Object.values(talkTimers.current).forEach(clearTimeout)
  }, [])

  function later(fn, ms) {
    const id = setTimeout(() => {
      timers.current.delete(id)
      fn()
    }, ms)
    timers.current.add(id)
  }

  const total = ANIMALS.length
  const allGreeted = greeted.size === total
  // Fuera del modo interactivo (sobre, galería) no hay botones: el sobre ya es un <button>.
  const Tap = interactive ? 'button' : 'span'
  const tapProps = (label, onClick) => (interactive ? { type: 'button', 'aria-label': label, onClick } : {})

  function tapAnimal(i) {
    playSound(ANIMALS[i].sound)
    setTalking((t) => ({ ...t, [i]: (t[i] ?? 0) + 1 }))
    clearTimeout(talkTimers.current[i])
    talkTimers.current[i] = setTimeout(() => setTalking(({ [i]: _, ...rest }) => rest), 1600)
    if (greeted.has(i)) return
    const next = new Set(greeted).add(i)
    setGreeted(next)
    if (next.size === total) {
      setConfetti((c) => c + 1)
      later(chime, 150)
    }
  }

  function tapBarn() {
    setBarnOpen(!barnOpen)
    if (!barnOpen) {
      chime()
      setConfetti((c) => c + 1)
    } else {
      voice({ from: 200, to: 120, dur: 0.2, type: 'triangle' })
    }
  }

  function tapSun() {
    setSunSpin((s) => s + 1)
    voice({ from: 600, to: 1200, dur: 0.4, type: 'sine', gain: 0.12 })
  }

  function popBalloon(i, e) {
    pop()
    const box = root.current.getBoundingClientRect()
    const b = e.currentTarget.getBoundingClientRect()
    const id = `${Date.now()}-${i}`
    setBursts((list) => [...list, { id, x: b.left + b.width / 2 - box.left, y: b.top + b.height / 3 - box.top, color: BALLOONS[i].color }])
    later(() => setBursts((list) => list.filter((p) => p.id !== id)), 700)
    setPopped((n) => n + 1)
    setRespawn((r) => r.map((v, j) => (j === i ? v + 1 : v)))
  }

  return (
    <div ref={root} className={`farm${interactive ? ' is-interactive' : ''}`} aria-hidden={!interactive}>
      <div className="farm-sky">
        {CLOUDS.map((c, i) => (
          <Cloud
            key={i}
            className={c.slow ? 'farm-cloud slow' : 'farm-cloud'}
            style={{ left: `${c.left}%`, top: `${c.top}%`, width: `${c.w}%` }}
          />
        ))}
        <Tap className="farm-sun farm-tap" {...tapProps('Sol', tapSun)}>
          <span key={sunSpin} className={sunSpin ? 'farm-sun-body spin' : 'farm-sun-body'}>
            <Sun face={sunSpin > 0} />
          </span>
        </Tap>
      </div>

      <div className="farm-ground">
        <svg className="farm-hills" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 26 Q22 4 48 20 T100 10 V100 H0Z" fill="#bfe98a" />
          <path d="M0 34 Q30 18 62 30 T100 26 V100 H0Z" fill="#9edb63" />
          <path d="M0 50 Q28 42 56 50 T100 46 V100 H0Z" fill="#84d04f" />
          <path d="M0 66 Q50 58 100 66 V100 H0Z" fill="#74c84a" />
          <path d="M0 88 Q50 82 100 88 V100 H0Z" fill="#69b84c" />
        </svg>

        <div className="farm-stage">
          <span className="farm-prop" style={{ left: '-7%', bottom: '52%', width: '30%' }}><Tree /></span>
          <span className="farm-prop" style={{ left: '56%', bottom: '50%', width: '22%' }}><Bushes /></span>
          <span className="farm-prop" style={{ left: '92%', bottom: '48%', width: '22%' }}><Bushes /></span>
          <Tap
            className="farm-prop farm-barn farm-tap"
            style={{ left: '64%', bottom: '45%', width: '40%' }}
            {...tapProps('Granero', tapBarn)}
          >
            <Barn open={barnOpen} />
            {barnOpen && <span className="farm-bubble">¡Sorpresa!</span>}
          </Tap>
          <span className="farm-prop farm-fence" style={{ left: '-30%', bottom: '40%', width: '100%' }}><Fence /></span>
          {TUFTS.map(([x, y]) => (
            <span key={`${x}-${y}`} className="farm-prop" style={{ left: `${x}%`, bottom: `${y}%`, width: '6%' }}><Tuft /></span>
          ))}

          {ANIMALS.map((a, i) => (
            <Tap
              key={i}
              className="farm-animal farm-tap"
              style={{ left: `${a.x}%`, bottom: `${a.y}%`, width: `${a.w}%` }}
              {...tapProps(a.name, () => tapAnimal(i))}
            >
              <img
                key={talking[i] ?? 0}
                className={talking[i] ? 'jump' : ''}
                style={{ animationDelay: talking[i] ? '0s' : `${(i % 4) * 0.5}s` }}
                src={`/farm/${a.img}.png`}
                alt=""
                draggable={false}
              />
              {talking[i] && <span className="farm-bubble">{a.says}</span>}
            </Tap>
          ))}
        </div>
      </div>

      {interactive && (
        <div className="farm-balloons">
          {BALLOONS.map((b, i) => (
            <button
              key={`${i}-${respawn[i]}`}
              type="button"
              className="farm-balloon"
              style={{
                left: `${b.left}%`,
                '--c': b.color,
                animationDuration: `${b.dur}s`,
                animationDelay: `${respawn[i] ? 1.5 : b.delay}s`,
              }}
              onClick={(e) => popBalloon(i, e)}
              aria-label="Reventar globo"
            />
          ))}
          {bursts.map((p) => (
            <span key={p.id} className="farm-burst" style={{ left: p.x, top: p.y, '--c': p.color }}>
              {Array.from({ length: 8 }, (_, k) => <i key={k} style={{ '--a': `${k * 45}deg` }} />)}
            </span>
          ))}
        </div>
      )}

      {interactive && (
        <div className={`farm-hint${allGreeted ? ' done' : ''}`}>
          {allGreeted
            ? '¡Saludaste a toda la granja! 🎉'
            : greeted.size === 0 && popped === 0
              ? '👆 Toca a los animalitos y revienta los globos'
              : `🐾 ${greeted.size}/${total} animalitos${popped ? ` · 🎈 ${popped}` : ''}`}
        </div>
      )}

      <Confetti burst={confetti} />
    </div>
  )
}
