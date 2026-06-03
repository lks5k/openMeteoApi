import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  geocodificarCiudad,
  obtenerClimaPorCoordenadas,
  obtenerClima,
} from '../lib/open-meteo.mjs';

/** @param {Record<string, unknown>} body */
function jsonResponse(body, ok = true, status = 200) {
  return {
    ok,
    status,
    async json() {
      return body;
    },
  };
}

describe('API Open-Meteo (fetch simulado)', () => {
  it('geocodificarCiudad lanza error si no hay resultados', async () => {
    const fetchMock = async () => jsonResponse({ results: [] });

    await assert.rejects(
      () => geocodificarCiudad(fetchMock, 'CiudadInexistenteXYZ'),
      /No se encontró la ciudad/
    );
  });

  it('geocodificarCiudad devuelve coordenadas del primer resultado', async () => {
    const fetchMock = async (url) => {
      assert.match(url, /geocoding-api\.open-meteo\.com/);
      assert.match(url, /name=Cali/);
      return jsonResponse({
        results: [
          { name: 'Cali', latitude: 3.45, longitude: -76.53, country: 'Colombia' },
        ],
      });
    };

    const loc = await geocodificarCiudad(fetchMock, 'Cali');
    assert.equal(loc.ciudad, 'Cali');
    assert.equal(loc.latitud, 3.45);
    assert.equal(loc.longitud, -76.53);
  });

  it('obtenerClimaPorCoordenadas propaga error HTTP', async () => {
    const fetchMock = async () => jsonResponse({}, false, 503);

    await assert.rejects(
      () => obtenerClimaPorCoordenadas(fetchMock, 3.45, -76.53),
      /Error al obtener el clima: 503/
    );
  });

  it('obtenerClima combina geocodificación y pronóstico', async () => {
    let llamadas = 0;
    const fetchMock = async (url) => {
      llamadas += 1;
      if (url.includes('geocoding-api')) {
        return jsonResponse({
          results: [{ name: 'Cali', latitude: 3.45, longitude: -76.53 }],
        });
      }
      return jsonResponse({
        current: { temperature_2m: 28, weather_code: 1 },
        daily: { time: ['2026-06-03'] },
      });
    };

    const resultado = await obtenerClima(fetchMock, 'Cali');
    assert.equal(llamadas, 2);
    assert.equal(resultado.ciudad, 'Cali');
    assert.equal(resultado.datos.current.temperature_2m, 28);
  });
});
