/**
 * Utilidades puras compartidas entre la UI y las pruebas automatizadas.
 */

/**
 * @param {string} consulta
 * @returns {{ termino: string, paisHint: string|null }}
 */
export function parsearConsulta(consulta) {
  const partes = consulta.split(',').map((p) => p.trim());
  return { termino: partes[0], paisHint: partes[1] ?? null };
}

/**
 * Normaliza texto para comparaciones (sin tildes ni caracteres especiales).
 * @param {string} str
 * @returns {string}
 */
export function normalizar(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

/**
 * @param {number} grados
 * @returns {string}
 */
export function gradosACardinal(grados) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(grados / 45) % 8];
}

/**
 * @param {number} latitud
 * @param {number} longitud
 * @param {string} [prefijo='wc-']
 * @returns {string}
 */
export function claveCache(latitud, longitud, prefijo = 'wc-') {
  return `${prefijo}${latitud.toFixed(2)}_${longitud.toFixed(2)}`;
}
