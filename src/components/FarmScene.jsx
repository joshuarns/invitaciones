// Fondo ilustrado de granja para la portada. Dos capas:
// - cielo (sol y nubes) arriba,
// - suelo (colinas, granero, cerca y animalitos) en una franja de alto fijo abajo (--ground).
// Ambas son anchas (1200u) y se recortan a los lados: los animales están agrupados al centro
// para que se vean igual en un teléfono que en escritorio.

const ANIMALS = [
  ['🐑', 220, 170, 34],
  ['🐓', 330, 232, 26],
  ['🐐', 450, 236, 30],
  ['🐄', 490, 176, 44],
  ['🐖', 565, 208, 36],
  ['🐣', 615, 246, 22],
  ['🐑', 645, 182, 38],
  ['🐔', 705, 222, 28],
  ['🦆', 745, 248, 24],
  ['🐴', 790, 188, 44],
  ['🐇', 900, 236, 26],
  ['🐄', 1010, 166, 40],
]

export default function FarmScene() {
  return (
    <div className="farm" aria-hidden="true">
      <svg className="farm-sky" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMin slice">
        <circle cx="760" cy="70" r="48" fill="#ffd84d" opacity=".25" />
        <circle cx="760" cy="70" r="34" fill="#ffd84d" />
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

        {/* granero */}
        <g transform="translate(660 34)">
          <path d="M0 40 L45 8 L90 40 V100 H0Z" fill="#d94b3f" />
          <path d="M-6 42 L45 4 L96 42" fill="none" stroke="#fff" strokeWidth="6" strokeLinejoin="round" />
          <rect x="30" y="58" width="30" height="42" fill="#a8322a" />
          <path d="M30 58 L60 100 M60 58 L30 100" stroke="#fff" strokeWidth="3" />
          <rect x="30" y="58" width="30" height="42" fill="none" stroke="#fff" strokeWidth="3" />
          <rect x="37" y="24" width="16" height="14" fill="#fff6d6" stroke="#fff" strokeWidth="2" />
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

        {ANIMALS.map(([emoji, x, y, size], i) => (
          <text
            key={i}
            className="farm-animal"
            x={x}
            y={y}
            fontSize={size}
            textAnchor="middle"
            style={{ animationDelay: `${(i % 6) * 0.4}s` }}
          >
            {emoji}
          </text>
        ))}
      </svg>
    </div>
  )
}
