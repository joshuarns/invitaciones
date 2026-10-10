import { useEffect, useRef, useState } from 'react'
import Confetti from './Confetti.jsx'
import { chime, pop, voice } from '../lib/sfx.js'

// Fondo ilustrado de granja para la portada. Dos capas:
// - cielo (sol y nubes) arriba,
// - suelo (colinas, granero, cerca y animalitos) en una franja de alto fijo abajo (--ground).
// Ambas son anchas (1200u) y se recortan a los lados: los animales están agrupados al centro
// para que se vean igual en un teléfono que en escritorio.
//
// Con `interactive`, los animales hablan al tocarlos, el granero se abre, el sol gira y
// suben globos que se pueden reventar. Al saludar a todos los animales sale confeti.

const S = (from, to, dur, type, vibrato) => ({ from, to, dur, type, vibrato })

const ANIMALS = [
  { e: '🐑', x: 220, y: 170, size: 34, says: '¡Beee!', sound: [S(420, 380, 0.6, 'sawtooth', 30)] },
  { e: '🐓', x: 330, y: 232, size: 26, says: '¡Kikirikí!', sound: [S(700, 900, 0.15, 'square'), S(900, 1100, 0.15, 'square'), S(1100, 700, 0.45, 'square')] },
  { e: '🐐', x: 450, y: 236, size: 30, says: '¡Meee!', sound: [S(500, 460, 0.5, 'sawtooth', 45)] },
  { e: '🐄', x: 490, y: 176, size: 44, says: '¡Muuu!', sound: [S(160, 110, 0.9, 'sawtooth')] },
  { e: '🐖', x: 565, y: 208, size: 36, says: '¡Oink!', sound: [S(320, 220, 0.18, 'square'), S(300, 200, 0.18, 'square')] },
  { e: '🐣', x: 615, y: 246, size: 22, says: '¡Pío pío!', sound: [S(1800, 2400, 0.1, 'sine'), S(1800, 2400, 0.1, 'sine')] },
  { e: '🐑', x: 645, y: 182, size: 38, says: '¡Beee!', sound: [S(380, 340, 0.6, 'sawtooth', 30)] },
  { e: '🐔', x: 705, y: 222, size: 28, says: '¡Cocoró!', sound: [S(600, 500, 0.12, 'square'), S(600, 500, 0.12, 'square'), S(700, 900, 0.3, 'square')] },
  { e: '🦆', x: 745, y: 248, size: 24, says: '¡Cuac!', sound: [S(500, 300, 0.2, 'sawtooth'), S(500, 300, 0.2, 'sawtooth')] },
  { e: '🐴', x: 790, y: 188, size: 44, says: '¡Iiiih!', sound: [S(900, 500, 0.8, 'sawtooth', 60)] },
  { e: '🐇', x: 900, y: 236, size: 26, says: '¡Ñam ñam!', sound: [S(1200, 1500, 0.08, 'sine'), S(1200, 1500, 0.08, 'sine'), S(1200, 1500, 0.08, 'sine')] },
  { e: '🐄', x: 1010, y: 166, size: 40, says: '¡Muuu!', sound: [S(140, 100, 0.9, 'sawtooth')] },
]

const BALLOONS = [
  { left: 8, color: '#ff595e', dur: 11, delay: 0 },
  { left: 26, color: '#ffca3a', dur: 13, delay: 4 },
  { left: 72, color: '#1982c4', dur: 12, delay: 2 },
  { left: 88, color: '#8ac926', dur: 14, delay: 6 },
  { left: 50, color: '#ff8fab', dur: 15, delay: 9 },
]

function playSound(parts) {
  let at = 0
  for (const p of parts) {
    voice({ ...p, delay: at })
    at += p.dur * 0.9
  }
}

