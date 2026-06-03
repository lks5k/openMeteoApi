/**
 * Códigos WMO → descripción en español + emoji.
 * @see https://open-meteo.com/en/docs#weathervariables
 */
export const WMO_CODES = {
  0: { texto: 'Cielo despejado', emoji: '☀️' },
  1: { texto: 'Mayormente despejado', emoji: '🌤️' },
  2: { texto: 'Parcialmente nublado', emoji: '⛅' },
  3: { texto: 'Cubierto', emoji: '☁️' },
  45: { texto: 'Niebla', emoji: '🌫️' },
  95: { texto: 'Tormenta eléctrica', emoji: '⛈️' },
};

/**
 * @param {number} codigo
 * @returns {{ texto: string, emoji: string }}
 */
export function resolverCodigo(codigo) {
  return WMO_CODES[codigo] ?? { texto: `Estado ${codigo}`, emoji: '🌡️' };
}
