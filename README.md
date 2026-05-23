# Dashboard del Clima

Una aplicación web interactiva, moderna y minimalista que permite consultar el estado del tiempo en tiempo real para cualquier ciudad del mundo, con pronóstico de 5 días, autocompletado inteligente de ciudades, comparación simultánea de múltiples ciudades, caché local de datos y carrusel de imágenes de fondo obtenidas de Wikipedia.

---

## Resumen del Proyecto

**Dashboard del Clima** es una SPA (_Single-Page Application_) construida con tecnologías web nativas —sin frameworks ni dependencias externas— que consume APIs públicas y gratuitas para ofrecer información meteorológica actualizada, una experiencia visual inmersiva con fotografías representativas de cada ciudad y herramientas de comparación climatológica.

Al cargar, la app detecta automáticamente la ciudad del usuario mediante su dirección IP. El usuario puede refinar la búsqueda escribiendo el nombre de cualquier ciudad del mundo o activando el GPS del dispositivo. Toda la lógica, el renderizado y los estilos son gestionados íntegramente desde el navegador.

---

## Funcionalidades Clave

| Funcionalidad | Descripción |
|---|---|
| 🔍 **Búsqueda por ciudad** | Campo de texto con autocompletado en tiempo real (debounce de 300 ms). Muestra hasta 7 sugerencias con nombre, provincia y país. |
| 🕐 **Historial de búsquedas** | Al hacer foco en el input o borrarlo, muestra las últimas 5 ciudades consultadas. Persiste en `localStorage`. |
| ⌨️ **Navegación por teclado** | Las sugerencias del dropdown se recorren con `↑` `↓`, se confirman con `Enter` y se descartan con `Escape`. |
| 📍 **Botón "Usar ubicación actual"** | Solicita permiso de geolocalización al navegador (GPS) y resuelve el nombre de la ciudad mediante geocodificación inversa con Nominatim. |
| 🌡️ **Temperatura actual** | Temperatura en °C junto al emoji y descripción en español del estado del cielo (basado en códigos WMO). |
| 💧 **Humedad relativa** | Porcentaje de humedad del aire en el momento de la consulta. |
| 🌡️ **Sensación térmica** | Temperatura aparente percibida por el cuerpo (`apparent_temperature`). |
| 💨 **Viento con dirección** | Velocidad en km/h y punto cardinal de procedencia (N, NE, E, SE, S, SO, O, NO). |
| 🔆 **Índice UV** | Valor numérico con clasificación textual: Bajo / Moderado / Alto / Muy alto / Extremo. |
| 📅 **Pronóstico de 5 días** | Tarjetas diarias con emoji, temperatura máxima/mínima y probabilidad de lluvia (si > 0%). El primer día se etiqueta como "Hoy". |
| 🔄 **Actualización manual** | Botón de refresco junto a la hora de última consulta; invalida la caché y repite la petición sin recargar la página. |
| ⚡ **Caché de clima (1 hora)** | Los resultados de la API se almacenan en `localStorage` con una marca de tiempo. Consultas repetidas en la misma hora reutilizan los datos locales sin hacer fetch. El botón ↻ siempre fuerza datos frescos. |
| 🆚 **Comparación multi-ciudad** | Panel lateral que permite añadir hasta 6 ciudades y visualizarlas en tarjetas comparativas con temperatura, condición, humedad, sensación térmica, viento e índice UV. Usa `Promise.allSettled` para tolerancia a fallos individuales. |
| ➕ **Añadir al comparador** | Botón en la barra de búsqueda que agrega la ciudad actualmente visible al comparador con un clic, sin necesidad de escribirla de nuevo. |
| 🖼️ **Carrusel de imágenes** | Al cargar una ciudad, se obtienen fotografías representativas de Wikipedia (monumentos, paisajes, cultura). Las imágenes rotan automáticamente cada 60 segundos. |
| ◀▶ **Controles del carrusel** | Botones anterior/siguiente en la barra inferior para navegar manualmente entre imágenes. Al navegar, el temporizador se reinicia. |
| 📝 **Caption editorial** | Cada imagen muestra un pie de foto con el título de la fotografía, la ubicación de la ciudad (descripción de Wikipedia) y un extracto informativo del artículo. |
| 🌫️ **Glassmorphism** | El panel del dashboard usa `backdrop-filter: blur` sobre la imagen de fondo para legibilidad óptima con estética moderna. |
| 🌈 **Fondo dinámico meteorológico** | Cuando Wikipedia no dispone de imágenes, el fondo cambia con un gradiente según la condición del tiempo (soleado, nublado, lluvia, nieve, tormenta, niebla). |
| 🌙 **Modo oscuro** | Toggle claro/oscuro con persistencia en `localStorage`. Respeta automáticamente la preferencia del sistema operativo (`prefers-color-scheme`). |
| 🌐 **Detección por IP** | Al iniciar, la app consulta `ipapi.co` para obtener la ciudad del usuario sin intervención manual. |
| 📱 **Diseño responsive** | El layout se adapta a pantallas móviles (breakpoint en 620 px). |

