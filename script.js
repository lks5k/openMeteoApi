/**
 * Punto de entrada CLI / Node para consultar el clima.
 * La lógica compartida y probada vive en lib/open-meteo.mjs.
 *
 * Uso: node script.js [ciudad]
 */
import { obtenerClima } from './lib/open-meteo.mjs';

const ciudad = process.argv[2] ?? 'Cali';

obtenerClima(fetch, ciudad)
  .then((resultado) => {
    const temp = resultado.datos.current.temperature_2m;
    const codigo = resultado.datos.current.weather_code;
    console.log('Clima actual:', {
      ciudad: resultado.ciudad,
      temperatura: `${temp} °C`,
      codigo_clima: String(codigo),
    });
  })
  .catch((err) => {
    console.error('No fue posible obtener el clima:', err.message);
    process.exitCode = 1;
  });
