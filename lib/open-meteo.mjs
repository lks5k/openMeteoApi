/**
 * Capa de acceso a las APIs de Open-Meteo (geocodificación + pronóstico).
 * Las URLs se construyen con encodeURIComponent para evitar inyección en query strings.
 */

const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast';

/**
 * @param {typeof fetch} fetchFn
 * @param {string} consulta
 * @param {number} [count=1]
 * @returns {Promise<{ ciudad: string, latitud: number, longitud: number }>}
 */
export async function geocodificarCiudad(fetchFn, consulta, count = 1) {
  const termino = consulta.split(',')[0].trim();
  const url = `${GEOCODING_BASE}?name=${encodeURIComponent(termino)}&count=${count}&language=es&format=json`;

  const res = await fetchFn(url);
  if (!res.ok) {
    throw new Error(`Error en la consulta de geolocalización: ${res.status}`);
  }

  const datos = await res.json();
  if (!datos.results?.length) {
    throw new Error(`No se encontró la ciudad "${termino}".`);
  }

  const mejor = datos.results[0];
  return {
    ciudad: mejor.name,
    latitud: mejor.latitude,
    longitud: mejor.longitude,
  };
}

/**
 * @param {typeof fetch} fetchFn
 * @param {number} latitud
 * @param {number} longitud
 * @returns {Promise<object>}
 */
export async function obtenerClimaPorCoordenadas(fetchFn, latitud, longitud) {
  const params = new URLSearchParams({
    latitude: String(latitud),
    longitude: String(longitud),
    current: 'temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,uv_index',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    forecast_days: '5',
    timezone: 'auto',
  });

  const res = await fetchFn(`${FORECAST_BASE}?${params}`);
  if (!res.ok) {
    throw new Error(`Error al obtener el clima: ${res.status}`);
  }

  return res.json();
}

/**
 * @param {typeof fetch} fetchFn
 * @param {string} nombreCiudad
 * @returns {Promise<{ ciudad: string, ubicacion: object, datos: object }>}
 */
export async function obtenerClima(fetchFn, nombreCiudad) {
  const ubicacion = await geocodificarCiudad(fetchFn, nombreCiudad);
  const datos = await obtenerClimaPorCoordenadas(
    fetchFn,
    ubicacion.latitud,
    ubicacion.longitud
  );
  return { ciudad: ubicacion.ciudad, ubicacion, datos };
}