---

## Instrucciones de Instalación y Configuración

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

## Guía de Uso

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

### Comparación de ciudades

1. Busca una ciudad con el buscador principal.
2. Pulsa el botón **"+ Comparar"** en la barra de búsqueda para añadirla a la lista.
3. Busca una segunda ciudad y repite el paso anterior (hasta 6 ciudades).
4. El panel de comparación se abre automáticamente al añadir la segunda ciudad.
5. Pulsa **"Ver comparativa"** para obtener el clima de todas en paralelo.
6. Para cerrar el panel y reiniciar la lista, vuelve a pulsar el botón **"Comparar"** (cuadrículas).

### Carrusel de imágenes

- Las imágenes de la ciudad activa aparecen automáticamente en el fondo al cabo de unos segundos.
- Usa los botones **‹** y **›** en la barra inferior para navegar entre fotografías.
- El contador muestra la posición actual (ej. `2 / 8`).
- Las imágenes rotan automáticamente cada 60 segundos; la navegación manual reinicia el temporizador.
- El caption inferior muestra el título de la fotografía, la ubicación y un párrafo informativo.

### Lectura del dashboard

- **Columna izquierda:** ciudad, fecha, emoji del estado, temperatura principal y descripción.
- **Columna derecha:** cuatro tarjetas de métricas (Humedad, Sensación Térmica, Viento, Índice UV).
- **Fila inferior:** cinco tarjetas de pronóstico diario con mínima y máxima.

---

## Información de la API

El proyecto consume **cinco fuentes de datos externas**, todas gratuitas y sin necesidad de API Key:

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
    &current=temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,uv_index
    &daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max
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

### 5. Wikipedia REST API — Imágenes de ciudades
Obtiene fotografías representativas y metadatos editoriales para el carrusel de fondo.

```
GET https://en.wikipedia.org/api/rest_v1/page/summary/{ciudad}
    → imagen principal, descripción y extracto del artículo

GET https://en.wikipedia.org/api/rest_v1/page/media-list/{titulo_canonico}
    → galería de imágenes del artículo (filtrada por showInGallery)
```

### Flujo interno de una petición

```
Input usuario
     │
     ├─ limpiarFondoCiudad()   ← detiene carrusel anterior
     ▼
buscarCandidatos()  ──►  Open-Meteo Geocoding API  (candidatos + coordenadas)
     │
     ▼
obtenerClimaPorCoordenadas()
     ├─ leerCache()            ← si hay datos válidos (<1 h), se usan sin fetch
     └─ fetch + escribirCache() ← si la caché expiró o no existe
     │
     ▼
renderizarDashboard()  ──►  Actualiza el DOM con los datos
     │
     ├─ actualizarBtnAgregarComparar()
     └─ cargarImagenesCiudad()  ──►  Wikipedia REST API  (imágenes + metadata)
                                      └─ mostrarImagenFondo() + iniciarCarrusel()
```

Los códigos de estado del cielo siguen el estándar **WMO** (World Meteorological Organization). El diccionario interno `WMO_CODES` los traduce al español con su emoji correspondiente, cubriendo desde cielo despejado (código 0) hasta tormentas severas con granizo (código 99).

---

## Sistema de Caché

Los datos meteorológicos se almacenan en `localStorage` con el formato:

