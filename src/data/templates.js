// Cada plantilla define un evento, un tema visual y textos por defecto.
// Los colores se aplican como variables CSS en <Invitation />.

export const EVENTS = [
  { id: 'boda', label: 'Boda', icon: '💍' },
  { id: 'xv', label: 'XV Años', icon: '👑' },
  { id: 'bautizo', label: 'Bautizo', icon: '⛪' },
  { id: 'babyshower', label: 'Baby Shower', icon: '👶' },
  { id: 'revelacion', label: 'Revelación de Género', icon: '🎀' },
  { id: 'cumpleanos', label: 'Cumpleaños', icon: '🎂' },
  { id: 'infantil', label: 'Fiesta Infantil', icon: '🎈' },
  { id: 'graduacion', label: 'Graduación', icon: '🎓' },
  { id: 'halloween', label: 'Halloween', icon: '🎃' },
]

const serif = "'Cormorant Garamond', Georgia, serif"
const script = "'Great Vibes', cursive"
const playfair = "'Playfair Display', Georgia, serif"
const sans = "'Montserrat', system-ui, sans-serif"
const round = "'Fredoka', system-ui, sans-serif"

export const TEMPLATES = [
  {
    id: 'boda-clasica',
    event: 'boda',
    name: 'Clásica Dorada',
    theme: {
      bg: '#fbf7f0', surface: '#ffffff', text: '#3d3427', muted: '#8a7d6a',
      accent: '#b08d57', accent2: '#e9dcc4', onAccent: '#ffffff',
      display: script, heading: serif, body: serif,
      ornament: '❦', pattern: 'radial-gradient(circle at 20% 10%, #f3e7d0 0, transparent 40%), radial-gradient(circle at 80% 90%, #efe2c8 0, transparent 40%)',
    },
    defaults: {
      eyebrow: 'Nos casamos', names: 'Ana & Luis',
      message: 'Con la bendición de Dios y de nuestros padres, tenemos el honor de invitarte a celebrar nuestra unión.',
      venue: 'Hacienda Los Laureles', address: 'Carretera a San Miguel km 4, Querétaro',
      dressCode: 'Formal · Evitar color blanco', gifts: 'Mesa de regalos Liverpool #51234567',
    },
  },
  {
    id: 'boda-jardin',
    event: 'boda',
    name: 'Jardín Botánico',
    theme: {
      bg: '#f1f4ee', surface: '#ffffff', text: '#2f3b2c', muted: '#6f7d69',
      accent: '#6b8e5a', accent2: '#d9e4cf', onAccent: '#ffffff',
      display: playfair, heading: playfair, body: sans,
      ornament: '🌿', pattern: 'linear-gradient(160deg, #e3ebdb 0%, transparent 50%)',
    },
    defaults: {
      eyebrow: 'Save the date', names: 'Sofía & Daniel',
      message: 'Queremos compartir contigo el día más importante de nuestras vidas, rodeados de naturaleza y de las personas que amamos.',
      venue: 'Jardín Las Bugambilias', address: 'Av. Del Bosque 120, Valle de Bravo',
      dressCode: 'Formal de jardín', gifts: 'Lluvia de sobres',
    },
  },
  {
    id: 'xv-rosa',
    event: 'xv',
    name: 'Princesa Rosa',
    theme: {
      bg: '#fff3f6', surface: '#ffffff', text: '#4a2734', muted: '#9a6b7b',
      accent: '#d4688e', accent2: '#f8d4e0', onAccent: '#ffffff',
      display: script, heading: "'Cinzel', serif", body: sans,
      ornament: '👑', pattern: 'radial-gradient(circle at 50% 0%, #fbdbe6 0, transparent 55%)',
    },
    defaults: {
      eyebrow: 'Mis XV Años', names: 'Valentina',
      message: 'Hay momentos inolvidables que se guardan en el corazón para siempre. Me encantaría que me acompañaras a celebrar mis quince años.',
      venue: 'Salón Cristal', address: 'Blvd. de las Flores 455, Guadalajara',
      dressCode: 'Formal · El rosa está reservado para la quinceañera', gifts: 'Lluvia de sobres',
    },
  },
  {
    id: 'xv-noche',
    event: 'xv',
    name: 'Noche Estrellada',
    theme: {
      bg: '#0f1530', surface: '#1a2244', text: '#eef0ff', muted: '#a3abd6',
      accent: '#c9b8ff', accent2: '#2a3463', onAccent: '#0f1530',
      display: script, heading: "'Cinzel', serif", body: sans,
      ornament: '✨', pattern: 'radial-gradient(1px 1px at 20% 30%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 70% 20%, #fff 50%, transparent 51%), radial-gradient(1.5px 1.5px at 40% 70%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 85% 60%, #fff 50%, transparent 51%)',
    },
    defaults: {
      eyebrow: 'Mis XV Años', names: 'Camila',
      message: 'Bajo un cielo lleno de estrellas comienza una nueva etapa. Acompáñame a celebrarla.',
      venue: 'Salón Galaxia', address: 'Av. Constitución 800, Monterrey',
      dressCode: 'Etiqueta', gifts: 'Lluvia de sobres',
    },
  },
  {
    id: 'bautizo',
    event: 'bautizo',
    name: 'Cielo Sereno',
    theme: {
      bg: '#f2f7fb', surface: '#ffffff', text: '#27394a', muted: '#6c8296',
      accent: '#6fa3c7', accent2: '#d8e8f3', onAccent: '#ffffff',
      display: script, heading: serif, body: sans,
      ornament: '🕊️', pattern: 'radial-gradient(circle at 50% 0%, #dfeef8 0, transparent 60%)',
    },
    defaults: {
      eyebrow: 'Mi Bautizo', names: 'Mateo',
      message: 'Con alegría en nuestros corazones te invitamos a acompañarnos en el bautizo de nuestro hijo.',
      venue: 'Parroquia de San José', address: 'Calle Hidalgo 12, Centro, Puebla',
      dressCode: 'Casual elegante', gifts: '',
    },
  },
  {
    id: 'babyshower',
    event: 'babyshower',
    name: 'Ositos Pastel',
    theme: {
      bg: '#fdf8ec', surface: '#ffffff', text: '#4a3f2e', muted: '#8f846f',
      accent: '#e6a94f', accent2: '#cfe8dd', onAccent: '#ffffff',
      display: "'Pacifico', cursive", heading: round, body: round,
      ornament: '🧸', pattern: 'radial-gradient(circle at 15% 15%, #e6f3ec 0, transparent 35%), radial-gradient(circle at 85% 85%, #fbe9c9 0, transparent 35%)',
    },
    defaults: {
      eyebrow: 'Baby Shower', names: 'Bebé García',
      message: 'Un pequeño milagro está por llegar. Acompáñanos a celebrar la dulce espera.',
      venue: 'Casa de la familia García', address: 'Privada Los Pinos 34, Mérida',
      dressCode: 'Casual', gifts: 'Pañales etapa 1 y 2',
    },
  },
  {
    id: 'revelacion',
    event: 'revelacion',
    name: '¿Niño o Niña?',
    theme: {
      bg: '#fbf6fb', surface: '#ffffff', text: '#3f3550', muted: '#857a96',
      accent: '#e389b2', accent2: '#9cc7ea', onAccent: '#ffffff',
      display: "'Pacifico', cursive", heading: round, body: round,
      ornament: '🎀', pattern: 'linear-gradient(135deg, #fde3ef 0%, transparent 45%, transparent 55%, #dcecf9 100%)',
    },
    defaults: {
      eyebrow: 'Revelación de género', names: '¿Él o Ella?',
      message: 'Ven a descubrir con nosotros si será niño o niña. ¡Trae tu apuesta y tu mejor sonrisa!',
      venue: 'Terraza Primavera', address: 'Calle Roble 77, Toluca',
      dressCode: 'Viste de rosa 💗 o azul 💙 según tu apuesta', gifts: '',
    },
  },
  {
    id: 'cumpleanos',
    event: 'cumpleanos',
    name: 'Fiesta Confeti',
    theme: {
      bg: '#fff8f1', surface: '#ffffff', text: '#2e2a3a', muted: '#7d7590',
      accent: '#ff6b4a', accent2: '#ffe0b8', onAccent: '#ffffff',
      display: "'Pacifico', cursive", heading: playfair, body: sans,
      ornament: '🎉', pattern: 'radial-gradient(4px 4px at 10% 20%, #ffb703 50%, transparent 51%), radial-gradient(4px 4px at 80% 15%, #8ecae6 50%, transparent 51%), radial-gradient(4px 4px at 30% 80%, #ff6b4a 50%, transparent 51%), radial-gradient(4px 4px at 90% 70%, #b5e48c 50%, transparent 51%)',
    },
    defaults: {
      eyebrow: '¡Vamos a celebrar!', names: 'Los 30 de Mariana',
      message: 'Un año más de vida merece una gran fiesta. ¡No puedes faltar!',
      venue: 'Rooftop Altura', address: 'Av. Reforma 222, CDMX',
      dressCode: 'Casual chic', gifts: '',
    },
  },
  {
    id: 'infantil',
    event: 'infantil',
    name: 'Globos de Colores',
    theme: {
      bg: '#f0f8ff', surface: '#ffffff', text: '#24324a', muted: '#6b7a93',
      accent: '#3a86ff', accent2: '#ffd166', onAccent: '#ffffff',
      display: round, heading: round, body: round,
      ornament: '🎈', pattern: 'radial-gradient(circle at 10% 10%, #ffe9a8 0, transparent 30%), radial-gradient(circle at 90% 30%, #ffc8dd 0, transparent 30%), radial-gradient(circle at 20% 90%, #bde0fe 0, transparent 30%)',
    },
    defaults: {
      eyebrow: '¡Estás invitado!', names: 'Santi cumple 5',
      message: 'Habrá juegos, pastel, piñata y mucha diversión. ¡Te esperamos!',
      venue: 'Salón Brincolines', address: 'Calle Juárez 90, León',
      dressCode: 'Ropa cómoda para jugar', gifts: '',
    },
  },
  {
    id: 'graduacion',
    event: 'graduacion',
    name: 'Negro & Oro',
    theme: {
      bg: '#121212', surface: '#1d1d1d', text: '#f4efe4', muted: '#a8a08e',
      accent: '#d4af37', accent2: '#2a2a2a', onAccent: '#121212',
      display: "'Cinzel', serif", heading: "'Cinzel', serif", body: sans,
      ornament: '🎓', pattern: 'linear-gradient(180deg, #1c1a14 0%, transparent 40%)',
    },
    defaults: {
      eyebrow: 'Generación 2022 – 2026', names: 'Ing. Andrea López',
      message: 'El esfuerzo de años hoy da frutos. Me encantaría compartir contigo este logro.',
      venue: 'Club Campestre', address: 'Paseo de la Loma 300, Aguascalientes',
      dressCode: 'Formal', gifts: '',
    },
  },
  {
    id: 'halloween',
    event: 'halloween',
    name: 'Noche de Brujas',
    theme: {
      bg: '#16101f', surface: '#221833', text: '#f5ecff', muted: '#b6a6cc',
      accent: '#ff7a1a', accent2: '#3a2852', onAccent: '#16101f',
      display: "'Creepster', cursive", heading: "'Creepster', cursive", body: sans,
      ornament: '🎃', pattern: 'radial-gradient(circle at 80% 10%, #3b2a10 0, transparent 30%)',
    },
    defaults: {
      eyebrow: 'Fiesta de disfraces', names: 'Halloween Party',
      message: 'Los espíritus se reúnen esta noche… ¿te atreves a venir?',
      venue: 'La Casona', address: 'Callejón del Muerto 13, Guanajuato',
      dressCode: 'Disfraz obligatorio 👻', gifts: '',
    },
  },
]

export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]

function nextSaturday() {
  const d = new Date()
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7) + 28)
  return d.toISOString().slice(0, 10)
}

export function blankInvitation(templateId) {
  const t = getTemplate(templateId)
  return {
    t: t.id,
    ...t.defaults,
    date: nextSaturday(),
    time: '18:00',
    mapQuery: '',
    rsvpPhone: '',
    rsvpDeadline: '',
    photo: '',
    music: '',
    show: { countdown: true, map: true, rsvp: true, calendar: true },
  }
}
