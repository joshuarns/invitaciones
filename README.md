# Invitaciones Interactivas

Editor web de invitaciones digitales (boda, XV años, bautizo, baby shower, revelación de género, cumpleaños, fiesta infantil, graduación y Halloween).

- 11 plantillas con tema propio (colores, tipografías, ornamentos)
- Editor con vista previa en vivo dentro de un teléfono
- Confirmación de asistencia por WhatsApp, mapa de Google Maps, cuenta regresiva, agregar al calendario (Google / .ics) y música de fondo
- Sin backend: toda la invitación va comprimida dentro del link (`/i?d=…`). Los borradores se guardan en `localStorage`.

```bash
npm install
npm run dev
```

Las plantillas viven en `src/data/templates.js`; agregar una es añadir un objeto con `theme` y `defaults`.
