import { useEffect, useState } from 'react'

const COLORS = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#ff8fab']

// Lanza una ráfaga cada vez que cambia `burst` (un contador). Se posiciona absoluto
// dentro del contenedor más cercano con position relative.
export default function Confetti({ burst }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (!burst) return
    setPieces(
      Array.from({ length: 48 }, (_, i) => ({
        id: `${burst}-${i}`,
        left: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.3,
        dur: 1.6 + Math.random() * 1.2,
        drift: (Math.random() - 0.5) * 160,
        spin: (Math.random() - 0.5) * 1080,
        round: i % 3 === 0,
      })),
    )
    const id = setTimeout(() => setPieces([]), 3200)
    return () => clearTimeout(id)
  }, [burst])

  if (!pieces.length) return null
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <i
          key={p.id}
          className={p.round ? 'round' : ''}
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            '--drift': `${p.drift}px`,
            '--spin': `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  )
}
