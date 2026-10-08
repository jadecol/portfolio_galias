# portfolio

Portafolio de Julian De Ecozan para la vacante de Profesional Senior en Arquitectura (Estructuración y Normativa), Constructora Las Galias.

Sitio estático con Vite (JavaScript vanilla).

## Estructura
```
portfolio/
├─ index.html          # marcado de la página
├─ public/             # archivos servidos tal cual (favicon, robots, etc.)
├─ src/
│  ├─ main.js          # punto de entrada
│  ├─ style.css        # estilos
│  ├─ reveal.js        # animaciones de scroll
│  ├─ form.js          # formulario de prueba 24h (mailto)
│  ├─ layout.js        # ajuste responsive del formulario
│  └─ assets/          # imágenes y recursos propios
├─ vite.config.js
├─ wrangler.toml       # opcional: Cloudflare
└─ package.json
```

## Uso
```bash
npm install
npm run dev      # http://localhost:5500
npm run build    # genera dist/
npm run deploy   # opcional: Cloudflare (requiere wrangler login)
```

## Plazos (texto de la página)
- Confirmación de recepción: 2 h hábiles.
- Entrega: 24 h hábiles en Bogotá, contadas desde que el predio llega con información completa (si llega antes de las 4 pm, al siguiente día hábil). Otras ciudades: plazo acordado según la normativa disponible.

## Pendiente del autor antes de publicar
- Revisar los Decretos Distritales 253 y 254 de 2026 (Bogotá) frente al POT 555 citado.
- Confirmar vigencia de POT Medellín 2014 y Manizales 2017; Cali está en transición hacia un nuevo POT.
- Mantener "Disponible inmediato Bogotá/Ubaté · Hoy" solo si es cierto.
- Probar el formulario en navegador (usa mailto a alejandrodecozan@gmail.com).
