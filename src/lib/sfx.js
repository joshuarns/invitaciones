// Efectos de sonido sintetizados con Web Audio: no hay archivos que descargar.
// El AudioContext se crea en el primer toque del usuario (los navegadores lo exigen).

let ctx = null

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Una "voz" simple: oscilador con barrido de frecuencia, vibrato opcional y envolvente.
export function voice({ from, to = from, dur = 0.4, type = 'sine', vibrato = 0, gain = 0.18, delay = 0 }) {
  const ac = audio()
  if (!ac) return
  const t = ac.currentTime + delay
  const osc = ac.createOscillator()
  const amp = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(from, t)
  osc.frequency.exponentialRampToValueAtTime(to, t + dur)
  if (vibrato) {
    const lfo = ac.createOscillator()
    const depth = ac.createGain()
    lfo.frequency.value = 9
    depth.gain.value = vibrato
    lfo.connect(depth).connect(osc.frequency)
    lfo.start(t)
    lfo.stop(t + dur)
  }
  amp.gain.setValueAtTime(0.0001, t)
  amp.gain.exponentialRampToValueAtTime(gain, t + 0.03)
  amp.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(amp).connect(ac.destination)
  osc.start(t)
  osc.stop(t + dur + 0.05)
}

export const pop = () => voice({ from: 900, to: 120, dur: 0.12, type: 'triangle', gain: 0.25 })

export function chime() {
  ;[523, 659, 784, 1047].forEach((f, i) => voice({ from: f, dur: 0.35, type: 'sine', gain: 0.12, delay: i * 0.09 }))
}
