/**
 * Obtiene el clima actual de una ciudad usando las APIs de Open-Meteo.
 *
 * Flujo:
 * 1. Convierte el nombre de la ciudad en coordenadas (latitud y longitud).
 * 2. Usa esas coordenadas para consultar el clima actual.
 * 3. Retorna un objeto JSON limpio con la información solicitada.
 *
 * @param {string} nombreCiudad - Nombre de la ciudad a consultar.
 * @returns {Promise<Object>} Promesa con los datos del clima.
 */
async function obtenerClima(nombreCiudad) {
  try {
    // =========================================================
    // 1. CONSULTAR COORDENADAS DE LA CIUDAD (GEOCODING API)
    // =========================================================

    const geocodingURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      nombreCiudad
    )}&count=1&language=es&format=json`;

    const geocodingResponse = await fetch(geocodingURL);

    if (!geocodingResponse.ok) {
      throw new Error(
        `Error en la consulta de geolocalización: ${geocodingResponse.status}`
      );
    }

    const geocodingData = await geocodingResponse.json();

    if (!geocodingData.results || geocodingData.results.length === 0) {
      throw new Error(`No se encontró la ciudad "${nombreCiudad}".`);
    }

    const ciudad   = geocodingData.results[0].name;
    const latitud  = geocodingData.results[0].latitude;
    const longitud = geocodingData.results[0].longitude;

    // =========================================================
    // 2. CONSULTAR CLIMA ACTUAL (WEATHER FORECAST API)
    // =========================================================

    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current=temperature_2m,weather_code`;

    const weatherResponse = await fetch(weatherURL);

    if (!weatherResponse.ok) {
      throw new Error(
        `Error en la consulta del clima: ${weatherResponse.status}`
      );
    }

    const weatherData = await weatherResponse.json();

    // =========================================================
    // 3. CONSTRUIR OBJETO FINAL
    // =========================================================

    return {
      ciudad:       ciudad,
      temperatura:  `${weatherData.current.temperature_2m} °C`,
      codigo_clima: `${weatherData.current.weather_code}`,
    };

  } catch (error) {
    console.error("Ocurrió un error:", error.message);
    // Re-lanza el error para que el llamador pueda manejarlo también
    throw error;
  }
}

// =========================================================
// EJEMPLO DE USO
// =========================================================

obtenerClima("Cali")
  .then((resultado) => {
    console.log("Clima actual:", resultado);
  })
  .catch(() => {
    console.error("No fue posible obtener el clima.");
  });
