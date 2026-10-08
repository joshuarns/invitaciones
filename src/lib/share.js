import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'

// Toda la invitación viaja dentro del link: no hace falta backend ni base de datos.
export function encodeInvitation(data) {
  return compressToEncodedURIComponent(JSON.stringify(data))
}

export function decodeInvitation(str) {
  try {
    const json = decompressFromEncodedURIComponent(str)
    return json ? JSON.parse(json) : null
  } catch {
    return null
  }
}

export function shareUrl(data) {
  return `${window.location.origin}/i?d=${encodeInvitation(data)}`
}

const DRAFT_KEY = 'invitaciones:draft:'

export function loadDraft(templateId) {
  try {
    const raw = localStorage.getItem(DRAFT_KEY + templateId)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveDraft(data) {
  try {
    localStorage.setItem(DRAFT_KEY + data.t, JSON.stringify(data))
  } catch {
    // almacenamiento no disponible (modo privado): el borrador simplemente no se guarda
  }
}

export function clearDraft(templateId) {
  try {
    localStorage.removeItem(DRAFT_KEY + templateId)
  } catch {
    // ignorar
  }
}