function Bubble({ x, y, text }) {
  const w = text.length * 10 + 22
  return (
    <g className="farm-bubble" transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-34} width={w} height={28} rx={14} fill="#fff" stroke="#24324a" strokeWidth="2" />
      <path d="M-6 -7 L0 2 L6 -7" fill="#fff" stroke="#24324a" strokeWidth="2" strokeLinejoin="round" />
      <rect x={-7} y={-9} width={14} height={4} fill="#fff" />
      <text y={-14} textAnchor="middle" fontSize="16" fontWeight="600" fill="#24324a">{text}</text>
    </g>
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
  const timers = useRef({})
  const root = useRef(null)

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), [])

  const total = ANIMALS.length
  const allGreeted = greeted.size === total

  function tapAnimal(i) {
    playSound(ANIMALS[i].sound)
    setTalking((t) => ({ ...t, [i]: (t[i] ?? 0) + 1 }))
    clearTimeout(timers.current[i])
    timers.current[i] = setTimeout(() => setTalking(({ [i]: _, ...rest }) => rest), 1600)
    setGreeted((g) => {
      if (g.has(i)) return g
      const next = new Set(g).add(i)
      if (next.size === total) {
        setConfetti((c) => c + 1)
        setTimeout(chime, 150)
      }
      return next
    })
  }

  function tapBarn() {
    setBarnOpen((o) => !o)
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
    const id = Date.now() + i
    setBursts((list) => [...list, { id, x: b.left + b.width / 2 - box.left, y: b.top + b.height / 3 - box.top, color: BALLOONS[i].color }])
    setTimeout(() => setBursts((list) => list.filter((p) => p.id !== id)), 700)
    setPopped((n) => n + 1)
    setRespawn((r) => r.map((v, j) => (j === i ? v + 1 : v)))
  }

  return (
    <div ref={root} className={`farm${interactive ? ' is-interactive' : ''}`} aria-hidden={!interactive}>
      <svg className="farm-sky" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMin slice">
        <g className="farm-tap" onClick={interactive ? tapSun : undefined}>
          <g key={sunSpin} className={sunSpin ? 'farm-sun spin' : 'farm-sun'}>
            <circle cx="760" cy="70" r="48" fill="#ffd84d" opacity=".25" />
            <circle cx="760" cy="70" r="34" fill="#ffd84d" />
            {sunSpin > 0 && (
              <g fill="#24324a">
                <circle cx="749" cy="66" r="3" />
                <path d="M766 66 q5 -5 10 0" stroke="#24324a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M750 78 q10 9 20 0" stroke="#24324a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </g>
            )}
          </g>
        </g>
        <g className="farm-cloud" fill="#fff">
          <ellipse cx="450" cy="70" rx="38" ry="16" />
          <ellipse cx="476" cy="60" rx="26" ry="18" />
          <ellipse cx="428" cy="64" rx="20" ry="13" />
        </g>
        <g className="farm-cloud slow" fill="#fff" opacity=".9">
          <ellipse cx="640" cy="140" rx="32" ry="13" />
          <ellipse cx="662" cy="131" rx="22" ry="15" />
        </g>
        <g className="farm-cloud" fill="#fff" opacity=".85">
          <ellipse cx="170" cy="100" rx="40" ry="15" />
          <ellipse cx="1020" cy="90" rx="44" ry="16" />
        </g>
      </svg>

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

      <svg className="farm-ground" viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice">
        <path d="M0 110 Q150 40 330 90 T660 80 T1000 70 T1200 90 V260 H0Z" fill="#a8dd7c" />
        <path d="M0 150 Q200 100 420 140 T840 130 T1200 140 V260 H0Z" fill="#7cc95a" />

        {/* árbol */}
        <g transform="translate(400 50)">
          <rect x="16" y="40" width="10" height="44" fill="#9a6a3a" rx="3" />
          <circle cx="21" cy="30" r="28" fill="#5fb548" />
          <circle cx="10" cy="22" r="5" fill="#ff5a4e" />
          <circle cx="32" cy="34" r="5" fill="#ff5a4e" />
        </g>

        {/* granero: al abrirlo aparece una sorpresa */}
        <g transform="translate(660 34)" className="farm-tap" onClick={interactive ? tapBarn : undefined}>
          <path d="M0 40 L45 8 L90 40 V100 H0Z" fill="#d94b3f" />
          <path d="M-6 42 L45 4 L96 42" fill="none" stroke="#fff" strokeWidth="6" strokeLinejoin="round" />
          <rect x="30" y="58" width="30" height="42" fill="#5a2320" />
          <text x="45" y="94" fontSize="26" textAnchor="middle" className={barnOpen ? 'farm-surprise up' : 'farm-surprise'}>🎁</text>
          <g className={barnOpen ? 'farm-door open' : 'farm-door'}>
            <rect x="30" y="58" width="15" height="42" fill="#a8322a" stroke="#fff" strokeWidth="3" />
            <path d="M30 58 L45 100 M45 58 L30 100" stroke="#fff" strokeWidth="2.5" />
          </g>
          <g className={barnOpen ? 'farm-door right open' : 'farm-door right'}>
            <rect x="45" y="58" width="15" height="42" fill="#a8322a" stroke="#fff" strokeWidth="3" />
            <path d="M45 58 L60 100 M60 58 L45 100" stroke="#fff" strokeWidth="2.5" />
          </g>
          <rect x="37" y="24" width="16" height="14" fill="#fff6d6" stroke="#fff" strokeWidth="2" />
          {barnOpen && <Bubble x={45} y={4} text="¡Sorpresa!" />}
        </g>

        {/* cerca */}
        <g stroke="#c9945a" strokeWidth="5" strokeLinecap="round">
          <line x1="440" y1="150" x2="650" y2="146" />
          <line x1="440" y1="168" x2="650" y2="164" />
          {[450, 490, 530, 570, 610, 646].map((x) => (
            <line key={x} x1={x} y1="138" x2={x} y2="180" />
          ))}
        </g>

        <path d="M0 212 Q600 182 1200 212 V260 H0Z" fill="#69b84c" />

        {ANIMALS.map((a, i) => (
          <g key={i} className="farm-tap" onClick={interactive ? () => tapAnimal(i) : undefined}>
            {/* área táctil más grande que el emoji */}
            <circle cx={a.x} cy={a.y - a.size / 3} r={a.size * 0.75} fill="transparent" />
            <text
              key={talking[i] ?? 0}
              className={talking[i] ? 'farm-animal jump' : 'farm-animal'}
              x={a.x}
              y={a.y}
              fontSize={a.size}
              textAnchor="middle"
              style={{ animationDelay: talking[i] ? '0s' : `${(i % 6) * 0.4}s` }}
            >
              {a.e}
            </text>
          </g>
        ))}
        {ANIMALS.map((a, i) => talking[i] && <Bubble key={`b${i}`} x={a.x} y={a.y - a.size} text={a.says} />)}
      </svg>

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
