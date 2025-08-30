function getWeatherDescription(code) {
  const weatherMap = {
    0: { text: "Céu limpo", icon: "☀️" },
    1: { text: "Principalmente limpo", icon: "🌤️" },
    2: { text: "Parcialmente nublado", icon: "⛅" },
    3: { text: "Nublado", icon: "☁️" },
    45: { text: "Neblina", icon: "🌫️" },
    48: { text: "Neblina com gelo", icon: "🌫️" },
    51: { text: "Chuvisco fraco", icon: "🌦️" },
    53: { text: "Chuvisco moderado", icon: "🌦️" },
    55: { text: "Chuvisco intenso", icon: "🌧️" },
    61: { text: "Chuva fraca", icon: "🌦️" },
    63: { text: "Chuva moderada", icon: "🌧️" },
    65: { text: "Chuva forte", icon: "🌧️" },
    71: { text: "Neve fraca", icon: "❄️" },
    73: { text: "Neve moderada", icon: "❄️" },
    75: { text: "Neve forte", icon: "❄️" },
    80: { text: "Pancadas de chuva fraca", icon: "🌦️" },
    81: { text: "Pancadas de chuva moderada", icon: "🌧️" },
    82: { text: "Pancadas de chuva forte", icon: "🌧️" },
    95: { text: "Trovoada", icon: "⛈️" },
    96: { text: "Trovoada com granizo leve", icon: "🌩️" },
    99: { text: "Trovoada com granizo forte", icon: "🌩️" }
  };
  return weatherMap[code] || { text: "Clima desconhecido", icon: "❓" };
}

if (typeof fetch === "undefined") {
  global.fetch = require("node-fetch");
}

const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

async function getWeatherByCity(cityName) {
  try {
    if (!cityName || cityName.trim() === "") {
      return { erro: "Por favor, informe um nome de cidade válido." };
    }

    // Geocodificação
    const responseGeo = await fetch(
      `${GEO_API}?name=${encodeURIComponent(cityName)}&count=1&language=pt`
    );
    if (!responseGeo.ok) throw new Error("Erro ao buscar coordenadas.");

    const geoData = await responseGeo.json();
    if (!geoData.results?.length) {
      return { erro: "Cidade não encontrada." };
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Clima
    const responseWeather = await fetch(
      `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    if (!responseWeather.ok) throw new Error("Erro ao buscar dados do clima.");

    const weatherData = await responseWeather.json();
    if (!weatherData.current_weather) {
      return { erro: "Dados do clima não disponíveis." };
    }

    const { temperature, windspeed, winddirection, weathercode, time } =
      weatherData.current_weather;

    // Pegar descrição e ícone
    const { text, icon } = getWeatherDescription(weathercode);

    return {
      cidade: `${name}, ${country}`,
      temperatura: `${temperature}°C`,
      descricao: `${text} ${icon}`,
      vento: `${windspeed} km/h, direção ${winddirection}°`,
      atualizado_em: time
    };
  } catch (err) {
    return { erro: `Falha inesperada: ${err.message}` };
  }
}

/**
 * Obtém o clima de múltiplas cidades em paralelo.
 *
 * @param {string[]} cities - Lista de nomes de cidades.
 * @returns {Promise<Object[]>} Lista com os resultados de cada cidade.
 */
async function getWeatherForCities(cities) {
  if (!Array.isArray(cities) || cities.length === 0) {
    throw new Error("É necessário fornecer uma lista de cidades.");
  }

  const results = await Promise.all(
    cities.map(async (city) => {
      const data = await getWeatherByCity(city);
      return { cidade_consultada: city, ...data };
    })
  );

  return results;
}

export { getWeatherByCity, getWeatherForCities };