```
Clave:  wc-{lat2}_{lon2}     (coordenadas redondeadas a 2 decimales ≈ 1.1 km)
Valor:  { timestamp: number, datos: object }
TTL:    3 600 000 ms (1 hora)
```

El botón de refresco ↻ invalida la entrada de caché antes del fetch para garantizar datos frescos cuando el usuario lo solicita explícitamente.

---

## Manejo de Errores

| Escenario | Comportamiento |
|---|---|
| Ciudad no encontrada | Muestra: _"No se encontró la ciudad 'X'."_ |
| Error HTTP en la API del clima | Muestra: _"Error al obtener el clima: [código HTTP]"_ |
| Error HTTP en la geocodificación | Muestra: _"Error de geocodificación: [código HTTP]"_ |
| Permiso de GPS denegado | Muestra: _"Permiso de ubicación denegado o tiempo de espera agotado."_ |
| Navegador sin soporte de geolocalización | Muestra: _"Tu navegador no soporta geolocalización."_ |
| ipapi.co no disponible al iniciar | Realiza un fallback automático a **Santiago de Cali** sin mostrar error al usuario. |
| Timeout de ipapi.co (> 4 s) | La petición es abortada con `AbortController` y se ejecuta el fallback silencioso. |
| `localStorage` con historial corrupto | `obtenerHistorial()` captura el error de parseo y devuelve `[]`; la app continúa sin historial. |
| `localStorage` lleno (caché) | `escribirCache()` falla silenciosamente; la app sigue funcionando sin caché. |
| Wikipedia sin imágenes para la ciudad | El carrusel no se activa; el fondo meteorológico wx-* continúa como fallback. |
| Fallo de red en Wikipedia | `cargarImagenesCiudad()` captura el error silenciosamente; no afecta el clima. |
| Ciudad con error en comparación | La tarjeta comparativa muestra el mensaje de error individual sin bloquear las demás ciudades. |

---

## Mejoras Futuras

- [x] **Modo oscuro** — Toggle claro/oscuro con persistencia en `localStorage` y respeto a `prefers-color-scheme`.
- [x] **Probabilidad de lluvia** — Porcentaje diario en las tarjetas del pronóstico (`precipitation_probability_max`).
- [x] **Dirección del viento** — Punto cardinal (N, NE, E…) calculado desde `wind_direction_10m`.
- [x] **Historial de búsquedas** — Últimas 5 ciudades consultadas, accesibles al enfocar el input.
- [x] **Indicador de actualización** — Hora de última consulta con botón de refresco sin recarga.
- [x] **Fondo dinámico meteorológico** — Gradiente del body adaptado a la condición meteorológica actual.
- [x] **Caché local de 1 hora** — Resultados almacenados en `localStorage`; el botón ↻ siempre fuerza fetch fresco.
- [x] **Comparación multi-ciudad** — Panel con hasta 6 ciudades consultadas en paralelo con `Promise.allSettled`.
- [x] **Botón "+ Comparar"** — Agrega la ciudad activa al comparador con un solo clic desde la barra de búsqueda.
- [x] **Carrusel de imágenes Wikipedia** — Fotografías curadas con rotación automática (60 s) y navegación manual.
- [x] **Glassmorphism** — `backdrop-filter: blur` en el dashboard para legibilidad óptima sobre las imágenes.
- [ ] **Unidades configurables** — Permitir cambiar entre °C / °F y km/h / mph.
- [ ] **Pronóstico horario** — Añadir una vista de las próximas 24 horas por franjas.
- [ ] **Calidad del aire (AQI)** — Integrar la API gratuita de calidad del aire de Open-Meteo.
- [ ] **Mapa interactivo** — Integrar Leaflet.js para seleccionar la ciudad haciendo clic sobre un mapa.
- [ ] **PWA** — Añadir `manifest.json` y Service Worker para instalación y uso sin conexión.
- [ ] **Internacionalización (i18n)** — Soporte para múltiples idiomas en la interfaz.

---

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.

---

<div align="center">
  Desarrollado con tecnologías web nativas y las APIs gratuitas de <a href="https://open-meteo.com/">Open-Meteo</a> y <a href="https://www.mediawiki.org/wiki/API:REST_API">Wikipedia REST API</a>
</div>
