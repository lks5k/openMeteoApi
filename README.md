# 🌤️ Dashboard del Clima

Una aplicación web interactiva, moderna y minimalista que permite consultar el estado del tiempo en tiempo real para cualquier ciudad del mundo, con pronóstico de 5 días, autocompletado inteligente de ciudades y detección automática de ubicación.

---

## 📌 Resumen del Proyecto

**Dashboard del Clima** es una SPA (_Single-Page Application_) construida con tecnologías web nativas —sin frameworks ni dependencias externas— que consume las APIs públicas y gratuitas de **Open-Meteo** para ofrecer información meteorológica actualizada al instante.

Al cargar, la app detecta automáticamente la ciudad del usuario mediante su dirección IP. El usuario puede refinar la búsqueda escribiendo el nombre de cualquier ciudad del mundo o activando el GPS del dispositivo. Toda la lógica, el renderizado y los estilos son gestionados íntegramente desde el navegador.

---

## 🛠️ Funcionalidades Clave

| Funcionalidad | Descripción |
|---|---|
| 🔍 **Búsqueda por ciudad** | Campo de texto con autocompletado en tiempo real (debounce de 300 ms). Muestra hasta 7 sugerencias con nombre, provincia y país. |
| ⌨️ **Navegación por teclado** | Las sugerencias del dropdown se recorren con `↑` `↓`, se confirman con `Enter` y se descartan con `Escape`. |
| 📍 **Botón "Usar ubicación actual"** | Solicita permiso de geolocalización al navegador (GPS) y resuelve el nombre de la ciudad mediante geocodificación inversa con Nominatim. |
| 🌡️ **Temperatura actual** | Temperatura en °C junto al emoji y descripción en español del estado del cielo (basado en códigos WMO). |
| 💧 **Humedad relativa** | Porcentaje de humedad del aire en el momento de la consulta. |
| 🌡️ **Sensación térmica** | Temperatura aparente percibida por el cuerpo (`apparent_temperature`). |
| 💨 **Velocidad del viento** | Viento en km/h medido a 10 m de altura. |
| 🔆 **Índice UV** | Valor numérico con clasificación textual: Bajo / Moderado / Alto / Muy alto / Extremo. |
| 📅 **Pronóstico de 5 días** | Tarjetas diarias con emoji del estado, temperatura máxima y mínima. El primer día se etiqueta como "Hoy". |
| 🌐 **Detección por IP** | Al iniciar, la app consulta `ipapi.co` para obtener la ciudad del usuario sin intervención manual. |
| 📱 **Diseño responsive** | El layout se adapta a pantallas móviles (breakpoint en 620 px). |

---

## 🚀 Instrucciones de Instalación y Configuración

El proyecto no requiere instalación de dependencias ni proceso de compilación. Al ser 100% frontend estático, solo necesitas un servidor local para evitar restricciones de CORS del navegador.

### Prerrequisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Extensión **Live Server** instalada en VS Code _(recomendado)_

### Pasos

**1. Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/OpenMeteoAPI.git
cd OpenMeteoAPI
```

**2. Abrir el proyecto en VS Code**

```bash
code .
```

**3. Iniciar el servidor local con Live Server**

- Haz clic derecho sobre `index.html` en el explorador de archivos de VS Code.
- Selecciona **"Open with Live Server"**.
- La app se abrirá automáticamente en: `http://127.0.0.1:5500`

> **Alternativa sin VS Code:** Puedes usar cualquier servidor HTTP estático. Por ejemplo, con Python:
> ```bash
> python -m http.server 5500
> ```
> Luego navega a `http://localhost:5500`.

---

## 📖 Guía de Uso

### Búsqueda por nombre de ciudad

1. Escribe el nombre de una ciudad en el campo de búsqueda (mínimo 2 caracteres).
2. Espera 300 ms para que aparezca el dropdown con sugerencias.
3. Selecciona una ciudad con el ratón o navega con las teclas `↑` / `↓` y confirma con `Enter`.
4. Si omites el dropdown, pulsa `Enter` directamente para buscar el texto ingresado.

> **Tip:** Puedes añadir una coma y el país para desambiguar ciudades homónimas.
> Ejemplo: `Springfield, US` o `Toledo, ES`.

### Búsqueda por GPS

1. Haz clic en el botón **"Usar ubicación actual"** (ícono de radar).
2. Acepta el permiso de geolocalización que solicita el navegador.
3. La app resolverá tu posición y mostrará el clima de tu ubicación real.

### Lectura del dashboard

- **Columna izquierda:** ciudad, fecha, emoji del estado, temperatura principal y descripción.
- **Columna derecha:** cuatro tarjetas de métricas (Humedad, Sensación Térmica, Viento, Índice UV).
- **Fila inferior:** cinco tarjetas de pronóstico diario con mínima y máxima.

---

## 🔌 Información de la API

El proyecto consume **cuatro fuentes de datos externas**, todas gratuitas y sin necesidad de API Key:

### 1. Open-Meteo — Geocoding API
Convierte el nombre de una ciudad en coordenadas geográficas (latitud y longitud).

```
GET https://geocoding-api.open-meteo.com/v1/search
    ?name={ciudad}
    &count=7
    &language=es
    &format=json
```

### 2. Open-Meteo — Weather Forecast API
Obtiene el clima actual y el pronóstico diario a partir de coordenadas.

```
GET https://api.open-meteo.com/v1/forecast
    ?latitude={lat}
    &longitude={lon}
    &current=temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,wind_speed_10m,uv_index
    &daily=weather_code,temperature_2m_max,temperature_2m_min
    &forecast_days=5
    &timezone=auto
```

### 3. Nominatim (OpenStreetMap) — Reverse Geocoding
Transforma coordenadas GPS en el nombre legible de la ciudad.

```
GET https://nominatim.openstreetmap.org/reverse
    ?lat={lat}
    &lon={lon}
    &format=json
    &accept-language=es
```

### 4. ipapi.co — Geolocalización por IP
Detecta la ciudad del usuario al cargar la página sin intervención del usuario.

```
GET https://ipapi.co/json/
```

### Flujo interno de una petición

```
Input usuario
     │
     ▼
buscarCandidatos()  ──►  Open-Meteo Geocoding API  (candidatos + coordenadas)
     │
     ▼
obtenerClimaPorCoordenadas()  ──►  Open-Meteo Forecast API  (clima + pronóstico)
     │
     ▼
renderizarDashboard()  ──►  Actualiza el DOM con los datos
```

Los códigos de estado del cielo siguen el estándar **WMO** (World Meteorological Organization). El diccionario interno `WMO_CODES` los traduce al español con su emoji correspondiente, cubriendo desde cielo despejado (código 0) hasta tormentas severas con granizo (código 99).

---

## ⚠️ Manejo de Errores

La aplicación contempla los siguientes escenarios de fallo y los comunica visualmente en el cuerpo del dashboard con un mensaje en rojo:

| Escenario | Comportamiento |
|---|---|
| Ciudad no encontrada | Muestra: _"No se encontró la ciudad 'X'."_ |
| Error HTTP en la API del clima | Muestra: _"Error al obtener el clima: [código HTTP]"_ |
| Error HTTP en la geocodificación | Muestra: _"Error de geocodificación: [código HTTP]"_ |
| Permiso de GPS denegado | Muestra: _"Permiso de ubicación denegado o tiempo de espera agotado."_ |
| Navegador sin soporte de geolocalización | Muestra: _"Tu navegador no soporta geolocalización."_ |
| ipapi.co no disponible al iniciar | Realiza un fallback automático a **Santiago de Cali** sin mostrar error al usuario. |
| Timeout de ipapi.co (> 4 s) | La petición es abortada con `AbortController` y se ejecuta el fallback silencioso. |

---

## 📸 Ejemplo de Resultados

> Inserta aquí una captura de pantalla o mockup del dashboard en funcionamiento.

```
📁 assets/
└── screenshot-dashboard.png   ← Captura del estado "Resultado exitoso"
└── screenshot-mobile.png      ← Vista en dispositivo móvil
```

![Dashboard del Clima - Vista de escritorio](assets/screenshot-dashboard.png)

---

## 🔮 Mejoras Futuras

- [ ] **Modo oscuro** — Implementar un toggle que persista la preferencia en `localStorage`.
- [ ] **Unidades configurables** — Permitir cambiar entre °C / °F y km/h / mph.
- [ ] **Pronóstico horario** — Añadir una vista de las próximas 24 horas por franjas.
- [ ] **Animaciones de fondo dinámicas** — Adaptar el fondo visual (degradados, partículas) según el estado del cielo.
- [ ] **Historial de búsquedas** — Guardar en `localStorage` las últimas ciudades consultadas para acceso rápido.
- [ ] **Mapa interactivo** — Integrar Leaflet.js para seleccionar la ciudad haciendo clic sobre un mapa.
- [ ] **PWA** — Añadir `manifest.json` y Service Worker para instalación y uso sin conexión.
- [ ] **Internacionalización (i18n)** — Soporte para múltiples idiomas en la interfaz.

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.

---

<div align="center">
  Desarrollado con ♥ usando tecnologías web nativas y las APIs gratuitas de <a href="https://open-meteo.com/">Open-Meteo</a>
</div>
